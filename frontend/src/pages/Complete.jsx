import { CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Complete() {
  const { logout } = useAuth();
  
  return (
    <div className="center-screen text-center animate-fade-in">
      <div className="glass-card">
        <CheckCircle size={64} color="var(--success)" style={{ margin: '0 auto 1.5rem' }} />
        <h1>Exam Completed!</h1>
        <p>Your answers have been submitted securely.</p>
        <p className="mb-4">You may now close the browser or log out.</p>
        
        <button className="btn btn-secondary mt-2" onClick={logout}>
          Return to Login
        </button>
      </div>
    </div>
  );
}
