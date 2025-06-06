
// Rate limiting utility for client-side basic protection
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

// Pre-configured rate limiters
export const loginRateLimiter = createRateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
export const registerRateLimiter = createRateLimiter(3, 60 * 60 * 1000); // 3 attempts per hour
