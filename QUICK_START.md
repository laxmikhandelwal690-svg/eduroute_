# EDUROUTE - Quick Start Guide

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Visit: http://localhost:5173

## Production Build

```bash
npm run build
```

Output: `dist/` folder ready for deployment

## Deploy to Netlify

1. Push to GitHub
2. Connect repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Follow prompts and add environment variables in dashboard.

## Environment Variables

Create `.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

## Features

- 3D Landing Page
- AI-Powered Roadmaps
- Skill Assessments
- Gamification (Leaderboard & Rewards)
- Internship Marketplace
- Admin Dashboard

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Three.js / React Three Fiber
- Lucide Icons
- React Router

## Status

All errors fixed. Ready for deployment.
