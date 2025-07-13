import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHmac } from 'https://deno.land/std@0.177.0/node/crypto.ts';
import { NotificationQueue, type NotificationJob } from '../_shared/queue.ts';

// Type definitions for Duffel webhook events
interface DuffelEvent {
  id: string;
  type: string;
  object: {
    id: string;
    booking_reference?: string;
    total_amount?: string;
    passengers?: Array<{ id: string }>;
    slices?: Array<{
      origin?: { iata_code: string };
      destination?: { iata_code: string };
      segments?: Array<{
        operating_carrier?: { name: string };
        operating_carrier_flight_number?: string;
        departing_at?: string;
        arriving_at?: string;
      }>;
    }>;
  };
}

const DUFFEL_WEBHOOK_SECRET = Deno.env.get('DUFFEL_WEBHOOK_SECRET');

console.log('[DuffelWebhook] Function initialized with notification system');

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-duffel-signature',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Verify webhook signature (Duffel security)
    const signature = req.headers.get('x-duffel-signature');
    const body = await req.text();
    
    // If webhook secret is configured, signature validation is required
    if (DUFFEL_WEBHOOK_SECRET) {
      if (!signature) {
        console.error('[DuffelWebhook] Missing signature header');
        return new Response('Missing signature', { status: 401 });
      }
      
      const expectedSignature = createHmac('sha256', DUFFEL_WEBHOOK_SECRET)
        .update(body)
        .digest('hex');
      
      if (signature !== `sha256=${expectedSignature}`) {
        console.error('[DuffelWebhook] Invalid signature');
        return new Response('Invalid signature', { status: 401 });
      }
    } else {
      // If no webhook secret is configured, still require signature header for security
      if (!signature) {
        console.error('[DuffelWebhook] Missing signature header - webhook secret not configured');
        return new Response('Invalid signature', { status: 401 });
      }
    }

    const webhookData = JSON.parse(body);
    const { data: event } = webhookData;
    const typedEvent = event as DuffelEvent;
    
    console.log('[DuffelWebhook] Received event:', {
      id: typedEvent.id,
      type: typedEvent.type,
      object_id: typedEvent.object?.id,
    });

    // 2. Store webhook event for idempotency
    const { data: existingEvent, error: checkError } = await supabaseClient
      .from('duffel_webhook_events')
      .select('id, processed')
      .eq('event_id', typedEvent.id)
      .maybeSingle();

    if (checkError) {
      console.error('[DuffelWebhook] Error checking existing event:', checkError);
      throw new Error(`Database error: ${checkError.message}`);
    }

    if (existingEvent) {
      if (existingEvent.processed) {
        console.log('[DuffelWebhook] Event already processed:', typedEvent.id);
        return new Response('OK', { status: 200 });
      }
      console.log('[DuffelWebhook] Event exists but not processed, continuing:', typedEvent.id);
    } else {
      // Insert new event
      const { error: insertError } = await supabaseClient
        .from('duffel_webhook_events')
        .insert({
          event_id: typedEvent.id,
          event_type: typedEvent.type,
          order_id: typedEvent.object?.id,
          payload: typedEvent,
          received_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('[DuffelWebhook] Error inserting event:', insertError);
        throw new Error(`Failed to store event: ${insertError.message}`);
      }
    }

    // 3. Process based on event type
    let processed = false;
    let processingError = null;

    try {
      switch (typedEvent.type) {
        case 'order.created':
          await handleOrderCreated(supabaseClient, typedEvent);
          processed = true;
          break;
          
        case 'order.airline_initiated_change':
          await handleOrderChanged(supabaseClient, typedEvent);
          processed = true;
          break;
          
        case 'order.cancelled':
          await handleOrderCancelled(supabaseClient, typedEvent);
          processed = true;
          break;
          
        default:
          console.log('[DuffelWebhook] Unhandled event type:', typedEvent.type);
          processed = true; // Mark as processed to avoid retries
      }
    } catch (processingErr) {
      console.error('[DuffelWebhook] Error processing event:', processingErr);
      processingError = processingErr.message;
      processed = false;
    }

    // 4. Update event processing status
    const { error: updateError } = await supabaseClient
      .from('duffel_webhook_events')
      .update({
        processed,
        processing_error: processingError,
        processed_at: processed ? new Date().toISOString() : null,
      })
      .eq('event_id', typedEvent.id);

    if (updateError) {
      console.error('[DuffelWebhook] Error updating event status:', updateError);
    }

    if (!processed) {
      throw new Error(processingError || 'Failed to process event');
    }

    console.log('[DuffelWebhook] Event processed successfully:', typedEvent.id);
    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('[DuffelWebhook] Error:', error);
    return new Response(JSON.stringify({
      error: error.message,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleOrderCreated(supabaseClient: SupabaseClient, event: DuffelEvent) {
  const order = event.object;
  console.log('[DuffelWebhook] Processing order.created:', order.id);

  // 1. Store event in event sourcing table
  const { data: storedEvent, error: eventError } = await supabaseClient
    .from('events')
    .insert({
      type: 'order.created',
      payload: event,
      source: 'duffel',
      booking_id: order.id,
      occurred_at: new Date().toISOString()
    })
    .select()
    .single();
    
  if (eventError) {
    console.error('[DuffelWebhook] Failed to store event:', eventError);
  }

  // 2. Update booking with confirmed order details
  const { error } = await supabaseClient
    .rpc('rpc_update_duffel_booking_by_order', {
      p_duffel_order_id: order.id,
      p_pnr: order.booking_reference,
      p_duffel_status: 'order_created',
      p_raw_order: order,
    });

  if (error) {
    throw new Error(`Failed to update booking for order ${order.id}: ${error.message}`);
  }

  // 3. Create notification and enqueue for delivery
  await createAndEnqueueNotification(supabaseClient, {
    type: 'booking_success',
    user_id: order.passengers?.[0]?.id, // Adjust based on actual Duffel structure
    booking_id: order.id,
    event_id: storedEvent?.id,
    data: {
      pnr: order.booking_reference,
      booking_reference: order.booking_reference,
      origin: order.slices?.[0]?.origin?.iata_code,
      destination: order.slices?.[0]?.destination?.iata_code,
      airline: order.slices?.[0]?.segments?.[0]?.operating_carrier?.name,
      flight_number: order.slices?.[0]?.segments?.[0]?.operating_carrier_flight_number,
      departure_datetime: order.slices?.[0]?.segments?.[0]?.departing_at,
      departure_date: order.slices?.[0]?.segments?.[0]?.departing_at?.split('T')[0],
      arrival_datetime: order.slices?.[0]?.segments?.[0]?.arriving_at,
      price: order.total_amount
    }
  });

  console.log('[DuffelWebhook] Order created processed successfully');
}

async function handleOrderChanged(supabaseClient: SupabaseClient, event: DuffelEvent) {
  const order = event.object;
  console.log('[DuffelWebhook] Processing order.airline_initiated_change:', order.id);

  // Update booking with change details
  const { error } = await supabaseClient
    .rpc('rpc_update_duffel_booking_by_order', {
      p_duffel_order_id: order.id,
      p_duffel_status: 'order_created', // Maintain status but update raw data
      p_raw_order: order,
    });

  if (error) {
    throw new Error(`Failed to update booking for changed order ${order.id}: ${error.message}`);
  }

  // TODO: Send notification to user about flight change
  console.log('[DuffelWebhook] Order change processed successfully');
}

async function handleOrderCancelled(supabaseClient: SupabaseClient, event: DuffelEvent) {
  const order = event.object;
  console.log('[DuffelWebhook] Processing order.cancelled:', order.id);

  // Update booking status to cancelled
  const { error } = await supabaseClient
    .rpc('rpc_update_duffel_booking_by_order', {
      p_duffel_order_id: order.id,
      p_duffel_status: 'cancelled',
      p_raw_order: order,
    });

  if (error) {
    throw new Error(`Failed to update booking for cancelled order ${order.id}: ${error.message}`);
  }

  // TODO: Send notification to user about cancellation
  console.log('[DuffelWebhook] Order cancellation processed successfully');
}

/**
 * Create notification record and enqueue delivery jobs
 */
async function createAndEnqueueNotification(supabaseClient: SupabaseClient, params: {
  type: string;
  user_id: string;
  booking_id: string;
  event_id?: string;
  data: Record<string, unknown>;
}) {
  try {
    // Find the user ID from the booking if not provided
    let userId = params.user_id;
    if (!userId) {
      const { data: booking } = await supabaseClient
        .from('bookings')
        .select('user_id')
        .eq('duffel_order_id', params.booking_id)
        .single();
      
      if (booking?.user_id) {
        userId = booking.user_id;
      } else {
        console.warn('[DuffelWebhook] No user ID found for booking:', params.booking_id);
        return;
      }
    }

    // 1. Create notification record
    const { data: notification, error: notificationError } = await supabaseClient
      .from('notifications')
      .insert({
        user_id: userId,
        type: params.type,
        title: getNotificationTitle(params.type),
        content: params.data,
        channels: ['email'], // Default to email, will be expanded based on user preferences
        priority: getPriorityForType(params.type),
        booking_id: params.booking_id,
        event_id: params.event_id
      })
      .select()
      .single();

    if (notificationError) {
      console.error('[DuffelWebhook] Failed to create notification:', notificationError);
      return;
    }

    console.log('[DuffelWebhook] Created notification:', notification.id);

    // 2. Get user preferences to determine channels
    const { data: userPrefs } = await supabaseClient
      .from('user_preferences')
      .select('preferences')
      .eq('user_id', userId)
      .single();

    const preferences = userPrefs?.preferences || {};
    const typePrefs = preferences[params.type] || { email: true, sms: false };

    // 3. Enqueue notification jobs for each enabled channel
    const channels = Object.entries(typePrefs)
      .filter(([, enabled]) => enabled)
      .map(([channel]) => channel);

    for (const channel of channels) {
      const job: NotificationJob = {
        id: crypto.randomUUID(),
        type: params.type,
        user_id: userId,
        notification_id: notification.id,
        channel,
        priority: getPriorityForType(params.type),
        data: params.data
      };

      await NotificationQueue.enqueue(job);
      console.log(`[DuffelWebhook] Enqueued ${channel} notification for user ${userId}`);
    }

    // 4. Send immediate SMS notification as fallback (while queue system is being fixed)
    if (channels.includes('sms') || params.type === 'booking_success') {
      await sendImmediateSMS(supabaseClient, userId, params.type, params.data);
    }

  } catch (error) {
    console.error('[DuffelWebhook] Error creating notification:', error);
  }
}

function getNotificationTitle(type: string): string {
  const titles = {
    'booking_success': '✈️ Your flight is booked!',
    'booking_failure': '⚠️ Flight booking issue',
    'booking_canceled': 'ℹ️ Flight booking canceled',
    'reminder_23h': '✈️ Flight reminder'
  };
  return titles[type] || 'Flight notification';
}

function getPriorityForType(type: string): 'low' | 'normal' | 'high' | 'critical' {
  const priorities = {
    'booking_success': 'critical',
    'booking_failure': 'critical',
    'booking_canceled': 'high',
    'reminder_23h': 'normal'
  };
  return priorities[type] || 'normal';
}

/**
 * Send immediate SMS notification as fallback while queue system is being fixed
 */
async function sendImmediateSMS(supabaseClient: SupabaseClient, userId: string, type: string, data: unknown) {
  try {
    // Get user phone number from auth metadata or preferences
    const { data: { user }, error: userError } = await supabaseClient.auth.admin.getUserById(userId);
    
    if (userError || !user) {
      console.log(`[DuffelWebhook] No user found for SMS: ${userId}`);
      return;
    }

    // Check if user has phone number and wants SMS
    const phoneNumber = user.user_metadata?.phone || user.phone;
    const smsEnabled = user.user_metadata?.notification_preferences?.sms || 
                       user.user_metadata?.notification_preferences?.[type]?.sms;
    
    if (!phoneNumber) {
      console.log(`[DuffelWebhook] No phone number for user: ${userId}`);
      return;
    }

    if (smsEnabled === false) {
      console.log(`[DuffelWebhook] SMS disabled for user: ${userId}`);
      return;
    }

    // Send SMS via our SMS function
    const smsResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-sms-notification`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: userId,
        type,
        data,
        phone_number: phoneNumber
      })
    });

    const smsResult = await smsResponse.json();
    console.log(`[DuffelWebhook] SMS notification result for ${userId}:`, smsResult);

  } catch (error) {
    console.error(`[DuffelWebhook] Failed to send immediate SMS:`, error);
  }
}
