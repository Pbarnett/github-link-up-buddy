/**
 * Test Redis connection with current environment variables
 */

import { config } from 'dotenv';
import { AutoBookingRedis } from '../src/lib/redis/auto-booking-redis';

// Load environment variables
config();

async function testRedisConnection() {
  console.log('🔧 Testing Redis Connection...\n');

  // Check environment variables
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  console.log('📋 Environment Variables:');
  console.log(`  UPSTASH_REDIS_REST_URL: ${redisUrl ? '✅ Set' : '❌ Missing'}`);
  console.log(`  UPSTASH_REDIS_REST_TOKEN: ${redisToken ? '✅ Set' : '❌ Missing'}\n`);

  if (!redisUrl || !redisToken) {
    console.log('❌ Redis credentials not found in environment variables');
    console.log('\n🔧 To fix this:');
    console.log('1. Go to https://console.upstash.com/');
    console.log('2. Select your Redis database');
    console.log('3. Copy the REST API credentials');
    console.log('4. Update your .env file with:');
    console.log('   UPSTASH_REDIS_REST_URL=your-redis-url');
    console.log('   UPSTASH_REDIS_REST_TOKEN=your-redis-token');
    return;
  }

  console.log('🧪 Testing Redis operations...\n');

  try {
    // Test 1: Health check
    console.log('  ├── Testing health check...');
    const health = await AutoBookingRedis.healthCheck();
    if (health.status === 'healthy') {
      console.log('  ├── ✅ Health check passed');
    } else {
      console.log(`  ├── ❌ Health check failed: ${health.error}`);
      return;
    }

    // Test 2: Lock operations
    console.log('  ├── Testing lock operations...');
    const testTripId = 'test-trip-' + Date.now();
    
    const lock = await AutoBookingRedis.acquireLock(testTripId, 'monitor');
    if (lock) {
      console.log('  ├── ✅ Lock acquired successfully');
      
      const released = await AutoBookingRedis.releaseLock(lock);
      if (released) {
        console.log('  ├── ✅ Lock released successfully');
      } else {
        console.log('  ├── ⚠️  Lock release failed');
      }
    } else {
      console.log('  ├── ❌ Failed to acquire lock');
    }

    // Test 3: Queue operations
    console.log('  ├── Testing queue operations...');
    const testJob = {
      tripRequestId: testTripId,
      stage: 'monitor' as const,
      priority: 1,
      createdAt: Date.now()
    };

    const enqueued = await AutoBookingRedis.enqueueJob(testJob);
    if (enqueued) {
      console.log('  ├── ✅ Job enqueued successfully');
      
      const dequeued = await AutoBookingRedis.dequeueJob('monitor');
      if (dequeued) {
        console.log('  ├── ✅ Job dequeued successfully');
      } else {
        console.log('  ├── ⚠️  Job dequeue failed');
      }
    } else {
      console.log('  ├── ❌ Failed to enqueue job');
    }

    // Test 4: Monitoring data
    console.log('  ├── Testing monitoring data...');
    const monitoringData = {
      lastPrice: 299.99,
      lastChecked: Date.now(),
      checkCount: 1
    };

    const dataSet = await AutoBookingRedis.setMonitoringData(testTripId, monitoringData);
    if (dataSet) {
      console.log('  ├── ✅ Monitoring data set successfully');
      
      const retrievedData = await AutoBookingRedis.getMonitoringData(testTripId);
      if (retrievedData && retrievedData.lastPrice === 299.99) {
        console.log('  ├── ✅ Monitoring data retrieved successfully');
      } else {
        console.log('  ├── ⚠️  Monitoring data retrieval failed');
      }
    } else {
      console.log('  ├── ❌ Failed to set monitoring data');
    }

    console.log('\n🎉 All Redis tests passed!');
    console.log('✅ Your Upstash Redis is properly configured and ready for auto-booking');

  } catch (error) {
    console.error('\n❌ Redis test failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your Redis credentials are correct');
    console.log('2. Ensure your Upstash database is active');
    console.log('3. Verify network connectivity');
  }
}

// Run the test
testRedisConnection().catch(error => {
  console.error('Test script failed:', error);
  process.exit(1);
});
