package main

import (
	"database/sql"
	"net/http"
	"strconv"
	"strings"
	"time"
)

func (s *Server) profileDashboard(w http.ResponseWriter, r *http.Request) {
	claims, ok := s.requireAuth(w, r)
	if !ok {
		return
	}
	var name, email, role, avatar string
	var points int
	if err := s.db.QueryRow("SELECT name,email,role,COALESCE(avatar,''),points FROM users WHERE id = ? LIMIT 1", claims.ID).Scan(&name, &email, &role, &avatar, &points); err != nil {
		failure(w, http.StatusNotFound, "User not found")
		return
	}

	var solvedTotal, easy, medium, hard int
	_ = s.db.QueryRow("SELECT COUNT(*), COALESCE(SUM(difficulty = 'Easy'),0), COALESCE(SUM(difficulty = 'Medium'),0), COALESCE(SUM(difficulty = 'Hard'),0) FROM user_problem_submissions WHERE user_id = ? AND status = 'Accepted'", claims.ID).Scan(&solvedTotal, &easy, &medium, &hard)
	var assessmentCount, assessmentScore int
	_ = s.db.QueryRow("SELECT COUNT(*), COALESCE(SUM(score),0) FROM attempts WHERE user_id = ?", claims.ID).Scan(&assessmentCount, &assessmentScore)

	activity, _ := s.dashboardActivity(claims.ID)
	currentStreak, maxStreak := calculateStreak(activity)
	level := points/100 + 1
	levelStart := (level - 1) * 100
	nextLevel := level * 100
	badges := dashboardBadges(solvedTotal, currentStreak, assessmentCount)
	globalRank, platformRank := s.dashboardRanks(claims.ID, points)
	roadmaps := s.dashboardRoadmaps(claims.ID)
	courses := s.dashboardCourses(claims.ID)

	profile := map[string]any{
		"username": usernameFromEmail(email), "fullName": name, "roleBio": role,
		"profilePhoto": avatar, "rank": map[string]int{"global": globalRank, "platform": platformRank},
		"points": points, "xp": map[string]any{"total": points, "level": level, "levelName": levelName(level), "currentLevelXp": levelStart, "nextLevelXp": nextLevel},
		"solved": map[string]int{"total": solvedTotal, "easy": easy, "medium": medium, "hard": hard},
		"scores": map[string]int{"assessmentAttempts": assessmentCount, "assessmentScore": assessmentScore},
		"streak": map[string]int{"current": currentStreak, "max": maxStreak}, "badges": badges,
		"activityHeatmap": activity, "recentActivity": s.dashboardRecentSubmissions(claims.ID), "roadmaps": roadmaps, "courses": courses,
	}
	success(w, http.StatusOK, profile)
}

func usernameFromEmail(email string) string {
	for index, character := range email {
		if character == '@' {
			return email[:index]
		}
	}
	return email
}
func levelName(level int) string {
	switch {
	case level >= 20:
		return "Pro"
	case level >= 15:
		return "Expert"
	case level >= 10:
		return "Advanced"
	case level >= 5:
		return "Explorer"
	default:
		return "Beginner"
	}
}

