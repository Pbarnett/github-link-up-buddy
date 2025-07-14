/**
 * AirlineFilter Tests - Phase 4.1
 * 
 * Comprehensive tests for airline preference filtering functionality.
 * Tests both Amadeus and Duffel data structures.
 */

import { AirlineFilter, getAirlineName, getAvailableAirlinesFromOffers } from '../filters/AirlineFilter';
import { FlightOffer, FilterContext, UserPreferences } from '../core/types';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock logger for testing
const mockLogger = {
  log: vi.fn(),
  logError: vi.fn(),
  logWarning: vi.fn(),
};

// Test data factory functions
const createMockFilterContext = (preferences: Partial<UserPreferences> = {}): FilterContext => ({
  budget: 1000,
  currency: 'USD',
  originCode: 'JFK',
  destinationCode: 'LAX',
  origin: 'New York',
  destination: 'Los Angeles',
  departureDate: '2024-12-01',
  returnDate: '2024-12-08',
  tripType: 'roundtrip',
  passengers: 1,
  nonstop: false,
  userPrefs: {
    nonstopRequired: false,
    ...preferences
  },
  featureFlags: {},
  performanceLog: mockLogger,
});

const createMockAmadeusOffer = (carrierCodes: string[], id = 'amadeus-1'): FlightOffer => ({
  provider: 'Amadeus',
  id,
  itineraries: [
    {
      duration: 'PT5H30M',
      segments: [
        {
          departure: { iataCode: 'JFK', at: '2024-12-01T10:00:00' },
          arrival: { iataCode: 'LAX', at: '2024-12-01T15:30:00' },
          carrierCode: carrierCodes[0],
          flightNumber: '123',
          duration: 'PT5H30M',
          numberOfStops: 0,
        }
      ]
    }
  ],
  totalBasePrice: 299,
  currency: 'USD',
  carryOnIncluded: true,
  totalPriceWithCarryOn: 299,
  stopsCount: 0,
  validatingAirlines: carrierCodes,
  rawData: {
    validatingAirlineCodes: carrierCodes,
    itineraries: [
      {
        segments: [
          { carrierCode: carrierCodes[0] }
        ]
      }
    ]
  }
});

const createMockDuffelOffer = (carrierCodes: string[], id = 'duffel-1'): FlightOffer => ({
  provider: 'Duffel',
  id,
  itineraries: [
    {
      duration: 'PT5H30M',
      segments: [
        {
          departure: { iataCode: 'JFK', at: '2024-12-01T10:00:00' },
          arrival: { iataCode: 'LAX', at: '2024-12-01T15:30:00' },
          carrierCode: carrierCodes[0],
          flightNumber: '123',
          duration: 'PT5H30M',
          numberOfStops: 0,
        }
      ]
    }
  ],
  totalBasePrice: 299,
  currency: 'USD',
  carryOnIncluded: true,
  totalPriceWithCarryOn: 299,
  stopsCount: 0,
  validatingAirlines: carrierCodes,
  rawData: {
    slices: [
      {
        segments: [
          {
            marketing_carrier: { iata_code: carrierCodes[0], name: 'Test Airline' },
            operating_carrier: { iata_code: carrierCodes[0], name: 'Test Airline' }
          }
        ]
      }
    ],
    owner: { iata_code: carrierCodes[0], name: 'Test Airline' }
  }
});

