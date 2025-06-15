
import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { sanitizeInput } from '@/utils/authUtils';
import { AuthState } from '@/types/auth';

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isAuthenticated: false,
    loading: true,
    error: null
  });

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        // Handle sign out
        if (event === 'SIGNED_OUT' || !session) {
          console.log('User signed out or no session');
          setAuthState({
            session: null,
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null
          });
          return;
        }
        
        // Handle sign in or token refresh
        if (session?.user) {
          console.log('Setting authenticated user:', session.user.id);
          
          // Defer data fetching to prevent deadlocks
          setTimeout(async () => {
            try {
              const { id, email, user_metadata } = session.user;
              const userData: User = {
                id,
                name: sanitizeInput(user_metadata?.name || user_metadata?.full_name || email?.split('@')[0] || 'User'),
                email: email || '',
                createdAt: session.user.created_at || new Date().toISOString(),
                role: 'user',
              };
              
              setAuthState({
                session,
                user: userData,
                isAuthenticated: true,
                loading: false,
                error: null
              });
            } catch (error) {
              console.error('Error setting user data:', error);
              setAuthState(prev => ({ ...prev, loading: false, error: 'Failed to load user data' }));
            }
          }, 0);
        }
      }
    );

    // Check for existing session
    const checkSession = async () => {
      try {
        console.log('Checking for existing session...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          setAuthState(prev => ({ ...prev, loading: false, error: 'Session check failed' }));
          return;
        }
        
        console.log('Initial session check result:', !!session);
        
        if (session?.user) {
          const { id, email, user_metadata } = session.user;
          const userData: User = {
            id,
            name: sanitizeInput(user_metadata?.name || user_metadata?.full_name || email?.split('@')[0] || 'User'),
            email: email || '',
            createdAt: session.user.created_at || new Date().toISOString(),
            role: 'user',
          };
          
          setAuthState({
            session,
            user: userData,
            isAuthenticated: true,
            loading: false,
            error: null
          });
        } else {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Session check failed:', error);
        setAuthState(prev => ({ ...prev, loading: false, error: 'Failed to initialize auth' }));
      }
    };

    checkSession();

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  return { authState, setAuthState };
};
