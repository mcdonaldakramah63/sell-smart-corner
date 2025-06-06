
// Comprehensive input validation and XSS protection utilities

// HTML entity encoding to prevent XSS
export const escapeHtml = (text: string): string => {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  
  return text.replace(/[&<>"'`=\/]/g, (s) => map[s]);
};

// Remove potentially dangerous HTML tags and attributes
export const sanitizeHtml = (input: string): string => {
  // Remove script tags and their content
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove other dangerous tags
  sanitized = sanitized.replace(/<(?:iframe|object|embed|form|input|link|meta|style)[^>]*>/gi, '');
  
  // Remove javascript: and data: URLs
  sanitized = sanitized.replace(/(?:javascript|data|vbscript):/gi, '');
  
  // Remove on* event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^>]*/gi, '');
  
  return sanitized.trim();
};

// Enhanced input sanitization
export const sanitizeInput = (input: string, options: {
  maxLength?: number;
  allowHtml?: boolean;
  trim?: boolean;
} = {}): string => {
  const { maxLength = 1000, allowHtml = false, trim = true } = options;
  
  let sanitized = input;
  
  if (trim) {
    sanitized = sanitized.trim();
  }
  
  if (!allowHtml) {
    sanitized = escapeHtml(sanitized);
  } else {
    sanitized = sanitizeHtml(sanitized);
  }
  
  // Limit length to prevent buffer overflow attacks
  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }
  
  return sanitized;
};

// Validate and sanitize URLs
export const validateAndSanitizeUrl = (url: string): string | null => {
  if (!url || typeof url !== 'string') return null;
  
  try {
    const sanitized = sanitizeInput(url, { allowHtml: false });
    const urlObj = new URL(sanitized);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return null;
    }
    
    return urlObj.toString();
  } catch {
    return null;
  }
};

// Phone number validation and sanitization
export const validatePhone = (phone: string): { isValid: boolean; sanitized: string } => {
  const sanitized = phone.replace(/[^\d+\-\s()]/g, '');
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  
  return {
    isValid: phoneRegex.test(sanitized.replace(/[\s\-()]/g, '')),
    sanitized: sanitized.slice(0, 20) // Limit length
  };
};

// Name validation (for usernames, full names, etc.)
export const validateName = (name: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const sanitized = sanitizeInput(name, { maxLength: 100 });
  
  if (sanitized.length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if (sanitized.length > 50) {
    errors.push('Name must be less than 50 characters');
  }
  
  // Check for potentially malicious patterns
  if (/[<>"/\\]/.test(sanitized)) {
    errors.push('Name contains invalid characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Price validation for marketplace
export const validatePrice = (price: string): { isValid: boolean; value: number | null; errors: string[] } => {
  const errors: string[] = [];
  const sanitized = sanitizeInput(price, { allowHtml: false });
  const numericValue = parseFloat(sanitized);
  
  if (isNaN(numericValue)) {
    errors.push('Price must be a valid number');
    return { isValid: false, value: null, errors };
  }
  
  if (numericValue < 0) {
    errors.push('Price cannot be negative');
  }
  
  if (numericValue > 999999.99) {
    errors.push('Price cannot exceed $999,999.99');
  }
  
  // Check for too many decimal places
  if (sanitized.includes('.') && sanitized.split('.')[1]?.length > 2) {
    errors.push('Price can have at most 2 decimal places');
  }
  
  return {
    isValid: errors.length === 0,
    value: errors.length === 0 ? Math.round(numericValue * 100) / 100 : null,
    errors
  };
};

// Text content validation (descriptions, comments, etc.)
export const validateTextContent = (content: string, options: {
  minLength?: number;
  maxLength?: number;
  required?: boolean;
} = {}): { isValid: boolean; sanitized: string; errors: string[] } => {
  const { minLength = 0, maxLength = 5000, required = false } = options;
  const errors: string[] = [];
  
  const sanitized = sanitizeInput(content, { maxLength, allowHtml: false });
  
  if (required && sanitized.length === 0) {
    errors.push('This field is required');
  }
  
  if (sanitized.length < minLength && sanitized.length > 0) {
    errors.push(`Must be at least ${minLength} characters long`);
  }
  
  if (sanitized.length > maxLength) {
    errors.push(`Must be less than ${maxLength} characters`);
  }
  
  return {
    isValid: errors.length === 0,
    sanitized,
    errors
  };
};

// Enhanced email validation
export const validateEmail = (email: string): { isValid: boolean; sanitized: string; errors: string[] } => {
  const errors: string[] = [];
  const sanitized = sanitizeInput(email.toLowerCase(), { maxLength: 254 });
  
  if (sanitized.length === 0) {
    errors.push('Email is required');
    return { isValid: false, sanitized, errors };
  }
  
  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(sanitized)) {
    errors.push('Please enter a valid email address');
  }
  
  // Check for suspicious patterns
  if (sanitized.includes('..') || sanitized.startsWith('.') || sanitized.endsWith('.')) {
    errors.push('Email format is invalid');
  }
  
  return {
    isValid: errors.length === 0,
    sanitized,
    errors
  };
};

// File validation for uploads
export const validateFile = (file: File, options: {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  allowedExtensions?: string[];
} = {}): { isValid: boolean; errors: string[] } => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  } = options;
  
  const errors: string[] = [];
  
  if (file.size > maxSize) {
    errors.push(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
  }
  
  if (!allowedTypes.includes(file.type)) {
    errors.push('File type not allowed');
  }
  
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    errors.push('File extension not allowed');
  }
  
  // Check for potentially malicious file names
  if (/[<>:"/\\|?*]/.test(file.name)) {
    errors.push('File name contains invalid characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Create a debounced validation function to prevent excessive API calls
export const createDebouncedValidator = <T extends any[]>(
  validatorFn: (...args: T) => any,
  delay: number = 300
) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: T) => {
    clearTimeout(timeoutId);
    return new Promise((resolve) => {
      timeoutId = setTimeout(() => {
        resolve(validatorFn(...args));
      }, delay);
    });
  };
};
