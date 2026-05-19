-- /forest-dashboard/sql/schema.sql

CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_text TEXT NOT NULL,
    question_type VARCHAR(30) NOT NULL,
    options_json JSON NULL,
    required BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    answer_text TEXT NULL,
    answer_number DECIMAL(10, 2) NULL,
    answer_json JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (observation_id) REFERENCES observations(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id)
);