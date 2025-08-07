import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Database utility functions shared across Edge Functions
export function createServiceClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      db: {
        schema: 'public',
      },
    }
  );
}

export function createClientWithAuth(token: string) {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

// Enhanced error handling for database operations
export interface DatabaseError {
  code: string;
  message: string;
  details?: string;
  hint?: string;
}

export function handleDatabaseError(error: any): DatabaseError {
  console.error('Database error:', error);
  
  // Map common PostgreSQL error codes to user-friendly messages
  const errorMappings: Record<string, string> = {
    '23505': 'This record already exists',
    '23503': 'Referenced record does not exist',
    '42501': 'Insufficient permissions',
    'PGRST116': 'No rows found',
    'PGRST204': 'No rows found',
  };

  return {
    code: error.code || 'UNKNOWN_ERROR',
    message: errorMappings[error.code] || error.message || 'An unexpected error occurred',
    details: error.details,
    hint: error.hint,
  };
}

// Transaction wrapper with proper error handling
export async function withTransaction<T>(
  client: ReturnType<typeof createServiceClient>,
  operations: (client: ReturnType<typeof createServiceClient>) => Promise<T>
): Promise<T> {
  try {
    // Note: Supabase doesn't support explicit transactions in Edge Functions
    // This provides a consistent interface for potential future support
    const result = await operations(client);
    return result;
  } catch (error) {
    console.error('Transaction failed:', error);
    throw handleDatabaseError(error);
  }
}

// Rate limiting utility for Edge Functions
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  key: string, 
  limit: number = 100, 
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = requestCounts.get(key);
  
  if (!record || now > record.resetTime) {
    const newRecord = { count: 1, resetTime: now + windowMs };
    requestCounts.set(key, newRecord);
    return { 
      allowed: true, 
      remaining: limit - 1, 
      resetTime: newRecord.resetTime 
    };
  }
  
  if (record.count >= limit) {
    return { 
      allowed: false, 
      remaining: 0, 
      resetTime: record.resetTime 
    };
  }
  
  record.count++;
  return { 
    allowed: true, 
    remaining: limit - record.count, 
    resetTime: record.resetTime 
  };
}

// User authentication and authorization helper
export interface AuthenticatedUser {
  id: string;
  email?: string;
  role?: string;
}

export async function authenticateUser(
  authHeader: string | null
): Promise<AuthenticatedUser | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  const client = createClientWithAuth(token);
  
  try {
    const { data: { user }, error } = await client.auth.getUser(token);
    
    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    console.error('Authentication failed:', error);
    return null;
  }
}

// CORS headers for consistent usage across functions
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Standard response helpers
export function createResponse(
  data: any, 
  status: number = 200, 
  headers: Record<string, string> = {}
): Response {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        ...headers,
      },
    }
  );
}

export function createErrorResponse(
  message: string,
  status: number = 400,
  code?: string
): Response {
  return createResponse(
    { 
      error: message, 
      code,
      timestamp: new Date().toISOString() 
    },
    status
  );
}

// Input validation helpers
export function validateRequiredFields<T extends Record<string, any>>(
  data: T,
  requiredFields: (keyof T)[]
): string[] {
  const missing: string[] = [];
  
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      missing.push(String(field));
    }
  }
  
  return missing;
}

// Monitoring and logging utilities
export function logFunctionStart(functionName: string, context?: any) {
  console.log(`🚀 Function ${functionName} started`, {
    timestamp: new Date().toISOString(),
    context,
  });
}

export function logFunctionEnd(functionName: string, duration: number, context?: any) {
  console.log(`✅ Function ${functionName} completed`, {
    timestamp: new Date().toISOString(),
    duration: `${duration}ms`,
    context,
  });
}

export function logFunctionError(functionName: string, error: any, context?: any) {
  console.error(`❌ Function ${functionName} failed`, {
    timestamp: new Date().toISOString(),
    error: error.message || String(error),
    stack: error.stack,
    context,
  });
}
