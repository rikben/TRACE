// /forest-dashboard/public_html/assets/js/intro.js

const IntroModal = {
    currentIndex: 0,
    modal: null,

    pages: [
        {
            icon: 'bi-tree-fill',
            title: 'Welcome to TRACE',
            body: `
                <p>
                    TRACE helps explore forest biodiversity through maps, remote sensing,
                    and citizen science observations.
                </p>

                <p class="text-muted small">
                    You can take a short introduction or skip it and start exploring the dashboard.
                </p>
            `
        },
        {
            icon: 'bi-globe-europe-africa',
            title: 'Why biodiversity matters',
            body: `
                <p>
                    Biodiversity supports the living systems around us: clean air, fertile soils,
                    pollination, cooling, water regulation, and resilient ecosystems.
                </p>

                <p>
                    As ecosystems are increasingly pressured, some may cross tipping points where
                    ecological functions weaken or collapse.
                </p>
            `
        },
        {
            icon: 'bi-tree',
            title: 'Trees as biodiversity anchors',
            body: `
                <p>
                    Trees are more than individual plants. They provide shade, shelter,
                    food, nesting places, and microhabitats for many species.
                </p>

                <p>
                    A single tree can support birds, insects, fungi, mosses, and many other organisms.
                </p>
            `
        },
        {
            icon: 'bi-diagram-3',
            title: 'Simple and complex trees',
            body: `
                <p>
                    Not all trees offer the same habitat value. A simple tree structure may provide
                    fewer niches, while a complex tree can create more opportunities for biodiversity.
                </p>
            
                <p>
                    Below you can explore an example of a complex tree as a 3D point cloud.
                </p>
            
                <div class="intro-pointcloud-card">
                    <div class="small fw-semibold mb-2">
                        Complex tree structure
                    </div>
            
                    <div id="introPointcloudViewer" class="intro-pointcloud-viewer">
                        <div class="text-muted small text-center p-3">
                            Loading 3D tree...
                        </div>
                    </div>
                </div>
            `
        },
        {
            icon: 'bi-geo-alt-fill',
            title: 'Your contribution',
            body: `
                <p>
                    By logging a tree observation, you help compare the biodiversity heatmap with
                    what people observe in the field.
                </p>

                <p>
                    Your answers and photo help validate and improve the model behind the dashboard.
                </p>
            `
        }
    ],

    open() {
        this.currentIndex = 0;

        this.modal = new bootstrap.Modal(
            document.getElementById('introModal')
        );

        this.render();
        this.modal.show();
    },

    render() {
        const page = this.pages[this.currentIndex];
        const container = document.getElementById('introContainer');

        container.classList.remove('intro-step-visible');

        setTimeout(() => {
            container.innerHTML = `
                <div class="intro-card text-center">
                    <div class="intro-icon mb-3">
                        <i class="bi ${page.icon}"></i>
                    </div>

                    <h2 class="h4 mb-3">${page.title}</h2>

                    <div class="intro-body text-start">
                        ${page.body}
                    </div>
                </div>
            `;

            this.updateButtons();
            this.updateProgress();
            this.bindPageActions();

            requestAnimationFrame(() => {
                container.classList.add('intro-step-visible');
            });
        }, 120);
    },

    next() {
        PointCloudViewer.destroyAll();

        if (this.currentIndex < this.pages.length - 1) {
            this.currentIndex++;
            this.render();
            return;
        }

        this.close();
    },

    previous() {
        PointCloudViewer.destroyAll();

        if (this.currentIndex === 0) {
            return;
        }

        this.currentIndex--;
        this.render();
    },

    close() {
        PointCloudViewer.destroyAll();
        this.modal.hide();
    },

    updateButtons() {
        document.getElementById('previousIntroBtn').disabled = this.currentIndex === 0;

        document.getElementById('nextIntroBtn').textContent =
            this.currentIndex === this.pages.length - 1
                ? 'Start exploring'
                : 'Continue';
    },

    updateProgress() {
        const progress = ((this.currentIndex + 1) / this.pages.length) * 100;

        document.getElementById('introProgress').style.width = `${progress}%`;
    },

    bindPageActions() {
        const viewer = document.getElementById('introPointcloudViewer');

        if (!viewer) {
            return;
        }

        setTimeout(() => {
            PointCloudViewer.loadInto(
                'introPointcloudViewer',
                'assets/pointclouds/complex_tree/metadata.json',
                'Complex tree'
            );
        }, 250);
    },
};

document.addEventListener('DOMContentLoaded', () => {
    IntroModal.open();

    document.getElementById('nextIntroBtn').addEventListener('click', () => {
        IntroModal.next();
    });

    document.getElementById('previousIntroBtn').addEventListener('click', () => {
        IntroModal.previous();
    });

    document.getElementById('skipIntroBtn').addEventListener('click', () => {
        IntroModal.close();
    });
});