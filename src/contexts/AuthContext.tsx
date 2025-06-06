
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
    ...authOperations
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
