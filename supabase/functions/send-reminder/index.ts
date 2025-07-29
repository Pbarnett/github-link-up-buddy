// supabase/functions/send-reminder/index.ts

// Conditional imports for Deno vs Node.js environments
let serve: ((handler: (req: Request) => Promise<Response>) => void) | undefined;
let createClient: ((url: string, key: string, options?: { auth?: { persistSession?: boolean } }) => unknown) | undefined;
 
let _SupabaseClient: unknown;

async function initializeEnvironment() {
  // Check if we're in test environment (vi/vitest globals present)
  if (typeof globalThis !== 'undefined' && (globalThis as { vi?: unknown }).vi) {
    // Test environment - createClient and serve are already mocked by vitest
    // Just return to avoid dynamic imports
    return;
  }
  
  if (typeof Deno !== 'undefined') {
    // Deno environment - use https imports
    const { serve: denoServe } = await import('https://deno.land/std@0.177.0/http/server.ts');
    const { createClient: denoCreateClient, SupabaseClient: denoSupabaseClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    serve = denoServe;
    createClient = denoCreateClient;
    _SupabaseClient = denoSupabaseClient;
  } else {
    // Node.js/test environment - use npm packages
    try {
      const { createClient: nodeCreateClient } = await import('@supabase/supabase-js');
      createClient = nodeCreateClient;
      // Mock serve function for Node.js
      serve = () => console.log('Mock serve called with handler');
    } catch (error) {
      console.error('Failed to import Supabase in Node.js environment:', error);
    }
  }
}

// Global environment helper function
const getEnv = (key: string) => {
  if (typeof Deno !== 'undefined' && Deno.env) {
    return Deno.env.get(key);
  }
  // Fallback for test environment
  return process?.env?.[key];
};

// Helper function to get Supabase admin client
const getSupabaseAdmin = async () => {
  const supabaseUrl = getEnv('SUPABASE_URL');
  const supabaseServiceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('[SendReminder] CRITICAL: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.');
    throw new Error('Server configuration error for SendReminder: Supabase credentials missing.');
  }
  
  // In test environment, use the mocked module
  if (typeof globalThis !== 'undefined' && (globalThis as { vi?: unknown }).vi) {
    const { createClient: testCreateClient } = await import('@supabase/supabase-js');
    return testCreateClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false }
    });
  }
  
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false }
  });
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Adjust for production if invoked via HTTP by non-cron
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS', // Typically invoked by cron, but allow POST for manual trigger
};

