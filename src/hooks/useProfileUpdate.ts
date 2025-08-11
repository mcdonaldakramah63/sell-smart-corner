
import { useToast } from "@/components/ui/use-toast";
import { sanitizeInput } from '@/utils/authUtils';
import { User } from '@/lib/types';
import { AuthState } from '@/types/auth';

export const useProfileUpdate = (
  authState: AuthState,
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
) => {
  const { toast } = useToast();

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      if (!authState.user?.id) {
        throw new Error('User not authenticated');
      }
      
      // Sanitize profile data
      const sanitizedData = Object.keys(profileData).reduce((acc, key) => {
        const value = profileData[key as keyof User];
        if (typeof value === 'string') {
          acc[key as keyof User] = sanitizeInput(value) as any;
        } else {
          acc[key as keyof User] = value;
        }
        return acc;
      }, {} as Partial<User>);
      
      
      // Update local user state
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...sanitizedData } : null
      }));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
      return;
    } catch (error) {
      console.error('Update profile error:', error);
      setAuthState(prev => ({ ...prev, error: 'Failed to update profile' }));
      toast({
        title: "Update failed",
        description: "Failed to update your profile",
        variant: "destructive",
      });
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  return { updateProfile };
};
