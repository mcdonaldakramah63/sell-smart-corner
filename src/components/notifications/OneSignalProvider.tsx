import { useEffect } from 'react';
import { useOneSignal } from '@/hooks/useOneSignal';
import { useAuth } from '@/contexts/AuthContext';

interface OneSignalProviderProps {
  children: React.ReactNode;
  userType?: 'customer' | 'rider';
}

export const OneSignalProvider = ({ children, userType = 'customer' }: OneSignalProviderProps) => {
  const { user } = useAuth();
  const { isInitialized, isSubscribed, subscribe } = useOneSignal(userType);

  // Auto-prompt for notification permission after login
  useEffect(() => {
    if (user && isInitialized && !isSubscribed) {
      // Delay prompt to not overwhelm user right after login
      const timer = setTimeout(() => {
        subscribe();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [user, isInitialized, isSubscribed, subscribe]);

  return <>{children}</>;
};
