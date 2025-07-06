import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export const InstallPrompt = () => {
  const [dismissed, setDismissed] = useState(false);
  const { isInstallable, installApp } = usePWA();

  if (!isInstallable || dismissed) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 animate-slide-in">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Download className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">Install Used Market</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Get the app for a better experience
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={installApp} className="text-xs">
                Install
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setDismissed(true)}
                className="text-xs"
              >
                Not now
              </Button>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => setDismissed(true)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};