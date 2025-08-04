import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { createDuffelClient, logDuffelOperation } from '../lib/duffel.ts'
import { evaluateFlag, createUserContext } from '../_shared/launchdarkly.ts'
import { checkAutoBookingFlags } from '../_shared/launchdarkly-guard.ts'

// Temporary inline rankOffers utility for edge function use
function rankOffers(offers: any[]): any[] {
  const WEIGHTS = { price: 0.6, duration: 0.25, stops: 0.15 };
  const NORMALIZE = { price: 1000, duration: 1440, stops: 5 };
  
  const calculateScore = (offer: any): number => {
    const price = parseFloat(offer.total_amount);
    const priceScore = (price / NORMALIZE.price) * WEIGHTS.price;
    
    // Calculate total duration
    const totalDuration = offer.slices?.reduce((total: number, slice: any) => {
      const duration = slice.duration ? parseInt(slice.duration.replace(/[^0-9]/g, '')) : 0;
      return total + duration;
    }, 0) || 0;
    
    const durationScore = (totalDuration / NORMALIZE.duration) * WEIGHTS.duration;
    
    // Calculate total stops
    const totalStops = offer.slices?.reduce((total: number, slice: any) => {
      return total + Math.max(0, (slice.segments?.length || 1) - 1);
    }, 0) || 0;
    
    const stopsScore = (totalStops / NORMALIZE.stops) * WEIGHTS.stops;
    
    return priceScore + durationScore + stopsScore;
  };
  
  return [...offers].sort((a, b) => calculateScore(a) - calculateScore(b));
}

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
    
    // Critical: Check LaunchDarkly flags before any processing
    const flagCheck = await checkAutoBookingFlags(req, 'duffel-search');
    if (!flagCheck.canProceed) {
      return flagCheck.response!;
    }
    
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

    // Step 1: Get trip request details and check feature flags
    console.log('🔍 Step 1: Fetching trip request details')
    const { data: tripRequest, error: tripError } = await supabaseClient
      .from('trip_requests')
      .select('*')
      .eq('id', tripRequestId)
      .single()

    if (tripError || !tripRequest) {
      throw new Error(`Trip request not found: ${tripError?.message}`)
    }

    // Auto-booking flags already checked at function entry

    // Check LaunchDarkly flags for enhanced search features
    const userContext = createUserContext(tripRequest.user_id, {
      trip_request_id: tripRequestId
    })

    const advancedFiltering = await evaluateFlag(
      'flight-search-advanced-filtering',
      userContext,
      false
    )

    const priceOptimization = await evaluateFlag(
      'flight-search-price-optimization',
      userContext,
      false
    )

    const maxOffersFlag = await evaluateFlag(
      'flight-search-max-offers',
      userContext,
      50
    )

    // Use flag-controlled max offers
    const effectiveMaxResults = Math.min(maxResults, maxOffersFlag.value)
    
    console.log('🔍 Feature flags:', {
      advancedFiltering: advancedFiltering.value,
      priceOptimization: priceOptimization.value,
      maxOffers: maxOffersFlag.value
    })

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

    // Step 4: Enhanced filtering and ranking with multi-criteria
    let filteredOffers = offers
    
    // Basic price filtering
    if (maxPrice) {
      filteredOffers = offers.filter(offer => {
        const price = parseFloat(offer.total_amount)
        return price <= maxPrice
      })
      console.log(`🔍 Filtered to ${filteredOffers.length} offers under $${maxPrice}`)
    }

    // Step 4.1: Multi-criteria ranking and scoring (Gap #3)
    console.log('🔍 Applying multi-criteria ranking...')
    
    const rankedOffers = filteredOffers.map(offer => {
      let score = 0
      const criteria = {
        price: 0,
        duration: 0,
        stops: 0,
        airline: 0
      }
      
      // Price score (40% weight) - lower price = higher score
      const price = parseFloat(offer.total_amount)
      const maxOfferPrice = Math.max(...filteredOffers.map(o => parseFloat(o.total_amount)))
      const minOfferPrice = Math.min(...filteredOffers.map(o => parseFloat(o.total_amount)))
      if (maxOfferPrice > minOfferPrice) {
        criteria.price = ((maxOfferPrice - price) / (maxOfferPrice - minOfferPrice)) * 40
      }
      
      // Duration score (30% weight) - shorter duration = higher score
      const totalDuration = offer.slices?.reduce((total, slice) => {
        // Parse ISO 8601 duration (PT2H30M -> 150 minutes)
        const duration = slice.duration || 'PT0M'
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
        const hours = parseInt(match?.[1] || '0')
        const minutes = parseInt(match?.[2] || '0')
        return total + (hours * 60) + minutes
      }, 0) || 0
      
      const maxDuration = Math.max(...filteredOffers.map(o => {
        return o.slices?.reduce((total, slice) => {
          const duration = slice.duration || 'PT0M'
          const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
          const hours = parseInt(match?.[1] || '0')
          const minutes = parseInt(match?.[2] || '0')
          return total + (hours * 60) + minutes
        }, 0) || 0
      }))
      
      if (maxDuration > 0) {
        criteria.duration = Math.max(0, (1 - (totalDuration / maxDuration)) * 30)
      }
      
      // Stops score (20% weight) - fewer stops = higher score
      const totalStops = offer.slices?.reduce((total, slice) => {
        return total + ((slice.segments?.length || 1) - 1)
      }, 0) || 0
      
      if (totalStops === 0) {
        criteria.stops = 20 // Direct flights get full points
      } else if (totalStops === 1) {
        criteria.stops = 15 // One stop gets most points
      } else if (totalStops === 2) {
        criteria.stops = 10 // Two stops get some points
      } else {
        criteria.stops = 0 // More than 2 stops get no points
      }
      
      // Airline preference score (10% weight) - major carriers preferred
      const preferredAirlines = ['AA', 'UA', 'DL', 'BA', 'LH', 'AF', 'KL']
      const airlineCode = offer.slices?.[0]?.segments?.[0]?.marketing_carrier?.iata_code
      if (airlineCode && preferredAirlines.includes(airlineCode)) {
        criteria.airline = 10
      } else {
        criteria.airline = 5 // Non-preferred airlines get half points
      }
      
      score = criteria.price + criteria.duration + criteria.stops + criteria.airline
      
      return {
        ...offer,
        ranking_score: score,
        ranking_criteria: criteria,
        total_duration_minutes: totalDuration,
        total_stops: totalStops,
        main_airline: airlineCode
      }
    })
    
    // Sort by ranking score (highest first)
    rankedOffers.sort((a, b) => b.ranking_score - a.ranking_score)
    
    console.log(`🔍 Top 3 ranked offers:`, rankedOffers.slice(0, 3).map(offer => ({
      price: offer.total_amount,
      score: offer.ranking_score.toFixed(1),
      duration: offer.total_duration_minutes + 'min',
      stops: offer.total_stops,
      airline: offer.main_airline
    })))
    
    // Use ranked offers for further processing
    filteredOffers = rankedOffers

    // Advanced filtering if enabled by feature flag
    if (advancedFiltering.value) {
      console.log('🔍 Applying advanced filtering...')
      
      // Filter by duration, stops, airline preference if available
      filteredOffers = filteredOffers.filter(offer => {
        // Calculate total duration for all slices
        const totalDuration = offer.slices?.reduce((total, slice) => {
          const sliceDuration = slice.duration ? parseInt(slice.duration.replace('PT', '').replace('H', '').replace('M', '')) : 0
          return total + sliceDuration
        }, 0) || 0
        
        // Skip offers with excessive duration (>24 hours total)
        if (totalDuration > 1440) return false
        
        // Prefer offers with reasonable layover times
        for (const slice of offer.slices || []) {
          for (let i = 0; i < (slice.segments?.length || 0) - 1; i++) {
            const segment = slice.segments![i]
            const nextSegment = slice.segments![i + 1]
            if (segment.arriving_at && nextSegment.departing_at) {
              const layoverMinutes = (new Date(nextSegment.departing_at).getTime() - new Date(segment.arriving_at).getTime()) / (1000 * 60)
              // Skip offers with layovers less than 30 minutes or more than 12 hours
              if (layoverMinutes < 30 || layoverMinutes > 720) return false
            }
          }
        }
        
        return true
      })
      
      console.log(`🔍 Advanced filtering reduced to ${filteredOffers.length} offers`)
    }

    // Use the new multi-criteria ranking utility
    filteredOffers = rankOffers(filteredOffers);

    // Limit results using flag-controlled max
    if (filteredOffers.length > effectiveMaxResults) {
      filteredOffers = filteredOffers.slice(0, effectiveMaxResults)
      console.log(`🔍 Limited to ${effectiveMaxResults} offers (flag-controlled)`)
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
        user_id: tripRequest.user_id, // Required for RLS
        mode: 'AUTO' as const,
        price_total: parseFloat(offer.total_amount),
        price_amount: parseFloat(offer.total_amount), // Duplicate for new schema
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
        offer_id: offer.id, // Unique offer identifier
        external_offer_id: offer.id, // External provider ID
        expires_at: offer.expires_at ? new Date(offer.expires_at).toISOString() : null,
        status: 'ACTIVE' as const,
        raw_offer_payload: offer as Record<string, unknown>
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
