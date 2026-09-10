package main

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"math/big"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/go-sql-driver/mysql"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type Server struct {
	db        *sql.DB
	jwtSecret []byte
}
type contextKey string

const userKey contextKey = "user"

type UserClaims struct {
	ID                 string `json:"id"`
	Name               string `json:"name"`
	Email              string `json:"email"`
	Role               string `json:"role"`
	VerificationStatus string `json:"verificationStatus"`
	jwt.RegisteredClaims
}
type apiEnvelope struct {
	Success bool   `json:"success"`
	Data    any    `json:"data,omitempty"`
	Token   string `json:"token,omitempty"`
	User    any    `json:"user,omitempty"`
	Message string `json:"message,omitempty"`
	Error   string `json:"error,omitempty"`
}

func main() {
	db, err := openDB()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	server := &Server{db: db, jwtSecret: []byte(env("JWT_SECRET", "secret"))}
	if err := ensureSchema(db); err != nil {
		log.Fatal(err)
	}
	if err := server.ensureDefaultAdmin(); err != nil {
		log.Printf("default admin initialization failed: %v", err)
	}
	if err := server.ensureStarterCourse(); err != nil {
		log.Printf("starter course initialization failed: %v", err)
	}
	if os.Getenv("ENABLE_DEMO_ACCOUNT") == "true" {
		if err := server.ensureDemoStudent(); err != nil {
			log.Printf("demo student initialization failed: %v", err)
		}
	}
	if os.Getenv("SEED_DATA") == "true" {
		if err := server.seedData(); err != nil {
			log.Fatal(err)
		}
		return
	}
	port := env("PORT", "5000")
	log.Printf("Go API running on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, server.routes()))
}

func openDB() (*sql.DB, error) {
	host, port, user, password, database := env("MYSQL_HOST", "127.0.0.1"), env("MYSQL_PORT", "3306"), env("MYSQL_USER", "root"), os.Getenv("MYSQL_PASSWORD"), env("MYSQL_DATABASE", "eduroute")
	if raw := os.Getenv("MYSQL_URL"); raw == "" {
		raw = os.Getenv("DATABASE_URL")
		if raw != "" {
			parsed, err := url.Parse(raw)
			if err != nil {
				return nil, err
			}
			host, port, user, password, database = parsed.Hostname(), parsed.Port(), parsed.User.Username(), "", strings.TrimPrefix(parsed.Path, "/")
			if pass, ok := parsed.User.Password(); ok {
				password = pass
			}
			if port == "" {
				port = "3306"
			}
		}
	}
	cfg := mysql.Config{User: user, Passwd: password, Net: "tcp", Addr: host + ":" + port, DBName: database, AllowNativePasswords: true, ParseTime: true, Collation: "utf8mb4_unicode_ci"}
	var db *sql.DB
	var err error
	for attempt := 0; attempt < 20; attempt++ {
		db, err = sql.Open("mysql", cfg.FormatDSN())
		if err == nil {
			err = db.Ping()
		}
		if err == nil {
			db.SetMaxOpenConns(10)
			db.SetMaxIdleConns(5)
			return db, nil
		}
		time.Sleep(time.Second)
	}
	return nil, fmt.Errorf("database connection failed: %w", err)
}
func env(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}
func success(w http.ResponseWriter, status int, data any) {
	writeJSON(w, status, apiEnvelope{Success: true, Data: data})
}
func failure(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, apiEnvelope{Success: false, Error: message})
}
func decodeBody(r *http.Request, target any) error { return json.NewDecoder(r.Body).Decode(target) }
func idString(value any) string {
	switch v := value.(type) {
	case int64:
		return strconv.FormatInt(v, 10)
	case int:
		return strconv.Itoa(v)
	case []byte:
		return string(v)
	case string:
		return v
	default:
		return fmt.Sprint(v)
	}
}
func parseJSON(value any, fallback any) any {
	if value == nil {
		return fallback
	}
	if raw, ok := value.([]byte); ok {
		value = string(raw)
	}
	if raw, ok := value.(string); ok {
		var result any
		if json.Unmarshal([]byte(raw), &result) == nil {
			return result
		}
		return fallback
	}
	return value
}
func randomCode() (string, error) {
	n, err := rand.Int(rand.Reader, big.NewInt(1000000))
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%06d", n.Int64()), nil
}
func hash(value string) string {
	digest := make([]byte, 16)
	_, _ = rand.Read(digest)
	return hex.EncodeToString(digest) + value
}

