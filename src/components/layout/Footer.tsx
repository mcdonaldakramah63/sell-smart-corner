
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-marketplace-primary text-white py-6 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/lovable-uploads/b8d5f9c4-01ee-4e7a-93b8-b1af2b1a5462.png" 
                alt="Used Market Logo" 
                className="h-5 w-5 sm:h-6 sm:w-6"
              />
              <h3 className="text-base sm:text-lg font-bold">Used Market</h3>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Buy and sell items easily with our secure marketplace platform.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors block py-1">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors block py-1">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/create-product" className="text-gray-300 hover:text-white transition-colors block py-1">
                  Sell Something
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/help" className="text-gray-300 hover:text-white transition-colors block py-1">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/safety" className="text-gray-300 hover:text-white transition-colors block py-1">
                  Safety Tips
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors block py-1">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h4>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors block py-1">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors block py-1">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-300 hover:text-white transition-colors block py-1">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-4 sm:pt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-400">
            © {new Date().getFullYear()} Used Market. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
