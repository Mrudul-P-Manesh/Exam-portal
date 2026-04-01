require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { authenticate, requireAdmin } = require('./middleware/auth');
const { login, logout } = require('./controllers/authController');
const { startExam, getQuestions, submitAnswer, completeExam } = require('./controllers/examController');
const { logEvents } = require('./controllers/logController');
const { getUsers, getUserLogs, getUserSubmissions } = require('./controllers/adminController');

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  }
}));
app.use(express.json());

// Public Routes
app.post('/api/login', login);

// Protected Routes
app.use('/api', authenticate);

app.post('/api/logout', logout);
app.post('/api/start', startExam);
app.get('/api/questions', getQuestions);
app.post('/api/submit', submitAnswer);
app.post('/api/complete', completeExam);
app.post('/api/log-event', logEvents);

// Admin Routes
app.get('/api/admin/users', requireAdmin, getUsers);
app.get('/api/admin/users/:userId/logs', requireAdmin, getUserLogs);
app.get('/api/admin/users/:userId/submissions', requireAdmin, getUserSubmissions);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
