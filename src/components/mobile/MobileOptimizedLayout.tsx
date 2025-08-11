
import { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileBottomNav } from './MobileBottomNav';
import { PWAInstallPrompt } from './PWAInstallPrompt';
import { OfflineIndicator } from './OfflineIndicator';
import { PushNotificationManager } from '../notifications/PushNotificationManager';

interface MobileOptimizedLayoutProps {
  children: ReactNode;
}

export const MobileOptimizedLayout = ({ children }: MobileOptimizedLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <>
      <div className={isMobile ? 'pb-24 safe-area-pb' : ''}>
        {children}
      </div>
      
      {/* Mobile-specific components */}
      <MobileBottomNav />
      <PWAInstallPrompt />
      <OfflineIndicator />
      <PushNotificationManager />
    </>
  );
};
