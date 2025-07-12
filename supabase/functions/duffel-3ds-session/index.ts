import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ThreeDSSessionRequest {
  card_id: string;
  offer_id: string;
  cardholder_present: boolean;
  services?: Array<{ id: string; quantity: number }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { card_id, offer_id, cardholder_present, services = [] }: ThreeDSSessionRequest = await req.json()

    // Validate request
    if (!card_id || !offer_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: card_id, offer_id' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const duffelApiUrl = 'https://api.duffel.com/payments/three_d_secure_sessions'
    const duffelToken = Deno.env.get('DUFFEL_TEST_TOKEN') || Deno.env.get('DUFFEL_LIVE_TOKEN')

    if (!duffelToken) {
      throw new Error('Duffel API token not configured')
    }

    // Create 3D Secure session with Duffel
    const sessionData = {
      card_id,
      resource_id: offer_id,
      services,
      multi_use: false,
      cardholder_present
    }

    console.log('Creating 3DS session:', {
      card_id: card_id.substring(0, 10) + '...',
      offer_id,
      cardholder_present,
      services_count: services.length
    })

    const sessionResponse = await fetch(duffelApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${duffelToken}`,
        'Content-Type': 'application/json',
        'Duffel-Version': 'v2'
      },
      body: JSON.stringify({ data: sessionData })
    })

    if (!sessionResponse.ok) {
      const errorText = await sessionResponse.text()
      console.error('Duffel 3DS session creation failed:', errorText)
      
      // For development, return a mock session
      if (Deno.env.get('ENVIRONMENT') === 'development') {
        return new Response(
          JSON.stringify({ 
            session_id: '3ds_mock_' + Date.now(),
            status: 'ready_for_payment',
            client_id: 'mock_client_id',
            warning: 'Using mock 3DS session for development'
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      throw new Error(`3DS session creation failed: ${errorText}`)
    }

    const responseData = await sessionResponse.json()
    const sessionInfo = responseData.data

    // Log 3DS session creation for monitoring
    console.log('3DS session created:', {
      session_id: sessionInfo.id,
      status: sessionInfo.status,
      offer_id,
      timestamp: new Date().toISOString()
    })

    // Store 3DS session event for audit
    const { error: logError } = await supabase
      .from('payment_events')
      .insert({
        event_type: 'duffel_3ds_session_created',
        session_id: sessionInfo.id,
        card_id,
        offer_id,
        status: sessionInfo.status,
        cardholder_present,
        created_at: new Date().toISOString()
      })

    if (logError) {
      console.warn('Failed to log 3DS session creation event:', logError)
    }

    // Handle different 3DS statuses
    const response = {
      session_id: sessionInfo.id,
      status: sessionInfo.status,
      client_id: sessionInfo.client_id,
      expires_at: sessionInfo.expires_at
    }

    // Add additional info based on status
    if (sessionInfo.status === 'client_action_required') {
      response['challenge_required'] = true
      response['challenge_client_id'] = sessionInfo.client_id
    } else if (sessionInfo.status === 'ready_for_payment') {
      response['ready_for_payment'] = true
    } else if (sessionInfo.status === 'failed') {
      response['failure_reason'] = 'Authentication failed'
    }

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in duffel-3ds-session function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: '3D Secure session creation failed',
        details: error.message,
        // Provide mock data for development
        session_id: '3ds_mock_error_' + Date.now(),
        status: 'failed'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
