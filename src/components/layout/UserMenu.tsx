
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  LogOut, 
  MessageSquare, 
  Settings, 
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface UserMenuProps {
  unreadNotifications: number;
  onLogin: () => void;
  onRegister: () => void;
}

export const UserMenu = ({ unreadNotifications, onLogin, onRegister }: UserMenuProps) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-2">
        {!isMobile && (
          <Button variant="ghost" onClick={onLogin}>Login</Button>
        )}
        <Button onClick={isMobile ? onLogin : onRegister}>
          {isMobile ? 'Login' : 'Register'}
        </Button>
      </div>
    );
  }

  return (
    <>
      {!isMobile && (
        <>
          <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/notifications-page')}>
            <Bell size={20} />
            {unreadNotifications > 0 && (
              <Badge className="h-5 w-5 text-xs rounded-full p-0 flex items-center justify-center absolute -top-1 -right-1 bg-marketplace-accent">
                {unreadNotifications}
              </Badge>
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate('/messages')}>
            <MessageSquare size={20} />
          </Button>
        </>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user ? getInitials(user.name) : 'U'}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings-page')}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
