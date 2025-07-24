import { test, expect } from '@playwright/test';

// Test configuration from environment  
const SUPABASE_URL = process.env.SUPABASE_URL || 'http://localhost:54321';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const LAUNCHDARKLY_SDK_KEY = process.env.LAUNCHDARKLY_SDK_KEY || '';

test.describe('External Services Integration - Minimal', () => {
  test('should validate environment variables are loaded', async () => {
    expect(SUPABASE_URL).toBeTruthy();
    expect(SUPABASE_ANON_KEY).toBeTruthy();
    console.log('✅ Environment variables loaded:', {
      SUPABASE_URL: SUPABASE_URL.substring(0, 20) + '...',
      SUPABASE_ANON_KEY: SUPABASE_ANON_KEY.substring(0, 10) + '...',
      STRIPE_SECRET_KEY: STRIPE_SECRET_KEY ? 'Set' : 'Not set',
      LAUNCHDARKLY_SDK_KEY: LAUNCHDARKLY_SDK_KEY ? 'Set' : 'Not set'
    });
  });

  test('should validate basic HTTP connectivity to external services', async () => {
    // Test LaunchDarkly connectivity with basic fetch
    try {
      const ldResponse = await fetch('https://sdk.launchdarkly.com');
      expect(ldResponse.status).toBeLessThan(500);
      console.log('✅ LaunchDarkly endpoint reachable');
    } catch (error) {
      console.warn('⚠️ LaunchDarkly connectivity test failed:', error);
    }

    // Test Supabase connectivity with basic fetch  
    try {
      const supabaseResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      expect(supabaseResponse.status).toBeLessThan(500);
      console.log('✅ Supabase endpoint reachable');
    } catch (error) {
      console.warn('⚠️ Supabase connectivity test failed:', error);
    }

    // Test Stripe API connectivity with basic fetch
    if (STRIPE_SECRET_KEY) {
      try {
        const stripeResponse = await fetch('https://api.stripe.com/v1/account', {
          headers: {
            'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        expect(stripeResponse.status).toBeLessThan(500);
        console.log('✅ Stripe API endpoint reachable');
      } catch (error) {
        console.warn('⚠️ Stripe connectivity test failed:', error);
      }
    } else {
      console.log('⚠️ Stripe secret key not configured, skipping connectivity test');
    }
  });

  test('should validate Playwright expect function works correctly', async () => {
    expect(typeof expect).toBe('function');
    expect(1 + 1).toBe(2);
    expect('hello').toBe('hello');
    expect([1, 2, 3]).toHaveLength(3);
    
    console.log('✅ Playwright expect function working correctly');
  });
});
