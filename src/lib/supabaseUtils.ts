
import { PostgrestError } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

/**
 * safeQuery wraps a Supabase query inside a typed Promise handler.
 *
 * ✅ Always pass a function that EXECUTES the query:
 *   safeQuery(() => supabase.from('table').select(...).single())
 *
 * ❌ Do NOT pass the query builder directly:
 *   safeQuery(supabase.from(...)) // TypeScript will error
 *
 * This ensures type safety and proper promise behavior.
 */
interface QueryResult<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

export async function safeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: PostgrestError | null }>,
  options?: {
    errorMessage?: string;
    showErrorToast?: boolean;
  }
): Promise<QueryResult<T>> {
  const defaultOptions = {
    errorMessage: 'An error occurred while fetching data',
    showErrorToast: true,
    ...options,
  };
  
  try {
    const { data, error } = await queryFn();
    
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
    
    return {
      data,
      error: null,
      loading: false,
    };
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
