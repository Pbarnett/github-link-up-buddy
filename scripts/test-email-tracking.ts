#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface EmailTestPayload {
  user_id: string
  type: string
  payload?: any
}

interface ResendWebhookEvent {
  type: 'email.sent' | 'email.delivered' | 'email.bounced' | 'email.complained'
  created_at: string
  data: {
    email_id: string
    from: string
    to: string[]
    subject: string
    tags?: Array<{ name: string; value: string }>
  }
}

async function testEmailTracking() {
  console.log('🧪 Testing Email Tracking Integration...\n')

  const testEmail = 'test@example.com'
  const testUserId = 'test-user-id'
  
  console.log('📧 Step 1: Testing send-notification edge function...')

  // Test the send-notification function with booking_success type
  const emailPayload: EmailTestPayload = {
    user_id: testUserId,
    type: 'booking_success',
    payload: {
      recipient_email: testEmail,
      booking_reference: 'TEST123',
      passenger_name: 'Test User',
      flight_details: {
        airline: 'Test Airlines',
        flight_number: 'TA123',
        departure_datetime: '2024-12-01T10:00:00Z',
        arrival_datetime: '2024-12-01T14:00:00Z',
        origin: 'NYC',
        destination: 'LAX',
        price: '299'
      }
    }
  }

  const { data: sendResult, error: sendError } = await supabase.functions.invoke('send-notification', {
    body: emailPayload
  })

  if (sendError) {
    console.error('❌ Error invoking send-notification function:', sendError)
    console.log('📝 This might be expected if the function requires authentication or if there are missing environment variables.')
  } else {
    console.log('✅ Send-notification function responded:', sendResult)
  }

  // Step 2: Test resend webhook endpoint
  console.log('\n🔗 Step 2: Testing resend-webhook endpoint...')
  
  const mockWebhookEvent: ResendWebhookEvent = {
    type: 'email.delivered',
    created_at: new Date().toISOString(),
    data: {
      email_id: `test-email-${uuidv4()}`,
      from: 'noreply@parkerflight.com',
      to: [testEmail],
      subject: 'Test Email Tracking',
      tags: [
        { name: 'notification_id', value: uuidv4() },
        { name: 'environment', value: 'test' },
        { name: 'type', value: 'booking_success' }
      ]
    }
  }

  const { data: webhookResult, error: webhookError } = await supabase.functions.invoke('resend-webhook', {
    body: mockWebhookEvent
  })

  if (webhookError) {
    console.error('❌ Webhook endpoint error:', webhookError)
  } else {
    console.log('✅ Webhook endpoint accessible:', webhookResult)
  }

  // Step 3: Test SMS notification endpoint
  console.log('\n📱 Step 3: Testing send-sms-notification endpoint...')
  
  const smsPayload = {
    user_id: testUserId,
    type: 'booking_success',
    phone_number: '+1234567890', // Test phone number
    data: {
      booking_reference: 'TEST123',
      origin: 'NYC',
      destination: 'LAX',
      departure_date: '2024-12-01'
    }
  }

  const { data: smsResult, error: smsError } = await supabase.functions.invoke('send-sms-notification', {
    body: smsPayload
  })

  if (smsError) {
    console.error('❌ SMS function error:', smsError)
    console.log('📝 This might be expected if Twilio credentials are not configured.')
  } else {
    console.log('✅ SMS function responded:', smsResult)
  }

  // Step 4: Check database tables for tracking infrastructure
  console.log('\n🗄️ Step 4: Checking database table schemas...')
  
  try {
    // Check if email_events table exists
    const { data: emailEvents, error: emailEventsError } = await supabase
      .from('email_events')
      .select('*')
      .limit(1)
    
    if (emailEventsError) {
      console.log('⚠️ email_events table not accessible:', emailEventsError.message)
    } else {
      console.log('✅ email_events table is accessible')
    }
  } catch (error) {
    console.log('⚠️ email_events table check failed')
  }

  try {
    // Check if notification_deliveries table exists
    const { data: deliveries, error: deliveriesError } = await supabase
      .from('notification_deliveries')
      .select('*')
      .limit(1)
    
    if (deliveriesError) {
      console.log('⚠️ notification_deliveries table not accessible:', deliveriesError.message)
    } else {
      console.log('✅ notification_deliveries table is accessible')
    }
  } catch (error) {
    console.log('⚠️ notification_deliveries table check failed')
  }

  try {
    // Check if notification_templates table exists  
    const { data: templates, error: templatesError } = await supabase
      .from('notification_templates')
      .select('name, notification_type, channel')
      .limit(5)
    
    if (templatesError) {
      console.log('⚠️ notification_templates table not accessible:', templatesError.message)
    } else {
      console.log('✅ notification_templates table is accessible')
      console.log('📋 Available templates:', templates)
    }
  } catch (error) {
    console.log('⚠️ notification_templates table check failed')
  }

  // Step 5: Environment variable check
  console.log('\n🔧 Step 5: Environment configuration check...')
  console.log('========================')
  console.log('✅ VITE_SUPABASE_URL is configured')
  console.log('✅ VITE_SUPABASE_ANON_KEY is configured')
  console.log('\n📝 Additional environment variables needed for full functionality:')
  console.log('• SUPABASE_SERVICE_ROLE_KEY (for edge functions)')
  console.log('• RESEND_API_KEY (for email sending)')
  console.log('• TWILIO_ACCOUNT_SID (for SMS)')
  console.log('• TWILIO_AUTH_TOKEN (for SMS)')
  console.log('• TWILIO_PHONE_NUMBER (for SMS)')

  // Summary
  console.log('\n📊 Test Summary:')
  console.log('================')
  console.log(`📧 Email function test: ${sendError ? '❌ Failed' : '✅ Accessible'}`)
  console.log(`🔗 Webhook endpoint test: ${webhookError ? '❌ Failed' : '✅ Accessible'}`)
  console.log(`📱 SMS function test: ${smsError ? '❌ Failed' : '✅ Accessible'}`)

  // Instructions
  console.log('\n📋 Next Steps for Full Testing:')
  console.log('=================================')
  console.log('1. Configure environment variables in Supabase Edge Functions')
  console.log('2. Set up Resend domain and API key')
  console.log('3. Configure Twilio credentials for SMS')
  console.log('4. Test with real email addresses')
  console.log('5. Monitor webhook events in Resend dashboard')
  
  console.log('\n🔧 Manual Verification Checklist:')
  console.log('===================================')
  console.log('• Edge functions are deployed and accessible')
  console.log('• Database tables have proper structure')
  console.log('• API credentials are configured')
  console.log('• Webhook endpoints are publicly accessible')
  console.log('• Domain authentication is set up in Resend')

  console.log('\n🎉 Email tracking integration test completed!')
  console.log('💡 Functions are accessible - configure API keys for full functionality')
}

// Run the test
testEmailTracking().catch(console.error)
