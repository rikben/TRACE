<?php
// /forest-dashboard/app/Services/ObservationService.php

namespace App\Services;

use App\Repositories\ObservationRepository;
use Exception;
use PDO;

class ObservationService
{
    public function __construct(
        private ObservationRepository $observations,
        private PDO $db
    ) {
    }

    public function create(array $data): int
    {
        $this->validate($data);

        try {
            $this->db->beginTransaction();

            $observationId = $this->observations->createObservation($data);

            foreach ($data['responses'] ?? [] as $response) {
                $this->observations->createResponse($observationId, $response);
            }

            $this->db->commit();

            return $observationId;

        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    private function validate(array $data): void
    {
        if (!isset($data['latitude'], $data['longitude'], $data['final_score'])) {
            throw new Exception('Missing required observation fields.');
        }

        if ($data['latitude'] < -90 || $data['latitude'] > 90) {
            throw new Exception('Invalid latitude.');
        }

        if ($data['longitude'] < -180 || $data['longitude'] > 180) {
            throw new Exception('Invalid longitude.');
        }

        if ($data['final_score'] < 0 || $data['final_score'] > 10) {
            throw new Exception('Final score must be between 0 and 10.');
        }

        foreach ($data['responses'] ?? [] as $response) {
            if (!isset($response['question_id'])) {
                throw new Exception('A response is missing question_id.');
            }

            if (!array_key_exists('answer_value', $response)) {
                throw new Exception('A response is missing answer_value.');
            }
        }
    }
}