/**
 * Auto-Book Monitor Edge Function
 * 
 * Processes pending auto-booking requests and triggers bookings when conditions are met.
 * Called by pg_cron every 10 minutes to check for booking opportunities.
 * 
 * Features:
 * - LaunchDarkly feature flag gating
 * - Redis distributed locking to prevent double processing
 * - Per-offer locking for thread safety
 * - Stripe payment hold management
 * - Structured logging and error handling
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { evaluateFlag, createUserContext } from '../_shared/launchdarkly.ts'
import { checkAutoBookingFlags } from '../_shared/launchdarkly-guard.ts'
import { acquireMonitorLock, acquireOfferLock, RedisLockManager } from '../lib/redis-lock.ts'
import { createDuffelClient } from '../lib/duffel.ts'
import { withSpan } from '../_shared/otel.ts'
import { logger } from '../_shared/logger.ts'

interface MonitorRequest {
  action?: 'monitor' | 'health-check'
  maxOffers?: number
  dryRun?: boolean
}

interface PendingTripRequest {
  id: string
  user_id: string
  auto_book_enabled: boolean
  max_price: number | null
  currency: string
  departure_date: string
  return_date: string | null
  departure_airports: string[]
  destination_location_code: string
  selected_offer_id: string | null
  created_at: string
  last_checked_at: string | null
}

interface FlightOffer {
  id: string
  trip_request_id: string
  external_offer_id: string
  price_total: number
  price_currency: string
  expires_at: string | null
  raw_offer_payload: any
  created_at: string
}

console.log('[AutoBookMonitor] Function initialized')

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Critical: Check LaunchDarkly flags before any processing
  const flagCheck = await checkAutoBookingFlags(req, 'auto-book-monitor');
  if (!flagCheck.canProceed) {
    return flagCheck.response!;
  }

  return withSpan(
    'auto_book_monitor.run',
    async (span) => {
      const startTime = Date.now()
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      let lockManager: RedisLockManager | null = null

      try {
        // Parse request body
        const body = req.method === 'POST' ? await req.json() : {}
        const { action = 'monitor', maxOffers = 50, dryRun = false }: MonitorRequest = body

        span.attributes['monitor.action'] = action;
        span.attributes['monitor.max_offers'] = maxOffers;
        span.attributes['monitor.dry_run'] = dryRun;

        if (action === 'health-check') {
          return new Response(JSON.stringify({
            status: 'healthy',
            service: 'auto-book-monitor',
            timestamp: new Date().toISOString()
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

    console.log(`[AutoBookMonitor] Starting monitor cycle - maxOffers: ${maxOffers}, dryRun: ${dryRun}`)

    // Auto-booking flags already checked at function entry

    // Step 2: Acquire global monitor lock to prevent concurrent executions
    console.log('[AutoBookMonitor] Acquiring global monitor lock...')
    const monitorLock = await acquireMonitorLock(600) // 10 minute TTL

    if (!monitorLock.acquired) {
      console.log('[AutoBookMonitor] Another monitor instance is already running')
      return new Response(JSON.stringify({
        success: true,
        message: 'Monitor already running',
        processed: 0,
        skipped: 'monitor_lock_busy'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    lockManager = new RedisLockManager()
    
    try {
      // Step 3: Query pending auto-booking requests
      console.log('[AutoBookMonitor] Querying pending auto-booking requests...')
      
      const { data: pendingRequests, error: queryError } = await supabaseClient
        .from('trip_requests')
        .select(`
          id,
          user_id,
          auto_book_enabled,
          max_price,
          currency,
          departure_date,
          return_date,
          departure_airports,
          destination_location_code,
          selected_offer_id,
          created_at,
          last_checked_at
        `)
        .eq('auto_book_enabled', true)
        .in('auto_book_status', ['PENDING'])
        .not('departure_date', 'lt', new Date().toISOString().split('T')[0]) // Not past departure
        .limit(maxOffers)

      if (queryError) {
        throw new Error(`Failed to query pending requests: ${queryError.message}`)
      }

      console.log(`[AutoBookMonitor] Found ${pendingRequests?.length || 0} pending auto-booking requests`)

      if (!pendingRequests || pendingRequests.length === 0) {
        return new Response(JSON.stringify({
          success: true,
          message: 'No pending auto-booking requests found',
          processed: 0
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Step 4: Process each pending request
      const results = {
        processed: 0,
        skipped: 0,
        errors: 0,
        bookings_triggered: 0
      }

      for (const tripRequest of pendingRequests as PendingTripRequest[]) {
        try {
          console.log(`[AutoBookMonitor] Processing trip request: ${tripRequest.id}`)

          // Auto-booking flags already checked at function entry (applies to all users)

          // Acquire per-trip lock to prevent concurrent processing
          const tripLockKey = `trip:${tripRequest.id}`
          const tripLock = await acquireOfferLock(tripLockKey, 300)

          if (!tripLock.acquired) {
            console.log(`[AutoBookMonitor] Trip ${tripRequest.id} is already being processed`)
            results.skipped++
            continue
          }

          try {
            // Process the trip request
            const processResult = await processTripRequest(supabaseClient, tripRequest, dryRun)
            
            if (processResult.booking_triggered) {
              results.bookings_triggered++
            }
            
            results.processed++

          } finally {
            // Release trip lock
            if (tripLock.lockId) {
              await lockManager!.releaseLock(`locks:auto_book:${tripLockKey}`, tripLock.lockId)
            }
          }

        } catch (error) {
          console.error(`[AutoBookMonitor] Error processing trip ${tripRequest.id}:`, error)
          results.errors++
          
          // Continue processing other requests even if one fails
          continue
        }
      }

        const duration = Date.now() - startTime
        
        span.attributes['monitor.duration_ms'] = duration;
        span.attributes['monitor.processed'] = results.processed;
        span.attributes['monitor.skipped'] = results.skipped;
        span.attributes['monitor.errors'] = results.errors;
        span.attributes['monitor.bookings_triggered'] = results.bookings_triggered;
        
        logger.info('Auto-book monitor cycle completed', {
          operation: 'auto_book_monitor_completed',
          durationMs: duration,
          ...results
        });

        return new Response(JSON.stringify({
          success: true,
          duration_ms: duration,
          ...results
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      } finally {
        // Release global monitor lock
        if (monitorLock.lockId) {
          await lockManager!.releaseLock('locks:auto_book_monitor', monitorLock.lockId)
        }
      }

    } catch (error) {
      console.error('[AutoBookMonitor] Fatal error:', error)
      
      return new Response(JSON.stringify({
        success: false,
        error: {
          message: error.message,
          timestamp: new Date().toISOString()
        }
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    },
    {
      'service.name': 'auto-book-monitor',
      'function.name': 'auto-book-monitor'
    }
  );
})

/**
 * Process a single trip request for auto-booking opportunities
 */
