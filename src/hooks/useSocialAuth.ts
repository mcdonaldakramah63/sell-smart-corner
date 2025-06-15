import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState } from '@/utils/authUtils';
import { handleAuthError } from '@/utils/authErrorHandler';
import { AuthState } from '@/types/auth';

export const useSocialAuth = (
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
) => {
  const { toast } = useToast();

  const loginWithGoogle = async () => {
    try {
      console.log('Starting Google login...');
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Clean up auth state
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        console.error('Google login error:', error);
        const errorMessage = handleAuthError(error, setAuthState);
        toast({
          title: "Google login failed",
          description: errorMessage || "Please try again",
          variant: "destructive",
        });
      } else {
        console.log('Google login initiated successfully');
      }
    } catch (error) {
      console.error('Google login error:', error);
      setAuthState(prev => ({ ...prev, error: 'An unexpected error occurred' }));
      toast({
        title: "Google login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };
  
  const loginWithGithub = async () => {
    try {
      console.log('Starting GitHub login...');
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Clean up auth state
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
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
