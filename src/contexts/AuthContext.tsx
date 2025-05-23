import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@/lib/types';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Session, AuthError } from '@supabase/supabase-js';

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
  updateProfile: (profileData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Clean up auth state helper
  const cleanupAuthState = () => {
    // Remove standard auth tokens
    localStorage.removeItem('supabase.auth.token');
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    // Remove from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        
        // Update state based on session
        if (session?.user) {
          const { id, email, user_metadata } = session.user;
          const userData: User = {
            id,
            name: user_metadata?.name || email?.split('@')[0] || 'User',
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      
      if (session?.user) {
        const { id, email, user_metadata } = session.user;
        const userData: User = {
          id,
          name: user_metadata?.name || email?.split('@')[0] || 'User',
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
      // Make error messages more user-friendly
      if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please verify your email address before logging in.';
      } else if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password.';
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
      
      // Clean up auth state
      cleanupAuthState();
      
      // Try to sign out first to prevent auth issues
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
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
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred');
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
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
      
      // Clean up auth state
      cleanupAuthState();
      
      // Try to sign out first to prevent auth issues
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
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
    } catch (error) {
      console.error('Register error:', error);
      setError('An unexpected error occurred');
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred",
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

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Update local user state
      setUser(prev => prev ? { ...prev, ...profileData } : null);
      
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
