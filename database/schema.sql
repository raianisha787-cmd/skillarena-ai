-- ====================================================================
-- SkillArena AI: Database Schema (MySQL 8.0+)
-- Intelligent Campus Skill Assessment & Personalized Learning Platform
-- ====================================================================

CREATE DATABASE IF NOT EXISTS skillarena_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE skillarena_db;

-- --------------------------------------------------------------------
-- 1. CAMPUS HIERARCHY & INSTITUTION DETAILS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS campuses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    campus_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(30) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campus_id) REFERENCES campuses(id) ON DELETE CASCADE,
    UNIQUE KEY uk_campus_dept (campus_id, code)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 2. USER AUTHENTICATION & PROFILES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(180) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('STUDENT', 'FACULTY', 'CAMPUS_ADMIN', 'TPO') DEFAULT 'STUDENT',
    campus_id BIGINT,
    department_id BIGINT,
    roll_number VARCHAR(50),
    graduation_year INT,
    target_role VARCHAR(100) DEFAULT 'Full-Stack Software Engineer',
    current_readiness_score DECIMAL(5, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (campus_id) REFERENCES campuses(id) ON DELETE SET NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 3. SKILL DOMAINS & TAXONOMY
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skill_domains (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category ENUM('CORE_CS', 'SOFTWARE_ENGINEERING', 'DATA_AI', 'CLOUD_DEVOPS', 'SOFT_SKILLS') NOT NULL,
    description TEXT,
    benchmark_industry_score DECIMAL(5,2) DEFAULT 75.00
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 4. ASSESSMENTS & QUESTION BANK
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS assessments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    domain_id BIGINT NOT NULL,
    difficulty ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'CAMPUS_BENCHMARK') DEFAULT 'INTERMEDIATE',
    duration_minutes INT DEFAULT 45,
    total_marks INT DEFAULT 100,
    passing_percentage DECIMAL(5,2) DEFAULT 60.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (domain_id) REFERENCES skill_domains(id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assessment_id BIGINT NOT NULL,
    question_text TEXT NOT NULL,
    code_snippet TEXT,
    sub_skill VARCHAR(100) NOT NULL,
    difficulty ENUM('EASY', 'MEDIUM', 'HARD') DEFAULT 'MEDIUM',
    points INT DEFAULT 10,
    explanation TEXT,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS question_options (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_id BIGINT NOT NULL,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 5. ATTEMPTS, SCORING & COHORT BENCHMARKING
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS assessment_attempts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    assessment_id BIGINT NOT NULL,
    score_obtained DECIMAL(5,2) NOT NULL,
    total_possible DECIMAL(5,2) NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    campus_percentile DECIMAL(5,2) DEFAULT 0.00,
    time_taken_seconds INT NOT NULL,
    status ENUM('SUBMITTED', 'EVALUATED') DEFAULT 'EVALUATED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS attempt_answers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    attempt_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    selected_option_id BIGINT,
    is_correct BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (attempt_id) REFERENCES assessment_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (selected_option_id) REFERENCES question_options(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 6. AI SKILL GAP DIAGNOSTICS & PERSONALIZED LEARNING ROADMAP
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS student_skill_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    domain_id BIGINT NOT NULL,
    proficiency_score DECIMAL(5,2) DEFAULT 0.00,
    gap_score DECIMAL(5,2) DEFAULT 0.00, -- (benchmark - proficiency)
    urgency_level ENUM('LOW', 'MODERATE', 'CRITICAL') DEFAULT 'MODERATE',
    last_assessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (domain_id) REFERENCES skill_domains(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_domain (user_id, domain_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS personalized_roadmaps (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    target_role VARCHAR(150) NOT NULL,
    ai_generated_summary TEXT,
    overall_gap_index DECIMAL(5,2),
    readiness_percentage DECIMAL(5,2),
    status ENUM('IN_PROGRESS', 'COMPLETED', 'ARCHIVED') DEFAULT 'IN_PROGRESS',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS roadmap_milestones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    roadmap_id BIGINT NOT NULL,
    week_number INT NOT NULL,
    milestone_title VARCHAR(255) NOT NULL,
    target_skill VARCHAR(100) NOT NULL,
    recommended_action TEXT NOT NULL,
    curated_resource_url VARCHAR(500),
    estimated_hours INT DEFAULT 6,
    is_completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (roadmap_id) REFERENCES personalized_roadmaps(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 7. SEED DATA FOR DEMO & TESTING
-- --------------------------------------------------------------------
INSERT INTO campuses (id, name, code, city, state) VALUES
(1, 'National Institute of Technology & Engineering', 'NITE-CAMPUS', 'Bengaluru', 'Karnataka');

INSERT INTO departments (id, campus_id, name, code) VALUES
(1, 1, 'Computer Science and Engineering', 'CSE'),
(2, 1, 'Information Technology & AI', 'IT-AI'),
(3, 1, 'Electronics & Communication', 'ECE');

-- BCrypt hashed password 'password123'
INSERT INTO users (id, email, password_hash, first_name, last_name, role, campus_id, department_id, roll_number, graduation_year, target_role, current_readiness_score) VALUES
(1, 'student@skillarena.ai', '$2a$10$7R0Z4K0Z19p5m2PZk080XeI8bO2gW9.oR5F8yvK1Y0O0.sK6kHnVy', 'Anisha', 'Rai', 'STUDENT', 1, 1, 'CS2026-042', 2026, 'Cloud & Fullstack Software Engineer', 78.50),
(2, 'tpo@skillarena.ai', '$2a$10$7R0Z4K0Z19p5m2PZk080XeI8bO2gW9.oR5F8yvK1Y0O0.sK6kHnVy', 'Dr. Priya', 'Nair', 'TPO', 1, 1, 'TPO-OFFICER', 2020, 'Placement Director', 95.00);

INSERT INTO skill_domains (id, name, category, description, benchmark_industry_score) VALUES
(1, 'Data Structures & Algorithms', 'CORE_CS', 'Binary Trees, Graphs, Dynamic Programming, Big-O Optimization', 80.00),
(2, 'Java & Spring Boot Ecosystem', 'SOFTWARE_ENGINEERING', 'Core Java 21, REST APIs, JPA/Hibernate, Spring Security, Microservices', 85.00),
(3, 'Relational Databases & SQL Optimization', 'SOFTWARE_ENGINEERING', 'Schema Design, Normalization, Indexing, Transactions & Locking', 75.00),
(4, 'Frontend Architecture & React.js', 'SOFTWARE_ENGINEERING', 'Component Lifecycle, Hooks, State Management, API integration', 75.00),
(5, 'AI/ML & Python Foundations', 'DATA_AI', 'Model Evaluation, Feature Engineering, NumPy/Pandas, LLM APIs', 70.00),
(6, 'Cloud & DevOps (Docker/CI-CD)', 'CLOUD_DEVOPS', 'Containerization, Docker Compose, GitHub Actions, AWS Basics', 65.00);

-- Assessment 1
INSERT INTO assessments (id, title, description, domain_id, difficulty, duration_minutes, total_marks, passing_percentage, is_active) VALUES
(1, 'Full-Stack Java & Cloud Readiness Assessment', 'Evaluates core Java design patterns, Spring Boot REST architecture, SQL query performance, and containerization.', 2, 'INTERMEDIATE', 30, 40, 65.00, TRUE),
(2, 'DSA & Algorithmic Problem Solving Sprint', 'Campus placement benchmark covering Graph traversals, DP sub-problems, and amortized complexity.', 1, 'ADVANCED', 45, 50, 70.00, TRUE);

-- Questions for Assessment 1
INSERT INTO questions (id, assessment_id, question_text, code_snippet, sub_skill, difficulty, points, explanation) VALUES
(1, 1, 'In Spring Boot, which annotation is recommended for injecting configuration properties mapped from application.yml with type safety?', NULL, 'Spring Boot Config', 'EASY', 10, '@ConfigurationProperties provides strong type checking and IDE autocomplete.'),
(2, 1, 'How does JWT (JSON Web Token) guarantee token integrity between the client and Spring Boot backend?', NULL, 'Security & JWT', 'MEDIUM', 10, 'The cryptographic signature header verified using the server secret key guarantees the payload was not altered.'),
(3, 1, 'What is the most effective database index strategy for a query filtering by (campus_id, graduation_year) and sorting by current_readiness_score DESC?', 'SELECT * FROM users WHERE campus_id = ? AND graduation_year = ? ORDER BY current_readiness_score DESC;', 'MySQL Indexing', 'HARD', 10, 'A composite B-Tree index on (campus_id, graduation_year, current_readiness_score DESC) satisfies both filter and sorting without file-sort.'),
(4, 1, 'In a multi-stage Dockerfile for a Spring Boot and React application, why is multi-staging critical?', NULL, 'Docker & Deployment', 'MEDIUM', 10, 'It separates build tools (Maven/Node) from runtime JRE/Nginx, creating lightweight and secure production images.');

-- Options for Q1
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
(1, '@Value("${property.name}")', FALSE),
(1, '@ConfigurationProperties(prefix = "app")', TRUE),
(1, '@PropertySource("classpath:app.properties")', FALSE),
(1, '@Autowired Environment env', FALSE);

-- Options for Q2
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
(2, 'By encrypting the entire token body with asymmetric keys only', FALSE),
(2, 'By appending a cryptographic signature computed over header + payload using HMAC-SHA256 or RSA', TRUE),
(2, 'By storing the session ID in a server-side Redis cache', FALSE),
(2, 'By base64-encoding the username and password in the Authorization header', FALSE);

-- Options for Q3
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
(3, 'Three independent single-column indexes on each field', FALSE),
(3, 'Composite index: (campus_id, graduation_year, current_readiness_score)', TRUE),
(3, 'Index on current_readiness_score only', FALSE),
(3, 'Clustered primary key indexing only', FALSE);

-- Options for Q4
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
(4, 'It allows executing build steps faster inside the JVM directly', FALSE),
(4, 'It keeps heavy build tooling (JDK, npm cache) out of the final slim runtime container', TRUE),
(4, 'It automatically provisions Kubernetes clusters', FALSE),
(4, 'It bypasses the need for environment variables in staging', FALSE);
