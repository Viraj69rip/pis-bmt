/* ============================================================
   StudyHub — app.js
   Handles routing, rendering, flipbook PDF viewer
   ============================================================ */

/* ── State ─────────────────────────────────────────────────── */
const state = {
  category: null,
  subject: null,
  viewerOpen: false,
  currentFile: null,
  pdfDoc: null,
  currentPage: 1,
  totalPages: 0,
  rendering: false,
  flipDirection: null,
};

/* ── PDF.js setup ─────────────────────────────────────────────*/
let pdfjsLib = null;
function ensurePdfJs() {
  if (window.pdfjsLib) {
    pdfjsLib = window.pdfjsLib;
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }
}

/* ── DOM helpers ───────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}
function toast(msg, type = 'info') {
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span> ${msg}`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

/* ── Page detection ─────────────────────────────────────────── */
function currentPage() {
  const path = location.pathname.split('/').pop();
  if (!path || path === 'index.html') return 'home';
  if (path === 'browse.html') return 'browse';
  return 'other';
}

/* ══════════════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════════════ */
function initHome() {
  const grid = $('#categories-grid');
  if (!grid) return;

  CATEGORIES.forEach((cat, i) => {
    const a = el('a', `cat-card anim-slide-up anim-delay-${i + 1}`);
    a.href = `browse.html?cat=${cat.id}`;
    a.style.setProperty('--cat-gradient', cat.gradient);
    a.style.setProperty('--cat-color', cat.color);
    a.innerHTML = `
      <div class="cat-glow"></div>
      <span class="cat-icon">${cat.icon}</span>
      <div class="cat-label">${cat.label}</div>
      <div class="cat-desc">${cat.desc}</div>
      <div class="cat-arrow">Explore <span>→</span></div>
    `;
    grid.appendChild(a);
  });
}

/* ══════════════════════════════════════════════════════════════
   BROWSE PAGE
══════════════════════════════════════════════════════════════ */
function initBrowse() {
  const params = new URLSearchParams(location.search);
  state.category = params.get('cat');
  state.subject  = params.get('sub');

  if (!state.category || !RESOURCES[state.category]) {
    window.location.href = 'index.html';
    return;
  }

  const cat = CATEGORIES.find(c => c.id === state.category);

  updateBreadcrumb(cat);

  if (!state.subject) {
    renderSubjects(cat);
  } else {
    renderChapters(cat);
  }

  // Search
  const searchInput = $('#search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      if (!state.subject) {
        $$('.subj-card').forEach(card => {
          const name = card.querySelector('.subj-name').textContent.toLowerCase();
          card.style.display = name.includes(q) ? '' : 'none';
        });
      } else {
        $$('.chapter-item').forEach(item => {
          const name = item.querySelector('.ch-name').textContent.toLowerCase();
          item.style.display = name.includes(q) ? '' : 'none';
        });
      }
    });
  }
}

function updateBreadcrumb(cat) {
  const bc = $('#breadcrumb');
  if (!bc) return;
  let html = `<a href="index.html">Home</a><span>/</span>`;
  html += `<a href="browse.html?cat=${cat.id}">${cat.label}</a>`;
  if (state.subject) {
    const subj = SUBJECTS[state.subject];
    html += `<span>/</span><span>${subj ? subj.label : state.subject}</span>`;
  }
  bc.innerHTML = html;
}

function renderSubjects(cat) {
  const header = $('#page-header');
  const content = $('#page-content');
  if (!header || !content) return;

  header.innerHTML = `
    <h1>${cat.icon} ${cat.label}</h1>
    <p>Choose a subject to explore ${cat.label.toLowerCase()}</p>
  `;

  const grid = el('div', 'subjects-grid');
  const categoryData = RESOURCES[state.category];

  Object.entries(SUBJECTS).forEach(([id, meta], i) => {
    if (!categoryData[id]) return;

    const chapCount = Object.keys(categoryData[id]).length;
    const fileCount = Object.values(categoryData[id]).reduce((s, files) => s + files.length, 0);

    const a = el('a', `subj-card anim-slide-up anim-delay-${(i % 4) + 1}`);
    a.href = `browse.html?cat=${state.category}&sub=${id}`;
    a.style.setProperty('--subj-color', meta.color);
    a.innerHTML = `
      <span class="subj-icon">${meta.icon}</span>
      <div class="subj-name">${meta.label}</div>
      <div style="font-size:0.75rem;color:var(--text-muted);margin-top:6px">
        ${chapCount} chapters · ${fileCount} files
      </div>
    `;
    grid.appendChild(a);
  });

  content.innerHTML = '';
  content.appendChild(grid);
}

