
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { UserMenu } from './UserMenu';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

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
            {/* Language moved to main header */}
            <LanguageSwitcher />

            {isAuthenticated ? (
              <UserMenu 
                unreadNotifications={0}
                onLogin={handleLogin}
                onRegister={handleRegister}
              />
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">{t('common.login')}</Link>
                </Button>
                <Button size="sm" variant="marketplace" asChild>
                  <Link to="/auth?tab=register">{t('common.register')}</Link>
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