func (s *Server) dashboardActivity(userID string) ([]map[string]any, error) {
	rows, err := s.queryMaps("SELECT DATE(submitted_at) AS date, COUNT(*) AS count FROM user_problem_submissions WHERE user_id = ? AND submitted_at >= DATE_SUB(CURDATE(), INTERVAL 97 DAY) GROUP BY DATE(submitted_at)", userID)
	if err != nil {
		return []map[string]any{}, err
	}
	counts := map[string]int{}
	for _, row := range rows {
		date := stringValue(row["date"], "")
		if value, ok := row["date"].(time.Time); ok {
			date = value.Format("2006-01-02")
		}
		counts[date] = intValue(row["count"])
	}
	result := make([]map[string]any, 0, 98)
	today := time.Now().UTC()
	for offset := 97; offset >= 0; offset-- {
		day := today.AddDate(0, 0, -offset).Format("2006-01-02")
		result = append(result, map[string]any{"date": day, "count": counts[day]})
	}
	return result, nil
}
func intValue(value any) int {
	switch v := value.(type) {
	case int64:
		return int(v)
	case int:
		return v
	case []byte:
		result, _ := strconv.Atoi(string(v))
		return result
	default:
		result, _ := strconv.Atoi(stringValue(value, "0"))
		return result
	}
}
func calculateStreak(activity []map[string]any) (int, int) {
	current, maximum, running := 0, 0, 0
	for _, item := range activity {
		if intValue(item["count"]) > 0 {
			running++
			if running > maximum {
				maximum = running
			}
		} else {
			running = 0
		}
	}
	for index := len(activity) - 1; index >= 0 && intValue(activity[index]["count"]) > 0; index-- {
		current++
	}
	return current, maximum
}
func dashboardBadges(solved, streak, assessments int) []map[string]any {
	badges := []map[string]any{}
	if streak >= 7 {
		badges = append(badges, map[string]any{"id": "streak-7", "icon": "🔥", "title": "7-Day Streak", "earnedAt": time.Now().UTC().Format("2006-01-02")})
	}
	if solved >= 1 {
		badges = append(badges, map[string]any{"id": "first-problem", "icon": "⚡", "title": "First Problem Solved", "earnedAt": time.Now().UTC().Format("2006-01-02")})
	}
	if assessments >= 1 {
		badges = append(badges, map[string]any{"id": "first-assessment", "icon": "🧠", "title": "First Assessment", "earnedAt": time.Now().UTC().Format("2006-01-02")})
	}
	return badges
}
func (s *Server) dashboardRanks(userID string, points int) (int, int) {
	var global, platform int
	_ = s.db.QueryRow("SELECT COUNT(*) + 1 FROM users WHERE points > ?", points).Scan(&global)
	_ = s.db.QueryRow("SELECT COUNT(*) + 1 FROM users WHERE points > ? AND role = (SELECT role FROM users WHERE id = ?)", points, userID).Scan(&platform)
	return global, platform
}
func (s *Server) dashboardRoadmaps(userID string) []map[string]any {
	rows, _ := s.queryMaps("SELECT r.id,r.name,r.slug,r.description,r.icon,r.modules_json AS modules,COALESCE(urp.points_earned,0) AS pointsEarned,COALESCE(urp.completed_tasks,JSON_ARRAY()) AS completedTasks FROM roadmaps r LEFT JOIN user_roadmap_progress urp ON urp.roadmap_id = r.id AND urp.user_id = ? ORDER BY r.updated_at DESC", userID)
	for _, row := range rows {
		row["modules"] = parseJSON(row["modules"], []any{})
		row["completedTasks"] = parseJSON(row["completedTasks"], []any{})
	}
	return rows
}
func (s *Server) dashboardCourses(userID string) []map[string]any {
	rows, _ := s.queryMaps("SELECT c.id,c.title,c.description,c.category,c.level,c.duration,c.instructor,c.thumbnail,c.playlist_url AS playlistUrl,c.youtube_url AS youtubeUrl,c.resource_url AS resourceUrl,c.published,COALESCE(ucp.progress_percent,0) AS progressPercent,IF(ucp.user_id IS NULL,FALSE,TRUE) AS enrolled FROM courses c LEFT JOIN user_course_progress ucp ON ucp.course_id = c.id AND ucp.user_id = ? WHERE c.published = TRUE ORDER BY c.created_at DESC", userID)
	return rows
}

func (s *Server) dashboardRecentSubmissions(userID string) []map[string]any {
	rows, _ := s.queryMaps("SELECT id,problem_name AS problemName,status,difficulty,submitted_at AS submittedAt,score AS xpEarned FROM user_problem_submissions WHERE user_id = ? ORDER BY submitted_at DESC LIMIT 10", userID)
	return rows
}

