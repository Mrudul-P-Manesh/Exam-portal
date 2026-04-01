# Code Debugging Competition

This is a coding test portal with:
- candidate login using `name + shared password`
- admin login
- mixed `C` and `Python` debugging questions
- anti-cheat event logging

## Current Login

### Admin
- Username: `admin`
- Password: `Admin#2026`

### Competitors
- Name: anything they enter
- Password: `password123`

Competitor names are created automatically when they log in.

## Local Run

### Backend
```bash
cd backend
npm install
npm run dev
```

Runs on `http://localhost:5025`

### Frontend
```bash
cd frontend
npm install
npm run dev -- --port 5173
```

Runs on `http://localhost:5173`

## Environment Variables

### Frontend
Create `frontend/.env`:

```bash
VITE_API_BASE_URL=http://localhost:5025/api
```

### Backend
Create `backend/.env`:

```bash
PORT=5025
JWT_SECRET=change_this_secret
ALLOWED_ORIGINS=http://localhost:5173
```

`ALLOWED_ORIGINS` can be a comma-separated list.

Example:

```bash
ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend.vercel.app
```

## Free Deployment: Vercel + Render

### 1. Deploy Backend to Render

Create a new `Web Service` on Render with:
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

Set environment variables on Render:

```bash
PORT=5025
JWT_SECRET=change_this_secret
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

After deploy, Render will give you a backend URL like:

```bash
https://your-backend.onrender.com
```

### 2. Deploy Frontend to Vercel

Import the repo into Vercel and set:
- Root Directory: `frontend`
- Framework Preset: `Vite`

Set environment variable on Vercel:

```bash
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

Then redeploy.

### 3. Update Render CORS

After Vercel gives you the real frontend URL, update:

```bash
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

If you use a custom domain later, add it too:

```bash
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://exam.yourdomain.com
```

## Important Limitation

This app currently uses in-memory storage in `backend/data/store.js`.

That means:
- users are not permanent
- submissions are not permanent
- logs are not permanent
- backend restarts will wipe competition data

This is okay for demos, but not safe for a real competition.

## Recommended Next Step

Before a real event, move users, submissions, and logs to a database such as Supabase or MongoDB.
