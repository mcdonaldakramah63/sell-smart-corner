
import React, { createContext, useContext, ReactNode } from 'react';
import { AuthContextProps } from '@/types/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthOperations } from '@/hooks/useAuthOperations';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { authState, setAuthState } = useAuthState();
  const authOperations = useAuthOperations(authState, setAuthState);

  const contextValue: AuthContextProps = {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    loading: authState.loading,
    error: authState.error,
    session: authState.session,
    ...authOperations,
    // Legacy aliases for backward compatibility
    signIn: authOperations.login,
    signUp: async (email: string, password: string, name?: string) => {
      await authOperations.register(name || '', email, password);
    },
    signOut: authOperations.logout,
    // Add missing methods with basic implementations
    resetPassword: async (email: string) => {
      // TODO: Implement password reset functionality
      console.log('Password reset not implemented yet');
    },
    updatePassword: async (password: string) => {
      // TODO: Implement password update functionality
      console.log('Password update not implemented yet');
    },
    refreshUser: async () => {
      // TODO: Implement user refresh functionality
      console.log('User refresh not implemented yet');
    }
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
