import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { NotificationQueue } from '../_shared/queue.ts';
import { createTwilioService, SMSTemplateRenderer, TwilioService } from '../lib/twilio.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    await processNotifications();
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('[NotificationWorker] Error:', error);
    return new Response('Error', { status: 500 });
  }
});

async function processNotifications() {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const queues = ['critical_notifications', 'notifications'];
  
  for (const queueName of queues) {
    let job;
    let processedCount = 0;
    const maxBatchSize = 10; // Process up to 10 jobs per run

    while ((job = await NotificationQueue.dequeue(queueName)) && processedCount < maxBatchSize) {
      try {
        console.log(`[NotificationWorker] Processing job ${job.id} from ${queueName}`);
        await processJob(supabaseClient, job);
        await NotificationQueue.complete(queueName, job.id);
        processedCount++;
        console.log(`[NotificationWorker] Completed job ${job.id}`);
      } catch (error) {
        console.error(`[NotificationWorker] Job processing error:`, error);
        await handleJobFailure(job, queueName, error);
      }
    }

    if (processedCount > 0) {
      console.log(`[NotificationWorker] Processed ${processedCount} jobs from ${queueName}`);
    }
  }
}

async function processJob(supabaseClient: any, job: any) {
  const jobData = job.message;
  
  console.log(`[NotificationWorker] Processing ${jobData.channel} notification for user ${jobData.user_id}`);

  // 1. Get user preferences to check if we should send
  const { data: preferences } = await supabaseClient
    .from('user_preferences')
    .select('preferences, quiet_hours, timezone')
    .eq('user_id', jobData.user_id)
    .single();

  // Check if user wants this notification on this channel
  if (!shouldSend(preferences?.preferences, jobData.type, jobData.channel)) {
    console.log(`[NotificationWorker] Skipping ${jobData.type} for user ${jobData.user_id} - preferences`);
    return;
  }

  // Check quiet hours
  if (isInQuietHours(preferences?.quiet_hours, preferences?.timezone)) {
    console.log(`[NotificationWorker] Deferring ${jobData.type} for user ${jobData.user_id} - quiet hours`);
    // Requeue for later (outside quiet hours)
    const nextSendTime = getNextAllowedSendTime(preferences?.quiet_hours, preferences?.timezone);
    jobData.scheduled_for = nextSendTime;
    await NotificationQueue.enqueue(jobData);
    return;
  }

  // 2. Get user contact info
  const { data: { user: authUser }, error: userError } = await supabaseClient.auth.admin.getUserById(jobData.user_id);
  if (userError || !authUser) {
    throw new Error(`User not found: ${jobData.user_id}`);
  }

  // 3. Get template for this notification type and channel
  const { data: template, error: templateError } = await supabaseClient
    .from('notification_templates')
    .select('*')
    .eq('notification_type', jobData.type)
    .eq('channel', jobData.channel)
    .eq('active', true)
    .order('version', { ascending: false })
    .limit(1)
    .single();

  if (templateError || !template) {
    // Fall back to existing send-notification function for now
    console.log(`[NotificationWorker] No template found for ${jobData.type}:${jobData.channel}, using fallback`);
    await sendNotificationFallback(supabaseClient, jobData);
    return;
  }

  // 4. Log delivery attempt
  const { data: delivery, error: deliveryError } = await supabaseClient
    .from('notification_deliveries')
    .insert({
      notification_id: jobData.notification_id,
      channel: jobData.channel,
      provider: getProviderForChannel(jobData.channel),
      status: 'sending',
      attempt_count: jobData.retry_count || 1
    })
    .select()
    .single();

  if (deliveryError) {
    console.error('[NotificationWorker] Failed to log delivery attempt:', deliveryError);
  }

  // 5. Send notification based on channel
  let result;
  try {
    if (jobData.channel === 'email') {
      result = await sendEmail(authUser, template, jobData.data);
    } else if (jobData.channel === 'sms') {
      result = await sendSMS(authUser, template, jobData.data);
    } else if (jobData.channel === 'push') {
      result = await sendPush(authUser, template, jobData.data);
    } else {
      throw new Error(`Unsupported channel: ${jobData.channel}`);
    }
  } catch (sendError) {
    result = { success: false, error: sendError.message };
  }

  // 6. Update delivery status
  if (delivery?.id) {
    await supabaseClient
      .from('notification_deliveries')
      .update({
        status: result.success ? 'sent' : 'failed',
        provider_response: result,
        error_message: result.error,
        sent_at: result.success ? new Date().toISOString() : null
      })
      .eq('id', delivery.id);
  }

  if (!result.success) {
    throw new Error(result.error);
  }

  console.log(`[NotificationWorker] Successfully sent ${jobData.channel} notification to user ${jobData.user_id}`);
}

