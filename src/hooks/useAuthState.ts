
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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        // Validate session before using it
        if (session) {
          const validSession = await validateSession();
          if (!validSession) {
            setAuthState(prev => ({
              ...prev,
              session: null,
              user: null,
              isAuthenticated: false
            }));
            return;
          }
        }
        
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
          
          setAuthState(prev => ({
            ...prev,
            session,
            user: userData,
            isAuthenticated: true
          }));
        } else {
          setAuthState(prev => ({
            ...prev,
            session: null,
            user: null,
            isAuthenticated: false
          }));
        }
      }
    );

    // THEN check for existing session
    validateSession().then((session) => {
      setAuthState(prev => ({ ...prev, loading: false }));
      
      if (session?.user) {
        const { id, email, user_metadata } = session.user;
        const userData: User = {
          id,
          name: sanitizeInput(user_metadata?.name || email?.split('@')[0] || 'User'),
          email: email || '',
          createdAt: session.user.created_at || new Date().toISOString(),
          role: 'user',
        };
        
        setAuthState(prev => ({
          ...prev,
          session,
          user: userData,
          isAuthenticated: true
        }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { authState, setAuthState };
};
