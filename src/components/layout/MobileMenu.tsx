
import { useState } from 'react';
import {
  Home,
  Search,
  LayoutDashboard,
  MessageCircle,
  Plus,
  BarChart3,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  unreadNotifications?: number;
  onLogin?: () => void;
  onRegister?: () => void;
}

export default function MobileMenu({ unreadNotifications, onLogin, onRegister }: MobileMenuProps) {
  const { user } = useAuth();

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

  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="px-2">
          <LayoutDashboard className="h-4 w-4" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SheetHeader className="px-8 pb-6 pt-10">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Navigate the application
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-1 text-sm font-medium">
          {navigationItems.map((item) => (
            <Button
              key={item.name}
              asChild
              variant="ghost"
              className="w-full justify-start px-8"
            >
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-2 py-2",
                  open && "opacity-100 transition-opacity delay-[600ms]"
                )}
                onClick={() => setOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
