
import { useToast } from "@/hooks/use-toast";
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
    console.log('Login attempt started for:', email);
    
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
      
      // Clean up existing state before login
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log('Sign out cleanup failed, continuing...');
      }
      
      console.log('Attempting to sign in...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password
      });
      
      console.log('Login response received:', { data: !!data, error: !!error });
      
      if (error) {
        console.error('Login error:', error);
        const errorMessage = handleAuthError(error, setAuthState);
        
        if (errorMessage) {
          toast({
            title: "Login failed",
            description: errorMessage,
            variant: "destructive",
          });
        }
        return;
      }
      
      if (data.user && data.session) {
        console.log('Login successful for user:', data.user.id);
        toast({
          title: "Logged in successfully",
          description: `Welcome back!`,
        });
        
        // Force page reload for clean state
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        console.error('No user data received');
        throw new Error('Login failed - no user data received');
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
