
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Menu, 
  MessageSquare, 
  PlusCircle, 
  Settings, 
  User,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { notifications } from '@/lib/mockData';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    // Count unread notifications
    if (user) {
      const unread = notifications.filter(n => n.userId === user.id && !n.read).length;
      setUnreadNotifications(unread);
    }
  }, [user]);

  const handleLogin = () => {
    navigate('/auth/login');
  };

  const handleRegister = () => {
    navigate('/auth/register');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const renderMobileMenu = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] sm:w-[300px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="font-bold text-xl text-marketplace-primary">Marketplace</Link>
            <X className="h-4 w-4" />
          </div>
          
          <nav className="flex flex-col space-y-4 mt-8">
            <Link to="/" className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
              <span>Home</span>
            </Link>
            <Link to="/products" className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
              <span>All Products</span>
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/sell" className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                  <PlusCircle className="h-4 w-4" />
                  <span>Sell Something</span>
                </Link>
                <Link to="/messages" className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                  <MessageSquare className="h-4 w-4" />
                  <span>Messages</span>
                </Link>
                <Link to="/notifications" className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                  {unreadNotifications > 0 && (
                    <Badge className="h-5 w-5 text-xs rounded-full p-0 flex items-center justify-center ml-auto bg-marketplace-accent">
                      {unreadNotifications}
                    </Badge>
                  )}
                </Link>
                <Link to="/profile" className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
                <button 
                  onClick={logout}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted text-left w-full"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </nav>
          
          {!isAuthenticated && (
            <div className="mt-auto pb-4 pt-6 flex flex-col space-y-2">
              <Button onClick={handleLogin}>Login</Button>
              <Button variant="outline" onClick={handleRegister}>Register</Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="border-b sticky top-0 bg-background z-10">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Mobile Menu */}
        {renderMobileMenu()}
        
        {/* Logo */}
        <Link to="/" className="font-bold text-xl text-marketplace-primary">
          Marketplace
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-marketplace-primary transition-colors">
            Home
          </Link>
          <Link to="/products" className="text-sm font-medium hover:text-marketplace-primary transition-colors">
            Products
          </Link>
          {isAuthenticated && (
            <Link to="/sell" className="text-sm font-medium hover:text-marketplace-primary transition-colors">
              Sell Something
            </Link>
          )}
        </nav>
        
        {/* Auth Section */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {!isMobile && (
                <>
                  <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/notifications')}>
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
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
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
          ) : (
            <div className="flex items-center space-x-2">
              {!isMobile && (
                <Button variant="ghost" onClick={handleLogin}>Login</Button>
              )}
              <Button onClick={isMobile ? handleLogin : handleRegister}>
                {isMobile ? 'Login' : 'Register'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
