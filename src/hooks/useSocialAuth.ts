
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState } from '@/utils/authUtils';
import { handleAuthError } from '@/utils/authErrorHandler';
import { AuthState } from '@/types/auth';
import { isCapacitor } from '@/lib/isCapacitor';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

// Define the custom URL scheme for the app.
// This should match what's configured in AndroidManifest.xml
const APP_SCHEME_REDIRECT = "app.lovable.d3616aa2da414916957d8d8533d680a4://auth/callback";

export const useSocialAuth = (
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
) => {
  const { toast } = useToast();

  // Helper to choose the redirectTo based on platform
  const getRedirectTo = () => {
    if (isCapacitor()) {
      // For Capacitor, use the custom scheme that Android can intercept
      return APP_SCHEME_REDIRECT;
    } else {
      // For web, use the normal callback URL
      return `${window.location.origin}/auth/callback`;
    }
  };

  const loginWithGoogle = async () => {
    try {
      console.log('Starting Google login...');
      console.log('Platform is Capacitor:', isCapacitor());
      
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      // Clean up auth state
      cleanupAuthState();

      if (isCapacitor()) {
        // Use native Google Auth for Capacitor apps
        console.log('Using native Google Auth for Capacitor');
        
        // Initialize Google Auth
        await GoogleAuth.initialize({
          clientId: '436443580127-vvl9gu1kr6mk6sqourmgneb0rvbfioci.apps.googleusercontent.com', // This should be your Android client ID
          scopes: ['profile', 'email'],
          grantOfflineAccess: true,
        });

        // Sign in with Google
        const result = await GoogleAuth.signIn();
        console.log('Google Auth result:', result);

        if (result.authentication?.idToken) {
          // Sign in to Supabase with the Google ID token
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: result.authentication.idToken,
            access_token: result.authentication.accessToken,
          });

          if (error) {
            console.error('Supabase Google login error:', error);
            throw error;
          } else {
            console.log('Supabase Google login successful:', data);
            toast({
              title: "Login successful",
              description: "Welcome back!",
            });
          }
        } else {
          throw new Error('No ID token received from Google');
        }
      } else {
        // Use web OAuth flow for browsers
        console.log('Using web OAuth for browser');
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: getRedirectTo(),
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            }
          }
        });

        if (error) {
          console.error('Google login error:', error);
          throw error;
        } else {
          console.log('Google login initiated successfully');
        }
      }
    } catch (error) {
      console.error('Google login error:', error);
      const errorMessage = handleAuthError(error, setAuthState);
      setAuthState(prev => ({ ...prev, error: errorMessage || 'An unexpected error occurred' }));
      toast({
        title: "Google login failed",
        description: errorMessage || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const loginWithGithub = async () => {
    try {
      console.log('Starting GitHub login...');
      console.log('Platform is Capacitor:', isCapacitor());
      console.log('Redirect URL:', getRedirectTo());
      
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      // Clean up auth state
      cleanupAuthState();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: getRedirectTo()
        }
      });

      if (error) {
        console.error('GitHub login error:', error);
        const errorMessage = handleAuthError(error, setAuthState);
        toast({
          title: "GitHub login failed",
          description: errorMessage || "Please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('GitHub login error:', error);
      setAuthState(prev => ({ ...prev, error: 'An unexpected error occurred' }));
      toast({
        title: "GitHub login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  return {
    loginWithGoogle,
    loginWithGithub
  };
};
