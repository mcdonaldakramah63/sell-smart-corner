
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Search, 
  Plus, 
  MessageSquare, 
  User, 
  Settings,
  Shield,
  Building2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DesktopNavigation = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/products', label: 'Browse', icon: Search },
    { href: '/create-product', label: 'Sell', icon: Plus, requiresAuth: true },
    { href: '/messages', label: 'Messages', icon: MessageSquare, requiresAuth: true },
  ];

  const userNavItems = [
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/business', label: 'Business', icon: Building2 },
    { href: '/admin', label: 'Admin', icon: Shield, adminOnly: true },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="hidden md:flex items-center space-x-6">
      {/* Main Navigation */}
      {navItems.map((item) => {
        if (item.requiresAuth && !user) return null;
        
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}

      {/* User Navigation */}
      {user && (
        <div className="flex items-center space-x-4 pl-4 border-l border-border">
          {userNavItems.map((item) => {
            if (item.adminOnly && !user) return null; // Add role check here later
            
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default DesktopNavigation;
