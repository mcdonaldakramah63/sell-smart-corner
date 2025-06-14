
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { MobileMenu } from './MobileMenu';
import { DesktopNavigation } from './DesktopNavigation';
import { UserMenu } from './UserMenu';

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      if (!user?.id) {
        setUnreadNotifications(0);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('id')
          .eq('user_id', user.id)
          .eq('read', false);

        if (error) {
          console.error('Error fetching notifications:', error);
          return;
        }

        setUnreadNotifications(data?.length || 0);
      } catch (error) {
        console.error('Error counting unread notifications:', error);
      }
    };

    fetchUnreadNotifications();

    // Set up real-time subscription for notifications
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          // Refetch count when notifications change
          fetchUnreadNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const handleLogin = () => {
    navigate('/auth/login');
  };

  const handleRegister = () => {
    navigate('/auth/register');
  };

  return (
    <header className="border-b sticky top-0 bg-background z-10">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Mobile Menu */}
        <MobileMenu 
          unreadNotifications={unreadNotifications}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/4e530486-e6cb-4ca6-8a3f-9658a5975dee.png" 
            alt="Used Market Logo" 
            className="h-8 w-8"
          />
          <span className="font-bold text-xl text-marketplace-primary hidden sm:inline">
            Used Market
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <DesktopNavigation />
        
        {/* Auth Section */}
        <div className="flex items-center space-x-4">
          <UserMenu 
            unreadNotifications={unreadNotifications}
            onLogin={handleLogin}
            onRegister={handleRegister}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
