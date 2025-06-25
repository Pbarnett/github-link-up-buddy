import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHash, createHmac } from 'https://deno.land/std@0.177.0/node/crypto.ts';

const DUFFEL_WEBHOOK_SECRET = Deno.env.get('DUFFEL_WEBHOOK_SECRET');

console.log('[DuffelWebhook] Function initialized');

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
    
    if (DUFFEL_WEBHOOK_SECRET && signature) {
      const expectedSignature = createHmac('sha256', DUFFEL_WEBHOOK_SECRET)
        .update(body)
        .digest('hex');
      
      if (signature !== `sha256=${expectedSignature}`) {
        console.error('[DuffelWebhook] Invalid signature');
        return new Response('Invalid signature', { status: 401 });
      }
    }

    const webhookData = JSON.parse(body);
    const { data: event } = webhookData;
    
    console.log('[DuffelWebhook] Received event:', {
      id: event.id,
      type: event.type,
      object_id: event.object?.id,
    });

    // 2. Store webhook event for idempotency
    const { data: existingEvent, error: checkError } = await supabaseClient
      .from('duffel_webhook_events')
      .select('id, processed')
      .eq('event_id', event.id)
      .maybeSingle();

    if (checkError) {
      console.error('[DuffelWebhook] Error checking existing event:', checkError);
      throw new Error(`Database error: ${checkError.message}`);
    }

    if (existingEvent) {
      if (existingEvent.processed) {
        console.log('[DuffelWebhook] Event already processed:', event.id);
        return new Response('OK', { status: 200 });
      }
      console.log('[DuffelWebhook] Event exists but not processed, continuing:', event.id);
    } else {
      // Insert new event
      const { error: insertError } = await supabaseClient
        .from('duffel_webhook_events')
        .insert({
          event_id: event.id,
          event_type: event.type,
          order_id: event.object?.id,
          payload: event,
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
      switch (event.type) {
        case 'order.created':
          await handleOrderCreated(supabaseClient, event);
          processed = true;
          break;
          
        case 'order.airline_initiated_change':
          await handleOrderChanged(supabaseClient, event);
          processed = true;
          break;
          
        case 'order.cancelled':
          await handleOrderCancelled(supabaseClient, event);
          processed = true;
          break;
          
        default:
          console.log('[DuffelWebhook] Unhandled event type:', event.type);
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
      .eq('event_id', event.id);

    if (updateError) {
      console.error('[DuffelWebhook] Error updating event status:', updateError);
    }

    if (!processed) {
      throw new Error(processingError || 'Failed to process event');
    }

    console.log('[DuffelWebhook] Event processed successfully:', event.id);
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

async function handleOrderCreated(supabaseClient: any, event: any) {
  const order = event.object;
  console.log('[DuffelWebhook] Processing order.created:', order.id);

  // Update booking with confirmed order details
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

  console.log('[DuffelWebhook] Order created processed successfully');
}

async function handleOrderChanged(supabaseClient: any, event: any) {
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

async function handleOrderCancelled(supabaseClient: any, event: any) {
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
