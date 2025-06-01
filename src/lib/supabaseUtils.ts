
import {
  PostgrestResponse,
  PostgrestSingleResponse,
  PostgrestMaybeSingleResponse
} from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

// Type for the result object
interface QueryResult<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

/**
 * safeQuery wraps a Supabase query inside a typed Promise handler.
 *
 * ✅ Always pass a function that EXECUTES the query:
 *   safeQuery(() => supabase.from('table').select(...))
 *
 * This ensures type safety and proper promise behavior.
 * 
 * NOTE: This function handles both .single()/.maybeSingle() queries returning a single item T,
 * and .select() queries returning arrays T[]. The implementation uses Array.isArray(data)
 * to correctly type the return data.
 */

/**
 * For `.single()` or `.maybeSingle()` responses — returns QueryResult with T
 */
export async function safeQuery<T>(
  queryFn: () => Promise<PostgrestSingleResponse<T> | PostgrestMaybeSingleResponse<T>> | PostgrestSingleResponse<T> | PostgrestMaybeSingleResponse<T>,
  options?: {
    errorMessage?: string;
    showErrorToast?: boolean;
  }
): Promise<QueryResult<T>>;

/**
 * For `.select()` responses — returns QueryResult with T[]
 */
export async function safeQuery<T>(
  queryFn: () => Promise<PostgrestResponse<T>> | PostgrestResponse<T>,
  options?: {
    errorMessage?: string;
    showErrorToast?: boolean;
  }
): Promise<QueryResult<T[]>>;

// Implementation
export async function safeQuery<T>(
  queryFn: () => 
    | Promise<PostgrestSingleResponse<T> | PostgrestMaybeSingleResponse<T> | PostgrestResponse<T>>
    | PostgrestSingleResponse<T>
    | PostgrestMaybeSingleResponse<T>
    | PostgrestResponse<T>,
  options?: {
    errorMessage?: string;
    showErrorToast?: boolean;
  }
): Promise<QueryResult<T> | QueryResult<T[]>> {
  const defaultOptions = {
    errorMessage: 'An error occurred while fetching data',
    showErrorToast: true,
    ...options,
  };
  
  try {
    // Convert the query result to a promise if it's not already
    const promiseResult = Promise.resolve(queryFn());
    const { data, error } = await promiseResult;
    
    if (error) {
      if (defaultOptions.showErrorToast) {
        toast({
          title: 'Error',
          description: error.message || defaultOptions.errorMessage,
          variant: 'destructive',
        });
      }
      
      return {
        data: null,
        error: new Error(error.message || defaultOptions.errorMessage),
        loading: false,
      };
    }
    
    // For array responses (from .select())
    if (Array.isArray(data)) {
      return {
        data,
        error: null,
        loading: false,
      } as QueryResult<T[]>;
    }
    
    // For single object responses (from .single() or .maybeSingle())
    return {
      data,
      error: null,
      loading: false,
    } as QueryResult<T>;
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    
    if (defaultOptions.showErrorToast) {
      toast({
        title: 'Error',
        description: error.message || defaultOptions.errorMessage,
        variant: 'destructive',
      });
    }
    
    return {
      data: null,
      error,
      loading: false,
    };
  }
}
