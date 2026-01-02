import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search, Shield, Users, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
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
    <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary-glow">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-foreground/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-glow/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary-foreground/5 to-transparent rounded-full" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-xl border border-primary-foreground/20 text-primary-foreground text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>Trusted by thousands of users</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-primary-foreground leading-tight animate-fade-in-up text-balance">
            Buy, Sell & Connect
            <span className="block mt-2 text-primary-foreground/90">with Confidence</span>
          </h1>
          
          <p className="text-lg md:text-xl mb-10 text-primary-foreground/80 font-medium max-w-2xl mx-auto animate-fade-in-up text-balance" style={{ animationDelay: '0.1s' }}>
            Your premier marketplace for finding great deals and selling with ease. Join our growing community today.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative bg-primary-foreground/10 backdrop-blur-xl rounded-2xl p-1.5 border border-primary-foreground/20 shadow-2xl">
              <div className="flex items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="What are you looking for?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 text-base md:text-lg border-0 rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg"
                  className="h-14 px-6 md:px-8 ml-1.5 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-[1.02]"
                >
                  <span className="hidden sm:inline mr-2">Search</span>
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </form>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Button 
              size="lg" 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8 py-6 text-lg font-semibold shadow-2xl hover:shadow-glow transition-all duration-300 hover:scale-[1.02] rounded-xl group"
              asChild
            >
              <Link to="/products">
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-primary-foreground/30 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-6 text-lg font-semibold backdrop-blur-sm rounded-xl transition-all duration-300"
              asChild
            >
              <Link to="/create-product">Sell Something</Link>
            </Button>
          </div>

          {/* Trust Indicators - Desktop */}
          <div className="hidden md:grid grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {[
              { icon: Shield, title: 'Safe & Secure', desc: 'Verified sellers and secure transactions' },
              { icon: Users, title: 'Millions of Users', desc: 'Join our trusted marketplace community' },
              { icon: CheckCircle, title: 'Easy to Use', desc: 'Post ads in minutes, sell faster' },
            ].map((item, index) => (
              <div 
                key={index}
                className="group flex flex-col items-center p-6 rounded-2xl bg-primary-foreground/5 backdrop-blur-xl border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-primary-foreground/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-primary-foreground">{item.title}</h3>
                <p className="text-sm text-primary-foreground/70 text-center">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Trust Indicators - Mobile (simplified) */}
          <div className="flex md:hidden justify-center gap-6 text-primary-foreground/80 text-sm animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Trusted</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Easy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-12 md:h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-background"></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
