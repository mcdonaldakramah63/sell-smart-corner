
import { AuthError } from '@supabase/supabase-js';
import { AuthState } from '@/types/auth';

export const handleAuthError = (
  error: AuthError | null,
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
) => {
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
