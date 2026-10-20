const state = {
    data: null,
    years: [],
    roles: [],
    keywords: [],
    view: 'grid',
    query: '',
    year: '',
    role: '',
    keyword: ''
};

const els = {};

const ROLE_COLORS = ['bg-purple', 'bg-pink', 'bg-blue', 'bg-green', 'bg-amber', 'bg-red', 'bg-gray'];
const YEAR_COLORS = ['bg-blue', 'bg-green', 'bg-amber', 'bg-purple', 'bg-pink', 'bg-red', 'bg-gray'];

function $(id) { return document.getElementById(id); }

function esc(s) {
    return String(s ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function truncated(text, limit, id) {
    if (!text) return '';
    const t = String(text);
    if (t.length <= limit) return `<span>${esc(t)}</span>`;
    const short = t.slice(0, limit);
    return `<span id="short-${id}">${esc(short)}&hellip; </span>` +
        `<span id="full-${id}" hidden>${esc(t)} </span>` +
        `<button type="button" class="read-more" data-target="${id}">Leer más</button>`;
}

function roleColor(role) {
    const i = state.roles.indexOf(role);
    return ROLE_COLORS[i >= 0 ? i % ROLE_COLORS.length : ROLE_COLORS.length - 1];
}

function yearColor(year) {
    const i = state.years.indexOf(year);
    return YEAR_COLORS[i >= 0 ? i % YEAR_COLORS.length : YEAR_COLORS.length - 1];
}

function fillSelect(select, values) {
    select.innerHTML = '<option value="">' + select.dataset.placeholder + '</option>';
    values.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v;
        opt.textContent = v;
        select.appendChild(opt);
    });
}

function renderStats() {
    const d = state.data.doctors;
    const doctoras = d.filter(x => x.role === 'Doctora').length;
    const jovenes = d.length - doctoras;
    els.stats.innerHTML = `
        <div class="stat"><span class="stat-value">${d.length}</span><span class="stat-label">Mujeres</span></div>
        <div class="stat"><span class="stat-value">${d.length}</span><span class="stat-label">Proyectos</span></div>
        <div class="stat"><span class="stat-value">${doctoras}</span><span class="stat-label">Doctoras</span></div>
        <div class="stat"><span class="stat-value">${jovenes}</span><span class="stat-label">Jóvenes investigadoras</span></div>
        <div class="stat"><span class="stat-value">${state.years.length}</span><span class="stat-label">Convocatorias</span></div>
    `;
}

function render() {
    const d = state.data.doctors;
    const q = state.query.toLowerCase();
    const filtered = d.filter(doc => {
        const matchesText = !q ||
            doc.name.toLowerCase().includes(q) ||
            doc.proposal.toLowerCase().includes(q) ||
            (doc.profile || '').toLowerCase().includes(q);
        const matchesYear = !state.year || doc.year === Number(state.year);
        const matchesRole = !state.role || doc.role === state.role;
        const matchesKey = !state.keyword || (doc.keywords || []).includes(state.keyword);
        return matchesText && matchesYear && matchesRole && matchesKey;
    });

    els.count.textContent = filtered.length;
    els.results.classList.toggle('list', state.view === 'list');
    els.btnGrid.classList.toggle('active', state.view === 'grid');
    els.btnList.classList.toggle('active', state.view === 'list');

    if (!filtered.length) {
        els.results.innerHTML = '';
        els.noResults.hidden = false;
        return;
    }
    els.noResults.hidden = true;

    els.results.innerHTML = filtered.map(doc => {
        const img = doc.has_image
            ? `<img src="${esc(doc.image_src)}" alt="${esc(doc.name)}" loading="lazy" referrerpolicy="no-referrer" onerror="onImgError(this, '${esc(doc.initials)}')">`
            : `<div class="initial-avatar">${esc(doc.initials)}</div>`;
        const tags = (doc.keywords || []).slice(0, 5).map(k =>
            `<button type="button" class="tag" data-keyword="${esc(k)}">${esc(k)}</button>`).join('');
        return `
        <article class="card">
            <div class="card-img">
                <span class="badge badge-year ${yearColor(doc.year)}">${doc.year}</span>
                <span class="badge badge-role ${roleColor(doc.role)}">${esc(doc.role)}</span>
                ${img}
                ${doc.has_image ? `<button type="button" class="img-expand" data-img="${esc(doc.image_src)}" aria-label="Ampliar imagen"><i class="fa-solid fa-expand"></i></button>` : ''}
            </div>
            <div class="card-body">
                <span class="label">Nombre</span>
                <h2 class="card-name">${esc(doc.name)}</h2>
                <span class="label">Título de investigación</span>
                <p class="proposal">${esc(doc.proposal)}</p>
                <span class="label">Perfil profesional</span>
                <p class="profile">${truncated(doc.profile, 140, doc.id)}</p>
                <span class="label">Palabras clave</span>
                <div class="tags">${tags}</div>
                <div class="card-actions">
                    ${doc.cv_link ? `<a class="btn btn-outline" href="${esc(doc.cv_link)}" target="_blank" rel="noopener"><i class="fa-solid fa-file-lines"></i> CvLAC</a>` : ''}
                    ${doc.email ? `<a class="btn btn-solid" href="mailto:${esc(doc.email)}"><i class="fa-solid fa-envelope"></i> Contactar</a>` : ''}
                </div>
            </div>
        </article>`;
    }).join('');
}

