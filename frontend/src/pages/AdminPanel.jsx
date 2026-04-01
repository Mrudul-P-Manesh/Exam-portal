import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { Users, Activity, LogOut, ChevronRight, AlertTriangle } from 'lucide-react';

export default function AdminPanel() {
  const { logout } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetchCandidates();
    const interval = setInterval(fetchCandidates, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchCandidates = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setCandidates(data.candidates.filter(c => c.role !== 'admin'));
    } catch (e) {
      console.error(e);
    }
  };

  const showUserDetails = async (userId) => {
    const user = candidates.find(c => c.id === userId);
    setSelectedUser(user);
    try {
      const [logsRes, subRes] = await Promise.all([
        api.get(`/admin/users/${userId}/logs`),
        api.get(`/admin/users/${userId}/submissions`)
      ]);
      setLogs(logsRes.data.logs);
      setSubmissions(subRes.data.submissions);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="navbar" style={{ background: '#1c1c28' }}>
        <div className="brand" style={{ color: '#818cf8' }}>
          <Users size={24} /> Admin Dashboard
        </div>
        <button className="btn btn-secondary" onClick={logout}>
          <LogOut size={16} /> Logout
        </button>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar: Candidates List */}
        <div style={{ borderRight: '1px solid var(--border-color)', overflowY: 'auto', padding: '1.5rem', background: 'var(--bg-glass)' }}>
          <h3 className="mb-4 flex items-center gap-2"><Activity size={18} /> Candidates</h3>
          
          {candidates.map(candidate => (
            <div 
              key={candidate.id}
              onClick={() => showUserDetails(candidate.id)}
              style={{
                padding: '1rem',
                borderRadius: '8px',
                background: selectedUser?.id === candidate.id ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                cursor: 'pointer',
                marginBottom: '1rem',
                border: candidate.isSuspicious ? '1px solid var(--danger)' : '1px solid transparent',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {candidate.username}
                  {candidate.isOnline && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }}></span>}
                </div>
                <div style={{ fontSize: '0.8rem', color: selectedUser?.id === candidate.id ? '#ddd' : 'var(--text-secondary)' }}>
                  Score: <span style={{ color: candidate.isSuspicious ? 'var(--danger)' : 'inherit', fontWeight: 'bold' }}>{candidate.suspicionScore}</span>
                </div>
              </div>
              <ChevronRight size={16} />
            </div>
          ))}
        </div>

        {/* Main Area: Detailed Logs & Submissions */}
        <div style={{ padding: '2rem', overflowY: 'auto' }}>
          {selectedUser ? (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h2>{selectedUser.username} Overview</h2>
                {selectedUser.isSuspicious && (
                  <div className="badge danger flex gap-2 items-center text-sm px-3 py-2">
                    <AlertTriangle size={18} /> High Suspicion
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Event Logs */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h3 className="mb-2">Anti-Cheat Logs</h3>
                  {logs.length === 0 ? <p>No suspicious events recorded.</p> : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {logs.slice().reverse().map(log => (
                        <div key={log.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '6px' }}>
                          <div className="flex justify-between text-sm mb-1">
                            <strong style={{ color: 'var(--accent-secondary)' }}>{log.eventType.toUpperCase()}</strong>
                            <span style={{ color: 'var(--text-secondary)' }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <pre style={{ margin: 0, padding: 0, background: 'transparent', border: 'none', fontSize: '0.75rem' }}>
                            {JSON.stringify(log.metadata)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submissions */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h3 className="mb-2">Code Submissions</h3>
                  {submissions.length === 0 ? <p>No answers submitted yet.</p> : (
                    submissions.map(sub => (
                      <div key={sub.questionId} className="mb-4">
                        <h4>Question ID: {sub.questionId}</h4>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                          Saved: {new Date(sub.timestamp).toLocaleTimeString()}
                        </div>
                        <pre style={{ maxHeight: '200px' }}>{sub.sourceCode}</pre>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="center-screen" style={{ minHeight: '100%', color: 'var(--text-secondary)' }}>
              Select a candidate from the sidebar to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
