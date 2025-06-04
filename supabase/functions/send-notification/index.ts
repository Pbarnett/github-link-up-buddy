// supabase/functions/send-notification/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'npm:resend'; // Using npm specifier for Resend

// Helper function to get Supabase admin client
const getSupabaseAdmin = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('[SendNotification] CRITICAL: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.');
    throw new Error('Server configuration error: Supabase credentials missing.');
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false }
  });
};

interface NotificationPayload {
  user_id: string;
  type: 'booking_success' | 'booking_failure' | 'reminder_23h' | 'booking_canceled' | string; // Allow other string types
  payload?: Record<string, any>;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Adjust for production
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  let notificationData: NotificationPayload;
  try {
    notificationData = await req.json();
  } catch (e) {
    console.error('[SendNotification] Invalid JSON payload:', e.message);
    return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { user_id, type, payload } = notificationData;

  if (!user_id || !type) {
    console.warn('[SendNotification] Missing user_id or type in request.');
    return new Response(JSON.stringify({ error: 'Missing user_id or type' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabaseAdmin = getSupabaseAdmin();
  let userEmail: string | null = null;

  try {
    // 1. Insert into notifications table
    const { data: notificationRecord, error: insertError } = await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: user_id,
        type: type,
        payload: payload || {},
      })
      .select('id') // Only select id, no need for the whole record back here
      .single();

    if (insertError) {
      console.error(`[SendNotification] Error inserting notification for user ${user_id}, type ${type}: ${insertError.message}`, insertError);
      throw new Error(`Failed to record notification: ${insertError.message}`);
    }
    console.log(`[SendNotification] Notification recorded: ${notificationRecord?.id} for user ${user_id}, type ${type}`);

    // 2. Fetch user email for notifications
    // Attempt to get user directly via auth.admin to access email, assuming user_id is auth.users.id
    const { data: { user: authUser }, error: adminUserError } = await supabaseAdmin.auth.admin.getUserById(user_id);

    if (adminUserError || !authUser?.email) {
      console.warn(`[SendNotification] Failed to fetch email for user ${user_id} from auth.users: ${adminUserError?.message || 'User not found or email missing'}. Checking public.users as fallback.`);
      // Fallback to public.users table if direct auth user fetch fails or has no email (adjust if schema differs)
      const { data: publicUserData, error: publicUserError } = await supabaseAdmin
        .from('users') // Assuming 'users' is the table name in 'public' schema
        .select('email')
        .eq('id', user_id)
        .single();

      if (publicUserError || !publicUserData?.email) {
        console.error(`[SendNotification] Also failed to fetch email from public.users for user ${user_id}: ${publicUserError?.message || 'User not found or email missing in public.users'}`);
      } else {
        userEmail = publicUserData.email;
      }
    } else {
      userEmail = authUser.email;
    }

    if (userEmail) {
      console.log(`[SendNotification] User email fetched: ${userEmail} for user ${user_id}`);
      // 3. Send Email via Resend for booking-related types
      const resendApiKey = Deno.env.get('VITE_RESEND_API_KEY') || Deno.env.get('RESEND_API_KEY');
      if (type.toLowerCase().includes('booking') || type === 'reminder_23h') {
        if (resendApiKey) {
          const resend = new Resend(resendApiKey);
          let subject = 'Your Flight Booking Update';
          let htmlBody = `<p>You have a new update regarding your flight booking.</p><p>Details: ${JSON.stringify(payload)}</p>`;

          switch (type) {
            case 'booking_success':
              subject = '✈️ Your flight is booked!';
              htmlBody = `<h1>Booking Confirmed!</h1>
                          <p>Your flight booking is confirmed.</p>
                          <p><b>Airline:</b> ${payload?.airline || 'N/A'}</p>
                          <p><b>Flight Number:</b> ${payload?.flight_number || 'N/A'}</p>
                          <p><b>PNR:</b> ${payload?.pnr || 'N/A'}</p>
                          <p><b>Departure:</b> ${payload?.departure_datetime || 'N/A'}</p>
                          <p><b>Arrival:</b> ${payload?.arrival_datetime || 'N/A'}</p>
                          <p><b>Price:</b> ${payload?.price ? `$${payload.price}` : 'N/A'}</p>
                          <p>Thank you for booking with us!</p>`;
              break;
            case 'booking_failure':
              subject = '⚠️ Important: Flight Booking Issue';
              htmlBody = `<h1>Booking Issue</h1>
                          <p>We encountered an issue with your recent flight booking attempt.</p>
                          <p><b>Details:</b> ${payload?.error || 'An unexpected error occurred.'}</p>
                          <p><b>Offer ID:</b> ${payload?.flight_offer_id || 'N/A'}</p>
                          <p>Please contact support or try booking again.</p>`;
              break;
            case 'booking_canceled':
              subject = 'ℹ️ Your Flight Booking Has Been Canceled';
              htmlBody = `<h1>Booking Canceled</h1>
                          <p>Your flight booking has been successfully canceled.</p>
                          <p><b>PNR:</b> ${payload?.pnr || 'N/A'}</p>
                          <p>If you have any questions, please contact support.</p>`;
              break;
            case 'reminder_23h':
              subject = '✈️ Reminder: Your Flight is in Approximately 23 Hours!';
              htmlBody = `<h1>Flight Reminder</h1>
                          <p>This is a reminder that your flight is scheduled in approximately 23 hours.</p>
                          <p><b>PNR:</b> ${payload?.pnr || 'N/A'}</p>
                          <p><b>Departure:</b> ${payload?.departure_datetime || 'N/A'}</p>
                          <p>Please check in with your airline and verify your flight details.</p>`;
              break;
          }

          try {
            console.log(`[SendNotification] Sending email to ${userEmail} for user ${user_id}, type ${type}`);
            await resend.emails.send({
              from: Deno.env.get('RESEND_FROM_EMAIL') || 'noreply@yourdomain.com', // IMPORTANT: Configure FROM email
              to: [userEmail],
              subject: subject,
              html: htmlBody,
            });
            console.log(`[SendNotification] Email sent successfully to ${userEmail} via Resend for user ${user_id}.`);
          } catch (emailError) {
            console.error(`[SendNotification] Error sending email via Resend for user ${user_id}: ${emailError.message}`, emailError);
          }
        } else {
          console.warn('[SendNotification] RESEND_API_KEY (VITE_RESEND_API_KEY) not configured. Skipping email for user ${user_id}.');
        }
      } else {
        console.log(`[SendNotification] Email not sent for type "${type}" as it's not a booking-related or reminder type for user ${user_id}.`);
      }
    } else {
        console.warn(`[SendNotification] No email address found for user ${user_id}. Cannot send email notification.`);
    }

    // 4. SMS Fallback (Stub)
    const twilioAccountSid = Deno.env.get('VITE_TWILIO_ACCOUNT_SID') || Deno.env.get('TWILIO_ACCOUNT_SID');
    if (!twilioAccountSid) {
      console.log('[SendNotification] SMS (Twilio SID) not configured, skipping SMS for user ${user_id}.');
    } else {
      console.log(`[SendNotification] SMS STUB: Would attempt to send SMS to user ${user_id} for type ${type}. Payload: ${JSON.stringify(payload)}`);
      // Actual Twilio logic would go here, requiring user's phone number.
      // const userPhoneNumber = authUser?.phone; // from authUser if available and has phone
      // if (userPhoneNumber) { /* ... send SMS ... */ }
    }

    return new Response(JSON.stringify({ success: true, notification_id: notificationRecord?.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(`[SendNotification] Handler error for user ${user_id}, type ${type}: ${error.message}`, error);
    // Log error to notifications table if possible? Or a separate error log.
    // For now, just return error to caller.
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
