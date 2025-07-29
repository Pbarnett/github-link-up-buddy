import { createClient, User } from 'https://esm.sh/@supabase/supabase-js@2'
import { createTwilioService, SMSTemplateRenderer, validateTwilioConfig } from '../lib/twilio.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-twilio-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Rate limiting: simple in-memory store (in production, use Redis/database)
const requestCounts = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_PER_HOUR = 30 // Following auth.rate_limit.sms_sent from config
const RATE_LIMIT_WINDOW = 3600000 // 1 hour in ms

function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const current = requestCounts.get(identifier)
  
  if (!current || now > current.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }
  
  if (current.count >= RATE_LIMIT_PER_HOUR) {
    return false
  }
  
  current.count++
  return true
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validate Twilio configuration first
    const configValidation = validateTwilioConfig()
    if (!configValidation.isValid) {
      console.error('[SMS] Twilio configuration errors:', configValidation.errors)
      return new Response(JSON.stringify({
        success: false,
        error: 'Twilio configuration invalid',
        details: configValidation.errors
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Log configuration warnings
    if (configValidation.warnings.length > 0) {
      console.warn('[SMS] Twilio configuration warnings:', configValidation.warnings)
    }

    const { user_id, type, data, phone_number } = await req.json()
    
    if (!user_id || !type) {
      throw new Error('Missing required fields: user_id, type')
    }

    // Rate limiting check
    const rateLimitId = phone_number || user_id
    if (!checkRateLimit(rateLimitId)) {
      console.warn(`[SMS] Rate limit exceeded for ${rateLimitId}`)
      return new Response(JSON.stringify({
        success: false,
        error: 'Rate limit exceeded. Maximum 30 SMS per hour.',
        retry_after: 3600
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user info (optional for testing)
    let user: User | null = null
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
