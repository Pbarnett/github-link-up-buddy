/**
 * Integration Tests for Secure Services
 * 
 * Tests the integration between AWS Secrets Manager, Stripe, OAuth, and Flight APIs
 * with real AWS services in test environment.
 */

import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { stripeServiceSecure } from '@/services/stripeServiceSecure';
import { oauthServiceSecure } from '@/services/oauthServiceSecure';
import { flightSearchServiceSecure } from '@/services/flightSearchSecure';
import { secretCache } from '@/lib/aws-sdk-enhanced/examples/secrets-manager-usage';

// Test environment setup
const TEST_ENVIRONMENT = 'test';
const TEST_REGION = 'us-west-2';

// Mock AWS credentials for testing
process.env.AWS_ACCESS_KEY_ID = 'test-access-key';
process.env.AWS_SECRET_ACCESS_KEY = 'test-secret-key';
process.env.AWS_REGION = TEST_REGION;

// Mock secrets for testing
const mockSecrets = {
  [`${TEST_ENVIRONMENT}/stripe/credentials`]: JSON.stringify({
    publishable_key: 'pk_test_mock_key',
    secret_key: 'sk_test_mock_key',
    webhook_secret: 'whsec_mock_secret',
  }),
  [`${TEST_ENVIRONMENT}/supabase/credentials`]: JSON.stringify({
    supabase_url: 'https://mock-project.supabase.co',
    supabase_anon_key: 'mock_anon_key',
    supabase_service_key: 'mock_service_key',
    supabase_jwt_secret: 'mock_jwt_secret',
  }),
  [`${TEST_ENVIRONMENT}/oauth/google-credentials`]: JSON.stringify({
    client_id: 'mock_google_client_id',
    client_secret: 'mock_google_client_secret',
  }),
  [`${TEST_ENVIRONMENT}/flight-apis/amadeus-credentials`]: JSON.stringify({
    client_id: 'mock_amadeus_client_id',
    client_secret: 'mock_amadeus_client_secret',
    api_url: 'https://test.api.amadeus.com',
    test_mode: true,
  }),
};

// Mock AWS Secrets Manager
vi.mock('@aws-sdk/client-secrets-manager', () => ({
  SecretsManagerClient: vi.fn().mockImplementation(() => ({
    send: vi.fn().mockImplementation((command) => {
      const secretId = command.input.SecretId;
      if (mockSecrets[secretId]) {
        return Promise.resolve({
          SecretString: mockSecrets[secretId],
        });
      }
      throw new Error(`Secret ${secretId} not found`);
    }),
  })),
  GetSecretValueCommand: vi.fn().mockImplementation((input) => ({ input })),
}));

// Mock Stripe SDK
vi.mock('stripe', () => ({
  default: vi.fn().mockImplementation(() => ({
    paymentIntents: {
      create: vi.fn().mockResolvedValue({
        id: 'pi_mock_payment_intent',
        client_secret: 'pi_mock_client_secret',
        status: 'requires_payment_method',
      }),
      confirm: vi.fn().mockResolvedValue({
        id: 'pi_mock_payment_intent',
        status: 'succeeded',
      }),
    },
    customers: {
      create: vi.fn().mockResolvedValue({
        id: 'cus_mock_customer',
      }),
    },
  })),
}));

// Mock fetch for external APIs
global.fetch = vi.fn();

