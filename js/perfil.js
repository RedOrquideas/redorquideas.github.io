(function () {
    'use strict';

    var main = document.getElementById('perfilMain');
    if (!main) return;

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function render(doc) {
        var cfg = window.SITE_CONFIG || {};
        var email = cfg.email;
        var subject = 'Solicitud de actualización de información — ' + doc.name + ' (registro ' + doc.id + ')';
        var mailto = email ? 'mailto:' + email + '?subject=' + encodeURIComponent(subject) : null;
        // Formulario de actualización: si existe un formulario autorizado se usa; en caso contrario, correo.
        var updateHref = cfg.updateFormUrl || mailto;
        var updateTarget = cfg.updateFormUrl ? ' target="_blank" rel="noopener"' : '';

        var img = doc.has_image
            ? '<img src="' + esc(doc.image_src) + '" alt="Fotografía de ' + esc(doc.name) + '" referrerpolicy="no-referrer" onerror="onImgError(this, \'' + esc(doc.initials) + '\')">'
            : '<div class="initial-avatar" aria-hidden="true">' + esc(doc.initials) + '</div>';

        var tags = (doc.keywords || []).map(function (k) {
            return '<span class="tag-static">' + esc(k) + '</span>';
        }).join('');

        var actions = '';
        if (doc.cv_link) actions += '<a class="btn btn-outline" href="' + esc(doc.cv_link) + '" target="_blank" rel="noopener">CvLAC</a>';
        if (doc.email) actions += '<a class="btn btn-primary" href="mailto:' + esc(doc.email) + '">Contactar</a>';
        if (updateHref) actions += '<a class="btn btn-outline" href="' + esc(updateHref) + '"' + updateTarget + '>Actualizar información</a>';

        return '<div class="container perfil">' +
            '<a class="back-link" href="directorio.html"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Volver al directorio</a>' +
            '<div class="perfil-grid">' +
                '<div class="perfil-media">' + img + '</div>' +
                '<div class="perfil-body">' +
                    '<div class="card-meta"><span>' + esc(doc.role) + '</span><span aria-hidden="true">·</span><span>Convocatoria ' + doc.year + '</span></div>' +
                    '<h1 class="perfil-name">' + esc(doc.name) + '</h1>' +
                    '<div class="perfil-field"><h2>Título de investigación</h2><p class="proposal">' + esc(doc.proposal || '') + '</p></div>' +
                    '<div class="perfil-field"><h2>Perfil profesional</h2><p>' + esc(doc.profile || '') + '</p></div>' +
                    (tags ? '<div class="perfil-field"><h2>Palabras clave</h2><div class="tags">' + tags + '</div></div>' : '') +
                    '<div class="card-actions">' + actions + '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    }

    async function init() {
        var id = new URLSearchParams(window.location.search).get('id');
        if (!id) {
            main.innerHTML = '<div class="container"><div class="error">No se especificó un perfil.</div></div>';
            return;
        }
        try {
            var res = await fetch('data.json');
            if (!res.ok) throw new Error('HTTP ' + res.status);
            var data = await res.json();
            var doc = data.doctors.find(function (d) { return String(d.id) === String(id); });
            if (!doc) {
                main.innerHTML = '<div class="container"><div class="error">No se encontró el perfil solicitado.</div></div>';
                return;
            }
            main.innerHTML = render(doc);
            document.title = doc.name + ' · Directorio Red OCTeI';
        } catch (err) {
            main.innerHTML = '<div class="container"><div class="error">No se pudieron cargar los datos del directorio.</div></div>';
        }
    }

    window.onImgError = function (img, initials) {
        var div = document.createElement('div');
        div.className = 'initial-avatar';
        div.textContent = initials;
        div.setAttribute('aria-hidden', 'true');
        img.parentNode.insertBefore(div, img);
        img.remove();
    };

    init();
})();
