-- /forest-dashboard/sql/schema.sql

CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_key VARCHAR(100) UNIQUE NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM(
        'text',
        'number',
        'boolean',
        'single_choice',
        'multiple_choice',
        'rating'
    ) NOT NULL,
    hint_text TEXT NULL,
    image_path VARCHAR(255) NULL,
    required BOOLEAN DEFAULT TRUE,
    min_value INT NULL,
    max_value INT NULL,
    sort_order INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE question_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    option_value VARCHAR(255) NOT NULL,
    option_label VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id)
      REFERENCES questions(id)
      ON DELETE CASCADE
);

CREATE TABLE observations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    accuracy_m DECIMAL(8, 2) NULL,
    final_score TINYINT NOT NULL,
    photo_path VARCHAR(255) NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (final_score BETWEEN 0 AND 10)
);

CREATE TABLE observation_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    observation_id INT NOT NULL,
    question_id INT NOT NULL,
    answer_value TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (observation_id)
        REFERENCES observations(id)
        ON DELETE CASCADE,
    FOREIGN KEY (question_id)
        REFERENCES questions(id)
);