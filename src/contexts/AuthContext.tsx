import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@/lib/types';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Session, AuthError } from '@supabase/supabase-js';
import { 
  cleanupAuthState, 
  validatePassword, 
  validateEmail, 
  sanitizeInput,
  createRateLimiter,
  validateSession
} from '@/utils/authUtils';

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  session: Session | null;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Rate limiters for different operations
const loginRateLimiter = createRateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
const registerRateLimiter = createRateLimiter(3, 60 * 60 * 1000); // 3 attempts per hour

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        // Validate session before using it
        if (session) {
          const validSession = await validateSession();
          if (!validSession) {
            setSession(null);
            setUser(null);
            setIsAuthenticated(false);
            return;
          }
        }
        
        setSession(session);
        
        // Update state based on session
        if (session?.user) {
          const { id, email, user_metadata } = session.user;
          const userData: User = {
            id,
            name: sanitizeInput(user_metadata?.name || email?.split('@')[0] || 'User'),
            email: email || '',
            createdAt: session.user.created_at || new Date().toISOString(),
            role: 'user',
          };
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    // THEN check for existing session
    validateSession().then((session) => {
      setSession(session);
      setLoading(false);
      
      if (session?.user) {
        const { id, email, user_metadata } = session.user;
        const userData: User = {
          id,
          name: sanitizeInput(user_metadata?.name || email?.split('@')[0] || 'User'),
          email: email || '',
          createdAt: session.user.created_at || new Date().toISOString(),
          role: 'user',
        };
        setUser(userData);
        setIsAuthenticated(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
      setError(errorMessage);
      return errorMessage;
    }
    return null;
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
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
      setError(errorMessage);
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
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
      setError(errorMessage);
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt to sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      // Update state
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      
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
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
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
      setError('An unexpected error occurred');
      toast({
        title: "Google login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const loginWithGithub = async () => {
    try {
      setLoading(true);
      setError(null);
      
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
      setError('An unexpected error occurred');
      toast({
        title: "GitHub login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loginWithMicrosoft = async () => {
    try {
      setLoading(true);
      setError(null);
      
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
      setError('An unexpected error occurred');
      toast({
        title: "Microsoft login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.id) {
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
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Update local user state
      setUser(prev => prev ? { ...prev, ...sanitizedData } : null);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
      return;
    } catch (error) {
      console.error('Update profile error:', error);
      setError('Failed to update profile');
      toast({
        title: "Update failed",
        description: "Failed to update your profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading, 
      error, 
      login, 
      register, 
      logout,
      session,
      loginWithGoogle,
      loginWithGithub,
      loginWithMicrosoft,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
