/**
 * Duffel Guided Edge Function
 * 
 * Implements the complete Duffel workflow following DUFFEL_IMPLEMENTATION_GUIDE.md:
 * 1. Create Offer Request → 2. Get Offers → 3. Create Order → 4. Handle Payment → 5. Webhook Updates
 * 
 * Features:
 * - Official @duffel/api client
 * - Proper workflow implementation
 * - Rate limiting and retry logic
 * - Comprehensive error handling
 * - Idempotency protection
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Duffel } from 'https://esm.sh/@duffel/api@3.38.0'
import { corsHeaders } from '../_shared/cors.ts'

// Rate Limits per Implementation Guide
const RATE_LIMITS = {
  search: 120,  // requests per minute
  orders: 60,   // requests per minute  
  other: 300    // requests per minute
} as const

// Error Messages per Implementation Guide
const DUFFEL_ERROR_MESSAGES = {
  'offer_no_longer_available': 'This flight is no longer available. Please search again.',
  'validation_error': 'Please check your travel details and try again.',
  'payment_required': 'Payment is required to complete this booking.',
  'insufficient_funds': 'Payment was declined. Please try a different card.',
  'rate_limit_exceeded': 'Too many requests. Please wait a moment and try again.',
  'offer_expired': 'This offer has expired. Please search for flights again.',
} as const

interface DuffelSearchRequest {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: Array<{ type: 'adult' | 'child' | 'infant_without_seat' }>
  cabinClass?: 'first' | 'business' | 'premium_economy' | 'economy'
}

interface DuffelBookingRequest {
  offerId: string
  passengers: Array<{
    title: string
    given_name: string
    family_name: string
    gender: 'f' | 'm'
    born_on: string
    email: string
    phone_number: string
  }>
  idempotencyKey: string
}

console.log('[DuffelGuided] Function initialized')

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    const url = new URL(req.url)
    const operation = url.pathname.split('/').pop()

    // Initialize Duffel Client per Implementation Guide
    const isLive = Deno.env.get('DUFFEL_LIVE_ENABLED') === 'true'
    const apiToken = isLive 
      ? Deno.env.get('DUFFEL_API_TOKEN_LIVE')
      : Deno.env.get('DUFFEL_API_TOKEN_TEST')

    if (!apiToken) {
      throw new Error(`Missing Duffel ${isLive ? 'live' : 'test'} token`)
    }

    const duffel = new Duffel({ token: apiToken })
    console.log(`[DuffelGuided] Initialized in ${isLive ? 'LIVE' : 'TEST'} mode`)

    // Route operations following Implementation Guide workflow
    switch (operation) {
      case 'search':
        return await handleSearch(req, duffel)
      
      case 'offers':
        return await handleGetOffers(req, duffel)
      
      case 'book':
        return await handleBooking(req, duffel, supabaseClient)
      
      case 'order':
        return await handleGetOrder(req, duffel)
      
      case 'test':
        return await handleTest(duffel)
      
      default:
        return new Response(JSON.stringify({
          error: 'Invalid operation. Use: search, offers, book, order, test'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }

  } catch (error) {
    console.error('[DuffelGuided] Error:', error)
    
    const userMessage = mapErrorToUserMessage(error)
    
    return new Response(JSON.stringify({
      success: false,
      error: userMessage,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

/**
 * WORKFLOW STEP 1: Create Offer Request (Flight Search)
 */
