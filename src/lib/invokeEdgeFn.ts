export interface EdgeFunctionError {
  message: string;
  details?: unknown;
}

export interface EdgeFunctionResult<T = unknown> {
  data: T | null;
  error: EdgeFunctionError | null;
}

/**
 * Invokes a Supabase edge function with dependency injection support for testing
 * @param functionName - Name of the edge function to invoke
 * @param body - Request body to send to the function
 * @param fetchImpl - Fetch implementation (default: global fetch, can be mocked in tests)
 */
export const invokeEdgeFn = async <T = unknown>(
  functionName: string,
  body: unknown,
  fetchImpl: typeof fetch = fetch
): Promise<EdgeFunctionResult<T>> => {
  try {
    const SUPABASE_URL =
      import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
    const response = await fetchImpl(
      `${SUPABASE_URL}/functions/v1/${functionName}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      return {
        data: null,
        error: {
          message: `HTTP ${response.status}: ${response.statusText}`,
          details: { status: response.status, statusText: response.statusText },
        },
      };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
        details: error,
      },
    };
  }
};
