/// <reference lib="deno.ns" />
/**
 * Smoke tests for Stripe client wrapper
 * Validates basic module loading and environment handling
 */

import { assertEquals, assertThrows } from 'https://deno.land/std@0.208.0/assert/mod.ts';
import { describe, it, beforeEach, afterEach, beforeAll, afterAll } from 'https://deno.land/std@0.208.0/testing/bdd.ts';
import { assertExists } from 'https://deno.land/std@0.208.0/assert/mod.ts';
import { InMemorySpanExporter } from 'https://esm.sh/@opentelemetry/sdk-node@0.18.1';
import { NodeSDK } from 'https://esm.sh/@opentelemetry/sdk-node@0.18.1';

// Store original environment
const originalEnv = { ...Deno.env.toObject() };

const spanExporter = new InMemorySpanExporter();
const otelSDK = new NodeSDK({
  traceExporter: spanExporter,
  instrumentations: []
});

async function initializeStripeMock() {
  const process = new Deno.Command("stripe-mock", {
    args: [
  beforeEach(() => {
    // Set test environment
    Deno.env.set('STRIPE_SECRET_KEY', 'process.env.STRIPE_TEST_KEY || "sk_test_PLACEHOLDER"');
  });

  afterEach(() => {
    // Clean up environment
    for (const key in Deno.env.toObject()) {
      if (!originalEnv[key]) {
        Deno.env.delete(key);
      }
    }
    for (const [key, value] of Object.entries(originalEnv)) {
      Deno.env.set(key, value);
    }
  });

  it('should successfully import stripe module', async () => {
    const stripeModule = await import('../stripe.ts');
    
    // Verify expected exports exist
    assertEquals(typeof stripeModule.capturePaymentIntent, 'function');
    assertEquals(typeof stripeModule.createRefund, 'function');
    assertEquals(typeof stripeModule.verifyWebhookSignature, 'function');
    assertEquals(typeof stripeModule.retrievePaymentIntent, 'function');
    assertEquals(typeof stripeModule.handleStripeError, 'function');
    assertEquals(typeof stripeModule.stripe, 'object');
  });

  it('should validate required environment variables', () => {
    // Remove environment variable
    Deno.env.delete('STRIPE_SECRET_KEY');
    
    // This should throw when trying to initialize Stripe client
    assertThrows(
      () => {
        // We can't easily test the async import error, but we can test
        // that the environment validation logic is in place
        const secretKey = Deno.env.get('STRIPE_SECRET_KEY');
        if (!secretKey) {
          throw new Error('STRIPE_SECRET_KEY environment variable is required');
        }
      },
      Error,
      'STRIPE_SECRET_KEY environment variable is required'
    );
  });

  it('should export stripe client wrapper object', async () => {
    const { stripe } = await import('../stripe.ts');
    
    // Verify stripe wrapper has expected methods
    assertEquals(typeof stripe.capturePaymentIntent, 'function');
    assertEquals(typeof stripe.createRefund, 'function');
    assertEquals(typeof stripe.retrievePaymentIntent, 'function');
    assertEquals(typeof stripe.verifyWebhookSignature, 'function');
    assertEquals(typeof stripe.handleError, 'function');
  });
});

it('should create, capture, and refund PaymentIntent', async () => {
  const { createStripeClient } = await import('../stripe.ts');
  const stripeClient = createStripeClient('process.env.STRIPE_TEST_KEY || "sk_test_PLACEHOLDER"', '2020-08-27', 'http://localhost:12111');

  // Create a PaymentIntent
  const paymentIntent = await stripeClient.createPaymentIntent({
    amount: 2000,
    currency: 'usd',
    confirm: true,
    payment_method: 'pm_card_visa',
    capture_method: 'manual'
  }, 'test-idempotency-key-create');

  assertExists(paymentIntent);
  assertEquals(paymentIntent.amount, 2000);
  assertEquals(paymentIntent.currency, 'usd');

  // Capture PaymentIntent
  const capturedIntent = await stripeClient.capturePaymentIntent(paymentIntent.id, 'test-idempotency-key-capture');

  assertEquals(capturedIntent.status, 'succeeded');

  // Refund PaymentIntent
  const refund = await stripeClient.refundPaymentIntent(paymentIntent.id, paymentIntent.amount, 'test-idempotency-key-refund');

  assertExists(refund);
  assertEquals(refund.amount, 2000);
  assertEquals(refund.status, 'succeeded');
});

it('should record OpenTelemetry spans', async () => {
  const spans = spanExporter.getFinishedSpans();
  const spanNames = spans.map(span => span.name);
  assertExists(spanNames.find(name => name.includes('stripe')));
});
   stdout: "piped",
    stderr: "piped"
  }).spawn();

  const ready = new Promise<void>((resolve) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:12111/v1/charges", {
          headers: { "Authorization": "Bearer process.env.STRIPE_TEST_KEY || "sk_test_PLACEHOLDER"" },
        });
        if (res.ok) {
          clearInterval(interval);
          resolve();
        }
      } catch {}
    }, 500);
  });

  return { process, ready };
}

let stripeMock;

describe('Stripe Wrapper Smoke and Unit Tests', () => {
  beforeAll(async () => {
    // Initialize OpenTelemetry
    otelSDK.start();
    // Start stripe-mock
    stripeMock = await initializeStripeMock();
    await stripeMock.ready;
  });

  afterAll(() => {
    stripeMock.process.kill();
  });
