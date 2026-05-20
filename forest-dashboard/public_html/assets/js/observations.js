// /forest-dashboard/public_html/assets/js/observations.js

const Observations = {
    async load() {
        const result = await Api.getPoints();

        if (!result.success) {
            console.error(result.message);
            return;
        }

        const source = AppMap.observationsLayer.getSource();
        source.clear();

        result.points.forEach(point => {
            const feature = new ol.Feature({
                geometry: new ol.geom.Point(
                    ol.proj.fromLonLat([
                        Number(point.longitude),
                        Number(point.latitude)
                    ])
                ),
                pointData: point
            });

            feature.setStyle(this.getPointStyle(Number(point.final_score)));

            source.addFeature(feature);
        });
    },

    getPointStyle(score) {
        return new ol.style.Style({
            image: new ol.style.Circle({
                radius: 8,
                fill: new ol.style.Fill({
                    color: this.getScoreColor(score)
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffffff',
                    width: 3
                })
            })
        });
    },

    bindMapClick() {
        AppMap.map.on('click', event => {
            const feature = AppMap.map.forEachFeatureAtPixel(event.pixel, item => item);

            if (!feature || !feature.get('pointData')) {
                return;
            }

            this.openDetails(feature.get('pointData').id);
        });
    },

    async openDetails(id) {
        const modalElement = document.getElementById('observationDetailsModal');
        const body = document.getElementById('observationDetailsBody');

        body.innerHTML = `
        <div class="text-center py-4">
            <div class="spinner-border text-success"></div>
        </div>
    `;

        const modal = new bootstrap.Modal(modalElement);
        modal.show();

        const result = await Api.getObservation(id);

        if (!result.success) {
            body.innerHTML = `<div class="alert alert-danger">${this.escape(result.message)}</div>`;
            return;
        }

        body.innerHTML = this.renderDetails(result.observation);
    },

    renderDetails(observation) {
        const photo = observation.photo_path
            ? `<img src="/${this.escape(observation.photo_path.replace(/^public_html\//, ''))}" class="img-fluid rounded mb-3">`
            : `<div class="alert alert-secondary">No photo available.</div>`;

        const responses = observation.responses.map(response => `
        <div class="mb-3">
            <div class="fw-semibold">${this.escape(response.question_text)}</div>
            <div class="text-muted">${this.formatAnswer(response)}</div>
        </div>
    `).join('');

        return `
        ${photo}

        <div class="mb-3">
            <span class="badge text-bg-success">Score ${this.escape(observation.final_score)}</span>
        </div>

        <p class="text-muted small">
            Recorded at ${this.escape(observation.created_at)}
        </p>

        ${responses}
    `;
    },

    formatAnswer(response) {
        return this.escape(response.display_answer || response.answer_value || '');
    },

    escape(value) {
        if (value === null || value === undefined) {
            return '';
        }

        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    },

    getScoreColor(score) {
        const colors = {
            1: '#d9f0d3',
            2: '#a6dba0',
            3: '#5aae61',
            4: '#1b7837',
            5: '#00441b'
        };

        return colors[score] || '#6c757d';
    },

    bindPointerCursor() {
        AppMap.map.on('pointermove', event => {
            const hit = AppMap.map.hasFeatureAtPixel(event.pixel);
            AppMap.map.getTargetElement().style.cursor = hit ? 'pointer' : '';
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Observations.load();
    Observations.bindMapClick();
    Observations.bindPointerCursor();

    document.getElementById('observationsToggle').addEventListener('change', event => {
        AppMap.observationsLayer.setVisible(event.target.checked);
    });
});