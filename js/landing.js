(function () {
    'use strict';

    function wireJoinButtons() {
        var url = window.SITE_CONFIG && window.SITE_CONFIG.formUrl;
        document.querySelectorAll('[data-join]').forEach(function (a) {
            if (url) {
                a.href = url;
                a.target = '_blank';
                a.rel = 'noopener';
            } else {
                a.style.display = 'none';
            }
        });
    }

    function wireSocialLinks() {
        var el = document.getElementById('socialLinks');
        if (!el) return;
        var s = window.SITE_CONFIG && window.SITE_CONFIG.social;
        if (!s) return;
        var items = [];
        if (s.instagram) {
            items.push('<a href="' + s.instagram + '" target="_blank" rel="noopener" aria-label="Instagram"><i class="fa-brands fa-instagram" aria-hidden="true"></i></a>');
        }
        if (s.linkedin) {
            items.push('<a href="' + s.linkedin + '" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in" aria-hidden="true"></i></a>');
        }
        el.innerHTML = items.join('');
    }

    function wireAnimToggle() {
        var toggle = document.getElementById('animToggle');
        var svg = document.querySelector('.orchid-anim');
        var label = document.getElementById('animToggleLabel');
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
            if (label) label.textContent = paused ? 'Reanudar animación' : 'Pausar animación';
            if (icon) icon.className = paused ? 'fa-solid fa-play' : 'fa-solid fa-pause';
        });
    }

    wireJoinButtons();
    wireSocialLinks();
    wireAnimToggle();
})();
