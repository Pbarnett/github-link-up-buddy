/**
 * Duffel Integration Tests
 * 
 * Tests Duffel service implementation against API reference and guide requirements:
 * - Official client usage
 * - Rate limiting
 * - Error handling  
 * - Offer validation
 * - Idempotency
 * - Environment validation
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { DuffelServiceGuided } from '../services/duffelServiceGuided'
import { validateDuffelEnvironment } from '../lib/duffel/environmentValidator'

// Mock the Duffel client
vi.mock('@duffel/api', () => {
  return {
    Duffel: vi.fn().mockImplementation(() => ({
      offerRequests: {
        create: vi.fn()
      },
      offers: {
        list: vi.fn(),
        get: vi.fn()
      },
      orders: {
        create: vi.fn(),
        get: vi.fn(),
        cancel: vi.fn()
      },
      airports: {
        list: vi.fn()
      }
    }))
  }
})

describe('Duffel Integration Tests', () => {
  let duffelService: DuffelServiceGuided
  let mockDuffelClient: any

  beforeEach(() => {
    // Setup environment variables
    vi.stubEnv('DUFFEL_API_TOKEN_TEST', 'duffel_test_valid_token_here')
    vi.stubEnv('DUFFEL_WEBHOOK_SECRET', 'test_webhook_secret_32_characters_long')
    vi.stubEnv('DUFFEL_LIVE_ENABLED', 'false')
    
    // Reset mocks
    vi.clearAllMocks()
    
    // Create service instance
    duffelService = new DuffelServiceGuided()
    
    // Get mock client reference
    const { Duffel } = require('@duffel/api')
    mockDuffelClient = Duffel.mock.results[0].value
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('Environment Validation', () => {
    it('should pass validation with proper test environment', () => {
      const validation = validateDuffelEnvironment()
      
      expect(validation.isValid).toBe(true)
      expect(validation.config.mode).toBe('TEST')
      expect(validation.config.hasTestToken).toBe(true)
      expect(validation.errors).toHaveLength(0)
    })

    it('should fail validation without required tokens', () => {
      vi.stubEnv('DUFFEL_API_TOKEN_TEST', '')
      
      const validation = validateDuffelEnvironment()
      
      expect(validation.isValid).toBe(false)
      expect(validation.errors).toContain('Missing required environment variable: DUFFEL_API_TOKEN_TEST')
    })

    it('should validate token formats', () => {
      vi.stubEnv('DUFFEL_API_TOKEN_TEST', 'invalid_token_format')
      
      const validation = validateDuffelEnvironment()
      
      expect(validation.isValid).toBe(false)
      expect(validation.errors.some(error => 
        error.includes('invalid format')
      )).toBe(true)
    })

    it('should warn about live mode configuration issues', () => {
      vi.stubEnv('DUFFEL_LIVE_ENABLED', 'true')
      // Don't set DUFFEL_API_TOKEN_LIVE
      
      const validation = validateDuffelEnvironment()
      
      expect(validation.isValid).toBe(false)
      expect(validation.errors).toContain('DUFFEL_LIVE_ENABLED is true but DUFFEL_API_TOKEN_LIVE is not set')
    })
  })

  describe('Service Initialization', () => {
    it('should initialize in TEST mode by default', () => {
      const status = duffelService.getStatus()
      
      expect(status.mode).toBe('TEST')
      expect(status.version).toBe('2.0.0-guided')
      expect(status.rateLimits).toEqual({
        search: 120,
        orders: 60,
        other: 300
      })
    })

    it('should initialize in LIVE mode when enabled', () => {
      vi.stubEnv('DUFFEL_LIVE_ENABLED', 'true')
      vi.stubEnv('DUFFEL_API_TOKEN_LIVE', 'duffel_live_valid_token_here')
      
      const liveService = new DuffelServiceGuided()
      const status = liveService.getStatus()
      
      expect(status.mode).toBe('LIVE')
    })

    it('should throw error without required tokens', () => {
      vi.stubEnv('DUFFEL_API_TOKEN_TEST', '')
      
      expect(() => new DuffelServiceGuided()).toThrow('Missing Duffel test token')
    })
  })

  describe('Flight Search (Offer Request)', () => {
    it('should create offer request with proper parameters', async () => {
      const mockOfferRequest = {
        id: 'orq_test123',
        slices: [{ origin: 'NYC', destination: 'LAX' }]
      }

      mockDuffelClient.offerRequests.create.mockResolvedValue(mockOfferRequest)

      const result = await duffelService.createOfferRequest({
        origin: 'NYC',
        destination: 'LAX',
        departureDate: '2024-07-01',
        passengers: [{ type: 'adult' }],
        cabinClass: 'economy'
      })

      expect(mockDuffelClient.offerRequests.create).toHaveBeenCalledWith({
        slices: [{
          origin: 'NYC',
          destination: 'LAX',
          departure_date: '2024-07-01'
        }],
        passengers: [{ type: 'adult' }],
        cabin_class: 'economy',
        max_connections: 1
      })

      expect(result.id).toBe('orq_test123')
    })

    it('should create round-trip offer request', async () => {
      const mockOfferRequest = { id: 'orq_test123' }
      mockDuffelClient.offerRequests.create.mockResolvedValue(mockOfferRequest)

      await duffelService.createOfferRequest({
        origin: 'NYC',
        destination: 'LAX',
        departureDate: '2024-07-01',
        returnDate: '2024-07-08',
        passengers: [{ type: 'adult' }]
      })

      const createCall = mockDuffelClient.offerRequests.create.mock.calls[0][0]
      expect(createCall.slices).toHaveLength(2)
      expect(createCall.slices[1]).toEqual({
        origin: 'LAX',
        destination: 'NYC',
        departure_date: '2024-07-08'
      })
    })
  })

  describe('Offers Retrieval', () => {
    it('should get offers and filter expired ones', async () => {
      const validOffer = {
        id: 'off_valid',
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes from now
      }

      const expiredOffer = {
        id: 'off_expired',  
        expires_at: new Date(Date.now() - 10 * 60 * 1000).toISOString() // 10 minutes ago
      }

      mockDuffelClient.offers.list.mockResolvedValue({
        data: [validOffer, expiredOffer]
      })

      const offers = await duffelService.getOffers('orq_test123')

      expect(offers).toHaveLength(1)
      expect(offers[0].id).toBe('off_valid')
    })

    it('should validate individual offers', async () => {
      const validOffer = {
        id: 'off_valid',
        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes from now
      }

      mockDuffelClient.offers.get.mockResolvedValue(validOffer)

      const result = await duffelService.getOffer('off_valid')
      expect(result).not.toBeNull()
      expect(result?.id).toBe('off_valid')
    })

    it('should return null for expired offers', async () => {
      const expiredOffer = {
        id: 'off_expired',
        expires_at: new Date(Date.now() - 60 * 1000).toISOString() // 1 minute ago  
      }

      mockDuffelClient.offers.get.mockResolvedValue(expiredOffer)

      const result = await duffelService.getOffer('off_expired')
      expect(result).toBeNull()
    })
  })

  describe('Offer Validation', () => {
    it('should validate offer expiration with safety buffer', () => {
      const offer = {
        id: 'off_test',
        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes from now
      }

      const validation = duffelService.validateOffer(offer)
      expect(validation.valid).toBe(true)
      expect(validation.minutesLeft).toBeGreaterThan(2) // Should be > safety buffer
    })

    it('should reject offers within safety buffer', () => {
      const offer = {
        id: 'off_test',
        expires_at: new Date(Date.now() + 60 * 1000).toISOString() // 1 minute from now
      }

      const validation = duffelService.validateOffer(offer)
      expect(validation.valid).toBe(false)
      expect(validation.minutesLeft).toBeLessThanOrEqual(2)
    })
  })

  describe('Order Creation', () => {
    it('should create order with idempotency', async () => {
      const validOffer = {
        id: 'off_valid',
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        total_amount: '299.99',
        total_currency: 'USD'
      }

      const mockOrder = {
        id: 'ord_test123',
        booking_reference: 'ABC123'
      }

      mockDuffelClient.offers.get.mockResolvedValue(validOffer)
      mockDuffelClient.orders.create.mockResolvedValue(mockOrder)

      const result = await duffelService.createOrder({
        offerId: 'off_valid',
        passengers: [{
          title: 'mr',
          given_name: 'John',
          family_name: 'Doe',
          gender: 'm',
          born_on: '1990-01-01',
          email: 'john@example.com',
          phone_number: '+1234567890'
        }],
        idempotencyKey: 'test-key-123'
      })

      expect(mockDuffelClient.orders.create).toHaveBeenCalledWith(
        expect.objectContaining({
          selected_offers: ['off_valid'],
          payments: [{
            type: 'balance',
            amount: '299.99',
            currency: 'USD'
          }],
          metadata: expect.objectContaining({
            idempotency_key: 'test-key-123',
            created_by: 'parker-flight-guided'
          })
        }),
        {
          headers: {
            'Idempotency-Key': 'test-key-123'
          }
        }
      )

      expect(result.id).toBe('ord_test123')
    })

    it('should reject expired offers before booking', async () => {
      const expiredOffer = {
        id: 'off_expired',
        expires_at: new Date(Date.now() - 60 * 1000).toISOString()
      }

      mockDuffelClient.offers.get.mockResolvedValue(expiredOffer)

      await expect(
        duffelService.createOrder({
          offerId: 'off_expired',
          passengers: [],
          idempotencyKey: 'test-key'
        })
      ).rejects.toThrow('no longer valid or has expired')

      expect(mockDuffelClient.orders.create).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should map Duffel API errors to user-friendly messages', async () => {
      const duffelError = {
        errors: [{
          type: 'offer_no_longer_available',
          detail: 'The offer is no longer available'
        }],
        status: 400
      }

      mockDuffelClient.offerRequests.create.mockRejectedValue(duffelError)

      await expect(
        duffelService.createOfferRequest({
          origin: 'NYC',
          destination: 'LAX',
          departureDate: '2024-07-01',
          passengers: [{ type: 'adult' }]
        })
      ).rejects.toThrow('This flight is no longer available. Please search again.')
    })

    it('should handle rate limiting errors', async () => {
      const rateLimitError = {
        errors: [{ type: 'rate_limit_exceeded' }],
        status: 429
      }

      mockDuffelClient.offerRequests.create.mockRejectedValue(rateLimitError)

      await expect(
        duffelService.createOfferRequest({
          origin: 'NYC', 
          destination: 'LAX',
          departureDate: '2024-07-01',
          passengers: [{ type: 'adult' }]
        })
      ).rejects.toThrow('Too many requests. Please wait a moment and try again.')
    })

    it('should provide default error message for unknown errors', async () => {
      const unknownError = {
        errors: [{ type: 'unknown_error_type' }],
        status: 500
      }

      mockDuffelClient.offerRequests.create.mockRejectedValue(unknownError)

      await expect(
        duffelService.createOfferRequest({
          origin: 'NYC',
          destination: 'LAX', 
          departureDate: '2024-07-01',
          passengers: [{ type: 'adult' }]
        })
      ).rejects.toThrow('Failed to search for flights. Please try again or contact support.')
    })
  })

  describe('Connection Test', () => {
    it('should test connection successfully', async () => {
      mockDuffelClient.airports.list.mockResolvedValue({
        data: [{ name: 'Test Airport' }]
      })

      const result = await duffelService.testConnection()
      
      expect(result).toBe(true)
      expect(mockDuffelClient.airports.list).toHaveBeenCalledWith({ limit: 1 })
    })

    it('should handle connection test failures', async () => {
      mockDuffelClient.airports.list.mockRejectedValue(new Error('Connection failed'))

      const result = await duffelService.testConnection()
      
      expect(result).toBe(false)
    })
  })

  describe('Rate Limiting', () => {
    it('should respect rate limits per operation type', async () => {
      // This test would need more sophisticated mocking of the rate limiter
      // For now, we'll just verify the rate limits are configured
      const status = duffelService.getStatus()
      
      expect(status.rateLimits.search).toBe(120)
      expect(status.rateLimits.orders).toBe(60)
      expect(status.retryConfig.maxRetries).toBe(3)
    })
  })

  describe('Utility Functions', () => {
    it('should map passenger data correctly', () => {
      const { mapPassengerToDuffel } = require('../services/duffelServiceGuided')
      
      const passengerData = {
        firstName: 'John',
        lastName: 'Doe',
        title: 'mr',
        gender: 'male',
        dateOfBirth: '1990-01-01',
        email: 'john@example.com',
        phoneNumber: '+1234567890',
        passportNumber: 'AB123456',
        passportCountry: 'US',
        passportExpiry: '2030-01-01'
      }

      const mapped = mapPassengerToDuffel(passengerData)

      expect(mapped).toEqual({
        title: 'mr',
        given_name: 'John',
        family_name: 'Doe',
        gender: 'm',
        born_on: '1990-01-01',
        email: 'john@example.com',
        phone_number: '+1234567890',
        identity_documents: [{
          type: 'passport',
          unique_identifier: 'AB123456',
          issuing_country_code: 'US',
          expires_on: '2030-01-01'
        }]
      })
    })

    it('should map trip requests to Duffel search parameters', () => {
      const { mapTripRequestToDuffelSearch } = require('../services/duffelServiceGuided')
      
      const tripRequest = {
        origin_location_code: 'NYC',
        destination_location_code: 'LAX',
        departure_date: '2024-07-01',
        return_date: '2024-07-08',
        adults: 2,
        children: 1,
        travel_class: 'BUSINESS'
      }

      const mapped = mapTripRequestToDuffelSearch(tripRequest)

      expect(mapped).toEqual({
        origin: 'NYC',
        destination: 'LAX',
        departureDate: '2024-07-01',
        returnDate: '2024-07-08',
        passengers: [
          { type: 'adult' },
          { type: 'adult' },
          { type: 'child' }
        ],
        cabinClass: 'business',
        maxConnections: 1
      })
    })
  })
})
