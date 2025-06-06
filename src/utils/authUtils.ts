
import { supabase } from '@/integrations/supabase/client';
import { validateEmail as baseValidateEmail, validateTextContent, sanitizeInput as baseSanitizeInput } from './validation';

// Comprehensive auth state cleanup utility
export const cleanupAuthState = () => {
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

// Enhanced secure password validation
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  // Check for common weak patterns
  const weakPatterns = [
    /(.)\1{2,}/, // Three or more repeated characters
    /123|abc|qwe|asd/i, // Common sequences
    /password|admin|user|login/i, // Common words
  ];
  
  for (const pattern of weakPatterns) {
    if (pattern.test(password)) {
      errors.push('Password contains common patterns and may be weak');
      break;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Enhanced email validation with auth-specific checks
export const validateEmail = (email: string): boolean => {
  const validation = baseValidateEmail(email);
  return validation.isValid;
};

// Enhanced input sanitization for auth contexts
export const sanitizeInput = (input: string): string => {
  return baseSanitizeInput(input, { maxLength: 255, allowHtml: false });
};

// Rate limiting helper (client-side basic protection)
export const createRateLimiter = (maxAttempts: number, windowMs: number) => {
  const attempts = new Map<string, { count: number; lastAttempt: number; blocked: boolean }>();
  
  return (identifier: string): boolean => {
    const now = Date.now();
    const userAttempts = attempts.get(identifier);
    
    if (!userAttempts) {
      attempts.set(identifier, { count: 1, lastAttempt: now, blocked: false });
      return true;
    }
    
    // Reset window if enough time has passed
    if (now - userAttempts.lastAttempt > windowMs) {
      attempts.set(identifier, { count: 1, lastAttempt: now, blocked: false });
      return true;
    }
    
    // Check if blocked due to too many attempts
    if (userAttempts.blocked) {
      return false;
    }
    
    // Check if within rate limit
    if (userAttempts.count >= maxAttempts) {
      userAttempts.blocked = true;
      return false;
    }
    
    // Increment count
    userAttempts.count++;
    userAttempts.lastAttempt = now;
    return true;
  };
};

// Secure session validation with additional checks
export const validateSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session validation error:', error);
      cleanupAuthState();
      return null;
    }
    
    // Check if session exists and is valid
    if (!session) {
      return null;
    }
    
    // Check if session is expired
    if (session.expires_at) {
      const expiresAt = new Date(session.expires_at * 1000);
      const now = new Date();
      const bufferTime = 60000; // 1 minute buffer
      
      if (now >= new Date(expiresAt.getTime() - bufferTime)) {
        console.log('Session expired or expiring soon, cleaning up');
        cleanupAuthState();
        return null;
      }
    }
    
    // Validate session structure
    if (!session.user || !session.access_token) {
      console.log('Invalid session structure, cleaning up');
      cleanupAuthState();
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Session validation failed:', error);
    cleanupAuthState();
    return null;
  }
};

// Validate user input for profile updates
export const validateProfileInput = (field: string, value: string): { isValid: boolean; sanitized: string; errors: string[] } => {
  switch (field) {
    case 'name':
    case 'full_name':
      const nameValidation = validateTextContent(value, { minLength: 2, maxLength: 50 });
      return nameValidation;
      
    case 'bio':
      return validateTextContent(value, { maxLength: 500 });
      
    case 'location':
      return validateTextContent(value, { maxLength: 100 });
      
    case 'phone':
      return validateTextContent(value, { maxLength: 20 });
      
    case 'website':
      const urlValidation = validateTextContent(value, { maxLength: 255 });
      if (urlValidation.isValid && value.trim()) {
        // Additional URL validation could be added here
        if (!value.match(/^https?:\/\/.+/)) {
          return {
            isValid: false,
            sanitized: urlValidation.sanitized,
            errors: ['Website must start with http:// or https://']
          };
        }
      }
      return urlValidation;
      
    default:
      return validateTextContent(value, { maxLength: 255 });
  }
};
