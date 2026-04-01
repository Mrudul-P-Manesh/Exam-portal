const store = require('../data/store');

const EXAM_DURATION_MS = 60 * 60 * 1000; // 60 minutes

const startExam = (req, res) => {
  const user = req.user;
  
  if (user.hasCompleted) {
    return res.status(403).json({ error: 'Exam already completed.' });
  }

  if (!user.hasStarted) {
    user.hasStarted = true;
    user.startTime = Date.now();
  }

  res.json({
    message: 'Exam started',
    startTime: user.startTime,
    durationMs: EXAM_DURATION_MS
  });
};

const getQuestions = (req, res) => {
  const user = req.user;

  if (!user.hasStarted) {
    return res.status(403).json({ error: 'Exam has not been started.' });
  }

  if (user.hasCompleted || (Date.now() - user.startTime > EXAM_DURATION_MS)) {
    user.hasCompleted = true; // Auto-complete if time expired
    return res.status(403).json({ error: 'Exam time expired or already completed.' });
  }

  // Hide the exact solution or any backend-only fields if we had them
  // For now, we return the questions
  res.json({ questions: store.questions });
};

const submitAnswer = (req, res) => {
  const user = req.user;
  const { questionId, sourceCode } = req.body;

  if (!user.hasStarted || user.hasCompleted || (Date.now() - user.startTime > EXAM_DURATION_MS)) {
    user.hasCompleted = true;
    return res.status(403).json({ error: 'Cannot submit. Exam completed or time expired.' });
  }

  // Check if already submitted and update, or add new
  const existingSubmissionIndex = store.submissions.findIndex(
    s => s.userId === user.id && s.questionId === questionId
  );

  if (existingSubmissionIndex > -1) {
    store.submissions[existingSubmissionIndex].sourceCode = sourceCode;
    store.submissions[existingSubmissionIndex].timestamp = Date.now();
  } else {
    store.submissions.push({
      userId: user.id,
      questionId,
      sourceCode,
      timestamp: Date.now()
    });
  }

  res.json({ message: 'Answer saved securely.' });
};

const completeExam = (req, res) => {
  const user = req.user;
  user.hasCompleted = true;
  res.json({ message: 'Exam submitted successfully.' });
};

module.exports = { startExam, getQuestions, submitAnswer, completeExam };