// Export testable handler
export const handler = async (req: Request): Promise<Response> => {
  // Initialize environment if not already done
  if (!createClient) {
    await initializeEnvironment();
  }
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Secure this function if it can be invoked via HTTP, e.g., check for a secret cron key
  // Example: const authHeader = req.headers.get('Authorization');
  // if (authHeader !== `Bearer ${Deno.env.get('CRON_SECRET')}`) {
  //   return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
  // }
  console.log('[SendReminder] Function invoked.');

  const supabaseAdmin = await getSupabaseAdmin();
  const supabaseUrl = getEnv('SUPABASE_URL');
  const serviceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[SendReminder] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not configured for invoking other functions.');
    return new Response(JSON.stringify({ error: 'Internal server configuration error.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const sendNotificationUrl = `${supabaseUrl}/functions/v1/send-notification`;

  try {
    const now = Date.now();
    // Query for bookings where created_at is between 24 and 23 hours ago
    // This means the booking is now 23-24 hours old.
    // Reminder should be for flights departing in ~23 hours.
    // The query should be on `departure_datetime` not `created_at`.
    // Let's assume we are sending a reminder 23 hours *before departure*.

    const twentyFourHoursFromNow = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    const twentyThreeHoursFromNow = new Date(now + 23 * 60 * 60 * 1000).toISOString();

    console.log(`[SendReminder] Querying for bookings departing between ${twentyThreeHoursFromNow} and ${twentyFourHoursFromNow}.`);

    const { data: dueBookings, error: queryError } = await supabaseAdmin
      .from('bookings') // Assuming 'bookings' table stores confirmed bookings
      .select('id, user_id, pnr, departure_datetime, currency, price, flight_details') // flight_details might be JSONB with airline, flight_number etc.
      .eq('status', 'ticketed') // Or 'booked' if that's the final confirmed status post-payment
      // .eq('email_reminder_sent', false) // If using a flag on bookings table to prevent re-sending
      .gte('departure_datetime', twentyThreeHoursFromNow)
      .lt('departure_datetime', twentyFourHoursFromNow); // Use lt for the upper bound

    if (queryError) {
      console.error('[SendReminder] Error querying bookings for reminders:', queryError.message);
      throw new Error(`Failed to query bookings for reminders: ${queryError.message}`);
    }

    if (!dueBookings || dueBookings.length === 0) {
      console.log('[SendReminder] No bookings due for a 23-hour reminder.');
      return new Response(JSON.stringify({ success: true, message: 'No bookings due for reminder.', reminders_sent: 0 }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`[SendReminder] Found ${dueBookings.length} bookings due for reminder.`);
    let remindersSentCount = 0;

    for (const booking of dueBookings) {
      // Optional: Advanced check against 'notifications' table to prevent duplicates if cron runs too often or overlaps
      const { data: existingNotification, error: checkError } = await supabaseAdmin
        .from('notifications')
        .select('id')
        .eq('type', 'reminder_23h')
        .eq('user_id', booking.user_id) // Ensure it's for the same user
        .eq('payload->>booking_id', booking.id) // Check if booking_id in payload matches
        .limit(1)
        .maybeSingle(); // Use maybeSingle to get one record or null

      if (checkError) {
        console.warn(`[SendReminder] Error checking for existing reminder for booking ${booking.id}. Skipping this one to be safe. Error: ${checkError.message}`);
        continue;
      }
      if (existingNotification) {
        console.log(`[SendReminder] Reminder_23h notification already exists for booking ${booking.id} (Notification ID: ${existingNotification.id}). Skipping.`);
        continue;
      }

      const notificationPayload = {
        user_id: booking.user_id,
        type: 'reminder_23h',
        payload: {
          booking_id: booking.id,
          pnr: booking.pnr,
          departure_datetime: booking.departure_datetime,
          // Assuming flight_details is a JSONB object with relevant info
          airline: booking.flight_details?.airline,
          flight_number: booking.flight_details?.flight_number,
          price: booking.price,
          currency: booking.currency,
        },
      };

      try {
        console.log(`[SendReminder] Invoking send-notification for booking ${booking.id}, user ${booking.user_id}`);
        const response = await fetch(sendNotificationUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
            'apikey': serviceRoleKey
          },
          body: JSON.stringify(notificationPayload),
        });

        if (!response.ok) {
          const errorBody = await response.text();
          console.error(`[SendReminder] Failed to send notification for booking ${booking.id}. Status: ${response.status}. Body: ${errorBody}`);
        } else {
          const responseData = await response.json();
          console.log(`[SendReminder] Successfully triggered send-notification for booking ${booking.id}. Notification ID: ${responseData.notification_id}`);
          remindersSentCount++;
          // Optional: Update email_reminder_sent on bookings if still using that flag
          // await supabaseAdmin.from('bookings').update({ email_reminder_sent: true }).eq('id', booking.id);
        }
      } catch (_fetchError) {
        console.error(`[SendReminder] Error invoking send-notification for booking ${booking.id}: ${fetchError.message}`);
      }
    }

    return new Response(JSON.stringify({ success: true, message: 'Reminder processing complete.', reminders_sent: remindersSentCount }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(`[SendReminder] Handler error: ${error.message}`, error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

export const testableHandler = handler;
export default handler;

// Initialize and serve the handler
if (typeof Deno !== 'undefined' && !(globalThis as { vi?: unknown }).vi) {
  // Only initialize serve in Deno environment
  initializeEnvironment().then(() => {
    serve(handler);
  });
}
