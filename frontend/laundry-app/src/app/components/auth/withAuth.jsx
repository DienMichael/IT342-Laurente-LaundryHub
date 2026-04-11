import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

/**
 * Decorator Pattern (React HOC): withAuth
 * 
 * This Higher-Order Component "decorates" private pages by wrapping them in
 * authentication checks. It ensures that only authenticated users can access
 * the wrapped component.
 * 
 * Usage:
 *   const ProtectedDashboard = withAuth(Dashboard);
 *   <ProtectedDashboard />
 * 
 * How it works:
 *   - Checks if user is authenticated
 *   - Shows loading state while checking
 *   - Redirects to login if not authenticated
 *   - Renders the wrapped component if authenticated
 *   - Can optionally check for specific roles
 */
export function withAuth(Component, requiredRole = null) {
  return function ProtectedComponent(props) {
    const { user, loading } = useAuth();

    // Show loading state while checking authentication
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    // Redirect to login if not authenticated
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    // Check for required role if specified
    if (requiredRole && user.role !== requiredRole.toUpperCase()) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
            <p className="mt-4 text-gray-600">
              You don't have permission to access this page.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Required role: {requiredRole} | Your role: {user.role}
            </p>
          </div>
        </div>
      );
    }

    // Render the wrapped component with all props
    return <Component {...props} />;
  };
}
