-- /forest-dashboard/sql/seed_questions.sql

-- =========================================================
-- QUESTION 1
-- =========================================================

INSERT INTO questions (
    question_key,
    question_text,
    question_type,
    hint_text,
    image_path,
    required,
    min_value,
    max_value,
    sort_order,
    active
)
VALUES (
           'deciduous_forest_context',
           'Before you start: are you recording this observation in a deciduous forest environment?',
           'single_choice',
           'This questionnaire and biodiversity interpretation are designed primarily for deciduous forest environments. Your answer helps us understand how well the observation fits the intended use of the model.',
           NULL,
           TRUE,
           NULL,
           NULL,
           1,
           TRUE
       );

SET @question_id = LAST_INSERT_ID();

INSERT INTO question_options (
    question_id,
    option_value,
    option_label,
    sort_order
)
VALUES
    (@question_id, 'yes_deciduous', 'Yes, this is mainly a deciduous forest', 1),
    (@question_id, 'mixed_forest', 'Partly, this is a mixed forest', 2),
    (@question_id, 'no_other_forest', 'No, this is another type of forest or environment', 3),
    (@question_id, 'unknown', 'I am not sure', 4);

-- =========================================================
-- QUESTION 2
-- =========================================================

INSERT INTO questions (
    question_key,
    question_text,
    question_type,
    hint_text,
    image_path,
    required,
    min_value,
    max_value,
    sort_order,
    active
)
VALUES (
           'biodiversity_knowledge_level',
           'How would you describe your knowledge level on biodiversity?',
           'single_choice',
           'There is no wrong answer. This helps us understand how citizen observations may differ between beginners and more experienced participants.',
           NULL,
           TRUE,
           NULL,
           NULL,
           2,
           TRUE
       );

SET @question_id = LAST_INSERT_ID();

INSERT INTO question_options (
    question_id,
    option_value,
    option_label,
    sort_order
)
VALUES
    (@question_id, 'none', 'None', 1),
    (@question_id, 'limited', 'Limited', 2),
    (@question_id, 'decent', 'Decent', 3),
    (@question_id, 'advanced', 'Advanced', 4);

-- =========================================================
-- QUESTION 3
-- =========================================================

INSERT INTO questions (
    question_key,
    question_text,
    question_type,
    hint_text,
    image_path,
    required,
    min_value,
    max_value,
    sort_order,
    active
)
VALUES (
           'tree_photo',
           'Take a clear photo of the tree',
           'photo',
           'A photo helps verify the observation and gives useful context for improving the biodiversity model.',
           NULL,
           TRUE,
           NULL,
           NULL,
           3,
           TRUE
       );

-- =========================================================
-- QUESTION 4
-- =========================================================

INSERT INTO questions (
    question_key,
    question_text,
    question_type,
    hint_text,
    image_path,
    required,
    min_value,
    max_value,
    sort_order,
    active
)
VALUES (
           'tree_height',
           'Give an estimate of the tree height',
           'single_choice',
           'Tree height helps estimate forest maturity and habitat complexity. Taller trees often support more ecological niches.',
           NULL,
           TRUE,
           NULL,
           NULL,
           4,
           TRUE
       );

SET @question_id = LAST_INSERT_ID();

INSERT INTO question_options (
    question_id,
    option_value,
    option_label,
    sort_order
)
VALUES
    (@question_id, '1_3', '1-3 meters', 1),
    (@question_id, '3_5', '3-5 meters', 2),
    (@question_id, '5_plus', '5+ meters', 3);

-- =========================================================
-- QUESTION 5
-- =========================================================

INSERT INTO questions (
    question_key,
    question_text,
    question_type,
    hint_text,
    image_path,
    required,
    sort_order,
    active
)
VALUES (
           'crown_shape',
           'What is the main crown shape?',
           'single_choice',
           'Tree crown structure influences light availability, nesting opportunities, and microclimates within forests.',
           'assets/images/tree_crowns.webp',
           TRUE,
           5,
           TRUE
       );

SET @question_id = LAST_INSERT_ID();

INSERT INTO question_options (
    question_id,
    option_value,
    option_label,
    sort_order
)
VALUES
    (@question_id, 'round', 'Round', 1),
    (@question_id, 'conical', 'Conical', 2),
    (@question_id, 'irregular', 'Irregular', 3),
    (@question_id, 'layered', 'Layered', 4),
    (@question_id, 'unknown', 'I don’t know', 5);

-- =========================================================
-- QUESTION 6
-- =========================================================

INSERT INTO questions (
    question_key,
    question_text,
    question_type,
    hint_text,
    image_path,
    required,
    sort_order,
    active
)
VALUES (
           'canopy_density',
           'How dense is the canopy overhead?',
           'single_choice',
           'Canopy density affects temperature, moisture, and the amount of sunlight reaching the forest floor.',
           NULL,
           TRUE,
           6,
           TRUE
       );

SET @question_id = LAST_INSERT_ID();

