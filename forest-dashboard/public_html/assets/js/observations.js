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
        let color = '#dc3545';

        if (score >= 7) {
            color = '#198754';
        } else if (score >= 4) {
            color = '#ffc107';
        }

        return new ol.style.Style({
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({ color }),
                stroke: new ol.style.Stroke({ color: '#ffffff', width: 2 })
            })
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Observations.load();

    document.getElementById('observationsToggle').addEventListener('change', event => {
        AppMap.observationsLayer.setVisible(event.target.checked);
    });
});