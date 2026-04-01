const store = require('../data/store');

const SUSPICION_WEIGHTS = {
  tab_switch: 2,
  fullscreen_exit: 3,
  copy_attempt: 1,
  paste_attempt: 1,
  devtools_attempt: 3,
  disallowed_key: 1,
  context_menu: 1
};

const logEvents = (req, res) => {
  const user = req.user;
  const { events } = req.body;

  if (!events || !Array.isArray(events)) {
    return res.status(400).json({ error: 'Events array is required.' });
  }

  // Calculate score penalties
  let scoreIncrease = 0;
  
  events.forEach(event => {
    const { type, metadata, timestamp } = event;
    
    // add to store logs
    store.logs.push({
      id: Date.now() + Math.random().toString(36).substring(7),
      userId: user.id,
      username: user.username,
      eventType: type,
      metadata,
      timestamp: timestamp || Date.now()
    });

    if (SUSPICION_WEIGHTS[type]) {
      scoreIncrease += SUSPICION_WEIGHTS[type];
    }
  });

  if (scoreIncrease > 0) {
    user.suspicionScore = (user.suspicionScore || 0) + scoreIncrease;
  }

  res.json({ message: 'Events logged successfully.' });
};

module.exports = { logEvents };
