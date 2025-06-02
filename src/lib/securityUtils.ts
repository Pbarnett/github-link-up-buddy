
import { z } from 'zod';
import { logger } from './logger';
import { AppError } from './errorUtils';
import { LogContext } from './types';
// Use Web Crypto API for randomness and timing-safe comparisons

// Simple timing-safe equality check without Node's crypto

const safeEqual = (a: string, b: string): boolean => {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < bufA.length; i++) {
    result |= bufA[i] ^ bufB[i];
  }
  return result === 0;
};

const generateRandomHex = (size: number): string => {
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};


// Environment validation
export const environmentSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  AMADEUS_BASE_URL: z.string().url(),
  AMADEUS_CLIENT_ID: z.string().min(1),
  AMADEUS_CLIENT_SECRET: z.string().min(1)
});

export const validateRequiredEnvVars = (requiredVars: string[]): void => {
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new AppError(
      `Missing required environment variables: ${missingVars.join(', ')}`,
      'ENV_CONFIG_ERROR'
    );
  }
};

// Rate limiting configurations
export const rateLimitConfig = {
  loginAttempts: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  apiRequests: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
  }
};

// Security headers with comprehensive CSP and additional security headers
export const securityHeaders = {
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https://*.supabase.co https://api.stripe.com",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
};

// Input sanitization and validation with comprehensive protection
export const sanitizeInput = (input: string): string => {
  if (!input) return input;
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&/g, '&amp;') // Encode special characters
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/`/g, '&#x60;') // Added backtick encoding
    .trim();
};

export const validateRequest = (schema: z.ZodSchema) => {
  return async (req: Request) => {
    try {
      const data = await req.json();
      return schema.parse(data);
    } catch (error) {
      logger.error('Request validation failed', error);
      throw new AppError('Invalid request data', 'VALIDATION_ERROR');
    }
  };
};

export const validateRequestPayload = <T>(
  payload: any,
  requiredFields: (keyof T)[]
): boolean => {
  if (!payload) return false;
  
  return requiredFields.every(field => 
    payload[field] !== undefined && 
    payload[field] !== null && 
    payload[field] !== ''
  );
};

// Authentication helpers with enhanced security features
export const authHelpers = {
  validatePassword: (password: string): boolean => {
    const minLength = 12;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const noCommonPatterns = !/(123|password|admin|qwerty)/i.test(password);
    const noRepeatedChars = !/(.)\\1{2,}/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar &&
      noCommonPatterns &&
      noRepeatedChars
    );
  },

  validateEmail: (email: string): boolean => {
    return z.string().email().safeParse(email).success;
  },

  checkPasswordStrength: (password: string): 'weak' | 'medium' | 'strong' => {
    let strength = 0;
    
    if (password.length >= 12) strength += 2;
    else if (password.length >= 8) strength += 1;
    
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
    if (!/(.)\\1{2,}/.test(password)) strength += 1;
    if (!/(123|password|admin|qwerty)/i.test(password)) strength += 1;
    
    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
  }
};

// Enhanced CSRF protection with browser-safe comparison
export const generateCsrfToken = (): string => {
  return crypto.randomUUID();
};

// Simple string comparison for browser environment
export const verifyCsrfToken = (
  requestToken: string | null | undefined,
  sessionToken: string | null | undefined,
): boolean => {
  if (!requestToken || !sessionToken) {
    logger.warn('CSRF token verification failed: Missing token(s).');
    return false;
  }
  // Use timing-safe comparison to prevent timing attacks
  return safeEqual(requestToken, sessionToken);

};

// Comprehensive security event logging with enhanced context
export const logSecurityEvent = (
  event: string,
  details: Record<string, any> = {},
  level: 'info' | 'warn' | 'error' = 'info'
): void => {
  const context: LogContext = {
    component: 'Security',
    action: event,
    ...details,
    timestamp: new Date().toISOString(),
    environment: import.meta.env['NODE_ENV']
  };
  
  switch (level) {
    case 'warn':
      logger.warn(`Security event: ${event}`, details, context);
      break;
    case 'error':
      logger.error(`Security event: ${event}`, details, context);
      break;
    default:
      logger.info(`Security event: ${event}`, details, context);
  }
};

// Enhanced data protection utilities
export const tokenizeValue = (value: string): string => {
  if (!value || value.length < 4) return '****';
  const visibleChars = Math.min(2, Math.floor(value.length * 0.25));
  return value.slice(0, visibleChars) + '*'.repeat(value.length - (visibleChars * 2)) + value.slice(-visibleChars);
};

// Comprehensive IP address validation
export const isValidIpAddress = (ip: string): boolean => {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^((?:[0-9A-Fa-f]{1,4}(?::[0-9A-Fa-f]{1,4})*)?)::((?:[0-9A-Fa-f]{1,4}(?::[0-9A-Fa-f]{1,4})*)?)$/;
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

// Helper function for generating a browser-compatible random hex string
const generateBrowserRandomHex = (bytes: number): string => {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const sessionSecurity = {
  generateSessionId: (): string => {
    return generateRandomHex(32);
  },

  rotateSessionId: (currentId: string): string => {
    const newId = generateRandomHex(32);

    logSecurityEvent('session_rotation', { oldId: tokenizeValue(currentId) });
    return newId;
  },
  
  validateSessionAge: (createdAt: Date, maxAge: number = 24 * 60 * 60 * 1000): boolean => {
    return (Date.now() - createdAt.getTime()) <= maxAge;
  }
};
