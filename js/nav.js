(function () {
    'use strict';

    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('siteMenu');
    var header = document.getElementById('siteHeader');
    if (!toggle || !menu || !header) return;

    function setOpen(open) {
        header.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
    }

    toggle.addEventListener('click', function () {
        setOpen(!header.classList.contains('open'));
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && header.classList.contains('open')) {
            setOpen(false);
            toggle.focus();
        }
    });

    menu.addEventListener('click', function (e) {
        if (e.target.closest('a')) {
            setOpen(false);
        }
    });

    document.addEventListener('click', function (e) {
        if (header.classList.contains('open') && !header.contains(e.target)) {
            setOpen(false);
        }
    });
})();
