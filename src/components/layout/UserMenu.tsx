
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
      <div className="flex items-center space-x-1 sm:space-x-2">
        {!isMobile && (
          <Button variant="ghost" onClick={onLogin} size="sm" className="hidden sm:inline-flex">
            Login
          </Button>
        )}
        <Button onClick={isMobile ? onLogin : onRegister} size="sm" className="text-xs sm:text-sm px-2 sm:px-4">
          {isMobile ? 'Login' : 'Register'}
        </Button>
      </div>
    );
  }

  return (
    <>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer h-8 w-8 sm:h-10 sm:w-10">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="text-xs sm:text-sm">{user ? getInitials(user.name) : 'U'}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 sm:w-56">
          <DropdownMenuLabel className="text-sm">My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/profile')} className="text-sm">
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings')} className="text-sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-sm">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
