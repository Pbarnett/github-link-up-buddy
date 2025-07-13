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

interface DetailedTestResult {
  step: string
  success: boolean
  data?: unknown
  error?: unknown
  notes?: string
}

async function getDetailedErrorInfo(error: unknown): Promise<string> {
  try {
    if (error && typeof error === 'object' && 'context' in error) {
      const errorObj = error as { context: { body?: unknown } }
      if (errorObj.context && errorObj.context.body) {
        const response = errorObj.context as Response
        const errorText = await response.text()
        return errorText
      }
    }
  } catch (e) {
    // Ignore parsing errors
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message
  }
  return 'Unknown error'
}

async function testEmailTrackingDetailed() {
  console.log('🔬 Detailed Email Tracking Integration Test\n')
  
  const results: DetailedTestResult[] = []
  const testEmail = 'test@example.com'
const testUserId = uuidv4()

  // Test 1: Basic connectivity
  console.log('📡 Test 1: Basic Supabase connectivity...')
  try {
    const { data, error } = await supabase.from('notification_templates').select('count').single()
    results.push({
      step: 'Basic Connectivity',
      success: !error,
      data: data,
      error: error,
      notes: 'Tests basic database connection'
    })
    console.log(error ? '❌ Connection failed' : '✅ Connection successful')
  } catch (error) {
    results.push({
      step: 'Basic Connectivity',
      success: false,
      error: error,
      notes: 'Failed to establish database connection'
    })
    console.log('❌ Connection failed')
  }

  // Test 2: Edge Function Status Check
  console.log('\n🔧 Test 2: Edge Function Status Check...')
  
  const functions = ['send-notification', 'resend-webhook', 'send-sms-notification']
  
  for (const funcName of functions) {
    try {
      // Try OPTIONS request first to check if function exists
      const { data, error } = await supabase.functions.invoke(funcName, {
        method: 'OPTIONS'
      })
      
      results.push({
        step: `${funcName} OPTIONS`,
        success: !error,
        data: data,
        error: error,
        notes: 'OPTIONS preflight check'
      })
      
      console.log(`  ${funcName}: ${error ? '❌ Not accessible' : '✅ Accessible'}`)
    } catch (error) {
      results.push({
        step: `${funcName} OPTIONS`,
        success: false,
        error: error,
        notes: 'Function not found or not accessible'
      })
      console.log(`  ${funcName}: ❌ Not accessible`)
    }
  }

  // Test 3: Detailed send-notification function test
  console.log('\n📧 Test 3: Detailed send-notification test...')
  
  const emailPayload = {
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

  try {
    const { data: sendResult, error: sendError } = await supabase.functions.invoke('send-notification', {
      body: emailPayload
    })

    const detailedError = sendError ? await getDetailedErrorInfo(sendError) : null
    
    results.push({
      step: 'Send Notification Function',
      success: !sendError,
      data: sendResult,
      error: detailedError,
      notes: 'Testing email notification sending'
    })

    if (sendError) {
      console.log('❌ Function failed')
      console.log('📋 Error details:', detailedError)
    } else {
      console.log('✅ Function succeeded')
      console.log('📋 Response:', sendResult)
    }
  } catch (error) {
    const errorMessage = error && typeof error === 'object' && 'message' in error ? (error as { message: string }).message : 'Unknown error'
    console.log('❌ Function test failed:', errorMessage)
  }

  // Test 4: Template verification
  console.log('\n📋 Test 4: Template verification...')
  
  try {
    const { data: templates, error: templatesError } = await supabase
      .from('notification_templates')
      .select('*')
      .eq('notification_type', 'booking_success')

    results.push({
      step: 'Template Verification',
      success: !templatesError,
      data: templates,
      error: templatesError,
      notes: 'Checking available notification templates'
    })

    if (!templatesError && templates?.length > 0) {
      console.log('✅ Templates found:')
      templates.forEach(template => {
        console.log(`   • ${template.name} (${template.channel})`)
      })
    } else {
      console.log('❌ No templates found or error occurred')
    }
  } catch (error) {
    console.log('❌ Template check failed')
  }

  // Test 5: Database schema verification
  console.log('\n🗄️ Test 5: Database schema verification...')
  
  const tables = [
    'notification_templates',
    'notification_deliveries', 
    'email_events',
    'email_suppressions',
    'email_engagement'
  ]

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)

      const tableExists = !error || !error.message.includes('does not exist')
      
      results.push({
        step: `Table: ${table}`,
        success: tableExists,
        data: tableExists ? 'Table exists' : null,
        error: error,
        notes: `Schema verification for ${table}`
      })

      console.log(`   ${table}: ${tableExists ? '✅ Exists' : '❌ Missing'}`)
    } catch (error) {
      console.log(`   ${table}: ❌ Error checking`)
    }
  }

  // Test 6: Environment configuration analysis
  console.log('\n🔧 Test 6: Environment configuration analysis...')
  
  const envVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'RESEND_API_KEY',
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_PHONE_NUMBER'
  ]

  envVars.forEach(envVar => {
    const value = process.env[envVar]
    const configured = !!value
    const masked = configured ? `${value.substring(0, 8)}...` : 'Not set'
    
    results.push({
      step: `Env: ${envVar}`,
      success: configured,
      data: configured ? 'Configured' : 'Missing',
      notes: `Environment variable status: ${masked}`
    })

    console.log(`   ${envVar}: ${configured ? '✅' : '❌'} ${masked}`)
  })

  // Test 7: Webhook simulation
  console.log('\n🔗 Test 7: Webhook simulation...')
  
  const mockWebhookEvent = {
    type: 'email.delivered',
    created_at: new Date().toISOString(),
    data: {
      email_id: `test-email-${uuidv4()}`,
      from: 'noreply@parkerflight.com',
      to: [testEmail],
      subject: 'Test Email Tracking',
      tags: [
        { name: 'notification_id', value: uuidv4() },
        { name: 'environment', value: 'test' }
      ]
    }
  }

  try {
    const { data: webhookResult, error: webhookError } = await supabase.functions.invoke('resend-webhook', {
      body: mockWebhookEvent
    })

    const detailedWebhookError = webhookError ? await getDetailedErrorInfo(webhookError) : null

    results.push({
      step: 'Webhook Simulation',
      success: !webhookError,
      data: webhookResult,
      error: detailedWebhookError,
      notes: 'Testing webhook event processing'
    })

    if (webhookError) {
      console.log('❌ Webhook failed')
      console.log('📋 Error details:', detailedWebhookError)
    } else {
      console.log('✅ Webhook processed successfully')
      console.log('📋 Response:', webhookResult)
    }
  } catch (error) {
    const errorMessage = error && typeof error === 'object' && 'message' in error ? (error as { message: string }).message : 'Unknown error'
    console.log('❌ Webhook test failed:', errorMessage)
  }

  // Generate detailed report
  console.log('\n📊 DETAILED TEST REPORT')
  console.log('='.repeat(50))
  
  const successCount = results.filter(r => r.success).length
  const totalCount = results.length
  
  console.log(`Overall Success Rate: ${successCount}/${totalCount} (${Math.round(successCount/totalCount*100)}%)`)
  console.log('\nDetailed Results:')
  
  results.forEach((result, index) => {
    const status = result.success ? '✅' : '❌'
    console.log(`\n${index + 1}. ${status} ${result.step}`)
    if (result.notes) {
      console.log(`   Notes: ${result.notes}`)
    }
    if (!result.success && result.error) {
      console.log(`   Error: ${typeof result.error === 'string' ? result.error : JSON.stringify(result.error, null, 2)}`)
    }
    if (result.success && result.data) {
      console.log(`   Data: ${typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)}`)
    }
  })

  // Recommendations
  console.log('\n💡 RECOMMENDATIONS')
  console.log('='.repeat(50))
  
  const failedTests = results.filter(r => !r.success)
  
  if (failedTests.length === 0) {
    console.log('🎉 All tests passed! Your email tracking system is fully functional.')
  } else {
    console.log('🔧 Issues found that need attention:')
    
    const missingEnvVars = failedTests.filter(t => t.step.startsWith('Env:'))
    if (missingEnvVars.length > 0) {
      console.log('\n📝 Missing Environment Variables:')
      missingEnvVars.forEach(test => {
        console.log(`   • ${test.step.replace('Env: ', '')}`)
      })
      console.log('\n   Configure these in your Supabase project settings or .env file')
    }

    const failedFunctions = failedTests.filter(t => t.step.includes('Function') || t.step.includes('Notification'))
    if (failedFunctions.length > 0) {
      console.log('\n🔧 Function Issues:')
      failedFunctions.forEach(test => {
        console.log(`   • ${test.step}: Check logs and environment variables`)
      })
    }

    const missingTables = failedTests.filter(t => t.step.startsWith('Table:'))
    if (missingTables.length > 0) {
      console.log('\n🗄️ Missing Database Tables:')
      missingTables.forEach(test => {
        console.log(`   • ${test.step.replace('Table: ', '')}`)
      })
      console.log('\n   Run database migrations to create missing tables')
    }
  }

  console.log('\n🎯 NEXT STEPS')
  console.log('='.repeat(50))
  console.log('1. Configure missing environment variables')
  console.log('2. Ensure all edge functions are deployed')
  console.log('3. Run database migrations if tables are missing')
  console.log('4. Test with real email addresses once configured')
  console.log('5. Set up domain authentication in Resend')
  console.log('6. Configure Twilio phone number for SMS')
  
  console.log('\n✨ Test completed successfully!')
}

// Run the detailed test
testEmailTrackingDetailed().catch(console.error)
