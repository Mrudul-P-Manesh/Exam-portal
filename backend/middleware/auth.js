const jwt = require('jsonwebtoken');
const store = require('../data/store');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_for_demo_purposes_only');
    const user = store.users.find((u) => u.id === decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid user.' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admin only.' });
  }
};

module.exports = { authenticate, requireAdmin };
