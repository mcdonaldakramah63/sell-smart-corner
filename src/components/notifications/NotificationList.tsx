
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format, isToday, isYesterday } from 'date-fns';
import { Notification } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, ShoppingBag, AlertCircle, Bell } from 'lucide-react';

interface NotificationListProps {
  notifications: Notification[];
}

export default function NotificationList({ notifications }: NotificationListProps) {
  const [readAll, setReadAll] = useState(false);
  
  // Group notifications by date
  const groupedNotifications = notifications.reduce<Record<string, Notification[]>>((groups, notification) => {
    const date = new Date(notification.createdAt);
    let groupName = format(date, 'MMM d, yyyy');
    
    if (isToday(date)) {
      groupName = 'Today';
    } else if (isYesterday(date)) {
      groupName = 'Yesterday';
    }
    
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    
    groups[groupName].push(notification);
    return groups;
  }, {});
  
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'sale':
      case 'purchase':
        return <ShoppingBag className="h-5 w-5 text-green-500" />;
      case 'system':
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <>
      {notifications.length > 0 ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Your Notifications</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setReadAll(true)}
              disabled={readAll}
            >
              Mark all as read
            </Button>
          </div>
          
          {Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">{date}</h3>
              <div className="space-y-3">
                {dateNotifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={notification.read || readAll ? 'opacity-60' : 'border-l-4 border-l-primary'}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className="shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p>{notification.content}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(notification.createdAt), 'h:mm a')}
                          </p>
                        </div>
                        {notification.actionUrl && (
                          <div className="ml-auto flex items-center">
                            <Button size="sm" variant="ghost" asChild>
                              <Link to={notification.actionUrl}>View</Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p>You don't have any notifications yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Notifications about your listings, messages, and purchases will appear here
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/">Browse Used Market</Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
