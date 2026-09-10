package main

import (
	"database/sql"
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

func ensureSchema(db *sql.DB) error {
	statements := []string{
		`CREATE TABLE IF NOT EXISTS users (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(160) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, role ENUM('student','admin') NOT NULL DEFAULT 'student', is_verified BOOLEAN NOT NULL DEFAULT FALSE, college_verified ENUM('none','pending','verified','rejected') NOT NULL DEFAULT 'none', points INT NOT NULL DEFAULT 0, language_preference ENUM('en','hi','hinglish') NOT NULL DEFAULT 'en', avatar VARCHAR(500) NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
		`CREATE TABLE IF NOT EXISTS otps (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255) NOT NULL, code_hash VARCHAR(255) NOT NULL, expires_at DATETIME NOT NULL, attempt_count INT NOT NULL DEFAULT 0, last_sent_at DATETIME NOT NULL, locked_until DATETIME NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, INDEX idx_otps_email_created (email, created_at)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
		`CREATE TABLE IF NOT EXISTS college_verifications (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user_id INT UNSIGNED NOT NULL, doc_url VARCHAR(1000) NOT NULL, status ENUM('pending','verified','rejected') NOT NULL DEFAULT 'pending', remarks TEXT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
		`CREATE TABLE IF NOT EXISTS roadmaps (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(160) NOT NULL, slug VARCHAR(160) NOT NULL UNIQUE, description TEXT NULL, icon VARCHAR(255) NULL, modules_json JSON NOT NULL, updated_by VARCHAR(160) NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
		`CREATE TABLE IF NOT EXISTS user_roadmap_progress (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user_id INT UNSIGNED NOT NULL, roadmap_id INT UNSIGNED NOT NULL, completed_tasks JSON NOT NULL, points_earned INT NOT NULL DEFAULT 0, UNIQUE KEY uq_user_roadmap (user_id, roadmap_id), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
		`CREATE TABLE IF NOT EXISTS assessments (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, category VARCHAR(160) NOT NULL, questions_json JSON NOT NULL, points INT NOT NULL DEFAULT 100, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
		`CREATE TABLE IF NOT EXISTS attempts (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user_id INT UNSIGNED NOT NULL, assessment_id INT UNSIGNED NOT NULL, score INT NOT NULL, total_questions INT NOT NULL, answers_json JSON NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
		`CREATE TABLE IF NOT EXISTS user_problem_submissions (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user_id INT UNSIGNED NOT NULL, problem_key VARCHAR(160) NOT NULL, problem_name VARCHAR(255) NOT NULL, difficulty ENUM('Easy','Medium','Hard') NOT NULL, status ENUM('Accepted','Attempted') NOT NULL, score INT NOT NULL DEFAULT 0, submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE KEY uq_user_problem (user_id, problem_key), INDEX idx_problem_activity (user_id, submitted_at), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
		`CREATE TABLE IF NOT EXISTS companies (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, description TEXT NULL, logo VARCHAR(500) NULL, culture_video_urls JSON NOT NULL, website VARCHAR(500) NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
		`CREATE TABLE IF NOT EXISTS internships (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, role VARCHAR(255) NOT NULL, company_id INT UNSIGNED NOT NULL, location VARCHAR(255) NULL, stipend VARCHAR(160) NULL, duration VARCHAR(160) NULL, tags JSON NOT NULL, is_verified BOOLEAN NOT NULL DEFAULT FALSE, FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
		`CREATE TABLE IF NOT EXISTS events (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, description TEXT NULL, city VARCHAR(160) NULL, event_date DATETIME NULL, month_tag VARCHAR(32) NULL, image VARCHAR(1000) NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
		`CREATE TABLE IF NOT EXISTS rewards (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, description TEXT NULL, points_required INT NOT NULL, partner VARCHAR(255) NULL, category VARCHAR(160) NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
		`CREATE TABLE IF NOT EXISTS soft_skill_lessons (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, content TEXT NULL, video_url VARCHAR(1000) NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
		`CREATE TABLE IF NOT EXISTS soft_skill_attempts (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user_id INT UNSIGNED NOT NULL, lesson_id INT UNSIGNED NOT NULL, completed BOOLEAN NOT NULL DEFAULT FALSE, UNIQUE KEY uq_user_lesson (user_id, lesson_id), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (lesson_id) REFERENCES soft_skill_lessons(id) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
		`CREATE TABLE IF NOT EXISTS courses (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, description TEXT NOT NULL, category VARCHAR(160) NOT NULL, level ENUM('Beginner','Intermediate','Advanced') NOT NULL DEFAULT 'Beginner', duration VARCHAR(160) NOT NULL, instructor VARCHAR(255) NOT NULL, thumbnail VARCHAR(1000) NULL, playlist_url VARCHAR(1000) NULL, youtube_url VARCHAR(1000) NULL, resource_url VARCHAR(1000) NULL, published BOOLEAN NOT NULL DEFAULT TRUE, created_by INT UNSIGNED NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (created_by) REFERENCES users(id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
		`CREATE TABLE IF NOT EXISTS user_course_progress (user_id INT UNSIGNED NOT NULL, course_id INT UNSIGNED NOT NULL, progress_percent TINYINT UNSIGNED NOT NULL DEFAULT 0, completed_at DATETIME NULL, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (user_id, course_id), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
		`CREATE TABLE IF NOT EXISTS buddy_progress (user_id VARCHAR(160) PRIMARY KEY, points INT NOT NULL DEFAULT 0, level INT NOT NULL DEFAULT 1, achievements JSON NOT NULL, missing_skills JSON NOT NULL, weekly_challenges JSON NOT NULL, preferred_language VARCHAR(32) NOT NULL DEFAULT 'english', created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
		`CREATE TABLE IF NOT EXISTS buddy_chat_messages (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user_id VARCHAR(160) NOT NULL, message_role ENUM('user','assistant','system') NOT NULL, text TEXT NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, INDEX idx_buddy_messages (user_id, created_at)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
	}
	for index, statement := range statements {
		if _, err := db.Exec(statement); err != nil {
			return fmt.Errorf("schema statement %d: %w", index+1, err)
		}
	}
	for column := range map[string]string{"playlist_url": "VARCHAR(1000) NULL", "youtube_url": "VARCHAR(1000) NULL", "resource_url": "VARCHAR(1000) NULL"} {
		var count int
		if err := db.QueryRow("SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'courses' AND column_name = ?", column).Scan(&count); err != nil {
			return fmt.Errorf("check courses.%s: %w", column, err)
		}
		if count == 0 {
			if _, err := db.Exec("ALTER TABLE courses ADD COLUMN " + column + " VARCHAR(1000) NULL"); err != nil {
				return fmt.Errorf("add courses.%s: %w", column, err)
			}
		}
	}
	return nil
}

func (s *Server) ensureDefaultAdmin() error {
	var id int64
	if err := s.db.QueryRow("SELECT id FROM users WHERE email = ? LIMIT 1", "vansh777@gmail.com").Scan(&id); err == nil {
		return nil
	}
	password, err := bcrypt.GenerateFromPassword([]byte("timepass"), 12)
	if err != nil {
		return err
	}
	_, err = s.db.Exec("INSERT INTO users (name,email,password,role,is_verified,college_verified) VALUES (?,?,?,?,TRUE,?)", "EDUROUTE Staff Admin", "vansh777@gmail.com", password, "admin", "verified")
	return err
}

func (s *Server) ensureStarterCourse() error {
	var count int
	if err := s.db.QueryRow("SELECT COUNT(*) FROM courses").Scan(&count); err != nil || count > 0 {
		return err
	}
	var adminID int64
	if err := s.db.QueryRow("SELECT id FROM users WHERE email = ? LIMIT 1", "vansh777@gmail.com").Scan(&adminID); err != nil {
		return err
	}
	_, err := s.db.Exec("INSERT INTO courses (title,description,category,level,duration,instructor,created_by) VALUES (?,?,?,?,?,?,?)", "Web Development Foundations", "Learn HTML, CSS, JavaScript, and the fundamentals needed to build your first web project.", "Development", "Beginner", "8 weeks", "EDUROUTE Learning Team", adminID)
	return err
}

func (s *Server) ensureDemoStudent() error {
	const email = "demo.student@eduroute.local"
	const password = "EduRouteDemo123!"
	var userID int64
	err := s.db.QueryRow("SELECT id FROM users WHERE email = ? LIMIT 1", email).Scan(&userID)
	if err == sql.ErrNoRows {
		hashed, hashErr := bcrypt.GenerateFromPassword([]byte(password), 12)
		if hashErr != nil {
			return hashErr
		}
		result, insertErr := s.db.Exec("INSERT INTO users (name,email,password,role,is_verified,college_verified) VALUES (?,?,?,?,TRUE,?)", "Demo Student", email, hashed, "student", "verified")
		if insertErr != nil {
			return insertErr
		}
		userID, err = result.LastInsertId()
	}
	if err != nil {
		return err
	}
	hashed, hashErr := bcrypt.GenerateFromPassword([]byte(password), 12)
	if hashErr != nil {
		return hashErr
	}
	if _, err = s.db.Exec("UPDATE users SET password = ?, role = 'student', is_verified = TRUE, college_verified = 'verified' WHERE id = ?", hashed, userID); err != nil {
		return err
	}
	_, err = s.db.Exec(`INSERT INTO user_course_progress (user_id, course_id, progress_percent)
		SELECT ?, id, 0 FROM courses WHERE published = TRUE
		ON DUPLICATE KEY UPDATE user_id = VALUES(user_id)`, userID)
	return err
}
