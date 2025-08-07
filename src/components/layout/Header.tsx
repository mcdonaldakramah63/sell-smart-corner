
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, Plus, MessageSquare, Bell, User, Heart, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserMenu } from './UserMenu';
import MobileMenu from './MobileMenu';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  const handleRegister = () => {
    navigate('/auth?tab=register');
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-elegant border-b border-border sticky top-0 z-50">
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

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Input
                placeholder="I am looking for..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-4 pr-14 border border-border rounded-xl bg-white shadow-soft focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <Button 
                type="submit" 
                variant="marketplace"
                className="absolute right-2 top-2 h-8 px-4 rounded-lg"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Heart className="h-5 w-5" />
                  <span className="hidden sm:inline ml-1">Saved</span>
                </Button>

                <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-primary">
                  <Link to="/messages">
                    <MessageSquare className="h-5 w-5" />
                    <span className="hidden sm:inline ml-1">Messages</span>
                  </Link>
                </Button>

                <NotificationCenter />

                <UserMenu 
                  unreadNotifications={0}
                  onLogin={handleLogin}
                  onRegister={handleRegister}
                />
              </>
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

            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Post Ad Button */}
      {isAuthenticated && (
        <div className="gradient-primary py-3">
          <div className="container mx-auto px-4">
            <Button 
              className="w-full bg-white text-primary hover:bg-white/90 font-semibold shadow-soft hover:shadow-elegant transform hover:scale-[1.02] transition-all duration-300"
              asChild
            >
              <Link to="/create-product">
                <Plus className="h-4 w-4 mr-2" />
                Post a FREE Ad
              </Link>
            </Button>
          </div>
        </div>
      )}

      <MobileMenu 
        unreadNotifications={0}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </header>
  );
};

export default Header;
