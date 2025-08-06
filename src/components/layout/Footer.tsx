
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-600 border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="mb-4">
                <span className="font-bold text-2xl text-blue-600">MarketHub</span>
              </div>
              <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                Nigeria's leading marketplace for buying and selling. Connect with millions of users across the country.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span>0800-123-4567</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span>help@markethub.ng</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span>Lagos, Nigeria</span>
                </div>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-gray-800">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="hover:text-blue-600 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="hover:text-blue-600 transition-colors">
                    Browse Ads
                  </Link>
                </li>
                <li>
                  <Link to="/create-product" className="hover:text-blue-600 transition-colors">
                    Post Ad
                  </Link>
                </li>
                <li>
                  <Link to="/safety" className="hover:text-blue-600 transition-colors">
                    Safety Tips
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Categories */}
            <div>
              <h4 className="font-semibold mb-4 text-gray-800">Popular Categories</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/products?category=electronics" className="hover:text-blue-600 transition-colors">
                    Electronics
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=vehicles" className="hover:text-blue-600 transition-colors">
                    Vehicles
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=fashion" className="hover:text-blue-600 transition-colors">
                    Fashion
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=property" className="hover:text-blue-600 transition-colors">
                    Property
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Newsletter */}
            <div>
              <h4 className="font-semibold mb-4 text-gray-800">Stay Updated</h4>
              <p className="text-sm text-gray-500 mb-4">
                Get the latest deals and updates
              </p>
              <div className="flex">
                <Input 
                  placeholder="Your email" 
                  className="rounded-r-none h-10 text-sm"
                />
                <Button className="rounded-l-none bg-blue-600 hover:bg-blue-700 text-white px-4 h-10">
                  Subscribe
                </Button>
              </div>
              
              {/* Social Links */}
              <div className="flex items-center space-x-3 mt-6">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-600 p-2">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-600 p-2">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-600 p-2">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-600 p-2">
                  <Youtube className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-gray-500 text-center md:text-left">
              © {new Date().getFullYear()} MarketHub. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-6">
              <Link to="/terms" className="text-gray-500 hover:text-blue-600">
                Terms of Use
              </Link>
              <Link to="/privacy" className="text-gray-500 hover:text-blue-600">
                Privacy Policy
              </Link>
              <Link to="/help" className="text-gray-500 hover:text-blue-600">
                Help
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