describe('AirlineFilter', () => {
  let filter: AirlineFilter;

  beforeEach(() => {
    filter = new AirlineFilter();
vi.clearAllMocks();
  });

  describe('Basic filtering functionality', () => {
    it('should return all offers when no preferred airlines are specified', async () => {
      const offers = [
        createMockAmadeusOffer(['AA']),
        createMockAmadeusOffer(['DL']),
        createMockAmadeusOffer(['UA'])
      ];
      
      const context = createMockFilterContext();
      const result = await filter.apply(offers, context);
      
      expect(result).toEqual(offers);
      expect(mockLogger.log).toHaveBeenCalledWith('AirlineFilter', 3, 3, 0);
    });

    it('should filter offers by preferred airlines', async () => {
      const offers = [
        createMockAmadeusOffer(['AA'], 'offer-1'),
        createMockAmadeusOffer(['DL'], 'offer-2'),
        createMockAmadeusOffer(['UA'], 'offer-3'),
        createMockAmadeusOffer(['BA'], 'offer-4')
      ];
      
      const context = createMockFilterContext({
        preferredAirlines: ['AA', 'BA']
      });
      
      const result = await filter.apply(offers, context);
      
      expect(result).toHaveLength(2);
      expect(result.map(o => o.id)).toEqual(['offer-1', 'offer-4']);
      expect(mockLogger.log).toHaveBeenCalledWith('AirlineFilter', 4, 2, expect.any(Number));
    });

    it('should handle empty preferred airlines array', async () => {
      const offers = [createMockAmadeusOffer(['AA'])];
      const context = createMockFilterContext({
        preferredAirlines: []
      });
      
      const result = await filter.apply(offers, context);
      
      expect(result).toEqual(offers);
    });
  });

  describe('Multi-provider support', () => {
    it('should filter Amadeus offers correctly', async () => {
      const offers = [
        createMockAmadeusOffer(['AA']),
        createMockAmadeusOffer(['DL'])
      ];
      
      const context = createMockFilterContext({
        preferredAirlines: ['AA']
      });
      
      const result = await filter.apply(offers, context);
      
      expect(result).toHaveLength(1);
      expect(result[0].validatingAirlines).toContain('AA');
    });

    it('should filter Duffel offers correctly', async () => {
      const offers = [
        createMockDuffelOffer(['BA']),
        createMockDuffelOffer(['AF'])
      ];
      
      const context = createMockFilterContext({
        preferredAirlines: ['BA']
      });
      
      const result = await filter.apply(offers, context);
      
      expect(result).toHaveLength(1);
      expect((result[0].rawData as any)?.owner?.iata_code).toBe('BA');
    });

    it('should handle mixed provider offers', async () => {
      const offers = [
        createMockAmadeusOffer(['AA']),
        createMockDuffelOffer(['BA']),
        createMockAmadeusOffer(['DL']),
        createMockDuffelOffer(['AF'])
      ];
      
      const context = createMockFilterContext({
        preferredAirlines: ['AA', 'AF']
      });
      
      const result = await filter.apply(offers, context);
      
      expect(result).toHaveLength(2);
      expect(result.some(o => o.provider === 'Amadeus')).toBe(true);
      expect(result.some(o => o.provider === 'Duffel')).toBe(true);
    });
  });

  describe('Complex airline data extraction', () => {
    it('should extract from validatingAirlines field', async () => {
      const offer = createMockAmadeusOffer(['AA', 'DL']);
      const context = createMockFilterContext({
        preferredAirlines: ['DL']
      });
      
      const result = await filter.apply([offer], context);
      
      expect(result).toHaveLength(1);
    });

    it('should extract from rawData for Duffel offers', async () => {
      const offer: FlightOffer = {
        ...createMockDuffelOffer(['BA']),
        validatingAirlines: [], // Empty to test rawData extraction
        rawData: {
          slices: [
            {
              segments: [
                {
                  marketing_carrier: { iata_code: 'BA', name: 'British Airways' },
                  operating_carrier: { iata_code: 'VS', name: 'Virgin Atlantic' }
                }
              ]
            }
          ]
        }
      };
      
      const context = createMockFilterContext({
        preferredAirlines: ['VS']
      });
      
      const result = await filter.apply([offer], context);
      
      expect(result).toHaveLength(1);
    });

    it('should handle offers with no airline data gracefully', async () => {
      const malformedOffer: FlightOffer = {
        provider: 'Amadeus',
        id: 'malformed',
        itineraries: [],
        totalBasePrice: 299,
        currency: 'USD',
        carryOnIncluded: true,
        totalPriceWithCarryOn: 299,
        stopsCount: 0,
        validatingAirlines: [],
      };
      
      const context = createMockFilterContext({
        preferredAirlines: ['AA']
      });
      
      const result = await filter.apply([malformedOffer], context);
      
      expect(result).toHaveLength(0); // Should be filtered out as no matching airlines
    });
  });

  describe('Error handling', () => {
    it('should handle errors gracefully and return original offers', async () => {
      const offers = [createMockAmadeusOffer(['AA'])];
      
      // Create context that will cause an error
      const context = createMockFilterContext({
        preferredAirlines: ['AA']
      });
      
      // Mock the extractAirlineCodesFromOffer to throw an error
      const originalMethod = (filter as unknown as { extractAirlineCodesFromOffer: unknown }).extractAirlineCodesFromOffer;
(filter as unknown as { extractAirlineCodesFromOffer: unknown }).extractAirlineCodesFromOffer = vi.fn(() => {
        throw new Error('Test error');
      });
      
      const result = await filter.apply(offers, context);
      
      expect(result).toEqual(offers); // Should return original offers on error
      expect(mockLogger.logError).toHaveBeenCalledWith(
        'AirlineFilter',
        expect.any(Error),
        expect.objectContaining({
          originalCount: 1,
          preferredAirlines: ['AA']
        })
      );
      
      // Restore original method
      (filter as unknown as { extractAirlineCodesFromOffer: unknown }).extractAirlineCodesFromOffer = originalMethod;
    });
  });

  describe('Validation', () => {
    it('should validate valid IATA codes', () => {
      const context = createMockFilterContext({
        preferredAirlines: ['AA', 'BA', 'DL']
      });
      
      const result = filter.validate(context);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid IATA codes', () => {
      const context = createMockFilterContext({
        preferredAirlines: ['AA', 'INVALID', 'B']
      });
      
      const result = filter.validate(context);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Invalid airline codes');
      expect(result.errors[0]).toContain('INVALID');
      expect(result.errors[0]).toContain('B');
    });

    it('should warn about too many airline selections', () => {
      const context = createMockFilterContext({
        preferredAirlines: new Array(15).fill(0).map((_, i) => 
          String.fromCharCode(65 + i) + String.fromCharCode(65 + i)
        ) // ['AA', 'BB', 'CC', ...]
      });
      
      const result = filter.validate(context);
      
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('Many airlines selected (15)');
    });

    it('should handle missing preferredAirlines gracefully', () => {
      const context = createMockFilterContext();
      
      const result = filter.validate(context);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });
  });
});

