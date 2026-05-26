// /forest-dashboard/public_html/assets/js/map.js

const AppMap = {
    map: null,
    userLocation: null,
    userLocationFeature: null,
    userLocationLayer: null,
    observationsLayer: null,
    manualMarkerMoveEnabled: false,

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
                    radius: 8,
                    fill: new ol.style.Fill({ color: '#0d6efd' }),
                    stroke: new ol.style.Stroke({ color: '#ffffff', width: 3 })
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

        this.bindManualMarkerMove();
    },

    async getBestLocation(options = {}) {
        const durationMs = options.durationMs ?? 8000;
        const desiredAccuracy = options.desiredAccuracy ?? 12;

        if (!navigator.geolocation) {
            throw new Error('Geolocation is not supported by this browser.');
        }

        return new Promise((resolve, reject) => {
            let bestPosition = null;
            let watchId = null;

            const finish = () => {
                if (watchId !== null) {
                    navigator.geolocation.clearWatch(watchId);
                }

                if (!bestPosition) {
                    reject(new Error('Could not determine your location.'));
                    return;
                }

                const location = {
                    latitude: bestPosition.coords.latitude,
                    longitude: bestPosition.coords.longitude,
                    accuracy: bestPosition.coords.accuracy
                };

                this.setUserLocation(location, true);

                resolve(location);
            };

            watchId = navigator.geolocation.watchPosition(
                position => {
                    if (
                        !bestPosition ||
                        position.coords.accuracy < bestPosition.coords.accuracy
                    ) {
                        bestPosition = position;

                        const location = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy
                        };

                        this.setUserLocation(location, true);

                        if (position.coords.accuracy <= desiredAccuracy) {
                            finish();
                        }
                    }
                },
                error => {
                    if (watchId !== null) {
                        navigator.geolocation.clearWatch(watchId);
                    }

                    reject(new Error(error.message));
                },
                {
                    enableHighAccuracy: true,
                    timeout: durationMs,
                    maximumAge: 0
                }
            );

            setTimeout(finish, durationMs);
        });
    },

    setUserLocation(location, animate = false) {
        this.userLocation = location;

        const coordinates = ol.proj.fromLonLat([
            location.longitude,
            location.latitude
        ]);

        this.userLocationFeature.setGeometry(
            new ol.geom.Point(coordinates)
        );

        if (animate) {
            this.map.getView().animate({
                center: coordinates,
                zoom: 18,
                duration: 700
            });
        }
    },

    enableManualMarkerMove(enabled) {
        this.manualMarkerMoveEnabled = enabled;
    },

    bindManualMarkerMove() {
        this.map.on('click', event => {
            if (!this.manualMarkerMoveEnabled) {
                return;
            }

            const lonLat = ol.proj.toLonLat(event.coordinate);

            this.setUserLocation({
                longitude: lonLat[0],
                latitude: lonLat[1],
                accuracy: null
            });

            this.enableManualMarkerMove(false);

            const text = document.getElementById('locationConfirmText');

            if (text) {
                text.textContent = 'Marker moved manually. Use this location if the marker is on the tree.';
            }
        });
    },

    setLocationStatus(message = '', type = 'danger') {
        const element = document.getElementById('locationStatus');

        if (!element) {
            return;
        }

        if (!message) {
            element.classList.add('d-none');
            element.textContent = '';
            return;
        }

        element.className = `alert alert-${type} small`;
        element.textContent = message;
    },
};

document.addEventListener('DOMContentLoaded', () => {
    AppMap.init();
});