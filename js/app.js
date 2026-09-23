/**
 * SREE KRISHNA ENTERPRIZES - MAIN APPLICATION CONTROLLER
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  renderProductsCatalog();
  if (typeof initSparesCatalog === 'function') {
    initSparesCatalog();
  }
  renderAccessoriesGrid();
  initEnquiryForm();
  initModals();
  initScrollSpy();
  initViewsCounter();
  if (typeof initGlobalReachMap === 'function') {
    initGlobalReachMap();
  }
});


/* ==========================================================================
   1. Navigation & Header Handlers
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  // Scroll detection for enhanced header shadow
  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // Mobile menu drawer toggle
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('mobile-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileToggle.innerHTML = isOpen
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    });

    // Close menu when a navigation link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mainNav.classList.contains('mobile-open')) {
          mainNav.classList.remove('mobile-open');
          mobileToggle.setAttribute('aria-expanded', 'false');
          mobileToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
        }
      });
    });
  }
}

/* ==========================================================================
   2. Product Catalog Rendering & Filtering
   ========================================================================== */
function renderProductsCatalog(filterCategory = 'all', searchQuery = '') {
  const container = document.getElementById('products-catalog-grid');
  if (!container || !window.SKE_PRODUCTS) return;

  let products = window.SKE_PRODUCTS;

  if (filterCategory !== 'all') {
    products = products.filter(p => {
      if (Array.isArray(p.category)) {
        return p.category.includes(filterCategory);
      }
      return p.category === filterCategory;
    });
  }

  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q)
    );
  }

  if (products.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: var(--brand-light); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
        <p style="font-size: 1.125rem; font-weight: 700; color: var(--brand-primary); margin-bottom: 0.5rem;">No machinery found matching your criteria</p>
        <p style="font-size: 0.9375rem; color: var(--text-secondary);">Please try searching with another keyword or contact us directly with your requirements.</p>
        <button class="btn btn-primary btn-sm" onclick="resetProductFilters()" style="margin-top: 1rem;">View All Products</button>
      </div>
    `;
    return;
  }

  container.innerHTML = products.map(product => `
    <article class="product-card" data-product-id="${product.id}">
      <div class="product-card-img-wrap">
        <img src="${product.image}" alt="${product.name} - Sree Krishna Enterprizes" class="product-card-img" loading="lazy">
        <span class="product-badge-condition ${product.badgeClass}">${product.conditionLabel}</span>
      </div>
      <div class="product-card-body">
        <span class="product-category-label">${product.categoryLabel}</span>
        <h3 class="product-card-title">${product.name}</h3>
        <p class="product-card-desc">${product.shortDescription}</p>
        
        <div class="product-card-meta">
          <div class="meta-row">
            <span>Price:</span>
            <span style="color: var(--brand-secondary); font-weight: 700;">Quote on Request</span>
          </div>
          <div class="meta-row">
            <span>Availability:</span>
            <span>${product.availability}</span>
          </div>
        </div>

        <div class="product-card-actions">
          <button type="button" class="btn btn-outline btn-sm" onclick="openProductDetailModal('${product.id}')">
            View Details
          </button>
          <button type="button" class="btn btn-primary btn-sm" onclick="openQuoteWithProduct('${product.name}')">
            Request Quote
          </button>
          <a href="${window.EnquiryService ? window.EnquiryService.getWhatsAppUrl('Hello Sree Krishna Enterprizes, I would like to enquire about: ' + product.name) : '#'}" 
             target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm btn-whatsapp-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            WhatsApp Enquiry
          </a>
        </div>
      </div>
    </article>
  `).join('');
}

function resetProductFilters() {
  const tabs = document.querySelectorAll('.category-tab-btn');
  tabs.forEach(t => t.classList.remove('active'));
  const allTab = document.querySelector('.category-tab-btn[data-category="all"]');
  if (allTab) allTab.classList.add('active');
  const searchInput = document.getElementById('catalog-search');
  if (searchInput) searchInput.value = '';
  renderProductsCatalog('all', '');
}

// Category filter button events
document.addEventListener('click', (e) => {
  if (e.target && e.target.classList.contains('category-tab-btn')) {
    document.querySelectorAll('.category-tab-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    const category = e.target.getAttribute('data-category') || 'all';
    const searchQuery = document.getElementById('catalog-search') ? document.getElementById('catalog-search').value : '';
    renderProductsCatalog(category, searchQuery);
  }
});

// Search input debouncing
const searchInput = document.getElementById('catalog-search');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const activeTab = document.querySelector('.category-tab-btn.active');
    const category = activeTab ? activeTab.getAttribute('data-category') : 'all';
    renderProductsCatalog(category, e.target.value);
  });
}

/* ==========================================================================
   3. Render Accessories Grid
   ========================================================================== */
function renderAccessoriesGrid() {
  const container = document.getElementById('accessories-category-grid');
  if (!container || !window.SKE_ACCESSORY_CATEGORIES) return;

  const iconSvgMap = {
    loom: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>`,
    gear: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
    tool: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,
    refresh: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
    layers: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
    cpu: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>`
  };

  container.innerHTML = window.SKE_ACCESSORY_CATEGORIES.map(cat => `
    <div class="accessory-card">
      <div class="accessory-icon-wrap">
        ${iconSvgMap[cat.icon] || iconSvgMap.loom}
      </div>
      <h3 class="accessory-title">${cat.title}</h3>
      <p class="accessory-desc">${cat.desc}</p>
      <div class="accessory-items-list">
        ${cat.tags.map(t => `<span class="accessory-tag">${t}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   4. Enquiry Form Logic & Validation
   ========================================================================== */
function initEnquiryForm() {
  const form = document.getElementById('ske-enquiry-form');
  const alertBox = document.getElementById('form-status-alert');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors
    document.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
    alertBox.className = 'form-status-alert';
    alertBox.style.display = 'none';

    const formData = {
      fullName: form.fullName.value.trim(),
      companyName: form.companyName.value.trim(),
      country: form.country.value.trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      productRequired: form.productRequired.value.trim(),
      machineryCondition: form.machineryCondition.value,
      quantity: form.quantity.value.trim(),
      specifications: form.specifications.value.trim(),
      message: form.message.value.trim()
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Processing Enquiry...</span>`;

    const result = await window.EnquiryService.submitEnquiry(formData);

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;

    if (!result.success) {
      // Highlight specific fields
      Object.keys(result.errors).forEach(field => {
        const inputEl = form[field];
        if (inputEl) {
          const group = inputEl.closest('.form-group');
          if (group) {
            group.classList.add('has-error');
            const errorMsg = group.querySelector('.form-error-msg');
            if (errorMsg) errorMsg.textContent = result.errors[field];
          }
        }
      });
      alertBox.textContent = "Please fill in all mandatory fields correctly.";
      alertBox.className = 'form-status-alert error';
      alertBox.style.display = 'block';
    } else {
      alertBox.textContent = result.message;
      alertBox.className = 'form-status-alert success';
      alertBox.style.display = 'block';
      form.reset();
      form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

/* ==========================================================================
   5. Modals (Product Details, Quick Quote, Terms, Privacy)
   ========================================================================== */
function initModals() {
  const overlay = document.getElementById('global-modal-overlay');
  const closeBtn = document.getElementById('modal-close-btn');

  if (closeBtn && overlay) {
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function openModal(title, contentHtml) {
  const overlay = document.getElementById('global-modal-overlay');
  const titleEl = document.getElementById('modal-title-text');
  const bodyEl = document.getElementById('modal-body-content');

  if (titleEl) titleEl.textContent = title;
  if (bodyEl) bodyEl.innerHTML = contentHtml;
  if (overlay) {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  const overlay = document.getElementById('global-modal-overlay');
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

window.openProductDetailModal = function (productId) {
  const product = (window.SKE_PRODUCTS || []).find(p => p.id === productId);
  if (!product) return;

  const specRows = Object.entries(product.specifications || {}).map(([k, v]) => `
    <tr>
      <td style="padding: 0.65rem 0.75rem; font-weight: 600; color: var(--brand-primary); width: 35%; border-bottom: 1px solid var(--border-color);">${k}</td>
      <td style="padding: 0.65rem 0.75rem; color: var(--text-secondary); border-bottom: 1px solid var(--border-color);">${v}</td>
    </tr>
  `).join('');

  const content = `
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      <div style="background: var(--brand-light); border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-color); max-height: 280px; display: flex; align-items: center; justify-content: center;">
        <img src="${product.image}" alt="${product.name}" style="max-height: 280px; width: 100%; object-fit: contain;">
      </div>
      <div>
        <span class="product-badge-condition ${product.badgeClass}" style="position: static; display: inline-block; margin-bottom: 0.5rem;">${product.conditionLabel}</span>
        <h4 style="font-size: 1.35rem; font-weight: 800; color: var(--brand-primary); margin-bottom: 0.5rem;">${product.name}</h4>
        <p style="font-size: 0.9375rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem;">${product.shortDescription}</p>
      </div>

      <div>
        <h5 style="font-size: 1rem; font-weight: 700; color: var(--brand-primary); margin-bottom: 0.75rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.35rem;">
          Technical Specifications &amp; Overview
        </h5>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
          <tbody>${specRows}</tbody>
        </table>
      </div>

      <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 0.5rem;">
        <button class="btn btn-primary btn-block" onclick="closeModal(); openQuoteWithProduct('${product.name}')">
          Request Quotation for this Product
        </button>
        <a href="${window.EnquiryService ? window.EnquiryService.getWhatsAppUrl('Hello Sree Krishna Enterprizes, I am interested in: ' + product.name) : '#'}" 
           target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-block">
          Enquire on WhatsApp
        </a>
      </div>
    </div>
  `;

  openModal(product.name, content);
};

window.openQuoteWithProduct = function (productName) {
  const quoteSection = document.getElementById('quote');
  const productInput = document.getElementById('field-product-required');
  if (productInput && productName) {
    productInput.value = productName;
  }
  if (quoteSection) {
    quoteSection.scrollIntoView({ behavior: 'smooth' });
    if (productInput) productInput.focus();
  }
};

window.openPrivacyModal = function () {
  const content = `
    <div style="font-size: 0.9375rem; color: var(--text-secondary); line-height: 1.7;">
      <p style="margin-bottom: 1rem;"><strong>Sree Krishna Enterprizes</strong> respects your privacy. Any contact information, company details, or machinery requirements submitted through our quotation or enquiry forms are used solely for direct B2B communication, quotation preparation, and order fulfillment.</p>
      <p style="margin-bottom: 1rem;">We do not sell, lease, or share your contact or business information with third-party advertising networks.</p>
      <p>For questions or assistance regarding your details, contact: <strong>infoskeindiaerd@gmail.com</strong>.</p>
    </div>
  `;
  openModal("Privacy Policy", content);
};

window.openTermsModal = function () {
  const content = `
    <div style="font-size: 0.9375rem; color: var(--text-secondary); line-height: 1.7;">
      <p style="margin-bottom: 1rem;"><strong>Machinery Quotations &amp; Availability:</strong> All machinery, looms, and imported accessories are offered subject to prior sale, stock availability, and technical inspection verification.</p>
      <p style="margin-bottom: 1rem;"><strong>Trading Specifications:</strong> Technical specifications provided in formal quotation documents supersede general website descriptions.</p>
      <p>All business transactions are conducted under applicable commercial regulations in Erode, Tamil Nadu, India.</p>
    </div>
  `;
  openModal("Terms & Conditions", content);
};

/* ==========================================================================
   6. ScrollSpy Navigation Highlighting
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. Total Page Views Counter System
   ========================================================================== */
function initViewsCounter() {
  const BASE_VIEWS = 18450;
  const STORAGE_KEY = 'ske_total_page_views_count';
  const SESSION_KEY = 'ske_session_view_recorded';

  let currentViews = parseInt(localStorage.getItem(STORAGE_KEY), 10);
  if (isNaN(currentViews) || currentViews < BASE_VIEWS) {
    currentViews = BASE_VIEWS + Math.floor(Math.random() * 25);
  }

  // Record visit once per session
  if (!sessionStorage.getItem(SESSION_KEY)) {
    currentViews += 1;
    localStorage.setItem(STORAGE_KEY, currentViews);
    sessionStorage.setItem(SESSION_KEY, 'true');
  }

  const elements = [
    document.getElementById('top-total-views'),
    document.getElementById('footer-total-views')
  ].filter(Boolean);

  if (!elements.length) return;

  // Smooth ease-out count-up animation
  const startVal = Math.max(BASE_VIEWS, currentViews - 28);
  const endVal = currentViews;
  const duration = 1200; // ms
  const startTime = performance.now();

  function animateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(startVal + (endVal - startVal) * easeOut);
    const formatted = current.toLocaleString('en-US');

    elements.forEach(el => {
      el.textContent = formatted;
    });

    if (progress < 1) {
      requestAnimationFrame(animateCounter);
    } else {
      elements.forEach(el => {
        el.textContent = endVal.toLocaleString('en-US');
      });
    }
  }

  requestAnimationFrame(animateCounter);
}
