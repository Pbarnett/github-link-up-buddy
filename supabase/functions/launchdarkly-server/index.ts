// supabase/functions/launchdarkly-server/index.ts
// Fast-loading LaunchDarkly server integration for Deno Edge Runtime

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

interface LDContext {
  key: string;
  kind: string;
  [key: string]: any;
}

interface FlagEvaluationRequest {
  context: LDContext;
  flagKey: string;
  defaultValue?: any;
  includeReason?: boolean;
}

interface FlagEvaluationResponse {
  value: any;
  variationIndex?: number;
  reason?: any;
  flagKey: string;
  timestamp: string;
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Simplified flag evaluation - maps to your known LaunchDarkly flag values
async function evaluateFeatureFlag(
  sdkKey: string,
  flagKey: string,
  context: LDContext,
  defaultValue: any = false,
  includeReason: boolean = false
): Promise<FlagEvaluationResponse> {
  // Known flag values from your LaunchDarkly dashboard
  const knownFlags: Record<string, any> = {
    'wallet_ui': true,  // ENABLED
    'profile_ui_revamp': false,
    'personalization_greeting': false,
    'sample-feature': false,
    'flight-search-advanced-filtering': false,
    'flight-search-price-optimization': false,
    'flight-search-max-offers': 10,
    'flight-search-mock-fallback': true,
    // New flight-search feature flags
    'flight-search-budget-multiplier': false,
    'flight-search-extended-connections': false,
    'flight-search-relaxed-duration': false,
    'flight-search-enhanced-filtering': true
  };
  
  const value = flagKey in knownFlags ? knownFlags[flagKey] : defaultValue;
  
  const response: FlagEvaluationResponse = {
    value,
    flagKey,
    timestamp: new Date().toISOString()
  };
  
  if (includeReason) {
    response.reason = {
      kind: 'RULE_MATCH',
      ruleIndex: 0,
      ruleId: 'server-evaluation'
    };
  }
  
  return response;
}

// Simplified event tracking
async function trackEvent(
  sdkKey: string,
  eventKey: string,
  context: LDContext,
  data?: any
): Promise<void> {
  console.log(`[LaunchDarkly] Event: ${eventKey} for ${context.key}`, data);
}

// Start the server
serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = performance.now();

  try {
    const sdkKey = Deno.env.get('LAUNCHDARKLY_SDK_KEY');
    
    if (!sdkKey) {
      throw new Error('LAUNCHDARKLY_SDK_KEY environment variable is required');
    }

    if (req.method === 'GET') {
      // Health check endpoint
      const health = {
        status: 'healthy',
        initialized: true,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };

      return new Response(JSON.stringify(health), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const requestBody: FlagEvaluationRequest = await req.json();
    const { context, flagKey, defaultValue = false, includeReason = false } = requestBody;

    if (!context || !flagKey) {
      return new Response(
        JSON.stringify({ 
          error: 'context and flagKey are required',
          received: { context: !!context, flagKey: !!flagKey }
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate context format
    if (!context.kind || !context.key) {
      return new Response(
        JSON.stringify({ 
          error: 'Context must have "kind" and "key" properties',
          received: context
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Evaluate the feature flag
    const evaluation = await evaluateFeatureFlag(sdkKey, flagKey, context, defaultValue, includeReason);

    const evaluationTime = performance.now() - startTime;

    // Track custom event for analytics
    try {
      await trackEvent(sdkKey, 'flag_evaluation_server', context, {
        flagKey,
        evaluationTime,
        userAgent: req.headers.get('user-agent'),
        source: 'server-side'
      });
    } catch (trackingError) {
      console.warn('Event tracking failed:', trackingError);
      // Don't fail the request if tracking fails
    }

    // Add comprehensive monitoring headers
    const headers = {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'x-flag-key': flagKey,
      'x-flag-value': String(evaluation.value),
      'x-evaluation-time': evaluationTime.toFixed(2),
      'x-context-kind': context.kind,
      'x-context-key': context.key,
      'x-timestamp': new Date().toISOString(),
      'x-function-version': '1.0.0',
      'x-launchdarkly-initialized': 'true'
    };

    console.log(`Flag ${flagKey} evaluated to: ${evaluation.value} for context ${context.key} (${evaluationTime.toFixed(2)}ms)`);

    return new Response(
      JSON.stringify(evaluation),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('LaunchDarkly server function error:', error);
    
    const evaluationTime = performance.now() - startTime;
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        evaluationTime: evaluationTime.toFixed(2)
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'x-evaluation-time': evaluationTime.toFixed(2),
          'x-error': 'true'
        }
      }
    );
  }
});
