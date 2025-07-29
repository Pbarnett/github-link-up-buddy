/**
 * Test script for Redis distributed locking functionality
 * 
 * This script tests the Upstash Redis connection and verifies that
 * the distributed locking mechanism works correctly for the auto-booking pipeline.
 */

// Import the Redis lock manager
import '../supabase/functions/lib/redis-lock.ts'

// Set environment variables (these would normally be set by the environment)
Deno.env.set('UPSTASH_REDIS_REST_URL', 'https://summary-shepherd-52906.upstash.io')
Deno.env.set('UPSTASH_REDIS_REST_TOKEN', 'Ac6qAAIjcDE5MGYwMjYyMGY3NjM0ZDYwOTIyMzRhZTBhOGFlMzRlOHAxMA')

async function testRedisConnection() {
  console.log('🔧 Testing Redis Connection and Distributed Locking...\n')
  
  try {
    const lockManager = new RedisLockManager()
    
    // Test 1: Basic lock acquisition and release
    console.log('📋 Test 1: Basic Lock Acquisition and Release')
    const testLock = await lockManager.acquireLock({
      key: 'test:basic_lock',
      ttlSeconds: 30
    })
    
    if (testLock.acquired) {
      console.log('✅ Lock acquired successfully:', {
        lockId: testLock.lockId,
        expiresAt: testLock.expiresAt?.toISOString()
      })
      
      // Release the lock
      const released = await lockManager.releaseLock('test:basic_lock', testLock.lockId!)
      console.log('✅ Lock released:', released)
    } else {
      console.log('❌ Failed to acquire basic lock')
      return false
    }
    
    console.log()
    
    // Test 2: Monitor lock functionality
    console.log('📋 Test 2: Auto-Book Monitor Lock')
    const monitorLock1 = await acquireMonitorLock(60) // 1 minute TTL
    
    if (monitorLock1.acquired) {
      console.log('✅ Monitor lock acquired:', {
        lockId: monitorLock1.lockId,
        expiresAt: monitorLock1.expiresAt?.toISOString()
      })
      
      // Try to acquire the same lock (should fail)
      const monitorLock2 = await acquireMonitorLock(60)
      if (!monitorLock2.acquired) {
        console.log('✅ Second monitor lock correctly rejected (lock is exclusive)')
      } else {
        console.log('❌ Second monitor lock should have been rejected')
        return false
      }
      
      // Release the monitor lock
      const lockManagerForCleanup = new RedisLockManager()
      await lockManagerForCleanup.releaseLock('locks:auto_book_monitor', monitorLock1.lockId!)
      console.log('✅ Monitor lock released')
    } else {
      console.log('❌ Failed to acquire monitor lock')
      return false
    }
    
    console.log()
    
    // Test 3: Offer-specific locks
    console.log('📋 Test 3: Per-Offer Locking')
    const testOfferId = 'test-offer-123'
    const offerLock1 = await acquireOfferLock(testOfferId, 30)
    
    if (offerLock1.acquired) {
      console.log('✅ Offer lock acquired for:', testOfferId, {
        lockId: offerLock1.lockId,
        expiresAt: offerLock1.expiresAt?.toISOString()
      })
      
      // Try to acquire the same offer lock (should fail)
      const offerLock2 = await acquireOfferLock(testOfferId, 30)
      if (!offerLock2.acquired) {
        console.log('✅ Second offer lock correctly rejected (prevents double processing)')
      } else {
        console.log('❌ Second offer lock should have been rejected')
        return false
      }
      
      // Test different offer (should succeed)
      const offerLock3 = await acquireOfferLock('test-offer-456', 30)
      if (offerLock3.acquired) {
        console.log('✅ Different offer lock acquired successfully (parallel processing allowed)')
        
        // Clean up
        const lockManagerForCleanup = new RedisLockManager()
        await lockManagerForCleanup.releaseLock('lock:offer:test-offer-456', offerLock3.lockId!)
        await lockManagerForCleanup.releaseLock('lock:offer:test-offer-123', offerLock1.lockId!)
        console.log('✅ Offer locks cleaned up')
      } else {
        console.log('❌ Different offer lock should have succeeded')
        return false
      }
    } else {
      console.log('❌ Failed to acquire offer lock')
      return false
    }
    
    console.log()
    
    // Test 4: Lock expiration and TTL
    console.log('📋 Test 4: Lock TTL and Expiration')
    const shortLock = await lockManager.acquireLock({
      key: 'test:short_ttl',
      ttlSeconds: 2, // 2 seconds
      retryAttempts: 0
    })
    
    if (shortLock.acquired) {
      console.log('✅ Short TTL lock acquired, waiting for expiration...')
      
      // Check lock status immediately
      const status1 = await lockManager.checkLock('test:short_ttl')
      console.log('📊 Lock status (immediate):', status1)
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Check lock status after expiration
      const status2 = await lockManager.checkLock('test:short_ttl')
      console.log('📊 Lock status (after expiration):', status2)
      
      if (!status2.exists) {
        console.log('✅ Lock correctly expired after TTL')
      } else {
        console.log('❌ Lock should have expired')
        return false
      }
    } else {
      console.log('❌ Failed to acquire short TTL lock')
      return false
    }
    
    console.log()
    
    // Test 5: Cleanup expired locks
    console.log('📋 Test 5: Lock Cleanup')
    const cleanedCount = await lockManager.cleanupExpiredLocks('test:*')
    console.log('✅ Cleanup completed, found', cleanedCount, 'expired locks')
    
    console.log()
    console.log('🎉 All Redis lock tests passed!')
    console.log('✅ Redis connection is working correctly')
    console.log('✅ Distributed locking is functional')
    console.log('✅ Auto-booking pipeline concurrency control is ready')
    
    return true
    
  } catch {
    console.error('❌ Redis test failed:', error);
    return false
  }
}

async function testFailureScenarios() {
  console.log('\n🚨 Testing Failure Scenarios...\n')
  
  try {
    // Test with invalid Redis URL
    const originalUrl = Deno.env.get('UPSTASH_REDIS_REST_URL')
    Deno.env.set('UPSTASH_REDIS_REST_URL', 'https://invalid-redis-url.com')
    
    const lockManager = new RedisLockManager()
    
    try {
      await lockManager.acquireLock({
        key: 'test:invalid_connection',
        ttlSeconds: 30
      })
      console.log('❌ Should have failed with invalid URL')
    } catch (error) {
      console.log('✅ Correctly failed with invalid Redis URL:', error.message)
    }
    
    // Restore original URL
    Deno.env.set('UPSTASH_REDIS_REST_URL', originalUrl!)
    
    console.log('✅ Failure scenario testing completed')
    
  } catch {
    console.error('❌ Failure scenario test error:', error);
  }
}

// Run the tests
if (import.meta.main) {
  console.log('🚀 Starting Redis Lock System Tests\n')
  
  const success = await testRedisConnection()
  
  if (success) {
    await testFailureScenarios()
    console.log('\n🎯 Redis lock system is production ready!')
    console.log('📍 Next steps:')
    console.log('   1. Deploy the database migrations')
    console.log('   2. Set up the pg_cron job')
    console.log('   3. Configure LaunchDarkly flags')
    console.log('   4. Test the auto-booking monitor function')
  } else {
    console.log('\n❌ Redis lock system needs attention before deployment')
    Deno.exit(1)
  }
}