func (s *Server) routes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/health", s.health)
	mux.HandleFunc("/api/auth/register", s.register)
	mux.HandleFunc("/api/auth/login/student", s.loginStudent)
	mux.HandleFunc("/api/auth/login/staff", s.loginStaff)
	mux.HandleFunc("/api/auth/otp/send", s.sendOTP)
	mux.HandleFunc("/api/auth/otp/verify", s.verifyOTP)
	mux.HandleFunc("/api/profile/dashboard", s.profileDashboard)
	mux.HandleFunc("/api/", s.api)
	return cors(mux)
}
func cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ORIGIN"))
		if w.Header().Get("Access-Control-Allow-Origin") == "" {
			w.Header().Set("Access-Control-Allow-Origin", "*")
		}
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}
func (s *Server) health(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok", "timestamp": time.Now().UTC().Format(time.RFC3339)})
}

func (s *Server) claims(r *http.Request) (*UserClaims, bool) {
	raw := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
	if raw == "" {
		return nil, false
	}
	token, err := jwt.ParseWithClaims(raw, &UserClaims{}, func(token *jwt.Token) (any, error) { return s.jwtSecret, nil })
	if err != nil || !token.Valid {
		return nil, false
	}
	claims, ok := token.Claims.(*UserClaims)
	return claims, ok
}
func (s *Server) requireAuth(w http.ResponseWriter, r *http.Request) (*UserClaims, bool) {
	claims, ok := s.claims(r)
	if !ok {
		failure(w, http.StatusUnauthorized, "Unauthorized")
	}
	return claims, ok
}
func (s *Server) requireAdmin(w http.ResponseWriter, r *http.Request) (*UserClaims, bool) {
	claims, ok := s.requireAuth(w, r)
	if !ok {
		return nil, false
	}
	if claims.Role != "admin" {
		failure(w, http.StatusForbidden, "Access denied. Admin role required.")
		return nil, false
	}
	return claims, true
}
func (s *Server) issueToken(user UserClaims) (string, error) {
	user.RegisteredClaims = jwt.RegisteredClaims{ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)), IssuedAt: jwt.NewNumericDate(time.Now())}
	return jwt.NewWithClaims(jwt.SigningMethodHS256, user).SignedString(s.jwtSecret)
}
func authUser(id, name, email, role, status string) UserClaims {
	return UserClaims{ID: id, Name: name, Email: email, Role: role, VerificationStatus: status}
}

