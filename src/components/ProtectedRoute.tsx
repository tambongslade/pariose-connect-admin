import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { isAuthenticated, isAdmin } from '../lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();

  useEffect(() => {
    // Check token and admin role on every route change
    const checkAuth = () => {
      if (!isAuthenticated() && location.pathname !== '/login') {
        window.location.href = '/login';
      } else if (isAuthenticated() && !isAdmin()) {
        // User is authenticated but not an admin
        localStorage.clear();
        window.location.href = '/login';
      }
    };

    checkAuth();
  }, [location]);

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    // Clear storage and redirect to login
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
