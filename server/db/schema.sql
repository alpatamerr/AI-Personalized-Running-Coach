-- Drop existing tables if they exist
DROP TABLE IF EXISTS strava_tokens CASCADE;
DROP TABLE IF EXISTS run_data CASCADE;
DROP TABLE IF EXISTS goals CASCADE; 
DROP TABLE IF EXISTS training_plans CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS plan_details CASCADE;

-- Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Strava Tokens Table
CREATE TABLE strava_tokens (
    athlete_id BIGINT PRIMARY KEY,
    access_token VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255) NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Goal Table
CREATE TABLE goals (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    distance VARCHAR(50) NOT NULL, -- e.g., "5K", "10K", "Half Marathon", "Full Marathon"
    target_time VARCHAR(50) NOT NULL, -- e.g., "00:26:00" for 5K under 26 minutes
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Training Plans Table
CREATE TABLE training_plans (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    goal VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE plan_details (
    id BIGSERIAL PRIMARY KEY,
    training_plan_id BIGINT NOT NULL REFERENCES training_plans(id) ON DELETE CASCADE,
    week INTEGER NOT NULL,
    day VARCHAR(10) NOT NULL,
    type VARCHAR(50) NOT NULL,
    distance DECIMAL(5,2),
    target_pace TEXT,
    note TEXT,
    explanation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE run_data (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL, -- Strava athlete.id
    distance_km DECIMAL(5, 2), -- Distance in kilometers
    duration_minutes DECIMAL(5, 2), -- Duration in minutes
    pace FLOAT, -- Average pace (minutes per kilometer)
    average_cadence FLOAT, -- Average cadence
    has_heartrate BOOLEAN DEFAULT FALSE, -- Whether the activity includes heart rate data
    average_heartrate FLOAT, -- Average heart rate
    max_heartrate FLOAT, -- Maximum heart rate
    run_date DATE NOT NULL, -- Date of the run
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Record creation timestamp
    UNIQUE (user_id, run_date) -- Prevent duplicate entries for the same user and date
);



CREATE TABLE training_records (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    record_type VARCHAR(20) NOT NULL CHECK (record_type IN ('run','race','weekly_plan')),
    -- Run/Race data
    distance_km DECIMAL(5,2),
    duration_minutes DECIMAL(5,2),
    pace DECIMAL(4,2),
    average_cadence INTEGER,
    average_heartrate INTEGER,
    run_date DATE,
    -- Race-specific
    race_name VARCHAR(100),
    race_location VARCHAR(100),
    race_date DATE,
    
    -- Weekly plan-specific
    plan_week_start_date DATE,
    day_of_week VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Add indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_training_plans_user_id ON training_plans(user_id);
CREATE INDEX idx_run_data_user_id ON run_data(user_id);
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_strava_tokens_athlete_id ON strava_tokens(athlete_id);
CREATE INDEX idx_training_records_user_id ON training_records(user_id);
CREATE INDEX idx_training_records_type ON training_records(record_type);
CREATE INDEX idx_training_records_run_date ON training_records(run_date);
CREATE INDEX idx_training_records_plan_week_start_date ON training_records(plan_week_start_date);
CREATE INDEX idx_plan_details_training_plan_id ON plan_details(training_plan_id);
CREATE INDEX idx_plan_details_week ON plan_details(week);
CREATE INDEX idx_plan_details_day ON plan_details(day);
CREATE INDEX idx_plan_details_type ON plan_details(type);
CREATE INDEX idx_plan_details_created_at ON plan_details(created_at);