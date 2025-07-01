
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const DesktopNavigation = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="hidden md:flex items-center space-x-6">
      <Link to="/" className="text-sm font-medium hover:text-marketplace-primary transition-colors">
        Home
      </Link>
      <Link to="/products" className="text-sm font-medium hover:text-marketplace-primary transition-colors">
        Products
      </Link>
      {isAuthenticated && (
        <>
          <Link to="/dashboard" className="text-sm font-medium hover:text-marketplace-primary transition-colors">
            Dashboard
          </Link>
          <Link to="/create-product" className="text-sm font-medium hover:text-marketplace-primary transition-colors">
            Sell Something
          </Link>
        </>
      )}
    </nav>
  );
};
