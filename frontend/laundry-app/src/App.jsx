import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Customer Pages
import Dashboard from './pages/customer/Dashboard';
import CreateBooking from './pages/customer/CreateBooking';
import OrderHistory from './pages/customer/OrderHistory';
import OrderTracking from './pages/customer/OrderTracking';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import OrderManagement from './pages/staff/OrderManagement';
import WeighOrder from './pages/staff/WeighOrder';
import AssignMachine from './pages/staff/AssignMachine';

import './App.css';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><div className="text-center"><div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div><p className="mt-4 text-gray-600">Loading...</p></div></div>;
  }

  return (
    <>
      {user && <Navbar />}
      <Routes>
        {user ? (
          <>
            {/* Customer Routes */}
            <Route
              path="/customer"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'customer']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'customer']}>
                  <CreateBooking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'customer']}>
                  <OrderHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'customer']}>
                  <OrderTracking />
                </ProtectedRoute>
              }
            />

            {/* Staff Routes */}
            <Route
              path="/staff"
              element={
                <ProtectedRoute allowedRoles={['STAFF', 'ADMIN', 'staff', 'admin']}>
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/orders"
              element={
                <ProtectedRoute allowedRoles={['STAFF', 'ADMIN', 'staff', 'admin']}>
                  <OrderManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/weigh/:status"
              element={
                <ProtectedRoute allowedRoles={['STAFF', 'ADMIN', 'staff', 'admin']}>
                  <WeighOrder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/assign"
              element={
                <ProtectedRoute allowedRoles={['STAFF', 'ADMIN', 'staff', 'admin']}>
                  <AssignMachine />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/assign-machine/:id"
              element={
                <ProtectedRoute allowedRoles={['STAFF', 'ADMIN', 'staff', 'admin']}>
                  <AssignMachine />
                </ProtectedRoute>
              }
            />


            {/* Redirect auth pages when logged in */}
            <Route path="/login" element={<Navigate to={user.role?.toUpperCase() === 'STAFF' || user.role?.toUpperCase() === 'ADMIN' ? '/staff' : '/customer'} />} />
            <Route path="/register" element={<Navigate to={user.role?.toUpperCase() === 'STAFF' || user.role?.toUpperCase() === 'ADMIN' ? '/staff' : '/customer'} />} />
            
            {/* Root redirect based on role */}
            <Route path="/" element={<Navigate to={user.role?.toUpperCase() === 'STAFF' || user.role?.toUpperCase() === 'ADMIN' ? '/staff' : '/customer'} />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </>
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
