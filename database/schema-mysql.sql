-- MySQL 8 schema. Spring Data JPA also creates/updates these tables with ddl-auto=update.
CREATE DATABASE IF NOT EXISTS smarthire CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smarthire;
CREATE TABLE IF NOT EXISTS users (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  qualification VARCHAR(100),
  experience DOUBLE NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS user_skills (
  user_id BIGINT NOT NULL,
  skill VARCHAR(100) NOT NULL,
  CONSTRAINT fk_user_skills_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, skill)
);
CREATE TABLE IF NOT EXISTS job_applications (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  job_id BIGINT NOT NULL,
  job_title VARCHAR(255),
  company VARCHAR(255),
  status VARCHAR(40) NOT NULL DEFAULT 'SUBMITTED',
  applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_application_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT uq_user_job UNIQUE (user_id, job_id)
);
