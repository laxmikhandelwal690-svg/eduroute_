package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"net/mail"
	"net/smtp"
	"os"
	"strconv"
	"strings"
)

func (s *Server) pendingStudents(w http.ResponseWriter, r *http.Request) {
	if _, ok := s.requireAdmin(w, r); !ok {
		return
	}
	rows, err := s.queryMaps("SELECT id,name,email,college_verified AS collegeVerified,created_at AS createdAt FROM users WHERE role = 'student' AND college_verified = 'pending' ORDER BY created_at DESC")
	if err != nil {
		failure(w, 500, "Unable to load students")
		return
	}
	success(w, 200, rows)
}
func (s *Server) verifyStudent(w http.ResponseWriter, r *http.Request) {
	if _, ok := s.requireAdmin(w, r); !ok {
		return
	}
	id := strings.TrimSuffix(strings.TrimPrefix(r.URL.Path, "/api/students/"), "/verification")
	var body struct {
		Action string `json:"action"`
	}
	_ = decodeBody(r, &body)
	if body.Action != "approve" && body.Action != "reject" {
		failure(w, 400, "Action must be approve or reject")
		return
	}
	result, err := s.db.Exec("UPDATE users SET college_verified = ? WHERE id = ? AND role = 'student'", map[bool]string{true: "verified", false: "rejected"}[body.Action == "approve"], id)
	if err != nil {
		failure(w, 500, "Unable to update student")
		return
	}
	affected, _ := result.RowsAffected()
	if affected == 0 {
		failure(w, 404, "Student not found")
		return
	}
	rows, _ := s.queryMaps("SELECT id,name,email,college_verified AS collegeVerified FROM users WHERE id = ?", id)
	if len(rows) > 0 {
		success(w, 200, rows[0])
	} else {
		failure(w, 404, "Student not found")
	}
}
func (s *Server) roadmaps(w http.ResponseWriter, r *http.Request) {
	rows, err := s.queryMaps("SELECT id,name,slug,description,icon,modules_json AS modules,updated_by AS updatedBy,created_at AS createdAt,updated_at AS updatedAt FROM roadmaps ORDER BY updated_at DESC")
	if err != nil {
		failure(w, 500, "Unable to load roadmaps")
		return
	}
	for _, row := range rows {
		row["modules"] = parseJSON(row["modules"], []any{})
	}
	success(w, 200, rows)
}
func (s *Server) roadmap(w http.ResponseWriter, r *http.Request, slug string) {
	rows, err := s.queryMaps("SELECT id,name,slug,description,icon,modules_json AS modules,updated_by AS updatedBy FROM roadmaps WHERE slug = ? LIMIT 1", slug)
	if err != nil {
		failure(w, 500, "Unable to load roadmap")
		return
	}
	if len(rows) == 0 {
		success(w, 200, nil)
		return
	}
	rows[0]["modules"] = parseJSON(rows[0]["modules"], []any{})
	success(w, 200, rows[0])
}

