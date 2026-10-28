(function () {
    'use strict';

    var state = {
        data: null,
        years: [],
        roles: [],
        keywords: [],
        view: 'list',
        query: '',
        year: '',
        role: '',
        keyword: '',
        page: 1,
        pageSize: 24
    };

    var filtered = [];
    var els = {};

    function $(id) { return document.getElementById(id); }

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function truncated(text, limit, id) {
        if (!text) return '';
        var t = String(text);
        if (t.length <= limit) return '<span>' + esc(t) + '</span>';
        return '<span id="short-' + id + '">' + esc(t.slice(0, limit)) + '&hellip; </span>' +
            '<span id="full-' + id + '" hidden>' + esc(t) + ' </span>' +
            '<button type="button" class="read-more" data-target="' + id + '" aria-expanded="false">Leer más</button>';
    }

    function renderStats() {
        var d = state.data.doctors;
        var doctoras = d.filter(function (x) { return x.role === 'Doctora'; }).length;
        var jovenes = d.length - doctoras;
        els.stats.innerHTML =
            '<div class="dir-stat"><div class="dir-stat-value">' + d.length + '</div><div class="dir-stat-label">Beneficiarias</div></div>' +
            '<div class="dir-stat"><div class="dir-stat-value">' + doctoras + '</div><div class="dir-stat-label">Doctoras</div></div>' +
            '<div class="dir-stat"><div class="dir-stat-value">' + jovenes + '</div><div class="dir-stat-label">Jóvenes investigadoras</div></div>' +
            '<div class="dir-stat"><div class="dir-stat-value">' + state.years.length + '</div><div class="dir-stat-label">Convocatorias</div></div>';
        els.statsNote.textContent = 'Fuente: Programa Orquídeas de Minciencias (convocatorias 2023–2025). Los registros corresponden a beneficiarias del programa; la pertenencia a Red OCTeI se verifica de forma independiente.';
    }

    function applyFilters() {
        var d = state.data.doctors;
        var q = state.query.toLowerCase();
        filtered = d.filter(function (doc) {
            var matchesText = !q ||
                doc.name.toLowerCase().indexOf(q) !== -1 ||
                (doc.proposal || '').toLowerCase().indexOf(q) !== -1 ||
                (doc.profile || '').toLowerCase().indexOf(q) !== -1 ||
                (doc.keywords || []).some(function (k) { return k.toLowerCase().indexOf(q) !== -1; });
            var matchesYear = !state.year || doc.year === Number(state.year);
            var matchesRole = !state.role || doc.role === state.role;
            var matchesKey = !state.keyword || (doc.keywords || []).indexOf(state.keyword) !== -1;
            return matchesText && matchesYear && matchesRole && matchesKey;
        });
        state.page = 1;
        render();
    }

    function render() {
        var total = filtered.length;
        els.countDisplay.textContent = total === 1 ? '1 resultado' : total + ' resultados';

        var pages = Math.max(1, Math.ceil(total / state.pageSize));
        if (state.page > pages) state.page = pages;
        var start = (state.page - 1) * state.pageSize;
        var slice = filtered.slice(start, start + state.pageSize);

        els.results.classList.toggle('list', state.view === 'list');
        els.btnGrid.setAttribute('aria-pressed', String(state.view === 'grid'));
        els.btnList.setAttribute('aria-pressed', String(state.view === 'list'));

        if (!total) {
            els.results.innerHTML = '';
            els.noResults.hidden = false;
            els.pagination.innerHTML = '';
            return;
        }
        els.noResults.hidden = true;
        els.results.innerHTML = slice.map(card).join('');
        renderPagination(total, pages, start);
    }

    function card(doc) {
        var img = doc.has_image
            ? '<img src="' + esc(doc.image_src) + '" alt="Fotografía de ' + esc(doc.name) + '" loading="lazy" referrerpolicy="no-referrer" onerror="onImgError(this, \'' + esc(doc.initials) + '\')">'
            : '<div class="initial-avatar" aria-hidden="true">' + esc(doc.initials) + '</div>';
        var tags = (doc.keywords || []).slice(0, 5).map(function (k) {
            return '<button type="button" class="tag" data-keyword="' + esc(k) + '">' + esc(k) + '</button>';
        }).join('');
        return '<article class="card">' +
            '<div class="card-img">' +
                img +
                (doc.has_image ? '<button type="button" class="img-expand" data-img="' + esc(doc.image_src) + '" data-name="' + esc(doc.name) + '" aria-label="Ampliar fotografía de ' + esc(doc.name) + '"><i class="fa-solid fa-expand" aria-hidden="true"></i></button>' : '') +
            '</div>' +
            '<div class="card-body">' +
                '<div class="card-meta"><span>' + esc(doc.role) + '</span><span aria-hidden="true">·</span><span>' + doc.year + '</span></div>' +
                '<h2 class="card-name"><a href="perfil.html?id=' + doc.id + '">' + esc(doc.name) + '</a></h2>' +
                '<p class="proposal">' + esc(doc.proposal || '') + '</p>' +
                '<p class="profile">' + truncated(doc.profile, 140, doc.id) + '</p>' +
                '<div class="tags">' + tags + '</div>' +
                '<div class="card-actions">' +
                    '<a class="btn btn-outline" href="perfil.html?id=' + doc.id + '">Ver perfil</a>' +
                    (doc.cv_link ? '<a class="btn btn-outline" href="' + esc(doc.cv_link) + '" target="_blank" rel="noopener">CvLAC</a>' : '') +
                    (doc.email ? '<a class="btn btn-primary" href="mailto:' + esc(doc.email) + '">Contactar</a>' : '') +
                '</div>' +
            '</div>' +
        '</article>';
    }

    function renderPagination(total, pages, start) {
        if (pages <= 1) { els.pagination.innerHTML = ''; return; }
        var end = Math.min(start + state.pageSize, total);
        var html = '<button class="btn btn-outline" id="prevPage" type="button"' + (state.page === 1 ? ' disabled' : '') + '>Anterior</button>' +
            '<span>Página ' + state.page + ' de ' + pages + ' · ' + (start + 1) + '–' + end + ' de ' + total + '</span>' +
            '<button class="btn btn-outline" id="nextPage" type="button"' + (state.page === pages ? ' disabled' : '') + '>Siguiente</button>';
        els.pagination.innerHTML = html;
        var prev = $('prevPage'), next = $('nextPage');
        if (prev) prev.addEventListener('click', function () { state.page--; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
        if (next) next.addEventListener('click', function () { state.page++; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }

    window.onImgError = function (img, initials) {
        var div = document.createElement('div');
        div.className = 'initial-avatar';
        div.textContent = initials;
        div.setAttribute('aria-hidden', 'true');
        img.parentNode.insertBefore(div, img);
        img.remove();
    };

    /* ---------- Combobox de palabras clave ---------- */
    function initCombobox() {
        var input = els.keywordInput;
        var list = els.keywordList;
        var activeIndex = -1;

        function open() {
            list.hidden = false;
            input.setAttribute('aria-expanded', 'true');
        }
        function close() {
            list.hidden = true;
            input.setAttribute('aria-expanded', 'false');
            activeIndex = -1;
        }
        function renderOptions(matches) {
            activeIndex = -1;
            if (!matches.length) { list.innerHTML = ''; close(); return; }
            list.innerHTML = matches.map(function (k, i) {
                return '<li role="option" id="kw-opt-' + i + '" data-value="' + esc(k) + '">' + esc(k) + '</li>';
            }).join('');
            open();
        }

        input.addEventListener('input', function () {
            var v = input.value.toLowerCase().trim();
            if (!v) { state.keyword = ''; close(); applyFilters(); return; }
            var matches = state.keywords.filter(function (k) { return k.toLowerCase().indexOf(v) === 0; }).slice(0, 40);
            renderOptions(matches);
        });

        input.addEventListener('focus', function () {
            if (!list.hidden && list.children.length) open();
        });

        input.addEventListener('keydown', function (e) {
            var opts = list.querySelectorAll('li');
            if (e.key === 'ArrowDown') {
                if (list.hidden) { renderOptions(state.keywords.slice(0, 40)); }
                e.preventDefault();
                activeIndex = (activeIndex + 1) % opts.length;
                setActive(opts, activeIndex);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                activeIndex = (activeIndex - 1 + opts.length) % opts.length;
                setActive(opts, activeIndex);
            } else if (e.key === 'Enter') {
                if (!list.hidden && activeIndex >= 0) {
                    e.preventDefault();
                    select(opts[activeIndex]);
                }
            } else if (e.key === 'Escape') {
                close();
            }
        });

        list.addEventListener('click', function (e) {
            var li = e.target.closest('li');
            if (li) select(li);
        });

        function setActive(opts, idx) {
            opts.forEach(function (o, i) { o.classList.toggle('active', i === idx); });
            if (opts[idx]) input.setAttribute('aria-activedescendant', opts[idx].id);
        }
        function select(li) {
            state.keyword = li.dataset.value;
            input.value = state.keyword;
            input.setAttribute('aria-activedescendant', '');
            close();
            applyFilters();
        }

        document.addEventListener('click', function (e) {
            if (!els.keywordWrap.contains(e.target)) close();
        });
    }

    /* ---------- Modal de imagen ---------- */
    function initModal() {
        var modal = els.modal;
        var lastFocus = null;

        function open(src, name) {
            lastFocus = document.activeElement;
            els.modalImg.src = src;
            els.modalImg.alt = 'Fotografía ampliada de ' + name;
            els.modalTitle.textContent = name;
            modal.hidden = false;
            document.body.style.overflow = 'hidden';
            els.modalClose.focus();
        }
        function close() {
            modal.hidden = true;
            document.body.style.overflow = '';
            if (lastFocus) lastFocus.focus();
        }
        els.modal.addEventListener('click', function (e) {
            if (e.target.closest('[data-close]')) close();
        });
        document.addEventListener('keydown', function (e) {
            if (modal.hidden) return;
            if (e.key === 'Escape') { close(); }
            if (e.key === 'Tab') {
                var focusables = modal.querySelectorAll('button, [href], img');
                if (!focusables.length) return;
                var first = focusables[0], last = focusables[focusables.length - 1];
                if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
                else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        });
        window.openImgModal = open;
    }

    function bindEvents() {
        els.search.addEventListener('input', function () { state.query = els.search.value; applyFilters(); });
        els.year.addEventListener('change', function () { state.year = els.year.value; applyFilters(); });
        els.role.addEventListener('change', function () { state.role = els.role.value; applyFilters(); });
        els.resetBtn.addEventListener('click', function () {
            els.search.value = '';
            els.year.value = '';
            els.role.value = '';
            els.keywordInput.value = '';
            state.query = state.year = state.role = state.keyword = '';
            applyFilters();
        });
        els.btnGrid.addEventListener('click', function () { state.view = 'grid'; render(); });
        els.btnList.addEventListener('click', function () { state.view = 'list'; render(); });

        els.results.addEventListener('click', function (e) {
            var rm = e.target.closest('.read-more');
            if (rm) {
                var id = rm.dataset.target;
                var short = $('short-' + id), full = $('full-' + id);
                var expanded = !full.hidden;
                full.hidden = expanded; short.hidden = !expanded;
                rm.textContent = expanded ? 'Leer más' : 'Leer menos';
                rm.setAttribute('aria-expanded', String(!expanded));
                return;
            }
            var tag = e.target.closest('.tag');
            if (tag) {
                state.keyword = tag.dataset.keyword;
                els.keywordInput.value = state.keyword;
                applyFilters();
                return;
            }
            var expand = e.target.closest('.img-expand');
            if (expand) {
                window.openImgModal(expand.dataset.img, expand.dataset.name);
                return;
            }
        });
    }

    function fillSelect(select, values, placeholder) {
        select.innerHTML = '<option value="">' + placeholder + '</option>' + values.map(function (v) {
            return '<option value="' + esc(String(v)) + '">' + esc(String(v)) + '</option>';
        }).join('');
    }

    async function init() {
        els.results = $('resultsContainer');
        els.search = $('searchInput');
        els.year = $('yearSelect');
        els.role = $('roleSelect');
        els.keywordInput = $('keywordInput');
        els.keywordList = $('keywordList');
        els.keywordWrap = els.keywordInput.closest('.combobox');
        els.countDisplay = $('countDisplay');
        els.noResults = $('noResults');
        els.btnGrid = $('btnGrid');
        els.btnList = $('btnList');
        els.resetBtn = $('resetBtn');
        els.stats = $('stats');
        els.statsNote = $('statsNote');
        els.pagination = $('pagination');
        els.modal = $('imgModal');
        els.modalImg = $('modalImg');
        els.modalTitle = $('modalTitle');
        els.modalClose = els.modal.querySelector('.modal-close');

        bindEvents();
        initCombobox();
        initModal();

        els.results.innerHTML = '<div class="loading">Cargando directorio&hellip;</div>';

        try {
            var res = await fetch('data.json');
            if (!res.ok) throw new Error('HTTP ' + res.status);
            state.data = await res.json();
        } catch (err) {
            els.results.innerHTML = '<div class="error">No se pudieron cargar los datos del directorio.</div>';
            els.countDisplay.textContent = '';
            return;
        }

        state.years = Array.from(new Set(state.data.doctors.map(function (d) { return d.year; }))).sort(function (a, b) { return b - a; });
        state.roles = Array.from(new Set(state.data.doctors.map(function (d) { return d.role; }))).sort();
        state.keywords = Array.from(new Set(state.data.doctors.reduce(function (acc, d) { return acc.concat(d.keywords || []); }, [])))
            .filter(Boolean)
            .sort(function (a, b) { return a.localeCompare(b, 'es'); });

        fillSelect(els.year, state.years, 'Todas');
        fillSelect(els.role, state.roles, 'Todas');

        renderStats();
        applyFilters();
    }

    init();
})();
