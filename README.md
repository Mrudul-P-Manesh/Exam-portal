# Code Debugging Competition Portal

A web-based platform for conducting debugging-focused coding assessments in C and Python. Designed for hackathons, internal evaluations, and academic events.

---

## Overview

This system enables administrators to host debugging challenges and monitor participant activity. Competitors access the platform through a simplified login flow and attempt structured problem sets within the interface.

---

## Features

- Role-based access (administrator and participants)
- Support for C and Python debugging problems
- Activity/event logging (e.g., tab switching, interaction tracking)
- REST API backend for managing sessions and submissions
- Optional persistent storage using Supabase

---

## Technology Stack

- Frontend: React (Vite)
- Backend: Node.js with Express
- Authentication: JSON Web Tokens (JWT)
- Storage: Supabase (optional), in-memory fallback

---

## Local Development

### Backend

```bash
cd backend
npm install
npm run dev
```

Runs on: http://localhost:5025

### Frontend

```bash
cd frontend
npm install
npm run dev -- --port 5173
```

Runs on: http://localhost:5173

---

## Configuration

Create environment files for both services.

### frontend/.env

```env
VITE_API_BASE_URL=http://localhost:5025/api
```

### backend/.env

```env
PORT=5025
JWT_SECRET=your_secure_random_secret
ALLOWED_ORIGINS=http://localhost:5173
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Do not commit `.env` files or secrets to version control.

---

## Deployment

### Backend (Render)

- Root directory: backend  
- Build command: npm install  
- Start command: npm start  

Set environment variables in the Render dashboard.

Example backend URL:
```
https://your-backend.onrender.com
```

---

### Frontend (Vercel)

- Root directory: frontend  
- Framework preset: Vite  

Set:

```env
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

---

## Data Storage

- Supabase (recommended): persistent storage for users, submissions, and logs  
- In-memory fallback: data resets on server restart (not suitable for production)

---

## Security Considerations

- Use a strong, randomly generated JWT secret  
- Keep all sensitive keys server-side  
- Restrict allowed origins in production  
- Avoid shared credentials in real deployments  

---

## Limitations

- In-memory mode does not persist data  
- Basic authentication model  
- Anti-cheat is limited to client-side tracking and logging  

---

## Future Improvements

- Individual user authentication  
- Timed sessions and exam controls  
- Automated evaluation and scoring  
- Leaderboard and analytics  

---

## License

MIT License
