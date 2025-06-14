
import { useEffect } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const PushNotificationManager = () => {
  const { showNotification, permission } = usePushNotifications();
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id || permission !== 'granted') return;

    // Listen for new notifications in real-time
    const channel = supabase
      .channel('push-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const notification = payload.new;
          
          // Show push notification for new records
          if (!notification.read) {
            showNotification(getNotificationTitle(notification.type), {
              body: notification.content,
              tag: `notification-${notification.id}`,
              data: {
                notificationId: notification.id,
                actionUrl: notification.action_url
              }
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, permission, showNotification]);

  return null; // This component doesn't render anything
};

const getNotificationTitle = (type: string): string => {
  switch (type) {
    case 'message':
      return 'New Message';
    case 'sale':
      return 'Item Sold';
    case 'purchase':
      return 'Purchase Update';
    case 'system':
      return 'System Notification';
    default:
      return 'New Notification';
  }
};
