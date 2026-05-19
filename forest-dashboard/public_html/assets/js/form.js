// /forest-dashboard/public_html/assets/js/form.js

document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('logObservationBtn');

    button.addEventListener('click', async () => {
        if (!AppMap.userLocation) {
            alert('Please get your current location first.');
            return;
        }

        const finalScore = prompt('Give this tree a final biodiversity score from 0 to 10:');

        if (finalScore === null) {
            return;
        }

        const score = Number(finalScore);

        if (Number.isNaN(score) || score < 0 || score > 10) {
            alert('Please enter a number between 0 and 10.');
            return;
        }

        const notes = prompt('Optional notes about this tree:') || '';

        const payload = {
            latitude: AppMap.userLocation.latitude,
            longitude: AppMap.userLocation.longitude,
            accuracy_m: AppMap.userLocation.accuracy,
            final_score: score,
            notes,
            responses: []
        };

        const result = await Api.submitObservation(payload);

        if (!result.success) {
            alert(result.message || 'Something went wrong.');
            return;
        }

        alert('Observation saved.');

        Observations.load();
    });
});