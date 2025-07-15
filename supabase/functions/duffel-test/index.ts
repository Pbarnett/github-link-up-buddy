import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createDuffelClient, logDuffelOperation } from '../lib/duffel.ts'

console.log('Starting Duffel Test Function...')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('🧪 Phase 1, Step 1.1: Testing Duffel API connectivity')
    
    // Create Duffel client
    const duffel = createDuffelClient()
    logDuffelOperation('Client created', { timestamp: new Date().toISOString() })

    // Test 1: Basic connectivity
    console.log('Test 1: Testing basic API connectivity...')
    const connectionTest = await duffel.testConnection()
    
    if (!connectionTest) {
      throw new Error('Failed to connect to Duffel API')
    }

    // Test 2: Create a simple offer request
    console.log('Test 2: Creating offer request...')
    const offerRequest = await duffel.createOfferRequest({
      cabin_class: 'economy',
      passengers: [{ type: 'adult' }],
      slices: [{
        origin: 'LHR', // London Heathrow
        destination: 'JFK', // New York JFK
        departure_date: '2025-07-15' // Future date
      }]
    })

    logDuffelOperation('Offer request created', {
      id: offerRequest.id,
      passengers: offerRequest.passengers.length,
      slices: offerRequest.slices.length
    })

    // Test 3: Get offers from the request
    console.log('Test 3: Getting offers...')
    const offers = await duffel.getOffers(offerRequest.id)
    
    logDuffelOperation('Offers retrieved', {
      count: offers.length,
      sampleOffer: offers[0] ? {
        id: offers[0].id,
        total_amount: offers[0].total_amount,
        total_currency: offers[0].total_currency,
        expires_at: offers[0].expires_at
      } : null
    })

    // Test 4: Check offer expiration logic
    console.log('Test 4: Testing offer expiration logic...')
    const expirationTests = offers.slice(0, 3).map(offer => {
      const validation = duffel.validateOfferExpiration(offer)
      return {
        offer_id: offer.id,
        expires_at: offer.expires_at,
        valid: validation.valid,
        time_left_minutes: validation.timeLeftMinutes
      }
    })

    logDuffelOperation('Expiration validation', expirationTests)

    // Success response
    const result = {
      success: true,
      phase: 'Phase 1, Step 1.1',
      tests: {
        connectivity: connectionTest,
        offer_request: {
          id: offerRequest.id,
          created: true
        },
        offers: {
          count: offers.length,
          first_offer: offers[0] ? {
            id: offers[0].id,
            amount: offers[0].total_amount,
            currency: offers[0].total_currency
          } : null
        },
        expiration_logic: {
          tested_offers: expirationTests.length,
          all_valid: expirationTests.every(t => t.valid)
        }
      },
      timestamp: new Date().toISOString(),
      next_steps: [
        'Phase 1, Step 1.2: Test offer expiration scenarios',
        'Phase 1, Step 1.3: Set up basic database schema',
        'Phase 2: Manual order creation'
      ]
    }

    console.log('✅ All Phase 1, Step 1.1 tests passed!')
    
    return new Response(
      JSON.stringify(result, null, 2),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('❌ Duffel test failed:', error)
    
    const errorResult = {
      success: false,
      phase: 'Phase 1, Step 1.1',
      error: {
        message: error.message,
        type: error.constructor.name,
        timestamp: new Date().toISOString()
      },
      troubleshooting: [
        'Check DUFFEL_API_TOKEN_TEST environment variable',
        'Verify API token is valid in Duffel dashboard',
        'Check network connectivity',
        'Review Duffel API documentation'
      ]
    }

    return new Response(
      JSON.stringify(errorResult, null, 2),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
