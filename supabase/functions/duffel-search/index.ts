import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { createDuffelClient, logDuffelOperation } from '../lib/duffel.ts'

interface DuffelSearchRequest {
  tripRequestId: string
  maxPrice?: number
  cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first'
  maxResults?: number
}

interface DuffelSearchResponse {
  success: boolean
  inserted: number
  offersFound: number
  message: string
  error?: {
    message: string
    phase: string
    timestamp: string
  }
}

console.log('Starting Duffel Search Function...')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('🔍 Phase 2: Duffel flight search initiated')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ 
        success: false,
        error: { message: 'Method not allowed', phase: 'Request validation', timestamp: new Date().toISOString() }
      }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const payload: DuffelSearchRequest = await req.json()
    console.log('🔍 Search payload:', JSON.stringify(payload, null, 2))
    
    const { tripRequestId, maxPrice, cabinClass = 'economy', maxResults = 50 } = payload

    if (!tripRequestId) {
      return new Response(JSON.stringify({
        success: false,
        error: { 
          message: 'tripRequestId is required',
          phase: 'Request validation',
          timestamp: new Date().toISOString()
        }
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Step 1: Get trip request details
    console.log('🔍 Step 1: Fetching trip request details')
    const { data: tripRequest, error: tripError } = await supabaseClient
      .from('trip_requests')
      .select('*')
      .eq('id', tripRequestId)
      .single()

    if (tripError || !tripRequest) {
      throw new Error(`Trip request not found: ${tripError?.message}`)
    }

    console.log('🔍 Trip request details:', {
      origin: tripRequest.departure_airports?.[0] || 'No origin',
      destination: tripRequest.destination_location_code,
      departureDate: tripRequest.departure_date,
      returnDate: tripRequest.return_date,
      isRoundTrip: !!tripRequest.return_date
    })

    // Step 2: Create Duffel client and search for flights
    console.log('🔍 Step 2: Creating Duffel offer request')
    const duffel = createDuffelClient()

    // Build the offer request
    const offerRequest = {
      cabin_class: cabinClass,
      passengers: [{ type: 'adult' as const }],
      slices: [
        {
          origin: tripRequest.departure_airports?.[0] || 'JFK',
          destination: tripRequest.destination_location_code || 'LAX',
          departure_date: tripRequest.departure_date || '2025-07-15'
        }
      ]
    }

    // Add return slice for round-trip
    if (tripRequest.return_date) {
      offerRequest.slices.push({
        origin: tripRequest.destination_location_code || 'LAX',
        destination: tripRequest.departure_airports?.[0] || 'JFK',
        departure_date: tripRequest.return_date
      })
    }

    logDuffelOperation('Creating offer request', offerRequest)

    // Create offer request with Duffel
    const createdOfferRequest = await duffel.createOfferRequest(offerRequest)
    
    logDuffelOperation('Offer request created', {
      id: createdOfferRequest.id,
      passengers: createdOfferRequest.passengers.length,
      slices: createdOfferRequest.slices.length
    })

    // Step 3: Get offers from the request
    console.log('🔍 Step 3: Fetching offers from Duffel')
    const offers = await duffel.getOffers(createdOfferRequest.id)
    
    console.log(`🔍 Retrieved ${offers.length} offers from Duffel`)

    // Step 4: Filter offers by price if specified
    let filteredOffers = offers
    if (maxPrice) {
      filteredOffers = offers.filter(offer => {
        const price = parseFloat(offer.total_amount)
        return price <= maxPrice
      })
      console.log(`🔍 Filtered to ${filteredOffers.length} offers under $${maxPrice}`)
    }

    // Limit results
    if (filteredOffers.length > maxResults) {
      filteredOffers = filteredOffers.slice(0, maxResults)
      console.log(`🔍 Limited to ${maxResults} offers`)
    }

    if (filteredOffers.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        inserted: 0,
        offersFound: offers.length,
        message: `Found ${offers.length} offers but none matched your criteria`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    // Step 5: Transform Duffel offers to your database schema
    console.log('🔍 Step 4: Transforming offers for database')
    const dbOffers = filteredOffers.map(offer => {
      // Determine if it's nonstop (all segments have 0 stops)
      const isNonstop = offer.slices?.every(slice => 
        slice.segments?.every(segment => segment.stops === 0)
      ) || false

      // Get first slice details for primary route info
      const firstSlice = offer.slices?.[0]
      const firstSegment = firstSlice?.segments?.[0]
      const lastSegment = firstSlice?.segments?.[firstSlice.segments.length - 1]

      // Calculate return date from second slice if exists
      let returnDt = null
      if (offer.slices && offer.slices.length > 1) {
        const returnSlice = offer.slices[1]
        const returnFirstSegment = returnSlice?.segments?.[0]
        if (returnFirstSegment?.departing_at) {
          returnDt = new Date(returnFirstSegment.departing_at).toISOString()
        }
      }

      return {
        trip_request_id: tripRequestId,
        mode: 'AUTO' as const,
        price_total: parseFloat(offer.total_amount),
        price_currency: offer.total_currency,
        price_carry_on: null, // Duffel doesn't separate carry-on pricing
        bags_included: false, // Would need to check service offerings
        cabin_class: cabinClass.toUpperCase(),
        nonstop: isNonstop,
        origin_iata: firstSegment?.origin?.iata_code || tripRequest.departure_airports?.[0] || 'JFK',
        destination_iata: lastSegment?.destination?.iata_code || tripRequest.destination_location_code || 'LAX',
        depart_dt: firstSegment?.departing_at ? new Date(firstSegment.departing_at).toISOString() : new Date().toISOString(),
        return_dt: returnDt,
        booking_url: null, // Would need to create booking URL
        external_offer_id: offer.id,
        raw_offer_payload: offer as Record<string, any>
      }
    })

    console.log('🔍 Sample transformed offer:', JSON.stringify(dbOffers[0], null, 2))

    // Step 6: Insert offers into database
    console.log('🔍 Step 5: Inserting offers into flight_offers_v2 table')
    const { data: insertedOffers, error: insertError } = await supabaseClient
      .from('flight_offers_v2')
      .insert(dbOffers)
      .select()

    if (insertError) {
      console.error('🔍 Database insertion error:', insertError)
      throw new Error(`Failed to insert offers: ${insertError.message}`)
    }

    const insertedCount = insertedOffers?.length || 0
    console.log(`🔍 Successfully inserted ${insertedCount} offers`)

    logDuffelOperation('Flight search completed', {
      tripRequestId,
      offersFound: offers.length,
      filteredOffers: filteredOffers.length,
      inserted: insertedCount,
      maxPrice,
      cabinClass
    })

    // Success response
    const result: DuffelSearchResponse = {
      success: true,
      inserted: insertedCount,
      offersFound: offers.length,
      message: `Successfully found and inserted ${insertedCount} flight offers from Duffel`
    }

    console.log('✅ Duffel search completed successfully')
    
    return new Response(
      JSON.stringify(result, null, 2),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('❌ Duffel search failed:', error)
    
    const errorResult: DuffelSearchResponse = {
      success: false,
      inserted: 0,
      offersFound: 0,
      message: 'Duffel flight search failed',
      error: {
        message: error.message,
        phase: 'Flight search execution',
        timestamp: new Date().toISOString()
      }
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
