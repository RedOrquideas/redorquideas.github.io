(function () {
    'use strict';

    var toggle = document.getElementById('animToggle');
    var img = document.querySelector('.orchid-anim');
    if (!toggle || !img) return;
    var icon = toggle.querySelector('i');

    var ANIM = 'img/brand/logo-animado.gif';
    var STATIC = 'img/brand/logo-color.png';

    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
        img.src = STATIC;
        toggle.hidden = true;
        return;
    }

    var paused = false;
    toggle.addEventListener('click', function () {
        paused = !paused;
        img.src = paused ? STATIC : ANIM;
        toggle.setAttribute('aria-pressed', String(paused));
        toggle.setAttribute('aria-label', paused
            ? 'Reanudar la animación del logotipo'
            : 'Pausar la animación del logotipo');
        if (icon) icon.className = paused ? 'fa-solid fa-play' : 'fa-solid fa-pause';
    });
})();
