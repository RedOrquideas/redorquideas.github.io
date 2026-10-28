async function init() {
    const statsEl = document.getElementById('stats');
    wireJoinButtons();
    wireSocialLinks();
    if (!statsEl) return;

    try {
        const res = await fetch('data.json');
        const data = await res.json();
        const docs = data.doctors;
        const doctoras = docs.filter(x => x.role === 'Doctora').length;
        const jovenes = docs.length - doctoras;
        const years = [...new Set(docs.map(x => x.year))].sort((a, b) => b - a);

        statsEl.innerHTML = `
            <div class="stat"><span class="stat-value">${docs.length}</span><span class="stat-label">Mujeres</span></div>
            <div class="stat"><span class="stat-value">${docs.length}</span><span class="stat-label">Proyectos</span></div>
            <div class="stat"><span class="stat-value">${doctoras}</span><span class="stat-label">Doctoras</span></div>
            <div class="stat"><span class="stat-value">${jovenes}</span><span class="stat-label">Jóvenes investigadoras</span></div>
            <div class="stat"><span class="stat-value">${years.length}</span><span class="stat-label">Convocatorias</span></div>
        `;
    } catch (err) {
        statsEl.innerHTML = '';
    }
}

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

function wireSocialLinks() {
    const el = document.getElementById('socialLinks');
    if (!el) return;
    const s = window.SITE_CONFIG && window.SITE_CONFIG.social;
    if (!s) return;
    const items = [];
    if (s.instagram) {
        items.push(`<a href="${s.instagram}" target="_blank" rel="noopener" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>`);
    }
    if (s.linkedin) {
        items.push(`<a href="${s.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>`);
    }
    el.innerHTML = items.join('');
}

init();
