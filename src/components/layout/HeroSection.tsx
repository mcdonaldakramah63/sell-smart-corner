
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Truck, Shield, Star, Zap } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-orange-400 via-red-500 to-pink-500">
      {/* Main Hero Banner */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="text-white space-y-6">
            <div className="space-y-2">
              <Badge className="bg-yellow-400 text-black px-3 py-1 text-sm font-semibold">
                <Zap className="h-4 w-4 mr-1" />
                Flash Sale - Up to 70% Off
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Shop Smart, Save More
              </h1>
              <p className="text-lg text-white/90 max-w-lg">
                Discover millions of products at unbeatable prices. From electronics to fashion, find everything you need in one place.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                asChild
              >
                <Link to="/products">Shop Now</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-orange-500 px-8 py-4 text-lg"
                asChild
              >
                <Link to="/create-product">Start Selling</Link>
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5" />
                <span className="text-sm">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span className="text-sm">Buyer Protection</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span className="text-sm">Top Rated</span>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image/Graphic */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="w-full h-96 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-8xl font-bold opacity-20">SALE</div>
                  <div className="text-2xl font-semibold">Up to 70% OFF</div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold text-sm animate-bounce">
                Hot Deals!
              </div>
              <div className="absolute -bottom-4 -left-4 bg-green-400 text-white px-4 py-2 rounded-full font-bold text-sm">
                New Arrivals
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
