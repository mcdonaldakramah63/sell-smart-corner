
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, Trash2 } from 'lucide-react';
import { Notification } from '@/lib/types';

export default function NotificationsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setNotifications((data || []).map(notif => ({
          id: notif.id,
          userId: notif.user_id,
          type: (notif.type || 'system') as Notification['type'],
          content: notif.content,
          createdAt: notif.created_at,
          read: notif.read || false,
          actionUrl: notif.action_url
        })));
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast({
          title: 'Error',
          description: 'Failed to load notifications',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user?.id, toast]);

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
      
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setNotifications(prev => prev.filter(notif => notif.id !== id));
      toast({
        title: 'Notification deleted',
        description: 'The notification has been removed'
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete notification',
        variant: 'destructive'
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user?.id)
        .eq('read', false);
      
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      
      toast({
        title: 'All notifications marked as read',
        description: 'All your notifications have been marked as read'
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Notifications</h1>
          </div>
          {notifications.some(n => !n.read) && (
            <Button onClick={markAllAsRead} variant="outline">
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card key={notification.id} className={`${!notification.read ? 'border-primary/50 bg-primary/5' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={notification.read ? 'secondary' : 'default'}>
                        {notification.type}
                      </Badge>
                      {!notification.read && (
                        <Badge variant="outline" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{notification.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                  {notification.actionUrl && (
                    <Button asChild size="sm" className="mt-3">
                      <a href={notification.actionUrl}>View</a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bell className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No notifications</h2>
            <p className="text-muted-foreground">
              You're all caught up! New notifications will appear here.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
