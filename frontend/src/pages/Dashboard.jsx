import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { Power, Info, LogOut } from 'lucide-react';

export default function Dashboard() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  // Redirection handling
  if (user?.hasCompleted) navigate('/complete');
  if (user?.hasStarted) navigate('/exam'); 

  const handleStart = async () => {
    if (confirm("Once you start, you cannot go back or pause the timer. Start now?")) {
      try {
        await api.post('/start');
        updateUser({ hasStarted: true });
        navigate('/exam');
      } catch (err) {
        alert(err.response?.data?.error || 'Error starting exam');
      }
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="brand">
          <Power size={24} /> C & Python Debugging Challenge
        </div>
        <button className="btn btn-secondary" onClick={logout}>
          <LogOut size={16} /> Logout
        </button>
      </nav>

      <div className="container mt-4 animate-fade-in">
        <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2>Welcome, {user?.username}</h2>
          <p className="mb-4">Please read the instructions carefully before starting the exam.</p>

          <div className="info-box">
            <h3 className="flex items-center gap-2"><Info size={20} /> Competition Rules</h3>
            <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
              <li>The exam consists of multiple C and Python debugging questions.</li>
              <li>You have exactly 60 minutes to complete the test.</li>
              <li>Once you move to the next question, you <strong>cannot go back</strong>.</li>
              <li>Do not exit fullscreen or switch tabs. All actions are logged and penalized.</li>
              <li>Copy-pasting and DevTools are strictly prohibited.</li>
            </ul>
          </div>

          <div className="text-center mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
            <button className="btn w-full" style={{ padding: '1rem', fontSize: '1.1rem' }} onClick={handleStart}>
              I understand, Start Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
