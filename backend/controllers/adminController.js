const store = require('../data/store');

const getUsers = (req, res) => {
  const candidates = store.users
  .filter(u => u.role === 'candidate')
  .map(u => ({
    id: u.id,
    username: u.username,
    role: u.role,
    suspicionScore: u.suspicionScore || 0,
    hasStarted: u.hasStarted,
    hasCompleted: u.hasCompleted,
    isSuspicious: (u.suspicionScore || 0) >= 10,
    isOnline: store.activeSessions.has(u.id)
  }));
  res.json({ candidates });
};

const getUserLogs = (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const logs = store.logs.filter(log => log.userId === userId);
  res.json({ logs });
};

const getUserSubmissions = (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const submissions = store.submissions.filter(sub => sub.userId === userId);
  res.json({ submissions });
};

module.exports = { getUsers, getUserLogs, getUserSubmissions };
