import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if specified
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role?.toUpperCase();
    const hasRequiredRole = allowedRoles.some(
      role => role.toUpperCase() === userRole
    );

    if (!hasRequiredRole) {
      // Redirect to appropriate dashboard based on role
      if (userRole === 'CUSTOMER') {
        return <Navigate to="/dashboard" replace />;
      } else if (userRole === 'STAFF' || userRole === 'ADMIN') {
        return <Navigate to="/staff" replace />;
      }
      return <Navigate to="/login" replace />;
    }
  }

  // Authenticated and authorized - render children
  return children;
};

export default ProtectedRoute;