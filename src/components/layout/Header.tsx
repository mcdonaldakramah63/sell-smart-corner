
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Menu, Plus, Heart, MapPin, Home, List, SlidersHorizontal, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserMenu } from './UserMenu';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';

const Header: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/auth');
  };

  const handleRegister = () => {
    navigate('/auth?tab=register');
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-elegant border-b border-border sticky top-0 z-50 safe-area-pt">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm text-marketplace-secondary">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>All Locations</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Link to="/help" className="hover:text-primary transition-colors">Help</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex h-18 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-soft">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div className="text-2xl font-bold text-marketplace-secondary">MarketHub</div>
          </Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <UserMenu 
                unreadNotifications={0}
                onLogin={handleLogin}
                onRegister={handleRegister}
              />
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">Login</Link>
                </Button>
                <Button size="sm" variant="marketplace" asChild>
                  <Link to="/auth?tab=register">Register</Link>
                </Button>
              </div>
            )}

          </div>
        </div>
      </div>


    </header>
  );
};

export default Header;
