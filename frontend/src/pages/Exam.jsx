import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAntiCheat } from '../hooks/useAntiCheat';
import api from '../utils/api';
import { Clock, Send, AlertTriangle } from 'lucide-react';

export default function Exam() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  // Anti-cheat hook activated!
  useAntiCheat(true);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(60 * 60); // Default to 60 mins fallback
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user.hasCompleted) {
      navigate('/complete');
      return;
    }

    const fetchExamData = async () => {
      try {
        const { data } = await api.get('/questions');
        setQuestions(data.questions);
        if (data.questions.length > 0) {
          setCode(data.questions[0].codeSnippet);
        }
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 403) {
          updateUser({ hasCompleted: true });
          navigate('/complete');
        }
      }
    };

    fetchExamData();
  }, [user, navigate, updateUser]);

  // Temporary simplified timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit(); // Auto-submit when time is up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []); // Note: real app would sync with backend start time dynamically.

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleNextOrSubmit = async () => {
    const currentQ = questions[currentIndex];
    
    // Save current answer
    try {
      await api.post('/submit', {
        questionId: currentQ.id,
        sourceCode: code
      });
    } catch (e) {
      console.error("Failed to save answer");
    }

    if (currentIndex < questions.length - 1) {
      // Move next
      setCurrentIndex(prev => prev + 1);
      setCode(questions[currentIndex + 1].codeSnippet);
    } else {
      // Final submit
      await handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    try {
      if (questions[currentIndex]) {
        await api.post('/submit', {
          questionId: questions[currentIndex].id,
          sourceCode: code
        });
      }
      await api.post('/complete');
      updateUser({ hasCompleted: true });
      navigate('/complete');
    } catch (err) {
      console.error(err);
      // Fallback
      updateUser({ hasCompleted: true });
      navigate('/complete');
    }
  };

  if (loading) return <div className="center-screen">Loading exam environment...</div>;

  const currentQ = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="exam-container">
      <nav className="navbar" style={{ background: 'var(--bg-primary)' }}>
        <div className="brand" style={{ color: 'var(--danger)' }}>
          <AlertTriangle size={20} /> SECURE ENVIRONMENT ACTIVE
        </div>
        <div className="timer badge warning text-lg flex items-center gap-2 px-3 py-1">
          <Clock size={16} /> {formatTime(timeLeft)}
        </div>
      </nav>

      <div className="exam-layout">
        {/* Left Panel: Problem Statement */}
        <div className="panel animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <span className="badge">Question {currentIndex + 1} of {questions.length}</span>
            <span className="badge">{currentQ?.language || 'Code'}</span>
          </div>
          
          <h2>{currentQ?.title}</h2>
          <p className="mb-4">{currentQ?.description}</p>
          
          <div className="info-box mt-auto">
            <h4 className="mb-1">Sample Input</h4>
            <pre>{currentQ?.sampleInput}</pre>
            <h4 className="mt-2 mb-1">Expected Output</h4>
            <pre>{currentQ?.sampleOutput}</pre>
          </div>
        </div>

        {/* Right Panel: Code Editor */}
        <div className="panel animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div className="flex justify-between items-center mb-2">
            <h3 style={{ margin: 0, fontSize: '1rem' }}>Code Editor ({currentQ?.language || 'Code'})</h3>
          </div>
          
          <textarea
            className="code-editor-area"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
            style={{ flexGrow: 1, height: '100%', minHeight: '400px' }}
          />

          <div className="flex justify-between mt-4">
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Cannot go back after pressing {isLastQuestion ? 'Submit' : 'Next'}
            </p>
            <button 
              className={`btn ${isLastQuestion ? 'btn-danger' : ''}`} 
              onClick={handleNextOrSubmit}
            >
              {isLastQuestion ? <><Send size={16} /> Final Submit</> : 'Save & Next Question'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
