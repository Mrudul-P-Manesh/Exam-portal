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
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
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

This app supports `Supabase` for permanent storage.

If `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are not set, it falls back to in-memory storage.

That fallback means:
- users are not permanent
- submissions are not permanent
- logs are not permanent
- backend restarts will wipe competition data

## Supabase Setup

1. Create a Supabase project
2. Open the SQL editor
3. Run [backend/supabase-schema.sql](/Users/mrudulpmanesh/Desktop/exam%20portal/backend/supabase-schema.sql)
4. Copy:
   - Project URL
   - Service Role Key
5. Add them to Render:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

6. Redeploy the backend

After that, users, submissions, and logs will survive restarts and redeploys.

## Recommended Next Step

For a real event, configure Supabase before competitors start using the system.
