
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search, Shield, Users, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="gradient-hero text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-accent/20"></div>
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-8 drop-shadow-lg">
            Buy, Sell, Connect
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-white/90 font-medium max-w-3xl mx-auto">
            Your trusted marketplace for buying and selling products with confidence and ease
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-16">
            <div className="relative marketplace-surface rounded-2xl p-2 backdrop-blur-lg">
              <Input
                placeholder="What are you looking for today?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-16 pl-6 pr-20 text-lg border-0 rounded-xl bg-white/95 text-foreground shadow-soft"
              />
              <Button 
                type="submit" 
                size="lg"
                variant="marketplace"
                className="absolute right-2 top-2 h-12 px-8 rounded-xl"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </form>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 px-10 py-4 text-lg font-semibold shadow-elegant hover:shadow-glow transform hover:scale-105"
              asChild
            >
              <Link to="/products">Start Shopping</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white/40 bg-white/10 text-white hover:bg-white hover:text-primary px-10 py-4 text-lg backdrop-blur-sm"
              asChild
            >
              <Link to="/create-product">Sell Something</Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center marketplace-surface rounded-2xl p-8 backdrop-blur-sm">
              <Shield className="h-16 w-16 mb-6 text-primary-glow" />
              <h3 className="text-xl font-semibold mb-3 text-white">Safe & Secure</h3>
              <p className="text-white/80">Verified sellers and secure transactions</p>
            </div>
            <div className="flex flex-col items-center marketplace-surface rounded-2xl p-8 backdrop-blur-sm">
              <Users className="h-16 w-16 mb-6 text-primary-glow" />
              <h3 className="text-xl font-semibold mb-3 text-white">Millions of Users</h3>
              <p className="text-white/80">Join our trusted marketplace community</p>
            </div>
            <div className="flex flex-col items-center marketplace-surface rounded-2xl p-8 backdrop-blur-sm">
              <CheckCircle className="h-16 w-16 mb-6 text-primary-glow" />
              <h3 className="text-xl font-semibold mb-3 text-white">Easy to Use</h3>
              <p className="text-white/80">Post ads in minutes, sell faster</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="relative">
        <svg className="w-full h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
