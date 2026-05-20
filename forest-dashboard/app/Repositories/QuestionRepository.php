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
                question_key,
                question_text,
                question_type,
                hint_text,
                image_path,
                required,
                min_value,
                max_value,
                sort_order
            FROM questions
            WHERE active = TRUE
            ORDER BY sort_order ASC, id ASC
        ";

        $questions = $this->db->query($sql)->fetchAll();

        foreach ($questions as &$question) {
            $question['required'] = (bool) $question['required'];
            $question['options'] = $this->getOptions((int) $question['id']);
        }

        return $questions;
    }

    private function getOptions(int $questionId): array
    {
        $sql = "
            SELECT
                option_value,
                option_label,
                sort_order
            FROM question_options
            WHERE question_id = :question_id
            ORDER BY sort_order ASC, id ASC
        ";

        $stmt = $this->db->prepare($sql);

        $stmt->execute([
            ':question_id' => $questionId,
        ]);

        return $stmt->fetchAll();
    }
}