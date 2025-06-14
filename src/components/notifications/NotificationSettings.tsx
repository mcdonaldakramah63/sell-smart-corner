
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, BellOff } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';

interface NotificationSettingsProps {
  emailNotifications: boolean;
  pushNotifications: boolean;
  onEmailNotificationsChange: (enabled: boolean) => void;
  onPushNotificationsChange: (enabled: boolean) => void;
}

export const NotificationSettings = ({
  emailNotifications,
  pushNotifications,
  onEmailNotificationsChange,
  onPushNotificationsChange
}: NotificationSettingsProps) => {
  const { permission, requestPermission, sendTestNotification, isSupported } = usePushNotifications();

  const handlePushNotificationToggle = async (enabled: boolean) => {
    if (enabled && permission !== 'granted') {
      const granted = await requestPermission();
      if (granted) {
        onPushNotificationsChange(true);
      }
    } else {
      onPushNotificationsChange(enabled);
    }
  };

  return (
    <Card className="shadow-lg border-slate-200 bg-white">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-md">
            <Bell className="h-4 w-4 text-white" />
          </div>
          <CardTitle className="text-slate-800">Notification Preferences</CardTitle>
        </div>
        <CardDescription>
          Choose how you want to be notified about marketplace activity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
          <div>
            <Label htmlFor="email-notifications" className="font-medium text-slate-800">
              Email Notifications
            </Label>
            <p className="text-sm text-slate-600">
              Receive email notifications for messages and updates
            </p>
          </div>
          <Switch
            id="email-notifications"
            checked={emailNotifications}
            onCheckedChange={onEmailNotificationsChange}
          />
        </div>
        
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
          <div>
            <Label htmlFor="push-notifications" className="font-medium text-slate-800">
              Push Notifications
            </Label>
            <p className="text-sm text-slate-600">
              Receive browser notifications for real-time updates
            </p>
            {!isSupported && (
              <p className="text-xs text-red-600 mt-1">
                Push notifications are not supported in your browser
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {permission === 'denied' && (
              <BellOff className="h-4 w-4 text-red-500" />
            )}
            <Switch
              id="push-notifications"
              checked={pushNotifications && permission === 'granted'}
              onCheckedChange={handlePushNotificationToggle}
              disabled={!isSupported || permission === 'denied'}
            />
          </div>
        </div>

        {pushNotifications && permission === 'granted' && (
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div>
              <p className="font-medium text-green-800">Test Notifications</p>
              <p className="text-sm text-green-600">
                Send a test notification to verify it works
              </p>
            </div>
            <Button 
              onClick={sendTestNotification}
              variant="outline"
              size="sm"
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              Send Test
            </Button>
          </div>
        )}

        {permission === 'denied' && (
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-yellow-800 font-medium">Notifications Blocked</p>
            <p className="text-sm text-yellow-600 mt-1">
              To enable push notifications, please allow them in your browser settings and refresh the page.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
