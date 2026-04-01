const { store, updateUser, upsertSubmission } = require('../data/repository');

const EXAM_DURATION_MS = 60 * 60 * 1000; // 60 minutes

const startExam = async (req, res) => {
  const user = req.user;
  
  if (user.hasCompleted) {
    return res.status(403).json({ error: 'Exam already completed.' });
  }

  if (!user.hasStarted) {
    const updatedUser = await updateUser(user.id, {
      hasStarted: true,
      startTime: new Date().toISOString()
    });
    user.hasStarted = updatedUser.hasStarted;
    user.startTime = updatedUser.startTime;
  }

  res.json({
    message: 'Exam started',
    startTime: user.startTime,
    durationMs: EXAM_DURATION_MS
  });
};

const getQuestions = async (req, res) => {
  const user = req.user;

  if (!user.hasStarted) {
    return res.status(403).json({ error: 'Exam has not been started.' });
  }

  const elapsedMs = user.startTime ? (Date.now() - new Date(user.startTime).getTime()) : 0;

  if (user.hasCompleted || elapsedMs > EXAM_DURATION_MS) {
    await updateUser(user.id, { hasCompleted: true });
    return res.status(403).json({ error: 'Exam time expired or already completed.' });
  }

  // Hide the exact solution or any backend-only fields if we had them
  // For now, we return the questions
  res.json({ questions: store.questions });
};

const submitAnswer = async (req, res) => {
  const user = req.user;
  const { questionId, sourceCode } = req.body;

  const elapsedMs = user.startTime ? (Date.now() - new Date(user.startTime).getTime()) : 0;

  if (!user.hasStarted || user.hasCompleted || elapsedMs > EXAM_DURATION_MS) {
    await updateUser(user.id, { hasCompleted: true });
    return res.status(403).json({ error: 'Cannot submit. Exam completed or time expired.' });
  }

  await upsertSubmission({ userId: user.id, questionId, sourceCode });

  res.json({ message: 'Answer saved securely.' });
};

const completeExam = async (req, res) => {
  const user = req.user;
  await updateUser(user.id, { hasCompleted: true });
  res.json({ message: 'Exam submitted successfully.' });
};

module.exports = { startExam, getQuestions, submitAnswer, completeExam };
