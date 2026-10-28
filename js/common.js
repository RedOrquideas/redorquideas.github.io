(function () {
    'use strict';

    var cfg = window.SITE_CONFIG || {};

    function wireJoinButtons() {
        document.querySelectorAll('[data-join]').forEach(function (a) {
            if (cfg.formUrl) {
                a.href = cfg.formUrl;
                a.target = '_blank';
                a.rel = 'noopener';
            } else {
                a.style.display = 'none';
            }
        });
    }

    function wireEmail() {
        var email = cfg.email;
        document.querySelectorAll('[data-email]').forEach(function (a) {
            if (email) {
                a.href = 'mailto:' + email;
                if (a.hasAttribute('data-email-text')) a.textContent = email;
            }
        });
    }

    function wireSocialLinks() {
        var s = cfg.social || {};
        var items = [];
        if (s.instagram) {
            items.push('<a href="' + s.instagram + '" target="_blank" rel="noopener"><i class="fa-brands fa-instagram" aria-hidden="true"></i><span>Instagram</span></a>');
        }
        if (s.linkedin) {
            items.push('<a href="' + s.linkedin + '" target="_blank" rel="noopener"><i class="fa-brands fa-linkedin-in" aria-hidden="true"></i><span>LinkedIn</span></a>');
        }
        document.querySelectorAll('.social-links, .contacto-social').forEach(function (el) {
            el.innerHTML = items.join('');
        });
    }

    wireJoinButtons();
    wireEmail();
    wireSocialLinks();
})();
