/**
 * LaunchDarkly Flag Guard Helper
 * 
 * Provides server-side flag checking for auto-booking pipeline functions.
 * Implements consistent flag enforcement for requirements #4, #5, and #50.
 */

export interface LaunchDarklyFlagResponse {
  enabled: boolean;
  reason?: string;
}

export interface LaunchDarklyGuardResult {
  canProceed: boolean;
  response?: Response;
  flags: {
    auto_booking_pipeline_enabled: boolean;
    auto_booking_emergency_disable: boolean;
  };
}

/**
 * Check LaunchDarkly flags for auto-booking pipeline
 * Returns early Response if flags prevent proceeding
 */
export async function checkAutoBookingFlags(
  request: Request,
  functionName: string
): Promise<LaunchDarklyGuardResult> {
  try {
    // Get LaunchDarkly SDK key from environment
    const ldSdkKey = Deno.env.get('LAUNCHDARKLY_SERVER_SDK_KEY');
    if (!ldSdkKey) {
      console.error(`[${functionName}] LaunchDarkly SDK key not configured`);
      return {
        canProceed: false,
        response: new Response('Service temporarily unavailable', { status: 503 }),
        flags: {
          auto_booking_pipeline_enabled: false,
          auto_booking_emergency_disable: true
        }
      };
    }

    // Extract user context for flag evaluation
    const authHeader = request.headers.get('Authorization');
    const userContext = {
      key: 'anonymous',
      anonymous: true
    };

    if (authHeader?.startsWith('Bearer ')) {
      try {
        // Extract user ID from JWT token if available
        const token = authHeader.substring(7);
        const payload = JSON.parse(atob(token.split('.')[1]));
        userContext.key = payload.sub || 'anonymous';
        userContext.anonymous = !payload.sub;
      } catch (err) {
        console.warn(`[${functionName}] Failed to parse auth token for LD context:`, err);
      }
    }

    // Check both required flags via LaunchDarkly REST API
    const [pipelineFlag, emergencyFlag] = await Promise.all([
      checkLaunchDarklyFlag(ldSdkKey, 'auto_booking_pipeline_enabled', userContext),
      checkLaunchDarklyFlag(ldSdkKey, 'auto_booking_emergency_disable', userContext)
    ]);

    console.log(`[${functionName}] Flag check results:`, {
      auto_booking_pipeline_enabled: pipelineFlag.enabled,
      auto_booking_emergency_disable: emergencyFlag.enabled,
      user: userContext.key
    });

    // Emergency disable flag takes precedence (if enabled, disable everything)
    if (emergencyFlag.enabled) {
      console.warn(`[${functionName}] Emergency disable flag is ON - blocking all auto-booking operations`);
      return {
        canProceed: false,
        response: new Response(
          JSON.stringify({
            error: 'Auto-booking temporarily disabled for maintenance',
            code: 'EMERGENCY_DISABLE',
            function: functionName
          }),
          { 
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        ),
        flags: {
          auto_booking_pipeline_enabled: pipelineFlag.enabled,
          auto_booking_emergency_disable: emergencyFlag.enabled
        }
      };
    }

    // Check main pipeline flag
    if (!pipelineFlag.enabled) {
      console.log(`[${functionName}] Auto-booking pipeline disabled by feature flag`);
      return {
        canProceed: false,
        response: new Response(
          JSON.stringify({
            error: 'Auto-booking feature not available',
            code: 'FEATURE_DISABLED',
            function: functionName
          }),
          { 
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        ),
        flags: {
          auto_booking_pipeline_enabled: pipelineFlag.enabled,
          auto_booking_emergency_disable: emergencyFlag.enabled
        }
      };
    }

    // Both flags are in correct state - allow proceeding
    return {
      canProceed: true,
      flags: {
        auto_booking_pipeline_enabled: pipelineFlag.enabled,
        auto_booking_emergency_disable: emergencyFlag.enabled
      }
    };

  } catch (error) {
    console.error(`[${functionName}] Flag check failed:`, error);
    
    // Fail-safe: if flag checking fails, disable the feature
    return {
      canProceed: false,
      response: new Response(
        JSON.stringify({
          error: 'Service temporarily unavailable',
          code: 'FLAG_CHECK_FAILED',
          function: functionName
        }),
        { 
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      ),
      flags: {
        auto_booking_pipeline_enabled: false,
        auto_booking_emergency_disable: true
      }
    };
  }
}

/**
 * Check individual LaunchDarkly flag via REST API
 */
async function checkLaunchDarklyFlag(
  sdkKey: string,
  flagKey: string,
  userContext: any
): Promise<LaunchDarklyFlagResponse> {
  try {
    const response = await fetch(`https://app.launchdarkly.com/api/v2/flags/default/${flagKey}/evaluate`, {
      method: 'POST',
      headers: {
        'Authorization': `api-key ${sdkKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userContext)
    });

    if (!response.ok) {
      console.error(`LaunchDarkly API error for flag ${flagKey}:`, response.status, response.statusText);
      
      // Default fallback values
      const fallbackValues = {
        'auto_booking_pipeline_enabled': false, // Disable by default
        'auto_booking_emergency_disable': true  // Emergency disable by default
      };
      
      return {
        enabled: fallbackValues[flagKey as keyof typeof fallbackValues] ?? false,
        reason: `API_ERROR_${response.status}`
      };
    }

    const result = await response.json();
    return {
      enabled: result.value === true,
      reason: result.reason?.kind || 'EVALUATED'
    };

  } catch (error) {
    console.error(`Error checking LaunchDarkly flag ${flagKey}:`, error);
    
    // Safe defaults if API call fails
    const fallbackValues = {
      'auto_booking_pipeline_enabled': false, // Disable by default
      'auto_booking_emergency_disable': true  // Emergency disable by default
    };
    
    return {
      enabled: fallbackValues[flagKey as keyof typeof fallbackValues] ?? false,
      reason: 'NETWORK_ERROR'
    };
  }
}
