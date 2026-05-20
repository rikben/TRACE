<?php
// /forest-dashboard/public_html/api/submit_observation.php

require_once __DIR__ . '/../../config/app.php';

use App\Core\Database;
use App\Core\Response;
use App\Repositories\ObservationRepository;
use App\Services\ObservationService;
use App\Services\UploadService;

try {
    if (empty($_POST['payload'])) {
        Response::json([
            'success' => false,
            'message' => 'Missing payload.',
        ], 400);
    }

    $input = json_decode($_POST['payload'], true);

    if (!$input) {
        Response::json([
            'success' => false,
            'message' => 'Invalid JSON payload.',
        ], 400);
    }

    if (!empty($_FILES['photo'])) {
        $uploadService = new UploadService();
        $input['photo_path'] = $uploadService->storeImage($_FILES['photo']);
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