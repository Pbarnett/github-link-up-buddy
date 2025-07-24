// supabase/functions/_shared/launchdarkly.ts
/**
 * Shared LaunchDarkly server-side utilities for Supabase Edge Functions
 */

// LaunchDarkly context interface for Deno Edge Runtime
interface LDContext {
  key: string;
  kind: string;
  [key: string]: any;
}

export interface LaunchDarklyRequest {
  context: LDContext;
  flagKey: string;
  defaultValue?: any;
  includeReason?: boolean;
}

export interface LaunchDarklyResponse {
  value: any;
  variationIndex?: number;
  reason?: any;
  flagKey: string;
  timestamp: string;
}

/**
 * Call the LaunchDarkly server function for flag evaluation
 */
export async function evaluateFlag(
  flagKey: string,
  context: LDContext,
  defaultValue: any = false,
  includeReason: boolean = false
): Promise<LaunchDarklyResponse> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  
  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL environment variable is required');
  }

  const request: LaunchDarklyRequest = {
    context,
    flagKey,
    defaultValue,
    includeReason
  };

  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/launchdarkly-server`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('LaunchDarkly server function error:', errorText);
      
      // Return fallback response on error
      return {
        value: defaultValue,
        flagKey,
        timestamp: new Date().toISOString()
      };
    }

    return await response.json();
  } catch (error) {
    console.error('LaunchDarkly evaluation failed:', error);
    
    // Return fallback response on network error
    return {
      value: defaultValue,
      flagKey,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Create a user context for flag evaluation
 */
export function createUserContext(
  userId: string,
  attributes: Record<string, any> = {}
): LDContext {
  return {
    kind: 'user',
    key: userId,
    ...attributes
  };
}

/**
 * Create an organization context for flag evaluation
 */
export function createOrgContext(
  orgId: string,
  attributes: Record<string, any> = {}
): LDContext {
  return {
    kind: 'organization',
    key: orgId,
    ...attributes
  };
}

/**
 * Create a device context for flag evaluation
 */
export function createDeviceContext(
  deviceId: string,
  attributes: Record<string, any> = {}
): LDContext {
  return {
    kind: 'device',
    key: deviceId,
    ...attributes
  };
}

/**
 * Create a multi-context for complex targeting
 */
export function createMultiContext(contexts: LDContext[]): LDContext {
  const multiContext: any = {
    kind: 'multi'
  };

  for (const context of contexts) {
    if (!context.kind || context.kind === 'multi') {
      throw new Error('Invalid context kind for multi-context');
    }
    multiContext[context.kind] = context;
  }

  return multiContext as LDContext;
}

/**
 * Validate context format
 */
export function validateContext(context: any): context is LDContext {
  if (!context || typeof context !== 'object') {
    return false;
  }

  // For multi-context
  if (context.kind === 'multi') {
    // Must have at least one sub-context
    const keys = Object.keys(context).filter(key => key !== 'kind');
    if (keys.length === 0) {
      return false;
    }

    // Each sub-context must be valid
    for (const key of keys) {
      const subContext = context[key];
      if (!validateContext(subContext)) {
        return false;
      }
    }
    return true;
  }

  // For single context
  return typeof context.kind === 'string' && 
         typeof context.key === 'string' && 
         context.kind !== 'multi';
}

/**
 * Extract user ID from various context formats
 */
export function extractUserId(context: LDContext): string | null {
  if (context.kind === 'multi') {
    // Look for user context in multi-context
    const userContext = (context as any).user;
    return userContext?.key || null;
  }

  if (context.kind === 'user') {
    return context.key;
  }

  return null;
}

/**
 * Health check for LaunchDarkly server function
 */
export async function healthCheck(): Promise<boolean> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  
  if (!supabaseUrl) {
    return false;
  }

  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/launchdarkly-server`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
      }
    });

    if (!response.ok) {
      return false;
    }

    const health = await response.json();
    return health.status === 'healthy' && health.initialized === true;
  } catch (error) {
    console.error('LaunchDarkly health check failed:', error);
    return false;
  }
}
