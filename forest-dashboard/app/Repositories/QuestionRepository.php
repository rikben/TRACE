<?php
// /forest-dashboard/app/Repositories/QuestionRepository.php

namespace App\Repositories;

use PDO;

class QuestionRepository
{
    public function __construct(private PDO $db)
    {
    }

    public function getActiveQuestions(): array
    {
        $sql = "
            SELECT 
                id,
                question_text,
                question_type,
                options_json,
                required,
                sort_order
            FROM questions
            WHERE active = TRUE
            ORDER BY sort_order ASC, id ASC
        ";

        $stmt = $this->db->query($sql);
        $questions = $stmt->fetchAll();

        foreach ($questions as &$question) {
            $question['options'] = $question['options_json']
                ? json_decode($question['options_json'], true)
                : null;

            unset($question['options_json']);
        }

        return $questions;
    }
}