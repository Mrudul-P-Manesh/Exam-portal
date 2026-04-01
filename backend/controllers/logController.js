const { insertLogs, updateUser } = require('../data/repository');

const SUSPICION_WEIGHTS = {
  tab_switch: 2,
  fullscreen_exit: 3,
  copy_attempt: 1,
  paste_attempt: 1,
  devtools_attempt: 3,
  disallowed_key: 1,
  context_menu: 1
};

const logEvents = async (req, res) => {
  const user = req.user;
  const { events } = req.body;

  if (!events || !Array.isArray(events)) {
    return res.status(400).json({ error: 'Events array is required.' });
  }

  // Calculate score penalties
  let scoreIncrease = 0;
  
  events.forEach(event => {
    const { type, metadata, timestamp } = event;

    if (SUSPICION_WEIGHTS[type]) {
      scoreIncrease += SUSPICION_WEIGHTS[type];
    }
  });

  await insertLogs({ user, events });

  if (scoreIncrease > 0) {
    const updatedUser = await updateUser(user.id, {
      suspicionScore: (user.suspicionScore || 0) + scoreIncrease
    });
    user.suspicionScore = updatedUser.suspicionScore;
  }

  res.json({ message: 'Events logged successfully.' });
};

module.exports = { logEvents };
