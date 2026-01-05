import { Bell, BellOff, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useOneSignal } from '@/hooks/useOneSignal';

interface OneSignalSettingsProps {
  userType?: 'customer' | 'rider';
}

export const OneSignalSettings = ({ userType = 'customer' }: OneSignalSettingsProps) => {
  const { isInitialized, isSubscribed, subscribe, unsubscribe, sendTestNotification } = useOneSignal(userType);

  const handleToggle = async (checked: boolean) => {
    if (checked) {
      await subscribe();
    } else {
      await unsubscribe();
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isSubscribed ? (
            <Bell className="h-5 w-5 text-primary" />
          ) : (
            <BellOff className="h-5 w-5 text-muted-foreground" />
          )}
          Push Notifications
        </CardTitle>
        <CardDescription>
          Receive real-time notifications about messages, orders, and updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="push-notifications" className="text-base">
              Enable Push Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              {isSubscribed 
                ? 'You will receive notifications even when the app is closed' 
                : 'Turn on to receive instant updates'}
            </p>
          </div>
          <Switch
            id="push-notifications"
            checked={isSubscribed}
            onCheckedChange={handleToggle}
            disabled={!isInitialized}
          />
        </div>

        {isSubscribed && (
          <div className="pt-4 border-t border-border/50">
            <Button
              variant="outline"
              size="sm"
              onClick={sendTestNotification}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Send Test Notification
            </Button>
          </div>
        )}

        {!isInitialized && (
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading notification service...
          </p>
        )}
      </CardContent>
    </Card>
  );
};