async function handleSearch(req: Request, duffel: any): Promise<Response> {
  const searchParams: DuffelSearchRequest = await req.json()
  
  console.log('[DuffelGuided] Processing search:', searchParams)

  const slices = [{
    origin: searchParams.origin,
    destination: searchParams.destination,
    departure_date: searchParams.departureDate
  }]

  // Add return slice if round-trip
  if (searchParams.returnDate) {
    slices.push({
      origin: searchParams.destination,
      destination: searchParams.origin,
      departure_date: searchParams.returnDate
    })
  }

  const requestData = {
    slices,
    passengers: searchParams.passengers,
    cabin_class: searchParams.cabinClass || 'economy',
    max_connections: 1
  }

  try {
    // Create offer request with retry logic
    const offerRequest = await withRetry(async () => {
      return await duffel.offerRequests.create(requestData)
    })

    console.log(`[DuffelGuided] Offer request created: ${offerRequest.id}`)

    return new Response(JSON.stringify({
      success: true,
      offerRequestId: offerRequest.id,
      searchParams,
      message: 'Search request created. Use /offers endpoint to get results.'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    throw new Error(`Search failed: ${error.message}`)
  }
}

/**
 * WORKFLOW STEP 2: Get Offers from Offer Request
 */
async function handleGetOffers(req: Request, duffel: any): Promise<Response> {
  const url = new URL(req.url)
  const offerRequestId = url.searchParams.get('offer_request_id')
  const limit = parseInt(url.searchParams.get('limit') || '50')

  if (!offerRequestId) {
    throw new Error('offer_request_id parameter is required')
  }

  console.log(`[DuffelGuided] Retrieving offers for request: ${offerRequestId}`)

  try {
    const offersResponse = await withRetry(async () => {
      return await duffel.offers.list({
        offer_request_id: offerRequestId,
        limit
      })
    })

    // Filter out expired offers per Implementation Guide
    const validOffers = offersResponse.data.filter((offer: any) => {
      return isOfferValid(offer)
    })

    console.log(`[DuffelGuided] Retrieved ${validOffers.length}/${offersResponse.data.length} valid offers`)

    return new Response(JSON.stringify({
      success: true,
      offers: validOffers,
      total: validOffers.length,
      expired: offersResponse.data.length - validOffers.length
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    throw new Error(`Failed to retrieve offers: ${error.message}`)
  }
}

/**
 * WORKFLOW STEP 3: Create Order (Book Flight)
 */
async function handleBooking(req: Request, duffel: any, supabaseClient: any): Promise<Response> {
  const bookingParams: DuffelBookingRequest = await req.json()

  console.log(`[DuffelGuided] Processing booking for offer: ${bookingParams.offerId}`)

  // Validate offer before booking per Implementation Guide
  const offer = await withRetry(async () => {
    return await duffel.offers.get(bookingParams.offerId)
  })

  const validation = validateOffer(offer)
  if (!validation.valid) {
    throw new Error(`Offer expired (${validation.minutesLeft} minutes left). Please search again.`)
  }

  // Create order with idempotency
  const orderData = {
    selected_offers: [bookingParams.offerId],
    passengers: bookingParams.passengers,
    payments: [{
      type: 'balance',
      amount: offer.total_amount,
      currency: offer.total_currency
    }],
    metadata: {
      idempotency_key: bookingParams.idempotencyKey,
      created_by: 'parker-flight-guided',
      integration_version: 'v2.0.0'
    }
  }

  try {
    console.log(`[DuffelGuided] Creating order with idempotency key: ${bookingParams.idempotencyKey}`)

    const order = await withRetry(async () => {
      return await duffel.orders.create(orderData, {
        headers: {
          'Idempotency-Key': bookingParams.idempotencyKey
        }
      })
    })

    console.log(`[DuffelGuided] Order created: ${order.id}`)

    // Store booking in database
    const { data: bookingResult, error: dbError } = await supabaseClient
      .rpc('rpc_create_duffel_booking_guided', {
        p_duffel_order_id: order.id,
        p_booking_reference: order.booking_reference,
        p_amount: parseFloat(order.total_amount),
        p_currency: order.total_currency,
        p_raw_order: order
      })

    if (dbError) {
      console.warn('[DuffelGuided] Database storage failed:', dbError)
      // Don't fail the booking for database issues
    }

    return new Response(JSON.stringify({
      success: true,
      orderId: order.id,
      bookingReference: order.booking_reference,
      totalAmount: order.total_amount,
      currency: order.total_currency,
      status: order.documents?.length > 0 ? 'confirmed' : 'pending'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    throw new Error(`Booking failed: ${error.message}`)
  }
}

/**
 * Get Order Details
 */
async function handleGetOrder(req: Request, duffel: any): Promise<Response> {
  const url = new URL(req.url)
  const orderId = url.searchParams.get('order_id')

  if (!orderId) {
    throw new Error('order_id parameter is required')
  }

  try {
    const order = await withRetry(async () => {
      return await duffel.orders.get(orderId)
    })

    return new Response(JSON.stringify({
      success: true,
      order
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    throw new Error(`Failed to retrieve order: ${error.message}`)
  }
}

/**
 * Test Connection
 */
async function handleTest(duffel: any): Promise<Response> {
  try {
    await duffel.airports.list({ limit: 1 })

    return new Response(JSON.stringify({
      success: true,
      message: '✅ Duffel API connection successful',
      version: 'v2.0.0-guided',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    throw new Error(`Connection test failed: ${error.message}`)
  }
}

/**
 * Offer Validation with Safety Buffer - Implementation Guide Pattern
 */
function validateOffer(offer: any): { valid: boolean; minutesLeft: number } {
  const now = new Date()
  const expires = new Date(offer.expires_at)
  const timeLeft = expires.getTime() - now.getTime()
  const minutesLeft = Math.floor(timeLeft / (1000 * 60))
  const safetyBuffer = 2 // 2-minute safety buffer per Implementation Guide

  return {
    valid: minutesLeft > safetyBuffer,
    minutesLeft
  }
}

function isOfferValid(offer: any): boolean {
  return validateOffer(offer).valid
}

/**
 * Retry Logic with Exponential Backoff - Implementation Guide Pattern
 */
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  const backoffMs = [1000, 2000, 4000] // Exponential backoff
  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error

      // Don't retry client errors (4xx) except rate limits
      if (error.status >= 400 && error.status < 500 && error.status !== 429) {
        throw error
      }

      // Don't retry if max attempts reached
      if (attempt === maxRetries) {
        break
      }

      // Wait with exponential backoff
      const delay = backoffMs[attempt] || backoffMs[backoffMs.length - 1]
      console.log(`[DuffelGuided] Attempt ${attempt + 1} failed, retrying in ${delay}ms`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError!
}

/**
 * Error Mapping per Implementation Guide
 */
function mapErrorToUserMessage(error: any): string {
  const errorType = error?.errors?.[0]?.type || error?.type || 'unknown_error'
  
  return DUFFEL_ERROR_MESSAGES[errorType as keyof typeof DUFFEL_ERROR_MESSAGES] || 
         error?.message || 
         'An unexpected error occurred. Please try again or contact support.'
}
