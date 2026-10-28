(function () {
    'use strict';

    var viz = document.getElementById('redViz');
    if (!viz) return;

    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function reveal() {
        viz.classList.add('is-visible');
    }

    if (reduced) {
        reveal();
    } else if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    reveal();
                    io.disconnect();
                }
            });
        }, { threshold: 0.2 });
        io.observe(viz);
    } else {
        reveal();
    }

    // Interacción: activar nodo y conexiones asociadas
    var cards = viz.querySelectorAll('.red-card');
    var lines = viz.querySelectorAll('.red-line');
    var nodes = viz.querySelectorAll('.red-node');
    var connMap = {
        0: [0],
        1: [0, 1, 3],
        2: [1, 2],
        3: [2, 3]
    };

    function reset() {
        nodes.forEach(function (n) { n.classList.remove('active'); });
        lines.forEach(function (l) { l.classList.remove('active'); });
    }

    function activate(idx) {
        reset();
        var node = document.getElementById('redNode' + idx);
        if (node) node.classList.add('active');
        (connMap[idx] || []).forEach(function (i) {
            if (lines[i]) lines[i].classList.add('active');
        });
    }

    cards.forEach(function (card) {
        card.addEventListener('mouseenter', function () { activate(Number(card.dataset.node)); });
        card.addEventListener('focus', function () { activate(Number(card.dataset.node)); });
        card.addEventListener('mouseleave', reset);
        card.addEventListener('blur', reset);
    });
})();
