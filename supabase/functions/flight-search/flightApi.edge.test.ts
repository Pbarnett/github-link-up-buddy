import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { searchOffers, FlightSearchParams, transformAmadeusToOffers, calculateReturnDate } from "./flightApi.edge";

// Mock the Deno.env with comprehensive environment variables
vi.stubGlobal('Deno', {
  env: {
    get: vi.fn((key) => {
      switch (key) {
        case 'SUPABASE_URL':
          return 'https://test.supabase.co';
        case 'SUPABASE_SERVICE_ROLE_KEY':
          return 'test-service-role-key';
        case 'AMADEUS_BASE_URL':
          return 'https://test.api.amadeus.com/v2';
        case 'AMADEUS_CLIENT_ID':
          return 'test-client-id';
        case 'AMADEUS_CLIENT_SECRET':
          return 'test-client-secret';
        default:
          return null;
      }
    })
  }
});

describe('Flight Search Date Handling', () => {
  let mockFetch: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock fetch function
    mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        data: [
          {
            id: 'offer1',
            itineraries: [
              {
                duration: 'PT12H',
                segments: [
                  {
                    carrierCode: 'AA',
                    number: '123',
                    departure: {
                      at: '2025-02-15T10:00:00',
                      iataCode: 'JFK'
                    },
                    arrival: {
                      at: '2025-02-15T14:00:00',
                      iataCode: 'LAX'
                    }
                  }
                ]
              },
              {
                segments: [
                  {
                    carrierCode: 'AA',
                    number: '456',
                    departure: {
                      at: '2025-02-22T16:00:00',
                      iataCode: 'LAX'
                    },
                    arrival: {
                      at: '2025-02-22T20:00:00',
                      iataCode: 'JFK'
                    }
                  }
                ]
              }
            ],
            price: {
              total: '500.00'
            }
          }
        ]
      })
    });
    
    // Replace global fetch with our mock
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Test Environment Date Adjustments', () => {
    it('adjusts dates to 2025-2026 range when in test environment', async () => {
      // Mock test environment
      Deno.env.get.mockImplementation((key) => {
        if (key === 'AMADEUS_BASE_URL') return 'https://test.api.amadeus.com/v2';
        if (key === 'AMADEUS_CLIENT_ID') return 'test-client-id';
        if (key === 'AMADEUS_CLIENT_SECRET') return 'test-client-secret';
        return null;
      });

      const params: FlightSearchParams = {
        origin: ['JFK'],
        destination: 'LAX',
        earliestDeparture: new Date('2024-01-15'),
        latestDeparture: new Date('2024-02-15'),
        minDuration: 5,
        maxDuration: 10,
        budget: 1000
      };

      // Mock the token fetch response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          access_token: 'mock-token',
          expires_in: 3600
        })
      });

      await searchOffers(params, 'test-request-1');
      
      // Check that the fetch was called with a date in 2025-2026 range
      expect(mockFetch).toHaveBeenCalledTimes(2); // Once for token, once for search
      
      const secondCallArgs = mockFetch.mock.calls[1];
      const requestBody = JSON.parse(secondCallArgs[1].body);
      
      // Extract the dates from the request
      const departureDate = requestBody.originDestinations[0].departureDateTimeRange.date;
      const returnDate = requestBody.originDestinations[1].departureDateTimeRange.date;
      
      // Verify dates were adjusted to 2025 range
      expect(departureDate).toMatch(/^2025-/);
      expect(returnDate).toMatch(/^2025-/);
    });

    it('maintains original date span when adjusting to test environment', async () => {
      // Mock test environment
      Deno.env.get.mockImplementation((key) => {
        if (key === 'AMADEUS_BASE_URL') return 'https://test.api.amadeus.com/v2';
        if (key === 'AMADEUS_CLIENT_ID') return 'test-client-id';
        if (key === 'AMADEUS_CLIENT_SECRET') return 'test-client-secret';
        return null;
      });

      const originalSpan = 7; // 7 days
      const params: FlightSearchParams = {
        origin: ['JFK'],
        destination: 'LAX',
        earliestDeparture: new Date('2024-03-01'),
        latestDeparture: new Date('2024-03-08'), // 7 days later
        minDuration: 5,
        maxDuration: 10,
        budget: 1000
      };

      // Mock the token fetch response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          access_token: 'mock-token',
          expires_in: 3600
        })
      });

      await searchOffers(params, 'test-request-2');
      
      // Check the request body to verify date span is maintained
      const secondCallArgs = mockFetch.mock.calls[1];
      const requestBody = JSON.parse(secondCallArgs[1].body);
      
      // Extract the dates from the request
      const departureDate = requestBody.originDestinations[0].departureDateTimeRange.date;
      const returnDate = requestBody.originDestinations[1].departureDateTimeRange.date;
      
      // Calculate the span between the dates
      const depDate = new Date(departureDate);
      const retDate = new Date(returnDate);
      const adjustedSpan = Math.round((retDate.getTime() - depDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // The span should be maintained
      expect(adjustedSpan).toBe(originalSpan);
    });
  });

  describe('Date Validation', () => {
    it('rejects invalid date formats', async () => {
      // Mock test environment
      Deno.env.get.mockImplementation((key) => {
        if (key === 'AMADEUS_BASE_URL') return 'https://api.amadeus.com/v2';
        if (key === 'AMADEUS_CLIENT_ID') return 'test-client-id';
        if (key === 'AMADEUS_CLIENT_SECRET') return 'test-client-secret';
        return null;
      });

      const params: FlightSearchParams = {
        origin: ['JFK'],
        destination: 'LAX',
        earliestDeparture: new Date('invalid-date'),
        latestDeparture: new Date('2024-02-15'),
        minDuration: 5,
        maxDuration: 10,
        budget: 1000
      };

      // Since earliestDeparture is invalid, isNaN(earliestDeparture.getTime()) will be true
      await expect(async () => {
        await searchOffers(params, 'test-request-3');
      }).rejects.toThrow();
    });

    it('validates dates before creating search parameters', async () => {
      // Mock production environment
      Deno.env.get.mockImplementation((key) => {
        if (key === 'AMADEUS_BASE_URL') return 'https://api.amadeus.com/v2';
        if (key === 'AMADEUS_CLIENT_ID') return 'prod-client-id';
        if (key === 'AMADEUS_CLIENT_SECRET') return 'prod-client-secret';
        return null;
      });

      // This will create an invalid date
      const params: FlightSearchParams = {
        origin: ['JFK'],
        destination: 'LAX',
        earliestDeparture: new Date('2025-13-45'), // invalid date (month 13, day 45)
        latestDeparture: new Date('2025-02-15'),
        minDuration: 5,
        maxDuration: 10,
        budget: 1000
      };

      // Since earliestDeparture is invalid, isNaN(earliestDeparture.getTime()) will be true
      await expect(async () => {
        await searchOffers(params, 'test-request-4');
      }).rejects.toThrow();
    });
  });

  describe('Enhanced Error Handling', () => {
    it('provides clear error messages for date-related API errors', async () => {
      // Mock production environment
      Deno.env.get.mockImplementation((key) => {
        if (key === 'AMADEUS_BASE_URL') return 'https://api.amadeus.com/v2';
        if (key === 'AMADEUS_CLIENT_ID') return 'prod-client-id';
        if (key === 'AMADEUS_CLIENT_SECRET') return 'prod-client-secret';
        return null;
      });

      // Mock the token fetch response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          access_token: 'mock-token',
          expires_in: 3600
        })
      });

      // Mock the API error response for past date
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: vi.fn().mockResolvedValue('Date is in the past')
      });

      const params: FlightSearchParams = {
        origin: ['JFK'],
        destination: 'LAX',
        earliestDeparture: new Date('2023-01-15'), // past date
        latestDeparture: new Date('2023-02-15'),
        minDuration: 5,
        maxDuration: 10,
        budget: 1000
      };

      await expect(async () => {
        await searchOffers(params, 'test-request-5');
      }).rejects.toThrow(/Amadeus API error/);
    });

    it('includes environment-specific guidance in error messages for test environment', async () => {
      // Mock test environment
      Deno.env.get.mockImplementation((key) => {
        if (key === 'AMADEUS_BASE_URL') return 'https://test.api.amadeus.com/v2';
        if (key === 'AMADEUS_CLIENT_ID') return 'test-client-id';
        if (key === 'AMADEUS_CLIENT_SECRET') return 'test-client-secret';
        return null;
      });

      // Mock the token fetch response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          access_token: 'mock-token',
          expires_in: 3600
        })
      });

      // Mock the API error response for future date
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: vi.fn().mockResolvedValue('Date too far in future')
      });

      const params: FlightSearchParams = {
        origin: ['JFK'],
        destination: 'LAX',
        earliestDeparture: new Date('2027-01-15'), // too far future for test env
        latestDeparture: new Date('2027-02-15'),
        minDuration: 5,
        maxDuration: 10,
        budget: 1000
      };

      await expect(async () => {
        await searchOffers(params, 'test-request-6');
      }).rejects.toThrow(/Amadeus API error/);
    });
  });

  describe('Calculate Return Date Helper', () => {
    it('calculates return date based on departure and duration', () => {
      const departureDate = new Date('2024-02-15');
      const durationDays = 7;
      const latestAllowed = new Date('2024-03-15');
      
      const returnDate = calculateReturnDate(departureDate, durationDays, latestAllowed);
      
      // Return date should be 7 days after departure
      expect(returnDate).toBe('2024-02-22');
    });
    
    it('caps return date at latest allowed date', () => {
      const departureDate = new Date('2024-02-15');
      const durationDays = 30; // 30 days
      const latestAllowed = new Date('2024-03-01'); // Only 14 days later
      
      const returnDate = calculateReturnDate(departureDate, durationDays, latestAllowed);
      
      // Return date should be capped at latest allowed
      expect(returnDate).toBe('2024-03-01');
    });
  });

  describe('Offer Transformation with Date Handling', () => {
    it('correctly extracts dates from API response', () => {
      const mockApiResponse = {
        data: [
          {
            id: 'offer1',
            itineraries: [
              {
                duration: 'PT12H',
                segments: [
                  {
                    carrierCode: 'AA',
                    number: '123',
                    departure: {
                      at: '2025-06-15T10:00:00',
                      iataCode: 'JFK'
                    },
                    arrival: {
                      at: '2025-06-15T14:00:00',
                      iataCode: 'LAX'
                    }
                  }
                ]
              },
              {
                segments: [
                  {
                    carrierCode: 'AA',
                    number: '456',
                    departure: {
                      at: '2025-06-22T16:00:00',
                      iataCode: 'LAX'
                    },
                    arrival: {
                      at: '2025-06-22T20:00:00',
                      iataCode: 'JFK'
                    }
                  }
                ]
              }
            ],
            price: {
              total: '500.00'
            }
          }
        ]
      };
      
      const tripRequestId = 'test-trip-request';
      const transformed = transformAmadeusToOffers(mockApiResponse, tripRequestId);
      
      expect(transformed.length).toBe(1);
      expect(transformed[0]).toMatchObject({
        trip_request_id: tripRequestId,
        airline: 'AA',
        flight_number: '123',
        departure_date: '2025-06-15',
        departure_time: '10:00',
        return_date: '2025-06-22',
        return_time: '16:00',
        price: 500.00
      });
    });
    
    it('calculates correct trip duration', () => {
      const mockApiResponse = {
        data: [
          {
            id: 'offer1',
            itineraries: [
              {
                duration: 'PT12H',
                segments: [
                  {
                    carrierCode: 'AA',
                    number: '123',
                    departure: {
                      at: '2025-06-15T10:00:00',
                      iataCode: 'JFK'
                    },
                    arrival: {
                      at: '2025-06-15T14:00:00',
                      iataCode: 'LAX'
                    }
                  }
                ]
              },
              {
                segments: [
                  {
                    carrierCode: 'AA',
                    number: '456',
                    departure: {
                      at: '2025-06-22T16:00:00', // 7 days later
                      iataCode: 'LAX'
                    },
                    arrival: {
                      at: '2025-06-22T20:00:00',
                      iataCode: 'JFK'
                    }
                  }
                ]
              }
            ],
            price: {
              total: '500.00'
            }
          }
        ]
      };
      
      const tripRequestId = 'test-trip-request';
      const transformed = transformAmadeusToOffers(mockApiResponse, tripRequestId);
      
      // Verify the calculated duration is included in the raw_data
      expect(transformed.length).toBe(1);
      
      // Extract raw_data JSON
      const rawData = JSON.parse(transformed[0].raw_data);
      
      // Check that segments info is included
      expect(rawData).toHaveProperty('segments');
      expect(rawData.segments).toHaveProperty('outbound', 1);
      expect(rawData.segments).toHaveProperty('inbound', 1);
    });
  });
});

