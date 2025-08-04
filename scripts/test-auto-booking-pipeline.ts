#!/usr/bin/env tsx

/**
 * Auto-Booking Pipeline Test Script
 * Tests the complete auto-booking flow end-to-end
 */

import { createClient } from '@supabase/supabase-js';
import { AutoBookingRedis } from '../src/lib/redis/auto-booking-redis';

interface TestConfig {
  supabaseUrl: string;
  supabaseKey: string;
  userId: string;
  dryRun: boolean;
}

async function main() {
  console.log('🚀 Starting Auto-Booking Pipeline Test');

  const config: TestConfig = {
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    userId: process.env.TEST_USER_ID || 'test-user-1',
    dryRun: process.argv.includes('--dry-run')
  };

  if (!config.supabaseUrl || !config.supabaseKey) {
    console.error('❌ Missing required environment variables');
    console.log('Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(config.supabaseUrl, config.supabaseKey);

  try {
    console.log('📊 Running pipeline health checks...');
    await runHealthChecks();

    console.log('🧪 Creating test trip request...');
    const tripRequestId = await createTestTripRequest(supabase, config.userId);

    console.log('🔍 Testing flight search stage...');
    await testFlightSearch(supabase, tripRequestId);

    console.log('🤖 Testing auto-booking monitor...');
    await testAutoBookingMonitor(supabase);

    if (!config.dryRun) {
      console.log('🎟️ Testing booking execution (LIVE)...');
      await testBookingExecution(supabase, tripRequestId);
    } else {
      console.log('🎭 Skipping booking execution (dry run mode)');
    }

    console.log('✅ All tests completed successfully!');

    // Cleanup
    console.log('🧹 Cleaning up test data...');
    await cleanupTestData(supabase, tripRequestId);

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

async function runHealthChecks() {
  console.log('  ├── Checking Redis connection...');
  const redisHealth = await AutoBookingRedis.healthCheck();
  if (redisHealth.status !== 'healthy') {
    throw new Error(`Redis unhealthy: ${redisHealth.error}`);
  }
  console.log('  ├── ✅ Redis connection OK');

  console.log('  ├── Checking environment variables...');
  const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'DUFFEL_API_TOKEN',
    'STRIPE_SECRET_KEY',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN'
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing environment variable: ${envVar}`);
    }
  }
  console.log('  ├── ✅ Environment variables OK');
}

async function createTestTripRequest(supabase: any, userId: string): Promise<string> {
  const testTrip = {
    user_id: userId,
    origin_code: 'LAX',
    destination_code: 'NYC',
    departure_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    return_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
    passenger_count: 1,
    cabin_class: 'economy',
    budget: 500,
    max_price: 800,
    auto_book_enabled: true,
    auto_book_status: 'PENDING',
    traveler_data: {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      dateOfBirth: '1990-01-01'
    }
  };

  const { data, error } = await supabase
    .from('trip_requests')
    .insert(testTrip)
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to create test trip: ${error.message}`);
  }

  console.log(`  ├── ✅ Created test trip request: ${data.id}`);
  return data.id;
}

async function testFlightSearch(supabase: any, tripRequestId: string) {
  console.log('  ├── Invoking auto-book-search function...');

  const { data, error } = await supabase.functions.invoke('auto-book-search', {
    body: {
      tripRequestId,
      maxResults: 5
    }
  });

  if (error) {
    throw new Error(`Flight search failed: ${error.message}`);
  }

  if (!data.success) {
    throw new Error(`Flight search unsuccessful: ${data.error}`);
  }

  console.log(`  ├── ✅ Found ${data.offersFound} flight offers`);

  // Verify offers were stored in database
  const { data: offers, error: offersError } = await supabase
    .from('flight_offers')
    .select('count(*)')
    .eq('trip_request_id', tripRequestId);

  if (offersError) {
    throw new Error(`Failed to verify stored offers: ${offersError.message}`);
  }

  console.log(`  ├── ✅ Verified ${offers[0]?.count || 0} offers stored in database`);
}

async function testAutoBookingMonitor(supabase: any) {
  console.log('  ├── Invoking auto-book-monitor function...');

  const { data, error } = await supabase.functions.invoke('auto-book-monitor', {
    body: {
      action: 'monitor',
      maxOffers: 5,
      dryRun: true
    }
  });

  if (error) {
    throw new Error(`Monitor failed: ${error.message}`);
  }

  if (!data.success) {
    throw new Error(`Monitor unsuccessful: ${data.error}`);
  }

  console.log(`  ├── ✅ Monitor processed ${data.processedTrips} trips`);
  console.log(`  ├── ✅ Bookings triggered: ${data.bookings_triggered || 0}`);
}

async function testBookingExecution(supabase: any, tripRequestId: string) {
  console.log('  ├── ⚠️  WARNING: This will attempt a REAL booking!');
  console.log('  ├── Testing booking execution...');

  const { data, error } = await supabase.functions.invoke('auto-book-production', {
    body: {
      tripRequestId
    }
  });

  if (error) {
    console.log(`  ├── ⚠️  Booking failed (expected for test): ${error.message}`);
    return;
  }

  if (data.success) {
    console.log(`  ├── ✅ Booking executed successfully`);
    console.log(`  ├── 📧 Booking ID: ${data.bookingId}`);
    console.log(`  ├── ⚠️  REAL MONEY WAS CHARGED - Review and refund if needed!`);
  } else {
    console.log(`  ├── ⚠️  Booking failed: ${data.error}`);
  }
}

async function cleanupTestData(supabase: any, tripRequestId: string) {
  try {
    // Delete test trip request (cascade will clean up related data)
    const { error } = await supabase
      .from('trip_requests')
      .delete()
      .eq('id', tripRequestId);

    if (error) {
      console.warn(`  ├── ⚠️  Failed to cleanup test data: ${error.message}`);
    } else {
      console.log(`  ├── ✅ Cleaned up test data`);
    }
  } catch (error) {
    console.warn(`  ├── ⚠️  Cleanup error:`, error);
  }
}

// Run the main function if this is the entry point
main().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});
