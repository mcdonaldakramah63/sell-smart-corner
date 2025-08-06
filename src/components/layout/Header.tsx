
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
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      {/* Top Bar - Minimal like Jiji */}
      <div className="bg-blue-50 py-1">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm text-blue-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>All Nigeria</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Link to="/help" className="hover:underline">Help</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Clean Jiji Style */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Simple like Jiji */}
          <Link to="/" className="flex items-center">
            <div className="text-2xl font-bold text-blue-600">MarketHub</div>
          </Link>

          {/* Search Bar - Prominent like Jiji */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Input
                placeholder="I am looking for..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-4 pr-12 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:ring-0"
              />
              <Button 
                type="submit" 
                className="absolute right-2 top-2 h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Right Actions - Clean Layout */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                  <Heart className="h-5 w-5" />
                  <span className="hidden sm:inline ml-1">Saved</span>
                </Button>

                <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-blue-600">
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
                <Button variant="ghost" size="sm" asChild className="text-gray-600">
                  <Link to="/auth">Login</Link>
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
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

      {/* Post Ad Button - Prominent like Jiji */}
      {isAuthenticated && (
        <div className="bg-blue-600 py-2">
          <div className="container mx-auto px-4">
            <Button 
              className="w-full bg-white text-blue-600 hover:bg-gray-50 font-semibold"
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
