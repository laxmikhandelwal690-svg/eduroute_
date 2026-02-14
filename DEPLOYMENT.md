# EduRoute Deployment Guide (Netlify + Serverless Email)

## Prerequisites
- Node.js 20+
- Netlify account
- Gmail account with 2FA enabled

## 1. Configure Environment Variables
Copy from `.env.example` and set values in Netlify UI.

Required for email function:
- `GMAIL_USER`
- `GMAIL_APP_PASSWORD`
- `MAIL_FROM`
- `CORS_ORIGIN`

Optional Firebase:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## 2. Build Settings
Netlify reads `netlify.toml`:
- Build command: `npm run build`
- Publish: `dist`
- Functions: `netlify/functions`

## 3. Deploy
```bash
npm run build
```
Push branch to GitHub and connect repo in Netlify, or use Netlify CLI.

## 4. Post-deploy Verification
- Open app root and deep links (SPA routes)
- Verify `POST /api/send-email` sends email
- Inspect Netlify function logs

## 5. Scaling Notes
- Keep serverless function stateless
- Use provider-level throttling/WAF
- Move heavy jobs to queue workers if mail volume increases
- Add monitoring (Sentry/log drains)
