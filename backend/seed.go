package main

import (
	"encoding/json"
	"fmt"
)

func (s *Server) seedData() error {
	if _, err := s.db.Exec("SET FOREIGN_KEY_CHECKS = 0"); err != nil {
		return err
	}
	defer s.db.Exec("SET FOREIGN_KEY_CHECKS = 1")
	for _, table := range []string{"attempts", "internships", "companies", "roadmaps", "assessments", "events", "rewards", "soft_skill_lessons"} {
		if _, err := s.db.Exec("TRUNCATE TABLE " + table); err != nil {
			return fmt.Errorf("truncate %s: %w", table, err)
		}
	}
	videoOne, _ := json.Marshal([]string{"https://example.com/video1"})
	videoTwo, _ := json.Marshal([]string{"https://example.com/video2"})
	companies, err := s.db.Exec("INSERT INTO companies (name,description,culture_video_urls) VALUES (?,?,?),(?,?,?)", "TechFlow Systems", "AI-first engineering company", videoOne, "DataScale AI", "Data analytics platform", videoTwo)
	if err != nil {
		return err
	}
	firstCompany, err := companies.LastInsertId()
	if err != nil {
		return err
	}
	modules, _ := json.Marshal([]map[string]any{{"title": "Basics", "level": "Beginner", "tasks": []map[string]string{{"title": "HTML/CSS", "description": "Learn structure and style"}}}, {"title": "Advanced React", "level": "Intermediate", "tasks": []map[string]string{{"title": "Hooks", "description": "Master React hooks"}}}})
	if _, err = s.db.Exec("INSERT INTO roadmaps (name,slug,description,modules_json) VALUES (?,?,?,?)", "Frontend Developer", "frontend", "Master modern web development", modules); err != nil {
		return err
	}
	tagsOne, _ := json.Marshal([]string{"React"})
	tagsTwo, _ := json.Marshal([]string{"Python"})
	if _, err = s.db.Exec("INSERT INTO internships (role,company_id,location,stipend,duration,tags,is_verified) VALUES (?,?,?,?,?,?,TRUE),(?,?,?,?,?,?,TRUE)", "Frontend Intern", firstCompany, "Remote", "₹25,000", "6 months", tagsOne, "Data Science Intern", firstCompany+1, "Pune", "₹30,000", "3 months", tagsTwo); err != nil {
		return err
	}
	questions, _ := json.Marshal([]map[string]any{{"text": "What is JSX?", "options": []string{"A JS extension", "A CSS framework", "A database", "None"}, "correctOption": 0}})
	if _, err = s.db.Exec("INSERT INTO assessments (title,category,questions_json,points) VALUES (?,?,?,?)", "React Fundamentals", "Frontend", questions, 200); err != nil {
		return err
	}
	if _, err = s.db.Exec("INSERT INTO events (title,city,event_date,month_tag,image) VALUES (?,?,?,?,?)", "Global AI Summit", "Delhi", "2024-12-15", "Dec", "https://images.unsplash.com/photo-1540575861501-7ad05823c9f5"); err != nil {
		return err
	}
	if _, err = s.db.Exec("INSERT INTO rewards (title,description,points_required,partner,category) VALUES (?,?,?,?,?)", "50% Off IIT Jodhpur Courses", "Unlock exclusive academic benefits", 5000, "IIT Jodhpur", "Education"); err != nil {
		return err
	}
	return nil
}
