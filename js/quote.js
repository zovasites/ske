/**
 * SKE India – Quote Request: Modal + Form Controller
 * ---------------------------------------------------
 * Single source of truth for all "Request a Quote" interactions.
 * Handles both the modal form (#quote-modal-form) and the
 * on-page enquiry form (#ske-enquiry-form).
 *
 * FIX HISTORY
 * -----------
 * v2 (2026-09-29):
 *   - Removed duplicate submit handler that was also registered in app.js
 *     (initEnquiryForm). That caused double-firing / glitching on every submit.
 *   - Removed redundant event listeners on a[href="#quote"] and
 *     [data-open-quote-modal] buttons that already carry onclick="openQuoteModal()"
 *     — stacking listeners caused the modal to open twice / flicker.
 *   - Fixed isSubmitting guard to cover both forms with one flag.
 *   - Added proper aria-hidden management on modal open/close.
 */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     State
  ------------------------------------------------------------------ */
  let isSubmitting = false;

  /* ------------------------------------------------------------------
     DOM references (resolved after DOMContentLoaded)
  ------------------------------------------------------------------ */
  let modalOverlay, modalCloseBtn, modalForm, modalAlert;
  let onPageForm, onPageAlert;

  /* ==================================================================
     PUBLIC API
  ================================================================== */

  /**
   * Open the quote modal, optionally pre-filling a product.
   * @param {string} [productName]
   */
  window.openQuoteModal = function (productName) {
    if (!modalOverlay) return;

    // Reset alerts
    _resetAlert(modalAlert);

    // Clear validation highlights
    if (modalForm) {
      modalForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
    }

    // Pre-fill product if given
    if (productName && modalForm) {
      const sel = modalForm.querySelector('[name="productService"]');
      if (sel) {
        let matched = false;
        for (let i = 0; i < sel.options.length; i++) {
          if (sel.options[i].value.toLowerCase() === productName.toLowerCase()) {
            sel.selectedIndex = i;
            matched = true;
            break;
          }
        }
        if (!matched) {
          const otherOpt = Array.from(sel.options).find(o =>
            o.value.toLowerCase().includes('other')
          );
          if (otherOpt) sel.value = otherOpt.value;
          const msgEl = modalForm.querySelector('[name="message"]');
          if (msgEl && !msgEl.value) {
            msgEl.value = `Interested in quote for: ${productName}`;
          }
        }
      }
    }

    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus first field
    setTimeout(() => {
      const first = modalOverlay.querySelector('input[name="fullName"]');
      if (first) first.focus();
    }, 120);
  };

  /**
   * Close the quote modal.
   */
  window.closeQuoteModal = function () {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  /**
   * Open quote modal AND pre-fill the on-page form if present.
   * Called from product cards: openQuoteWithProduct('Airjet Loom')
   */
  window.openQuoteWithProduct = function (productName) {
    window.openQuoteModal(productName);
    if (onPageForm) {
      const el =
        onPageForm.querySelector('[name="productService"]') ||
        onPageForm.querySelector('[name="productRequired"]');
      if (el) el.value = productName;
    }
  };

  /* ==================================================================
     VALIDATION
  ================================================================== */

  function _validate(data) {
    const errors = {};
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneClean = (data.phone || '').replace(/[^0-9]/g, '');

    if (!data.fullName || data.fullName.trim().length < 2) {
      errors.fullName = 'Please enter your full name.';
    }
    if (!data.phone || phoneClean.length < 6) {
      errors.phone = 'Please provide a valid phone or WhatsApp number.';
    }
    if (!data.email || !emailRx.test(data.email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }
    if (!data.productService || data.productService.trim().length < 2) {
      errors.productService = 'Please select or specify the product or service.';
    }
    if (!data.message || data.message.trim().length < 4) {
      errors.message = 'Please describe your requirements.';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }

  /* ==================================================================
     SUBMIT
  ================================================================== */

  async function _submit(formData, formEl, alertEl) {
    // Guard: prevent concurrent / duplicate submissions
    if (isSubmitting) return;

    // Clear previous state
    formEl.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
    _resetAlert(alertEl);

    // Client-side validation
    const validation = _validate(formData);
    if (!validation.isValid) {
      Object.keys(validation.errors).forEach(field => {
        const inputEl = formEl.querySelector(`[name="${field}"]`);
        if (inputEl) {
          const group = inputEl.closest('.form-group');
          if (group) {
            group.classList.add('has-error');
            const errSpan = group.querySelector('.form-error-msg');
            if (errSpan) errSpan.textContent = validation.errors[field];
          }
        }
      });
      _showAlert(alertEl, 'error', 'Please fill in all mandatory fields (*) marked above.');
      // Focus first errored field
      const firstErr = formEl.querySelector('.form-group.has-error input, .form-group.has-error select, .form-group.has-error textarea');
      if (firstErr) firstErr.focus();
      return;
    }

    // Lock UI
    isSubmitting = true;
    const submitBtn = formEl.querySelector('button[type="submit"]');
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      submitBtn.innerHTML = `
        <span class="btn-spinner"></span>
        <span>Submitting...</span>
      `;
    }

    // Endpoint fallback chain (primary → Formspree)
    const endpoints = ['/api/quote', 'api/quote.php'];
    let submitted = false;
    let serverMessage = '';

    for (const endpoint of endpoints) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        let result = null;
        try { result = await res.json(); } catch (_) { /* non-JSON response */ }

        if (res.ok && result && result.success) {
          submitted = true;
          serverMessage = result.message || '';
          break;
        } else if (res.status === 400 && result && result.message) {
          serverMessage = result.message;
          break;
        }
      } catch (err) {
        console.warn(`[SKE Quote] Attempt at ${endpoint} failed:`, err.message);
      }
    }

    // If all serverless endpoints fail, try Formspree directly as last resort
    if (!submitted) {
      try {
        const fsRes = await fetch('https://formspree.io/f/xaendkbd', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            '_subject': 'New Request for Quote – SKE India',
            'Full Name': formData.fullName,
            'Company Name': formData.companyName || '—',
            'Phone': formData.phone,
            'Email': formData.email,
            'Product / Service': formData.productService,
            'Quantity': formData.quantity || '—',
            'Message': formData.message,
            '_replyto': formData.email
          })
        });
        if (fsRes.ok) {
          submitted = true;
        }
      } catch (err) {
        console.warn('[SKE Quote] Formspree fallback failed:', err.message);
      }
    }

    // Restore button
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      submitBtn.innerHTML = originalBtnHtml;
    }
    isSubmitting = false;

    // Feedback
    if (submitted) {
      _showAlert(
        alertEl,
        'success',
        'Thank you! Your quote request has been submitted successfully. Our team will contact you shortly.'
      );
      formEl.reset();

      // Auto-close modal after 4 s
      if (formEl === modalForm) {
        setTimeout(() => {
          if (modalOverlay && modalOverlay.classList.contains('open')) {
            window.closeQuoteModal();
          }
        }, 4000);
      } else {
        alertEl && alertEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    } else {
      _showAlert(
        alertEl,
        'error',
        serverMessage || 'Unable to submit your request right now. Please try again or contact us via WhatsApp.'
      );
    }
  }

  /* ==================================================================
     HELPERS
  ================================================================== */

  function _resetAlert(el) {
    if (!el) return;
    el.className = 'form-status-alert';
    el.style.display = 'none';
    el.textContent = '';
  }

  function _showAlert(el, type, message) {
    if (!el) return;
    el.textContent = message;
    el.className = `form-status-alert ${type}`;
    el.style.display = 'block';
  }

  function _readForm(formEl) {
    const g = name => {
      const el = formEl.querySelector(`[name="${name}"]`);
      return el ? el.value.trim() : '';
    };
    return {
      fullName:       g('fullName'),
      companyName:    g('companyName'),
      phone:          g('phone'),
      email:          g('email'),
      productService: g('productService') || g('productRequired'),
      quantity:       g('quantity'),
      message:        g('message')
    };
  }

  /* ==================================================================
     INITIALISE
  ================================================================== */

  function init() {
    modalOverlay  = document.getElementById('quote-modal-overlay');
    modalCloseBtn = document.getElementById('quote-modal-close-btn');
    modalForm     = document.getElementById('quote-modal-form');
    modalAlert    = document.getElementById('quote-modal-alert');
    onPageForm    = document.getElementById('ske-enquiry-form');
    onPageAlert   = document.getElementById('form-status-alert');

    /* -- Modal close handlers -- */
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', window.closeQuoteModal);
    }
    if (modalOverlay) {
      modalOverlay.setAttribute('aria-hidden', 'true');
      modalOverlay.addEventListener('click', e => {
        if (e.target === modalOverlay) window.closeQuoteModal();
      });
    }
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
        window.closeQuoteModal();
      }
    });

    /* -- Modal form submission -- */
    if (modalForm) {
      modalForm.addEventListener('submit', e => {
        e.preventDefault();
        _submit(_readForm(modalForm), modalForm, modalAlert);
      });
    }

    /* -- On-page enquiry form submission -- */
    if (onPageForm) {
      onPageForm.addEventListener('submit', e => {
        e.preventDefault();
        _submit(_readForm(onPageForm), onPageForm, onPageAlert);
      });
    }

    /* -- NOTE: We do NOT re-bind [data-open-quote-modal] or a[href="#quote"]
          buttons here. Those already carry onclick="openQuoteModal()" in the
          HTML. Adding event listeners on top would cause double-open / flicker. -- */
  }

  /* Run after DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
