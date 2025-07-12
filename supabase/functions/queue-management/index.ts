import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { NotificationQueue } from '../_shared/queue.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const url = new URL(req.url);
  const action = url.searchParams.get('action') || 'stats';

  try {
    switch (action) {
      case 'stats':
        return await getQueueStats();
      
      case 'init':
        return await initializeQueue();
      
      case 'test':
        return await testNotification(req);
      
      case 'process':
        return await triggerProcessing();
      
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('[QueueManagement] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  async function getQueueStats() {
    const stats = await NotificationQueue.getQueueStats();
    
    return new Response(JSON.stringify({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  async function initializeQueue() {
    try {
      // Create the queue table and functions
      await NotificationQueue.enqueue({
        id: crypto.randomUUID(),
        type: 'system_test',
        user_id: crypto.randomUUID(),
        notification_id: crypto.randomUUID(),
        channel: 'email',
        priority: 'low',
        data: { test: true }
      });

      return new Response(JSON.stringify({
        success: true,
        message: 'Queue system initialized successfully'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  async function testNotification(req: Request) {
    const { user_id, type = 'booking_success', channel = 'email' } = await req.json();
    
    if (!user_id) {
      return new Response(JSON.stringify({
        error: 'user_id is required for test notification'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create a test notification
    const testJob = {
      id: crypto.randomUUID(),
      type,
      user_id,
      notification_id: crypto.randomUUID(),
      channel,
      priority: 'normal' as const,
      data: {
        pnr: 'TEST123',
        airline: 'Test Airline',
        flight_number: 'TT123',
        departure_datetime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        arrival_datetime: new Date(Date.now() + 28 * 60 * 60 * 1000).toISOString(),
        price: '299.99'
      }
    };

    await NotificationQueue.enqueue(testJob);

    return new Response(JSON.stringify({
      success: true,
      message: 'Test notification enqueued',
      job_id: testJob.id
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  async function triggerProcessing() {
    // Trigger the notification worker
    const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/notification-worker`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.text();

    return new Response(JSON.stringify({
      success: response.ok,
      message: response.ok ? 'Processing triggered successfully' : 'Processing failed',
      worker_response: result
    }), {
      status: response.ok ? 200 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
