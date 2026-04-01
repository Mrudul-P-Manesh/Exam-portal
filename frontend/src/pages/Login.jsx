import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ShieldAlert, LogIn } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    if (user.role === 'admin') navigate('/admin');
    else if (user.hasCompleted) navigate('/complete');
    else navigate('/dashboard');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const res = await login(username, password);
    
    if (res.success) {
      if (res.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(res.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="center-screen">
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <ShieldAlert size={48} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
          <h2>SEB Secure Login</h2>
          <p>Enter your name and the password provided by the organizer</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Your Name</label>
            <input 
              type="text" 
              className="input-field"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="input-group">
            <label>Access Password</label>
            <input 
              type="password" 
              className="input-field"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter exam password"
              required
            />
          </div>

          <button type="submit" className="btn w-full mt-2" disabled={isLoading}>
            {isLoading ? 'Authenticating...' : <><LogIn size={18} /> Login to Portal</>}
          </button>
        </form>
      </div>
    </div>
  );
}