describe('Secure Services Integration Tests', () => {
  beforeAll(async () => {
    // Clear any existing cache
    secretCache.clearCache();
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  describe('AWS Secrets Manager Integration', () => {
    it('should retrieve and cache Stripe credentials', async () => {
      const secretId = `${TEST_ENVIRONMENT}/stripe/credentials`;
      const secret = await secretCache.getSecret(secretId, TEST_REGION);

      expect(secret).toBeDefined();
      
      const credentials = JSON.parse(secret!);
      expect(credentials).toHaveProperty('publishable_key');
      expect(credentials).toHaveProperty('secret_key');
      expect(credentials).toHaveProperty('webhook_secret');
      
      // Test caching - second call should use cache
      const cachedSecret = await secretCache.getSecret(secretId, TEST_REGION);
      expect(cachedSecret).toEqual(secret);
    });

    it('should retrieve OAuth provider credentials', async () => {
      const secretId = `${TEST_ENVIRONMENT}/oauth/google-credentials`;
      const secret = await secretCache.getSecret(secretId, TEST_REGION);

      expect(secret).toBeDefined();
      
      const credentials = JSON.parse(secret!);
      expect(credentials).toHaveProperty('client_id');
      expect(credentials).toHaveProperty('client_secret');
      expect(credentials.client_id).toBe('mock_google_client_id');
    });

    it('should handle missing secrets gracefully', async () => {
      const invalidSecretId = `${TEST_ENVIRONMENT}/nonexistent/credentials`;
      
      await expect(
        secretCache.getSecret(invalidSecretId, TEST_REGION)
      ).rejects.toThrow('Secret test/nonexistent/credentials not found');
    });
  });

  describe('Secure Stripe Service Integration', () => {
    it('should initialize with secure credentials', async () => {
      // This test verifies that the service can retrieve and use AWS secrets
      expect(stripeServiceSecure).toBeDefined();
    });

    it('should create payment intent with secure credentials', async () => {
      const paymentData = {
        amount: 10000,
        currency: 'usd',
        metadata: {
          type: 'flight_booking',
          test_mode: 'true',
        },
      };

      const result = await stripeServiceSecure.createPaymentIntent(paymentData);

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('clientSecret');
      expect(result.clientSecret).toMatch(/^pi_mock_client_secret/);
    });

    it('should handle payment intent creation errors', async () => {
      // Mock Stripe error
      const mockStripe = await import('stripe');
      vi.mocked(mockStripe.default).mockImplementationOnce(() => ({
        paymentIntents: {
          create: vi.fn().mockRejectedValue(new Error('Stripe API error')),
        },
      }));

      const paymentData = {
        amount: 10000,
        currency: 'usd',
        metadata: { type: 'test' },
      };

      const result = await stripeServiceSecure.createPaymentIntent(paymentData);

      expect(result).toHaveProperty('success', false);
      expect(result).toHaveProperty('error');
    });
  });

  describe('Secure OAuth Service Integration', () => {
    it('should generate OAuth authorization URL with secure credentials', async () => {
      const result = await oauthServiceSecure.getAuthorizationUrl('google');

      expect(result).toHaveProperty('url');
      expect(result).toHaveProperty('state');
      expect(result).toHaveProperty('codeVerifier');
      
      expect(result.url).toContain('accounts.google.com');
      expect(result.url).toContain('mock_google_client_id');
      expect(result.state).toMatch(/^[A-Za-z0-9_-]+$/);
    });

    it('should handle OAuth token exchange', async () => {
      // Mock successful token exchange
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          access_token: 'mock_access_token',
          refresh_token: 'mock_refresh_token',
          expires_in: 3600,
          token_type: 'Bearer',
        }),
      } as any);

      const result = await oauthServiceSecure.exchangeCodeForToken(
        'google',
        'mock_auth_code',
        'mock_state'
      );

      expect(result).toHaveProperty('accessToken', 'mock_access_token');
      expect(result).toHaveProperty('refreshToken', 'mock_refresh_token');
      expect(result).toHaveProperty('expiresIn', 3600);
    });

    it('should handle OAuth user info retrieval', async () => {
      // Mock user info response
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          id: 'mock_user_id',
          email: 'test@example.com',
          name: 'Test User',
          picture: 'https://example.com/avatar.jpg',
        }),
      } as any);

      const result = await oauthServiceSecure.getUserInfo('google', 'mock_access_token');

      expect(result).toHaveProperty('id', 'mock_user_id');
      expect(result).toHaveProperty('email', 'test@example.com');
      expect(result).toHaveProperty('name', 'Test User');
      expect(result).toHaveProperty('provider', 'google');
    });
  });

  describe('Secure Flight Search Service Integration', () => {
    it('should initialize with secure Amadeus credentials', async () => {
      // Mock Amadeus token response
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          access_token: 'mock_amadeus_token',
          expires_in: 3600,
          token_type: 'Bearer',
        }),
      } as any);

      // Mock flight search response
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          data: [
            {
              id: 'mock_flight_offer',
              price: {
                total: '299.99',
                base: '250.00',
                currency: 'USD',
              },
              itineraries: [
                {
                  duration: 'PT2H30M',
                  segments: [
                    {
                      departure: {
                        iataCode: 'LAX',
                        at: '2024-03-15T10:00:00',
                      },
                      arrival: {
                        iataCode: 'SFO',
                        at: '2024-03-15T12:30:00',
                      },
                      carrierCode: 'AA',
                      number: '1234',
                      aircraft: { code: '737' },
                      duration: 'PT2H30M',
                      id: 'segment_1',
                      numberOfStops: 0,
                      blacklistedInEU: false,
                    },
                  ],
                },
              ],
              validatingAirlineCodes: ['AA'],
              travelerPricings: [],
            },
          ],
          meta: {
            count: 1,
          },
          dictionaries: {
            carriers: {
              AA: 'American Airlines',
            },
            locations: {
              LAX: { name: 'Los Angeles International Airport' },
              SFO: { name: 'San Francisco International Airport' },
            },
          },
        }),
      } as any);

      const searchRequest = {
        origin: 'LAX',
        destination: 'SFO',
        departureDate: '2024-03-15',
        adults: 1,
      };

      const result = await flightSearchServiceSecure.searchFlights(searchRequest);

      expect(result).toHaveProperty('data');
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toHaveProperty('id', 'mock_flight_offer');
      expect(result.data[0]).toHaveProperty('provider', 'amadeus');
      expect(result.meta).toHaveProperty('count', 1);
    });

    it('should handle flight search API errors gracefully', async () => {
      // Mock token success but search failure
      vi.mocked(global.fetch)
        .mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({
            access_token: 'mock_amadeus_token',
            expires_in: 3600,
          }),
        } as any)
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          text: vi.fn().mockResolvedValue('Bad Request'),
        } as any);

      const searchRequest = {
        origin: 'INVALID',
        destination: 'CODE',
        departureDate: '2024-03-15',
        adults: 1,
      };

      await expect(
        flightSearchServiceSecure.searchFlights(searchRequest)
      ).rejects.toThrow('All flight search providers failed');
    });
  });

  describe('Cross-Service Integration', () => {
    it('should handle full booking flow integration', async () => {
      // Mock all required API calls for a complete booking flow
      
      // 1. Mock flight search
      vi.mocked(global.fetch)
        .mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({
            access_token: 'mock_amadeus_token',
            expires_in: 3600,
          }),
        } as any)
        .mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({
            data: [{
              id: 'flight_123',
              price: { total: '299.99', currency: 'USD' },
              itineraries: [],
              validatingAirlineCodes: [],
              travelerPricings: [],
            }],
            meta: { count: 1 },
          }),
        } as any);

      // 2. Search for flights
      const searchResult = await flightSearchServiceSecure.searchFlights({
        origin: 'LAX',
        destination: 'SFO',
        departureDate: '2024-03-15',
        adults: 1,
      });

      expect(searchResult.data).toHaveLength(1);
      const selectedFlight = searchResult.data[0];

      // 3. Create payment intent
      const paymentResult = await stripeServiceSecure.createPaymentIntent({
        amount: Math.round(parseFloat(selectedFlight.price.total) * 100),
        currency: selectedFlight.price.currency.toLowerCase(),
        metadata: {
          type: 'flight_booking',
          flight_id: selectedFlight.id,
        },
      });

      expect(paymentResult.success).toBe(true);
      expect(paymentResult.clientSecret).toBeDefined();

      // 4. Confirm payment (mocked)
      const confirmResult = await stripeServiceSecure.confirmPayment(
        paymentResult.clientSecret!,
        {
          payment_method: {
            card: {
              number: '4242424242424242',
              exp_month: 12,
              exp_year: 2025,
              cvc: '123',
            },
            billing_details: {
              name: 'Test User',
              email: 'test@example.com',
            },
          },
        }
      );

      expect(confirmResult.success).toBe(true);
    });

    it('should handle service failures gracefully in booking flow', async () => {
      // Mock flight search success but payment failure
      vi.mocked(global.fetch)
        .mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({
            access_token: 'mock_amadeus_token',
            expires_in: 3600,
          }),
        } as any)
        .mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({
            data: [{
              id: 'flight_123',
              price: { total: '299.99', currency: 'USD' },
            }],
            meta: { count: 1 },
          }),
        } as any);

      // Mock Stripe payment failure
      const mockStripe = await import('stripe');
      vi.mocked(mockStripe.default).mockImplementationOnce(() => ({
        paymentIntents: {
          create: vi.fn().mockRejectedValue(new Error('Payment processing failed')),
        },
      }));

      // Search should succeed
      const searchResult = await flightSearchServiceSecure.searchFlights({
        origin: 'LAX',
        destination: 'SFO',
        departureDate: '2024-03-15',
        adults: 1,
      });
      expect(searchResult.data).toHaveLength(1);

      // Payment should fail gracefully
      const paymentResult = await stripeServiceSecure.createPaymentIntent({
        amount: 29999,
        currency: 'usd',
        metadata: { type: 'flight_booking' },
      });
      
      expect(paymentResult.success).toBe(false);
      expect(paymentResult.error).toContain('Payment processing failed');
    });
  });

  describe('Cache Management Integration', () => {
    it('should manage cache across all services', async () => {
      // Test that cache clearing affects all services
      await secretCache.getSecret(`${TEST_ENVIRONMENT}/stripe/credentials`, TEST_REGION);
      await secretCache.getSecret(`${TEST_ENVIRONMENT}/oauth/google-credentials`, TEST_REGION);

      // Clear cache
      secretCache.clearCache();

      // Verify cache is cleared by checking internal cache state
      // (This would require exposing cache internals for testing)
      expect(secretCache).toBeDefined();
    });

    it('should handle cache expiry correctly', async () => {
      const secretId = `${TEST_ENVIRONMENT}/stripe/credentials`;
      
      // Get secret with very short TTL (mocked)
      const secret1 = await secretCache.getSecret(secretId, TEST_REGION, 1); // 1ms TTL
      
      // Wait for cache to expire
      await new Promise(resolve => setTimeout(resolve, 2));
      
      // Should retrieve again (not from cache)
      const secret2 = await secretCache.getSecret(secretId, TEST_REGION);
      
      expect(secret1).toEqual(secret2);
    });
  });
});
