import { Home, Search, LayoutDashboard, MessageCircle, Plus, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function DesktopNavigation() {
  const { user, signOut } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user?.avatar) {
      setAvatarUrl(user.avatar);
    }
  }, [user?.avatar]);

  const navigationItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Browse', href: '/products', icon: Search },
    ...(user ? [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Messages', href: '/messages', icon: MessageCircle },
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
      { name: 'Sell', href: '/create-product', icon: Plus },
    ] : []),
  ];

  return (
    <div className="hidden lg:flex lg:w-full lg:items-center lg:justify-between">
      <nav>
        <ul className="flex items-center gap-6">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {user ? (
        <TooltipProvider>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        {avatarUrl ? (
                          <AvatarImage src={avatarUrl} alt={user.name || "Avatar"} />
                        ) : (
                          <AvatarFallback>{user.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                        )}
                      </Avatar>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white text-black">
                    {user.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>
      ) : (
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Sign Up</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