async function processTripRequest(
  supabaseClient: any,
  tripRequest: PendingTripRequest,
  dryRun: boolean
): Promise<{ booking_triggered: boolean }> {
  console.log(`[ProcessTrip] Processing ${tripRequest.id} - Budget: ${tripRequest.max_price} ${tripRequest.currency}`)

  // Step 1: Check if we have a selected offer
  let selectedOffer: FlightOffer | null = null

  if (tripRequest.selected_offer_id) {
    const { data: offer, error: offerError } = await supabaseClient
      .from('flight_offers_v2')
      .select('*')
      .eq('id', tripRequest.selected_offer_id)
      .single()

    if (!offerError && offer) {
      selectedOffer = offer
      console.log(`[ProcessTrip] Found selected offer: ${offer.external_offer_id} - $${offer.price_total}`)
    }
  }

  // Step 2: If no selected offer or it's expired, search for new offers
  if (!selectedOffer || isOfferExpired(selectedOffer)) {
    console.log(`[ProcessTrip] Searching for new offers for trip ${tripRequest.id}`)
    
    // Trigger fresh search via duffel-search function
    const searchResult = await triggerFlightSearch(supabaseClient, tripRequest)
    
    if (!searchResult.success) {
      throw new Error(`Flight search failed: ${searchResult.message}`)
    }

    // Get the best offer from the search results
    const { data: newOffers, error: offersError } = await supabaseClient
      .from('flight_offers_v2')
      .select('*')
      .eq('trip_request_id', tripRequest.id)
      .order('price_total', { ascending: true })
      .limit(1)

    if (offersError || !newOffers || newOffers.length === 0) {
      console.log(`[ProcessTrip] No suitable offers found for trip ${tripRequest.id}`)
      
      // Update last_checked_at
      await supabaseClient
        .from('trip_requests')
        .update({ last_checked_at: new Date().toISOString() })
        .eq('id', tripRequest.id)

      return { booking_triggered: false }
    }

    selectedOffer = newOffers[0]
    
    // Update the selected offer in trip_requests
    await supabaseClient
      .from('trip_requests')
      .update({ 
        selected_offer_id: selectedOffer.id,
        last_checked_at: new Date().toISOString()
      })
      .eq('id', tripRequest.id)
  }

  // Step 3: Check if offer meets booking criteria
  const offerPrice = selectedOffer.price_total
  const maxPrice = tripRequest.max_price

  if (maxPrice && offerPrice > maxPrice) {
    console.log(`[ProcessTrip] Offer price $${offerPrice} exceeds max price $${maxPrice}`)
    return { booking_triggered: false }
  }

  // Step 4: Trigger booking if criteria are met
  console.log(`[ProcessTrip] Offer meets criteria - triggering booking for ${tripRequest.id}`)
  
  if (dryRun) {
    console.log(`[ProcessTrip] DRY RUN - Would trigger booking for offer ${selectedOffer.external_offer_id}`)
    return { booking_triggered: true }
  }

  // Call the auto-book-production function to execute the booking
  const bookingResult = await triggerAutoBooking(supabaseClient, tripRequest.id)
  
  if (bookingResult.success) {
    console.log(`[ProcessTrip] Successfully triggered booking for trip ${tripRequest.id}`)
    return { booking_triggered: true }
  } else {
    console.error(`[ProcessTrip] Failed to trigger booking: ${bookingResult.message}`)
    throw new Error(`Booking trigger failed: ${bookingResult.message}`)
  }
}

