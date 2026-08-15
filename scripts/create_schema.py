import sqlite3

DB_PATH = "elderskill.db"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

cursor.executescript("""
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    full_name TEXT,
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    summary TEXT,
    years_of_experience INTEGER,
    primary_skill TEXT,
    location_city TEXT,
    profile_completeness REAL DEFAULT 0,
    interview_count INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    skill_name TEXT NOT NULL,
    years_of_experience INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS interviews (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    status TEXT,
    progress_percentage REAL,
    questions_answered INTEGER,
    summary_generated TEXT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY,
    interview_id TEXT NOT NULL,
    question_text TEXT,
    question_number INTEGER,
    FOREIGN KEY (interview_id) REFERENCES interviews(id)
);

CREATE TABLE IF NOT EXISTS answers (
    id TEXT PRIMARY KEY,
    interview_id TEXT NOT NULL,
    question_id TEXT,
    transcript TEXT,
    input_type TEXT,
    asr_provider TEXT,
    created_at TIMESTAMP,
    FOREIGN KEY (interview_id) REFERENCES interviews(id),
    FOREIGN KEY (question_id) REFERENCES questions(id)
);
""")

conn.commit()
conn.close()

print("Database schema created successfully.")