func (s *Server) roadmapProgress(w http.ResponseWriter, r *http.Request, slug string) {
	claims, ok := s.requireAuth(w, r)
	if !ok {
		return
	}
	var roadmapID string
	if err := s.db.QueryRow("SELECT id FROM roadmaps WHERE slug = ? LIMIT 1", slug).Scan(&roadmapID); err != nil {
		failure(w, 404, "Roadmap not found")
		return
	}
	if r.Method == "GET" {
		rows, err := s.queryMaps("SELECT completed_tasks AS completedTasks, points_earned AS pointsEarned FROM user_roadmap_progress WHERE user_id = ? AND roadmap_id = ? LIMIT 1", claims.ID, roadmapID)
		if err != nil {
			failure(w, 500, "Unable to load roadmap progress")
			return
		}
		if len(rows) == 0 {
			success(w, 200, map[string]any{"completedTasks": map[string]bool{}, "pointsEarned": 0})
			return
		}
		rows[0]["completedTasks"] = parseJSON(rows[0]["completedTasks"], map[string]bool{})
		success(w, 200, rows[0])
		return
	}
	if r.Method != "PUT" {
		failure(w, 405, "Method not allowed")
		return
	}
	var body struct {
		CompletedTasks map[string]bool `json:"completedTasks"`
		PointsEarned   int             `json:"pointsEarned"`
	}
	if decodeBody(r, &body) != nil {
		failure(w, 400, "Invalid roadmap progress payload")
		return
	}
	encoded, _ := json.Marshal(body.CompletedTasks)
	_, err := s.db.Exec("INSERT INTO user_roadmap_progress (user_id,roadmap_id,completed_tasks,points_earned) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE completed_tasks=VALUES(completed_tasks),points_earned=VALUES(points_earned)", claims.ID, roadmapID, encoded, body.PointsEarned)
	if err != nil {
		failure(w, 500, "Unable to save roadmap progress")
		return
	}
	success(w, 200, map[string]any{"completedTasks": body.CompletedTasks, "pointsEarned": body.PointsEarned})
}
func (s *Server) assessments(w http.ResponseWriter, r *http.Request) {
	rows, err := s.queryMaps("SELECT id,title,category,points,created_at AS createdAt FROM assessments ORDER BY created_at DESC")
	if err != nil {
		failure(w, 500, "Unable to load assessments")
		return
	}
	success(w, 200, rows)
}
func (s *Server) assessment(w http.ResponseWriter, r *http.Request, id string) {
	claims, ok := s.requireAuth(w, r)
	if !ok {
		return
	}
	if r.Method == "GET" {
		rows, err := s.queryMaps("SELECT id,title,category,questions_json AS questions,points,created_at AS createdAt FROM assessments WHERE id = ? LIMIT 1", id)
		if err != nil {
			failure(w, 500, "Unable to load assessment")
			return
		}
		if len(rows) == 0 {
			success(w, 200, nil)
			return
		}
		rows[0]["questions"] = parseJSON(rows[0]["questions"], []any{})
		success(w, 200, rows[0])
		return
	}
	if r.Method == "POST" && strings.HasSuffix(r.URL.Path, "/attempt") {
		var body struct {
			Score          int `json:"score"`
			TotalQuestions int `json:"totalQuestions"`
			Answers        any `json:"answers"`
		}
		_ = decodeBody(r, &body)
		answers, _ := json.Marshal(body.Answers)
		result, err := s.db.Exec("INSERT INTO attempts (user_id,assessment_id,score,total_questions,answers_json) VALUES (?,?,?,?,?)", claims.ID, id, body.Score, body.TotalQuestions, answers)
		if err != nil {
			failure(w, 500, "Unable to save assessment attempt")
			return
		}
		_, _ = s.db.Exec("UPDATE users SET points = points + ? WHERE id = ?", body.Score*10, claims.ID)
		attemptID, _ := result.LastInsertId()
		success(w, 200, map[string]any{"id": strconv.FormatInt(attemptID, 10), "userId": claims.ID, "assessmentId": id, "score": body.Score, "totalQuestions": body.TotalQuestions, "answers": body.Answers})
		return
	}
	failure(w, 405, "Method not allowed")
}
func (s *Server) internships(w http.ResponseWriter, r *http.Request) {
	rows, err := s.queryMaps("SELECT i.id,i.role,i.company_id AS companyId,i.location,i.stipend,i.duration,i.tags,i.is_verified AS isVerified,c.name AS companyName,c.description AS companyDescription,c.logo AS companyLogo,c.website AS companyWebsite FROM internships i JOIN companies c ON c.id = i.company_id")
	if err != nil {
		failure(w, 500, "Unable to load internships")
		return
	}
	for _, row := range rows {
		companyID := idString(row["companyId"])
		row["companyId"] = companyID
		row["tags"] = parseJSON(row["tags"], []any{})
		row["company"] = map[string]any{"id": companyID, "name": row["companyName"], "description": row["companyDescription"], "logo": row["companyLogo"], "website": row["companyWebsite"]}
		delete(row, "companyName")
		delete(row, "companyDescription")
		delete(row, "companyLogo")
		delete(row, "companyWebsite")
	}
	success(w, 200, rows)
}
func (s *Server) company(w http.ResponseWriter, r *http.Request, id string) {
	rows, err := s.queryMaps("SELECT id,name,description,logo,culture_video_urls AS cultureVideoUrls,website FROM companies WHERE id = ? LIMIT 1", id)
	if err != nil {
		failure(w, 500, "Unable to load company")
		return
	}
	if len(rows) == 0 {
		success(w, 200, nil)
		return
	}
	rows[0]["cultureVideoUrls"] = parseJSON(rows[0]["cultureVideoUrls"], []any{})
	success(w, 200, rows[0])
}
func (s *Server) simpleList(w http.ResponseWriter, query string, r *http.Request) {
	rows, err := s.queryMaps(query)
	if err != nil {
		failure(w, 500, "Unable to load data")
		return
	}
	success(w, 200, rows)
}
func (s *Server) buddyChat(w http.ResponseWriter, r *http.Request) {
	if _, ok := s.requireAuth(w, r); !ok {
		return
	}
	var body struct {
		Language string `json:"language"`
	}
	_ = decodeBody(r, &body)
	text := "That's an interesting question! Let's look at your roadmap for guidance."
	if body.Language == "hinglish" {
		text = "Ye kaafi sahi sawaal hai! Chalo tumhare roadmap ko check karte hain guidance ke liye."
	}
	success(w, 200, map[string]any{"text": text})
}

