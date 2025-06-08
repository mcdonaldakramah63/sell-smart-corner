
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-marketplace-primary to-blue-700 text-white py-16 md:py-24">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Buy and Sell with Confidence
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90 animate-slide-in">
            Join our trusted marketplace community and discover amazing deals or sell your items easily and securely.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-in" style={{ animationDelay: "0.2s" }}>
            <Button asChild size="lg" className="bg-white text-marketplace-primary hover:bg-white/90">
              <Link to="/products">Browse Products</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-white/20">
              <Link to="/sell">Start Selling</Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Abstract shapes for background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-white/5 rounded-full blur-xl"></div>
      </div>
    </div>
  );
};

export default HeroSection;
