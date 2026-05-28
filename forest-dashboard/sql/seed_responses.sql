-- /forest-dashboard/sql/seed_responses.sql

START TRANSACTION;

DELETE FROM observations
WHERE id BETWEEN 1 AND 15;

INSERT INTO observations
(id, latitude, longitude, accuracy_m, final_score, photo_path, notes, created_at)
VALUES
    (1, 52.0334037, 6.6493844, 21.03, 3, 'public_html/uploads/oak_tree.png', NULL, '2026-05-20 15:22:31'),
    (2, 52.0333956, 6.6491320, 7.00, 5, 'public_html/uploads/oak_tree.png', NULL, '2026-05-20 15:23:02'),
    (3, 52.0326845, 6.6509597, 5.86, 5, 'public_html/uploads/oak_tree.png', NULL, '2026-05-20 15:27:18'),
    (4, 52.0318680, 6.6526343, 46.99, 3, 'public_html/uploads/oak_tree.png', NULL, '2026-05-20 15:27:59'),
    (5, 52.0333956, 6.6491320, 7.00, 5, 'public_html/uploads/oak_tree.png', NULL, '2026-05-20 15:28:23'),
    (6, 52.0323457, 6.6518049, 14.00, 5, 'public_html/uploads/oak_tree.png', NULL, '2026-05-20 15:32:41'),
    (7, 52.0331444, 6.6508423, 3.54, 5, 'public_html/uploads/oak_tree.png', NULL, '2026-05-20 15:36:54'),
    (8, 52.0330779, 6.6503068, 14.00, 1, 'public_html/uploads/oak_tree.png', NULL, '2026-05-20 15:38:32'),
    (9, 52.0333569, 6.6497254, 6.94, 5, 'public_html/uploads/oak_tree.png', NULL, '2026-05-20 15:41:01'),
    (10, 52.0334865, 6.6494305, 3.54, 3, 'public_html/uploads/oak_tree.png', NULL, '2026-05-20 15:43:17'),
    (11, 52.0334865, 6.6494305, 3.54, 5, 'public_html/uploads/oak_tree.png', NULL, '2026-05-20 15:43:17'),
    (12, 52.0333956, 6.6491320, 7.00, 5, 'public_html/uploads/oak_tree.png', NULL, '2026-05-20 15:45:33'),
    (13, 52.0315221, 6.6473976, 18.63, 5, 'public_html/uploads/oak_tree.png', NULL, '2026-05-22 08:39:09'),
    (14, 51.9855239, 5.6645935, 18.32, 3, 'public_html/uploads/oak_tree.png', NULL, '2026-05-22 12:24:53'),
    (15, 51.9869605, 5.6659479, NULL, 5, 'public_html/uploads/oak_tree.png', NULL, '2026-05-28 08:38:14');

INSERT INTO observation_responses
(observation_id, question_id, answer_value, created_at)
SELECT
    response_seed.observation_id,
    questions.id,
    response_seed.answer_value,
    response_seed.created_at
