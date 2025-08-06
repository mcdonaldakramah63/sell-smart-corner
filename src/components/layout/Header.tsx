
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, Plus, MessageSquare, Bell, User, ShoppingCart, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserMenu } from './UserMenu';
import MobileMenu from './MobileMenu';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';
import { CurrencySwitcher } from '../shared/CurrencySwitcher';

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
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b">
      {/* Top Bar */}
      <div className="bg-orange-500 text-white py-1">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span>Free Shipping on orders over $50</span>
              <span>•</span>
              <Link to="/help" className="hover:underline">Customer Service</Link>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <CurrencySwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="h-10 w-10 rounded-lg bg-orange-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-2xl text-orange-500">Market</span>
              <span className="font-bold text-2xl text-gray-800">Hub</span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <Input
                placeholder="Search for products, brands and categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-12 h-12 rounded-lg border-2 border-orange-200 focus:border-orange-400"
              />
              <Button 
                type="submit" 
                size="icon" 
                className="absolute right-1 top-1 h-10 w-10 bg-orange-500 hover:bg-orange-600 rounded-md"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" className="flex flex-col items-center p-2 h-auto">
                  <Heart className="h-5 w-5" />
                  <span className="text-xs">Wishlist</span>
                </Button>

                <Button variant="ghost" size="sm" className="flex flex-col items-center p-2 h-auto">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="text-xs">Cart</span>
                </Button>

                <Button variant="ghost" size="sm" asChild className="flex flex-col items-center p-2 h-auto">
                  <Link to="/messages">
                    <MessageSquare className="h-5 w-5" />
                    <span className="text-xs">Messages</span>
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
              <div className="hidden sm:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600" asChild>
                  <Link to="/auth?tab=register">Join Free</Link>
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden lg:flex items-center space-x-6 py-2 border-t">
          <Button variant="ghost" className="text-sm font-medium" asChild>
            <Link to="/categories">All Categories</Link>
          </Button>
          <Button variant="ghost" className="text-sm font-medium" asChild>
            <Link to="/products?category=electronics">Electronics</Link>
          </Button>
          <Button variant="ghost" className="text-sm font-medium" asChild>
            <Link to="/products?category=fashion">Fashion</Link>
          </Button>
          <Button variant="ghost" className="text-sm font-medium" asChild>
            <Link to="/products?category=home">Home & Garden</Link>
          </Button>
          <Button variant="ghost" className="text-sm font-medium" asChild>
            <Link to="/products?category=sports">Sports</Link>
          </Button>
          <Button variant="ghost" className="text-sm font-medium" asChild>
            <Link to="/products?category=automotive">Automotive</Link>
          </Button>
          {isAuthenticated && (
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-auto border-orange-500 text-orange-500 hover:bg-orange-50"
              asChild
            >
              <Link to="/create-product">
                <Plus className="h-4 w-4 mr-2" />
                Sell Now
              </Link>
            </Button>
          )}
        </nav>
      </div>

      <MobileMenu 
        unreadNotifications={0}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </header>
  );
};

export default Header;
