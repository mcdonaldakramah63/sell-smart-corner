
import { useState } from 'react';
import { User } from '@/lib/types';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { AuthError } from '@supabase/supabase-js';
import { 
  cleanupAuthState, 
  validatePassword, 
  validateEmail, 
  sanitizeInput,
  createRateLimiter
} from '@/utils/authUtils';
import { AuthState } from '@/types/auth';

// Rate limiters for different operations
const loginRateLimiter = createRateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
const registerRateLimiter = createRateLimiter(3, 60 * 60 * 1000); // 3 attempts per hour

export const useAuthOperations = (
  authState: AuthState,
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
) => {
  const { toast } = useToast();

  const handleAuthError = (error: AuthError | null) => {
    if (error) {
      let errorMessage = error.message;
      // Make error messages more user-friendly while not exposing sensitive info
      if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please verify your email address before logging in.';
      } else if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password.';
      } else if (error.message.includes('Email rate limit exceeded')) {
        errorMessage = 'Too many login attempts. Please try again later.';
      } else if (error.message.includes('Signup disabled')) {
        errorMessage = 'Account registration is currently disabled.';
      } else if (error.message.includes('User already registered')) {
        errorMessage = 'An account with this email already exists.';
      } else {
        // Generic error message to avoid exposing sensitive information
        errorMessage = 'Authentication failed. Please try again.';
      }
      setAuthState(prev => ({ ...prev, error: errorMessage }));
      return errorMessage;
    }
    return null;
  };

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
      
      const errorMessage = handleAuthError(error);
      
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
      
      const errorMessage = handleAuthError(error);
      
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
      
      const errorMessage = handleAuthError(error);
      
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
      
      const errorMessage = handleAuthError(error);
      
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
      
      const errorMessage = handleAuthError(error);
      
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
      
      const { error } = await supabase
        .from('profiles')
        .update({
          ...sanitizedData,
          updated_at: new Date().toISOString()
        })
        .eq('id', authState.user.id);
      
      if (error) {
        throw error;
      }
      
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

  return {
    login,
    register,
    logout,
    loginWithGoogle,
    loginWithGithub,
    loginWithMicrosoft,
    updateProfile
  };
};
