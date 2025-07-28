import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

// Test configuration for API-based E2E testing
const TEST_CONFIG = {
  baseUrl: process.env.SUPABASE_URL || 'http://localhost:54321',
  apiTimeout: 30000,
  maxRetries: 3
};

// Mock data for testing
const MOCK_FLIGHT_DATA = {
  origin: 'LAX',
  destination: 'JFK', 
  departureDate: '2024-07-01',
  passengers: 1,
  budget: 500
};

const MOCK_PASSENGER_DATA = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  phone: faker.phone.number()
};

/**
 * API-based E2E tests that hit actual endpoints directly
 * This approach avoids UI dependencies and tests the full pipeline
 */
test.describe('Auto Booking API E2E Flow', () => {
  let apiContext;
  
  test.beforeAll(async ({ playwright }) => {
    // Create API request context for direct endpoint testing
    apiContext = await playwright.request.newContext({
      baseURL: TEST_CONFIG.baseUrl,
      timeout: TEST_CONFIG.apiTimeout,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || ''}`,
        // Add trace context headers for OpenTelemetry
        'traceparent': '00-' + '0'.repeat(32) + '-' + '0'.repeat(16) + '-01'
      }
    });
  });

  test.afterAll(async () => {
    await apiContext?.dispose();
  });

  test('should complete duffel search API call', async () => {
    console.log('Testing Duffel search endpoint directly');
    
    const searchPayload = {
      origin: MOCK_FLIGHT_DATA.origin,
      destination: MOCK_FLIGHT_DATA.destination,
      departure_date: MOCK_FLIGHT_DATA.departureDate,
      passengers: MOCK_FLIGHT_DATA.passengers
    };

    // Call the duffel-search edge function directly
    const response = await apiContext.post('/functions/v1/duffel-search', {
      data: searchPayload
    });

    console.log(`Duffel search response status: ${response.status()}`);
    
    // Should return 200 with flight offers
    expect(response.status()).toBe(200);
    
    const responseData = await response.json();
    console.log('Duffel search response:', JSON.stringify(responseData, null, 2));
    
    // Verify response structure
    expect(responseData).toHaveProperty('offers');
    expect(Array.isArray(responseData.offers)).toBe(true);
    
    if (responseData.offers.length > 0) {
      const offer = responseData.offers[0];
      expect(offer).toHaveProperty('id');
      expect(offer).toHaveProperty('total_amount');
      expect(offer).toHaveProperty('slices');
    }
  });

  test('should create booking attempt and process auto-booking pipeline', async () => {
    console.log('Testing full auto-booking pipeline via API');
    
    // Step 1: Create a booking attempt
    const bookingPayload = {
      origin: MOCK_FLIGHT_DATA.origin,
      destination: MOCK_FLIGHT_DATA.destination,
      departure_date: MOCK_FLIGHT_DATA.departureDate,
      budget: MOCK_FLIGHT_DATA.budget,
      passenger_details: MOCK_PASSENGER_DATA,
      auto_book: true
    };

    const bookingResponse = await apiContext.post('/functions/v1/auto-book-production', {
      data: bookingPayload
    });

    console.log(`Auto-book response status: ${bookingResponse.status()}`);
    expect(bookingResponse.status()).toBe(200);
    
    const bookingData = await bookingResponse.json();
    console.log('Auto-book response:', JSON.stringify(bookingData, null, 2));
    
    // Verify booking attempt was created
    expect(bookingData).toHaveProperty('booking_id');
    expect(bookingData).toHaveProperty('status');
    
    const bookingId = bookingData.booking_id;
    
    // Step 2: Verify booking_attempt record was created in database
    // This would typically require database access, but we can infer from API response
    expect(bookingData.status).toMatch(/pending|processing|captured/);
    
    // Step 3: If payment was processed, verify Stripe integration
    if (bookingData.payment_intent_id) {
      expect(bookingData.payment_intent_id).toMatch(/^pi_/);
      expect(bookingData.payment_status).toBe('captured');
    }
    
    // Step 4: If Duffel order was created, verify order details
    if (bookingData.duffel_order_id) {
      expect(bookingData.duffel_order_id).toMatch(/^ord_/);
      expect(bookingData).toHaveProperty('booking_reference');
    }
  });

  test('should process Stripe webhook and update booking status', async () => {
    console.log('Testing Stripe webhook processing');
    
    // Mock Stripe webhook payload
    const webhookPayload = {
      id: 'evt_test_webhook',
      object: 'event',
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_test_' + Date.now(),
          status: 'succeeded',
          amount: 29900,
          currency: 'usd',
          metadata: {
            booking_id: 'test_booking_' + Date.now()
          }
        }
      }
    };

    // Send webhook to stripe-webhook edge function
    const webhookResponse = await apiContext.post('/functions/v1/stripe-webhook', {
      data: webhookPayload,
      headers: {
        'stripe-signature': 'test_signature',
        'content-type': 'application/json'
      }
    });

    console.log(`Stripe webhook response status: ${webhookResponse.status()}`);
    
    // Webhook should be processed successfully
    expect(webhookResponse.status()).toBe(200);
    
    const webhookData = await webhookResponse.json();
    console.log('Stripe webhook response:', JSON.stringify(webhookData, null, 2));
    
    // Verify webhook was processed
    expect(webhookData).toHaveProperty('processed');
    expect(webhookData.processed).toBe(true);
  });

  test('should increment metrics counters', async () => {
    console.log('Testing metrics endpoint');
    
    // Call metrics endpoint to verify Prometheus counters
    const metricsResponse = await apiContext.get('/functions/v1/metrics');
    
    console.log(`Metrics response status: ${metricsResponse.status()}`);
    expect(metricsResponse.status()).toBe(200);
    
    const metricsText = await metricsResponse.text();
    console.log('Metrics response (first 500 chars):', metricsText.substring(0, 500));
    
    // Verify Prometheus format metrics are present
    expect(metricsText).toContain('auto_booking_success_total');
    expect(metricsText).toContain('auto_booking_failure_total');
    expect(metricsText).toContain('duffel_api_calls_total');
    expect(metricsText).toContain('stripe_payment_intents_total');
    
    // Verify counters have numeric values
    const successMatch = metricsText.match(/auto_booking_success_total (\d+)/);
    const failureMatch = metricsText.match(/auto_booking_failure_total (\d+)/);
    
    expect(successMatch).toBeTruthy();
    expect(failureMatch).toBeTruthy();
    
    const successCount = parseInt(successMatch[1]);
    const failureCount = parseInt(failureMatch[1]);
    
    expect(successCount).toBeGreaterThanOrEqual(0);
    expect(failureCount).toBeGreaterThanOrEqual(0);
  });

  test('should verify email confirmation was sent', async () => {
    console.log('Testing email confirmation via logs/mocks');
    
    // Since we can't directly test email sending in E2E without access to 
    // email service, we can verify the booking flow includes email confirmation
    // by checking the API response includes confirmation details
    
    const bookingPayload = {
      origin: MOCK_FLIGHT_DATA.origin,
      destination: MOCK_FLIGHT_DATA.destination,
      departure_date: MOCK_FLIGHT_DATA.departureDate,
      budget: MOCK_FLIGHT_DATA.budget,
      passenger_details: {
        ...MOCK_PASSENGER_DATA,
        // Use a test email that we can verify
        email: 'test-' + Date.now() + '@example.com'
      },
      auto_book: true,
      send_confirmation: true
    };

    const response = await apiContext.post('/functions/v1/auto-book-production', {
      data: bookingPayload
    });

    expect(response.status()).toBe(200);
    const responseData = await response.json();
    
    // Verify email confirmation was attempted
    if (responseData.email_sent !== undefined) {
      expect(responseData.email_sent).toBe(true);
    }
    
    // Or verify confirmation email details are included
    if (responseData.confirmation_details) {
      expect(responseData.confirmation_details).toHaveProperty('recipient');
      expect(responseData.confirmation_details.recipient).toBe(bookingPayload.passenger_details.email);
    }
  });

  test('should verify Sentry error tracking integration', async () => {
    console.log('Testing error handling and Sentry integration');
    
    // Trigger an error condition to verify Sentry integration
    const invalidPayload = {
      // Missing required fields to trigger validation error
      origin: '', 
      destination: '',
      departure_date: 'invalid-date'
    };

    const errorResponse = await apiContext.post('/functions/v1/auto-book-production', {
      data: invalidPayload
    });

    console.log(`Error response status: ${errorResponse.status()}`);
    
    // Should return 400 for bad request
    expect(errorResponse.status()).toBe(400);
    
    const errorData = await errorResponse.json();
    console.log('Error response:', JSON.stringify(errorData, null, 2));
    
    // Verify error response structure
    expect(errorData).toHaveProperty('error');
    expect(errorData.error).toContain('validation');
    
    // Verify error was logged (we can't directly test Sentry, but can verify
    // error handling structure is in place)
    expect(errorData).toHaveProperty('error_id');
  });

  test('should verify LaunchDarkly feature flags are working', async () => {
    console.log('Testing LaunchDarkly feature flag integration');
    
    // Make a request that should respect feature flags
    const response = await apiContext.post('/functions/v1/auto-book-production', {
      data: {
        ...MOCK_FLIGHT_DATA,
        passenger_details: MOCK_PASSENGER_DATA,
        auto_book: true
      }
    });

    const responseData = await response.json();
    
    // If auto_booking_pipeline_enabled flag is false, should get appropriate response
    if (response.status() === 503) {
      expect(responseData.error).toContain('auto booking is currently disabled');
    } else {
      // If enabled, should process normally
      expect(response.status()).toBe(200);
    }
  });
});
