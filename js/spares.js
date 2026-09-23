/**
 * SREE KRISHNA ENTERPRIZES - SPARES CATALOGUE CONTROLLER
 * Manages Vertical Brand Flow & Interactive Brand-Specific Page Viewer
 */

let currentBrand = null;
let currentPageIndex = 0;
let currentZoom = 1.0;
let isDragging = false;
let startX, startY, scrollLeft, scrollTop;

function initSparesCatalog() {
  const brandListContainer = document.getElementById('spares-brand-flow-list');
  const searchInput = document.getElementById('spares-search-input');
  const backBtn = document.getElementById('spares-back-to-brands-btn');
  const prevBtn = document.getElementById('spares-prev-page-btn');
  const nextBtn = document.getElementById('spares-next-page-btn');
  const zoomInBtn = document.getElementById('spares-zoom-in-btn');
  const zoomOutBtn = document.getElementById('spares-zoom-out-btn');
  const zoomResetBtn = document.getElementById('spares-zoom-reset-btn');
  const fullscreenBtn = document.getElementById('spares-fullscreen-btn');
  const viewerStage = document.getElementById('spares-viewer-stage');

  if (!brandListContainer || !window.SKE_SPARES_DATA) return;

  // Render initial vertical brand list
  renderSparesBrandList();

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderSparesBrandList(e.target.value);
    });
  }

  // Back to Brands button
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeBrandViewer();
    });
  }

  // Pagination Prev / Next
  if (prevBtn) {
    prevBtn.addEventListener('click', () => changeSparesPage(-1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => changeSparesPage(1));
  }

  // Zoom controls
  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => setZoom(currentZoom + 0.25));
  }
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => setZoom(currentZoom - 0.25));
  }
  if (zoomResetBtn) {
    zoomResetBtn.addEventListener('click', () => setZoom(1.0));
  }
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', toggleViewerFullscreen);
  }

  // Pan / Dragging when zoomed
  if (viewerStage) {
    viewerStage.addEventListener('mousedown', (e) => {
      if (currentZoom <= 1.0) return;
      isDragging = true;
      viewerStage.classList.add('grabbing');
      startX = e.pageX - viewerStage.offsetLeft;
      startY = e.pageY - viewerStage.offsetTop;
      scrollLeft = viewerStage.scrollLeft;
      scrollTop = viewerStage.scrollTop;
    });

    viewerStage.addEventListener('mouseleave', () => {
      isDragging = false;
      viewerStage.classList.remove('grabbing');
    });

    viewerStage.addEventListener('mouseup', () => {
      isDragging = false;
      viewerStage.classList.remove('grabbing');
    });

    viewerStage.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - viewerStage.offsetLeft;
      const y = e.pageY - viewerStage.offsetTop;
      const walkX = (x - startX) * 1.5;
      const walkY = (y - startY) * 1.5;
      viewerStage.scrollLeft = scrollLeft - walkX;
      viewerStage.scrollTop = scrollTop - walkY;
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const viewer = document.getElementById('spares-viewer-view');
    if (!viewer || viewer.classList.contains('hidden')) return;

    if (e.key === 'ArrowLeft') {
      changeSparesPage(-1);
    } else if (e.key === 'ArrowRight') {
      changeSparesPage(1);
    } else if (e.key === 'Escape') {
      closeBrandViewer();
    }
  });
}

/**
 * 1. Render the Vertical Brand Selection List (Flow Menu)
 */
