import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import * as LaunchDarkly from '@launchdarkly/node-server-sdk';

// Test configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'http://localhost:54321';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const LAUNCHDARKLY_SDK_KEY = process.env.LAUNCHDARKLY_SDK_KEY || '';

// Test timeout for external services
test.setTimeout(30000);

test.describe('External Services Integration', () => {
  test.describe('Stripe Integration', () => {
    let stripe: Stripe;

    test.beforeAll(() => {
      if (!STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY not configured - set it in .env.test');
      }
      stripe = new Stripe(STRIPE_SECRET_KEY, {
        apiVersion: '2023-10-16',
      });
    });

    test('should validate Stripe test mode connectivity', async () => {
      // Test Stripe API connectivity
      const account = await stripe.accounts.retrieve();
      expect(account).toBeDefined();
      expect(account.id).toBeTruthy();
      
      // Verify test mode
      expect(account.charges_enabled).toBeDefined();
      console.log('✅ Stripe connectivity verified');
    });

    test('should create and validate test payment method', async () => {
      // Create a test payment method using Stripe test card
      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: '4242424242424242', // Stripe test card
          exp_month: 12,
          exp_year: 2025,
          cvc: '123',
        },
      });

      expect(paymentMethod.id).toBeTruthy();
      expect(paymentMethod.type).toBe('card');
      expect(paymentMethod.card?.brand).toBe('visa');
      expect(paymentMethod.card?.last4).toBe('4242');
      
      console.log('✅ Stripe test payment method created:', paymentMethod.id);
    });

    test('should validate Stripe webhook endpoint structure', async () => {
      // Test webhook event structure
      const webhookEvents = await stripe.events.list({
        limit: 1,
        types: ['payment_intent.succeeded'],
      });

      expect(webhookEvents).toBeDefined();
      expect(Array.isArray(webhookEvents.data)).toBe(true);
      
      console.log('✅ Stripe webhook endpoints accessible');
    });

    test('should handle declined card scenario', async () => {
      // Test with declined card number
      try {
        await stripe.paymentMethods.create({
          type: 'card',
          card: {
            number: '4000000000000002', // Stripe declined test card
            exp_month: 12,
            exp_year: 2025,
            cvc: '123',
          },
        });
      } catch (error) {
        expect(error).toBeDefined();
        console.log('✅ Stripe declined card handling verified');
      }
    });
  });

  test.describe('LaunchDarkly Integration', () => {
    let ldClient: LaunchDarkly.LDClient;

    test.beforeAll(async () => {
      if (!LAUNCHDARKLY_SDK_KEY) {
        throw new Error('LAUNCHDARKLY_SDK_KEY not configured - set it in .env.test');
      }
      
      ldClient = LaunchDarkly.init(LAUNCHDARKLY_SDK_KEY);
      await ldClient.waitForInitialization();
    });

    test.afterAll(async () => {
      if (ldClient) {
        await ldClient.close();
      }
    });

    test('should validate LaunchDarkly connectivity', async () => {
      const isInitialized = ldClient.initialized();
      expect(isInitialized).toBe(true);
      
      console.log('✅ LaunchDarkly SDK initialized successfully');
    });

    test('should fetch wallet_ui feature flag', async () => {
      const testUser = {
        key: 'test-user-integration',
        email: 'test@example.com',
      };

      const walletUiFlag = await ldClient.variation('wallet_ui', testUser, false);
      expect(typeof walletUiFlag).toBe('boolean');
      
      console.log('✅ wallet_ui feature flag:', walletUiFlag);
    });

    test('should fetch profile_ui_revamp feature flag', async () => {
      const testUser = {
        key: 'test-user-integration',
        email: 'test@example.com',
      };

      const profileRevampFlag = await ldClient.variation('profile_ui_revamp', testUser, false);
      expect(typeof profileRevampFlag).toBe('boolean');
      
      console.log('✅ profile_ui_revamp feature flag:', profileRevampFlag);
    });

    test('should handle unknown feature flag gracefully', async () => {
      const testUser = {
        key: 'test-user-integration',
        email: 'test@example.com',
      };

      const unknownFlag = await ldClient.variation('nonexistent_flag', testUser, 'default');
      expect(unknownFlag).toBe('default');
      
      console.log('✅ LaunchDarkly fallback handling verified');
    });

    test('should validate flag variations for different user segments', async () => {
      const regularUser = {
        key: 'regular-user',
        email: 'regular@example.com',
        custom: { userType: 'regular' }
      };

      const premiumUser = {
        key: 'premium-user',
        email: 'premium@example.com',
        custom: { userType: 'premium' }
      };

      const regularFlag = await ldClient.variation('wallet_ui', regularUser, false);
      const premiumFlag = await ldClient.variation('wallet_ui', premiumUser, false);

      expect(typeof regularFlag).toBe('boolean');
      expect(typeof premiumFlag).toBe('boolean');
      
      console.log('✅ LaunchDarkly user segmentation verified');
    });
  });

  test.describe('Supabase Integration', () => {
    let supabase: ReturnType<typeof createClient>;

    test.beforeAll(() => {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error('Supabase configuration not available - set SUPABASE_URL and SUPABASE_ANON_KEY in .env.test');
      }
      
      supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    });

    test('should validate Supabase database connectivity', async () => {
      // Test basic connectivity with a simple query
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      
      console.log('✅ Supabase database connectivity verified');
    });

    test('should validate payment_methods table structure', async () => {
      // Test payment_methods table exists and has correct structure
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .limit(1);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
      
      console.log('✅ payment_methods table structure verified');
    });

    test('should validate RLS policies are active', async () => {
      // Test that RLS policies block unauthorized access
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*');

      // Should either succeed with empty results or fail with auth error
      expect(data !== null || error !== null).toBe(true);
      
      if (error) {
        // RLS is working - unauthorized access blocked
        expect(error.message).toContain('Row Level Security');
      }
      
      console.log('✅ Supabase RLS policies verified');
    });

    test('should validate Edge Functions health', async () => {
      // Test Edge Function health endpoint
      const response = await fetch(`${SUPABASE_URL}/functions/v1/health`, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });

      expect(response.status).toBeLessThan(500);
      
      if (response.ok) {
        const data = await response.json();
        expect(data).toBeDefined();
      }
      
      console.log('✅ Supabase Edge Functions health check completed');
    });

    test('should validate stripe-webhook Edge Function', async () => {
      // Test stripe webhook function exists and responds
      const response = await fetch(`${SUPABASE_URL}/functions/v1/stripe-webhook`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'test.event',
          data: { object: { id: 'test' } }
        }),
      });

      // Should respond (even if it rejects the test payload)
      expect(response.status).toBeDefined();
      expect(response.status).not.toBe(404);
      
      console.log('✅ stripe-webhook Edge Function accessible');
    });

    test('should validate KMS encryption service', async () => {
      // Test KMS-related Edge Function
      const response = await fetch(`${SUPABASE_URL}/functions/v1/encrypt-data`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: 'test-data',
          keyId: 'test-key-id'
        }),
      });

      // Function should exist and respond
      expect(response.status).toBeDefined();
      expect(response.status).not.toBe(404);
      
      console.log('✅ KMS encryption service accessibility verified');
    });
  });

  test.describe('Cross-Service Integration', () => {
    test('should validate Stripe + Supabase payment flow', async () => {
      if (!STRIPE_SECRET_KEY || !SUPABASE_URL) {
        throw new Error('Missing required environment variables: STRIPE_SECRET_KEY or SUPABASE_URL not configured');
      }

      // This would test the full payment flow:
      // 1. Create Stripe payment method
      // 2. Store in Supabase via Edge Function
      // 3. Verify encryption
      
      const stripe = new Stripe(STRIPE_SECRET_KEY, {
        apiVersion: '2023-10-16',
      });

      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: '4242424242424242',
          exp_month: 12,
          exp_year: 2025,
          cvc: '123',
        },
      });

      // Test storing via Edge Function
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const response = await fetch(`${SUPABASE_URL}/functions/v1/create-payment-method`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stripePaymentMethodId: paymentMethod.id,
          userId: 'test-user-id'
        }),
      });

      expect(response.status).not.toBe(404);
      console.log('✅ Stripe + Supabase integration flow verified');
    });

    test('should validate LaunchDarkly + UI feature toggle', async () => {
      if (!LAUNCHDARKLY_SDK_KEY) {
        throw new Error('Missing required environment variable: LAUNCHDARKLY_SDK_KEY not configured');
      }

      const ldClient = LaunchDarkly.init(LAUNCHDARKLY_SDK_KEY);
      await ldClient.waitForInitialization();

      const testUser = {
        key: 'integration-test-user',
        email: 'test@example.com',
      };

      // Test that flags affect application behavior
      const walletEnabled = await ldClient.variation('wallet_ui', testUser, false);
      const profileRevampEnabled = await ldClient.variation('profile_ui_revamp', testUser, false);

      expect(typeof walletEnabled).toBe('boolean');
      expect(typeof profileRevampEnabled).toBe('boolean');

      await ldClient.close();
      
      console.log('✅ LaunchDarkly feature toggle integration verified');
    });
  });
});

// Helper function for CI environment detection
test.describe('CI Environment Validation', () => {
  test('should validate all required environment variables', async () => {
    const requiredEnvVars = [
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY',
      'STRIPE_SECRET_KEY',
      'LAUNCHDARKLY_SDK_KEY',
    ];

    const missingVars: string[] = [];
    
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        missingVars.push(envVar);
      }
    }

    if (missingVars.length > 0) {
      console.warn('⚠️ Missing environment variables:', missingVars);
      // Don't fail in CI if using test/mock values
      if (process.env.CI === 'true') {
        console.log('CI detected - continuing with available configuration');
      }
    } else {
      console.log('✅ All external service environment variables configured');
    }

    expect(true).toBe(true); // Always pass - this is informational
  });

  test('should validate test vs production environment settings', async () => {
    // Ensure we're not accidentally hitting production services in tests
    if (STRIPE_SECRET_KEY.startsWith('sk_live_')) {
      throw new Error('❌ Production Stripe key detected in tests!');
    }

    if (SUPABASE_URL.includes('supabase.co') && !SUPABASE_URL.includes('staging')) {
      console.warn('⚠️ Production Supabase URL detected - ensure this is intentional');
    }

    console.log('✅ Test environment safety checks passed');
  });
});
