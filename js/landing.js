(function () {
    'use strict';

    var toggle = document.getElementById('animToggle');
    var svg = document.querySelector('.orchid-anim');
    if (!toggle || !svg) return;
    var icon = toggle.querySelector('i');

    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
        toggle.hidden = true;
        return;
    }

    toggle.addEventListener('click', function () {
        var paused = svg.classList.toggle('paused');
        toggle.setAttribute('aria-pressed', String(paused));
        toggle.setAttribute('aria-label', paused
            ? 'Reanudar la animación de la orquídea'
            : 'Pausar la animación de la orquídea');
        if (icon) icon.className = paused ? 'fa-solid fa-play' : 'fa-solid fa-pause';
    });
})();

(function () {
    'use strict';

    var social = (window.SITE_CONFIG && window.SITE_CONFIG.social) || {};
    document.querySelectorAll('[data-social]').forEach(function (a) {
        var url = social[a.getAttribute('data-social')];
        if (url) {
            a.href = url;
        } else {
            a.parentNode.removeChild(a);
        }
    });
})();

(function () {
    'use strict';

    var openBtns = document.querySelectorAll('[data-comunicado]');
    var modal = document.getElementById('comunicadoModal');
    if (!openBtns.length || !modal) return;
    var lastTrigger = null;

    function open() {
        modal.hidden = false;
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        var close = modal.querySelector('.modal-close');
        if (close) close.focus();
    }

    function close() {
        modal.hidden = true;
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastTrigger) lastTrigger.focus();
    }

    openBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            lastTrigger = btn;
            open();
        });
    });

    modal.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

    modal.querySelectorAll('[data-close]').forEach(function (el) {
        el.addEventListener('click', close);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !modal.hidden) close();
    });
})();
