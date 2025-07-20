import { PostgrestError, AuthError, FunctionsHttpError, FunctionsRelayError, FunctionsFetchError } from '@supabase/supabase-js';

export interface SupabaseError extends Error {
  code?: string;
  details?: string;
  hint?: string;
  status?: number;
  statusText?: string;
}

export class SupabaseErrorHandler {
  static handle(error: PostgrestError | AuthError | FunctionsHttpError | FunctionsRelayError | FunctionsFetchError | Error): SupabaseError {
    console.error('Supabase operation failed:', error);
    
    // Log to external service in production
    if (import.meta.env.PROD) {
      // Here you could integrate with Sentry or another logging service
      console.error('Production error:', error);
    }
    
    // Handle different types of Supabase errors
    if (error instanceof AuthError) {
      return this.handleAuthError(error);
    }
    
    if (error instanceof FunctionsHttpError) {
      return this.handleFunctionsHttpError(error);
    }
    
    if (error instanceof FunctionsRelayError) {
      return this.handleFunctionsRelayError(error);
    }
    
    if (error instanceof FunctionsFetchError) {
      return this.handleFunctionsFetchError(error);
    }
    
    if ('code' in error) {
      return this.handlePostgrestError(error as PostgrestError);
    }
    
    return {
      name: 'SupabaseError',
      message: error.message || 'An unexpected error occurred',
    };
  }
  
  private static handleAuthError(error: AuthError): SupabaseError {
    const commonAuthErrors: Record<string, string> = {
      'invalid_credentials': 'The email or password you entered is incorrect',
      'email_not_confirmed': 'Please check your email and click the confirmation link',
      'weak_password': 'Password should be at least 6 characters long',
      'signup_disabled': 'New user registrations are currently disabled',
      'email_address_not_authorized': 'This email address is not authorized to sign up',
      'user_not_found': 'No account found with this email address',
      'session_not_found': 'Your session has expired, please sign in again',
      'refresh_token_not_found': 'Session expired, please sign in again',
      'invalid_request': 'Invalid request parameters',
    };
    
    const userFriendlyMessage = commonAuthErrors[error.message] || 'Authentication failed';
    
    return {
      name: 'AuthError',
      message: userFriendlyMessage,
      details: error.message,
    };
  }
  
  private static handleFunctionsHttpError(error: FunctionsHttpError): SupabaseError {
    return {
      name: 'FunctionsHttpError',
      message: `Edge Function error: ${error.message}`,
      status: error.context?.status,
      statusText: error.context?.statusText,
      details: error.context?.responseText,
    };
  }
  
  private static handleFunctionsRelayError(error: FunctionsRelayError): SupabaseError {
    return {
      name: 'FunctionsRelayError', 
      message: `Edge Function relay error: ${error.message}`,
      details: error.message,
    };
  }
  
  private static handleFunctionsFetchError(error: FunctionsFetchError): SupabaseError {
    return {
      name: 'FunctionsFetchError',
      message: `Edge Function network error: ${error.message}`,
      details: error.message,
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
