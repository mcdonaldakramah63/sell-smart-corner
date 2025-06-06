
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { 
  cleanupAuthState, 
  validatePassword, 
  validateEmail, 
  sanitizeInput
} from '@/utils/authUtils';
import { handleAuthError } from '@/utils/authErrorHandler';
import { registerRateLimiter } from '@/utils/rateLimiter';
import { AuthState } from '@/types/auth';

export const useRegister = (
  authState: AuthState,
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
) => {
  const { toast } = useToast();

  const register = async (name: string, email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Validate inputs
      const sanitizedName = sanitizeInput(name);
      const sanitizedEmail = sanitizeInput(email).toLowerCase();
      
      if (!sanitizedName || sanitizedName.length < 2) {
        throw new Error('Name must be at least 2 characters long');
      }
      
      if (!validateEmail(sanitizedEmail)) {
        throw new Error('Please enter a valid email address');
      }
      
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors[0]);
      }
      
      // Rate limiting
      if (!registerRateLimiter(sanitizedEmail)) {
        throw new Error('Too many registration attempts. Please try again in 1 hour.');
      }
      
      // Clean up auth state
      cleanupAuthState();
      
      // Try to sign out first to prevent auth issues
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          data: {
            name: sanitizedName,
          },
        }
      });
      
      const errorMessage = handleAuthError(error, setAuthState);
      
      if (errorMessage) {
        toast({
          title: "Registration failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration successful",
          description: data.session ? "Account created!" : "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      console.error('Register error:', error);
      const errorMessage = error.message || 'An unexpected error occurred';
      setAuthState(prev => ({ ...prev, error: errorMessage }));
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  return { register };
};