INSERT INTO question_options (
    question_id,
    option_value,
    option_label,
    sort_order
)
VALUES
    (@question_id, 'open', 'Open', 1),
    (@question_id, 'semi_closed', 'Semi-closed', 2),
    (@question_id, 'closed', 'Closed', 3);

-- =========================================================
-- QUESTION 7
-- =========================================================

INSERT INTO questions (
    question_key,
    question_text,
    question_type,
    hint_text,
    image_path,
    required,
    sort_order,
    active
)
VALUES (
           'tree_species',
           'What type of tree is it?',
           'single_choice',
           'Different tree species support different ecosystems and wildlife communities.',
           'assets/images/tree_species.webp',
           TRUE,
           7,
           TRUE
       );

SET @question_id = LAST_INSERT_ID();

INSERT INTO question_options (
    question_id,
    option_value,
    option_label,
    sort_order
)
VALUES
    (@question_id, 'pine', 'Pine', 1),
    (@question_id, 'spruce', 'Spruce', 2),
    (@question_id, 'poplar', 'Poplar', 3),
    (@question_id, 'cypress', 'Cypress', 4),
    (@question_id, 'linden', 'Linden', 5),
    (@question_id, 'oak', 'Oak', 6),
    (@question_id, 'maple', 'Maple', 7),
    (@question_id, 'fir', 'Fir', 8),
    (@question_id, 'ash', 'Ash', 9),
    (@question_id, 'hemlock', 'Hemlock', 10),
    (@question_id, 'beech', 'Beech', 11),
    (@question_id, 'birch', 'Birch', 12),
    (@question_id, 'cedar', 'Cedar', 13),
    (@question_id, 'juniper', 'Juniper', 14),
    (@question_id, 'chestnut', 'Chestnut', 15),
    (@question_id, 'willow', 'Willow', 16),
    (@question_id, 'other', 'Other', 17),
    (@question_id, 'unknown', 'I don''t know', 18);

-- =========================================================
-- QUESTION 8
-- =========================================================

INSERT INTO questions (
    question_key,
    question_text,
    question_type,
    hint_text,
    required,
    sort_order,
    active
)
VALUES (
           'tree_health',
           'Does the tree look healthy?',
           'single_choice',
           'Dead wood and decaying material can actually increase biodiversity by providing habitats and nutrients.',
           TRUE,
           8,
           TRUE
       );

SET @question_id = LAST_INSERT_ID();

INSERT INTO question_options (
    question_id,
    option_value,
    option_label,
    sort_order
)
VALUES
    (@question_id, 'healthy', 'Fully healthy, stem and branches are fully intact', 1),
    (@question_id, 'some_damage', 'Some damage, dead branches/disease present', 2),
    (@question_id, 'poor_condition', 'Poor condition, many dead branches, large part of stem is senescing', 3);

-- =========================================================
-- QUESTION 9
-- =========================================================

INSERT INTO questions (
    question_key,
    question_text,
    question_type,
    hint_text,
    required,
    sort_order,
    active
)
VALUES (
           'animal_activity',
           'Do you notice any signs of animal life around the tree?',
           'single_choice',
           'Bird nests, insects, and spiderwebs are important indicators of ecological activity and habitat quality.',
           TRUE,
           9,
           TRUE
       );

SET @question_id = LAST_INSERT_ID();

INSERT INTO question_options (
    question_id,
    option_value,
    option_label,
    sort_order
)
VALUES
    (@question_id, 'a_lot', 'Yes, a lot', 1),
    (@question_id, 'some', 'Some, but limited', 2),
    (@question_id, 'none', 'None', 3);

-- =========================================================
-- QUESTION 10
-- =========================================================

INSERT INTO questions (
    question_key,
    question_text,
    question_type,
    hint_text,
    required,
    sort_order,
    active
)
VALUES (
           'ground_cover',
           'How would you describe the ground cover around the tree?',
           'single_choice',
           'Undergrowth and organic litter create habitats for insects, fungi, and microorganisms.',
           TRUE,
           10,
           TRUE
       );

SET @question_id = LAST_INSERT_ID();

INSERT INTO question_options (
    question_id,
    option_value,
    option_label,
    sort_order
)
VALUES
    (@question_id, 'diverse', 'Diverse, full of undergrowth, organic litter, moss', 1),
    (@question_id, 'moderate', 'Some undergrowth, more empty space', 2),
    (@question_id, 'empty', 'Empty soil', 3);

-- =========================================================
-- QUESTION 11
-- =========================================================

INSERT INTO questions (
    question_key,
    question_text,
    question_type,
    hint_text,
    required,
    min_value,
    max_value,
    sort_order,
    active
)
VALUES (
           'final_score',
           'Based on the questions you answered, how much do you agree with the biodiversity heatmap?',
           'rating',
           'Your assessment helps validate and improve the biodiversity prediction model.',
           TRUE,
           1,
           5,
           11,
           TRUE
       );