function renderChapters(cat) {
  const header = $('#page-header');
  const content = $('#page-content');
  if (!header || !content) return;

  const subj = SUBJECTS[state.subject];
  header.innerHTML = `
    <h1>${subj ? subj.icon + ' ' + subj.label : state.subject}</h1>
    <p>${cat.label} — select a chapter to view files</p>
  `;

  const chapData = RESOURCES[state.category]?.[state.subject] || {};
  const chapters = Object.entries(chapData);

  if (chapters.length === 0) {
    content.innerHTML = `
      <div class="empty">
        <span class="empty-icon">📭</span>
        <h3>No files yet</h3>
        <p>Check back soon or ask your teacher to upload resources.</p>
      </div>
    `;
    return;
  }

  const list = el('div', 'chapter-list');

  chapters.forEach(([chapName, files], i) => {
    const item = el('div', 'chapter-item anim-slide-up');
    item.style.animationDelay = `${i * 0.04}s`;

    const header = el('div', 'chapter-header');
    header.innerHTML = `
      <div class="ch-name">${chapName}</div>
      <div style="display:flex;align-items:center;gap:10px">
        <span class="ch-count">${files.length} file${files.length !== 1 ? 's' : ''}</span>
        <span class="ch-chevron">▼</span>
      </div>
    `;
    header.addEventListener('click', () => toggleChapter(item));

    const filesDiv = el('div', 'chapter-files');
    files.forEach(file => {
      const row = buildFileRow(file);
      filesDiv.appendChild(row);
    });

    item.appendChild(header);
    item.appendChild(filesDiv);
    list.appendChild(item);
  });

  content.innerHTML = '';
  content.appendChild(list);

  // Auto-open first chapter
  const first = list.querySelector('.chapter-item');
  if (first) toggleChapter(first);
}

