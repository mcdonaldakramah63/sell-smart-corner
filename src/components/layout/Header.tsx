import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { UserMenu } from './UserMenu';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import DesktopNavigation from './DesktopNavigation';
import { Sparkles } from 'lucide-react';

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
    <header className="bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50 safe-area-pt animate-fade-in-down">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex h-16 lg:h-18 items-center justify-between gap-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 hover:opacity-90 transition-all duration-300 shrink-0 group"
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 gradient-primary rounded-xl flex items-center justify-center shadow-elegant group-hover:shadow-glow transition-all duration-500 group-hover:scale-105 group-hover:rotate-3">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 rounded-xl bg-primary-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="hidden xs:flex flex-col">
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent transition-all duration-300 group-hover:tracking-wide">
                MarketHub
              </span>
              <span className="text-[10px] text-muted-foreground -mt-0.5 hidden sm:block transition-opacity duration-300 group-hover:opacity-80">
                Buy & Sell Easily
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 justify-center max-w-2xl">
            <DesktopNavigation />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language switcher - hidden on mobile */}
            <div className="hidden sm:block animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <LanguageSwitcher />
            </div>

            {isAuthenticated ? (
              <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <UserMenu 
                  unreadNotifications={0}
                  onLogin={handleLogin}
                  onRegister={handleRegister}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 px-3 py-2 h-9 transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button 
                  size="sm" 
                  className="gradient-primary text-primary-foreground font-medium px-4 py-2 h-9 shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105 hover-shine"
                  asChild
                >
                  <Link to="/auth?tab=register">Get Started</Link>
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
