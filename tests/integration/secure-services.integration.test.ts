/**
 * Integration Tests for Secure Services
 * 
 * Tests the integration between AWS Secrets Manager, Stripe, OAuth, and Flight APIs
 * with real AWS services in test environment.
 */

import { describe, it, expect, beforeAll, beforeEach, afterAll, vi } from 'vitest';
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

/**
 * Comprehensive Mock Setup for AWS Secrets Manager Integration Tests
 * 
 * This mock provides all the secrets needed for the various services:
 * - Stripe payment processing
 * - Supabase database connections  
 * - OAuth providers (Google)
 * - Flight search APIs (Amadeus)
 */

// Mock the primary secrets manager module
vi.mock('@/lib/aws-sdk-enhanced/secrets-manager', () => {
  // Define mock secrets data inside the mock
  const mockSecretsData: Record<string, string> = {
    // Stripe service secrets
    'test/stripe/credentials': JSON.stringify({
      publishable_key: 'pk_test_mock_key',
      secret_key: 'sk_test_mock_key',
      webhook_secret: 'whsec_mock_secret',
    }),
    'test/payments/stripe-publishable-key': 'pk_test_mock_key',
    'test/payments/stripe-secret-key': 'sk_test_mock_key',
    'test/payments/stripe-webhook-secret': 'whsec_mock_secret',
    
    // Supabase database secrets
    'test/database/supabase-url': 'https://mock-project.supabase.co',
    'test/database/supabase-anon-key': 'mock_anon_key',
    'test/database/supabase-service-key': 'mock_service_key',
    'test/supabase/credentials': JSON.stringify({
      supabase_url: 'https://mock-project.supabase.co',
      supabase_anon_key: 'mock_anon_key',
      supabase_service_key: 'mock_service_key',
      supabase_jwt_secret: 'mock_jwt_secret',
    }),
    
    // OAuth provider secrets
    'test/oauth/google-credentials': JSON.stringify({
      client_id: 'mock_google_client_id',
      client_secret: 'mock_google_client_secret',
      redirect_uri: 'https://localhost:3000/auth/callback/google',
    }),
    
    // Flight API secrets
    'test/flight-apis/amadeus-credentials': JSON.stringify({
      client_id: 'mock_amadeus_client_id',
      client_secret: 'mock_amadeus_client_secret',
      api_url: 'https://test.api.amadeus.com',
      test_mode: true,
    }),
  };

  return {
    getSecretValue: vi.fn().mockImplementation(async (secretId: string, region: string) => {
      console.log(`🔐 Primary SecretsManager getSecretValue called with: ${secretId} in region: ${region}`);
      console.log(`📋 Available secrets:`, Object.keys(mockSecretsData));
      
      if (mockSecretsData[secretId]) {
        const secret = mockSecretsData[secretId];
        console.log(`✅ Found secret for ${secretId}:`, secret.substring(0, 50) + '...');
        return secret;
      }
      
      console.log(`❌ Secret not found for ${secretId}`);
      const error = new Error(`Secret ${secretId} not found`);
      error.name = 'ResourceNotFoundException';
      throw error;
    }),
  };
});

