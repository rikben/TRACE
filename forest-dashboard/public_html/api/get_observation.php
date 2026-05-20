<?php
// /forest-dashboard/public_html/api/get_observation.php

require_once __DIR__ . '/../../config/app.php';

use App\Core\Database;
use App\Core\Response;
use App\Repositories\ObservationRepository;

try {
    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

    if ($id <= 0) {
        Response::json([
            'success' => false,
            'message' => 'Invalid observation id.',
        ], 400);
    }

    $repository = new ObservationRepository(Database::connect());
    $observation = $repository->getObservationWithResponses($id);

    if (!$observation) {
        Response::json([
            'success' => false,
            'message' => 'Observation not found.',
        ], 404);
    }

    Response::json([
        'success' => true,
        'observation' => $observation,
    ]);

} catch (Throwable $e) {
    Response::json([
        'success' => false,
        'message' => $e->getMessage(),
    ], 500);
}