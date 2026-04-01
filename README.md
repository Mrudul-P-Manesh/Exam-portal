# 🚀 Code Debugging Competition Portal

A real-time coding competition platform focused on **debugging challenges in C and Python**, built with admin controls and activity monitoring.

---

## 🔥 Features

* 🔐 Role-based access (Admin & Competitors)
* 🧠 Debugging-focused problems (C & Python)
* 🛡️ Activity tracking (tab switches, copy attempts, etc.)
* ⚡ Fast frontend using Vite + React
* 🌐 REST API backend using Node.js + Express

---

## 🧩 Tech Stack

| Layer    | Tech                |
| -------- | ------------------- |
| Frontend | Vite + React        |
| Backend  | Node.js + Express   |
| Database | Supabase (optional) |
| Auth     | JWT                 |

---

## 🖥️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

---

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Runs on: **http://localhost:5025**

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev -- --port 5173
```

Runs on: **http://localhost:5173**

---

## ⚙️ Environment Variables

### Frontend (`frontend/.env`)

```
VITE_API_BASE_URL=http://localhost:5025/api
```

### Backend (`backend/.env`)

```
PORT=5025
JWT_SECRET=your_secure_random_secret
ALLOWED_ORIGINS=http://localhost:5173
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

> ⚠️ Never commit `.env` files or secrets to version control.

---

## ☁️ Deployment

### Backend → Render

The backend is deployed using **Render**.

* Root Directory: `backend`
* Build Command: `npm install`
* Start Command: `npm start`

Set environment variables in Render:

```
PORT=5025
JWT_SECRET=your_secure_random_secret
ALLOWED_ORIGINS=https://your-frontend-url
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Backend URL (example):

```
https://your-backend.onrender.com
```

---

### Frontend → Vercel

The frontend is deployed using **Vercel**.

* Root Directory: `frontend`
* Framework Preset: Vite

Set:

```
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

---

## 🧠 Data Storage

* Uses **Supabase** for persistent storage
* Falls back to in-memory storage if not configured

> ⚠️ In-memory mode is not suitable for production use (data resets on restart)

---

## 🔐 Security Best Practices

* Use strong, unique secrets for JWT
* Keep all sensitive keys server-side only
* Restrict allowed origins properly (CORS)
* Avoid shared credentials in production

---

## 📈 Roadmap

* [ ] Secure user authentication system
* [ ] Timed competition sessions
* [ ] Leaderboard & scoring system
* [ ] Enhanced monitoring & proctoring

---

## 🤝 Contributing

Pull requests are welcome. Open an issue to discuss major changes.

---

## 📄 License

MIT License

---

## 💡 Use Case

Built for hackathons, coding competitions, and technical assessments focused on **debugging skills over memorization**.
