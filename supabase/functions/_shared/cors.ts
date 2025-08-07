/// <reference lib="deno.ns" />
/**
 * Enhanced CORS utility for Supabase Edge Functions
 * Supports environment-based origin configuration and consistent header management
 */

// Environment detection
type Environment = 'development' | 'staging' | 'production';

interface CORSOptions {
  environment?: Environment;
  additionalHeaders?: string[];
  methods?: string[];
  allowCredentials?: boolean;
}

// Default configuration
const DEFAULT_HEADERS = [
  'authorization',
  'x-client-info', 
  'apikey',
  'content-type',
  'x-user-id', // Custom header for user identification
];

const DEFAULT_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];

// Environment-based origin configuration
function getAllowedOrigins(environment?: Environment): string {
  const env = environment || detectEnvironment();
  
  switch (env) {
    case 'production':
      return 'https://parkerflight.com';
    case 'staging':
      return 'https://staging.parkerflight.com';
    case 'development':
    default:
      // Allow localhost with various ports for development
      return 'http://localhost:5173';
  }
}

// Detect environment from Deno environment variables
function detectEnvironment(): Environment {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  
  if (supabaseUrl.includes('staging')) {
    return 'staging';
  } else if (supabaseUrl.includes('supabase.co') && !supabaseUrl.includes('localhost')) {
    return 'production';
  }
  
  return 'development';
}

/**
 * Get CORS headers with environment-appropriate configuration
 */
export function getCORSHeaders(options: CORSOptions = {}): Record<string, string> {
  const {
    environment,
    additionalHeaders = [],
    methods = DEFAULT_METHODS,
    allowCredentials = false
  } = options;

  const origin = getAllowedOrigins(environment);
  const headers = [...DEFAULT_HEADERS, ...additionalHeaders];

  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': headers.join(', '),
    'Access-Control-Allow-Methods': methods.join(', '),
  };

  if (allowCredentials) {
    corsHeaders['Access-Control-Allow-Credentials'] = 'true';
  }

  return corsHeaders;
}

/**
 * Handle CORS preflight requests
 * Returns a Response if this is a preflight request, null otherwise
 */
export function handleCORSPreflight(request: Request, options: CORSOptions = {}): Response | null {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: getCORSHeaders(options),
      status: 204,
    });
  }
  return null;
}

/**
 * Add CORS headers to an existing response
 */
export function addCORSHeaders(response: Response, options: CORSOptions = {}): Response {
  const corsHeaders = getCORSHeaders(options);
  
  // Create new headers object with existing headers plus CORS headers
  const newHeaders = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });

  // Create new response with updated headers
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

/**
 * Create a JSON response with CORS headers
 */
export function createCORSResponse(
  data: unknown,
  options: CORSOptions & { status?: number } = {}
): Response {
  const { status = 200, ...corsOptions } = options;
  const corsHeaders = getCORSHeaders(corsOptions);

  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Create an error response with CORS headers
 */
export function createCORSErrorResponse(
  message: string,
  options: CORSOptions & { status?: number } = {}
): Response {
  const { status = 500, ...corsOptions } = options;
  
  return createCORSResponse(
    { error: message },
    { status, ...corsOptions }
  );
}

// Legacy export for backward compatibility
export const corsHeaders = getCORSHeaders();

// Export utilities for testing
export { detectEnvironment, getAllowedOrigins };

/**
 * Migration helper - returns true if origin is allowed for current environment
 */
export function isOriginAllowed(origin: string | null, environment?: Environment): boolean {
  if (!origin) return false;
  
  const allowedOrigin = getAllowedOrigins(environment);
  const env = environment || detectEnvironment();
  
  // In development, allow localhost with any port
  if (env === 'development') {
    return origin.startsWith('http://localhost:') || origin === allowedOrigin;
  }
  
  return origin === allowedOrigin;
}
