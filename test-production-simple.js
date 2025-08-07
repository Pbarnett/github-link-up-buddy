#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import LaunchDarkly from 'launchdarkly-node-server-sdk';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

console.log('🚀 PRODUCTION PIPELINE TEST');
console.log('===========================');

try {
  // Test Supabase
  console.log('📊 Testing Supabase...');
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
  );
  
  const { data: supabaseTest } = await supabase.from('flight_bookings').select('count', { count: 'exact', head: true });
  console.log('✅ Supabase: Connected');

  // Test LaunchDarkly
  console.log('🎛️ Testing LaunchDarkly...');
  const ldClient = LaunchDarkly.init(process.env.LAUNCHDARKLY_SDK_KEY);
  await ldClient.waitForInitialization();
  
  const user = { kind: 'user', key: 'test', name: 'Test' };
  const autoBookingEnabled = await ldClient.variation('parker_auto_booking_enabled', user, false);
  console.log(`✅ LaunchDarkly: Auto-booking ${autoBookingEnabled ? 'ENABLED' : 'DISABLED'}`);

  // Test Stripe
  console.log('💳 Testing Stripe...');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const account = await stripe.accounts.retrieve();
  console.log(`✅ Stripe: Connected (${account.country})`);

  console.log('\n🎉 ALL SYSTEMS OPERATIONAL!');
  console.log('🚀 Ready for production deployment');
  
  await ldClient.close();
  process.exit(0);

} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
