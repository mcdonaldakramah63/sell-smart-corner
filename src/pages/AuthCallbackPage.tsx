
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { isCapacitor } from '@/lib/isCapacitor';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Processing auth callback...');
        console.log('Is Capacitor platform:', isCapacitor());
        setIsProcessing(true);

        const isCapacitorMobile = isCapacitor();

        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting auth session:', error);
          setError('Authentication failed. Please try again.');
          toast({
            title: "Authentication failed",
            description: "There was a problem with your login. Please try again.",
            variant: "destructive",
          });
          
          if (isCapacitorMobile) {
            // For mobile, close the browser and return to app
            setTimeout(() => {
              if ((window as any).Capacitor) {
                (window as any).Capacitor.Plugins.App?.exitApp?.();
              }
            }, 3000);
          } else {
            setTimeout(() => navigate('/auth/login'), 3000);
          }
          return;
        }

        if (data.session) {
          console.log('Authentication successful');
          setSuccess(true);
          
          toast({
            title: "Login successful",
            description: "You have been logged in successfully.",
          });

          if (isCapacitorMobile) {
            // For Capacitor mobile apps, close this browser window
            // The app should detect the session change and navigate accordingly
            setTimeout(() => {
              console.log('Closing auth browser window...');
              window.close();
              
              // If window.close() doesn't work, try to navigate back to the app
              if ((window as any).Capacitor?.Plugins?.App) {
                (window as any).Capacitor.Plugins.App.exitApp();
              }
            }, 1500);
          } else {
            // For web, navigate to home page
            setTimeout(() => navigate('/'), 1500);
          }
        } else {
          // Check URL for error parameters
          const url = new URL(window.location.href);
          const errorParam = url.searchParams.get('error');
          const errorDescription = url.searchParams.get('error_description');
          
          if (errorParam || errorDescription) {
            console.error('Auth callback error:', errorParam, errorDescription);
            setError(`${errorParam || 'Authentication error'}: ${errorDescription || 'Please try again.'}`);
          } else {
            console.error('No session found after auth callback');
            setError('No session found. Please try logging in again.');
          }
          
          if (isCapacitorMobile) {
            setTimeout(() => {
              if ((window as any).Capacitor) {
                (window as any).Capacitor.Plugins.App?.exitApp?.();
              }
            }, 3000);
          } else {
            setTimeout(() => navigate('/auth/login'), 3000);
          }
        }
      } catch (err) {
        console.error('Unexpected error during auth callback:', err);
        setError('An unexpected error occurred. Please try again.');
        
        const isCapacitorMobile = isCapacitor();
        if (isCapacitorMobile) {
          setTimeout(() => {
            if ((window as any).Capacitor) {
              (window as any).Capacitor.Plugins.App?.exitApp?.();
            }
          }, 3000);
        } else {
          setTimeout(() => navigate('/auth/login'), 3000);
        }
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  const isCapacitorMobile = isCapacitor();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto text-center">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p>Completing authentication, please wait...</p>
            {isCapacitorMobile && (
              <p className="text-sm text-muted-foreground mt-2">
                This window will close automatically when done.
              </p>
            )}
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Authentication Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            {!isCapacitorMobile && (
              <div className="mt-4">
                <Button onClick={() => navigate('/auth/login')} variant="outline" className="w-full">
                  Return to Login
                </Button>
              </div>
            )}
          </Alert>
        ) : success ? (
          <Alert className="bg-green-50 border-green-200 text-green-800 mb-4">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>Login Successful</AlertTitle>
            <AlertDescription>
              {isCapacitorMobile 
                ? "You've been logged in successfully. This window will close automatically."
                : "You've been logged in successfully. Redirecting to the homepage..."
              }
            </AlertDescription>
          </Alert>
        ) : null}
      </div>
    </div>
  );
}
