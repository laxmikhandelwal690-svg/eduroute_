# RBAC Login + Admin/Student System

## Folder Structure

```text
backend/
  src/
    index.ts                  # Express bootstrap + default admin seeding
    middleware/
      auth.ts                 # JWT auth + admin authorization middleware
    models/
      index.ts                # User, Course, OTP and existing models
    routes/
      auth.ts                 # Register + role-based login endpoints
      api.ts                  # Course CRUD + student verification endpoints
src/
  pages/
    Auth/Login.tsx            # Student/Staff login UI
    Admin/AdminDashboard.tsx  # Admin UI for course + student management
    BrowseCourses.tsx         # Student course viewing page
  utils/
    authApi.ts                # Frontend API wrappers for auth/courses/verification
    rbacAuth.ts               # Session/token + role storage helpers
  App.tsx                     # Route-level role guards
```

## Database Schema (MongoDB / Mongoose)

### users collection
- `name: string`
- `email: string (unique)`
- `password: string (bcrypt hash)`
- `role: 'student' | 'admin'`
- `isVerified: boolean`
- `collegeVerified: 'none' | 'pending' | 'verified' | 'rejected'`
- `createdAt/updatedAt: Date`

### courses collection
- `title: string`
- `description: string`
- `category: string`
- `level: 'Beginner' | 'Intermediate' | 'Advanced'`
- `duration: string`
- `instructor: string`
- `thumbnail?: string`
- `published: boolean`
- `createdBy: ObjectId (ref User)`
- `createdAt/updatedAt: Date`

## API Endpoints

### Auth
- `POST /api/auth/register` – Student signup with hashed password.
- `POST /api/auth/login/student` – Student-only login.
- `POST /api/auth/login/staff` – Staff/Admin-only login.
- `POST /api/auth/otp/send` – Send email OTP.
- `POST /api/auth/otp/verify` – Verify OTP.

### Role-aware profile
- `GET /api/me` – Return logged-in user profile.

### Courses
- `GET /api/courses` – Student/Admin can view.
- `POST /api/courses` – Admin only.
- `PUT /api/courses/:id` – Admin only.
- `DELETE /api/courses/:id` – Admin only.

### Student verification
- `GET /api/students/pending` – Admin only.
- `PATCH /api/students/:id/verification` with `{ action: 'approve' | 'reject' }` – Admin only.

## Deployment Steps

1. **Set environment variables**
   - `MONGODB_URI`
   - `JWT_SECRET`
   - Optional SMTP config: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
   - Frontend API URL: `VITE_API_URL` (if backend is hosted on separate domain)

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run backend**
   ```bash
   npx tsx backend/src/index.ts
   ```

4. **Run frontend**
   ```bash
   npm run dev
   ```

5. **Default staff/admin login**
   - Email: `vansh28@gmail.com`
   - Password: `timepass`
   - Password is seeded and stored as bcrypt hash in MongoDB.

6. **Production**
   - Deploy backend to Render/Railway/EC2 as Node service.
   - Deploy frontend to Netlify/Vercel.
   - Point frontend `VITE_API_URL` to backend URL.
