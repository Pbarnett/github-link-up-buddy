import * as React from 'react';

// Stub diagnostics functions for client-side use
// In production, these would be replaced with proper client-side analytics
const publishDuffelApi = (message: any) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[DUFFEL_API]', JSON.stringify(message, null, 2));
  }
};

const traceApiCall = async <T>(
  name: string,
  fn: () => Promise<T>,
  context: any = {}
): Promise<T> => {
  if (process.env.NODE_ENV !== 'production') {
    const start = Date.now();
    console.log(`[TRACE_START] ${name}`, context);
    try {
      const result = await fn();
      console.log(`[TRACE_END] ${name} (${Date.now() - start}ms)`);
      return result;
    } catch (error) {
      console.log(`[TRACE_ERROR] ${name} (${Date.now() - start}ms)`, error);
      throw error;
    }
  }
  return fn();
};

export interface EdgeFunctionError {
  message: string;
  details?: unknown;
}

export interface EdgeFunctionResult<T = unknown> {
  data: T | null;
  error: EdgeFunctionError | null;
}

/**
 * Invokes a Supabase edge function with dependency injection support for testing and diagnostics
 * @param functionName - Name of the edge function to invoke
 * @param body - Request body to send to the function
 * @param fetchImpl - Fetch implementation (default: global fetch, can be mocked in tests)
 */
export const invokeEdgeFn = async <T = unknown>(
  functionName: string,
  body: unknown,
  options: { fetchImpl?: typeof fetch; signal?: AbortSignal } = {}
): Promise<EdgeFunctionResult<T>> => {
  const requestId = `edge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const startTime = Date.now();
  
  return traceApiCall(
    `edge-function-${functionName}`,
    async () => {
      try {
        const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
        const { fetchImpl = fetch, signal } = options;
        const endpoint = `${SUPABASE_URL}/functions/v1/${functionName}`;
        
        // Publish start diagnostics
        publishDuffelApi({
          endpoint,
          method: 'POST',
          requestId,
          timestamp: new Date().toISOString()
        });
        
        const response = await fetchImpl(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
          signal,
        });

        const duration = Date.now() - startTime;

        if (!response.ok) {
          // Publish error diagnostics
          publishDuffelApi({
            endpoint,
            method: 'POST',
            requestId,
            timestamp: new Date().toISOString(),
            duration,
            statusCode: response.status,
            error: `HTTP ${response.status}: ${response.statusText}`
          });
          
          return {
            data: null,
            error: {
              message: `HTTP ${response.status}: ${response.statusText}`,
              details: { status: response.status, statusText: response.statusText },
            },
          };
        }

        const data = await response.json();
        
        // Publish success diagnostics
        publishDuffelApi({
          endpoint,
          method: 'POST',
          requestId,
          timestamp: new Date().toISOString(),
          duration,
          statusCode: response.status
        });
        
        return { data, error: null };
        
      } catch (error) {
        const duration = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        
        // Publish error diagnostics
        publishDuffelApi({
          endpoint: `${process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321'}/functions/v1/${functionName}`,
          method: 'POST',
          requestId,
          timestamp: new Date().toISOString(),
          duration,
          error: errorMessage
        });
        
        return {
          data: null,
          error: {
            message: errorMessage,
            details: error,
          },
        };
      }
    },
    {
      requestId,
      endpoint: `${process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321'}/functions/v1/${functionName}`
    }
  );
};
