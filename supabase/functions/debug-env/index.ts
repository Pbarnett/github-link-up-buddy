import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Check all environment variables
    const envVars = {
      DUFFEL_API_TOKEN_TEST: Deno.env.get('DUFFEL_API_TOKEN_TEST'),
      DUFFEL_WEBHOOK_SECRET: Deno.env.get('DUFFEL_WEBHOOK_SECRET'),
      DUFFEL_LIVE: Deno.env.get('DUFFEL_LIVE'),
      SUPABASE_URL: Deno.env.get('SUPABASE_URL'),
      SUPABASE_ANON_KEY: Deno.env.get('SUPABASE_ANON_KEY'),
      SUPABASE_SERVICE_ROLE_KEY: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    }

    // Mask sensitive values for logging
    const maskedVars = Object.fromEntries(
      Object.entries(envVars).map(([key, value]) => [
        key, 
        value ? `${value.substring(0, 10)}...` : 'undefined'
      ])
    )

    console.log('Environment variables check:', maskedVars)

    return new Response(
      JSON.stringify({
        success: true,
        environment_variables: maskedVars,
        available_count: Object.values(envVars).filter(v => v).length,
        missing_count: Object.values(envVars).filter(v => !v).length
      }, null, 2),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Debug env error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          message: error.message,
          type: error.constructor.name
        }
      }, null, 2),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
