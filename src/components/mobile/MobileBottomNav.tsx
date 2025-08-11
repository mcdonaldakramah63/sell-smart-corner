
import { Home, Search, Plus, MessageCircle, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useRealTimeNotifications } from '@/hooks/useRealTimeNotifications';
import { useIsMobile } from '@/hooks/use-mobile';

export const MobileBottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { unreadCount } = useRealTimeNotifications();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const navigationItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      exact: true
    },
    {
      name: 'Browse',
      href: '/products',
      icon: Search
    },
    {
      name: 'Sell',
      href: '/create-product',
      icon: Plus,
      requiresAuth: true
    },
    {
      name: 'Messages',
      href: '/messages',
      icon: MessageCircle,
      requiresAuth: true,
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    {
      name: 'Profile',
      href: user ? '/profile' : '/auth',
      icon: User
    }
  ];

  // Filter items based on authentication
  const visibleItems = navigationItems.filter(item => 
    !item.requiresAuth || user
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 supports-[backdrop-filter]:bg-background/60 backdrop-blur-md border-t border-border shadow-elegant safe-area-pb">
      <nav className="flex items-center justify-around px-1.5 py-1.5 max-w-screen-sm mx-auto">
        {visibleItems.map((item) => {
          const isActive = item.exact 
            ? location.pathname === item.href
            : location.pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl transition-colors relative tap-target',
                'min-w-0 flex-1 max-w-20',
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <div className="relative">
                <item.icon className={cn(
                  'h-5 w-5',
                  isActive ? 'text-primary' : 'text-current'
                )} />
                {item.badge && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center text-xs p-0 min-w-4"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </Badge>
                )}
              </div>
              <span className={cn(
                'text-xs font-medium truncate',
                isActive ? 'text-primary' : 'text-current'
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