func (s *Server) courseProgress(w http.ResponseWriter, r *http.Request) {
	claims, ok := s.requireAuth(w, r)
	if !ok {
		return
	}
	courseID := strings.TrimSuffix(strings.TrimPrefix(r.URL.Path, "/api/courses/"), "/progress")
	var body struct {
		ProgressPercent int  `json:"progressPercent"`
		Completed       bool `json:"completed"`
	}
	if decodeBody(r, &body) != nil {
		failure(w, http.StatusBadRequest, "Invalid progress payload")
		return
	}
	if body.Completed {
		body.ProgressPercent = 100
	}
	if body.ProgressPercent < 0 || body.ProgressPercent > 100 {
		failure(w, http.StatusBadRequest, "Progress must be between 0 and 100")
		return
	}
	completedAt := any(nil)
	if body.ProgressPercent == 100 {
		completedAt = time.Now()
	}
	_, err := s.db.Exec("INSERT INTO user_course_progress (user_id,course_id,progress_percent,completed_at) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE progress_percent=VALUES(progress_percent),completed_at=VALUES(completed_at)", claims.ID, courseID, body.ProgressPercent, completedAt)
	if err != nil {
		failure(w, http.StatusInternalServerError, "Unable to save course progress")
		return
	}
	success(w, http.StatusOK, map[string]any{"courseId": courseID, "progressPercent": body.ProgressPercent, "completed": body.ProgressPercent == 100})
}

func (s *Server) submitProblem(w http.ResponseWriter, r *http.Request) {
	claims, ok := s.requireAuth(w, r)
	if !ok {
		return
	}
	problemKey := strings.TrimSuffix(strings.TrimPrefix(r.URL.Path, "/api/problems/"), "/submit")
	if problemKey == "" {
		failure(w, http.StatusBadRequest, "Problem id is required")
		return
	}
	var body struct {
		Name       string `json:"name"`
		Difficulty string `json:"difficulty"`
		Status     string `json:"status"`
		Score      int    `json:"score"`
	}
	if decodeBody(r, &body) != nil || body.Name == "" {
		failure(w, http.StatusBadRequest, "Problem name is required")
		return
	}
	if body.Difficulty != "Easy" && body.Difficulty != "Medium" && body.Difficulty != "Hard" {
		failure(w, http.StatusBadRequest, "Difficulty must be Easy, Medium, or Hard")
		return
	}
	if body.Status != "Accepted" && body.Status != "Attempted" {
		failure(w, http.StatusBadRequest, "Status must be Accepted or Attempted")
		return
	}
	if body.Score == 0 {
		body.Score = map[string]int{"Easy": 10, "Medium": 20, "Hard": 30}[body.Difficulty]
	}
	var previousStatus string
	previousErr := s.db.QueryRow("SELECT status FROM user_problem_submissions WHERE user_id = ? AND problem_key = ?", claims.ID, problemKey).Scan(&previousStatus)
	_, err := s.db.Exec(`INSERT INTO user_problem_submissions (user_id, problem_key, problem_name, difficulty, status, score) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE problem_name=VALUES(problem_name), difficulty=VALUES(difficulty), status=VALUES(status), score=VALUES(score), submitted_at=CURRENT_TIMESTAMP`, claims.ID, problemKey, body.Name, body.Difficulty, body.Status, body.Score)
	if err != nil {
		failure(w, http.StatusInternalServerError, "Unable to save problem submission")
		return
	}
	if body.Status == "Accepted" && (previousErr == sql.ErrNoRows || previousStatus != "Accepted") {
		_, _ = s.db.Exec("UPDATE users SET points = points + ? WHERE id = ?", body.Score, claims.ID)
	}
	writeJSON(w, http.StatusOK, map[string]any{"success": true, "data": map[string]any{"problemKey": problemKey, "status": body.Status, "score": body.Score}})
}
