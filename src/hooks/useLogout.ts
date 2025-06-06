
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState } from '@/utils/authUtils';
import { AuthState } from '@/types/auth';

export const useLogout = (
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
) => {
  const { toast } = useToast();

  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt to sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      // Update state
      setAuthState({
        user: null,
        session: null,
        isAuthenticated: false,
        loading: false,
        error: null
      });
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      
      // Force page reload for a clean state
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "An error occurred during logout",
        variant: "destructive",
      });
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  return { logout };
};