FROM (
         SELECT 1 observation_id, 'deciduous_forest_context' question_key, 'yes_deciduous' answer_value, '2026-05-20 15:22:31' created_at UNION ALL
         SELECT 1, 'biodiversity_knowledge_level', 'limited', '2026-05-20 15:22:31' UNION ALL
         SELECT 1, 'tree_height', '10_plus', '2026-05-20 15:22:31' UNION ALL
         SELECT 1, 'crown_shape', 'irregular', '2026-05-20 15:22:31' UNION ALL
         SELECT 1, 'canopy_density', 'open', '2026-05-20 15:22:31' UNION ALL
         SELECT 1, 'tree_species', 'oak', '2026-05-20 15:22:31' UNION ALL
         SELECT 1, 'tree_health', 'poor_condition', '2026-05-20 15:22:31' UNION ALL
         SELECT 1, 'animal_activity', 'some', '2026-05-20 15:22:31' UNION ALL
         SELECT 1, 'ground_cover', 'moderate', '2026-05-20 15:22:31' UNION ALL
         SELECT 1, 'final_score', '3', '2026-05-20 15:22:31' UNION ALL

         SELECT 2, 'deciduous_forest_context', 'yes_deciduous', '2026-05-20 15:23:02' UNION ALL
         SELECT 2, 'biodiversity_knowledge_level', 'decent', '2026-05-20 15:23:02' UNION ALL
         SELECT 2, 'tree_height', '5_10', '2026-05-20 15:23:02' UNION ALL
         SELECT 2, 'crown_shape', 'round', '2026-05-20 15:23:02' UNION ALL
         SELECT 2, 'canopy_density', 'semi_closed', '2026-05-20 15:23:02' UNION ALL
         SELECT 2, 'tree_species', 'beech', '2026-05-20 15:23:02' UNION ALL
         SELECT 2, 'tree_health', 'healthy', '2026-05-20 15:23:02' UNION ALL
         SELECT 2, 'animal_activity', 'a_lot', '2026-05-20 15:23:02' UNION ALL
         SELECT 2, 'ground_cover', 'moderate', '2026-05-20 15:23:02' UNION ALL
         SELECT 2, 'final_score', '5', '2026-05-20 15:23:02' UNION ALL

         SELECT 3, 'deciduous_forest_context', 'yes_deciduous', '2026-05-20 15:27:18' UNION ALL
         SELECT 3, 'biodiversity_knowledge_level', 'decent', '2026-05-20 15:27:18' UNION ALL
         SELECT 3, 'tree_height', '10_plus', '2026-05-20 15:27:18' UNION ALL
         SELECT 3, 'crown_shape', 'round', '2026-05-20 15:27:18' UNION ALL
         SELECT 3, 'canopy_density', 'semi_closed', '2026-05-20 15:27:18' UNION ALL
         SELECT 3, 'tree_species', 'oak', '2026-05-20 15:27:18' UNION ALL
         SELECT 3, 'tree_health', 'some_damage', '2026-05-20 15:27:18' UNION ALL
         SELECT 3, 'animal_activity', 'a_lot', '2026-05-20 15:27:18' UNION ALL
         SELECT 3, 'ground_cover', 'diverse', '2026-05-20 15:27:18' UNION ALL
         SELECT 3, 'final_score', '5', '2026-05-20 15:27:18' UNION ALL

         SELECT 4, 'deciduous_forest_context', 'yes_deciduous', '2026-05-20 15:27:59' UNION ALL
         SELECT 4, 'biodiversity_knowledge_level', 'limited', '2026-05-20 15:27:59' UNION ALL
         SELECT 4, 'tree_height', '10_plus', '2026-05-20 15:27:59' UNION ALL
         SELECT 4, 'crown_shape', 'irregular', '2026-05-20 15:27:59' UNION ALL
         SELECT 4, 'canopy_density', 'open', '2026-05-20 15:27:59' UNION ALL
         SELECT 4, 'tree_species', 'birch', '2026-05-20 15:27:59' UNION ALL
         SELECT 4, 'tree_health', 'healthy', '2026-05-20 15:27:59' UNION ALL
         SELECT 4, 'animal_activity', 'some', '2026-05-20 15:27:59' UNION ALL
         SELECT 4, 'ground_cover', 'diverse', '2026-05-20 15:27:59' UNION ALL
         SELECT 4, 'final_score', '3', '2026-05-20 15:27:59' UNION ALL

         SELECT 5, 'deciduous_forest_context', 'yes_deciduous', '2026-05-20 15:28:23' UNION ALL
         SELECT 5, 'biodiversity_knowledge_level', 'decent', '2026-05-20 15:28:23' UNION ALL
         SELECT 5, 'tree_height', '10_plus', '2026-05-20 15:28:23' UNION ALL
         SELECT 5, 'crown_shape', 'irregular', '2026-05-20 15:28:23' UNION ALL
         SELECT 5, 'canopy_density', 'open', '2026-05-20 15:28:23' UNION ALL
         SELECT 5, 'tree_species', 'pine', '2026-05-20 15:28:23' UNION ALL
         SELECT 5, 'tree_health', 'some_damage', '2026-05-20 15:28:23' UNION ALL
         SELECT 5, 'animal_activity', 'some', '2026-05-20 15:28:23' UNION ALL
         SELECT 5, 'ground_cover', 'diverse', '2026-05-20 15:28:23' UNION ALL
         SELECT 5, 'final_score', '5', '2026-05-20 15:28:23' UNION ALL

         SELECT 6, 'deciduous_forest_context', 'yes_deciduous', '2026-05-20 15:32:41' UNION ALL
         SELECT 6, 'biodiversity_knowledge_level', 'limited', '2026-05-20 15:32:41' UNION ALL
         SELECT 6, 'tree_height', '10_plus', '2026-05-20 15:32:41' UNION ALL
         SELECT 6, 'crown_shape', 'round', '2026-05-20 15:32:41' UNION ALL
         SELECT 6, 'canopy_density', 'semi_closed', '2026-05-20 15:32:41' UNION ALL
         SELECT 6, 'tree_species', 'pine', '2026-05-20 15:32:41' UNION ALL
         SELECT 6, 'tree_health', 'poor_condition', '2026-05-20 15:32:41' UNION ALL
         SELECT 6, 'animal_activity', 'a_lot', '2026-05-20 15:32:41' UNION ALL
         SELECT 6, 'ground_cover', 'moderate', '2026-05-20 15:32:41' UNION ALL
         SELECT 6, 'final_score', '5', '2026-05-20 15:32:41' UNION ALL

         SELECT 7, 'deciduous_forest_context', 'yes_deciduous', '2026-05-20 15:36:54' UNION ALL
         SELECT 7, 'biodiversity_knowledge_level', 'limited', '2026-05-20 15:36:54' UNION ALL
         SELECT 7, 'tree_height', '10_plus', '2026-05-20 15:36:54' UNION ALL
         SELECT 7, 'crown_shape', 'round', '2026-05-20 15:36:54' UNION ALL
         SELECT 7, 'canopy_density', 'closed', '2026-05-20 15:36:54' UNION ALL
         SELECT 7, 'tree_species', 'unknown', '2026-05-20 15:36:54' UNION ALL
         SELECT 7, 'tree_health', 'healthy', '2026-05-20 15:36:54' UNION ALL
         SELECT 7, 'animal_activity', 'a_lot', '2026-05-20 15:36:54' UNION ALL
         SELECT 7, 'ground_cover', 'diverse', '2026-05-20 15:36:54' UNION ALL
         SELECT 7, 'final_score', '5', '2026-05-20 15:36:54' UNION ALL

         SELECT 8, 'deciduous_forest_context', 'yes_deciduous', '2026-05-20 15:38:32' UNION ALL
         SELECT 8, 'biodiversity_knowledge_level', 'decent', '2026-05-20 15:38:32' UNION ALL
         SELECT 8, 'tree_height', '10_plus', '2026-05-20 15:38:32' UNION ALL
         SELECT 8, 'crown_shape', 'unknown', '2026-05-20 15:38:32' UNION ALL
         SELECT 8, 'canopy_density', 'closed', '2026-05-20 15:38:32' UNION ALL
         SELECT 8, 'tree_species', 'oak', '2026-05-20 15:38:32' UNION ALL
         SELECT 8, 'tree_health', 'healthy', '2026-05-20 15:38:32' UNION ALL
         SELECT 8, 'animal_activity', 'a_lot', '2026-05-20 15:38:32' UNION ALL
         SELECT 8, 'ground_cover', 'diverse', '2026-05-20 15:38:32' UNION ALL
         SELECT 8, 'final_score', '1', '2026-05-20 15:38:32' UNION ALL

         SELECT 9, 'deciduous_forest_context', 'yes_deciduous', '2026-05-20 15:41:01' UNION ALL
         SELECT 9, 'biodiversity_knowledge_level', 'limited', '2026-05-20 15:41:01' UNION ALL
         SELECT 9, 'tree_height', '10_plus', '2026-05-20 15:41:01' UNION ALL
         SELECT 9, 'crown_shape', 'unknown', '2026-05-20 15:41:01' UNION ALL
         SELECT 9, 'canopy_density', 'open', '2026-05-20 15:41:01' UNION ALL
         SELECT 9, 'tree_species', 'oak', '2026-05-20 15:41:01' UNION ALL
         SELECT 9, 'tree_health', 'healthy', '2026-05-20 15:41:01' UNION ALL
         SELECT 9, 'animal_activity', 'a_lot', '2026-05-20 15:41:01' UNION ALL
         SELECT 9, 'ground_cover', 'moderate', '2026-05-20 15:41:01' UNION ALL
         SELECT 9, 'final_score', '5', '2026-05-20 15:41:01' UNION ALL

         SELECT 10, 'deciduous_forest_context', 'yes_deciduous', '2026-05-20 15:43:17' UNION ALL
         SELECT 10, 'biodiversity_knowledge_level', 'limited', '2026-05-20 15:43:17' UNION ALL
         SELECT 10, 'tree_height', '10_plus', '2026-05-20 15:43:17' UNION ALL
         SELECT 10, 'crown_shape', 'irregular', '2026-05-20 15:43:17' UNION ALL
         SELECT 10, 'canopy_density', 'closed', '2026-05-20 15:43:17' UNION ALL
         SELECT 10, 'tree_species', 'beech', '2026-05-20 15:43:17' UNION ALL
         SELECT 10, 'tree_health', 'healthy', '2026-05-20 15:43:17' UNION ALL
         SELECT 10, 'animal_activity', 'a_lot', '2026-05-20 15:43:17' UNION ALL
         SELECT 10, 'ground_cover', 'diverse', '2026-05-20 15:43:17' UNION ALL
         SELECT 10, 'final_score', '3', '2026-05-20 15:43:17' UNION ALL

         SELECT 11, 'deciduous_forest_context', 'yes_deciduous', '2026-05-20 15:43:17' UNION ALL
         SELECT 11, 'biodiversity_knowledge_level', 'limited', '2026-05-20 15:43:17' UNION ALL
         SELECT 11, 'tree_height', '10_plus', '2026-05-20 15:43:17' UNION ALL
         SELECT 11, 'crown_shape', 'irregular', '2026-05-20 15:43:17' UNION ALL
         SELECT 11, 'canopy_density', 'closed', '2026-05-20 15:43:17' UNION ALL
         SELECT 11, 'tree_species', 'beech', '2026-05-20 15:43:17' UNION ALL
         SELECT 11, 'tree_health', 'healthy', '2026-05-20 15:43:17' UNION ALL
         SELECT 11, 'animal_activity', 'a_lot', '2026-05-20 15:43:17' UNION ALL
         SELECT 11, 'ground_cover', 'diverse', '2026-05-20 15:43:17' UNION ALL
         SELECT 11, 'final_score', '5', '2026-05-20 15:43:17' UNION ALL

         SELECT 12, 'deciduous_forest_context', 'yes_deciduous', '2026-05-20 15:45:33' UNION ALL
         SELECT 12, 'biodiversity_knowledge_level', 'decent', '2026-05-20 15:45:33' UNION ALL
         SELECT 12, 'tree_height', '10_plus', '2026-05-20 15:45:33' UNION ALL
         SELECT 12, 'crown_shape', 'round', '2026-05-20 15:45:33' UNION ALL
         SELECT 12, 'canopy_density', 'closed', '2026-05-20 15:45:33' UNION ALL
         SELECT 12, 'tree_species', 'oak', '2026-05-20 15:45:33' UNION ALL
         SELECT 12, 'tree_health', 'healthy', '2026-05-20 15:45:33' UNION ALL
         SELECT 12, 'animal_activity', 'some', '2026-05-20 15:45:33' UNION ALL
         SELECT 12, 'ground_cover', 'diverse', '2026-05-20 15:45:33' UNION ALL
         SELECT 12, 'final_score', '5', '2026-05-20 15:45:33' UNION ALL

         SELECT 13, 'deciduous_forest_context', 'mixed_forest', '2026-05-22 08:39:09' UNION ALL
         SELECT 13, 'biodiversity_knowledge_level', 'none', '2026-05-22 08:39:09' UNION ALL
         SELECT 13, 'tree_height', '5_10', '2026-05-22 08:39:09' UNION ALL
         SELECT 13, 'crown_shape', 'irregular', '2026-05-22 08:39:09' UNION ALL
         SELECT 13, 'canopy_density', 'open', '2026-05-22 08:39:09' UNION ALL
         SELECT 13, 'tree_species', 'poplar', '2026-05-22 08:39:09' UNION ALL
         SELECT 13, 'tree_health', 'healthy', '2026-05-22 08:39:09' UNION ALL
         SELECT 13, 'animal_activity', 'some', '2026-05-22 08:39:09' UNION ALL
         SELECT 13, 'ground_cover', 'moderate', '2026-05-22 08:39:09' UNION ALL
         SELECT 13, 'final_score', '5', '2026-05-22 08:39:09' UNION ALL

         SELECT 14, 'deciduous_forest_context', 'yes_deciduous', '2026-05-22 12:24:53' UNION ALL
         SELECT 14, 'biodiversity_knowledge_level', 'advanced', '2026-05-22 12:24:53' UNION ALL
         SELECT 14, 'tree_height', '10_plus', '2026-05-22 12:24:53' UNION ALL
         SELECT 14, 'crown_shape', 'round', '2026-05-22 12:24:53' UNION ALL
         SELECT 14, 'canopy_density', 'semi_closed', '2026-05-22 12:24:53' UNION ALL
         SELECT 14, 'tree_species', 'poplar', '2026-05-22 12:24:53' UNION ALL
         SELECT 14, 'tree_health', 'healthy', '2026-05-22 12:24:53' UNION ALL
         SELECT 14, 'animal_activity', 'a_lot', '2026-05-22 12:24:53' UNION ALL
         SELECT 14, 'ground_cover', 'diverse', '2026-05-22 12:24:53' UNION ALL
         SELECT 14, 'final_score', '3', '2026-05-22 12:24:53' UNION ALL

         SELECT 15, 'deciduous_forest_context', 'no_other_forest', '2026-05-28 08:38:14' UNION ALL
         SELECT 15, 'biodiversity_knowledge_level', 'advanced', '2026-05-28 08:38:14' UNION ALL
         SELECT 15, 'tree_height', '3_5', '2026-05-28 08:38:14' UNION ALL
         SELECT 15, 'crown_shape', 'irregular', '2026-05-28 08:38:14' UNION ALL
         SELECT 15, 'canopy_density', 'open', '2026-05-28 08:38:14' UNION ALL
         SELECT 15, 'tree_species', 'unknown', '2026-05-28 08:38:14' UNION ALL
         SELECT 15, 'tree_health', 'healthy', '2026-05-28 08:38:14' UNION ALL
         SELECT 15, 'animal_activity', 'some', '2026-05-28 08:38:14' UNION ALL
         SELECT 15, 'ground_cover', 'empty', '2026-05-28 08:38:14' UNION ALL
         SELECT 15, 'final_score', '5', '2026-05-28 08:38:14'
     ) AS response_seed
         INNER JOIN questions
                    ON questions.question_key = response_seed.question_key;

COMMIT;