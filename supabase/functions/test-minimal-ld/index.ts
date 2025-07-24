// Minimal test function to debug LaunchDarkly server integration

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

export default async function handler(req: Request): Promise<Response> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const sdkKey = Deno.env.get('LAUNCHDARKLY_SDK_KEY');
    
    if (req.method === 'GET') {
      // Health check endpoint
      const health = {
        status: 'healthy',
        initialized: true,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        sdkKeyPresent: !!sdkKey,
        sdkKeyPrefix: sdkKey ? sdkKey.substring(0, 8) + '...' : 'not set'
      };

      return new Response(JSON.stringify(health), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    if (req.method === 'POST') {
      const body = await req.json();
      
      // Simplified flag evaluation
      const knownFlags: Record<string, any> = {
        'wallet_ui': true,
        'profile_ui_revamp': false,
        'personalization_greeting': false,
        'sample-feature': false,
        'flight-search-advanced-filtering': false,
        'flight-search-price-optimization': false,
        'flight-search-max-offers': 10,
        'flight-search-mock-fallback': true
      };

      const flagKey = body.flagKey;
      const defaultValue = body.defaultValue || false;
      const value = flagKey in knownFlags ? knownFlags[flagKey] : defaultValue;

      const response = {
        value,
        flagKey,
        timestamp: new Date().toISOString(),
        source: 'simplified-server-implementation'
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
