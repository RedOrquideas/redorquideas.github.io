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
