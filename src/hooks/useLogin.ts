
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
      
      // Clean up auth state before login
      console.log('Cleaning up auth state...');
      cleanupAuthState();
      
      // Try to sign out first to prevent auth issues
      try {
        console.log('Attempting to sign out existing session...');
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Sign out failed, continuing with login:', err);
      }
      
      console.log('Attempting to sign in...');
      
      // Add timeout to prevent infinite loading
      const loginPromise = supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password
      });
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Login timeout - please try again')), 15000)
      );
      
      const { data, error } = await Promise.race([loginPromise, timeoutPromise]) as any;
      
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
      
      if (data.user) {
        console.log('Login successful for user:', data.user.id);
        toast({
          title: "Logged in successfully",
          description: `Welcome back!`,
        });
        
        // Force a page refresh to ensure clean state
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
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
