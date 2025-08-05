
import { Wifi, WifiOff, Download, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePWA } from '@/hooks/usePWA';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';

export const OfflineIndicator = () => {
  const { isOnline, updateAvailable, updateApp } = usePWA();
  const { storageSize } = useOfflineStorage();

  const formatStorageSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (isOnline && !updateAvailable) {
    return null;
  }

  return (
    <div className="fixed top-20 left-4 right-4 z-40 md:left-auto md:right-4 md:w-80">
      {!isOnline && (
        <Card className="mb-2 bg-yellow-50 border-yellow-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <WifiOff className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                    Offline Mode
                  </Badge>
                  {storageSize > 0 && (
                    <span className="text-xs text-yellow-600">
                      {formatStorageSize(storageSize)} cached
                    </span>
                  )}
                </div>
                <p className="text-xs text-yellow-600 mt-1">
                  Limited functionality. Changes will sync when reconnected.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {updateAvailable && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <Badge variant="outline" className="text-blue-700 border-blue-300">
                  Update Available
                </Badge>
                <p className="text-xs text-blue-600 mt-1">
                  A new version is ready to install
                </p>
              </div>
              <Button 
                size="sm" 
                onClick={updateApp}
                className="h-8"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Update
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
