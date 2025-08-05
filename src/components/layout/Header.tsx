
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, Plus, MessageSquare, Bell, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserMenu } from './UserMenu';
import { MobileMenu } from './MobileMenu';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';
import { CurrencySwitcher } from '../shared/CurrencySwitcher';

export const Header: React.FC = () => {
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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">M</span>
            </div>
            <span className="hidden sm:inline-block font-bold text-xl">
              MarketHub
            </span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </form>

          {/* Navigation Links - Hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Button variant="ghost" asChild>
              <Link to="/products">Browse</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/categories">Categories</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/blog">Blog</Link>
            </Button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Language and Currency Switchers */}
            <div className="hidden sm:flex items-center space-x-1">
              <LanguageSwitcher />
              <CurrencySwitcher />
            </div>

            {isAuthenticated ? (
              <>
                {/* Create Product Button */}
                <Button size="sm" asChild className="hidden sm:flex">
                  <Link to="/products/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Sell
                  </Link>
                </Button>

                {/* Messages */}
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/messages">
                    <MessageSquare className="h-4 w-4" />
                  </Link>
                </Button>

                {/* Notifications */}
                <NotificationCenter />

                {/* User Menu */}
                <UserMenu />
              </>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/auth?tab=register">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
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

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 w-full"
              />
            </div>
          </form>
        </div>
      </div>

      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </header>
  );
};