function applyFilters() {
    state.query = els.search.value;
    state.year = els.year.value;
    state.role = els.role.value;
    state.keyword = els.keyword.value;
    render();
}

function resetFilters() {
    els.search.value = '';
    els.year.value = '';
    els.role.value = '';
    els.keyword.value = '';
    applyFilters();
}

window.onImgError = function (img, initials) {
    const parent = img.parentElement;
    const div = document.createElement('div');
    div.className = 'initial-avatar';
    div.textContent = initials;
    parent.insertBefore(div, img);
    img.remove();
};

function openModal(src) {
    if (!src) return;
    els.modalImg.src = src;
    els.modal.classList.add('open');
    els.modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
    els.modal.classList.remove('open');
    els.modal.setAttribute('aria-hidden', 'true');
}

function bindEvents() {
    els.filterToggle.addEventListener('click', () => {
        const open = els.filtersBar.classList.toggle('open');
        els.filterToggle.setAttribute('aria-expanded', String(open));
    });

    els.search.addEventListener('input', applyFilters);
    els.year.addEventListener('change', applyFilters);
    els.role.addEventListener('change', applyFilters);
    els.keyword.addEventListener('change', applyFilters);
    els.resetBtn.addEventListener('click', resetFilters);

    els.btnGrid.addEventListener('click', () => { state.view = 'grid'; render(); });
    els.btnList.addEventListener('click', () => { state.view = 'list'; render(); });

    els.results.addEventListener('click', (e) => {
        const readMore = e.target.closest('.read-more');
        if (readMore) {
            const id = readMore.dataset.target;
            const short = $('short-' + id);
            const full = $('full-' + id);
            const expanded = !full.hidden;
            full.hidden = expanded;
            short.hidden = !expanded;
            readMore.textContent = expanded ? 'Leer más' : 'Leer menos';
            return;
        }
        const tag = e.target.closest('.tag');
        if (tag) {
            els.keyword.value = tag.dataset.keyword;
            applyFilters();
            return;
        }
        const expand = e.target.closest('.img-expand');
        if (expand) {
            openModal(expand.dataset.img);
            return;
        }
    });

    els.modal.addEventListener('click', (e) => {
        if (e.target.closest('[data-close]')) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    window.addEventListener('scroll', () => {
        els.btnBackToTop.classList.toggle('show', window.scrollY > 300);
    });

    els.btnBackToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

async function init() {
    els.results = $('resultsContainer');
    wireJoinButtons();
    els.search = $('searchInput');
    els.year = $('yearSelect');
    els.role = $('roleSelect');
    els.keyword = $('keywordSelect');
    els.count = $('countDisplay');
    els.noResults = $('noResults');
    els.filterToggle = $('filterToggle');
    els.filtersBar = $('filtersBar');
    els.resetBtn = $('resetBtn');
    els.btnGrid = $('btnGrid');
    els.btnList = $('btnList');
    els.btnBackToTop = $('btnBackToTop');
    els.modal = $('imgModal');
    els.modalImg = $('modalImgDisplay');
    els.stats = $('stats');

    els.year.dataset.placeholder = 'Todos';
    els.role.dataset.placeholder = 'Todas';
    els.keyword.dataset.placeholder = 'Todas';

    bindEvents();

    try {
        const res = await fetch('data.json');
        state.data = await res.json();
    } catch (err) {
        els.results.innerHTML = '<p>No se pudieron cargar los datos. Asegúrate de abrir el sitio mediante un servidor (por ejemplo GitHub Pages).</p>';
        return;
    }

    state.years = [...new Set(state.data.doctors.map(d => d.year))].sort((a, b) => b - a);
    state.roles = [...new Set(state.data.doctors.map(d => d.role))].sort();
    state.keywords = [...new Set(state.data.doctors.flatMap(d => d.keywords || []))]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, 'es'));

    fillSelect(els.year, state.years);
    fillSelect(els.role, state.roles);
    fillSelect(els.keyword, state.keywords);

    renderStats();
    render();
}

init();

function wireJoinButtons() {
    const url = window.SITE_CONFIG && window.SITE_CONFIG.formUrl;
    document.querySelectorAll('[data-join]').forEach(a => {
        if (url) {
            a.href = url;
            a.target = '_blank';
            a.rel = 'noopener';
        } else {
            a.style.display = 'none';
        }
    });
}
