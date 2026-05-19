<?php
// /forest-dashboard/api/get_questions.php

require_once __DIR__ . '/../config/app.php';

use App\Core\Database;
use App\Core\Response;
use App\Repositories\QuestionRepository;

try {
    $repository = new QuestionRepository(Database::connect());

    Response::json([
        'success' => true,
        'questions' => $repository->getActiveQuestions(),
    ]);

} catch (Throwable $e) {
    Response::json([
        'success' => false,
        'message' => $e->getMessage(),
    ], 500);
}