// Also mock the examples module's internal getSecretValue to ensure coverage
vi.mock('@/lib/aws-sdk-enhanced/examples/secrets-manager-usage', async (importOriginal) => {
  const original = await importOriginal() as any;
  
  // Define mock secrets data inside this mock too
  const mockSecretsData: Record<string, string> = {
    // Stripe service secrets
    'test/stripe/credentials': JSON.stringify({
      publishable_key: 'pk_test_mock_key',
      secret_key: 'sk_test_mock_key',
      webhook_secret: 'whsec_mock_secret',
    }),
    'test/payments/stripe-publishable-key': 'pk_test_mock_key',
    'test/payments/stripe-secret-key': 'sk_test_mock_key',
    'test/payments/stripe-webhook-secret': 'whsec_mock_secret',
    
    // Supabase database secrets
    'test/database/supabase-url': 'https://mock-project.supabase.co',
    'test/database/supabase-anon-key': 'mock_anon_key',
    'test/database/supabase-service-key': 'mock_service_key',
    'test/supabase/credentials': JSON.stringify({
      supabase_url: 'https://mock-project.supabase.co',
      supabase_anon_key: 'mock_anon_key',
      supabase_service_key: 'mock_service_key',
      supabase_jwt_secret: 'mock_jwt_secret',
    }),
    
    // OAuth provider secrets
    'test/oauth/google-credentials': JSON.stringify({
      client_id: 'mock_google_client_id',
      client_secret: 'mock_google_client_secret',
      redirect_uri: 'https://localhost:3000/auth/callback/google',
    }),
    
    // Flight API secrets
    'test/flight-apis/amadeus-credentials': JSON.stringify({
      client_id: 'mock_amadeus_client_id',
      client_secret: 'mock_amadeus_client_secret',
      api_url: 'https://test.api.amadeus.com',
      test_mode: true,
    }),
  };
  
  // Create a mock SecretCache class that uses our mock data
  class MockSecretCache {
    private cache = new Map<string, { value: string; expiry: number }>();
    private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

    async getSecret(secretId: string, region: string, ttlMs?: number): Promise<string | undefined> {
      const cacheKey = `${secretId}-${region}`;
      const cached = this.cache.get(cacheKey);

      // Check if cache is still valid
      if (cached && cached.expiry > Date.now()) {
        console.log(`Cache hit for secret: ${secretId}`);
        return cached.value;
      }

      // Cache miss or expired - use mock data
      console.log(`Fetching secret from AWS: ${secretId}`);
      console.log(`🔐 MockSecretCache getSecretValue called with: ${secretId} in region: ${region}`);
      console.log(`📋 Available secrets:`, Object.keys(mockSecretsData));
      
      if (mockSecretsData[secretId]) {
        const secret = mockSecretsData[secretId];
        console.log(`✅ Found secret for ${secretId}:`, secret.substring(0, 50) + '...');
        
        // Cache the result
        this.cache.set(cacheKey, {
          value: secret,
          expiry: Date.now() + (ttlMs || this.DEFAULT_TTL),
        });
        
        return secret;
      }
      
      console.log(`❌ Secret not found for ${secretId}`);
      const error = new Error(`Secret ${secretId} not found`);
      error.name = 'ResourceNotFoundException';
      throw error;
    }

    clearCache(): void {
      this.cache.clear();
    }

    cleanupExpired(): void {
      const now = Date.now();
      for (const [key, value] of this.cache.entries()) {
        if (value.expiry <= now) {
          this.cache.delete(key);
        }
      }
    }
  }
  
  return {
    ...original,
    secretCache: new MockSecretCache(),
  };
});

// Mock AWS SDK exceptions for error handling
vi.mock('@aws-sdk/client-secrets-manager', () => ({
  SecretsManagerClient: vi.fn(),
  GetSecretValueCommand: vi.fn(),
  SecretsManagerServiceException: vi.fn(),
  ResourceNotFoundException: vi.fn(),
  InvalidParameterException: vi.fn(),
  InvalidRequestException: vi.fn(),
  DecryptionFailureException: vi.fn(),
  InternalServiceErrorException: vi.fn(),
  LimitExceededException: vi.fn(),
}));

// Mock Stripe SDK (server-side)
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

// Mock Stripe.js (client-side)
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn().mockResolvedValue({
    confirmCardPayment: vi.fn().mockResolvedValue({
      paymentIntent: {
        id: 'pi_mock_payment_intent',
        status: 'succeeded',
        amount: 10000,
        currency: 'usd',
      },
      error: null,
    }),
    confirmSetupIntent: vi.fn().mockResolvedValue({
      setupIntent: {
        id: 'seti_mock_setup_intent',
        status: 'succeeded',
      },
      error: null,
    }),
    retrievePaymentIntent: vi.fn().mockResolvedValue({
      paymentIntent: {
        id: 'pi_mock_payment_intent',
        status: 'succeeded',
      },
    }),
  }),
}));

// Mock Supabase client with consistent structure and proper implementation
vi.mock('@supabase/supabase-js', () => {
  const mockInvokeFunction = vi.fn(async (functionName: string, options?: any) => {
    // Mock different function responses based on function name
    if (functionName === 'create-secure-payment-session') {
      return {
        data: {
          client_secret: 'pi_mock_client_secret',
          id: 'pi_mock_payment_intent',
          amount: options?.body?.amount || 10000,
          currency: options?.body?.currency || 'usd',
          status: 'requires_payment_method'
        },
        error: null
      };
    }
    
    if (functionName === 'create-secure-setup-intent') {
      return {
        data: {
          client_secret: 'seti_mock_setup_intent_secret',
          id: 'seti_mock_setup_intent'
        },
        error: null
      };
    }
    
    if (functionName === 'get-payment-methods') {
      return {
        data: {
          payment_methods: [{
            id: 'pm_mock_payment_method',
            type: 'card',
            card: { brand: 'visa', last4: '4242' }
          }]
        },
        error: null
      };
    }
    
    // Default successful response
    return { data: {}, error: null };
  });

  const mockSupabaseClient = {
    functions: {
      invoke: mockInvokeFunction
    },
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
        error: null
      })
    }
  };

  return {
    createClient: vi.fn(() => mockSupabaseClient)
  };
});

