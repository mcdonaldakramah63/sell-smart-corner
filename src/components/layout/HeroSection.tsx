import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search, Shield, Users, CheckCircle, ArrowRight, Sparkles, Zap } from 'lucide-react';
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
    <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary-glow min-h-[85vh] md:min-h-[85vh] flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs - smaller on mobile */}
        <div className="absolute top-10 left-5 md:top-20 md:left-10 w-40 md:w-72 h-40 md:h-72 bg-primary-foreground/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-5 md:bottom-20 md:right-10 w-52 md:w-96 h-52 md:h-96 bg-primary-glow/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/3 right-1/4 w-32 md:w-64 h-32 md:h-64 bg-primary-foreground/5 rounded-full blur-2xl animate-blob" />
        <div className="absolute bottom-1/3 left-1/4 w-24 md:w-48 h-24 md:h-48 bg-primary-glow/20 rounded-full blur-2xl animate-blob" style={{ animationDelay: '-4s' }} />
        
        {/* Central glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-gradient-radial from-primary-foreground/10 to-transparent rounded-full animate-pulse-soft" />
        
        {/* Animated lines */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-foreground/50 to-transparent animate-shimmer" />
          <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-foreground/30 to-transparent animate-shimmer" style={{ animationDelay: '-1s' }} />
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-foreground/50 to-transparent animate-shimmer" style={{ animationDelay: '-2s' }} />
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] md:bg-[size:60px_60px]" />

      <div className="container mx-auto px-4 py-10 md:py-24 lg:py-32 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge - more compact on mobile */}
          <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-1.5 md:py-2.5 rounded-full bg-primary-foreground/15 backdrop-blur-xl border border-primary-foreground/25 text-primary-foreground text-xs md:text-sm font-medium mb-5 md:mb-8 animate-fade-in-down hover:bg-primary-foreground/20 transition-all duration-300 cursor-default group">
            <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 animate-pulse-soft" />
            <span>Trusted by thousands</span>
            <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Main Heading - optimized for mobile */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 text-primary-foreground leading-tight animate-fade-in-up text-balance">
            <span className="inline-block hover:scale-105 transition-transform duration-300">Buy,</span>{' '}
            <span className="inline-block hover:scale-105 transition-transform duration-300">Sell</span>{' '}
            <span className="inline-block">&</span>{' '}
            <span className="inline-block hover:scale-105 transition-transform duration-300">Connect</span>
            <span className="block mt-1 md:mt-2 text-primary-foreground/90 relative">
              with Confidence
              <span className="absolute -bottom-1 md:-bottom-2 left-1/2 -translate-x-1/2 w-20 md:w-32 h-0.5 md:h-1 bg-primary-foreground/30 rounded-full" />
            </span>
          </h1>
          
          <p className="text-sm md:text-xl mb-6 md:mb-10 text-primary-foreground/85 font-medium max-w-md md:max-w-2xl mx-auto animate-fade-in-up text-balance stagger-2 px-2" style={{ animationDelay: '0.1s' }}>
            Your premier marketplace for finding great deals and selling with ease.
          </p>

          {/* Search Bar - compact on mobile */}
          <form onSubmit={handleSearch} className="max-w-lg md:max-w-2xl mx-auto mb-6 md:mb-10 animate-scale-up px-1" style={{ animationDelay: '0.2s' }}>
            <div className="relative bg-background/95 backdrop-blur-xl rounded-xl md:rounded-2xl p-1 md:p-1.5 border border-primary-foreground/20 shadow-2xl hover:border-primary-foreground/30 transition-all duration-300 group">
              <div className="flex items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
                  <Input
                    placeholder="What are you looking for?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 md:h-14 pl-10 md:pl-12 pr-2 md:pr-4 text-sm md:text-lg border-0 rounded-lg md:rounded-xl bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-300"
                  />
                </div>
                <Button 
                  type="submit" 
                  size="default"
                  className="h-9 md:h-14 px-3 md:px-8 ml-1 md:ml-1.5 rounded-lg md:rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg hover:shadow-glow transition-all duration-300 hover:scale-[1.02] group/btn"
                >
                  <Search className="h-4 w-4 md:h-5 md:w-5 group-hover/btn:rotate-12 transition-transform duration-300" />
                </Button>
              </div>
            </div>
          </form>

          {/* Action Buttons - modern compact design for mobile */}
          <div className="flex flex-col gap-3 md:flex-row md:gap-4 justify-center mb-8 md:mb-16 animate-slide-up-fade px-2" style={{ animationDelay: '0.3s' }}>
            <Button 
              size="default" 
              className="bg-background text-primary hover:bg-background/90 h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-semibold shadow-2xl hover:shadow-glow transition-all duration-300 hover:scale-[1.02] rounded-xl group hover-shine"
              asChild
            >
              <Link to="/products">
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
            <Button 
              size="default" 
              variant="outline" 
              className="border-2 border-primary-foreground bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground hover:text-primary h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-semibold backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-[1.02]"
              asChild
            >
              <Link to="/create-product">Sell Something</Link>
            </Button>
          </div>

          {/* Trust Indicators - Desktop */}
          <div className="hidden md:grid grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Shield, title: 'Safe & Secure', desc: 'Verified sellers and secure transactions' },
              { icon: Users, title: 'Millions of Users', desc: 'Join our trusted marketplace community' },
              { icon: CheckCircle, title: 'Easy to Use', desc: 'Post ads in minutes, sell faster' },
            ].map((item, index) => (
              <div 
                key={index}
                className="group flex flex-col items-center p-6 rounded-2xl bg-primary-foreground/5 backdrop-blur-xl border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl animate-fade-in-up"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary-foreground/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 group-hover:bg-primary-foreground/20">
                  <item.icon className="h-7 w-7 text-primary-foreground group-hover:animate-bounce-subtle" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-primary-foreground">{item.title}</h3>
                <p className="text-sm text-primary-foreground/70 text-center">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Trust Indicators - Mobile (enhanced cards) */}
          <div className="flex md:hidden justify-center gap-3 animate-fade-in px-2" style={{ animationDelay: '0.4s' }}>
            {[
              { icon: Shield, text: 'Secure' },
              { icon: Users, text: 'Trusted' },
              { icon: CheckCircle, text: 'Easy' },
            ].map((item, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-foreground/15 flex items-center justify-center">
                  <item.icon className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-xs font-medium text-primary-foreground">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-16 md:h-24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-background"></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
