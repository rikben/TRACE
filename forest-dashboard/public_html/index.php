<?php
// /forest-dashboard/public_html/index.php

require_once __DIR__ . '/../config/app.php';

$assetVersion = time();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>TRACE - Forest Biodiversity Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/ol@v10.6.1/ol.css" rel="stylesheet">
    <link href="assets/vendor/potree/build/potree/potree.css" rel="stylesheet">
    <link href="assets/vendor/potree/libs/jquery-ui/jquery-ui.min.css" rel="stylesheet">

    <link href="assets/css/style.css?v=<?= $assetVersion ?>" rel="stylesheet">
</head>
<body>

<nav class="navbar navbar-dark bg-success px-3">
    <div class="navbar-brand app-title mb-0">
        <i class="bi bi-tree-fill"></i>

        <div class="app-title-text">
            <div class="app-title-main">
                TRACE
            </div>

            <div class="app-title-sub">
                Forest Biodiversity Dashboard
            </div>
        </div>
    </div>
</nav>

<div class="container-fluid app-container">
    <div class="row app-row">
        <aside class="col-md-4 col-lg-3 sidebar p-3">
            <h2 class="h5">Citizen science observation</h2>

            <p class="text-muted small mb-2">
                Use your current location, judge a tree, and help validate the biodiversity model.
            </p>

            <div class="alert alert-warning small py-2 mb-3">
                <div class="fw-semibold mb-1">
                    <i class="bi bi-info-circle"></i>
                    Important
                </div>

                This questionnaire and biodiversity interpretation are designed primarily
                for deciduous forest environments.
            </div>

            <button id="logObservationBtn" class="btn btn-success w-100 mb-3">
                <i class="bi bi-geo-alt-fill"></i>
                Log tree at current location
            </button>

            <div
                id="locationStatus"
                class="alert alert-danger small d-none"
                role="alert"
            ></div>

            <hr>

            <h3 class="h6">Map layers</h3>

            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="observationsToggle" checked>
                <label class="form-check-label" for="observationsToggle">
                    Show observations
                </label>
            </div>

            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="biodiversityToggle" checked>
                <label class="form-check-label" for="biodiversityToggle">
                    Show biodiversity layer
                    <i
                            class="bi bi-info-circle text-muted ms-1"
                            tabindex="0"
                            data-bs-toggle="popover"
                            data-bs-trigger="hover focus"
                            data-bs-placement="right"
                            data-bs-content="This layer uses tree complexity as a proxy for biodiversity. The score ranges from 0 to 100 and is based on weighted normalised tree crown volume (50%), crown diameter (20%), and tree height (30%)."
                    ></i>
                </label>
            </div>

            <div class="mt-3">
                <label for="heatmapOpacity" class="form-label small">
                    Biodiversity layer opacity
                </label>
                <input type="range" class="form-range" id="heatmapOpacity" min="0" max="1" step="0.1" value="0.7">
            </div>

            <div class="mt-3">
                <button
                        class="btn btn-outline-secondary btn-sm w-100"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#mapLegend"
                >
                    <i class="bi bi-list-ul"></i>
                    Map legend
                </button>

                <div class="collapse mt-2" id="mapLegend">
                    <div class="card">
                        <div class="card-body p-2">

                            <div class="small fw-semibold mb-2">
                                Location
                            </div>

                            <div class="legend-item">
                                <span class="legend-dot user-location-dot"></span>
                                <span>Your current location</span>
                            </div>

                            <hr class="my-2">

                            <div class="small fw-semibold mb-2">
                                Citizen observations
                            </div>

                            <div class="legend-item">
                                <span class="legend-dot score-1"></span>
                                <span>1 — Very low</span>
                            </div>

                            <div class="legend-item">
                                <span class="legend-dot score-2"></span>
                                <span>2 — Low</span>
                            </div>

                            <div class="legend-item">
                                <span class="legend-dot score-3"></span>
                                <span>3 — Moderate</span>
                            </div>

                            <div class="legend-item">
                                <span class="legend-dot score-4"></span>
                                <span>4 — High</span>
                            </div>

                            <div class="legend-item">
                                <span class="legend-dot score-5"></span>
                                <span>5 — Very high</span>
                            </div>

                            <hr class="my-2">

                            <div class="small fw-semibold mb-2">
                                Biodiversity heatmap
                            </div>

                            <div class="biodiversity-gradient mb-1"></div>

                            <div class="d-flex justify-content-between small text-muted">
                                <span>0</span>
                                <span>Complexity score</span>
                                <span>100</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </aside>

        <main class="col-md-8 col-lg-9 map-wrapper p-0">
            <div id="map"></div>

            <div id="locationConfirmBar" class="location-confirm-bar d-none">
                <div class="location-confirm-card">
                    <div class="small fw-semibold mb-1">
                        <i class="bi bi-geo-alt-fill"></i>
                        Confirm tree location
                    </div>

                    <div id="locationConfirmText" class="small text-muted mb-2">
                        Location not confirmed yet.
                    </div>

                    <div class="d-grid gap-2">
                        <button id="confirmTreeLocationBtn" class="btn btn-success btn-sm">
                            Use this location
                        </button>

                        <div class="d-flex gap-2">
                            <button id="moveTreeMarkerBtn" class="btn btn-outline-secondary btn-sm flex-fill">
                                Move marker
                            </button>

                            <button id="improveTreeLocationBtn" class="btn btn-outline-success btn-sm flex-fill">
                                Improve GPS
                            </button>
                        </div>

                        <button id="cancelTreeLocationBtn" class="btn btn-link btn-sm text-muted">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>

