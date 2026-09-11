# Svasthi Web App

Svasthi is a full-stack mental-wellness web app. It provides daily mood check-ins, a supportive Dawn chat companion, private journal insights, habits, self-screenings, grounding exercises, and crisis-support guidance.

The repository is a small monorepo:

- `frontend/` — React + Vite user interface.
- `backend/` — Next.js API for the Svasthi wellness flow.

## Features

- Daily mood check-ins, including the dashboard quick-check-in control.
- Dawn chat with an anonymous browser session.
- Journal submissions and supportive, non-diagnostic insights.
- Habit tracking synced with the backend session.
- Clinical screening result saving.
- Exercise and grounding activity logging.
- Dashboard wellness, sleep, and streak statistics.
- Crisis phrase detection with immediate Tele-MANAS guidance at `14416`.

## Important safety and privacy notes

Svasthi is a wellness-support tool, not a medical service or diagnostic system. If someone may be in immediate danger, use local emergency services. In India, Tele-MANAS support is available at `14416`.

The demo backend keeps data in memory per anonymous browser session. Data is not durable across backend restarts or serverless cold starts. Do not use this demo implementation for real patient data. Production use needs authenticated accounts, a consent model, encrypted durable storage, access controls, monitoring, and a clinical/legal review.

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer

## Run locally

Open two terminals from this repository.

### 1. Start the backend

```bash
cd backend
copy .env.example .env.local
npm install
npm run dev
```

The API starts at `http://localhost:3000`.

Keep `DEMO_MODE=true` for the safe deterministic demo behavior. A Gemini key is optional; never expose it as a frontend variable.

### 2. Start the frontend

```bash
cd frontend
copy .env.example .env.local
npm install
npm run dev
```

Set this value in `frontend/.env.local`:

```dotenv
VITE_SVASTHI_API_URL=http://localhost:3000
```

Open the URL printed by Vite (normally `http://localhost:3000`). If that port conflicts with the backend, start Vite on another port, for example `npm run dev -- --port 5173`.

## Environment variables

### Backend (`backend/.env.local`)

```dotenv
DEMO_MODE=true
FRONTEND_ORIGIN=http://localhost:5173
# Optional, only when demo mode is false:
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
```

### Frontend (`frontend/.env.local`)

```dotenv
VITE_SVASTHI_API_URL=http://localhost:3000
```

Only variables prefixed with `VITE_` are embedded into the browser bundle. Never put API keys or other secrets in them.

## API overview

All API requests accept an `x-svasthi-session` header. The frontend creates and retains an anonymous ID in browser local storage.

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/check-ins` | Save mood, stress, energy, sleep, and contexts. |
| `GET` | `/api/dashboard` | Read session dashboard data and wellness statistics. |
| `POST` | `/api/chat` | Send a message to Dawn. |
| `POST` | `/api/journals` | Save a consented journal transcript and lightweight voice features. |
| `POST` | `/api/insights` | Generate a wellness insight from a check-in and journal. |
| `GET`, `PATCH` | `/api/habits` | List and toggle habits. |
| `GET`, `POST` | `/api/screenings` | List and save screening scores. |
| `POST` | `/api/activities` | Record exercise and grounding activity. |
| `GET` | `/api/health` | Verify API availability and demo mode. |

See `backend/docs/api-contract.md` for the core request and response shapes.

## Production deployment on Vercel

Deploy the backend and frontend as separate Vercel projects.

1. Import `backend/` as a Vercel project.
2. Add backend Production environment variables:

   ```dotenv
   DEMO_MODE=true
   FRONTEND_ORIGIN=https://your-frontend-domain.vercel.app
   ```

3. Deploy the backend and copy its production URL.
4. Import `frontend/` as another Vercel project.
5. Add its Production build variable:

   ```dotenv
   VITE_SVASTHI_API_URL=https://your-backend-domain.vercel.app
   ```

6. Deploy the frontend.
7. If Vercel issues a new backend deployment URL, rebuild the frontend with that URL or configure a stable backend domain. Confirm that `FRONTEND_ORIGIN` matches the frontend production domain exactly.
8. Verify `GET /api/health` and a browser CORS preflight before sharing the app.

## Verification

Run these before deployment:

```bash
cd backend && npm run build
cd ../frontend && npm run lint && npm run build
```

## Repository hygiene

`.env*`, dependency folders, build output, and Vercel project metadata are ignored. Commit `.env.example` files only; do not commit keys, tokens, personal data, or deployment credentials.