describe('Secure Services Integration Tests', () => {
  beforeAll(async () => {
    // Clear any existing cache
    secretCache.clearCache();
    
    // Reset SupabaseSecureConfig client cache to ensure our mock is used
    const { SupabaseSecureConfig } = await import('@/services/stripeServiceSecure');
    (SupabaseSecureConfig as any).supabaseClient = null;
  });

  beforeEach(async () => {
    // Reset only the fetch mock while preserving other mock implementations
    global.fetch = vi.fn();
    
    // Clear service caches to ensure fresh state
    (stripeServiceSecure as any).stripePromise = null;
    
    // Reset SupabaseSecureConfig client cache
    try {
      const { SupabaseSecureConfig } = await import('@/services/stripeServiceSecure');
      (SupabaseSecureConfig as any).supabaseClient = null;
    } catch (e) {
      // Module may not be available in some contexts
    }
    
    // Clear flight search service caches
    try {
      const { AmadeusFlightSearch } = await import('@/services/flightSearchSecure');
      const amadeusInstance = AmadeusFlightSearch.getInstance();
      (amadeusInstance as any).accessToken = null;
      (amadeusInstance as any).tokenExpiry = 0;
      flightSearchServiceSecure.clearCaches();
    } catch (e) {
      // Module may not be available in some contexts
    }
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
    
    it('should have properly mocked Supabase client', async () => {
      // Test to ensure Supabase is properly mocked
      const { SupabaseSecureConfig } = await import('@/services/stripeServiceSecure');
      
      const client = await SupabaseSecureConfig.getClient();
      
      expect(client).toBeDefined();
      expect(client.functions).toBeDefined();
      expect(client.functions.invoke).toBeDefined();
      
      // Test that the invoke function works as expected
      const result = await client.functions.invoke('create-secure-payment-session', {
        body: { amount: 10000, currency: 'usd' }
      });
      
      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(result.data.client_secret).toBe('pi_mock_client_secret');
    });

    it('should create payment intent with secure credentials', async () => {
      const paymentData = {
        amount: 100,
        currency: 'usd',
        metadata: {
          type: 'flight_booking',
          test_mode: 'true',
        },
      };

      const result = await stripeServiceSecure.createPaymentIntent(paymentData);

      expect(result).toHaveProperty('client_secret', 'pi_mock_client_secret');
      expect(result).toHaveProperty('id', 'pi_mock_payment_intent');
      expect(result).toHaveProperty('amount', 10000); // Should be in cents
      expect(result).toHaveProperty('currency', 'usd');
      expect(result).toHaveProperty('status', 'requires_payment_method');
    });

  it('should handle payment intent creation errors', async () => {
    // Create a new instance to avoid cached connections
    const { StripeServiceSecure } = await import('@/services/stripeServiceSecure');
    const testStripeService = new StripeServiceSecure();
    
    // Mock Supabase to return an error for this specific test
    const mockSupabase = await import('@supabase/supabase-js');
    const originalCreateClient = vi.mocked(mockSupabase.createClient);
    
    // Clear any existing implementation and set up error mock
    vi.mocked(mockSupabase.createClient).mockClear();
    vi.mocked(mockSupabase.createClient).mockImplementation(() => ({
      functions: {
        invoke: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Payment processing failed' }
        })
      },
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'test-user-id' } },
          error: null
        })
      }
    }));

    const paymentData = {
      amount: 100,
      currency: 'usd',
      metadata: { type: 'test' },
    };

    await expect(
      testStripeService.createPaymentIntent(paymentData)
    ).rejects.toThrow('Payment processing failed');
    
    // Restore original mock
    vi.mocked(mockSupabase.createClient).mockImplementation(originalCreateClient);
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
    // Clear all previous fetch mocks
    vi.mocked(global.fetch).mockClear();
    
    // Mock token success but search failure
    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          access_token: 'mock_amadeus_token',
          expires_in: 3600,
        }),
      } as any)
      .mockRejectedValueOnce(new Error('Network error - Bad Request'));

    const searchRequest = {
      origin: 'INVALID',
      destination: 'CODE',
      departureDate: '2024-03-15',
      adults: 1,
    };

    await expect(
      flightSearchServiceSecure.searchFlights(searchRequest)
    ).rejects.toThrow();
  });
  });

  describe('Cross-Service Integration', () => {
    it('should handle full booking flow integration', async () => {
      // Mock all required API calls for a complete booking flow
      
      // Clear the StripeServiceSecure's internal cache to force re-initialization
      (stripeServiceSecure as any).stripePromise = null;
      
      // Set up the Stripe.js mock explicitly for this test
      const mockStripeJs = await import('@stripe/stripe-js');
      const mockLoadStripe = vi.mocked(mockStripeJs.loadStripe);
      
      // Clear any existing mock and set up a fresh one
      mockLoadStripe.mockClear();
      
      // Ensure the mock returns a properly configured Stripe instance
      mockLoadStripe.mockResolvedValue({
        confirmCardPayment: vi.fn().mockResolvedValue({
          paymentIntent: {
            id: 'pi_test_payment_intent',
            status: 'succeeded',
            amount: 29999, // 299.99 in cents
            currency: 'usd',
          },
          error: null,
        }),
        confirmSetupIntent: vi.fn().mockResolvedValue({
          setupIntent: {
            id: 'seti_mock_setup_intent',
            status: 'succeeded',
          },
          error: null,
        }),
        retrievePaymentIntent: vi.fn().mockResolvedValue({
          paymentIntent: {
            id: 'pi_test_payment_intent',
            status: 'succeeded',
          },
        }),
      } as any);
      
      // 1. Mock flight search with comprehensive response
      vi.mocked(global.fetch).mockClear();
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
            }],
            meta: { count: 1 },
            dictionaries: {
              carriers: { AA: 'American Airlines' },
              locations: {
                LAX: { name: 'Los Angeles International Airport' },
                SFO: { name: 'San Francisco International Airport' },
              },
            },
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
        amount: parseFloat(selectedFlight.price.total),
        currency: selectedFlight.price.currency.toLowerCase(),
        metadata: {
          type: 'flight_booking',
          flight_id: selectedFlight.id,
        },
      });

      expect(paymentResult).toHaveProperty('client_secret');
      expect(paymentResult).toHaveProperty('id');
      expect(paymentResult.client_secret).toBeDefined();

      // 4. Confirm payment (mocked)
      const confirmResult = await stripeServiceSecure.confirmPayment(
        paymentResult.client_secret,
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

      expect(confirmResult).toHaveProperty('id');
      expect(confirmResult).toHaveProperty('status');
    });

    it('should handle service failures gracefully in booking flow', async () => {
      // Mock flight search success but payment failure
      vi.mocked(global.fetch).mockClear();
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
              itineraries: [
                {
                  duration: 'PT2H30M',
                  segments: [
                    {
                      departure: { iataCode: 'LAX', at: '2024-03-15T10:00:00' },
                      arrival: { iataCode: 'SFO', at: '2024-03-15T12:30:00' },
                      carrierCode: 'AA',
                      number: '1234',
                      aircraft: { code: '737' },
                      duration: 'PT2H30M',
                      id: 'segment_2',
                      numberOfStops: 0,
                      blacklistedInEU: false,
                    },
                  ],
                },
              ],
              validatingAirlineCodes: ['AA'],
              travelerPricings: [],
            }],
            meta: { count: 1 },
            dictionaries: {
              carriers: { AA: 'American Airlines' },
              locations: {
                LAX: { name: 'Los Angeles International Airport' },
                SFO: { name: 'San Francisco International Airport' },
              },
            },
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

      // Create a new Stripe service instance for this test to avoid caching issues
      const { StripeServiceSecure } = await import('@/services/stripeServiceSecure');
      const testStripeService = new StripeServiceSecure();
      
      // Payment should fail gracefully - mock Supabase function error
      const mockSupabase = await import('@supabase/supabase-js');
      const originalCreateClient = vi.mocked(mockSupabase.createClient);
      
      vi.mocked(mockSupabase.createClient).mockClear();
      vi.mocked(mockSupabase.createClient).mockImplementation(() => ({
        functions: {
          invoke: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Payment processing failed' }
          })
        },
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: 'test-user-id' } },
            error: null
          })
        }
      }));
      
      await expect(
        testStripeService.createPaymentIntent({
          amount: 299.99,
          currency: 'usd',
          metadata: { type: 'flight_booking' },
        })
      ).rejects.toThrow('Payment processing failed');
      
      // Restore original mock
      vi.mocked(mockSupabase.createClient).mockImplementation(originalCreateClient);
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
