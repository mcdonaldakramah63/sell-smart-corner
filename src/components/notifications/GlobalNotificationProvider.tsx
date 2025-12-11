import { useEffect } from 'react';
import { useGlobalNotifications } from '@/hooks/useGlobalNotifications';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useAuth } from '@/contexts/AuthContext';

interface GlobalNotificationProviderProps {
  children: React.ReactNode;
}

export const GlobalNotificationProvider = ({ children }: GlobalNotificationProviderProps) => {
  const { user } = useAuth();
  const { requestPermission, permission } = usePushNotifications();
  
  // Set up global notifications
  useGlobalNotifications();

  // Request notification permission on login
  useEffect(() => {
    if (user && permission === 'default') {
      // Small delay to not overwhelm user right after login
      const timer = setTimeout(() => {
        requestPermission();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, permission, requestPermission]);

  return <>{children}</>;
};
