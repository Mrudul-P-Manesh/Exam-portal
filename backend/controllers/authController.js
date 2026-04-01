const jwt = require('jsonwebtoken');
const store = require('../data/store');

const createToken = (user) => jwt.sign(
  { id: user.id, username: user.username, role: user.role },
  process.env.JWT_SECRET || 'super_secret_jwt_key_for_demo_purposes_only',
  { expiresIn: '2h' }
);

const sendLoginResponse = (user, res) => {
  const token = createToken(user);

  store.activeSessions.add(user.id);

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      hasStarted: user.hasStarted,
      hasCompleted: user.hasCompleted
    }
  });
};

const login = (req, res) => {
  const { username, password } = req.body;
  const trimmedUsername = username?.trim();

  const adminUser = store.users.find(
    (u) => u.role === 'admin' && u.username === trimmedUsername && u.password === password
  );

  if (adminUser) {
    return sendLoginResponse(adminUser, res);
  }

  if (!trimmedUsername) {
    return res.status(400).json({ error: 'Name is required.' });
  }

  const isValidCandidatePassword = store.candidateAccessPasswords.includes(password);

  if (!isValidCandidatePassword) {
    return res.status(401).json({ error: 'Invalid password.' });
  }

  if (trimmedUsername.toLowerCase() === 'admin') {
    return res.status(400).json({ error: 'This name is reserved. Please use your own name.' });
  }

  let candidateUser = store.users.find(
    (u) => u.role === 'candidate' && u.username.toLowerCase() === trimmedUsername.toLowerCase()
  );

  if (!candidateUser) {
    const nextId = store.users.reduce((maxId, user) => Math.max(maxId, user.id), 0) + 1;
    candidateUser = {
      id: nextId,
      username: trimmedUsername,
      password,
      role: 'candidate',
      suspicionScore: 0,
      hasStarted: false,
      hasCompleted: false
    };
    store.users.push(candidateUser);
  }

  if (store.activeSessions.has(candidateUser.id)) {
    return res.status(403).json({ error: 'This competitor is already logged in on another device/session.' });
  }

  return sendLoginResponse(candidateUser, res);
};

const logout = (req, res) => {
  const userId = req.user.id;
  store.activeSessions.delete(userId);
  res.json({ message: 'Logged out successfully' });
};

module.exports = { login, logout };
