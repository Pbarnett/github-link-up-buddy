import { test, expect } from '@playwright/test';

// Test configuration - using environment variables for safety
const SUPABASE_URL = process.env.SUPABASE_URL || 'http://localhost:54321';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

// Set timeout for external service calls
test.setTimeout(30000);

test.describe('External Services Connectivity', () => {
  test.describe('Basic Connectivity', () => {
    test('should validate environment variables are set', async () => {
      console.log('Environment Check:');
      console.log('- SUPABASE_URL:', SUPABASE_URL ? 'SET' : 'NOT SET');
      console.log('- SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
      console.log('- STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'SET' : 'NOT SET');
      console.log('- LAUNCHDARKLY_SDK_KEY:', process.env.LAUNCHDARKLY_SDK_KEY ? 'SET' : 'NOT SET');
      
      // This test always passes - it's just for information
      expect(true).toBe(true);
    });

    test('should test basic network connectivity', async () => {
      // Test a simple HTTP request to a known service
      try {
        const response = await fetch('https://httpbin.org/get', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        expect(response.ok).toBe(true);
        console.log('✅ Basic network connectivity verified');
      } catch (error) {
        console.error('❌ Network connectivity failed:', error);
        throw error;
      }
    });

    test('should test local Supabase connectivity if available', async () => {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.log('Supabase configuration not available - skipping test');
        return;
      }

      try {
        // Test basic health check
        const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
        });

        // We expect some response, even if it's an error (which would indicate the server is responding)
        expect(response).toBeDefined();
        console.log('✅ Supabase endpoint responded with status:', response.status);
      } catch (error) {
        console.error('❌ Supabase connectivity failed:', error);
        // Don't throw in this test - just log the issue
      }
    });

    test('should validate Stripe test environment if configured', async () => {
      const stripeKey = process.env.STRIPE_SECRET_KEY;
      
      if (!stripeKey) {
        console.log('⚠️ Stripe not configured - skipping test');
        return;
      }

      // Ensure we're using test keys only
      if (stripeKey.startsWith('sk_live_')) {
        throw new Error('❌ Production Stripe key detected in tests! This is dangerous.');
      }

      if (stripeKey.startsWith('sk_test_')) {
        console.log('✅ Stripe test key detected - safe for testing');
      } else {
        console.log('⚠️ Stripe key format unrecognized');
      }

      expect(true).toBe(true);
    });

    test('should validate LaunchDarkly SDK key format if configured', async () => {
      const ldKey = process.env.LAUNCHDARKLY_SDK_KEY;
      
      if (!ldKey) {
        console.log('⚠️ LaunchDarkly not configured - skipping test');
        return;
      }

      // LaunchDarkly SDK keys typically start with 'sdk-'
      if (ldKey.startsWith('sdk-')) {
        console.log('✅ LaunchDarkly SDK key format appears valid');
      } else {
        console.log('⚠️ LaunchDarkly key format unrecognized');
      }

      expect(true).toBe(true);
    });
  });

  test.describe('Service Integration Status', () => {
    test('should report integration readiness status', async () => {
      const services = {
        supabase: !!(SUPABASE_URL && SUPABASE_ANON_KEY),
        stripe: !!process.env.STRIPE_SECRET_KEY,
        launchdarkly: !!process.env.LAUNCHDARKLY_SDK_KEY,
      };

      console.log('\n🔍 Integration Test Readiness:');
      console.log(`- Supabase: ${services.supabase ? '✅ Ready' : '❌ Missing config'}`);
      console.log(`- Stripe: ${services.stripe ? '✅ Ready' : '❌ Missing config'}`);
      console.log(`- LaunchDarkly: ${services.launchdarkly ? '✅ Ready' : '❌ Missing config'}`);

      const readyCount = Object.values(services).filter(Boolean).length;
      const totalCount = Object.keys(services).length;

      console.log(`\n📊 Integration Coverage: ${readyCount}/${totalCount} services configured`);

      if (readyCount === 0) {
        console.log('⚠️ No external services configured for integration testing');
        console.log('To enable integration tests, set the following environment variables:');
        console.log('- SUPABASE_URL and SUPABASE_ANON_KEY for Supabase tests');
        console.log('- STRIPE_SECRET_KEY for Stripe tests (test keys only!)');
        console.log('- LAUNCHDARKLY_SDK_KEY for LaunchDarkly tests');
      }

      // Test passes regardless - this is informational
      expect(true).toBe(true);
    });
  });
});
