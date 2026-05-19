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

    async submitObservation(data) {
        const response = await fetch('/api/submit_observation.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return await response.json();
    }
};