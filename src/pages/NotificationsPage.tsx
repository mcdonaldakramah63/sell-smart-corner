import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, Trash2, Dot } from 'lucide-react';
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

      toast({
        title: 'Notification marked as read',
        description: 'The notification has been marked as read'
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive'
      });
    }
  };

  const handleViewAction = async (id: string, actionUrl: string) => {
    // Mark as read when viewing
    await markAsRead(id);
    // Navigate to the action URL
    window.open(actionUrl, '_blank');
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
      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read',
        variant: 'destructive'
      });
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
              <Card 
                key={notification.id} 
                className={`transition-all duration-200 ${
                  !notification.read 
                    ? 'border-primary/50 bg-primary/5 shadow-md' 
                    : 'bg-muted/50 opacity-75'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {!notification.read && (
                        <Dot className="h-6 w-6 text-primary animate-pulse" />
                      )}
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={notification.read ? 'secondary' : 'default'}
                          className={notification.read ? 'opacity-60' : ''}
                        >
                          {notification.type}
                        </Badge>
                        {!notification.read && (
                          <Badge variant="destructive" className="text-xs px-2">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                          className="hover:bg-primary/10"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteNotification(notification.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className={`text-sm ${notification.read ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>
                    {notification.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                  {notification.actionUrl && (
                    <Button 
                      size="sm" 
                      className="mt-3" 
                      variant={notification.read ? 'outline' : 'default'}
                      onClick={() => handleViewAction(notification.id, notification.actionUrl!)}
                    >
                      View
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