<!-- Intro modal -->
<div class="modal fade" id="introModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen-sm-down modal-dialog-centered">
        <div class="modal-content intro-modal">
            <div class="modal-header">
                <h5 class="modal-title">Welcome to TRACE</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
                <div class="progress mb-4">
                    <div id="introProgress" class="progress-bar bg-success" style="width: 0%"></div>
                </div>

                <div id="introContainer" class="intro-step"></div>
            </div>

            <div class="modal-footer">
                <button id="skipIntroBtn" class="btn btn-outline-secondary">
                    Skip introduction
                </button>

                <button id="previousIntroBtn" class="btn btn-outline-secondary">
                    Previous
                </button>

                <button id="nextIntroBtn" class="btn btn-success">
                    Continue
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Observation modal -->
<div class="modal fade" id="observationModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen-sm-down modal-dialog-centered">
        <div class="modal-content observation-modal">
            <div class="modal-header">
                <h5 class="modal-title">Tree observation</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
                <div class="progress mb-4">
                    <div id="questionProgress" class="progress-bar bg-success" style="width: 0%"></div>
                </div>

                <div id="questionContainer" class="question-step"></div>

                <div
                        id="submissionFeedback"
                        class="alert mt-3 d-none"
                        role="alert"
                ></div>
            </div>

            <div class="modal-footer">
                <button id="previousQuestionBtn" class="btn btn-outline-secondary">Previous</button>
                <button id="nextQuestionBtn" class="btn btn-success">
                    <span id="nextQuestionText">Continue</span>
                    <span
                            id="nextQuestionSpinner"
                            class="spinner-border spinner-border-sm ms-2 d-none"
                            aria-hidden="true"
                    ></span>
                </button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="observationDetailsModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen-sm-down modal-dialog-centered modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Observation details</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body" id="observationDetailsBody">
                <div class="text-center py-4">
                    <div class="spinner-border text-success"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/geotiff@2.1.3/dist-browser/geotiff.js"></script>
<script src="https://cdn.jsdelivr.net/npm/ol@v10.6.1/dist/ol.js"></script>

<script src="assets/vendor/potree/libs/jquery/jquery-3.1.1.min.js"></script>
<script src="assets/vendor/potree/libs/spectrum/spectrum.js"></script>
<script src="assets/vendor/potree/libs/jquery-ui/jquery-ui.min.js"></script>
<script src="assets/vendor/potree/libs/three.js/build/three.min.js"></script>
<script src="assets/vendor/potree/libs/other/BinaryHeap.js"></script>
<script src="assets/vendor/potree/libs/tween/tween.min.js"></script>
<script src="assets/vendor/potree/libs/d3/d3.js"></script>
<script src="assets/vendor/potree/libs/proj4/proj4.js"></script>
<!--<script src="assets/vendor/potree/libs/openlayers3/ol.js"></script>-->
<script src="assets/vendor/potree/libs/i18next/i18next.js"></script>
<script src="assets/vendor/potree/libs/jstree/jstree.js"></script>
<script src="assets/vendor/potree/libs/copc/index.js"></script>
<script src="assets/vendor/potree/build/potree/potree.js"></script>

<script src="assets/js/api.js?v=<?= $assetVersion ?>"></script>
<script src="assets/js/map.js?v=<?= $assetVersion ?>"></script>
<script src="assets/js/observations.js?v=<?= $assetVersion ?>"></script>
<script src="assets/js/pointcloud-viewer.js?v=<?= $assetVersion ?>"></script>
<script src="assets/js/intro.js?v=<?= $assetVersion ?>"></script>
<script src="assets/js/form.js?v=<?= $assetVersion ?>"></script>
</body>
</html>