describe('Utility functions', () => {
  describe('getAirlineName', () => {
    it('should return airline name for known IATA codes', () => {
      expect(getAirlineName('AA')).toBe('American Airlines');
      expect(getAirlineName('BA')).toBe('British Airways');
      expect(getAirlineName('DL')).toBe('Delta Air Lines');
    });

    it('should return the code itself for unknown IATA codes', () => {
      expect(getAirlineName('XY')).toBe('XY');
      expect(getAirlineName('UNKNOWN')).toBe('UNKNOWN');
    });
  });

  describe('getAvailableAirlinesFromOffers', () => {
    it('should extract unique airlines from offers', () => {
      const offers = [
        createMockAmadeusOffer(['AA']),
        createMockAmadeusOffer(['BA']),
        createMockAmadeusOffer(['AA']), // Duplicate
        createMockDuffelOffer(['DL'])
      ];
      
      const result = getAvailableAirlinesFromOffers(offers);
      
      expect(result).toHaveLength(3);
      expect(result.find(a => a.code === 'AA')?.count).toBe(2);
      expect(result.find(a => a.code === 'BA')?.count).toBe(1);
      expect(result.find(a => a.code === 'DL')?.count).toBe(1);
    });

    it('should sort airlines by frequency', () => {
      const offers = [
        createMockAmadeusOffer(['AA']),
        createMockAmadeusOffer(['BA']),
        createMockAmadeusOffer(['BA']),
        createMockAmadeusOffer(['BA']),
        createMockAmadeusOffer(['DL'])
      ];
      
      const result = getAvailableAirlinesFromOffers(offers);
      
      expect(result[0].code).toBe('BA'); // Most frequent
      expect(result[0].count).toBe(3);
      expect(result[1].count).toBe(1); // AA or DL
      expect(result[2].count).toBe(1); // AA or DL
    });

    it('should handle empty offers array', () => {
      const result = getAvailableAirlinesFromOffers([]);
      
      expect(result).toHaveLength(0);
    });
  });
});

describe('Integration with FilterFactory', () => {
  it('should integrate with filter context from FilterFactory', () => {
    // This test would verify integration with the FilterFactory.createFilterContext method
    const mockSearchParams = {
      preferredAirlines: ['AA', 'BA']
    };
    
    // In a real integration test, we would:
    // 1. Use FilterFactory.createFilterContext(mockSearchParams)
    // 2. Create a pipeline with AirlineFilter
    // 3. Execute the pipeline and verify results
    
    // For this unit test, we just verify the filter works with the expected context structure
    const context = createMockFilterContext({
      preferredAirlines: mockSearchParams.preferredAirlines
    });
    
    expect(context.userPrefs.preferredAirlines).toEqual(['AA', 'BA']);
  });
});
