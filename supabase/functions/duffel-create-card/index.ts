import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CardCreationRequest {
  payment_method: {
    type: 'card';
    card: any;
    billing_details?: {
      name?: string;
      email?: string;
      address?: any;
    };
  };
  cardholder_name: string;
  cardholder_email?: string;
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

    // Require auth and derive user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { payment_method, cardholder_name, cardholder_email }: CardCreationRequest = await req.json()

    // Validate request
    if (!payment_method || !cardholder_name) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: payment_method, cardholder_name' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // In a real implementation, you would:
    // 1. Extract card details from the Stripe payment method
    // 2. Create a temporary card with Duffel's API
    // 3. Return the card ID for use in 3DS session creation

    // For now, we'll simulate the card creation process
    // In production, this would call Duffel's Cards API
    
    const duffelApiUrl = 'https://api.duffel.cards/payments/cards'
    const duffelToken = Deno.env.get('DUFFEL_TEST_TOKEN') || Deno.env.get('DUFFEL_LIVE_TOKEN')

    if (!duffelToken) {
      throw new Error('Duffel API token not configured')
    }

    // Mock card data for development - replace with actual Stripe card data extraction
    const mockCardData = {
      address_city: payment_method.billing_details?.address?.city || 'London',
      address_country_code: payment_method.billing_details?.address?.country || 'GB',
      address_line_1: payment_method.billing_details?.address?.line1 || '1 Test St',
      address_postal_code: payment_method.billing_details?.address?.postal_code || 'SW1A 1AA',
      address_region: payment_method.billing_details?.address?.state || 'London',
      expiry_month: '12', // Would extract from Stripe card element
      expiry_year: '25',  // Would extract from Stripe card element
      name: cardholder_name,
      number: '4242424242424242', // Would extract from Stripe card element
      cvc: '123', // Would extract from Stripe card element
      multi_use: false // Single use card for booking
    }

    // Create card with Duffel (Note: This is a mock implementation)
    // In production, you'd need to properly extract card details from Stripe
    const cardResponse = await fetch(duffelApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${duffelToken}`,
        'Content-Type': 'application/json',
        'Duffel-Version': 'v2'
      },
      body: JSON.stringify(mockCardData)
    })

    if (!cardResponse.ok) {
      const errorText = await cardResponse.text()
      console.error('Duffel card creation failed:', errorText)
      
      // Return a mock card ID for development
      // In production, this would be a real failure
      return new Response(
        JSON.stringify({ 
          card_id: 'tcd_mock_' + Date.now(),
          warning: 'Using mock card for development'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const cardData = await cardResponse.json()

    // Log card creation for monitoring
    console.log('Card created successfully:', {
      card_id: cardData.data?.id,
      cardholder: cardholder_name,
      timestamp: new Date().toISOString()
    })

    // Store card creation event for audit
    const { error: logError } = await supabase
      .from('payment_events')
      .insert({
        event_type: 'duffel_card_created',
        card_id: cardData.data?.id,
        cardholder_name,
        cardholder_email,
        user_id: user.id,
        created_at: new Date().toISOString()
      })

    if (logError) {
      console.warn('Failed to log card creation event:', logError)
    }

    return new Response(
      JSON.stringify({ 
        card_id: cardData.data?.id,
        last_4_digits: cardData.data?.last_4_digits,
        brand: cardData.data?.brand,
        unavailable_at: cardData.data?.unavailable_at
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in duffel-create-card function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Card creation failed',
        details: error.message,
        // Provide mock data for development
        card_id: 'tcd_mock_dev_' + Date.now()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
