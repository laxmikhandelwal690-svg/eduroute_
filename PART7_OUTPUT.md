# Part 7 - Production Output Pack

## 1) Complete Folder Structure

```text
.
├── backend/
│   └── src/
│       ├── index.ts
│       ├── middleware/auth.ts
│       ├── models/index.ts
│       ├── routes/api.ts
│       ├── routes/auth.ts
│       └── seed.ts
├── netlify/
│   └── functions/
│       └── send-email.js
├── packages/
│   └── shared/types.ts
├── src/
│   ├── App.tsx
│   ├── AppTest.tsx
│   ├── config/firebase.ts
│   ├── components/{AuthModal.tsx,Hero3D.tsx}
│   ├── contexts/SoundContext.tsx
│   ├── data/mockData.ts
│   ├── layouts/{MainLayout.tsx,index.ts}
│   ├── pages/**
│   ├── utils/cn.ts
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
├── pages/** (legacy mirror)
├── .env.example
├── DEPLOYMENT.md
├── netlify.toml
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 2) Full Frontend Code

Frontend source is fully contained in:
- `src/main.tsx` (app bootstrap)
- `src/App.tsx` (routing shell)
- `src/layouts/MainLayout.tsx` (authenticated app container)
- `src/pages/**` (all feature pages)
- `src/components/**` (reusable UI)
- `src/data/mockData.ts` + `src/types.ts` (data contracts)

For production scalability:
- keep feature modules under `src/features/<domain>` as codebase grows;
- lazy-load route groups using `React.lazy` + `Suspense`;
- move API access into a single typed client layer;
- split giant mock data into paginated API-backed collections.

## 3) Netlify Function Code

File: `netlify/functions/send-email.js`
- serverless email endpoint `POST /.netlify/functions/send-email`
- validates payload and supports CORS
- sends via Gmail App Password credentials from env vars

## 4) Firebase Setup (Optional, if enabled)

File: `src/config/firebase.ts`
- initializes Firebase App once
- exports `firebaseAuth`, `firebaseDb`, `firebaseStorage`
- uses Vite env vars (`VITE_FIREBASE_*`)

## 5) .env Example

Use `.env.example` as the single source template. It now includes:
- Vite frontend vars
- optional Firebase vars
- Netlify function Gmail vars
- backend API vars

## 6) Deployment Steps

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set environment variables in Netlify UI (`Site settings -> Environment variables`).
3. Build and test locally:
   ```bash
   npm run build
   npm run preview
   ```
4. Push to Git and connect repo to Netlify.
5. Netlify build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
6. Verify:
   - SPA routing works
   - `/api/send-email` proxy works

## 7) Gmail App Password Setup

1. Sign in to the Gmail account used for outbound mail.
2. Enable **2-Step Verification** (Google Account -> Security).
3. Go to **App passwords**.
4. Create a new app password (Mail / Other custom name e.g. `EduRoute Netlify`).
5. Copy the generated 16-character password.
6. Set in env:
   - `GMAIL_USER=you@gmail.com`
   - `GMAIL_APP_PASSWORD=<16-char-password>`
   - `MAIL_FROM=EduRoute <you@gmail.com>`
7. Redeploy site.

## 8) Testing Instructions

### Frontend
```bash
npm run build
npm run preview
```
Open app and check all route groups.

### Netlify Function Local Smoke Test
```bash
curl -X POST http://localhost:8888/.netlify/functions/send-email \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","subject":"EduRoute Test","text":"Hello from Netlify function"}'
```

### Production Hardening Checklist
- Add rate limiting at edge (Netlify/WAF) for `/api/send-email`
- restrict `CORS_ORIGIN` to your domain
- rotate Gmail app password regularly
- add centralized logging and alerting
- add automated E2E tests and CI checks before deploy