func (s *Server) register(w http.ResponseWriter, r *http.Request) {
	var body struct{ Name, Email, Password string }
	if decodeBody(r, &body) != nil || strings.TrimSpace(body.Name) == "" || body.Email == "" || body.Password == "" {
		failure(w, 400, "Name, email, and password are required")
		return
	}
	body.Email = strings.ToLower(strings.TrimSpace(body.Email))
	body.Name = strings.TrimSpace(body.Name)
	if len(body.Password) < 8 {
		failure(w, 400, "Password must be at least 8 characters")
		return
	}
	var exists int
	if err := s.db.QueryRow("SELECT COUNT(*) FROM users WHERE email = ?", body.Email).Scan(&exists); err != nil {
		failure(w, 500, "Unable to register user")
		return
	}
	if exists > 0 {
		failure(w, 409, "Email already registered")
		return
	}
	password, _ := bcrypt.GenerateFromPassword([]byte(body.Password), 12)
	result, err := s.db.Exec("INSERT INTO users (name,email,password,college_verified) VALUES (?,?,?,?)", body.Name, body.Email, password, "pending")
	if err != nil {
		failure(w, 500, "Unable to register user")
		return
	}
	user := authUser(strconv.FormatInt(mustID(result.LastInsertId()), 10), body.Name, body.Email, "student", "pending")
	token, err := s.issueToken(user)
	if err != nil {
		failure(w, 500, "Unable to register user")
		return
	}
	writeJSON(w, 201, apiEnvelope{Success: true, Token: token, User: user})
}
func mustID(id int64, err error) int64 {
	if err != nil {
		return 0
	}
	return id
}
func (s *Server) loginStudent(w http.ResponseWriter, r *http.Request) { s.login(w, r, "student") }
func (s *Server) loginStaff(w http.ResponseWriter, r *http.Request)   { s.login(w, r, "admin") }
func (s *Server) login(w http.ResponseWriter, r *http.Request, role string) {
	var body struct{ Email, Password string }
	if decodeBody(r, &body) != nil || body.Email == "" || body.Password == "" {
		failure(w, 400, "Email and password are required")
		return
	}
	var id int64
	var name, email, password, userRole, status string
	err := s.db.QueryRow("SELECT id,name,email,password,role,college_verified FROM users WHERE email = ? LIMIT 1", strings.ToLower(strings.TrimSpace(body.Email))).Scan(&id, &name, &email, &password, &userRole, &status)
	if err != nil || userRole != role || bcrypt.CompareHashAndPassword([]byte(password), []byte(body.Password)) != nil {
		statusCode := 401
		message := "Invalid credentials"
		if err == nil && userRole != role {
			statusCode = 403
			message = "Unauthorized for " + role + " login"
		}
		failure(w, statusCode, message)
		return
	}
	user := authUser(strconv.FormatInt(id, 10), name, email, userRole, status)
	token, _ := s.issueToken(user)
	writeJSON(w, 200, apiEnvelope{Success: true, Token: token, User: user})
}

