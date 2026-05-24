<?php
// /forest-dashboard/public_html/potree-test.php
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Potree Test</title>

    <link rel="stylesheet" href="assets/vendor/potree/build/potree/potree.css">
    <link rel="stylesheet" href="assets/vendor/potree/libs/jquery-ui/jquery-ui.min.css">

    <style>
        html,
        body {
            margin: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }

        #potree_render_area {
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>

<div class="potree_container" style="position:absolute; width:100%; height:100%; left:0; top:0;">
    <div id="potree_render_area"></div>
    <div id="potree_sidebar_container"></div>
</div>

<script src="assets/vendor/potree/libs/jquery/jquery-3.1.1.min.js"></script>
<script src="assets/vendor/potree/libs/spectrum/spectrum.js"></script>
<script src="assets/vendor/potree/libs/jquery-ui/jquery-ui.min.js"></script>
<script src="assets/vendor/potree/libs/three.js/build/three.min.js"></script>
<script src="assets/vendor/potree/libs/other/BinaryHeap.js"></script>
<script src="assets/vendor/potree/libs/tween/tween.min.js"></script>
<script src="assets/vendor/potree/libs/d3/d3.js"></script>
<script src="assets/vendor/potree/libs/proj4/proj4.js"></script>
<script src="assets/vendor/potree/libs/openlayers3/ol.js"></script>
<script src="assets/vendor/potree/libs/i18next/i18next.js"></script>
<script src="assets/vendor/potree/libs/jstree/jstree.js"></script>
<script src="assets/vendor/potree/build/potree/potree.js"></script>

<script>
    window.viewer = new Potree.Viewer(document.getElementById("potree_render_area"));

    viewer.setEDLEnabled(true);
    viewer.setFOV(60);
    viewer.setPointBudget(1_000_000);
    viewer.loadSettingsFromURL();

    viewer.setDescription("Point cloud test");

    Potree.loadPointCloud(
        "assets/pointclouds/lion_takanawa_ept_laz/metadata.json",
        "Lion point cloud",
        event => {
            const pointcloud = event.pointcloud;

            viewer.scene.addPointCloud(pointcloud);

            pointcloud.material.size = 1;
            pointcloud.material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
            pointcloud.material.shape = Potree.PointShape.CIRCLE;

            viewer.fitToScreen();
        }
    );
</script>

</body>
</html>