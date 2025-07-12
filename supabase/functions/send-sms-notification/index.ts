import { createTwilioService, SMSTemplateRenderer } from '../lib/twilio.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user_id, type, data, phone_number } = await req.json()
    
    if (!user_id || !type) {
      throw new Error('Missing required fields: user_id, type')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user info (optional for testing)
    let user = null
    if (user_id !== 'test-user' && user_id !== '550e8400-e29b-41d4-a716-446655440000') {
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(user_id)
      if (userError || !userData.user) {
        console.log(`[SMS] Warning: User not found: ${user_id}, proceeding with provided phone number`)
      } else {
        user = userData.user
      }
    }

    // Use provided phone number or get from user metadata  
    const phoneToUse = phone_number || user?.user_metadata?.phone || user?.phone
    if (!phoneToUse) {
      throw new Error('No phone number available - please provide phone_number in request')
    }

    console.log(`[SMS] Sending ${type} SMS to ${phoneToUse} for user ${user_id}`)

    // Initialize Twilio
    const twilioService = createTwilioService()
    
    // Generate SMS content based on notification type
    let smsBody
    switch (type) {
      case 'booking_success':
        smsBody = SMSTemplateRenderer.renderBookingConfirmation({
          passenger_name: user?.user_metadata?.full_name || 'Traveler',
          booking_reference: data.booking_reference || data.pnr,
          origin: data.origin,
          destination: data.destination,
          departure_date: data.departure_date,
          tracking_url: `https://parkerflight.com/booking/${data.booking_reference || data.pnr}`
        })
        break
        
      case 'booking_failure':
        smsBody = SMSTemplateRenderer.renderBookingFailure({
          origin: data.origin,
          destination: data.destination,
          error_reason: data.error_message || 'Unknown error',
          support_url: 'https://parkerflight.com/support'
        })
        break
        
      case 'booking_reminder':
        smsBody = SMSTemplateRenderer.renderBookingReminder({
          flight_number: data.flight_number,
          time_until_departure: data.time_until_departure,
          origin: data.origin,
          destination: data.destination,
          checkin_url: data.checkin_url || 'https://parkerflight.com/checkin'
        })
        break

      case 'price_alert':
        smsBody = SMSTemplateRenderer.renderPriceAlert({
          origin: data.origin,
          destination: data.destination,
          new_price: data.new_price,
          old_price: data.old_price,
          savings: data.savings,
          booking_url: data.booking_url || 'https://parkerflight.com'
        })
        break

      case 'phone_verification':
        smsBody = data.message || `Your Parker Flight verification code is: ${data.verification_code}. This code expires in 10 minutes.`
        break
        
      default:
        smsBody = `Parker Flight: ${data.message || 'You have a new notification'}`
    }

    // Send SMS via Twilio
    const result = await twilioService.sendSMS({
      to: phoneToUse,
      body: smsBody
    })

    console.log(`[SMS] Result:`, result)

    // Log the SMS attempt in notifications table
    try {
      await supabase.from('notifications').insert({
        user_id,
        type,
        payload: { ...data, sms_result: result, phone_number: phoneToUse },
        channel: 'sms',
        status: result.success ? 'sent' : 'failed'
      })
    } catch (dbError) {
      console.error('[SMS] Failed to log to notifications table:', dbError)
      // Don't fail the SMS send if logging fails
    }

    return new Response(JSON.stringify({
      success: result.success,
      message: result.success ? 'SMS sent successfully' : 'SMS failed',
      messageId: result.messageId,
      error: result.error,
      phone_number: phoneToUse,
      sms_body: smsBody
    }), {
      status: result.success ? 200 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('[SMS] Error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
