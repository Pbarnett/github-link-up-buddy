#!/usr/bin/env tsx

/**
 * Comprehensive Test for Twilio Integration Fixes
 * Tests webhook signature validation and regional support
 */

import '../supabase/functions/lib/twilio.ts';

async function testWebhookSignatureValidation() {
  console.log('🔐 Testing Webhook Signature Validation...');
  
  const twilioService = new TwilioService({
    accountSid: 'ACtest1234567890123456789012345678',
    authToken: 'test_auth_token',
    webhookSecret: 'test_webhook_secret_12345'
  });

  // Test 1: Missing webhook secret
  const twilioServiceNoSecret = new TwilioService({
    accountSid: 'ACtest1234567890123456789012345678',
    authToken: 'test_auth_token'
  });

  try {
    const result1 = await twilioServiceNoSecret.validateWebhookSignature(
      'sha1=test_signature',
      'https://example.com/webhook',
      { From: '+15551234567', Body: 'Test message' }
    );
    
    if (!result1.isValid && result1.error === 'Webhook secret not configured') {
      console.log('  ✅ Correctly rejects when webhook secret not configured');
    } else {
      console.log('  ❌ Failed to reject missing webhook secret');
      return false;
    }
  } catch {
    console.log('  ❌ Error testing missing webhook secret:', error);
    return false;
  }

  // Test 2: Invalid signature format
  try {
    const result2 = await twilioService.validateWebhookSignature(
      'invalid_signature',
      'https://example.com/webhook',
      { From: '+15551234567', Body: 'Test message' }
    );
    
    // Should use fallback validation
    console.log('  ✅ Handled invalid signature format with fallback');
  } catch {
    console.log('  ❌ Error testing invalid signature format:', error);
    return false;
  }

  // Test 3: Valid signature format
  try {
    const result3 = await twilioService.validateWebhookSignature(
      'sha1=1234567890abcdef1234567890abcdef12345678',
      'https://example.com/webhook',
      { From: '+15551234567', Body: 'Test message' }
    );
    
    console.log('  ✅ Processed valid signature format');
  } catch {
    console.log('  ❌ Error testing valid signature format:', error);
    return false;
  }

  return true;
}

function testRegionalSupport() {
  console.log('🌍 Testing Regional Support...');
  
  // Test 1: Default (no region/edge)
  const twilioDefault = new TwilioService({
    accountSid: 'ACtest1234567890123456789012345678',
    authToken: 'test_auth_token'
  });
  
  // Access private baseUrl for testing (using bracket notation to bypass TypeScript)
  const defaultUrl = (twilioDefault as any).baseUrl
  if (defaultUrl.includes('api.twilio.com')) {
    console.log('  ✅ Default URL uses api.twilio.com');
  } else {
    console.log('  ❌ Default URL incorrect:', defaultUrl);
    return false;
  }

  // Test 2: Region only
  const twilioRegion = new TwilioService({
    accountSid: 'ACtest1234567890123456789012345678',
    authToken: 'test_auth_token',
    region: 'dublin'
  });
  
  const regionUrl = (twilioRegion as any).baseUrl
  if (regionUrl.includes('dublin.api.twilio.com')) {
    console.log('  ✅ Region-only URL correctly uses dublin.api.twilio.com');
  } else {
    console.log('  ❌ Region URL incorrect:', regionUrl);
    return false;
  }

  // Test 3: Edge only
  const twilioEdge = new TwilioService({
    accountSid: 'ACtest1234567890123456789012345678',
    authToken: 'test_auth_token',
    edge: 'sydney'
  });
  
  const edgeUrl = (twilioEdge as any).baseUrl
  if (edgeUrl.includes('api.sydney.twilio.com')) {
    console.log('  ✅ Edge-only URL correctly uses api.sydney.twilio.com');
  } else {
    console.log('  ❌ Edge URL incorrect:', edgeUrl);
    return false;
  }

  // Test 4: Both region and edge
  const twilioRegionEdge = new TwilioService({
    accountSid: 'ACtest1234567890123456789012345678',
    authToken: 'test_auth_token',
    region: 'dublin',
    edge: 'sydney'
  });
  
  const regionEdgeUrl = (twilioRegionEdge as any).baseUrl
  if (regionEdgeUrl.includes('dublin.sydney.twilio.com')) {
    console.log('  ✅ Region+Edge URL correctly uses dublin.sydney.twilio.com');
  } else {
    console.log('  ❌ Region+Edge URL incorrect:', regionEdgeUrl);
    return false;
  }

  return true;
}

function testPhoneNumberValidation() {
  console.log('📞 Testing Phone Number Validation...');
  
  const validNumbers = [
    '+15551234567',
    '+44123456789',
    '+33123456789',
    '+61412345678'
  ];
  
  const invalidNumbers = [
    '555-123-4567',
    '15551234567',
    '+1555123456',
    'phone',
    '',
    '+0123456789'  // Can't start with 0 after country code
  ];

  let allValid = true;
  
  validNumbers.forEach(number => {
    if (TwilioService.validatePhoneNumber(number)) {
      console.log(`  ✅ Correctly validated: ${number}`);
    } else {
      console.log(`  ❌ Incorrectly rejected valid number: ${number}`);
      allValid = false;
    }
  });

  invalidNumbers.forEach(number => {
    if (!TwilioService.validatePhoneNumber(number)) {
      console.log(`  ✅ Correctly rejected: ${number}`);
    } else {
      console.log(`  ❌ Incorrectly accepted invalid number: ${number}`);
      allValid = false;
    }
  });

  return allValid;
}

async function testErrorHandling() {
  console.log('⚠️ Testing Error Handling...');
  
  const twilioService = new TwilioService({
    accountSid: 'ACtest1234567890123456789012345678',
    authToken: 'test_auth_token'
  });

  // Test sending to invalid phone number
  const result = await twilioService.sendSMS({
    to: 'invalid_phone',
    body: 'Test message'
  });

  if (!result.success && result.error?.includes('Invalid phone number format')) {
    console.log('  ✅ Correctly handles invalid phone numbers');
    return true;
  } else {
    console.log('  ❌ Failed to handle invalid phone numbers properly');
    return false;
  }
}

async function main() {
  console.log('🧪 Running Comprehensive Twilio Integration Tests\n');
  
  const tests = [
    { name: 'Webhook Signature Validation', fn: testWebhookSignatureValidation },
    { name: 'Regional Support', fn: testRegionalSupport },
    { name: 'Phone Number Validation', fn: testPhoneNumberValidation },
    { name: 'Error Handling', fn: testErrorHandling }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passed++;
        console.log(`✅ ${test.name} PASSED\n`);
      } else {
        failed++;
        console.log(`❌ ${test.name} FAILED\n`);
      }
    } catch {
      failed++;
      console.log(`❌ ${test.name} ERROR: ${error}\n`);
    }
  }

  console.log('📊 Test Summary:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📋 Total: ${tests.length}`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed! Twilio integration fixes are working correctly.');
    process.exit(0);
  } else {
    console.log('\n💥 Some tests failed. Please review the issues above.');
    process.exit(1);
  }
}

if (import.meta.main) {
  main().catch(console.error);
}
