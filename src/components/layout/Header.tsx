
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { UserMenu } from './UserMenu';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import DesktopNavigation from './DesktopNavigation';
const Header: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = () => {
    navigate('/auth');
  };

  const handleRegister = () => {
    navigate('/auth?tab=register');
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-elegant border-b border-border sticky top-0 z-50 safe-area-pt">
      {/* Main Header (top bar removed) */}
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300 shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 gradient-primary rounded-xl flex items-center justify-center shadow-soft">
              <span className="text-white font-bold text-lg sm:text-xl">M</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold text-marketplace-secondary hidden xs:block">MarketHub</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 justify-center">
            <DesktopNavigation />
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Language switcher - hidden on mobile */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {isAuthenticated ? (
              <UserMenu 
                unreadNotifications={0}
                onLogin={handleLogin}
                onRegister={handleRegister}
              />
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-3">
                <Button variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-3" asChild>
                  <Link to="/auth">Login</Link>
                </Button>
                <Button size="sm" variant="marketplace" className="text-xs sm:text-sm px-2 sm:px-3" asChild>
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
