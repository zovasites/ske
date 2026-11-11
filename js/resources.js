/**
 * SREE KRISHNA ENTERPRIZES - RESOURCES & DIRECTORY BOOKS CONTROLLER
 * Manages Publication Books Showcase & Interactive Multi-Page Reader
 */

const SKE_RESOURCES_DATA = {
  pdfUrl: "assets/docs/SKE_Textile_Directory_Books.pdf",
  pdfFileName: "Sree_Krishna_Enterprizes_Directory_Books.pdf",
  books: [
    {
      id: "weaves-today-2016",
      edition: "2016 Trade Edition",
      badge: "National Directory",
      title: "Weaves Today – Indian Textile Directory",
      subtitle: "Job Work Vol - II • Sizing, Weaving, Spares & Packing Materials",
      description: "Official published directory feature covering Sree Krishna Enterprizes' global trading operations, imported weaving accessories, new & used looms, and authorized brand associations including Promatech, Picanol, Sulzertextil, Dornier, Staubli, Bonas, and Eltex.",
      highlights: ["Job Work Vol - II", "Sizing & Weaving Spares", "Global Traders Profile", "Leading Brands Roster"],
      coverImage: "assets/resources/pages/page_1.png",
      pageIndices: [0, 1] // pages 1 and 2
    },
    {
      id: "textile-data-all-india",
      edition: "All India Directory",
      badge: "Index Page 57",
      title: "Textile Data – All India Textile Directory",
      subtitle: "Trade Index Pg 57 • Spares Warehouse Stock & Engineering Profile",
      description: "Comprehensive industry directory profile highlighting SKE's extensive warehouse inventory of genuine replacement parts, sectional warping solutions, spinning machinery import services, and long-standing supplier relationships across India and worldwide markets since 2009.",
      highlights: ["Index Page No: 57", "Extensive Warehouse Stock", "Autolooms & Warping", "10+ Years Industry Pedigree"],
      coverImage: "assets/resources/pages/page_3.png",
      pageIndices: [2, 3] // pages 3 and 4
    },
    {
      id: "woven-directory-1st-ed",
      edition: "1st Edition 2010–11",
      badge: "Historic 1st Edition",
      title: "Textile Data – All India Woven Directory (1st Edition)",
      subtitle: "Index Page 17 • Loom Erection Wing, Dobby Servicing & Spares Plate",
      description: "Historical 1st edition trade directory feature documenting the launch of SKE's specialized service wing for imported loom erection, mechanical and electronic Stäubli dobby servicing, and full photographic plate of rapier grippers, gears, cutters, and electronics.",
      highlights: ["Index Page No: 17", "1st Edition 2010-11", "Loom Erection Service Wing", "Stäubli Dobby Servicing"],
      coverImage: "assets/resources/pages/page_5.png",
      pageIndices: [4, 5] // pages 5 and 6
    },
    {
      id: "woven-directory-machinery",
      edition: "Special Machinery Edition",
      badge: "Index Page 33",
      title: "Textile Data – All India Woven Directory (Machinery Edition)",
      subtitle: "Index Page 33 • Rapier, Sulzer, Air Jet & Warping Machinery Guide",
      description: "Trade directory reference featuring technical classifications and imagery for Rapier, Sulzer, Air Jet, and Warping machinery, along with accessories supply specifications and multi-channel international procurement support.",
      highlights: ["Index Page No: 33", "Rapier, Sulzer & Air Jet", "Warping Machinery", "Genuine Accessories"],
      coverImage: "assets/resources/pages/page_7.png",
      pageIndices: [6, 7] // pages 7 and 8
    }
  ],
  pages: [
    {
      pageNumber: 1,
      bookId: "weaves-today-2016",
      bookTitle: "Weaves Today – Indian Textile Directory 2016",
      title: "Indian Textile Directory 2016 - Cover Feature",
      subtitle: "Job Work Vol - II • Sizing, Weaving, Spares & Global Traders Profile",
      image: "assets/resources/pages/page_1.png",
      description: "Directory feature detailing imported weaving accessories, new & used looms, proprietor B. Arun Prakash, and partner brands (Picanol, Promatech, Sulzertextil, Dornier, Staubli, Bonas, Eltex)."
    },
    {
      pageNumber: 2,
      bookId: "weaves-today-2016",
      bookTitle: "Weaves Today – Indian Textile Directory 2016",
      title: "Machinery & Accessories Full-Color Showcase",
      subtitle: "Rapier, Airjet & Projectile Looms, Sizing, Warping & Genuine Components",
      image: "assets/resources/pages/page_2.png",
      description: "Machinery plate showcasing complete weaving looms, sizing machines, warping equipment, and 8-quadrant spare part accessory groupings."
    },
    {
      pageNumber: 3,
      bookId: "textile-data-all-india",
      bookTitle: "Textile Data – All India Textile Directory",
      title: "Textile Data Directory Profile (Index Page 57)",
      subtitle: "All India Textile Directory • Warehouse Stock Commitment & Client Pedigree",
      image: "assets/resources/pages/page_3.png",
      description: "Company introduction emphasizing warehouse stock management, peerless spare parts performance, sectional warping imports, and client recommendation pedigree."
    },
    {
      pageNumber: 4,
      bookId: "textile-data-all-india",
      bookTitle: "Textile Data – All India Textile Directory",
      title: "Genuine Spares & Technical Service Profile",
      subtitle: "Picanol, Somet, Vamatex, Sulzer, Dornier Spares & Dedicated Engineering Team",
      image: "assets/resources/pages/page_4.png",
      description: "In-depth overview of spares supply scope including heald frames, wires, drop pins, electronic spares, beam trolleys, and dedicated field engineering support."
    },
    {
      pageNumber: 5,
      bookId: "woven-directory-1st-ed",
      bookTitle: "Textile Data – All India Woven Directory (1st Edition)",
      title: "All India Woven Directory (1st Edition 2010–11)",
      subtitle: "Index Page 17 • Loom Erection Wing, Dobby Servicing & Technology Upgrades",
      image: "assets/resources/pages/page_5.png",
      description: "Historic 1st Edition trade listing highlighting the erection wing, autoloom modernization, Stäubli dobby servicing, and loom import services."
    },
    {
      pageNumber: 6,
      bookId: "woven-directory-1st-ed",
      bookTitle: "Textile Data – All India Woven Directory (1st Edition)",
      title: "6-Quadrant Spare Parts Photographic Showcase",
      subtitle: "Grippers, Drive Gears, Heald Frames, Electronics, Nozzles & Textured Rollers",
      image: "assets/resources/pages/page_6.png",
      description: "High-resolution photographic plate displaying 6 primary spare parts categories stocked and supplied by Sree Krishna Enterprizes."
    },
    {
      pageNumber: 7,
      bookId: "woven-directory-machinery",
      bookTitle: "Textile Data – All India Woven Directory (Machinery Edition)",
      title: "Machinery Classifications (Index Page 33)",
      subtitle: "Rapier, Sulzer, Air Jet & Warping Machinery Supply Scope",
      image: "assets/resources/pages/page_7.png",
      description: "Visual directory index detailing Rapier looms, Sulzer projectile looms, Air Jet looms, and warping machines with contact and trade references."
    },
    {
      pageNumber: 8,
      bookId: "woven-directory-machinery",
      bookTitle: "Textile Data – All India Woven Directory (Machinery Edition)",
      title: "Trade Directory Profile & Brand Representation",
      subtitle: "Global Traders for Textile Weaving Accessories & Partner Manufacturer Logos",
      image: "assets/resources/pages/page_8.png",
      description: "Full-page trade directory listing featuring partner brand affiliations, proprietor details, and comprehensive supply capabilities."
    }
  ]
};

