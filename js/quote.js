/**
 * SKE India - Quote Request Modal & Form Controller
 * -------------------------------------------------------------
 * Handles:
 * - Opening/Closing responsive Quote Modal
 * - Form validation (Client-side)
 * - Duplicate submission prevention
 * - Secure API dispatch (no client credentials)
 * - User experience feedback messages
 * -------------------------------------------------------------
 */

(function () {
  'use strict';

  // State
  let isSubmitting = false;

  // DOM Elements
  const modalOverlay = document.getElementById('quote-modal-overlay');
  const modalCloseBtn = document.getElementById('quote-modal-close-btn');
  const modalForm = document.getElementById('quote-modal-form');
  const modalAlert = document.getElementById('quote-modal-alert');

  const onPageForm = document.getElementById('ske-enquiry-form');
  const onPageAlert = document.getElementById('form-status-alert');

  /**
   * Open Quote Modal
   * @param {string} [productName] - Optional product to pre-select
   */
  window.openQuoteModal = function (productName) {
    if (!modalOverlay) return;

    // Reset previous alerts
    if (modalAlert) {
      modalAlert.className = 'form-status-alert';
      modalAlert.style.display = 'none';
      modalAlert.textContent = '';
    }

    // Clear error highlights
    if (modalForm) {
      modalForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
    }

    // Pre-fill product if provided
    if (productName && modalForm) {
      const productSelect = modalForm.querySelector('[name="productService"]');
      if (productSelect) {
        // Check if option exists
        let found = false;
        for (let i = 0; i < productSelect.options.length; i++) {
          if (productSelect.options[i].value.toLowerCase() === productName.toLowerCase()) {
            productSelect.selectedIndex = i;
            found = true;
            break;
          }
        }
        if (!found) {
          // If custom product name not in options, select 'Other' and pre-fill message
          const otherOpt = Array.from(productSelect.options).find(o => o.value.toLowerCase().includes('other'));
          if (otherOpt) productSelect.value = otherOpt.value;
          const msgInput = modalForm.querySelector('[name="message"]');
          if (msgInput && !msgInput.value) {
            msgInput.value = `Interested in quote for: ${productName}`;
          }
        }
      }
    }

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus on first input
    setTimeout(() => {
      const firstInput = modalOverlay.querySelector('input[name="fullName"]');
      if (firstInput) firstInput.focus();
    }, 100);
  };

  /**
   * Close Quote Modal
   */
  window.closeQuoteModal = function () {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  /**
   * Helper to open quote with specific product from anywhere on the page
   */
  window.openQuoteWithProduct = function (productName) {
    window.openQuoteModal(productName);

    // Also update on-page form if present
    if (onPageForm) {
      const onPageProduct = onPageForm.querySelector('[name="productService"]') || onPageForm.querySelector('[name="productRequired"]');
      if (onPageProduct) onPageProduct.value = productName;
    }
  };

  /**
   * Validate Form Fields
   */
  function validateQuoteData(data) {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneClean = (data.phone || '').replace(/[^0-9]/g, '');

    if (!data.fullName || data.fullName.trim().length < 2) {
      errors.fullName = 'Please enter your full name.';
    }

    if (!data.phone || phoneClean.length < 6) {
      errors.phone = 'Please provide a valid phone or WhatsApp number.';
    }

    if (!data.email || !emailRegex.test(data.email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }

    if (!data.productService || data.productService.trim().length < 2) {
      errors.productService = 'Please select or specify the product or service.';
    }

    if (!data.message || data.message.trim().length < 4) {
      errors.message = 'Please describe your requirements or enquiry details.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Submit Quote Request to Secure Backend API
   */
  async function submitQuoteRequest(formData, formEl, alertEl) {
    if (isSubmitting) return;

    // Clear previous errors
    formEl.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
    if (alertEl) {
      alertEl.className = 'form-status-alert';
      alertEl.style.display = 'none';
      alertEl.textContent = '';
    }

    // Validate client-side
    const validation = validateQuoteData(formData);
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
      if (alertEl) {
        alertEl.textContent = 'Please fill in all mandatory fields (*) marked above.';
        alertEl.className = 'form-status-alert error';
        alertEl.style.display = 'block';
      }
      return;
    }

    // Set submitting state & prevent duplicates
    isSubmitting = true;
    const submitBtn = formEl.querySelector('button[type="submit"]');
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'SUBMIT QUOTE REQUEST';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      submitBtn.innerHTML = `
        <span class="btn-spinner"></span>
        <span>Submitting Quote Request...</span>
      `;
    }

    // Try primary endpoint first, then fallbacks if needed
    const endpoints = ['/api/quote', 'api/quote.php', 'api/enquiry.php', '/api/enquiry'];
    let submissionSuccess = false;
    let responseMessage = '';

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const result = await response.json().catch(() => null);

        if (response.ok && result && result.success) {
          submissionSuccess = true;
          responseMessage = result.message || 'Thank you! Your quote request has been submitted successfully. Our team will contact you shortly.';
          break;
        } else if (response.status === 400 && result && result.message) {
          // Validation error from server
          responseMessage = result.message;
          break;
        }
      } catch (err) {
        // Try next endpoint in array
        console.warn(`Attempt at ${endpoint} failed, trying next...`, err);
      }
    }

    // Reset button state
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      submitBtn.innerHTML = originalBtnHtml;
    }
    isSubmitting = false;

    if (submissionSuccess) {
      if (alertEl) {
        alertEl.textContent = 'Thank you! Your quote request has been submitted successfully. Our team will contact you shortly.';
        alertEl.className = 'form-status-alert success';
        alertEl.style.display = 'block';
      }
      formEl.reset();

      // If submitted in modal, auto-close after 3 seconds or allow user to close
      if (formEl === modalForm) {
        setTimeout(() => {
          if (modalOverlay && modalOverlay.classList.contains('open')) {
            window.closeQuoteModal();
          }
        }, 4000);
      } else {
        alertEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    } else {
      if (alertEl) {
        alertEl.textContent = responseMessage || 'Unable to submit your request. Please try again.';
        alertEl.className = 'form-status-alert error';
        alertEl.style.display = 'block';
      }
    }
  }

  /**
   * Bind Form Submissions & Event Listeners
   */
  function initQuoteEvents() {
    // 1. Connect all "Request a Quote" buttons to open the modal
    document.querySelectorAll('[data-open-quote-modal], a[href="#quote"], .btn-request-quote').forEach(btn => {
      // Don't override if inside footer legal or inside the form itself
      if (btn.closest('form')) return;

      btn.addEventListener('click', (e) => {
        // If it's a quote button, open modal
        e.preventDefault();
        window.openQuoteModal();
      });
    });

    // 2. Modal Close handlers
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', window.closeQuoteModal);
    }
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) window.closeQuoteModal();
      });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
        window.closeQuoteModal();
      }
    });

    // 3. Modal Form Submission
    if (modalForm) {
      modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
          fullName: (modalForm.fullName ? modalForm.fullName.value : '').trim(),
          companyName: (modalForm.companyName ? modalForm.companyName.value : '').trim(),
          phone: (modalForm.phone ? modalForm.phone.value : '').trim(),
          email: (modalForm.email ? modalForm.email.value : '').trim(),
          productService: (modalForm.productService ? modalForm.productService.value : '').trim(),
          quantity: (modalForm.quantity ? modalForm.quantity.value : '').trim(),
          message: (modalForm.message ? modalForm.message.value : '').trim()
        };
        submitQuoteRequest(data, modalForm, modalAlert);
      });
    }

    // 4. On-Page Quote Form Submission (#ske-enquiry-form)
    if (onPageForm) {
      onPageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
          fullName: (onPageForm.fullName ? onPageForm.fullName.value : '').trim(),
          companyName: (onPageForm.companyName ? onPageForm.companyName.value : '').trim(),
          phone: (onPageForm.phone ? onPageForm.phone.value : '').trim(),
          email: (onPageForm.email ? onPageForm.email.value : '').trim(),
          productService: (onPageForm.productService ? onPageForm.productService.value : (onPageForm.productRequired ? onPageForm.productRequired.value : '')).trim(),
          quantity: (onPageForm.quantity ? onPageForm.quantity.value : '').trim(),
          message: (onPageForm.message ? onPageForm.message.value : '').trim()
        };
        submitQuoteRequest(data, onPageForm, onPageAlert);
      });
    }
  }

  // Initialize once DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuoteEvents);
  } else {
    initQuoteEvents();
  }
})();
