import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

// Validation schema for names (alphanumeric, spaces, and a few special characters)
const nameSchema = z.string().min(2).max(50).regex(/^[a-zA-Z0-9\s.'-]+$/);

// Validation schema for email
const emailSchema = z.string().email();

// Validation schema for passwords (min 8 characters, require uppercase, lowercase, number, and special character)
const passwordSchema = z.string().min(8).max(100)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).*$/, 
  "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character");

// Validation schema for URLs
const urlSchema = z.string().url();

// Validation schema for phone numbers (basic format check)
const phoneSchema = z.string().regex(/^\+?\d{1,3}[-.\s]?\d{1,14}$/, "Invalid phone number format");

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitized?: string;
}

interface TextContentOptions {
  minLength?: number;
  maxLength: number;
}

interface FileValidationOptions {
  maxSize: number; // in bytes
  allowedTypes: string[]; // MIME types
  allowedExtensions: string[]; // file extensions
}

// Function to validate a name
export const validateName = (name: string): ValidationResult => {
  try {
    nameSchema.parse(name);
    return { isValid: true, errors: [] };
  } catch (error: any) {
    return { isValid: false, errors: error.errors.map((e: any) => e.message) };
  }
};

// Function to validate an email
export const validateEmail = (email: string): ValidationResult => {
  try {
    const sanitized = emailSchema.parse(email);
    return { isValid: true, errors: [], sanitized };
  } catch (error: any) {
    return { isValid: false, errors: error.errors.map((e: any) => e.message) };
  }
};

// Function to validate a password
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  try {
    passwordSchema.parse(password);
    return { isValid: true, errors: [] };
  } catch (error: any) {
    return { isValid: false, errors: error.errors.map((e: any) => e.message) };
  }
};

// Function to validate a URL
export const validateUrl = (url: string): boolean => {
  try {
    urlSchema.parse(url);
    return true;
  } catch (error) {
    return false;
  }
};

// Function to validate and sanitize a URL
export const validateAndSanitizeUrl = (url: string): string | null => {
  try {
    const sanitizedUrl = urlSchema.parse(url);
    return sanitizedUrl;
  } catch (error) {
    return null;
  }
};

// Function to validate phone number
export const validatePhone = (phone: string): ValidationResult => {
  try {
    phoneSchema.parse(phone);
    return { isValid: true, errors: [] };
  } catch (error: any) {
    return { isValid: false, errors: error.errors.map((e: any) => e.message) };
  }
};

// Function to sanitize input to prevent XSS attacks
export const sanitizeInput = (input: string): string => {
  const tempDiv = document.createElement('div');
  tempDiv.textContent = input;
  return tempDiv.innerHTML;
};

// Function to validate generic text content with options for minLength and maxLength
export const validateTextContent = (text: string, options: TextContentOptions): ValidationResult => {
  const { minLength = 0, maxLength } = options;
  
  if (text.length < minLength) {
    return { isValid: false, errors: [`Must be at least ${minLength} characters`] };
  }
  
  if (text.length > maxLength) {
    return { isValid: false, errors: [`Must be no more than ${maxLength} characters`] };
  }
  
  const sanitized = sanitizeInput(text);
  return { isValid: true, errors: [], sanitized };
};

// Function to validate a file based on size and type
export const validateFile = (file: File, options: FileValidationOptions): ValidationResult => {
  const { maxSize, allowedTypes, allowedExtensions } = options;
  
  if (file.size > maxSize) {
    return { isValid: false, errors: [`File size exceeds the maximum allowed size of ${maxSize / (1024 * 1024)} MB`] };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, errors: [`File type ${file.type} is not allowed. Allowed types are: ${allowedTypes.join(', ')}`] };
  }
  
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (fileExtension && !allowedExtensions.includes(`.${fileExtension}`)) {
    return { isValid: false, errors: [`File extension ${fileExtension} is not allowed. Allowed extensions are: ${allowedExtensions.join(', ')}`] };
  }
  
  return { isValid: true, errors: [] };
};

// Function to validate session
export const validateSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Session validation error:', error);
      return null;
    }
    return session;
  } catch (error) {
    console.error('Session validation failed:', error);
    return null;
  }
};

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
