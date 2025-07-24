/**
 * Duffel Webhooks Handler
 * 
 * Handles all Duffel webhook events following DUFFEL_IMPLEMENTATION_GUIDE.md:
 * - Signature verification for security
 * - Event deduplication using webhook IDs
 * - Order status updates
 * - Payment status changes
 * - Booking confirmations
 * 
 * Supported Events:
 * - order.created
 * - order.payment_succeeded
 * - order.cancelled
 * - order.confirmed
 * - order.fulfilled
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from 'https://deno.land/std@0.177.0/node/crypto.ts'
import { corsHeaders } from '../_shared/cors.ts'

// Webhook event types from Duffel API
interface DuffelWebhookEvent {
  id: string
  type: string
  created_at: string
  data: {
    id: string
    type: string
    [key: string]: any
  }
}

interface OrderEvent {
  id: string
  booking_reference: string
  status: string
  payment_status: {
    awaiting_payment: boolean
    payment_required_by?: string
    price_guarantee_expires_at?: string
  }
  total_amount: string
  total_currency: string
  documents?: Array<{
    type: string
    id: string
  }>
}

console.log('[DuffelWebhooks] Function initialized')

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
    // Verify webhook signature
    const signature = req.headers.get('duffel-signature')
    const webhookSecret = Deno.env.get('DUFFEL_WEBHOOK_SECRET')
    
    if (!webhookSecret) {
      throw new Error('DUFFEL_WEBHOOK_SECRET not configured')
    }

    if (!signature) {
      console.error('[DuffelWebhooks] Missing signature header')
      return new Response('Unauthorized', { status: 401 })
    }

    // Get raw body for signature verification
    const rawBody = await req.text()
    
    // Verify signature (Duffel uses HMAC-SHA256)
    const expectedSignature = createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex')
    
    const providedSignature = signature.replace('sha256=', '')
    
    if (expectedSignature !== providedSignature) {
      console.error('[DuffelWebhooks] Invalid signature')
      return new Response('Invalid signature', { status: 401 })
    }

    // Parse webhook payload
    const webhookEvent: DuffelWebhookEvent = JSON.parse(rawBody)
    
    console.log(`[DuffelWebhooks] Processing event:`, {
      id: webhookEvent.id,
      type: webhookEvent.type,
      created_at: webhookEvent.created_at
    })

    // Check for duplicate events (idempotency)
    const { data: existingEvent } = await supabaseClient
      .from('duffel_webhook_events')
      .select('id')
      .eq('webhook_id', webhookEvent.id)
      .single()

    if (existingEvent) {
      console.log(`[DuffelWebhooks] Event ${webhookEvent.id} already processed`)
      return new Response('OK', { status: 200 })
    }

    // Store webhook event for deduplication
    await supabaseClient
      .from('duffel_webhook_events')
      .insert({
        webhook_id: webhookEvent.id,
        event_type: webhookEvent.type,
        processed_at: new Date().toISOString(),
        raw_data: webhookEvent
      })

    // Process event based on type
    await processWebhookEvent(webhookEvent, supabaseClient)

    console.log(`[DuffelWebhooks] Successfully processed event ${webhookEvent.id}`)

    return new Response('OK', { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    })

  } catch (error) {
    console.error('[DuffelWebhooks] Error:', error)
    
    return new Response(JSON.stringify({
      error: 'Webhook processing failed',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

/**
 * Process webhook event based on type
 */
async function processWebhookEvent(
  event: DuffelWebhookEvent, 
  supabaseClient: any
): Promise<void> {
  const { type, data } = event

  switch (type) {
    case 'order.created':
      await handleOrderCreated(data as OrderEvent, supabaseClient)
      break
      
    case 'order.payment_succeeded':
      await handlePaymentSucceeded(data as OrderEvent, supabaseClient)
      break
      
    case 'order.cancelled':
      await handleOrderCancelled(data as OrderEvent, supabaseClient)
      break
      
    case 'order.confirmed':
      await handleOrderConfirmed(data as OrderEvent, supabaseClient)
      break
      
    case 'order.fulfilled':
      await handleOrderFulfilled(data as OrderEvent, supabaseClient)
      break
      
    default:
      console.log(`[DuffelWebhooks] Unhandled event type: ${type}`)
  }
}

/**
 * Handle order.created event
 */
async function handleOrderCreated(order: OrderEvent, supabaseClient: any): Promise<void> {
  console.log(`[DuffelWebhooks] Processing order.created for ${order.id}`)

  // Update booking status to confirmed
  const { error: updateError } = await supabaseClient
    .from('bookings')
    .update({
      status: 'confirmed',
      duffel_order_id: order.id,
      booking_reference: order.booking_reference,
      updated_at: new Date().toISOString(),
      duffel_status: order.status
    })
    .eq('duffel_order_id', order.id)

  if (updateError) {
    console.error('[DuffelWebhooks] Failed to update booking:', updateError)
    throw updateError
  }

  // Send confirmation notification
  await sendBookingConfirmationNotification(order, supabaseClient)
}

/**
 * Handle order.payment_succeeded event
 */
