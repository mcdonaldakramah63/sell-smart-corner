
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Bell, 
  LogOut, 
  Menu, 
  MessageSquare, 
  PlusCircle, 
  User,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MobileMenuProps {
  unreadNotifications: number;
  onLogin: () => void;
  onRegister: () => void;
}

export const MobileMenu = ({ unreadNotifications, onLogin, onRegister }: MobileMenuProps) => {
  const { isAuthenticated, logout } = useAuth();

  return (
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
                <Link to="/notifications-page" className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
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
              <Button onClick={onLogin}>Login</Button>
              <Button variant="outline" onClick={onRegister}>Register</Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
