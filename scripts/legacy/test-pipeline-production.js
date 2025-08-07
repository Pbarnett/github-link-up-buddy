#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import LaunchDarkly from 'launchdarkly-node-server-sdk';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

// 🚀 PRODUCTION PIPELINE TEST
// ==========================
// This script tests the complete auto-booking pipeline with real integrations
// but uses DRY_RUN mode to prevent actual bookings

const DRY_RUN = true; // Set to false for live bookings (NOT RECOMMENDED until fully tested)

class ProductionPipelineTest {
  constructor() {
    this.results = {
      supabase: false,
      launchDarkly: false,
      stripe: false,
      redis: false,
      duffelSearch: false,
      autoBooking: false,
      paymentFlow: false
    };
    
    this.errors = [];
  }

  async init() {
    console.log('🚀 PRODUCTION PIPELINE TEST');
    console.log('===========================');
    console.log(`🟡 DRY RUN MODE: ${DRY_RUN ? 'ENABLED' : 'DISABLED'}`);
    console.log('');

    // Initialize clients
    try {
      this.supabase = createClient(
        process.env.VITE_SUPABASE_URL,
        process.env.VITE_SUPABASE_ANON_KEY
      );

      this.ldClient = LaunchDarkly.init(process.env.LAUNCHDARKLY_SDK_KEY);
      await this.ldClient.waitForInitialization();

      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

      console.log('✅ All clients initialized');
      return true;
    } catch (error) {
      console.error('❌ Client initialization failed:', error.message);
      return false;
    }
  }

  async testSupabaseConnection() {
    console.log('\n📊 Testing Supabase Connection...');
    try {
      const { data, error } = await this.supabase
        .from('flight_bookings')
        .select('count', { count: 'exact', head: true });

      if (error) throw error;

      this.results.supabase = true;
      console.log('✅ Supabase connection successful');
      return true;
    } catch (error) {
      this.errors.push(`Supabase: ${error.message}`);
      console.log('❌ Supabase connection failed:', error.message);
      return false;
    }
  }

