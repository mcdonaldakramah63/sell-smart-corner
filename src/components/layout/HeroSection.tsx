
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-marketplace-primary to-blue-700 text-white py-8 sm:py-12 md:py-16 lg:py-24">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center lg:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in leading-tight">
            Buy and Sell with Confidence
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 text-white/90 animate-slide-in max-w-2xl mx-auto lg:mx-0">
            Join our trusted marketplace community and discover amazing deals or sell your items easily and securely.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-slide-in justify-center lg:justify-start" style={{ animationDelay: "0.2s" }}>
            <Button asChild size="lg" className="bg-white text-marketplace-primary hover:bg-white/90 text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4">
              <Link to="/products">Browse Products</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-white/20 text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4">
              <Link to="/create-product">Start Selling</Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Abstract shapes for background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 right-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-36 h-36 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 sm:w-40 sm:h-40 lg:w-60 lg:h-60 bg-white/5 rounded-full blur-xl"></div>
      </div>
    </div>
  );
};

export default HeroSection;
