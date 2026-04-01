const store = require('./store');
const { supabase } = require('../lib/supabase');

const nowIso = () => new Date().toISOString();
const toIsoTimestamp = (value) => {
  if (!value) return nowIso();
  if (typeof value === 'number') return new Date(value).toISOString();

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return nowIso();
  }

  return parsed.toISOString();
};

const normalizeUser = (user) => {
  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    role: user.role,
    password: user.password,
    suspicionScore: user.suspicion_score ?? user.suspicionScore ?? 0,
    hasStarted: user.has_started ?? user.hasStarted ?? false,
    hasCompleted: user.has_completed ?? user.hasCompleted ?? false,
    startTime: user.start_time ?? user.startTime ?? null
  };
};

const requireSupabase = () => {
  if (!supabase) {
    return null;
  }

  return supabase;
};

const getAdminUser = () => ({ ...store.adminUser });

const findAdminByCredentials = async (username, password) => {
  const adminUser = store.adminUser;
  if (adminUser.username === username && adminUser.password === password) {
    return getAdminUser();
  }
  return null;
};

const findUserById = async (id) => {
  if (id === store.adminUser.id) {
    return getAdminUser();
  }

  const client = requireSupabase();
  if (!client) {
    const user = store.fallback.users.find((entry) => entry.id === id);
    return normalizeUser(user);
  }

  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return normalizeUser(data);
};

const findCandidateByUsername = async (username) => {
  const client = requireSupabase();
  if (!client) {
    const user = store.fallback.users.find(
      (entry) => entry.username.toLowerCase() === username.toLowerCase()
    );
    return normalizeUser(user);
  }

  const { data, error } = await client
    .from('users')
    .select('*')
    .ilike('username', username)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return normalizeUser(data);
};

const createCandidateUser = async (username, password) => {
  const client = requireSupabase();
  if (!client) {
    const nextId = store.fallback.users.reduce((maxId, user) => Math.max(maxId, user.id), store.adminUser.id) + 1;
    const user = {
      id: nextId,
      username,
      password,
      role: 'candidate',
      suspicionScore: 0,
      hasStarted: false,
      hasCompleted: false,
      startTime: null
    };
    store.fallback.users.push(user);
    return normalizeUser(user);
  }

  const { data, error } = await client
    .from('users')
    .insert({
      username,
      password,
      role: 'candidate',
      suspicion_score: 0,
      has_started: false,
      has_completed: false
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return normalizeUser(data);
};

const updateUser = async (id, updates) => {
  if (id === store.adminUser.id) {
    store.adminUser = { ...store.adminUser, ...updates };
    return getAdminUser();
  }

  const client = requireSupabase();
  if (!client) {
    const index = store.fallback.users.findIndex((entry) => entry.id === id);
    if (index === -1) return null;
    store.fallback.users[index] = { ...store.fallback.users[index], ...updates };
    return normalizeUser(store.fallback.users[index]);
  }

  const payload = {};
  if (updates.username !== undefined) payload.username = updates.username;
  if (updates.password !== undefined) payload.password = updates.password;
  if (updates.role !== undefined) payload.role = updates.role;
  if (updates.suspicionScore !== undefined) payload.suspicion_score = updates.suspicionScore;
  if (updates.hasStarted !== undefined) payload.has_started = updates.hasStarted;
  if (updates.hasCompleted !== undefined) payload.has_completed = updates.hasCompleted;
  if (updates.startTime !== undefined) payload.start_time = updates.startTime;

  const { data, error } = await client
    .from('users')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return normalizeUser(data);
};

const listCandidateUsers = async () => {
  const client = requireSupabase();
  if (!client) {
    return store.fallback.users
      .filter((user) => user.role === 'candidate')
      .map(normalizeUser);
  }

  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('role', 'candidate')
    .order('id', { ascending: true });

  if (error) {
    throw error;
  }

  return data.map(normalizeUser);
};

const upsertSubmission = async ({ userId, questionId, sourceCode }) => {
  const timestamp = nowIso();
  const client = requireSupabase();

  if (!client) {
    const existing = store.fallback.submissions.find(
      (entry) => entry.userId === userId && entry.questionId === questionId
    );

    if (existing) {
      existing.sourceCode = sourceCode;
      existing.timestamp = timestamp;
      return existing;
    }

    const submission = { userId, questionId, sourceCode, timestamp };
    store.fallback.submissions.push(submission);
    return submission;
  }

  const { data, error } = await client
    .from('submissions')
    .upsert(
      {
        user_id: userId,
        question_id: questionId,
        source_code: sourceCode,
        updated_at: timestamp
      },
      { onConflict: 'user_id,question_id' }
    )
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
};

const listSubmissionsByUser = async (userId) => {
  const client = requireSupabase();
  if (!client) {
    return store.fallback.submissions.filter((entry) => entry.userId === userId);
  }

  const { data, error } = await client
    .from('submissions')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data.map((entry) => ({
    userId: entry.user_id,
    questionId: entry.question_id,
    sourceCode: entry.source_code,
    timestamp: entry.updated_at
  }));
};

const insertLogs = async ({ user, events }) => {
  const client = requireSupabase();
  const logs = events.map((event) => ({
    userId: user.id,
    username: user.username,
    eventType: event.type,
    metadata: event.metadata || null,
    timestamp: toIsoTimestamp(event.timestamp)
  }));

  if (!client) {
    store.fallback.logs.push(...logs);
    return logs;
  }

  const { error } = await client.from('logs').insert(
    logs.map((entry) => ({
      user_id: entry.userId,
      username: entry.username,
      event_type: entry.eventType,
      metadata: entry.metadata,
      created_at: entry.timestamp
    }))
  );

  if (error) {
    throw error;
  }

  return logs;
};

const listLogsByUser = async (userId) => {
  const client = requireSupabase();
  if (!client) {
    return store.fallback.logs.filter((entry) => entry.userId === userId);
  }

  const { data, error } = await client
    .from('logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data.map((entry) => ({
    id: entry.id,
    userId: entry.user_id,
    username: entry.username,
    eventType: entry.event_type,
    metadata: entry.metadata,
    timestamp: entry.created_at
  }));
};

module.exports = {
  store,
  getAdminUser,
  findAdminByCredentials,
  findUserById,
  findCandidateByUsername,
  createCandidateUser,
  updateUser,
  listCandidateUsers,
  upsertSubmission,
  listSubmissionsByUser,
  insertLogs,
  listLogsByUser
};
