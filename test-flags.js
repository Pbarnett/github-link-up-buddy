#!/usr/bin/env node

import LaunchDarkly from 'launchdarkly-node-server-sdk';
import dotenv from 'dotenv';

dotenv.config();

async function testFlags() {
  console.log('🧪 Testing LaunchDarkly Flag Setup');
  console.log('==================================');
  
  const sdkKey = process.env.LAUNCHDARKLY_SDK_KEY;
  if (!sdkKey) {
    console.error('❌ LAUNCHDARKLY_SDK_KEY not found in environment');
    process.exit(1);
  }
  
  console.log('✅ SDK Key found');
  
  const client = LaunchDarkly.init(sdkKey);
  
  try {
    await client.waitForInitialization();
    console.log('✅ LaunchDarkly client initialized');
    
    // Test user context
    const user = {
      kind: 'user',
      key: 'test-user',
      name: 'Test User'
    };
    
    // Test all 7 flags
    const flags = [
      'parker_auto_booking_enabled',
      'parker_emergency_disable', 
      'parker_flight_monitoring',
      'parker_payment_processing',
      'parker_concurrency_control',
      'parker_max_bookings',
      'parker_booking_timeout'
    ];
    
    console.log('\n📋 Testing Flag Values:');
    console.log('=======================');
    
    for (const flagKey of flags) {
      try {
        let value;
        if (flagKey === 'parker_max_bookings' || flagKey === 'parker_booking_timeout') {
          value = await client.variation(flagKey, user, 0);
        } else {
          value = await client.variation(flagKey, user, false);
        }
        console.log(`✅ ${flagKey}: ${value}`);
      } catch (error) {
        console.log(`❌ ${flagKey}: ERROR - ${error.message}`);
      }
    }
    
    console.log('\n🎉 Flag test complete!');
    
  } catch (error) {
    console.error('❌ LaunchDarkly initialization failed:', error.message);
  } finally {
    await client.close();
  }
}

testFlags().catch(console.error);
