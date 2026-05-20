<?php
// /forest-dashboard/app/Repositories/ObservationRepository.php

namespace App\Repositories;

use PDO;

class ObservationRepository
{
    public function __construct(private PDO $db)
    {
    }

    public function getAllPoints(): array
    {
        $sql = "
            SELECT
                id,
                latitude,
                longitude,
                accuracy_m,
                final_score,
                photo_path,
                notes,
                created_at
            FROM observations
            ORDER BY created_at DESC
        ";

        return $this->db->query($sql)->fetchAll();
    }

    public function createObservation(array $data): int
    {
        $sql = "
            INSERT INTO observations
            (latitude, longitude, accuracy_m, final_score, photo_path, notes)
            VALUES
            (:latitude, :longitude, :accuracy_m, :final_score, :photo_path, :notes)
        ";

        $stmt = $this->db->prepare($sql);

        $stmt->execute([
            ':latitude' => $data['latitude'],
            ':longitude' => $data['longitude'],
            ':accuracy_m' => $data['accuracy_m'] ?? null,
            ':final_score' => $data['final_score'],
            ':photo_path' => $data['photo_path'] ?? null,
            ':notes' => $data['notes'] ?? null,
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function createResponse(int $observationId, array $response): void
    {
        $sql = "
            INSERT INTO observation_responses
            (observation_id, question_id, answer_value)
            VALUES
            (:observation_id, :question_id, :answer_value)
        ";

        $answerValue = $response['answer_value'] ?? null;

        if (is_array($answerValue)) {
            $answerValue = json_encode($answerValue);
        }

        $stmt = $this->db->prepare($sql);

        $stmt->execute([
            ':observation_id' => $observationId,
            ':question_id' => $response['question_id'],
            ':answer_value' => $answerValue,
        ]);
    }

    public function getObservationWithResponses(int $id): ?array
    {
        $sql = "
            SELECT
                id,
                latitude,
                longitude,
                accuracy_m,
                final_score,
                photo_path,
                notes,
                created_at
            FROM observations
            WHERE id = :id
            LIMIT 1
        ";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);

        $observation = $stmt->fetch();

        if (!$observation) {
            return null;
        }

        $sql = "
            SELECT
                q.id AS question_id,
                q.question_text,
                q.question_type,
                r.answer_value,
                qo.option_label
            FROM observation_responses r
            INNER JOIN questions q ON q.id = r.question_id
            LEFT JOIN question_options qo
                ON qo.question_id = q.id
                AND qo.option_value = r.answer_value
            WHERE r.observation_id = :observation_id
            ORDER BY q.sort_order ASC, q.id ASC
        ";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([':observation_id' => $id]);

        $responses = $stmt->fetchAll();

        foreach ($responses as &$response) {
            $response['display_answer'] = $this->formatDisplayAnswer($response);
        }

        $observation['responses'] = $responses;

        return $observation;
    }

    private function formatDisplayAnswer(array $response): string
    {
        if ($response['question_type'] === 'boolean') {
            return $response['answer_value'] === 'true' ? 'Yes' : 'No';
        }

        if ($response['question_type'] === 'single_choice') {
            return $response['option_label'] ?? $response['answer_value'] ?? '';
        }

        if ($response['question_type'] === 'multiple_choice') {
            return $this->formatMultipleChoiceAnswer(
                (int) $response['question_id'],
                $response['answer_value']
            );
        }

        return (string) ($response['answer_value'] ?? '');
    }

    private function formatMultipleChoiceAnswer(int $questionId, ?string $answerValue): string
    {
        if (!$answerValue) {
            return '';
        }

        $values = json_decode($answerValue, true);

        if (!is_array($values)) {
            return $answerValue;
        }

        if (count($values) === 0) {
            return '';
        }

        $placeholders = implode(',', array_fill(0, count($values), '?'));

        $sql = "
            SELECT option_label
            FROM question_options
            WHERE question_id = ?
            AND option_value IN ({$placeholders})
            ORDER BY sort_order ASC, id ASC
        ";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $questionId,
            ...$values,
        ]);

        $labels = array_column($stmt->fetchAll(), 'option_label');

        return implode(', ', $labels);
    }
}