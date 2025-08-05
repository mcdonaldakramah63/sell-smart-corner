
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, X, Smartphone, Wifi, Bell } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export const PWAInstallPrompt = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { isInstallable, isInstalled, installApp } = usePWA();

  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (!dismissed && isInstallable && !isInstalled) {
      // Show after 30 seconds of browsing
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!isVisible || isDismissed || !isInstallable || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Card className="shadow-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Smartphone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Install Used Market</CardTitle>
                <Badge variant="secondary" className="mt-1">
                  PWA Available
                </Badge>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleDismiss}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardDescription>
            Get the full app experience with offline access, push notifications, and faster loading.
          </CardDescription>
          
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="flex flex-col items-center gap-1 text-center">
              <Wifi className="h-4 w-4 text-green-600" />
              <span className="text-muted-foreground">Works Offline</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <Bell className="h-4 w-4 text-blue-600" />
              <span className="text-muted-foreground">Push Alerts</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <Download className="h-4 w-4 text-purple-600" />
              <span className="text-muted-foreground">Native Feel</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
              onClick={handleInstall} 
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Install App
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDismiss}
              className="px-4"
            >
              Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