func (s *Server) buddyProgress(w http.ResponseWriter, r *http.Request) {
	claims, ok := s.requireAuth(w, r)
	if !ok {
		return
	}
	var body struct {
		UserID        string   `json:"userId"`
		MissingSkills []string `json:"missingSkills"`
	}
	_ = decodeBody(r, &body)
	userID := claims.ID
	weekly, _ := json.Marshal([]string{"Complete 3 DSA problems", "Ship 1 portfolio section update", "Apply to 2 internships"})
	achievements, _ := json.Marshal([]string{"Welcome to Buddy"})
	missing, _ := json.Marshal([]string{})
	_, err := s.db.Exec("INSERT INTO buddy_progress (user_id, weekly_challenges, achievements, missing_skills) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE user_id = user_id", userID, weekly, achievements, missing)
	if err != nil {
		writeJSON(w, 500, map[string]any{"ok": false, "error": err.Error()})
		return
	}
	if r.Method == "POST" {
		encoded, _ := json.Marshal(body.MissingSkills)
		_, _ = s.db.Exec("UPDATE buddy_progress SET missing_skills = ? WHERE user_id = ?", encoded, userID)
	}
	rows, err := s.queryMaps("SELECT points,level,achievements,weekly_challenges AS weeklyChallenges,missing_skills AS missingSkills,preferred_language AS preferredLanguage FROM buddy_progress WHERE user_id = ?", userID)
	if err != nil || len(rows) == 0 {
		writeJSON(w, 500, map[string]any{"ok": false, "error": "Failed to fetch progress."})
		return
	}
	progress := rows[0]
	progress["achievements"] = parseJSON(progress["achievements"], []any{})
	progress["weeklyChallenges"] = parseJSON(progress["weeklyChallenges"], []any{})
	progress["missingSkills"] = parseJSON(progress["missingSkills"], []any{})
	history, _ := s.queryMaps("SELECT message_role AS role,text,created_at AS createdAt FROM buddy_chat_messages WHERE user_id = ? ORDER BY created_at DESC LIMIT 20", userID)
	for left, right := 0, len(history)-1; left < right; left, right = left+1, right-1 {
		history[left], history[right] = history[right], history[left]
	}
	writeJSON(w, 200, map[string]any{"ok": true, "progress": progress, "history": history})
}

func (s *Server) buddyChatFunction(w http.ResponseWriter, r *http.Request) {
	claims, ok := s.requireAuth(w, r)
	if !ok {
		return
	}
	var body struct{ UserID, Message, Language string }
	_ = decodeBody(r, &body)
	if body.Message == "" {
		writeJSON(w, 400, map[string]any{"ok": false, "error": "message is required."})
		return
	}
	body.UserID = claims.ID
	weekly, _ := json.Marshal([]string{"Build 1 mini project this week"})
	empty, _ := json.Marshal([]string{})
	_, _ = s.db.Exec("INSERT INTO buddy_progress (user_id, weekly_challenges, achievements, missing_skills) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE user_id = user_id", body.UserID, weekly, empty, empty)
	_, _ = s.db.Exec("INSERT INTO buddy_chat_messages (user_id,message_role,text) VALUES (?, 'user', ?)", body.UserID, body.Message)
	reply := "I am Buddy in limited mode, but I can still guide you effectively."
	if body.Language == "hinglish" {
		reply = "Main Buddy hoon. Abhi limited mode hai, but main full guidance dunga."
	} else if body.Language == "hindi" {
		reply = "मैं Buddy हूँ। अभी limited mode में हूँ, लेकिन आपकी पूरी help करूंगा।"
	}
	var points int
	_ = s.db.QueryRow("SELECT points FROM buddy_progress WHERE user_id = ?", body.UserID).Scan(&points)
	points += 5
	level := points/100 + 1
	_, _ = s.db.Exec("INSERT INTO buddy_chat_messages (user_id,message_role,text) VALUES (?, 'assistant', ?)", body.UserID, reply)
	_, _ = s.db.Exec("UPDATE buddy_progress SET points = ?, level = ?, preferred_language = ? WHERE user_id = ?", points, level, body.Language, body.UserID)
	writeJSON(w, 200, map[string]any{"ok": true, "reply": reply, "gamification": map[string]any{"points": points, "level": level, "pointsEarned": 5}})
}

