import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-resend-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface ResendWebhookEvent {
  type: 'email.sent' | 'email.delivered' | 'email.bounced' | 'email.complained' | 'email.clicked' | 'email.opened';
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    created_at: string;
    tags?: Array<{ name: string; value: string }>;
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the webhook signature (for verification if needed)
    const signature = req.headers.get('x-resend-signature');
    const webhookEvent: ResendWebhookEvent = await req.json();

    console.log('[ResendWebhook] Received event:', {
      type: webhookEvent.type,
      email_id: webhookEvent.data.email_id,
      to: webhookEvent.data.to,
      subject: webhookEvent.data.subject
    });

    // Store the webhook event for tracking
    await supabaseClient
      .from('email_events')
      .insert({
        email_id: webhookEvent.data.email_id,
        event_type: webhookEvent.type,
        recipient: webhookEvent.data.to[0], // First recipient
        subject: webhookEvent.data.subject,
        from_address: webhookEvent.data.from,
        tags: webhookEvent.data.tags || [],
        event_data: webhookEvent,
        created_at: webhookEvent.created_at,
        received_at: new Date().toISOString()
      });

    // Update notification delivery status if this is a tracked notification
    if (webhookEvent.data.tags?.some(tag => tag.name === 'notification_id')) {
      const notificationId = webhookEvent.data.tags.find(tag => tag.name === 'notification_id')?.value;
      
      if (notificationId) {
        await updateNotificationStatus(supabaseClient, notificationId, webhookEvent);
      }
    }

    // Handle specific event types
    switch (webhookEvent.type) {
      case 'email.sent':
        console.log('[ResendWebhook] Email sent successfully:', webhookEvent.data.email_id);
        break;
        
      case 'email.delivered':
        console.log('[ResendWebhook] Email delivered:', webhookEvent.data.email_id);
        break;
        
      case 'email.bounced':
        console.log('[ResendWebhook] Email bounced:', webhookEvent.data.email_id);
        await handleBounce(supabaseClient, webhookEvent);
        break;
        
      case 'email.complained':
        console.log('[ResendWebhook] Email complaint (spam):', webhookEvent.data.email_id);
        await handleComplaint(supabaseClient, webhookEvent);
        break;
        
      case 'email.opened':
        console.log('[ResendWebhook] Email opened:', webhookEvent.data.email_id);
        await trackEngagement(supabaseClient, webhookEvent, 'opened');
        break;
        
      case 'email.clicked':
        console.log('[ResendWebhook] Email clicked:', webhookEvent.data.email_id);
        await trackEngagement(supabaseClient, webhookEvent, 'clicked');
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[ResendWebhook] Error processing webhook:', error);
    return new Response(JSON.stringify({ 
      error: 'Webhook processing failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function updateNotificationStatus(supabaseClient: { from: (table: string) => { update: (data: unknown) => { eq: (col: string, val: string) => unknown } } }, notificationId: string, event: ResendWebhookEvent) {
  try {
    let status = 'sent';
    
    switch (event.type) {
      case 'email.delivered':
        status = 'delivered';
        break;
      case 'email.bounced':
        status = 'bounced';
        break;
      case 'email.complained':
        status = 'complained';
        break;
    }

    await supabaseClient
      .from('notification_deliveries')
      .update({
        status,
        provider_response: event,
        sent_at: event.type === 'email.delivered' ? event.created_at : undefined
      })
      .eq('notification_id', notificationId)
      .eq('channel', 'email');

    console.log('[ResendWebhook] Updated notification delivery status:', notificationId, status);
  } catch (error) {
    console.error('[ResendWebhook] Failed to update notification status:', error);
  }
}

async function handleBounce(supabaseClient: { from: (table: string) => { upsert: (data: unknown) => unknown } }, event: ResendWebhookEvent) {
  try {
    // Add email to suppression list
    const email = event.data.to[0];
    
    await supabaseClient
      .from('email_suppressions')
      .upsert({
        email_address: email,
        suppression_type: 'bounce',
        reason: 'Email bounced',
        created_at: new Date().toISOString()
      });

    console.log('[ResendWebhook] Added bounced email to suppression list:', email);
  } catch (error) {
    console.error('[ResendWebhook] Failed to handle bounce:', error);
  }
}

async function handleComplaint(supabaseClient: { from: (table: string) => { upsert: (data: unknown) => unknown } }, event: ResendWebhookEvent) {
  try {
    // Add email to suppression list
    const email = event.data.to[0];
    
    await supabaseClient
      .from('email_suppressions')
      .upsert({
        email_address: email,
        suppression_type: 'complaint',
        reason: 'User marked email as spam',
        created_at: new Date().toISOString()
      });

    console.log('[ResendWebhook] Added complained email to suppression list:', email);
  } catch (error) {
    console.error('[ResendWebhook] Failed to handle complaint:', error);
  }
}

async function trackEngagement(supabaseClient: { from: (table: string) => { insert: (data: unknown) => unknown } }, event: ResendWebhookEvent, engagementType: string) {
  try {
    // Track email engagement metrics
    await supabaseClient
      .from('email_engagement')
      .insert({
        email_id: event.data.email_id,
        engagement_type: engagementType,
        recipient: event.data.to[0],
        created_at: event.created_at
      });

    console.log('[ResendWebhook] Tracked email engagement:', event.data.email_id, engagementType);
  } catch (error) {
    console.error('[ResendWebhook] Failed to track engagement:', error);
  }
}
