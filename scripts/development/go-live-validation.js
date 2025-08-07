#!/usr/bin/env node

import LaunchDarkly from 'launchdarkly-node-server-sdk';
import dotenv from 'dotenv';

dotenv.config();

console.log('🎯 GO-LIVE VALIDATION & CONTROL');
console.log('===============================');

const ldClient = LaunchDarkly.init(process.env.LAUNCHDARKLY_SDK_KEY);

try {
  await ldClient.waitForInitialization();
  console.log('✅ LaunchDarkly connected');
  
  const user = { kind: 'user', key: 'go-live-check', name: 'Go Live Check' };
  
  // Get current flag states
  const flags = {
    autoBookingEnabled: await ldClient.variation('parker_auto_booking_enabled', user, false),
    emergencyDisable: await ldClient.variation('parker_emergency_disable', user, false),
    flightMonitoring: await ldClient.variation('parker_flight_monitoring', user, false),
    paymentProcessing: await ldClient.variation('parker_payment_processing', user, false),
    concurrencyControl: await ldClient.variation('parker_concurrency_control', user, false),
    maxBookings: await ldClient.variation('parker_max_bookings', user, 0),
    bookingTimeout: await ldClient.variation('parker_booking_timeout', user, 0)
  };
  
  console.log('\n📊 CURRENT SYSTEM STATE:');
  console.log('========================');
  console.log(`🤖 Auto-booking: ${flags.autoBookingEnabled ? '🟢 ENABLED' : '🔴 DISABLED'}`);
  console.log(`🚨 Emergency disable: ${flags.emergencyDisable ? '🔴 ACTIVE' : '🟢 INACTIVE'}`);
  console.log(`👁️ Flight monitoring: ${flags.flightMonitoring ? '🟢 ON' : '🔴 OFF'}`);
  console.log(`💳 Payment processing: ${flags.paymentProcessing ? '🟢 ON' : '🔴 OFF'}`);
  console.log(`🔒 Concurrency control: ${flags.concurrencyControl ? '🟢 ON' : '🔴 OFF'}`);
  console.log(`📊 Max bookings: ${flags.maxBookings}`);
  console.log(`⏱️ Booking timeout: ${flags.bookingTimeout}s`);
  
  // Safety checks
  console.log('\n🛡️ SAFETY VALIDATION:');
  console.log('=====================');
  
  const safetyChecks = [];
  
  if (flags.emergencyDisable) {
    safetyChecks.push('❌ Emergency disable is ACTIVE - system will not process bookings');
  } else {
    safetyChecks.push('✅ Emergency disable is inactive');
  }
  
  if (flags.concurrencyControl) {
    safetyChecks.push('✅ Concurrency control is enabled');
  } else {
    safetyChecks.push('⚠️ Concurrency control is disabled - risk of race conditions');
  }
  
  if (flags.maxBookings > 0 && flags.maxBookings <= 5) {
    safetyChecks.push(`✅ Conservative booking limit: ${flags.maxBookings}`);
  } else if (flags.maxBookings > 5) {
    safetyChecks.push(`⚠️ High booking limit: ${flags.maxBookings} - monitor closely`);
  } else {
    safetyChecks.push('❌ Max bookings is 0 - no bookings will be processed');
  }
  
  if (flags.bookingTimeout >= 180 && flags.bookingTimeout <= 600) {
    safetyChecks.push(`✅ Reasonable timeout: ${flags.bookingTimeout}s`);
  } else {
    safetyChecks.push(`⚠️ Timeout may be suboptimal: ${flags.bookingTimeout}s`);
  }
  
  safetyChecks.forEach(check => console.log(`   ${check}`));
  
  // Go-live readiness
  console.log('\n🚀 GO-LIVE READINESS:');
  console.log('====================');
  
  const canGoLive = !flags.emergencyDisable && 
                   flags.flightMonitoring && 
                   flags.paymentProcessing && 
                   flags.concurrencyControl && 
                   flags.maxBookings > 0;
  
  if (canGoLive) {
    console.log('✅ System is ready for auto-booking activation');
    console.log('');
    console.log('🎯 TO ENABLE AUTO-BOOKING:');
    console.log('   1. Set parker_auto_booking_enabled = true in LaunchDarkly');
    console.log('   2. Monitor system logs and metrics closely');  
    console.log('   3. Keep emergency disable ready if needed');
    console.log('   4. Start with low max_bookings and increase gradually');
  } else {
    console.log('❌ System is NOT ready for auto-booking');
    console.log('');
    console.log('🔧 REQUIRED ACTIONS:');
    if (flags.emergencyDisable) console.log('   • Disable emergency flag');
    if (!flags.flightMonitoring) console.log('   • Enable flight monitoring');
    if (!flags.paymentProcessing) console.log('   • Enable payment processing');
    if (!flags.concurrencyControl) console.log('   • Enable concurrency control');
    if (flags.maxBookings <= 0) console.log('   • Set max_bookings > 0');
  }
  
  console.log('\n🎛️ MANUAL CONTROL COMMANDS:');
  console.log('===========================');
  console.log('Emergency stop: Set parker_emergency_disable = true');
  console.log('Reduce load: Decrease parker_max_bookings');
  console.log('Extend timeout: Increase parker_booking_timeout');
  console.log('Monitor: Check LaunchDarkly insights and system logs');
  
} catch (error) {
  console.error('❌ Validation failed:', error.message);
} finally {
  await ldClient.close();
}
