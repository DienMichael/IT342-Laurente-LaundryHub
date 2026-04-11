import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './app/context/AuthContext';
import { Login } from './app/components/auth/Login';
import { Register } from './app/components/auth/Register';
import './App.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

function AppContent() {
  const { user } = useAuth();

  return (
    <Routes>
      {user ? (
        <>
          <Route path="/login" element={<Navigate to={user.role === 'STAFF' || user.role === 'ADMIN' ? '/staff' : '/customer'} />} />
          <Route path="/register" element={<Navigate to={user.role === 'STAFF' || user.role === 'ADMIN' ? '/staff' : '/customer'} />} />
          <Route path="/staff" element={<ProtectedRoute><div className="p-8">Staff Dashboard - Coming Soon</div></ProtectedRoute>} />
          <Route path="/customer" element={<ProtectedRoute><div className="p-8">Customer Dashboard - Coming Soon</div></ProtectedRoute>} />
          <Route path="/" element={<Navigate to={user.role === 'STAFF' || user.role === 'ADMIN' ? '/staff' : '/customer'} />} />
        </>
      ) : (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </>
      )}
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <Toaster position="top-center" />
      </AuthProvider>
    </Router>
  );
}

export default App;
