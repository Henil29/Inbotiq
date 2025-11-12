# Inbotiq Full Stack Project

Full stack application with a Node/Express + MongoDB backend and a Next.js (App Router) + Tailwind CSS frontend.

## Monorepo Structure
```
backend/   Express API (auth, admin endpoints)
frontend/  Next.js 14 application
```

## Requirements
- Node.js 18+ (LTS recommended)
- MongoDB instance (local or Atlas)
- Yarn / npm / pnpm (choose one package manager and stay consistent)

## Environment Variables
Copy `.env.example` to `.env` and adjust values:
```
PORT=3000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_long_random_secret
CORS_ORIGIN=http://localhost:3001,http://localhost:3000
# NEXT_PUBLIC_API_BASE=http://localhost:3000/api
```
`CORS_ORIGIN` supports multiple comma-separated origins.

## Install Dependencies
From the repository root run each:
```bash
cd backend && npm install
cd ../frontend && npm install
```
(Or use `yarn` / `pnpm`.)

## Development
In one terminal run the backend:
```bash
cd backend
npm run dev
```
In another terminal run the frontend (default Next.js dev port 3000):
```bash
cd frontend
npm run dev
```
Adjust `NEXT_PUBLIC_API_BASE` in a frontend `.env.local` if you expose a different API URL.

## Production Build
Backend (simple Node process):
```bash
cd backend
npm run start
```
Frontend (build then start):
```bash
cd frontend
npm run build
npm run start
```
Serve both behind a reverse proxy (NGINX / Caddy) or deploy separately (e.g. Render / Railway for backend, Vercel / Netlify for frontend) pointing the frontend env var to the deployed API base.

## Scripts Summary (Backend)
- `dev`: Starts API with nodemon for hot reload.
- `start`: Runs API with Node (production mode).

## Scripts Summary (Frontend)
- `dev`: Next.js development server.
- `build`: Production build.
- `start`: Starts optimized production server.
- `lint`: Run ESLint.

## API Overview
Base URL: `/api`
- Auth routes under `/api/auth`
- Admin routes under `/api/admin` (protected)

Authentication uses HTTP-only cookie `token` (JWT).

## Security & Hardening To-Do
- Add rate limiting (e.g. `express-rate-limit`).
- Enable Helmet for security headers.
- Set `secure: true` on cookie when behind HTTPS.
- Implement CSRF protection if needed for unsafe methods.
- Add input validation coverage for all endpoints.

## Testing
Currently no automated tests. Suggested stack:
- Jest or Vitest for unit tests
- Supertest for API integration tests

## Linting & Formatting
Add Prettier if consistent formatting is desired. ESLint already included in frontend.

## Deployment Checklist
- [ ] Fill `.env` with production values
- [ ] Use distinct `JWT_SECRET`
- [ ] Configure `CORS_ORIGIN` to production domains
- [ ] Add process manager for backend (PM2 / Docker)
- [ ] Set `NEXT_PUBLIC_API_BASE` in frontend environment
- [ ] Enforce HTTPS & secure cookies

## License
Add a `LICENSE` file (MIT recommended) before making the repository public.

## Contributing
1. Fork & clone
2. Create feature branch
3. Commit with conventional messages
4. Open a PR

---
Generated initial documentation; expand with endpoint details and data models as the project grows.