async function sendEmail(user: any, template: any, data: any): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Dynamic import for Deno environment
    const { Resend } = await import('npm:resend');
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    
    const emailContent = renderTemplate(template, {
      user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Traveler',
      ...data
    });
    
    const result = await resend.emails.send({
      from: Deno.env.get('RESEND_FROM_EMAIL') || 'Parker Flight <noreply@parkerflight.com>',
      to: user.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    });
    
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function sendSMS(user: any, template: any, data: any): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Get user's phone number (you'll need to add this to user metadata or a separate table)
    const phoneNumber = user.phone || user.user_metadata?.phone;
    if (!phoneNumber) {
      return { success: false, error: 'No phone number available' };
    }

    // Initialize Twilio service
    const twilioService = createTwilioService();
    
    // Validate and format phone number
    const formattedPhone = TwilioService.formatPhoneNumber(phoneNumber);
    if (!TwilioService.validatePhoneNumber(formattedPhone)) {
      return { success: false, error: 'Invalid phone number format' };
    }

    // Render SMS content based on notification type
    let smsBody;
    if (template.body_text) {
      // Use template if available
      smsBody = template.body_text.replace(/\{\{(\w+)\}\}/g, (match: string, key: string) => data[key] || match);
    } else {
      // Use predefined templates for known types
      switch (data.type || template.notification_type) {
        case 'booking_success':
          smsBody = SMSTemplateRenderer.renderBookingConfirmation(data);
          break;
        case 'price_alert':
          smsBody = SMSTemplateRenderer.renderPriceAlert(data);
          break;
        case 'booking_reminder':
          smsBody = SMSTemplateRenderer.renderBookingReminder(data);
          break;
        case 'booking_failure':
          smsBody = SMSTemplateRenderer.renderBookingFailure(data);
          break;
        default:
          smsBody = `Parker Flight: ${data.message || 'You have a new notification'}`;
      }
    }

    // Send SMS via Twilio
    const result = await twilioService.sendSMS({
      to: formattedPhone,
      body: smsBody
    });

    console.log(`[NotificationWorker] SMS ${result.success ? 'sent' : 'failed'} to ${formattedPhone}:`, result);
    
    return result;
  } catch (error) {
    console.error('[NotificationWorker] SMS Error:', error);
    return { success: false, error: error.message };
  }
}

async function sendPush(user: any, template: any, data: any): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Push notification implementation would go here
    console.log(`[NotificationWorker] Push notification would be sent to user ${user.id}`);
    
    return { success: true, messageId: 'mock-push-id' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function sendNotificationFallback(supabaseClient: any, jobData: any) {
  // Call the existing send-notification function as fallback
  try {
    const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-notification`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: jobData.user_id,
        type: jobData.type,
        payload: jobData.data
      })
    });

    if (!response.ok) {
      throw new Error(`Fallback notification failed: ${response.status}`);
    }

    console.log(`[NotificationWorker] Fallback notification sent for user ${jobData.user_id}`);
  } catch (error) {
    console.error('[NotificationWorker] Fallback notification failed:', error);
    throw error;
  }
}

function renderTemplate(template: any, data: any): { subject: string; html: string; text: string } {
  const subject = template.subject?.replace(/\{\{(\w+)\}\}/g, (match: string, key: string) => data[key] || match) || '';
  const html = template.body_html?.replace(/\{\{(\w+)\}\}/g, (match: string, key: string) => data[key] || match) || '';
  const text = template.body_text.replace(/\{\{(\w+)\}\}/g, (match: string, key: string) => data[key] || match);
  
  return { subject, html, text };
}

function shouldSend(preferences: any, type: string, channel: string): boolean {
  // Default to true for critical notifications
  const criticalTypes = ['booking_success', 'booking_failure'];
  if (criticalTypes.includes(type)) return true;
  
  // Check user preferences
  const pref = preferences?.[type]?.[channel];
  return pref !== false; // Default to true if not explicitly disabled
}

function isInQuietHours(quietHours: any, timezone: string = 'America/New_York'): boolean {
  if (!quietHours?.start || !quietHours?.end) return false;
  
  try {
    const now = new Date();
    const userTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
    const currentHour = userTime.getHours();
    
    const startHour = quietHours.start;
    const endHour = quietHours.end;
    
    // Handle cases where quiet hours span midnight
    if (startHour > endHour) {
      return currentHour >= startHour || currentHour < endHour;
    } else {
      return currentHour >= startHour && currentHour < endHour;
    }
  } catch (error) {
    console.error('[NotificationWorker] Error checking quiet hours:', error);
    return false;
  }
}

function getNextAllowedSendTime(quietHours: any, timezone: string = 'America/New_York'): string {
  try {
    const now = new Date();
    const userTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
    const endHour = quietHours?.end || 7;
    
    // Schedule for end of quiet hours
    const nextSend = new Date(userTime);
    nextSend.setHours(endHour, 0, 0, 0);
    
    // If end time is today but has passed, schedule for tomorrow
    if (nextSend <= userTime) {
      nextSend.setDate(nextSend.getDate() + 1);
    }
    
    return nextSend.toISOString();
  } catch (error) {
    console.error('[NotificationWorker] Error calculating next send time:', error);
    // Default to 1 hour from now
    return new Date(Date.now() + 60 * 60 * 1000).toISOString();
  }
}

function getProviderForChannel(channel: string): string {
  const providers = {
    'email': 'resend',
    'sms': 'twilio',
    'push': 'web-push',
    'in_app': 'supabase'
  };
  return providers[channel] || 'unknown';
}

async function handleJobFailure(job: any, queueName: string, error: any) {
  const retryCount = (job.message.retry_count || 0) + 1;
  const maxRetries = 5;
  
  if (retryCount <= maxRetries) {
    // Exponential backoff: 30s, 2m, 10m, 1h, 4h
    const delays = [30, 120, 600, 3600, 14400];
    const delay = delays[Math.min(retryCount - 1, delays.length - 1)];
    
    console.log(`[NotificationWorker] Retrying job ${job.id} (attempt ${retryCount}) in ${delay}s`);
    
    await NotificationQueue.requeue({
      ...job.message,
      retry_count: retryCount
    }, delay);
  } else {
    console.error(`[NotificationWorker] Job ${job.id} failed after ${maxRetries} retries:`, error);
    // Move to dead letter queue or log for manual intervention
    // For now, just log the failure
  }
}
