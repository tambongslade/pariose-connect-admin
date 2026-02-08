import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../lib/auth';

export function AuthChecker() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check auth status every 5 seconds
    const interval = setInterval(() => {
      if (!isAuthenticated() && location.pathname !== '/login') {
        navigate('/login', { replace: true });
      } else if (isAuthenticated() && !isAdmin() && location.pathname !== '/login') {
        // User is authenticated but not an admin
        localStorage.clear();
        navigate('/login', { replace: true });
      }
    }, 5000);

    // Also check on storage changes (e.g., if user manually deletes token)
    const handleStorageChange = (e: StorageEvent) => {
      if ((e.key === 'auth_token' || e.key === 'user') && location.pathname !== '/login') {
        if (!isAuthenticated() || !isAdmin()) {
          localStorage.clear();
          navigate('/login', { replace: true });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate, location.pathname]);

  return null;
}