function toggleChapter(item) {
  const isOpen = item.classList.contains('open');
  // Close all
  $$('.chapter-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

function buildFileRow(file) {
  const row = el('div', 'file-row');
  row.innerHTML = `
    <div class="file-icon">📄</div>
    <div class="file-name">${file.name}</div>
    ${file.source === 'ncert' ? '<span class="file-source-badge">NCERT</span>' : ''}
    <div class="file-actions">
      <button class="btn btn-view" onclick="openViewer('${encodeURIComponent(file.url)}','${encodeURIComponent(file.name)}')">
        👁 View
      </button>
      <a class="btn btn-dl" href="${file.url}" download target="_blank" rel="noopener">
        ⬇ Download
      </a>
    </div>
  `;
  return row;
}

/* ══════════════════════════════════════════════════════════════
   PDF FLIPBOOK VIEWER
══════════════════════════════════════════════════════════════ */
function openViewer(encodedUrl, encodedName) {
  const url  = decodeURIComponent(encodedUrl);
  const name = decodeURIComponent(encodedName);

  state.currentFile = { url, name };
  state.currentPage = 1;
  state.pdfDoc = null;
  state.totalPages = 0;

  const overlay = $('#viewer-overlay');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  $('#viewer-title').textContent = name;
  updatePageInfo(0, 0);

  // Show loading
  const flipbook = $('#flipbook');
  flipbook.innerHTML = `
    <div class="viewer-loading">
      <div class="spinner"></div>
      <span>Loading document…</span>
    </div>
  `;

  ensurePdfJs();
  if (!pdfjsLib) {
    // Fallback: open in iframe
    renderIframeFallback(url, name);
    return;
  }

  loadPdf(url);
}

function closeViewer() {
  const overlay = $('#viewer-overlay');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  state.pdfDoc = null;
  state.viewerOpen = false;
}

async function loadPdf(url) {
  try {
    // Use a CORS proxy for NCERT or cross-origin PDFs
    const proxyUrl = url; // Direct first; if CORS fails we handle below

    const loadingTask = pdfjsLib.getDocument({
      url: proxyUrl,
      withCredentials: false,
    });

    loadingTask.onProgress = (p) => {
      if (p.total) {
        const pct = Math.round((p.loaded / p.total) * 100);
        const flipbook = $('#flipbook');
        if (flipbook.querySelector('.viewer-loading span')) {
          flipbook.querySelector('.viewer-loading span').textContent = `Loading… ${pct}%`;
        }
      }
    };

    state.pdfDoc = await loadingTask.promise;
    state.totalPages = state.pdfDoc.numPages;
    state.currentPage = 1;

    updatePageInfo(state.currentPage, state.totalPages);
    updateNavButtons();
    await renderFlipbookPage(state.currentPage);
  } catch (err) {
    console.error('PDF load error:', err);
    renderIframeFallback(state.currentFile.url, state.currentFile.name);
  }
}

function renderIframeFallback(url, name) {
  const flipbook = $('#flipbook');
  flipbook.innerHTML = `
    <div style="width:min(90vw,700px);height:min(85vh,900px);background:#fff;border-radius:8px;overflow:hidden;position:relative;box-shadow:var(--shadow-lg)">
      <iframe
        src="https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true"
        style="width:100%;height:100%;border:none"
        title="${name}"
      ></iframe>
      <div style="position:absolute;bottom:12px;right:12px;display:flex;gap:8px">
        <a href="${url}" target="_blank" class="btn btn-view" style="font-size:0.75rem">Open in New Tab ↗</a>
        <a href="${url}" download class="btn btn-dl" style="font-size:0.75rem">⬇ Download</a>
      </div>
    </div>
  `;
  $('#viewer-prev').disabled = true;
  $('#viewer-next').disabled = true;
}

async function renderFlipbookPage(pageNum, direction = null) {
  if (!state.pdfDoc || state.rendering) return;
  state.rendering = true;

  const flipbook = $('#flipbook');
  const oldWrapper = flipbook.querySelector('.page-wrapper');

  // Build new page
  const newWrapper = el('div', 'page-wrapper');
  const pageFace   = el('div', 'page-face');
  const canvas     = document.createElement('canvas');
  pageFace.appendChild(canvas);
  newWrapper.appendChild(pageFace);

  // Render PDF page to canvas
  const page = await state.pdfDoc.getPage(pageNum);
  const container = flipbook;
  const containerW = container.clientWidth || 700;
  const containerH = container.clientHeight || 900;
  const viewport0 = page.getViewport({ scale: 1 });
  const scale = Math.min(containerW / viewport0.width, containerH / viewport0.height) * 0.97;
  const viewport = page.getViewport({ scale });

  canvas.width  = viewport.width;
  canvas.height = viewport.height;

  await page.render({
    canvasContext: canvas.getContext('2d'),
    viewport,
  }).promise;

  // Page turn animation
  if (direction && oldWrapper) {
    if (direction === 'forward') {
      // Slide old page out to left with 3D flip
      oldWrapper.style.transition = 'transform 0.6s cubic-bezier(0.4,0,0.2,1)';
      oldWrapper.style.transformOrigin = 'left center';
      oldWrapper.style.transform = 'rotateY(-180deg)';
      oldWrapper.style.zIndex = '2';

      // New page comes in from right
      newWrapper.style.transform = 'rotateY(0deg)';
      newWrapper.style.zIndex = '1';
    } else {
      oldWrapper.style.transition = 'transform 0.6s cubic-bezier(0.4,0,0.2,1)';
      oldWrapper.style.transformOrigin = 'right center';
      oldWrapper.style.transform = 'rotateY(180deg)';
      oldWrapper.style.zIndex = '2';
      newWrapper.style.transformOrigin = 'right center';
      newWrapper.style.transform = 'rotateY(0deg)';
      newWrapper.style.zIndex = '1';
    }

    flipbook.appendChild(newWrapper);
    newWrapper.getBoundingClientRect(); // force reflow

    await new Promise(r => setTimeout(r, 650));
    if (oldWrapper.parentNode) oldWrapper.remove();
  } else {
    // Initial render — just show with scale-in animation
    flipbook.innerHTML = '';
    newWrapper.style.animation = 'scaleIn 0.4s ease both';
    flipbook.appendChild(newWrapper);
  }

  // Add page shadow for depth
  const shadow = el('div', 'page-shadow');
  newWrapper.appendChild(shadow);

  state.currentPage = pageNum;
  updatePageInfo(pageNum, state.totalPages);
  updateNavButtons();
  state.rendering = false;
}

function updatePageInfo(cur, total) {
  const el = $('#viewer-page-info');
  if (el) el.textContent = total ? `${cur} / ${total}` : '—';
}

function updateNavButtons() {
  const prev = $('#viewer-prev');
  const next = $('#viewer-next');
  const fp = $('#flip-prev');
  const fn = $('#flip-next');
  if (prev) prev.disabled = state.currentPage <= 1;
  if (next) next.disabled = state.currentPage >= state.totalPages;
  if (fp)   fp.disabled   = state.currentPage <= 1;
  if (fn)   fn.disabled   = state.currentPage >= state.totalPages;
}

async function goPage(dir) {
  if (state.rendering) return;
  const target = state.currentPage + dir;
  if (target < 1 || target > state.totalPages) return;
  await renderFlipbookPage(target, dir > 0 ? 'forward' : 'backward');
}

/* keyboard navigation */
document.addEventListener('keydown', (e) => {
  if (!$('#viewer-overlay')?.classList.contains('active')) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goPage(1);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goPage(-1);
  if (e.key === 'Escape') closeViewer();
});

/* ── Init ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const page = currentPage();
  if (page === 'home')   initHome();
  if (page === 'browse') initBrowse();

  // Wire viewer buttons (present on both pages via overlay)
  const closeBtn = document.getElementById('viewer-close');
  if (closeBtn) closeBtn.addEventListener('click', closeViewer);
  const prevBtn = document.getElementById('viewer-prev');
  if (prevBtn) prevBtn.addEventListener('click', () => goPage(-1));
  const nextBtn = document.getElementById('viewer-next');
  if (nextBtn) nextBtn.addEventListener('click', () => goPage(1));
  const fpBtn = document.getElementById('flip-prev');
  if (fpBtn) fpBtn.addEventListener('click', () => goPage(-1));
  const fnBtn = document.getElementById('flip-next');
  if (fnBtn) fnBtn.addEventListener('click', () => goPage(1));
});

/* expose for inline onclick */
window.openViewer = openViewer;
window.closeViewer = closeViewer;
