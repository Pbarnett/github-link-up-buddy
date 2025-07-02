// supabase/functions/send-notification/index.ts

// Conditional imports for Deno vs Node.js environments
let serve: any;
let createClient: any;
let SupabaseClient: any;

async function initializeEnvironment() {
  if (typeof Deno !== 'undefined') {
    // Deno environment - use https imports
    const { serve: denoServe } = await import('https://deno.land/std@0.177.0/http/server.ts');
    const { createClient: denoCreateClient, SupabaseClient: denoSupabaseClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    serve = denoServe;
    createClient = denoCreateClient;
    SupabaseClient = denoSupabaseClient;
  } else {
    // Node.js/test environment - use npm packages
    try {
      const { createClient: nodeCreateClient } = await import('@supabase/supabase-js');
      createClient = nodeCreateClient;
      // Mock serve function for Node.js
      serve = (handler: any) => console.log('Mock serve called with handler');
    } catch (error) {
      console.error('Failed to import Supabase in Node.js environment:', error);
    }
  }
}

// Handle Resend import - use dynamic import for Deno environment
let Resend: any;

async function initializeResend() {
  if (Resend) return Resend; // Already initialized
  
  if (typeof Deno !== 'undefined') {
    // In Deno environment, use npm: import
    try {
      const { Resend: ResendClass } = await import('npm:resend');
      Resend = ResendClass;
      return ResendClass;
    } catch (error) {
      console.error('Failed to import Resend in Deno environment:', error);
      // Fallback mock class
      Resend = class MockResend {
        constructor(apiKey: string) {}
        emails = { send: async () => ({ data: { id: 'mock-id' }, error: null }) };
      };
      return Resend;
    }
  } else {
    // In test environment, try to import resend for mocking
    try {
      const { Resend: ResendClass } = await import('resend');
      Resend = ResendClass;
      return ResendClass;
    } catch (error) {
      // Fallback mock for test environment
      Resend = class MockResend {
        constructor(apiKey: string) {}
        emails = { send: async () => ({ data: { id: 'mock-id' }, error: null }) };
      };
      return Resend;
    }
  }
}

// Helper function to safely convert values to valid JSON
function toJsonSafe(value: unknown): any {
  // 1. Primitives & null
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  // 2. Date → ISO string
  if (value instanceof Date) {
    return value.toISOString();
  }

  // 3. Array → map over elements
  if (Array.isArray(value)) {
    return value.map((el) => toJsonSafe(el));
  }

  // 4. Plain object → recurse on each entry
  if (typeof value === "object" && value !== null) {
    const plain: { [key: string]: any } = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      // Skip undefined-valued keys so we don't insert `"key": undefined`
      if (val === undefined) continue;
      plain[key] = toJsonSafe(val);
    }
    return plain;
  }

  // 5. Anything else (function, Map, Set) – convert to null
  return null;
}

