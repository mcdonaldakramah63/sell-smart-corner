
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setIsProcessing(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting auth session:', error);
          setError('Authentication failed. Please try again.');
          toast({
            title: "Authentication failed",
            description: "There was a problem with your login. Please try again.",
            variant: "destructive",
          });
          setTimeout(() => navigate('/auth/login'), 3000);
          return;
        }
        
        if (data.session) {
          toast({
            title: "Login successful",
            description: "You have been logged in successfully.",
          });
          navigate('/');
        } else {
          // Try to get auth error from URL
          const url = new URL(window.location.href);
          const errorParam = url.searchParams.get('error');
          const errorDescription = url.searchParams.get('error_description');
          
          if (errorParam || errorDescription) {
            setError(`${errorParam || 'Authentication error'}: ${errorDescription || 'Please try again.'}`);
          } else {
            setError('No session found. Please try logging in again.');
          }
          
          setTimeout(() => navigate('/auth/login'), 3000);
        }
      } catch (err) {
        console.error('Unexpected error during auth callback:', err);
        setError('An unexpected error occurred. Please try again.');
        setTimeout(() => navigate('/auth/login'), 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p>Completing login, please wait...</p>
              <p className="text-sm text-muted-foreground mt-2">You'll be redirected shortly.</p>
            </div>
          ) : error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Authentication Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
              <div className="mt-4">
                <Button onClick={() => navigate('/auth/login')} variant="outline" className="w-full">
                  Return to Login
                </Button>
              </div>
            </Alert>
          ) : (
            <Alert className="bg-green-50 border-green-200 text-green-800 mb-4">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Login Successful</AlertTitle>
              <AlertDescription>You've been logged in successfully. Redirecting...</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </Layout>
  );
}
