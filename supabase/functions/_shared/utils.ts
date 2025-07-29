/**
 * Shared utility functions for Supabase Edge Functions
 * Provides authentication, error handling, rate limiting, CORS, and response formatting
 */

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Types for better TypeScript support
interface RequestContext {
  req: Request;
  supabase: SupabaseClient;
  user?: any;
  userId?: string;
}

interface ErrorResponse {
  error: string;
  code?: string;
  details?: any;
  timestamp: string;
}

interface SuccessResponse<T = any> {
  data: T;
  timestamp: string;
  requestId?: string;
}

interface RateLimitConfig {
  windowMs: number; // Time /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window in milliseconds
  maxRequests: number; // Maximum requests per /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
  keyGenerator?: (req: Request) => string; // Custom key generator
}

// In-memory rate limiting store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Initialize Supabase client for Edge Functions
 */
export function createSupabaseClient(): SupabaseClient {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema: 'public',
    },
  });
}

/**
 * Extract and validate JWT token from request
 */
export async function authenticateRequest(
  req: Request,
  supabase: SupabaseClient
): Promise<{ user: any; userId: string }> {
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing or invalid Authorization header');
  }

  const token = authHeader.substring(7);
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    throw new Error('Invalid or expired token');
  }

  return { user, userId: user.id };
}

/**
 * Rate limiting middleware
 */
export function checkRateLimit(req: Request, config: RateLimitConfig): void {
  const key = config.keyGenerator ? config.keyGenerator(req) : getClientIP(req);
  const now = Date.now();
  
  // Clean up expired entries
  for (const [k, v] of rateLimitStore.entries()) {
    if (v.resetTime < now) {
      rateLimitStore.delete(k);
    }
  }
  
  const entry = rateLimitStore.get(key);
  
  if (!entry) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return;
  }
  
  if (entry.resetTime < now) {
    // Reset /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
    entry.count = 1;
    entry.resetTime = now + config.windowMs;
    return;
  }
  
  if (entry.count >= config.maxRequests) {
    const resetIn = Math.ceil((entry.resetTime - now) / 1000);
    throw new Error(`Rate limit exceeded. Try again in ${resetIn} seconds.`);
  }
  
  entry.count++;
}

/**
 * Get client IP address from request
 */
function getClientIP(req: Request): string {
  return req.headers.get('cf-connecting-ip') || 
         req.headers.get('x-forwarded-for') || 
         req.headers.get('x-real-ip') || 
         'unknown';
}

/**
 * CORS headers configuration
 */
export function getCorsHeaders(): Headers {
  const headers = new Headers();
  
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
  headers.set('Access-Control-Max-Age', '86400');
  
  return headers;
}

/**
 * Handle CORS preflight requests
 */
export function handleCorsPreflightRequest(): Response {
  return new Response(null, {
    status: 200,
    headers: getCorsHeaders(),
  });
}

/**
 * Create standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  status: number = 200,
  requestId?: string
): Response {
  const response: SuccessResponse<T> = {
    data,
    timestamp: new Date().toISOString(),
    requestId,
  };

  return new Response(JSON.stringify(response), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...Object.fromEntries(getCorsHeaders()),
    },
  });
}

/**
 * Create standardized error response
 */
export function createErrorResponse(
  error: string | Error,
  status: number = 400,
  code?: string,
  details?: any
): Response {
  const errorMessage = error instanceof Error ? error.message : error;
  
  const response: ErrorResponse = {
    error: errorMessage,
    code,
    details,
    timestamp: new Date().toISOString(),
  };

  // Log error for debugging (but don't expose sensitive details)
  console.error('Edge Function Error:', {
    error: errorMessage,
    code,
    stack: error instanceof Error ? error.stack : undefined,
    details,
  });

  return new Response(JSON.stringify(response), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...Object.fromEntries(getCorsHeaders()),
    },
  });
}

/**
 * Validate request method
 */
export function validateMethod(req: Request, allowedMethods: string[]): void {
  if (!allowedMethods.includes(req.method)) {
    throw new Error(`Method ${req.method} not allowed. Allowed methods: ${allowedMethods.join(', ')}`);
  }
}

/**
 * Parse and validate JSON body
 */
