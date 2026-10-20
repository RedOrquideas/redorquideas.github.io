async function init() {
    const statsEl = document.getElementById('stats');
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

init();
