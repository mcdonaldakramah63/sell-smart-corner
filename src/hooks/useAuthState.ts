
import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { sanitizeInput, validateSession } from '@/utils/authUtils';
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
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        // Handle different auth events
        if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          if (!session) {
            console.log('User signed out or session expired');
            setAuthState(prev => ({
              ...prev,
              session: null,
              user: null,
              isAuthenticated: false,
              loading: false
            }));
            return;
          }
        }
        
        // Validate session before using it
        if (session) {
          console.log('Validating session...');
          try {
            const validSession = await validateSession();
            if (!validSession) {
              console.log('Session validation failed');
              setAuthState(prev => ({
                ...prev,
                session: null,
                user: null,
                isAuthenticated: false,
                loading: false
              }));
              return;
            }
          } catch (error) {
            console.error('Session validation error:', error);
            setAuthState(prev => ({
              ...prev,
              session: null,
              user: null,
              isAuthenticated: false,
              loading: false
            }));
            return;
          }
        }
        
        // Update state based on session
        if (session?.user) {
          console.log('Setting authenticated user:', session.user.id);
          const { id, email, user_metadata } = session.user;
          const userData: User = {
            id,
            name: sanitizeInput(user_metadata?.name || user_metadata?.full_name || email?.split('@')[0] || 'User'),
            email: email || '',
            createdAt: session.user.created_at || new Date().toISOString(),
            role: 'user',
          };
          
          setAuthState(prev => ({
            ...prev,
            session,
            user: userData,
            isAuthenticated: true,
            loading: false
          }));
        } else {
          console.log('No user in session, setting unauthenticated state');
          setAuthState(prev => ({
            ...prev,
            session: null,
            user: null,
            isAuthenticated: false,
            loading: false
          }));
        }
      }
    );

    // THEN check for existing session with timeout
    const checkSession = async () => {
      try {
        console.log('Checking for existing session...');
        
        const sessionPromise = validateSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session check timeout')), 10000)
        );
        
        const session = await Promise.race([sessionPromise, timeoutPromise]) as Session | null;
        
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
          
          setAuthState(prev => ({
            ...prev,
            session,
            user: userData,
            isAuthenticated: true,
            loading: false
          }));
        } else {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Session check failed:', error);
        setAuthState(prev => ({ ...prev, loading: false }));
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
