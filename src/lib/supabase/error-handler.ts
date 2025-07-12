import { PostgrestError } from '@supabase/supabase-js';

export interface SupabaseError extends Error {
  code?: string;
  details?: string;
  hint?: string;
}

export class SupabaseErrorHandler {
  static handle(error: PostgrestError | Error): SupabaseError {
    console.error('Supabase operation failed:', error);
    
    // Log to external service in production
    if (import.meta.env.PROD) {
      // Here you could integrate with Sentry or another logging service
      console.error('Production error:', error);
    }
    
    if ('code' in error) {
      return this.handlePostgrestError(error as PostgrestError);
    }
    
    return {
      name: 'SupabaseError',
      message: error.message || 'An unexpected error occurred',
    };
  }
  
  private static handlePostgrestError(error: PostgrestError): SupabaseError {
    const commonErrors: Record<string, string> = {
      '23505': 'This record already exists',
      '23503': 'Referenced record does not exist',
      '42501': 'Insufficient permissions',
      'PGRST116': 'The result contains 0 rows',
      'PGRST204': 'No rows found',
    };
    
    const userFriendlyMessage = commonErrors[error.code] || error.message;
    
    return {
      name: 'SupabaseError',
      message: userFriendlyMessage,
      code: error.code,
      details: error.details,
      hint: error.hint,
    };
  }
  
  static isNetworkError(error: Error): boolean {
    return error.message.includes('fetch') || 
           error.message.includes('network') ||
           error.message.includes('offline');
  }
  
  static isAuthError(error: Error): boolean {
    return error.message.includes('auth') ||
           error.message.includes('unauthorized') ||
           error.message.includes('JWT');
  }
}

// Retry utility for network errors
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (i === maxRetries || !SupabaseErrorHandler.isNetworkError(lastError)) {
        throw SupabaseErrorHandler.handle(lastError);
      }
      
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  
  throw SupabaseErrorHandler.handle(lastError!);
}
