<?php
// /forest-dashboard/public_html/index.php

require_once __DIR__ . '/../config/app.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Forest Biodiversity Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/ol@v10.6.1/ol.css" rel="stylesheet">

    <link href="assets/css/style.css" rel="stylesheet">
</head>
<body>

<nav class="navbar navbar-dark bg-success px-3">
    <span class="navbar-brand mb-0 h1">
        <i class="bi bi-tree-fill"></i>
        Forest Biodiversity Dashboard
    </span>
</nav>

<div class="container-fluid app-container">
    <div class="row h-100">
        <aside class="col-md-4 col-lg-3 sidebar p-3">
            <h2 class="h5">Citizen science observation</h2>

            <p class="text-muted small">
                Use your current location, judge a tree, and help validate the biodiversity model.
            </p>

            <button id="locateBtn" class="btn btn-outline-success w-100 mb-2">
                <i class="bi bi-geo-alt"></i>
                Use my current location
            </button>

            <button id="logObservationBtn" class="btn btn-success w-100 mb-3" disabled>
                <i class="bi bi-plus-circle"></i>
                Log tree at current location
            </button>

            <div id="locationStatus" class="alert alert-secondary small">
                Location not yet available.
            </div>

            <hr>

            <h3 class="h6">Map layers</h3>

            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="observationsToggle" checked>
                <label class="form-check-label" for="observationsToggle">
                    Show observations
                </label>
            </div>

            <div class="mt-3">
                <label for="heatmapOpacity" class="form-label small">
                    Biodiversity layer opacity
                </label>
                <input type="range" class="form-range" id="heatmapOpacity" min="0" max="1" step="0.1" value="0.7">
            </div>
        </aside>

        <main class="col-md-8 col-lg-9 map-wrapper p-0">
            <div id="map"></div>
        </main>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/ol@v10.6.1/dist/ol.js"></script>

<script src="assets/js/api.js"></script>
<script src="assets/js/map.js"></script>
<script src="assets/js/observations.js"></script>
<script src="assets/js/form.js"></script>

</body>
</html>