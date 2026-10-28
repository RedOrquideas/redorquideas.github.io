(function () {
    'use strict';

    var form = document.getElementById('updateForm');
    if (!form) return;
    var hint = document.getElementById('formHint');

    var id = new URLSearchParams(window.location.search).get('perfil');
    var perfilId = document.getElementById('perfilId');
    if (id && perfilId) perfilId.value = id;

    function val(fieldId) {
        var el = document.getElementById(fieldId);
        if (!el) return '';
        if (el.type === 'checkbox') return el.checked ? 'Sí' : 'No';
        return el.value.trim();
    }

    function buildBody() {
        var lines = [];
        if (id) lines.push('Registro: ' + id);
        var pairs = [
            ['fNombre', 'Nombre'],
            ['fInstitucion', 'Institución'],
            ['fCargo', 'Cargo'],
            ['fFormacion', 'Formación'],
            ['fResena', 'Reseña profesional'],
            ['fAreas', 'Áreas de investigación'],
            ['fPalabras', 'Palabras clave'],
            ['fEliminarFoto', 'Eliminar fotografía'],
            ['fAutorizaFoto', 'Autoriza fotografía'],
            ['fCvlac', 'CvLAC'],
            ['fOrcid', 'ORCID'],
            ['fScholar', 'Google Scholar'],
            ['fResearchgate', 'ResearchGate'],
            ['fWeb', 'Página web'],
            ['fLinkedin', 'LinkedIn'],
            ['fProyecto', 'Proyecto'],
            ['fProyectoDetalle', 'Detalle del proyecto'],
            ['fCorreo', 'Correo'],
            ['fPublicarCorreo', 'Publicar correo']
        ];
        pairs.forEach(function (p) {
            var v = val(p[0]);
            if (v) lines.push(p[1] + ': ' + v);
        });
        lines.push('', 'Autorización de tratamiento de datos: Sí');
        lines.push('Autorización de publicación pública: Sí');
        return lines.join('\n');
    }

    form.addEventListener('submit', function (e) {
        var autoriza = document.getElementById('fAutorizacion');
        var publica = document.getElementById('fPublicacion');
        if (!autoriza || !autoriza.checked) {
            e.preventDefault();
            if (hint) hint.textContent = 'Debes autorizar el tratamiento de datos para enviar la solicitud.';
            autoriza.focus();
            return;
        }
        if (!publica || !publica.checked) {
            e.preventDefault();
            if (hint) hint.textContent = 'Debes aceptar que tu información será de acceso público para enviar la solicitud.';
            publica.focus();
            return;
        }

        var cfg = window.SITE_CONFIG || {};
        if (cfg.updateFormUrl) {
            form.action = cfg.updateFormUrl;
            form.method = 'GET';
            return;
        }

        e.preventDefault();
        var recipients = [cfg.email, cfg.adminEmail].filter(Boolean).join(',');
        var subject = 'Solicitud de actualización' + (id ? ' — registro ' + id : '');
        var body = buildBody();
        var mailto = 'mailto:' + recipients + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        if (hint) hint.textContent = 'Se abrirá tu correo con la solicitud. Adjunta tu fotografía al mensaje si es necesario.';
        window.location.href = mailto;
    });
})();