export async function parseJsonBody<T = any>(req: Request): Promise<T> {
  try {
    const body = await req.json();
    return body as T;
  } catch (_error) {
    throw new Error('Invalid JSON body');
  }
}

/**
 * Validate required fields in request body
 */
export function validateRequiredFields(body: any, requiredFields: string[]): void {
  const missingFields: string[] = [];
  
  for (const field of requiredFields) {
    if (!(field in body) || body[field] === null || body[field] === undefined) {
      missingFields.push(field);
    }
  }
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
}

/**
 * Comprehensive request handler wrapper
 */
export function withErrorHandling(
  handler: (context: RequestContext) => Promise<Response>,
  options: {
    authRequired?: boolean;
    allowedMethods?: string[];
    rateLimit?: RateLimitConfig;
  } = {}
) {
  return async (req: Request): Promise<Response> => {
    const requestId = crypto.randomUUID();
    
    try {
      // Handle CORS preflight
      if (req.method === 'OPTIONS') {
        return handleCorsPreflightRequest();
      }

      // Validate method
      if (options.allowedMethods) {
        validateMethod(req, options.allowedMethods);
      }

      // Initialize Supabase client
      const supabase = createSupabaseClient();

      // Check rate limiting
      if (options.rateLimit) {
        checkRateLimit(req, options.rateLimit);
      }

      // Create base context
      const context: RequestContext = {
        req,
        supabase,
      };

      // Authenticate if required
      if (options.authRequired) {
        const { user, userId } = await authenticateRequest(req, supabase);
        context.user = user;
        context.userId = userId;
      }

      // Call the actual handler
      const response = await handler(context);
      
      // Ensure CORS headers are set
      const corsHeaders = getCorsHeaders();
      for (const [key, value] of corsHeaders) {
        response.headers.set(key, value);
      }
      
      return response;

    } catch (error: any) {
      // Determine appropriate error status
      let status = 500;
      let code = 'INTERNAL_ERROR';

      if (error.message.includes('Missing or invalid Authorization')) {
        status = 401;
        code = 'UNAUTHORIZED';
      } else if (error.message.includes('Invalid or expired token')) {
        status = 401;
        code = 'TOKEN_INVALID';
      } else if (error.message.includes('Method') && error.message.includes('not allowed')) {
        status = 405;
        code = 'METHOD_NOT_ALLOWED';
      } else if (error.message.includes('Rate limit exceeded')) {
        status = 429;
        code = 'RATE_LIMIT_EXCEEDED';
      } else if (error.message.includes('Missing required fields')) {
        status = 400;
        code = 'VALIDATION_ERROR';
      } else if (error.message.includes('Invalid JSON')) {
        status = 400;
        code = 'INVALID_JSON';
      }

      return createErrorResponse(error, status, code, { requestId });
    }
  };
}

/**
 * Database operation with retry logic
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on authentication or validation errors
      if (error.code === 'UNAUTHORIZED' || error.code === 'VALIDATION_ERROR') {
        throw error;
      }
      
      if (i < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }

  throw lastError!;
}

/**
 * Log request for monitoring
 */
export function logRequest(req: Request, context: { userId?: string; duration?: number; status?: number }) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    userAgent: req.headers.get('user-agent'),
    ip: getClientIP(req),
    userId: context.userId,
    duration: context.duration,
    status: context.status,
  }));
}

/**
 * Helper to execute database queries safely
 */
export async function executeQuery<T>(
  supabase: SupabaseClient,
  operation: (client: SupabaseClient) => Promise<{ data: T; error: any }>,
  errorMessage = 'Database operation failed'
): Promise<T> {
  const result = await operation(supabase);
  
  if (result.error) {
    console.error('Database error:', result.error);
    throw new Error(`${errorMessage}: ${result.error.message}`);
  }
  
  return result.data;
}

/**
 * Sanitize user input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/['"]/g, '') // Remove quotes that could break SQL
    .trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Generate request tracing ID
 */
export function generateTraceId(): string {
  return `trace_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Cache response headers
 */
export function getCacheHeaders(maxAge: number = 300): Headers {
  const headers = new Headers();
  headers.set('Cache-Control', `public, max-age=${maxAge}`);
  headers.set('ETag', `"${Date.now()}"`);
  return headers;
}
