
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Shield, Smartphone, Globe, Clock, AlertTriangle } from 'lucide-react';
import { useSecurityFeatures } from '@/hooks/useSecurityFeatures';
import { formatDistanceToNow } from 'date-fns';

export const SecurityDashboard = () => {
  const {
    securityEvents,
    twoFactorEnabled,
    loading,
    trustCurrentDevice,
    revokeDeviceTrust,
    toggle2FA
  } = useSecurityFeatures();

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'login':
        return <Globe className="h-4 w-4 text-green-500" />;
      case 'logout':
        return <Globe className="h-4 w-4 text-gray-500" />;
      case 'password_change':
        return <Shield className="h-4 w-4 text-blue-500" />;
      case 'suspicious_activity':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Two-Factor Authentication</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={toggle2FA}
              />
              <span className="text-sm">
                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Add an extra layer of security to your account
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trusted Devices</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {securityEvents.filter(e => e.details?.trusted).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Devices you've marked as trusted
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={trustCurrentDevice}
            >
              Trust This Device
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {securityEvents.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Security events in the last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
          <CardDescription>
            Monitor your account activity and security events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityEvents.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No security events to display
              </p>
            ) : (
              securityEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getEventIcon(event.event_type)}
                    <div>
                      <p className="font-medium capitalize">
                        {event.event_type.replace('_', ' ')}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{event.ip_address || 'Unknown IP'}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}</span>
                      </div>
                      {event.user_agent && (
                        <p className="text-xs text-muted-foreground mt-1 truncate max-w-md">
                          {event.user_agent}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {event.details?.trusted ? (
                      <Badge variant="secondary">Trusted</Badge>
                    ) : (
                      <Badge variant="outline">Unverified</Badge>
                    )}
                    {event.details?.trusted && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => revokeDeviceTrust(event.id)}
                      >
                        Revoke Trust
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