async function handlePaymentSucceeded(order: OrderEvent, supabaseClient: any): Promise<void> {
  console.log(`[DuffelWebhooks] Processing payment_succeeded for ${order.id}`)

  const { error: updateError } = await supabaseClient
    .from('bookings')
    .update({
      payment_status: 'succeeded',
      paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('duffel_order_id', order.id)

  if (updateError) {
    console.error('[DuffelWebhooks] Failed to update payment status:', updateError)
    throw updateError
  }

  // If order has tickets, update booking status
  if (order.documents && order.documents.length > 0) {
    await supabaseClient
      .from('bookings')
      .update({
        status: 'ticketed',
        updated_at: new Date().toISOString()
      })
      .eq('duffel_order_id', order.id)
  }
}

/**
 * Handle order.cancelled event
 */
async function handleOrderCancelled(order: OrderEvent, supabaseClient: any): Promise<void> {
  console.log(`[DuffelWebhooks] Processing order.cancelled for ${order.id}`)

  const { error: updateError } = await supabaseClient
    .from('bookings')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      duffel_status: order.status
    })
    .eq('duffel_order_id', order.id)

  if (updateError) {
    console.error('[DuffelWebhooks] Failed to update cancellation:', updateError)
    throw updateError
  }

  // Process refunds if applicable
  await processRefund(order, supabaseClient)
}

/**
 * Handle order.confirmed event
 */
async function handleOrderConfirmed(order: OrderEvent, supabaseClient: any): Promise<void> {
  console.log(`[DuffelWebhooks] Processing order.confirmed for ${order.id}`)

  const { error: updateError } = await supabaseClient
    .from('bookings')
    .update({
      status: 'confirmed',
      confirmed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      duffel_status: order.status
    })
    .eq('duffel_order_id', order.id)

  if (updateError) {
    console.error('[DuffelWebhooks] Failed to update confirmation:', updateError)
    throw updateError
  }
}

/**
 * Handle order.fulfilled event (tickets issued)
 */
async function handleOrderFulfilled(order: OrderEvent, supabaseClient: any): Promise<void> {
  console.log(`[DuffelWebhooks] Processing order.fulfilled for ${order.id}`)

  const { error: updateError } = await supabaseClient
    .from('bookings')
    .update({
      status: 'ticketed',
      ticketed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      duffel_status: order.status
    })
    .eq('duffel_order_id', order.id)

  if (updateError) {
    console.error('[DuffelWebhooks] Failed to update fulfillment:', updateError)
    throw updateError
  }

  // Extract and store ticket information
  if (order.documents) {
    const tickets = order.documents
      .filter(doc => doc.type === 'ticket')
      .map(ticket => ({
        duffel_ticket_id: ticket.id,
        booking_id: null, // Will be set by foreign key
        issued_at: new Date().toISOString()
      }))

    if (tickets.length > 0) {
      // Get booking ID first
      const { data: booking } = await supabaseClient
        .from('bookings')
        .select('id')
        .eq('duffel_order_id', order.id)
        .single()

      if (booking) {
        const ticketsWithBookingId = tickets.map(ticket => ({
          ...ticket,
          booking_id: booking.id
        }))

        await supabaseClient
          .from('tickets')
          .upsert(ticketsWithBookingId, { 
            onConflict: 'duffel_ticket_id',
            ignoreDuplicates: false 
          })
      }
    }
  }

  // Send tickets notification
  await sendTicketsIssuedNotification(order, supabaseClient)
}

/**
 * Send booking confirmation notification
 */
async function sendBookingConfirmationNotification(
  order: OrderEvent, 
  supabaseClient: any
): Promise<void> {
  try {
    // Get user email from booking
    const { data: booking } = await supabaseClient
      .from('bookings')
      .select(`
        user_id,
        trip_requests!inner(
          traveler_data
        )
      `)
      .eq('duffel_order_id', order.id)
      .single()

    if (booking?.trip_requests?.traveler_data?.email) {
      // Send notification via your notification service
      console.log(`[DuffelWebhooks] Sending confirmation to ${booking.trip_requests.traveler_data.email}`)
      
      // You can integrate with your email service here
      // await sendEmail({
      //   to: booking.trip_requests.traveler_data.email,
      //   subject: 'Flight Booking Confirmed',
      //   template: 'booking-confirmation',
      //   data: { order, bookingReference: order.booking_reference }
      // })
    }
  } catch (error) {
    console.error('[DuffelWebhooks] Failed to send confirmation notification:', error)
    // Don't throw - notification failure shouldn't fail webhook processing
  }
}

/**
 * Send tickets issued notification
 */
async function sendTicketsIssuedNotification(
  order: OrderEvent, 
  supabaseClient: any
): Promise<void> {
  try {
    console.log(`[DuffelWebhooks] Sending tickets notification for ${order.booking_reference}`)
    // Implement your tickets notification logic here
  } catch (error) {
    console.error('[DuffelWebhooks] Failed to send tickets notification:', error)
  }
}

/**
 * Process refund for cancelled order
 */
async function processRefund(order: OrderEvent, supabaseClient: any): Promise<void> {
  try {
    console.log(`[DuffelWebhooks] Processing refund for cancelled order ${order.id}`)
    
    // Get original payment information
    const { data: booking } = await supabaseClient
      .from('bookings')
      .select('stripe_payment_intent_id, amount, currency')
      .eq('duffel_order_id', order.id)
      .single()

    if (booking?.stripe_payment_intent_id) {
      // Process Stripe refund
      // This would integrate with your Stripe refund logic
      console.log(`[DuffelWebhooks] Would process Stripe refund for ${booking.stripe_payment_intent_id}`)
    }
    
  } catch (error) {
    console.error('[DuffelWebhooks] Failed to process refund:', error)
    // Log error but don't fail webhook processing
  }
}
