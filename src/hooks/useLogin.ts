
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { 
  cleanupAuthState, 
  validateEmail, 
  sanitizeInput
} from '@/utils/authUtils';
import { handleAuthError } from '@/utils/authErrorHandler';
import { loginRateLimiter } from '@/utils/rateLimiter';
import { AuthState } from '@/types/auth';

export const useLogin = (
  authState: AuthState,
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
) => {
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Validate inputs
      const sanitizedEmail = sanitizeInput(email).toLowerCase();
      
      if (!validateEmail(sanitizedEmail)) {
        throw new Error('Please enter a valid email address');
      }
      
      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // Rate limiting
      if (!loginRateLimiter(sanitizedEmail)) {
        throw new Error('Too many login attempts. Please try again in 15 minutes.');
      }
      
      // Clean up auth state
      cleanupAuthState();
      
      // Try to sign out first to prevent auth issues
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password
      });
      
      const errorMessage = handleAuthError(error, setAuthState);
      
      if (errorMessage) {
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else if (data.user) {
        toast({
          title: "Logged in successfully",
          description: `Welcome back!`,
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'An unexpected error occurred';
      setAuthState(prev => ({ ...prev, error: errorMessage }));
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  return { login };
};
