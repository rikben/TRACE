// /forest-dashboard/public_html/assets/js/map.js

const AppMap = {
    map: null,
    userLocation: null,
    userLocationFeature: null,
    userLocationLayer: null,
    observationsLayer: null,

    init() {
        const baseLayer = new ol.layer.Tile({
            source: new ol.source.OSM()
        });

        this.userLocationFeature = new ol.Feature();

        this.userLocationLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [this.userLocationFeature]
            }),
            style: new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({ color: '#0d6efd' }),
                    stroke: new ol.style.Stroke({ color: '#ffffff', width: 2 })
                })
            })
        });

        this.observationsLayer = new ol.layer.Vector({
            source: new ol.source.Vector()
        });

        this.map = new ol.Map({
            target: 'map',
            layers: [
                baseLayer,
                this.observationsLayer,
                this.userLocationLayer
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat([5.2913, 52.1326]),
                zoom: 7
            })
        });
    },

    locateUser() {
        if (!navigator.geolocation) {
            this.setLocationStatus('Geolocation is not supported by this browser.', 'danger');
            return;
        }

        this.setLocationStatus('Getting your location...', 'secondary');

        navigator.geolocation.getCurrentPosition(
            position => {
                const longitude = position.coords.longitude;
                const latitude = position.coords.latitude;
                const accuracy = position.coords.accuracy;

                this.userLocation = {
                    latitude,
                    longitude,
                    accuracy
                };

                const coordinates = ol.proj.fromLonLat([longitude, latitude]);

                this.userLocationFeature.setGeometry(
                    new ol.geom.Point(coordinates)
                );

                this.map.getView().animate({
                    center: coordinates,
                    zoom: 17,
                    duration: 700
                });

                document.getElementById('logObservationBtn').disabled = false;

                this.setLocationStatus(
                    `Location found. Accuracy: ${Math.round(accuracy)} m.`,
                    'success'
                );
            },
            error => {
                this.setLocationStatus(`Location error: ${error.message}`, 'danger');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    },

    setLocationStatus(message, type) {
        const element = document.getElementById('locationStatus');

        element.className = `alert alert-${type} small`;
        element.textContent = message;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    AppMap.init();

    document.getElementById('locateBtn').addEventListener('click', () => {
        AppMap.locateUser();
    });
});