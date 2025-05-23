
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting auth session:', error);
        setError('Authentication failed. Please try again.');
        toast({
          title: "Authentication failed",
          description: "There was a problem authenticating your account.",
          variant: "destructive",
        });
        setTimeout(() => navigate('/auth/login'), 2000);
        return;
      }
      
      if (data.session) {
        toast({
          title: "Login successful",
          description: "You have been logged in successfully.",
        });
        navigate('/');
      } else {
        setError('No session found. Please try logging in again.');
        setTimeout(() => navigate('/auth/login'), 2000);
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          {error ? (
            <div className="p-4 bg-red-50 text-red-800 rounded-md">
              {error}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p>Completing login, please wait...</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
