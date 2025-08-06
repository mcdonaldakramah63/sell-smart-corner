
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="bg-orange-500 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-white/90">Get the latest deals and offers delivered to your inbox</p>
            </div>
            <div className="flex w-full max-w-md">
              <Input 
                placeholder="Enter your email address" 
                className="rounded-r-none bg-white border-white"
              />
              <Button className="rounded-l-none bg-gray-900 hover:bg-gray-800 text-white px-6">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="font-bold text-xl text-white">MarketHub</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Your trusted marketplace for buying and selling quality products. Connect with millions of buyers and sellers worldwide.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">support@markethub.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">123 Market Street, NY 10001</span>
                </div>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/" className="hover:text-orange-500 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="hover:text-orange-500 transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className="hover:text-orange-500 transition-colors">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link to="/create-product" className="hover:text-orange-500 transition-colors">
                    Start Selling
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-orange-500 transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Customer Service */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Customer Service</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/help" className="hover:text-orange-500 transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-orange-500 transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/safety" className="hover:text-orange-500 transition-colors">
                    Safety Tips
                  </Link>
                </li>
                <li>
                  <Link to="/shipping" className="hover:text-orange-500 transition-colors">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link to="/returns" className="hover:text-orange-500 transition-colors">
                    Returns
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/terms" className="hover:text-orange-500 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-orange-500 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="hover:text-orange-500 transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link to="/intellectual-property" className="hover:text-orange-500 transition-colors">
                    IP Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400 text-center md:text-left">
              © {new Date().getFullYear()} MarketHub. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-orange-500">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-orange-500">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-orange-500">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-orange-500">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
