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
            (observation_id, question_id, answer_text, answer_number, answer_json)
            VALUES
            (:observation_id, :question_id, :answer_text, :answer_number, :answer_json)
        ";

        $stmt = $this->db->prepare($sql);

        $stmt->execute([
            ':observation_id' => $observationId,
            ':question_id' => $response['question_id'],
            ':answer_text' => $response['answer_text'] ?? null,
            ':answer_number' => $response['answer_number'] ?? null,
            ':answer_json' => isset($response['answer_json'])
                ? json_encode($response['answer_json'])
                : null,
        ]);
    }
}