/**
 * Check if an offer has expired
 */
function isOfferExpired(offer: FlightOffer): boolean {
  if (!offer.expires_at) {
    // If no expiration time, consider expired after 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    return new Date(offer.created_at) < oneHourAgo
  }

  return new Date(offer.expires_at) < new Date()
}

/**
 * Trigger flight search for a trip request
 */
async function triggerFlightSearch(
  supabaseClient: any,
  tripRequest: PendingTripRequest
): Promise<{ success: boolean; message: string }> {
  try {
    const searchPayload = {
      tripRequestId: tripRequest.id,
      maxPrice: tripRequest.max_price,
      cabinClass: 'economy',
      maxResults: 10
    }

    const response = await supabaseClient.functions.invoke('duffel-search', {
      body: searchPayload
    })

    if (response.error) {
      throw new Error(response.error.message)
    }

    return {
      success: true,
      message: `Found ${response.data?.inserted || 0} offers`
    }
  } catch (error) {
    console.error('[TriggerSearch] Error:', error)
    return {
      success: false,
      message: error.message
    }
  }
}

/**
 * Trigger auto-booking for a trip request
 */
async function triggerAutoBooking(
  supabaseClient: any,
  tripRequestId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await supabaseClient.functions.invoke('auto-book-production', {
      body: { tripRequestId }
    })

    if (response.error) {
      throw new Error(response.error.message)
    }

    return {
      success: response.data?.success || false,
      message: response.data?.message || 'Booking triggered'
    }
  } catch (error) {
    console.error('[TriggerBooking] Error:', error)
    return {
      success: false,
      message: error.message
    }
  }
}
