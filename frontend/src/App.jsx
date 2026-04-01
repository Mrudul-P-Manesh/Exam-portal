import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Exam from './pages/Exam';
import Complete from './pages/Complete';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole="candidate">
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/exam" element={
            <ProtectedRoute requiredRole="candidate">
              <Exam />
            </ProtectedRoute>
          } />

          <Route path="/complete" element={
            <ProtectedRoute requiredRole="candidate">
              <Complete />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminPanel />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
