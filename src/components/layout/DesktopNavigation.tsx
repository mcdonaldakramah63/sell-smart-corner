import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { hasRole } from '@/utils/auth';
import { hasBusinessAccount } from '@/utils/business';
import { Shield, Search } from 'lucide-react';

const DesktopNavigation = () => {
  const { user } = useAuth();
  
  const isAdmin = user && hasRole(user.id, 'admin');
  const isBusiness = user && hasBusinessAccount(user.id);

  return (
    <nav className="flex items-center space-x-1">
      <Button variant="ghost" asChild>
        <Link to="/products">Browse</Link>
      </Button>
      
      <Button variant="ghost" asChild>
        <Link to="/search">
          <Search className="h-4 w-4 mr-2" />
          Advanced Search
        </Link>
      </Button>

      {user && (
        <>
          <Button variant="ghost" asChild>
            <Link to="/dashboard">Dashboard</Link>
          </Button>
          
          <Button variant="ghost" asChild>
            <Link to="/messages">Messages</Link>
          </Button>

          <Button variant="ghost" asChild>
            <Link to="/security">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </Link>
          </Button>

          {isBusiness && (
            <Button variant="ghost" asChild>
              <Link to="/business">Business</Link>
            </Button>
          )}

          {isAdmin && (
            <Button variant="ghost" asChild>
              <Link to="/admin">Admin</Link>
            </Button>
          )}
        </>
      )}
    </nav>
  );
};

export default DesktopNavigation;