  async testLaunchDarklyFlags() {
    console.log('\n🎛️ Testing LaunchDarkly Feature Flags...');
    try {
      const user = { kind: 'user', key: 'test-pipeline', name: 'Pipeline Test' };
      
      const flags = {
        autoBookingEnabled: await this.ldClient.variation('parker_auto_booking_enabled', user, false),
        emergencyDisable: await this.ldClient.variation('parker_emergency_disable', user, false),
        flightMonitoring: await this.ldClient.variation('parker_flight_monitoring', user, false),
        paymentProcessing: await this.ldClient.variation('parker_payment_processing', user, false),
        concurrencyControl: await this.ldClient.variation('parker_concurrency_control', user, false),
        maxBookings: await this.ldClient.variation('parker_max_bookings', user, 0),
        bookingTimeout: await this.ldClient.variation('parker_booking_timeout', user, 0)
      };

      console.log('📋 Current Flag Values:');
      Object.entries(flags).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`);
      });

      // Validate critical safety flags
      if (flags.emergencyDisable) {
        console.log('🚨 EMERGENCY DISABLE is ON - System will not process bookings');
        return false;
      }

      if (!flags.flightMonitoring) {
        console.log('⚠️  Flight monitoring is OFF - Limited functionality');
      }

      this.results.launchDarkly = true;
      console.log('✅ LaunchDarkly flags operational');
      return flags;
    } catch (error) {
      this.errors.push(`LaunchDarkly: ${error.message}`);
      console.log('❌ LaunchDarkly test failed:', error.message);
      return false;
    }
  }

  async testStripeConnection() {
    console.log('\n💳 Testing Stripe Payment Integration...');
    try {
      // Test account retrieval
      const account = await this.stripe.accounts.retrieve();
      console.log(`   Account: ${account.email} (${account.country})`);

      // Test payment intent creation (minimal amount)
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: 100, // $1.00 test
        currency: 'usd',
        description: 'Auto-booking pipeline test',
        metadata: {
          test: 'pipeline',
          dry_run: DRY_RUN.toString()
        }
      });

      console.log(`   Test Payment Intent: ${paymentIntent.id}`);

      // Cancel the test payment intent
      await this.stripe.paymentIntents.cancel(paymentIntent.id);
      console.log('   Test payment intent cancelled');

      this.results.stripe = true;
      console.log('✅ Stripe integration operational');
      return true;
    } catch (error) {
      this.errors.push(`Stripe: ${error.message}`);
      console.log('❌ Stripe test failed:', error.message);
      return false;
    }
  }

  async testFlightSearch() {
    console.log('\n✈️ Testing Flight Search Function...');
    try {
      const searchData = {
        origin: 'JFK',
        destination: 'LAX',
        departure_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        passengers: { adults: 1 },
        cabin_class: 'economy'
      };

      const { data, error } = await this.supabase.functions.invoke('duffel-search', {
        body: {
          ...searchData,
          dry_run: DRY_RUN
        }
      });

      if (error) throw error;

      if (data?.offers && data.offers.length > 0) {
        console.log(`   Found ${data.offers.length} flight offers`);
        console.log(`   Price range: $${Math.min(...data.offers.map(o => o.total_amount))} - $${Math.max(...data.offers.map(o => o.total_amount))}`);
        
        this.results.duffelSearch = true;
        console.log('✅ Flight search operational');
        return data.offers[0]; // Return first offer for booking test
      } else {
        console.log('⚠️  No flight offers found (may be normal for test routes)');
        return null;
      }
    } catch (error) {
      this.errors.push(`Flight Search: ${error.message}`);
      console.log('❌ Flight search test failed:', error.message);
      return false;
    }
  }

  async testAutoBookingPipeline(offer, flags) {
    console.log('\n🤖 Testing Auto-Booking Pipeline...');
    try {
      if (!flags.autoBookingEnabled && !DRY_RUN) {
        console.log('🟡 Auto-booking is disabled via feature flag');
        return true;
      }

      const bookingData = {
        offer_id: offer?.id || 'test-offer-id',
        passenger_details: {
          given_name: 'Test',
          family_name: 'User',
          email: 'test@example.com',
          phone_number: '+1234567890',
          born_on: '1990-01-01',
          gender: 'M'
        },
        payment_method_id: 'test-payment-method',
        dry_run: DRY_RUN
      };

      const { data, error } = await this.supabase.functions.invoke('auto-book-production', {
        body: bookingData
      });

      if (error) throw error;

      if (DRY_RUN) {
        console.log('   ✅ Dry run mode: Booking logic validated without execution');
        console.log('   📝 Would have processed:', JSON.stringify(bookingData, null, 2));
        this.results.autoBooking = true;
      } else {
        if (data?.booking_id) {
          console.log(`   📋 Booking created: ${data.booking_id}`);
          this.results.autoBooking = true;
        } else {
          console.log('   ⚠️  Booking was not created');
        }
      }

      console.log('✅ Auto-booking pipeline tested');
      return true;
    } catch (error) {
      this.errors.push(`Auto-booking: ${error.message}`);
      console.log('❌ Auto-booking pipeline test failed:', error.message);
      return false;
    }
  }

  async testPaymentFlow() {
    console.log('\n💰 Testing Payment Flow Integration...');
    try {
      // Create a test payment session
      const sessionData = {
        amount: 29900, // $299.00 typical flight price
        currency: 'usd',
        description: 'Test auto-booking payment',
        metadata: {
          booking_type: 'auto_booking',
          test_mode: 'true',
          dry_run: DRY_RUN.toString()
        }
      };

      const { data, error } = await this.supabase.functions.invoke('create-payment-session', {
        body: sessionData
      });

      if (error) throw error;

      if (data?.session_id) {
        console.log(`   💳 Payment session created: ${data.session_id}`);
        this.results.paymentFlow = true;
        console.log('✅ Payment flow integration operational');
        return true;
      } else {
        console.log('   ⚠️  Payment session was not created');
        return false;
      }
    } catch (error) {
      this.errors.push(`Payment Flow: ${error.message}`);
      console.log('❌ Payment flow test failed:', error.message);
      return false;
    }
  }

  async runComprehensiveTest() {
    const initialized = await this.init();
    if (!initialized) return false;

    // Run all tests in sequence
    await this.testSupabaseConnection();
    const flags = await this.testLaunchDarklyFlags();
    await this.testStripeConnection();
    const offer = await this.testFlightSearch();
    
    if (flags) {
      await this.testAutoBookingPipeline(offer, flags);
    }
    
    await this.testPaymentFlow();

    // Generate final report
    this.generateReport();
    
    return this.isSystemReady();
  }

  isSystemReady() {
    const criticalSystems = ['supabase', 'launchDarkly', 'stripe'];
    return criticalSystems.every(system => this.results[system]);
  }

  generateReport() {
    console.log('\n📊 PRODUCTION READINESS REPORT');
    console.log('==============================');
    
    const systems = [
      { name: 'Supabase Database', key: 'supabase', critical: true },
      { name: 'LaunchDarkly Flags', key: 'launchDarkly', critical: true },
      { name: 'Stripe Payments', key: 'stripe', critical: true },
      { name: 'Flight Search', key: 'duffelSearch', critical: false },
      { name: 'Auto-Booking Pipeline', key: 'autoBooking', critical: false },
      { name: 'Payment Flow', key: 'paymentFlow', critical: false }
    ];

    systems.forEach(system => {
      const status = this.results[system.key] ? '✅' : '❌';
      const critical = system.critical ? ' (CRITICAL)' : '';
      console.log(`${status} ${system.name}${critical}`);
    });

    console.log('\n📋 Summary:');
    const readyCount = Object.values(this.results).filter(Boolean).length;
    const totalCount = Object.keys(this.results).length;
    console.log(`   Systems Ready: ${readyCount}/${totalCount}`);
    
    if (this.errors.length > 0) {
      console.log('\n🚨 Errors Encountered:');
      this.errors.forEach(error => console.log(`   • ${error}`));
    }

    const isReady = this.isSystemReady();
    console.log(`\n🎯 Production Status: ${isReady ? '✅ READY' : '❌ NOT READY'}`);
    
    if (isReady && DRY_RUN) {
      console.log('\n🚀 NEXT STEPS:');
      console.log('   1. Set DRY_RUN=false for live booking tests');
      console.log('   2. Enable parker_auto_booking_enabled flag in LaunchDarkly');
      console.log('   3. Monitor system performance and error rates');
      console.log('   4. Gradually increase parker_max_bookings limit');
    }

    return isReady;
  }

  async cleanup() {
    if (this.ldClient) {
      await this.ldClient.close();
    }
  }
}

// Run the test
async function runProductionTest() {
  const test = new ProductionPipelineTest();
  
  try {
    const success = await test.runComprehensiveTest();
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('🚨 CRITICAL TEST FAILURE:', error.message);
    process.exit(1);
  } finally {
    await test.cleanup();
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Test interrupted by user');
  process.exit(1);
});

process.on('SIGTERM', async () => {
  console.log('\n\n🛑 Test terminated');
  process.exit(1);
});

if (import.meta.main) {
  runProductionTest();
}