let currentResourcePageIndex = 0;
let currentResourceZoom = 1.0;
let isResourceFitWidth = false;
let isResourceDragging = false;
let resourceStartX, resourceStartY, resourceScrollLeft, resourceScrollTop;

/**
 * Initialize Resources Section & Book Viewer
 */
function initResourcesSection() {
  renderResourceBooks();
  renderResourcePagesStrip();
  initResourceReaderEvents();
}

/**
 * Render Book Cards
 */
function renderResourceBooks(filterBookId = 'all') {
  const container = document.getElementById('resources-books-grid');
  if (!container) return;

  let books = SKE_RESOURCES_DATA.books;
  if (filterBookId !== 'all') {
    books = books.filter(b => b.id === filterBookId);
  }

  container.innerHTML = books.map(book => {
    const firstPageIdx = book.pageIndices[0];
    const totalPages = book.pageIndices.length;
    return `
      <div class="resource-book-card" data-book-id="${book.id}">
        <div class="resource-book-cover" onclick="openResourceReader(${firstPageIdx})" title="Click to Read Book">
          <img src="${book.coverImage}" alt="${book.title}" loading="lazy">
          <div class="resource-book-badges">
            <span class="resource-badge-edition">${book.edition}</span>
            <span class="resource-badge-pages">${totalPages} Pages</span>
          </div>
          <div class="resource-cover-hover-cta">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            <span>Read Publication</span>
          </div>
        </div>
        <div class="resource-book-body">
          <div class="resource-book-meta">
            <span class="resource-book-tag">${book.badge}</span>
          </div>
          <h3 class="resource-book-title">${book.title}</h3>
          <p class="resource-book-subtitle">${book.subtitle}</p>
          <p class="resource-book-desc">${book.description}</p>
          <div class="resource-book-highlights">
            ${book.highlights.map(h => `<span class="resource-highlight-pill">${h}</span>`).join('')}
          </div>
          <div class="resource-book-actions">
            <button type="button" class="resource-btn-read" onclick="openResourceReader(${firstPageIdx})">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              <span>Read Book</span>
            </button>
            <button type="button" class="resource-btn-preview" onclick="openResourceReader(${firstPageIdx})" title="Quick Preview" aria-label="Quick Preview">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Filter Books by Category Pill
 */
function filterResourceBooks(filterId, btnEl) {
  const pills = document.querySelectorAll('.resources-pill-btn');
  pills.forEach(p => p.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  renderResourceBooks(filterId);
}

/**
 * Render All 8 Pages Thumbnails Strip
 */
function renderResourcePagesStrip() {
  const container = document.getElementById('resources-pages-strip');
  if (!container) return;

  container.innerHTML = SKE_RESOURCES_DATA.pages.map((p, idx) => `
    <div class="resource-page-thumb-card" onclick="openResourceReader(${idx})" title="Click to view ${p.title}">
      <div class="resource-page-thumb-wrap">
        <img src="${p.image}" alt="${p.title}" loading="lazy">
      </div>
      <div class="resource-page-thumb-caption">
        <span class="resource-page-thumb-num">Page ${p.pageNumber}</span>
        <span class="resource-page-thumb-desc">${p.bookTitle.split('–')[0].trim()}</span>
      </div>
    </div>
  `).join('');
}

/**
 * Open Interactive Reader Modal
 */
function openResourceReader(pageIndex = 0) {
  const overlay = document.getElementById('resource-reader-overlay');
  if (!overlay) return;

  currentResourcePageIndex = Math.max(0, Math.min(pageIndex, SKE_RESOURCES_DATA.pages.length - 1));
  currentResourceZoom = 1.0;
  isResourceFitWidth = false;

  renderResourceReaderPage();
  renderReaderThumbnails();

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/**
 * Close Interactive Reader Modal
 */
function closeResourceReader() {
  const overlay = document.getElementById('resource-reader-overlay');
  if (!overlay) return;

  overlay.classList.remove('open');
  overlay.classList.remove('fullscreen-mode');
  document.body.style.overflow = '';
}

/**
 * Render Current Page in Reader Stage
 */
function renderResourceReaderPage() {
  const page = SKE_RESOURCES_DATA.pages[currentResourcePageIndex];
  if (!page) return;

  const totalPages = SKE_RESOURCES_DATA.pages.length;

  // Image & Title
  const imgEl = document.getElementById('resource-reader-img');
  const titleEl = document.getElementById('resource-reader-title');
  const editionEl = document.getElementById('resource-reader-edition');
  const pageTitleEl = document.getElementById('resource-reader-page-title');
  const pageSubEl = document.getElementById('resource-reader-page-sub');
  const counterEl = document.getElementById('resource-reader-counter');
  const whatsappEl = document.getElementById('resource-reader-whatsapp');

  if (imgEl) {
    imgEl.src = page.image;
    imgEl.alt = `${page.bookTitle} - ${page.title}`;
  }
  if (titleEl) titleEl.textContent = page.bookTitle;
  if (editionEl) editionEl.textContent = `Directory Feature • Page ${page.pageNumber} of ${totalPages}`;
  if (pageTitleEl) pageTitleEl.textContent = page.title;
  if (pageSubEl) pageSubEl.textContent = page.subtitle;
  if (counterEl) counterEl.textContent = `Page ${page.pageNumber} / ${totalPages}`;

  // WhatsApp Enquiry Link
  if (whatsappEl) {
    const msg = encodeURIComponent(`Hello Sree Krishna Enterprizes, I am enquiring about your published directory feature: "${page.bookTitle}" (Page ${page.pageNumber}: ${page.title}). Please share more details.`);
    whatsappEl.href = `https://wa.me/919843227289?text=${msg}`;
  }

  // Navigation Buttons
  const prevBtn = document.getElementById('resource-prev-page-btn');
  const nextBtn = document.getElementById('resource-next-page-btn');
  if (prevBtn) prevBtn.disabled = currentResourcePageIndex === 0;
  if (nextBtn) nextBtn.disabled = currentResourcePageIndex === totalPages - 1;

  // Active Thumbnails
  const thumbs = document.querySelectorAll('.resource-reader-thumb-btn');
  thumbs.forEach((t, i) => {
    t.classList.toggle('active', i === currentResourcePageIndex);
  });

  // Scroll stage back to top
  const stage = document.getElementById('resource-reader-stage');
  if (stage) stage.scrollTop = 0;

  // Reset zoom if not in fit-width
  if (!isResourceFitWidth) {
    setResourceZoom(1.0);
  }
}

/**
 * Render Reader Bottom Thumbnails Strip
 */
function renderReaderThumbnails() {
  const container = document.getElementById('resource-reader-thumbs');
  if (!container) return;

  container.innerHTML = SKE_RESOURCES_DATA.pages.map((p, idx) => `
    <button type="button" class="resource-reader-thumb-btn ${idx === currentResourcePageIndex ? 'active' : ''}" 
      onclick="goToResourcePage(${idx})" title="Go to Page ${p.pageNumber}: ${p.title}">
      <img src="${p.image}" alt="Page ${p.pageNumber}" loading="lazy">
    </button>
  `).join('');
}

/**
 * Page Navigation Controls
 */
function changeResourcePage(delta) {
  const newIndex = currentResourcePageIndex + delta;
  if (newIndex >= 0 && newIndex < SKE_RESOURCES_DATA.pages.length) {
    currentResourcePageIndex = newIndex;
    renderResourceReaderPage();
  }
}

function goToResourcePage(index) {
  if (index >= 0 && index < SKE_RESOURCES_DATA.pages.length) {
    currentResourcePageIndex = index;
    renderResourceReaderPage();
  }
}

/**
 * Zoom Controls
 */
function setResourceZoom(val) {
  currentResourceZoom = Math.min(Math.max(val, 0.5), 5.0);
  const wrap = document.getElementById('resource-reader-image-wrap');
  const zoomText = document.getElementById('resource-zoom-val');
  const stage = document.getElementById('resource-reader-stage');
  const fitWidthBtn = document.getElementById('resource-fit-width-btn');

  if (wrap) {
    wrap.style.transform = `scale(${currentResourceZoom})`;
    wrap.style.transformOrigin = currentResourceZoom > 1.0 ? 'top center' : 'center center';
  }
  if (zoomText) {
    zoomText.textContent = `${Math.round(currentResourceZoom * 100)}%`;
  }
  if (currentResourceZoom !== 1.0 && isResourceFitWidth) {
    isResourceFitWidth = false;
    if (stage) stage.classList.remove('fit-width');
    if (fitWidthBtn) fitWidthBtn.classList.remove('active');
  }
}

/**
 * Toggle Fit Width Mode
 */
function toggleResourceFitWidth() {
  const stage = document.getElementById('resource-reader-stage');
  const fitWidthBtn = document.getElementById('resource-fit-width-btn');
  const zoomText = document.getElementById('resource-zoom-val');
  if (!stage) return;

  isResourceFitWidth = !isResourceFitWidth;
  stage.classList.toggle('fit-width', isResourceFitWidth);
  if (fitWidthBtn) {
    fitWidthBtn.classList.toggle('active', isResourceFitWidth);
  }
  setResourceZoom(1.0);
  if (zoomText) {
    zoomText.textContent = isResourceFitWidth ? 'Fit W' : '100%';
  }
}

/**
 * Toggle Fullscreen Reader
 */
function toggleResourceFullscreen() {
  const overlay = document.getElementById('resource-reader-overlay');
  if (overlay) {
    overlay.classList.toggle('fullscreen-mode');
  }
}

/**
 * Attach Event Listeners for Reader
 */
function initResourceReaderEvents() {
  const overlay = document.getElementById('resource-reader-overlay');
  const closeBtn = document.getElementById('resource-close-reader-btn');
  const prevBtn = document.getElementById('resource-prev-page-btn');
  const nextBtn = document.getElementById('resource-next-page-btn');
  const zoomInBtn = document.getElementById('resource-zoom-in-btn');
  const zoomOutBtn = document.getElementById('resource-zoom-out-btn');
  const zoomResetBtn = document.getElementById('resource-zoom-reset-btn');
  const fitWidthBtn = document.getElementById('resource-fit-width-btn');
  const fullscreenBtn = document.getElementById('resource-fullscreen-btn');
  const stage = document.getElementById('resource-reader-stage');

  if (closeBtn) closeBtn.addEventListener('click', closeResourceReader);
  if (prevBtn) prevBtn.addEventListener('click', () => changeResourcePage(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => changeResourcePage(1));
  if (zoomInBtn) zoomInBtn.addEventListener('click', () => setResourceZoom(currentResourceZoom + 0.25));
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => setResourceZoom(currentResourceZoom - 0.25));
  if (zoomResetBtn) {
    zoomResetBtn.addEventListener('click', () => {
      if (isResourceFitWidth) toggleResourceFitWidth();
      setResourceZoom(1.0);
    });
  }
  if (fitWidthBtn) fitWidthBtn.addEventListener('click', toggleResourceFitWidth);
  if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleResourceFullscreen);

  // Click outside dialog to close
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeResourceReader();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!overlay || !overlay.classList.contains('open')) return;
    if (e.key === 'ArrowLeft') changeResourcePage(-1);
    else if (e.key === 'ArrowRight') changeResourcePage(1);
    else if (e.key === 'Escape') closeResourceReader();
  });

  // Pan / Dragging when zoomed or scrollable
  if (stage) {
    stage.addEventListener('mousedown', (e) => {
      const canScroll = stage.scrollWidth > stage.clientWidth ||
                        stage.scrollHeight > stage.clientHeight ||
                        currentResourceZoom > 1.0;
      if (!canScroll) return;
      isResourceDragging = true;
      stage.classList.add('grabbing');
      resourceStartX = e.pageX - stage.offsetLeft;
      resourceStartY = e.pageY - stage.offsetTop;
      resourceScrollLeft = stage.scrollLeft;
      resourceScrollTop = stage.scrollTop;
    });

    stage.addEventListener('mouseleave', () => {
      isResourceDragging = false;
      stage.classList.remove('grabbing');
    });

    stage.addEventListener('mouseup', () => {
      isResourceDragging = false;
      stage.classList.remove('grabbing');
    });

    stage.addEventListener('mousemove', (e) => {
      if (!isResourceDragging) return;
      e.preventDefault();
      const x = e.pageX - stage.offsetLeft;
      const y = e.pageY - stage.offsetTop;
      const walkX = (x - resourceStartX) * 1.5;
      const walkY = (y - resourceStartY) * 1.5;
      stage.scrollLeft = resourceScrollLeft - walkX;
      stage.scrollTop = resourceScrollTop - walkY;
    });

    // Double-click to toggle fit-width / maximum size
    stage.addEventListener('dblclick', (e) => {
      if (e.target.closest('.resource-stage-nav-btn')) return;
      toggleResourceFitWidth();
    });

    // Wheel zoom with Ctrl key
    stage.addEventListener('wheel', (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.25 : -0.25;
        setResourceZoom(currentResourceZoom + delta);
      }
    }, { passive: false });
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initResourcesSection();
});

// Window Exports
window.initResourcesSection = initResourcesSection;
window.renderResourceBooks = renderResourceBooks;
window.filterResourceBooks = filterResourceBooks;
window.openResourceReader = openResourceReader;
window.closeResourceReader = closeResourceReader;
window.changeResourcePage = changeResourcePage;
window.goToResourcePage = goToResourcePage;
window.setResourceZoom = setResourceZoom;
window.toggleResourceFitWidth = toggleResourceFitWidth;
window.toggleResourceFullscreen = toggleResourceFullscreen;
