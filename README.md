# Inbotiq

> Full-stack monorepo: **Express + MongoDB API** (backend) and **Next.js 14 App Router + Tailwind CSS** (frontend).

## 🚀 Overview
Inbotiq provides user authentication (JWT in http-only cookie), role-based access (user/admin), and an admin dashboard foundation. The repo is structured as a monorepo so you can develop both tiers together while deploying them separately (recommended: Render for backend, Vercel for frontend).

## ✨ Features
- User registration & login (JWT cookie + token returned in body)
- Optional admin role selection at signup (configurable; security warning below)
- Protected user profile endpoint (`/api/auth/me`)
- Basic admin endpoints scaffold
- Centralized error handling & input validation (Joi + Zod)
- Configurable CORS origins via `CORS_ORIGIN`
- Monorepo orchestration scripts (root `package.json`)

## 🧱 Tech Stack
**Backend**: Node.js, Express 5, Mongoose, bcryptjs, JSON Web Token, Joi, Morgan

**Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, React Hook Form + Zod, Axios, React Hot Toast

**Tooling**: Nodemon, Concurrently, dotenv, TypeScript (frontend), render.yaml (deployment blueprint)

## 📂 Monorepo Structure
```
backend/        Express API
  server.js     Entry (loads root .env)
  app.js        Express app & middleware
  routes/       Route modules (auth, admin)
  controller/   Controller logic
  models/       Mongoose models
  validations/  Joi validation schemas
  middlewares/  Auth, error handling, admin check
  utils/        Token generation
frontend/       Next.js application
  app/          App Router pages
  components/   Reusable UI & forms
  context/      Auth context
  lib/          Axios client configuration
  hooks/        Custom hooks
  utils/        Constants & error helpers
render.yaml     Backend Render deployment blueprint
README.md       Project documentation
```

## 🏗 Architecture (High-Level)
```
[Browser / Next.js] -- (Axios + credentials) --> [Express API] --(Mongoose)--> [MongoDB]
        |                                                ^
        |<-------------- HTTP-only auth cookie ----------|
```
Frontend reads `NEXT_PUBLIC_API_URL` for API base. Backend sets `token` cookie (httpOnly) with 7d expiry.

## 🔐 Authentication Flow
1. User submits login/registration
2. Backend validates input (Joi) and hashes password (bcrypt)
3. Backend issues JWT (`id` claim) and sets `token` cookie (httpOnly, sameSite=strict in dev)
4. Frontend stores returned token in `localStorage` (optional layer) and fetches `/auth/me` to hydrate user context
5. Protected routes/components rely on context + server data

> Consider removing localStorage token if you want pure cookie auth; keep only the cookie and call `/auth/me` on app load.

## ⚙ Environment Variables
Single root `.env` (backend loads it explicitly) plus `frontend/.env.local` for Next.js public vars.

### Backend (.env at repo root)
```
PORT=4000
MONGO_URI=mongodb://localhost:27017/inbotiq
JWT_SECRET=change_me_to_long_random_value
CORS_ORIGIN=http://localhost:3000
```
Add production values on the host (Render dashboard).

### Frontend (frontend/.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```
In production set: `NEXT_PUBLIC_API_URL=https://YOUR-BACKEND.onrender.com/api`

## 🧪 Scripts
Root (monorepo):
```
npm run bootstrap   # Install backend & frontend deps
npm run dev         # Run both backend (nodemon) & frontend (Next dev)
npm run build       # Build frontend only
npm run start       # Start backend (node) & frontend (Next production)
```
Backend only:
```
cd backend
npm run dev         # Nodemon
npm run start       # Node server.js
```
Frontend only:
```
cd frontend
npm run dev
npm run build
npm run start
```

## 🛠 Local Development
```bash
# First time
npm run bootstrap
# Run both stacks
npm run dev
# Visit frontend
http://localhost:3000
# API base (if testing directly)
http://localhost:4000/api
```
Troubleshooting: If Mongo fails (`uri undefined`), verify `MONGO_URI` is in root `.env` and restart.

## 📡 API Endpoints (Summary)
Base: `/api`

| Method | Path             | Auth | Description                |
|--------|------------------|------|----------------------------|
| POST   | /auth/register   | None | Register new user (+admin option) |
| POST   | /auth/login      | None | Login, set token cookie     |
| POST   | /auth/logout     | User | Clear auth cookie           |
| GET    | /auth/me         | User | Current user profile        |
| GET    | /health          | None | Service health check        |
| (Admin)| /admin/...       | Admin| Future admin routes         |

## 🚨 Admin Checkbox Warning
Currently users can self-select `admin` during registration. This is **NOT safe** for production.
**Recommended alternatives:**
- Remove the checkbox in production builds
- Use an invite code: require `ADMIN_INVITE_CODE` in request & match server-side
- Promote users manually via an admin interface or script

## 🛡 Security Hardening (Recommended)
- Add `helmet` middleware for secure headers
- Add `express-rate-limit` for login & auth routes
- Switch cookie settings in production:
  - `sameSite: 'none'`, `secure: true` (cross-domain Vercel ↔ Render)
- Rotate `JWT_SECRET` and use stronger entropy
- Sanitize request bodies (e.g., with `validator` or express middleware)
- Implement audit logging for admin actions

## 🧪 Testing Roadmap
Suggested stack: Jest (or Vitest) + Supertest
- Unit: token generation, validations
- Integration: auth register/login/me flows
- E2E (future): Playwright or Cypress

## ☁ Deployment
### Backend (Render)
1. Use `render.yaml` (Blueprint) OR manual Web Service pointing to `backend/`
2. Build Command: `npm install`
3. Start Command: `npm run start`
4. Env Vars: `MONGO_URI`, `JWT_SECRET`, `CORS_ORIGIN=https://your-frontend.vercel.app`
5. Health Check Path: `/health`

### Frontend (Vercel)
1. Root Directory: `frontend`
2. Add env var: `NEXT_PUBLIC_API_URL=https://YOUR-BACKEND.onrender.com/api`
3. Deploy; test login & profile fetch

## 🔄 CI (Future)
Add GitHub Actions workflow:
- Install dependencies
- Run lint & tests
- Upload coverage

## 🤝 Contributing
1. Fork & clone
2. Create a feature branch (`feat/...`)
3. Commit using Conventional Commits
4. Open a PR; include description & screenshots

## 📄 License
Add a `LICENSE` file (MIT recommended). Example header:
```
MIT License
Copyright (c) 2025 YOUR NAME
```

## 🐞 Troubleshooting
| Issue | Fix |
|-------|-----|
| `MONGO_URI undefined` | Ensure root `.env` has MONGO_URI; restart dev |
| Cookie not set in prod | Ensure CORS origins match & use `sameSite=none`, `secure=true` |
| 404 /api/auth/login on frontend | API base env var missing or wrong (`NEXT_PUBLIC_API_URL`) |
| CORS error | Add Vercel domain to `CORS_ORIGIN` (comma-separated) |

## 📌 Roadmap Ideas
- Password reset flow
- Email verification
- Role management UI
- Admin metrics dashboard
- Docker images & compose file

---
Happy hacking! Feel free to open issues or PRs to improve this starter.