function renderSparesBrandList(searchQuery = '') {
  const container = document.getElementById('spares-brand-flow-list');
  if (!container || !window.SKE_SPARES_DATA) return;

  let brands = window.SKE_SPARES_DATA;

  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    const cleanQ = q.replace(/[\s\-_]/g, '');
    const matches = (str) => {
      if (!str) return false;
      const lower = str.toLowerCase();
      return lower.includes(q) || (cleanQ.length > 1 && lower.replace(/[\s\-_]/g, '').includes(cleanQ));
    };

    brands = brands.filter(b => 
      matches(b.name) ||
      matches(b.category) ||
      matches(b.description) ||
      b.pages.some(p => matches(p.title) || matches(p.subtitle))
    );
  }

  if (brands.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2.5rem 1rem; background: #ffffff; border-radius: 12px; border: 1.5px dashed #cbd5e1;">
        <p style="font-weight: 700; color: #0f172a; margin-bottom: 0.25rem;">No spare-parts brand found matching your search</p>
        <p style="font-size: 0.875rem; color: #64748b;">Try searching for Picanol, Somet, Vamatex, Airjet, Tapes, Temple Ring, etc.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = brands.map((brand, idx) => {
    const num = String(idx + 1).padStart(2, '0');
    return `
      <div class="spares-brand-card" role="button" tabindex="0" onclick="openSparesBrand('${brand.id}')" onkeydown="if(event.key==='Enter') openSparesBrand('${brand.id}')" aria-label="View ${brand.name} spare parts catalogue">
        <div class="spares-brand-num">${num}</div>
        <div class="spares-brand-info">
          <div class="spares-brand-header-line">
            <h3 class="spares-brand-name">${brand.name}</h3>
            <span class="spares-brand-badge">${brand.badge}</span>
          </div>
          <p class="spares-brand-desc">${brand.description}</p>
        </div>
        <div class="spares-brand-action">
          <span>View Catalogue</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * 2. Open Brand View - Shows ONLY the selected brand's pages
 */
function openSparesBrand(brandId) {
  const brand = window.SKE_SPARES_DATA.find(b => b.id === brandId);
  if (!brand) return;

  currentBrand = brand;
  currentPageIndex = 0;
  currentZoom = 1.0;

  const listView = document.getElementById('spares-brand-list-view');
  const viewerView = document.getElementById('spares-viewer-view');

  if (listView && viewerView) {
    listView.classList.add('hidden');
    viewerView.classList.remove('hidden');
  }

  // Populate brand metadata in viewer
  document.getElementById('spares-viewer-brand-title').textContent = brand.name;
  document.getElementById('spares-viewer-category-tag').textContent = `${brand.category} • ${brand.badge}`;

  // Render Sub-model Pills
  renderSubmodelPills();

  // Render Current Page
  renderCurrentPage();

  // Smooth scroll into viewer
  const sparesSection = document.getElementById('spares');
  if (sparesSection) {
    sparesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * 3. Close Brand Viewer & Return to Vertical Brand Flow Menu
 */
function closeBrandViewer() {
  const listView = document.getElementById('spares-brand-list-view');
  const viewerView = document.getElementById('spares-viewer-view');

  if (viewerView) {
    viewerView.classList.remove('fullscreen-mode');
    viewerView.classList.add('hidden');
  }
  if (listView) {
    listView.classList.remove('hidden');
  }

  currentBrand = null;
  currentPageIndex = 0;
  currentZoom = 1.0;

  // Scroll back to spares section smoothly
  const sparesSection = document.getElementById('spares');
  if (sparesSection) {
    sparesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * 4. Render Sub-model Pills (Tabs for Multi-page Brands)
 */
function renderSubmodelPills() {
  const pillContainer = document.getElementById('spares-submodel-nav');
  if (!pillContainer || !currentBrand) return;

  if (currentBrand.pages.length <= 1) {
    pillContainer.style.display = 'none';
    return;
  }

  pillContainer.style.display = 'flex';
  pillContainer.innerHTML = currentBrand.pages.map((page, idx) => `
    <button type="button" class="spares-submodel-pill ${idx === currentPageIndex ? 'active' : ''}" onclick="goToSparesPage(${idx})">
      <span>${page.title}</span>
      <span class="spares-pill-num">(Pg ${idx + 1})</span>
    </button>
  `).join('');
}

/**
 * 5. Render Current Page Image & Metadata
 */
function renderCurrentPage() {
  if (!currentBrand || !currentBrand.pages[currentPageIndex]) return;

  const page = currentBrand.pages[currentPageIndex];
  const totalPages = currentBrand.pages.length;

  // Update Image
  const imgEl = document.getElementById('spares-page-image');
  if (imgEl) {
    imgEl.src = page.image;
    imgEl.alt = `${currentBrand.name} - ${page.title} Spare Parts Catalogue`;
  }

  // Update Page Title & Subtitle
  const pageTitleEl = document.getElementById('spares-page-title');
  const pageSubtitleEl = document.getElementById('spares-page-subtitle');
  if (pageTitleEl) pageTitleEl.textContent = page.title;
  if (pageSubtitleEl) pageSubtitleEl.textContent = page.subtitle;

  // Update Pagination Counter
  const counterEl = document.getElementById('spares-pagination-counter');
  if (counterEl) {
    counterEl.textContent = `Page ${currentPageIndex + 1} of ${totalPages} (Catalogue Page ${page.pageNumber})`;
  }

  // Update Navigation Buttons state
  const prevBtn = document.getElementById('spares-prev-page-btn');
  const nextBtn = document.getElementById('spares-next-page-btn');
  if (prevBtn) prevBtn.disabled = currentPageIndex === 0;
  if (nextBtn) nextBtn.disabled = currentPageIndex === totalPages - 1;

  // Update Sub-model pill active class
  const pills = document.querySelectorAll('.spares-submodel-pill');
  pills.forEach((p, i) => {
    p.classList.toggle('active', i === currentPageIndex);
  });

  // Update WhatsApp Link with specific part info
  const whatsappBtn = document.getElementById('spares-whatsapp-inquiry');
  if (whatsappBtn) {
    const msg = encodeURIComponent(`Hello Sree Krishna Enterprizes, I am enquiring about spare parts for ${currentBrand.name} - ${page.title} (Catalogue Page ${page.pageNumber}). Please share pricing and availability.`);
    whatsappBtn.href = `https://wa.me/919843227289?text=${msg}`;
  }

  // Reset Zoom on page change
  setZoom(1.0);
}

/**
 * 6. Page Navigation Controls
 */
function changeSparesPage(delta) {
  if (!currentBrand) return;
  const newIndex = currentPageIndex + delta;
  if (newIndex >= 0 && newIndex < currentBrand.pages.length) {
    currentPageIndex = newIndex;
    renderCurrentPage();
  }
}

function goToSparesPage(index) {
  if (!currentBrand || index < 0 || index >= currentBrand.pages.length) return;
  currentPageIndex = index;
  renderCurrentPage();
}

/**
 * 7. Zoom Controls
 */
function setZoom(val) {
  currentZoom = Math.min(Math.max(val, 0.75), 3.0);
  const wrap = document.getElementById('spares-page-image-wrap');
  const zoomText = document.getElementById('spares-zoom-level');

  if (wrap) {
    wrap.style.transform = `scale(${currentZoom})`;
  }
  if (zoomText) {
    zoomText.textContent = `${Math.round(currentZoom * 100)}%`;
  }
}

/**
 * 8. Toggle Fullscreen Viewer
 */
function toggleViewerFullscreen() {
  const viewerView = document.getElementById('spares-viewer-view');
  if (viewerView) {
    viewerView.classList.toggle('fullscreen-mode');
  }
}

// Attach to window object for inline HTML event handlers
window.initSparesCatalog = initSparesCatalog;
window.renderSparesBrandList = renderSparesBrandList;
window.openSparesBrand = openSparesBrand;
window.closeBrandViewer = closeBrandViewer;
window.changeSparesPage = changeSparesPage;
window.goToSparesPage = goToSparesPage;
window.setZoom = setZoom;
