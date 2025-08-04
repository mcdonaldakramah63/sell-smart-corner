
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { hasRole } from '@/utils/auth';
import { hasBusinessAccount } from '@/utils/business';

const DesktopNavigation = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBusiness, setIsBusiness] = useState(false);

  useEffect(() => {
    const checkUserRoles = async () => {
      if (user?.id) {
        const adminCheck = await hasRole(user.id, 'admin');
        const businessCheck = await hasBusinessAccount(user.id);
        setIsAdmin(adminCheck);
        setIsBusiness(businessCheck);
      }
    };

    checkUserRoles();
  }, [user?.id]);

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
