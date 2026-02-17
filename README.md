# EDUROUTE - AI Mentor Platform

EDUROUTE now includes **Buddy**, a production-oriented AI student mentor that supports learning roadmaps, skill-gap analysis, internship guidance, motivation gamification, and multilingual chat (English, Hindi, Hinglish).

## Folder Structure

```txt
eduroute_
├── src/
│   ├── pages/
│   │   ├── Buddy/BuddyChat.tsx          # Buddy chatbot frontend
│   │   └── Admin/AdminDashboard.tsx     # Admin content manager for roadmaps
│   ├── services/buddyApi.ts             # Frontend API client for Buddy functions
│   └── types/buddy.ts                   # Buddy-specific TypeScript types
├── netlify/
│   └── functions/
│       ├── buddy-chat.js                # AI response + chat history + XP update
│       ├── buddy-progress.js            # User progress + skill-gap persistence
│       ├── admin-roadmaps.js            # Admin CRUD-like roadmap update endpoint
│       └── _lib/
│           ├── aiClient.js              # OpenAI/Gemini adapter + safety system prompt
│           └── database.js              # MongoDB models and DB connection cache
├── netlify.toml                         # Netlify build + functions routing
└── package.json
```

## Buddy Capabilities Implemented

1. **Learning Roadmap Guide**
   - Buddy is instructed to return Beginner → Intermediate → Pro roadmaps.
   - Admin can update roadmap content via `admin-roadmaps` API and Admin Dashboard.

2. **Skill Gap Analyzer**
   - Buddy page includes quick yes/no skill assessment.
   - Missing skills are stored in MongoDB per user profile.

3. **Internship & Career Guidance**
   - Prompt templates and AI system prompt force career-focused responses.

4. **Gamified Motivation**
   - Every message gives XP points.
   - User level updates automatically using XP thresholds.
   - Weekly challenges and achievements are persisted.

5. **Events & Growth Assistant**
   - Quick prompt templates include event discovery and growth guidance.

6. **Multilingual Support**
   - Language selector: English / Hindi / Hinglish.
   - Selected language is saved in user profile.

7. **Student Buddy Personality + Safety**
   - Central system prompt configures friendly mentor tone.
   - Harmful/unrelated requests are rejected politely.

---

## Environment Configuration

Set these variables in **Netlify Site Settings → Environment Variables**:

### Required
- `MONGODB_URI` = MongoDB connection string
- `OPENAI_API_KEY` (if using OpenAI)

### Optional
- `MONGODB_DB_NAME` (default: `eduroute`)
- `AI_PROVIDER` = `openai` (default) or `gemini`
- `OPENAI_MODEL` (default: `gpt-4o-mini`)
- `GEMINI_API_KEY` (required only if `AI_PROVIDER=gemini`)
- `GEMINI_MODEL` (default: `gemini-1.5-flash`)
- `ADMIN_SECRET` (protects admin roadmap API)
- `CORS_ORIGIN` (for cross-origin control)

---

## Local Development

```bash
npm install
npm run dev
```

Netlify functions are available when running through Netlify CLI:

```bash
npm install -g netlify-cli
netlify dev
```

---

## Netlify Deployment Steps

1. Push project to GitHub.
2. Connect repo in Netlify.
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add all environment variables.
5. Deploy.

`netlify.toml` already maps `/api/*` to Netlify functions:
- `/api/buddy-chat`
- `/api/buddy-progress`
- `/api/admin-roadmaps`

---

## API Summary

### `POST /api/buddy-chat`
Request:
```json
{ "userId": "demo-student-101", "message": "Create Data Scientist roadmap", "language": "hinglish" }
```
Response:
```json
{ "ok": true, "reply": "...", "gamification": { "points": 40, "level": 1, "pointsEarned": 5 } }
```

### `GET /api/buddy-progress?userId=demo-student-101`
Returns user progress, achievements, weekly challenges, and recent history.

### `POST /api/buddy-progress`
Save/update missing skills from skill-gap analyzer.

### `GET /api/admin-roadmaps`
Fetch all roadmaps (admin endpoint).

### `POST /api/admin-roadmaps`
Create/update roadmap stages for a role.

---

Built for student growth with Buddy 🚀
