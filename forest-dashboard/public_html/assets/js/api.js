// /forest-dashboard/public_html/assets/js/api.js

const Api = {
    async getQuestions() {
        const response = await fetch('/api/get_questions.php');
        return await response.json();
    },

    async getPoints() {
        const response = await fetch('/api/get_points.php');
        return await response.json();
    },

    async getObservation(id) {
        const response = await fetch(`/api/get_observation.php?id=${encodeURIComponent(id)}`);
        return await response.json();
    },

    async submitObservation(data, photoFile = null) {
        const formData = new FormData();

        formData.append('payload', JSON.stringify(data));

        if (photoFile) {
            formData.append('photo', photoFile);
        }

        const response = await fetch('/api/submit_observation.php', {
            method: 'POST',
            body: formData
        });

        return await response.json();
    }
};