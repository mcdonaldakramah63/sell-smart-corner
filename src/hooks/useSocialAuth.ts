
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
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Clean up auth state
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      const errorMessage = handleAuthError(error, setAuthState);
      
      if (errorMessage) {
        toast({
          title: "Google login failed",
          description: errorMessage,
          variant: "destructive",
        });
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
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Clean up auth state
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      const errorMessage = handleAuthError(error, setAuthState);
      
      if (errorMessage) {
        toast({
          title: "GitHub login failed",
          description: errorMessage,
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

  const loginWithMicrosoft = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Clean up auth state
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      const errorMessage = handleAuthError(error, setAuthState);
      
      if (errorMessage) {
        toast({
          title: "Microsoft login failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Microsoft login error:', error);
      setAuthState(prev => ({ ...prev, error: 'An unexpected error occurred' }));
      toast({
        title: "Microsoft login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  return {
    loginWithGoogle,
    loginWithGithub,
    loginWithMicrosoft
  };
};