func (s *Server) sendOTP(w http.ResponseWriter, r *http.Request) {
	var body struct{ Email string }
	_ = decodeBody(r, &body)
	email := strings.ToLower(strings.TrimSpace(body.Email))
	if email == "" {
		failure(w, 400, "Email is required")
		return
	}
	var id int64
	var name string
	var verified bool
	err := s.db.QueryRow("SELECT id,name,is_verified FROM users WHERE email = ?", email).Scan(&id, &name, &verified)
	if err == sql.ErrNoRows {
		failure(w, 404, "User not found")
		return
	}
	if err != nil {
		failure(w, 500, "Unable to send OTP")
		return
	}
	if verified {
		failure(w, 400, "Email already verified")
		return
	}
	var sent time.Time
	if err := s.db.QueryRow("SELECT last_sent_at FROM otps WHERE email = ? ORDER BY created_at DESC LIMIT 1", email).Scan(&sent); err == nil && time.Since(sent) < time.Minute {
		remaining := int((time.Minute - time.Since(sent)).Seconds())
		writeJSON(w, 429, map[string]any{"success": false, "error": "OTP recently sent. Please wait before requesting another code.", "cooldownRemainingSeconds": remaining})
		return
	}
	code, err := randomCode()
	if err != nil {
		failure(w, 500, "Unable to send OTP")
		return
	}
	digest, _ := bcrypt.GenerateFromPassword([]byte(code), 12)
	_, err = s.db.Exec("INSERT INTO otps (email,code_hash,expires_at,last_sent_at) VALUES (?,?,?,?)", email, digest, time.Now().Add(5*time.Minute), time.Now())
	if err != nil {
		failure(w, 500, "Unable to send OTP")
		return
	}
	log.Printf("OTP for %s (%s): %s", email, name, code)
	writeJSON(w, 200, map[string]any{"success": true, "message": "OTP sent to email", "expiresInSeconds": 300, "cooldownSeconds": 60})
}
func (s *Server) verifyOTP(w http.ResponseWriter, r *http.Request) {
	var body struct{ Email, OTP string }
	_ = decodeBody(r, &body)
	email := strings.ToLower(strings.TrimSpace(body.Email))
	if email == "" || body.OTP == "" {
		failure(w, 400, "Email and OTP are required")
		return
	}
	if len(body.OTP) != 6 {
		failure(w, 400, "OTP must be a 6-digit code")
		return
	}
	var id int64
	var name string
	var verified bool
	if err := s.db.QueryRow("SELECT id,name,is_verified FROM users WHERE email = ?", email).Scan(&id, &name, &verified); err == sql.ErrNoRows {
		failure(w, 404, "User not found")
		return
	}
	if verified {
		writeJSON(w, 200, map[string]any{"success": true, "message": "Email is already verified"})
		return
	}
	var otpID int64
	var codeHash string
	var expires, lastSent time.Time
	var attempts int
	err := s.db.QueryRow("SELECT id,code_hash,expires_at,last_sent_at,attempt_count FROM otps WHERE email = ? ORDER BY created_at DESC LIMIT 1", email).Scan(&otpID, &codeHash, &expires, &lastSent, &attempts)
	if err == sql.ErrNoRows {
		failure(w, 404, "No OTP found. Request a new code.")
		return
	}
	if time.Now().After(expires) {
		failure(w, 400, "OTP expired. Request a new code.")
		return
	}
	if bcrypt.CompareHashAndPassword([]byte(codeHash), []byte(body.OTP)) != nil {
		attempts++
		_, _ = s.db.Exec("UPDATE otps SET attempt_count = ?, locked_until = ? WHERE id = ?", attempts, func() any {
			if attempts >= 5 {
				return time.Now().Add(5 * time.Minute)
			}
			return nil
		}(), otpID)
		writeJSON(w, 400, map[string]any{"success": false, "error": "Invalid OTP code", "remainingAttempts": max(0, 5-attempts)})
		return
	}
	_, _ = s.db.Exec("UPDATE users SET is_verified = TRUE WHERE id = ?", id)
	_, _ = s.db.Exec("DELETE FROM otps WHERE email = ?", email)
	writeJSON(w, 200, map[string]any{"success": true, "message": "Email verified successfully", "user": map[string]any{"id": strconv.FormatInt(id, 10), "name": name, "email": email, "verificationStatus": "verified"}})
}
func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func (s *Server) api(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/api/")
	switch {
	case path == "me" && r.Method == "GET":
		s.me(w, r)
	case strings.HasPrefix(path, "problems/") && strings.HasSuffix(path, "/submit"):
		s.submitProblem(w, r)
	case path == "courses":
		s.courses(w, r)
	case strings.HasPrefix(path, "courses/") && strings.HasSuffix(path, "/progress"):
		s.courseProgress(w, r)
	case strings.HasPrefix(path, "courses/"):
		s.courseByID(w, r, strings.TrimPrefix(path, "courses/"))
	case path == "students/pending":
		s.pendingStudents(w, r)
	case strings.HasPrefix(path, "students/") && strings.HasSuffix(path, "/verification"):
		s.verifyStudent(w, r)
	case path == "roadmaps" && r.Method == "GET":
		s.roadmaps(w, r)
	case strings.HasPrefix(path, "roadmaps/"):
		slug := strings.TrimPrefix(path, "roadmaps/")
		if strings.HasSuffix(slug, "/progress") {
			s.roadmapProgress(w, r, strings.TrimSuffix(slug, "/progress"))
		} else {
			s.roadmap(w, r, slug)
		}
	case path == "assessments" && r.Method == "GET":
		s.assessments(w, r)
	case strings.HasPrefix(path, "assessments/"):
		assessmentID := strings.TrimPrefix(path, "assessments/")
		if strings.HasSuffix(assessmentID, "/attempt") {
			r.URL.Path = "/api/assessments/" + strings.TrimSuffix(assessmentID, "/attempt") + "/attempt"
		}
		s.assessment(w, r, strings.TrimSuffix(assessmentID, "/attempt"))
	case path == "internships":
		s.internships(w, r)
	case strings.HasPrefix(path, "companies/"):
		s.company(w, r, strings.TrimPrefix(path, "companies/"))
	case path == "events":
		s.simpleList(w, "SELECT id,title,description,city,event_date AS date,month_tag AS monthTag,image FROM events", r)
	case path == "soft-skills":
		s.simpleList(w, "SELECT id,title,content,video_url AS videoUrl FROM soft_skill_lessons", r)
	case path == "rewards":
		s.simpleList(w, "SELECT id,title,description,points_required AS pointsRequired,partner,category FROM rewards", r)
	case path == "buddy/chat" && r.Method == "POST":
		s.buddyChat(w, r)
	case path == "buddy-progress":
		s.buddyProgress(w, r)
	case path == "buddy-chat" && r.Method == "POST":
		s.buddyChatFunction(w, r)
	case path == "admin-roadmaps":
		s.adminRoadmaps(w, r)
	case path == "send-email" && r.Method == "POST":
		s.sendEmail(w, r)
	default:
		failure(w, 404, "Not found")
	}
}

