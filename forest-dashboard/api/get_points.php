<?php
// /forest-dashboard/api/get_points.php

require_once __DIR__ . '/../config/app.php';

use App\Core\Database;
use App\Core\Response;
use App\Repositories\ObservationRepository;

try {
    $repository = new ObservationRepository(Database::connect());

    Response::json([
        'success' => true,
        'points' => $repository->getAllPoints(),
    ]);

} catch (Throwable $e) {
    Response::json([
        'success' => false,
        'message' => $e->getMessage(),
    ], 500);
}