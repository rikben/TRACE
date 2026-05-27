// /forest-dashboard/public_html/assets/js/pointcloud-viewer.js

const PointCloudViewer = {
    viewers: {},

    loadInto(containerId, path, title = 'Point cloud') {
        const container = document.getElementById(containerId);

        if (!container) {
            return;
        }

        if (typeof Potree === 'undefined') {
            container.innerHTML = `
                <div class="alert alert-danger m-2">
                    The 3D point cloud viewer could not be loaded.
                </div>
            `;
            return;
        }

        this.destroy(containerId);

        container.innerHTML = `
            <div class="text-center text-light p-3">
                Loading 3D tree...
            </div>
        `;

        const renderArea = document.createElement('div');
        renderArea.className = 'embedded-potree-render-area';

        container.innerHTML = '';
        container.appendChild(renderArea);

        const viewer = new Potree.Viewer(renderArea);

        viewer.setEDLEnabled(true);
        viewer.setFOV(60);
        viewer.setPointBudget(700000);
        //viewer.setDescription(title);

        this.viewers[containerId] = viewer;

        try {
            Potree.loadPointCloud(
                path,
                title,
                event => {
                    const pointcloud = event.pointcloud;

                    viewer.scene.addPointCloud(pointcloud);

                    pointcloud.material.size = 1;
                    pointcloud.material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
                    pointcloud.material.shape = Potree.PointShape.CIRCLE;

                    viewer.fitToScreen();
                }
            );
        } catch (error) {
            container.innerHTML = `
                <div class="alert alert-danger m-2">
                    Could not load the 3D tree point cloud.
                </div>
            `;
        }
    },

    destroy(containerId) {
        if (this.viewers[containerId]) {
            delete this.viewers[containerId];
        }

        const container = document.getElementById(containerId);

        if (container) {
            container.innerHTML = '';
        }
    },

    destroyAll() {
        Object.keys(this.viewers).forEach(containerId => {
            this.destroy(containerId);
        });
    }
};