/**
 * Enhanced AbortSignal utilities following Node.js v24.4.1 best practices
 * Based on: NodeJS_Documentation_4.md and NodeJS_Documentation_5.md
 */

/**
 * Creates an AbortSignal that automatically aborts after a specified timeout
 * Uses Node.js AbortSignal.timeout() for built-in timeout support
 * 
 * @param timeoutMs - Timeout in milliseconds
 * @returns AbortSignal that will abort after the timeout
 */
export function createTimeoutSignal(timeoutMs: number): AbortSignal {
  // Use Node.js built-in AbortSignal.timeout() for efficient timeout handling
  return AbortSignal.timeout(timeoutMs);
}

/**
 * Combines multiple AbortSignals into a single signal that aborts when any of them abort
 * Uses Node.js AbortSignal.any() for efficient signal composition
 * 
 * @param signals - Array of AbortSignals to combine
 * @returns Combined AbortSignal
 */
export function combineSignals(signals: AbortSignal[]): AbortSignal {
  // Use Node.js built-in AbortSignal.any() for efficient signal combination
  return AbortSignal.any(signals);
}

/**
 * Creates a timeout-aware fetch wrapper that automatically cancels long-running requests
 * 
 * @param url - URL to fetch
 * @param options - Fetch options
 * @param timeoutMs - Timeout in milliseconds (default: 30 seconds)
 * @returns Promise that resolves to Response or rejects with timeout
 */
export async function fetchWithTimeout(
  url: string, 
  options: RequestInit = {}, 
  timeoutMs: number = 30000
): Promise<Response> {
  const timeoutSignal = createTimeoutSignal(timeoutMs);
  
  // Combine user-provided signal with timeout signal
  const signals = options.signal ? [options.signal, timeoutSignal] : [timeoutSignal];
  const combinedSignal = combineSignals(signals);
  
  try {
    return await fetch(url, {
      ...options,
      signal: combinedSignal
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      // Check if the abort was due to timeout
      if (timeoutSignal.aborted) {
        throw new Error(`Request timed out after ${timeoutMs}ms`);
      }
    }
    throw error;
  }
}

/**
 * Enhanced version of invokeEdgeFn with built-in timeout support
 * 
 * @param functionName - Name of the edge function
 * @param body - Request body
 * @param options - Options including timeout and signal
 * @returns Promise that resolves to edge function result
 */
export async function invokeEdgeFnWithTimeout<T = unknown>(
  functionName: string,
  body: unknown,
  options: {
    fetchImpl?: typeof fetch;
    signal?: AbortSignal;
    timeoutMs?: number;
  } = {}
): Promise<{ data: T | null; error: { message: string; details?: unknown } | null }> {
  const { fetchImpl = fetch, signal, timeoutMs = 30000 } = options;
  
  try {
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
    
    // Create timeout signal
    const timeoutSignal = createTimeoutSignal(timeoutMs);
    
    // Combine signals if user provided one
    const signals = signal ? [signal, timeoutSignal] : [timeoutSignal];
    const combinedSignal = combineSignals(signals);
    
    const response = await fetchImpl(
      `${SUPABASE_URL}/functions/v1/${functionName}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: combinedSignal,
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
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error,
      },
    };
  }
}

/**
 * Utility to check if an AbortSignal was aborted due to timeout
 * 
 * @param signal - AbortSignal to check
 * @returns boolean indicating if abort was due to timeout
 */
export function isTimeoutAbort(signal: AbortSignal): boolean {
  return signal.aborted && signal.reason === 'TimeoutError';
}

/**
 * Creates a race condition between a promise and a timeout
 * Rejects with timeout error if promise doesn't resolve in time
 * 
 * @param promise - Promise to race
 * @param timeoutMs - Timeout in milliseconds
 * @returns Promise that resolves with original result or rejects with timeout
 */
export async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  const timeoutSignal = createTimeoutSignal(timeoutMs);
  
  return new Promise<T>((resolve, reject) => {
    // Set up timeout abort handler
    timeoutSignal.addEventListener('abort', () => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`));
    }, { once: true });
    
    // Handle promise resolution/rejection
    promise
      .then(resolve)
      .catch(reject);
  });
}
