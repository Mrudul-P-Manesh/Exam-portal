const { store, listCandidateUsers, listLogsByUser, listSubmissionsByUser } = require('../data/repository');

const getUsers = async (req, res) => {
  const users = await listCandidateUsers();
  const candidates = users.map(u => ({
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

const getUserLogs = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const logs = await listLogsByUser(userId);
  res.json({ logs });
};

const getUserSubmissions = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const submissions = await listSubmissionsByUser(userId);
  res.json({ submissions });
};

module.exports = { getUsers, getUserLogs, getUserSubmissions };
