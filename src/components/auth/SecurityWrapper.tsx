
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { validateSession } from '@/utils/authUtils';
import { Loader2 } from 'lucide-react';

interface SecurityWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const SecurityWrapper = ({ children, requireAuth = false }: SecurityWrapperProps) => {
  const { isAuthenticated, loading } = useAuth();
  const [sessionValid, setSessionValid] = useState(true);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (requireAuth && isAuthenticated) {
      setChecking(true);
      validateSession().then((session) => {
        setSessionValid(!!session);
        setChecking(false);
      });
    }
  }, [requireAuth, isAuthenticated]);

  // Show loading while checking authentication
  if (loading || checking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If auth is required but user is not authenticated or session is invalid
  if (requireAuth && (!isAuthenticated || !sessionValid)) {
    window.location.href = '/auth/login';
    return null;
  }

  return <>{children}</>;
};