// Helper function to validate and sanitize payload
function validatePayload(payload: unknown): Record<string, any> {
  try {
    // If payload is undefined or null, return empty object
    if (payload === undefined || payload === null) {
      console.log('[SendNotification] Payload is undefined/null, using empty object');
      return {};
    }

    // If payload is already a valid object, sanitize it
    if (typeof payload === 'object' && !Array.isArray(payload)) {
      const sanitized = toJsonSafe(payload);
      console.log('[SendNotification] Payload sanitized successfully');
      return sanitized || {};
    }

    // If payload is a string, try to parse it as JSON
    if (typeof payload === 'string') {
      try {
        const parsed = JSON.parse(payload);
        const sanitized = toJsonSafe(parsed);
        console.log('[SendNotification] String payload parsed and sanitized');
        return sanitized || {};
      } catch (parseError) {
        console.warn('[SendNotification] Failed to parse string payload as JSON:', parseError.message);
        return { raw_payload: payload };
      }
    }

    // For any other type, wrap it safely
    console.warn('[SendNotification] Unexpected payload type:', typeof payload);
    return { payload: toJsonSafe(payload) };
  } catch (error) {
    console.error('[SendNotification] Error validating payload:', error.message);
    return { error: 'Invalid payload format' };
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
const getSupabaseAdmin = () => {
  const supabaseUrl = getEnv('SUPABASE_URL');
  const supabaseServiceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

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
  type: 'booking_success' | 'booking_failure' | 'reminder_23h' | 'booking_canceled' | string;
  payload?: unknown; // Changed from Record<string, any> to unknown for better validation
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Export the handler for testing
export const testableHandler = async (req: Request): Promise<Response> => {
  // Initialize environment if not already done
  if (!createClient) {
    await initializeEnvironment();
  }
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
    // Validate and sanitize the payload before database insertion
    const validatedPayload = validatePayload(payload);
    console.log('[SendNotification] Payload validation completed for user:', user_id);

    // 1. Insert into notifications table with validated payload
    const { data: notificationRecord, error: insertError } = await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: user_id,
        type: type,
        payload: validatedPayload, // Use validated payload
      })
      .select('id')
      .single();

    if (insertError) {
      console.error(`[SendNotification] Error inserting notification for user ${user_id}, type ${type}: ${insertError.message}`, insertError);
      throw new Error(`Failed to record notification: ${insertError.message}`);
    }
    console.log(`[SendNotification] Notification recorded: ${notificationRecord?.id} for user ${user_id}, type ${type}`);

    // 2. Fetch user email for notifications
    const { data: { user: authUser }, error: adminUserError } = await supabaseAdmin.auth.admin.getUserById(user_id);

    if (adminUserError || !authUser?.email) {
      console.warn(`[SendNotification] Failed to fetch email for user ${user_id} from auth.users: ${adminUserError?.message || 'User not found or email missing'}. Checking public.users as fallback.`);
      const { data: publicUserData, error: publicUserError } = await supabaseAdmin
        .from('users')
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
      const resendApiKey = getEnv('VITE_RESEND_API_KEY') || getEnv('RESEND_API_KEY');
      if (type.toLowerCase().includes('booking') || type === 'reminder_23h') {
        if (resendApiKey) {
          const ResendClass = await initializeResend();
          const resend = new ResendClass(resendApiKey);
          let subject = 'Your Flight Booking Update';
          let htmlBody = `<p>You have a new update regarding your flight booking.</p><p>Details: ${JSON.stringify(validatedPayload)}</p>`;

          switch (type) {
            case 'booking_success':
              subject = '✈️ Your flight is booked!';
              htmlBody = `<h1>Booking Confirmed!</h1>
                          <p>Your flight booking is confirmed.</p>
                          <p><b>Airline:</b> ${validatedPayload?.airline || 'N/A'}</p>
                          <p><b>Flight Number:</b> ${validatedPayload?.flight_number || 'N/A'}</p>
                          <p><b>PNR:</b> ${validatedPayload?.pnr || 'N/A'}</p>
                          <p><b>Departure:</b> ${validatedPayload?.departure_datetime || 'N/A'}</p>
                          <p><b>Arrival:</b> ${validatedPayload?.arrival_datetime || 'N/A'}</p>
                          <p><b>Price:</b> ${validatedPayload?.price ? `$${validatedPayload.price}` : 'N/A'}</p>
                          <p>Thank you for booking with us!</p>`;
              break;
            case 'booking_failure':
              subject = '⚠️ Important: Flight Booking Issue';
              htmlBody = `<h1>Booking Issue</h1>
                          <p>We encountered an issue with your recent flight booking attempt.</p>
                          <p><b>Details:</b> ${validatedPayload?.error || 'An unexpected error occurred.'}</p>
                          <p><b>Offer ID:</b> ${validatedPayload?.flight_offer_id || 'N/A'}</p>
                          <p>Please contact support or try booking again.</p>`;
              break;
            case 'booking_canceled':
              subject = 'ℹ️ Your Flight Booking Has Been Canceled';
              htmlBody = `<h1>Booking Canceled</h1>
                          <p>Your flight booking has been successfully canceled.</p>
                          <p><b>PNR:</b> ${validatedPayload?.pnr || 'N/A'}</p>
                          <p>If you have any questions, please contact support.</p>`;
              break;
            case 'reminder_23h':
              subject = '✈️ Reminder: Your Flight is in Approximately 23 Hours!';
              htmlBody = `<h1>Flight Reminder</h1>
                          <p>This is a reminder that your flight is scheduled in approximately 23 hours.</p>
                          <p><b>PNR:</b> ${validatedPayload?.pnr || 'N/A'}</p>
                          <p><b>Departure:</b> ${validatedPayload?.departure_datetime || 'N/A'}</p>
                          <p>Please check in with your airline and verify your flight details.</p>`;
              break;
          }

          try {
            console.log(`[SendNotification] Sending email to ${userEmail} for user ${user_id}, type ${type}`);
            
            // Create notification delivery record
            const { data: deliveryRecord, error: deliveryError } = await supabaseAdmin
              .from('notification_deliveries')
              .insert({
                notification_id: notificationRecord.id,
                channel: 'email',
                provider: 'resend',
                status: 'queued'
              })
              .select('id')
              .single();
            
            if (deliveryError) {
              console.error(`[SendNotification] Failed to create delivery record: ${deliveryError.message}`);
            }
            
            const emailResult = await resend.emails.send({
              from: getEnv('RESEND_FROM_EMAIL') || 'noreply@yourdomain.com',
              to: [userEmail],
              subject: subject,
              html: htmlBody,
              tags: [
                { name: 'notification_id', value: notificationRecord.id },
                { name: 'type', value: type },
                { name: 'user_id', value: user_id }
              ]
            });
            
            // Update delivery record with email ID
            if (deliveryRecord && emailResult.data?.id) {
              await supabaseAdmin
                .from('notification_deliveries')
                .update({
                  status: 'sent',
                  provider_response: { email_id: emailResult.data.id },
                  sent_at: new Date().toISOString()
                })
                .eq('id', deliveryRecord.id);
            }
            
            console.log(`[SendNotification] Email sent successfully to ${userEmail} via Resend for user ${user_id}. Email ID: ${emailResult.data?.id}`);
          } catch (emailError) {
            console.error(`[SendNotification] Error sending email via Resend for user ${user_id}: ${emailError.message}`, emailError);
            // Error handling for email failure - deliveryRecord will be null here if it was in try block
          }
        } else {
          console.warn(`[SendNotification] RESEND_API_KEY (VITE_RESEND_API_KEY) not configured. Skipping email for user ${user_id}.`);
        }
      } else {
        console.log(`[SendNotification] Email not sent for type "${type}" as it's not a booking-related or reminder type for user ${user_id}.`);
      }
    } else {
        console.warn(`[SendNotification] No email address found for user ${user_id}. Cannot send email notification.`);
    }

    // 4. SMS Fallback (Stub)
    const twilioAccountSid = getEnv('VITE_TWILIO_ACCOUNT_SID') || getEnv('TWILIO_ACCOUNT_SID');
    if (!twilioAccountSid) {
      console.log(`[SendNotification] SMS (Twilio SID) not configured, skipping SMS for user ${user_id}.`);
    } else {
      console.log(`[SendNotification] SMS STUB: Would attempt to send SMS to user ${user_id} for type ${type}. Payload: ${JSON.stringify(validatedPayload)}`);
    }

    return new Response(JSON.stringify({ success: true, notification_id: notificationRecord?.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(`[SendNotification] Handler error for user ${user_id}, type ${type}: ${error.message}`, error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

// Initialize and serve the handler when running in Deno
if (typeof Deno !== 'undefined') {
  initializeEnvironment().then(() => {
    serve(testableHandler);
  }).catch(error => {
    console.error('Failed to initialize Deno environment:', error);
  });
}