func rowsToMaps(rows *sql.Rows) ([]map[string]any, error) {
	columns, err := rows.Columns()
	if err != nil {
		return nil, err
	}
	result := []map[string]any{}
	for rows.Next() {
		values := make([]any, len(columns))
		pointers := make([]any, len(columns))
		for i := range values {
			pointers[i] = &values[i]
		}
		if err := rows.Scan(pointers...); err != nil {
			return nil, err
		}
		item := map[string]any{}
		for i, column := range columns {
			item[column] = values[i]
			if column == "id" || strings.HasSuffix(column, "Id") || strings.HasSuffix(column, "ID") {
				item[column] = idString(values[i])
			}
		}
		result = append(result, item)
	}
	return result, rows.Err()
}
func (s *Server) queryMaps(query string, args ...any) ([]map[string]any, error) {
	rows, err := s.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return rowsToMaps(rows)
}
func (s *Server) me(w http.ResponseWriter, r *http.Request) {
	claims, ok := s.requireAuth(w, r)
	if !ok {
		return
	}
	rows, err := s.queryMaps("SELECT id,name,email,role,is_verified AS isVerified,college_verified AS collegeVerified,points,language_preference AS languagePreference,avatar,created_at AS createdAt FROM users WHERE id = ? LIMIT 1", claims.ID)
	if err != nil {
		failure(w, 500, "Unable to load user")
		return
	}
	var data any
	if len(rows) > 0 {
		data = rows[0]
	}
	success(w, 200, data)
}
func (s *Server) courses(w http.ResponseWriter, r *http.Request) {
	claims, ok := s.requireAuth(w, r)
	_ = claims
	if !ok {
		return
	}
	if r.Method == "GET" {
		rows, err := s.queryMaps("SELECT c.id,c.title,c.description,c.category,c.level,c.duration,c.instructor,c.thumbnail,c.playlist_url AS playlistUrl,c.youtube_url AS youtubeUrl,c.resource_url AS resourceUrl,c.published,c.created_by AS createdBy,c.created_at AS createdAt,c.updated_at AS updatedAt,COALESCE(ucp.progress_percent,0) AS progressPercent,IF(ucp.user_id IS NULL,FALSE,TRUE) AS enrolled FROM courses c LEFT JOIN user_course_progress ucp ON ucp.course_id = c.id AND ucp.user_id = ? ORDER BY c.created_at DESC", claims.ID)
		if err != nil {
			failure(w, 500, "Unable to load courses")
			return
		}
		success(w, 200, rows)
		return
	}
	if _, ok := s.requireAdmin(w, r); !ok {
		return
	}
	if r.Method == "POST" {
		var body map[string]any
		_ = decodeBody(r, &body)
		required := []string{"title", "description", "category", "duration", "instructor"}
		for _, key := range required {
			if fmt.Sprint(body[key]) == "<nil>" || fmt.Sprint(body[key]) == "" {
				failure(w, 400, "Missing required fields")
				return
			}
		}
		level := stringValue(body["level"], "Beginner")
		res, err := s.db.Exec("INSERT INTO courses (title,description,category,level,duration,instructor,thumbnail,playlist_url,youtube_url,resource_url,created_by) VALUES (?,?,?,?,?,?,?,?,?,?,?)", body["title"], body["description"], body["category"], level, body["duration"], body["instructor"], body["thumbnail"], body["playlistUrl"], body["youtubeUrl"], body["resourceUrl"], claims.ID)
		if err != nil {
			failure(w, 500, "Unable to create course")
			return
		}
		id, _ := res.LastInsertId()
		rows, _ := s.queryMaps("SELECT id,title,description,category,level,duration,instructor,thumbnail,playlist_url AS playlistUrl,youtube_url AS youtubeUrl,resource_url AS resourceUrl,published,created_by AS createdBy,created_at AS createdAt FROM courses WHERE id = ?", id)
		if len(rows) > 0 {
			success(w, 201, rows[0])
		} else {
			failure(w, 500, "Unable to create course")
		}
		return
	}
	failure(w, 405, "Method not allowed")
}
func stringValue(value any, fallback string) string {
	if value == nil {
		return fallback
	}
	return fmt.Sprint(value)
}
func (s *Server) courseByID(w http.ResponseWriter, r *http.Request, id string) {
	if r.Method == "GET" {
		if _, ok := s.requireAuth(w, r); !ok {
			return
		}
		rows, err := s.queryMaps("SELECT id,title,description,category,level,duration,instructor,thumbnail,playlist_url AS playlistUrl,youtube_url AS youtubeUrl,resource_url AS resourceUrl,published,created_at AS createdAt,updated_at AS updatedAt FROM courses WHERE id = ? AND published = TRUE LIMIT 1", id)
		if err != nil {
			failure(w, 500, "Unable to load course")
			return
		}
		if len(rows) == 0 {
			failure(w, 404, "Course not found")
			return
		}
		success(w, 200, rows[0])
		return
	}
	if _, ok := s.requireAdmin(w, r); !ok {
		return
	}
	if r.Method == "DELETE" {
		result, err := s.db.Exec("DELETE FROM courses WHERE id = ?", id)
		if err != nil {
			failure(w, 500, "Unable to delete course")
			return
		}
		affected, _ := result.RowsAffected()
		if affected == 0 {
			failure(w, 404, "Course not found")
			return
		}
		writeJSON(w, 200, apiEnvelope{Success: true, Message: "Course deleted successfully"})
		return
	}
	if r.Method == "PUT" {
		var body map[string]any
		_ = decodeBody(r, &body)
		allowed := map[string]string{"title": "title", "description": "description", "category": "category", "level": "level", "duration": "duration", "instructor": "instructor", "thumbnail": "thumbnail", "playlistUrl": "playlist_url", "youtubeUrl": "youtube_url", "resourceUrl": "resource_url", "published": "published"}
		sets := []string{}
		args := []any{}
		for key, value := range body {
			if column, ok := allowed[key]; ok {
				sets = append(sets, column+" = ?")
				args = append(args, value)
			}
		}
		if len(sets) > 0 {
			args = append(args, id)
			_, _ = s.db.Exec("UPDATE courses SET "+strings.Join(sets, ", ")+" WHERE id = ?", args...)
		}
		rows, err := s.queryMaps("SELECT id,title,description,category,level,duration,instructor,thumbnail,playlist_url AS playlistUrl,youtube_url AS youtubeUrl,resource_url AS resourceUrl,published,created_by AS createdBy,created_at AS createdAt,updated_at AS updatedAt FROM courses WHERE id = ?", id)
		if err != nil || len(rows) == 0 {
			failure(w, 404, "Course not found")
			return
		}
		success(w, 200, rows[0])
		return
	}
	failure(w, 405, "Method not allowed")
}
