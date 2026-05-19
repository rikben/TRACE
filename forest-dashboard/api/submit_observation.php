<?php
// /forest-dashboard/api/submit_observation.php

require_once __DIR__ . '/../config/app.php';

use App\Core\Database;
use App\Core\Response;
use App\Repositories\ObservationRepository;
use App\Services\ObservationService;

try {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        Response::json([
            'success' => false,
            'message' => 'Invalid JSON input.',
        ], 400);
    }

    $db = Database::connect();

    $repository = new ObservationRepository($db);
    $service = new ObservationService($repository, $db);

    $observationId = $service->create($input);

    Response::json([
        'success' => true,
        'observation_id' => $observationId,
    ]);

} catch (Throwable $e) {
    Response::json([
        'success' => false,
        'message' => $e->getMessage(),
    ], 500);
}