func (s *Server) adminRoadmaps(w http.ResponseWriter, r *http.Request) {
	if expected := os.Getenv("ADMIN_SECRET"); expected != "" && r.Header.Get("x-admin-secret") != expected {
		writeJSON(w, 401, map[string]any{"ok": false, "error": "Unauthorized admin request."})
		return
	}
	if r.Method == "GET" {
		rows, err := s.queryMaps("SELECT id,name AS role,slug,modules_json,updated_by AS updatedBy,updated_at AS updatedAt FROM roadmaps ORDER BY updated_at DESC")
		if err != nil {
			writeJSON(w, 500, map[string]any{"ok": false, "error": err.Error()})
			return
		}
		roadmaps := make([]map[string]any, 0, len(rows))
		for _, row := range rows {
			row["modules"] = parseJSON(row["modules_json"], map[string]any{})
			delete(row, "modules_json")
			roadmaps = append(roadmaps, row)
		}
		writeJSON(w, 200, map[string]any{"ok": true, "roadmaps": roadmaps})
		return
	}
	if r.Method != "POST" {
		writeJSON(w, 405, map[string]any{"ok": false, "error": "Method not allowed"})
		return
	}
	var payload map[string]any
	if decodeBody(r, &payload) != nil {
		writeJSON(w, 400, map[string]any{"ok": false, "error": "Invalid JSON body."})
		return
	}
	role := stringValue(payload["role"], "")
	if role == "" {
		writeJSON(w, 400, map[string]any{"ok": false, "error": "role is required."})
		return
	}
	modules := map[string]any{"beginner": payload["beginner"], "intermediate": payload["intermediate"], "pro": payload["pro"]}
	encoded, _ := json.Marshal(modules)
	_, err := s.db.Exec("INSERT INTO roadmaps (name,slug,modules_json,updated_by) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE name=VALUES(name),modules_json=VALUES(modules_json),updated_by=VALUES(updated_by)", role, role, encoded, stringValue(payload["updatedBy"], "admin"))
	if err != nil {
		writeJSON(w, 500, map[string]any{"ok": false, "error": err.Error()})
		return
	}
	rows, _ := s.queryMaps("SELECT id,name AS role,slug,modules_json,updated_by AS updatedBy,updated_at AS updatedAt FROM roadmaps WHERE slug = ?", role)
	if len(rows) == 0 {
		writeJSON(w, 500, map[string]any{"ok": false, "error": "Failed to save roadmap."})
		return
	}
	roadmap := rows[0]
	parsed := parseJSON(roadmap["modules_json"], map[string]any{})
	delete(roadmap, "modules_json")
	if values, ok := parsed.(map[string]any); ok {
		for key, value := range values {
			roadmap[key] = value
		}
	}
	writeJSON(w, 200, map[string]any{"ok": true, "roadmap": roadmap})
}

func (s *Server) sendEmail(w http.ResponseWriter, r *http.Request) {
	var payload struct{ To, Subject, Text, HTML, ReplyTo string }
	if decodeBody(r, &payload) != nil {
		writeJSON(w, 400, map[string]any{"ok": false, "error": "Invalid JSON body."})
		return
	}
	if _, err := mail.ParseAddress(payload.To); err != nil || payload.Subject == "" || (payload.Text == "" && payload.HTML == "") {
		writeJSON(w, 400, map[string]any{"ok": false, "error": "Invalid email payload."})
		return
	}
	host := os.Getenv("SMTP_HOST")
	user := os.Getenv("SMTP_USER")
	password := os.Getenv("SMTP_PASS")
	if host == "" || user == "" || password == "" {
		writeJSON(w, 500, map[string]any{"ok": false, "error": "Missing required SMTP environment variables."})
		return
	}
	from := env("SMTP_FROM", user)
	message := "From: " + from + "\r\nTo: " + payload.To + "\r\nSubject: " + payload.Subject + "\r\n\r\n" + payload.Text
	if err := smtp.SendMail(host+":"+env("SMTP_PORT", "587"), smtp.PlainAuth("", user, password, host), from, []string{payload.To}, []byte(message)); err != nil {
		writeJSON(w, 500, map[string]any{"ok": false, "error": "Email delivery failed."})
		return
	}
	writeJSON(w, 200, map[string]any{"ok": true})
}

var _ = sql.ErrNoRows
var _ = fmt.Sprint
