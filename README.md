# EDUROUTE - Smart Education Platform

EDUROUTE is a production-ready web application for career-focused learning, featuring adaptive roadmaps, AI-powered guidance, and industry connections.

## Tech Stack

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Framer Motion, Three.js
- **Backend**: Node.js, Express, TypeScript (Mocked for demo, code in `/backend`)
- **Database**: MongoDB (Schema defined in models)
- **Validation**: Zod
- **Icons**: Lucide React

## Project Structure

- `src/`: Main React application
  - `pages/`: All page components (Auth, Dashboard, Roadmaps, etc.)
  - `components/`: Reusable UI components and 3D scenes
  - `layouts/`: Application shell layouts
  - `data/`: Mock data for development
- `backend/`: Express server source code
- `packages/shared/`: Shared TypeScript types and Zod schemas
- `docker-compose.yml`: Local development setup for MongoDB and APIs

## Features

1. **Auth & Onboarding**: Email signup, OTP simulation, and College ID verification.
2. **Learning Roadmaps**: Step-by-step career paths for Frontend, Backend, Data, etc.
3. **AI Buddy**: Multilingual (English/Hinglish) AI tutor for personalized guidance.
4. **Assessments**: Skill-based MCQs with performance analytics.
5. **Leaderboard & Rewards**: Gamified learning experience with real-world perks.
6. **Career Connect**: Verified internship listings and company pages.
7. **Growth**: Soft skills modules and city-wise tech events.

## Getting Started

### 1. Installation
```bash
npm install
```

### 2. Development
```bash
npm run dev
```

### 3. Backend (Separate terminal)
```bash
cd backend
npm install
npm run dev
```

### 4. Build
```bash
npm run build
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your credentials.

---
Built with ❤️ for the future of education.
