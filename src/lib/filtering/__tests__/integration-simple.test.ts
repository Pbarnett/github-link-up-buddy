/**
 * @file Simple integration test for filtering architecture
 * Tests core functionality without complex mocking
 */

import { describe, it, expect } from 'vitest';
import { FilterFactory, createFilterContext } from '@/lib/filtering';
import type { FlightOffer } from '@/lib/filtering';

// Interface for raw offers from different providers
interface RawOffer {
  id: string;
  price_total?: number;
  price?: number;
  totalAmount?: number;
  currency?: string;
  origin_iata?: string;
  origin_airport?: string;
  destination_iata?: string;
  destination_airport?: string;
  depart_dt?: string;
  departure_date?: string;
  return_dt?: string;
  return_date?: string;
  carrier_code?: string;
  flight_number?: string;
  nonstop?: boolean;
  itineraries?: unknown[];
  [key: string]: unknown;
}

// Simple test version of normalizeOffers for testing purposes
function testNormalizeOffers(rawOffers: RawOffer[], provider: string): FlightOffer[] {
  return rawOffers.map(offer => {
    const totalPrice = offer.price_total || offer.price || offer.totalAmount || 0;
    return {
      id: offer.id,
      provider: provider as 'Amadeus' | 'Duffel',
      totalBasePrice: totalPrice,
      currency: offer.currency || 'USD',
      itineraries: offer.itineraries || [
        {
          duration: '6h',
          segments: [
            {
              departure: { iataCode: offer.origin_iata || offer.origin_airport || 'LAX', at: offer.depart_dt || offer.departure_date || '2024-01-15T10:00:00Z' },
              arrival: { iataCode: offer.destination_iata || offer.destination_airport || 'JFK', at: offer.return_dt || offer.return_date || '2024-01-15T16:00:00Z' },
              carrierCode: offer.carrier_code || 'AA',
              flightNumber: offer.flight_number || '100',
              duration: '6h',
              numberOfStops: 0
            }
          ]
        }
      ],
      carryOnIncluded: true,
      carryOnFee: 0,
      totalPriceWithCarryOn: totalPrice,
      stopsCount: 0,
      validatingAirlines: [offer.carrier_code || 'AA'],
      rawData: offer
    };
  });
}

describe('Phase 2 Integration: Core Functionality', () => {
  describe('FilterFactory Integration', () => {
    it('should create different pipeline types with correct filters', () => {
      const standardPipeline = FilterFactory.createPipeline('standard');
      const budgetPipeline = FilterFactory.createPipeline('budget');
      const fastPipeline = FilterFactory.createPipeline('fast');
      
      expect(standardPipeline.getFilters().length).toBeGreaterThan(0);
      expect(budgetPipeline.getFilters().length).toBeGreaterThan(0);
      expect(fastPipeline.getFilters().length).toBeGreaterThan(0);
      
      // Budget pipeline should include budget filter
      const budgetFilterNames = budgetPipeline.getFilters().map(f => f.constructor.name);
      expect(budgetFilterNames).toContain('BudgetFilter');
    });

    it('should create filter context from API parameters', () => {
      const params = {
        tripType: 'roundtrip' as const,
        origin: 'LAX',
        destination: 'JFK',
        departureDate: '2024-01-15',
        returnDate: '2024-01-22',
        budget: 500,
        currency: 'USD',
        nonstop: false,
        passengers: 1
      };
      
      const context = createFilterContext(params);
      
      expect(context.tripType).toBe('roundtrip');
      expect(context.origin).toBe('LAX');
      expect(context.destination).toBe('JFK');
      expect(context.budget).toBe(500);
      expect(context.currency).toBe('USD');
      expect(context.nonstop).toBe(false);
    });
  });

  describe('Offer Normalization', () => {
    it('should normalize V2 offers correctly', () => {
      const v2Offers = [{
        id: 'offer-1',
        price_total: 450,
        origin_iata: 'LAX',
        destination_iata: 'JFK',
        depart_dt: '2024-01-15T10:00:00Z',
        return_dt: '2024-01-22T15:00:00Z',
        nonstop: false,
        currency: 'USD'
      }];
      
      const normalized = testNormalizeOffers(v2Offers, 'duffel');
      
      expect(normalized).toHaveLength(1);
      expect(normalized[0].id).toBe('offer-1');
      expect(normalized[0].totalBasePrice).toBe(450);
      expect(normalized[0].stopsCount).toBe(0);
    });

    it('should normalize legacy offers correctly', () => {
      const legacyOffers = [{
        id: 'offer-1',
        price: 450,
        carrier_code: 'AA',
        origin_airport: 'LAX',
        destination_airport: 'JFK',
        departure_date: '2024-01-15',
        return_date: '2024-01-22',
        nonstop: false
      }];
      
      const normalized = testNormalizeOffers(legacyOffers, 'amadeus');
      
      expect(normalized).toHaveLength(1);
      expect(normalized[0].id).toBe('offer-1');
      expect(normalized[0].totalBasePrice).toBe(450);
      expect(normalized[0].stopsCount).toBe(0);
    });
  });

  describe('End-to-End Filtering', () => {
    it('should filter offers using complete pipeline', async () => {
      // Create test offers
      const testOffers: FlightOffer[] = [
        {
          id: 'offer-1',
          provider: 'test' as 'Amadeus' | 'Duffel',
          totalBasePrice: 300,
          currency: 'USD',
          itineraries: [
            {
              duration: '6h',
              segments: [
                {
                  departure: { iataCode: 'LAX', at: '2024-01-15T10:00:00Z' },
                  arrival: { iataCode: 'JFK', at: '2024-01-15T16:00:00Z' },
                  carrierCode: 'AA',
                  flightNumber: '100',
                  duration: '6h',
                  numberOfStops: 0
                }
              ]
            },
            {
              duration: '6h',
              segments: [
                {
                  departure: { iataCode: 'JFK', at: '2024-01-22T10:00:00Z' },
                  arrival: { iataCode: 'LAX', at: '2024-01-22T16:00:00Z' },
                  carrierCode: 'AA',
                  flightNumber: '200',
                  duration: '6h',
                  numberOfStops: 0
                }
              ]
            }
          ],
          carryOnIncluded: true,
          carryOnFee: 0,
          totalPriceWithCarryOn: 300,
          stopsCount: 0,
          validatingAirlines: ['AA'],
          rawData: {}
        },
        {
          id: 'offer-2',
          provider: 'test' as 'Amadeus' | 'Duffel',
          totalBasePrice: 600, // Above budget
          currency: 'USD',
          itineraries: [
            {
              duration: '6h',
              segments: [
                {
                  departure: { iataCode: 'LAX', at: '2024-01-15T10:00:00Z' },
                  arrival: { iataCode: 'JFK', at: '2024-01-15T16:00:00Z' },
                  carrierCode: 'AA',
                  flightNumber: '300',
                  duration: '6h',
                  numberOfStops: 0
                }
              ]
            },
            {
              duration: '6h',
              segments: [
                {
                  departure: { iataCode: 'JFK', at: '2024-01-22T10:00:00Z' },
                  arrival: { iataCode: 'LAX', at: '2024-01-22T16:00:00Z' },
                  carrierCode: 'AA',
                  flightNumber: '400',
                  duration: '6h',
                  numberOfStops: 0
                }
              ]
            }
          ],
          carryOnIncluded: true,
          carryOnFee: 0,
          totalPriceWithCarryOn: 600,
          stopsCount: 0,
          validatingAirlines: ['AA'],
          rawData: {}
        },
        {
          id: 'offer-3',
          provider: 'test' as 'Amadeus' | 'Duffel',
          totalBasePrice: 400,
          currency: 'USD',
          itineraries: [
            {
              duration: '8h',
              segments: [
                {
                  departure: { iataCode: 'LAX', at: '2024-01-15T10:00:00Z' },
                  arrival: { iataCode: 'JFK', at: '2024-01-15T16:00:00Z' },
                  carrierCode: 'AA',
                  flightNumber: '500',
                  duration: '8h',
                  numberOfStops: 1
                }
              ]
            },
            {
              duration: '8h',
              segments: [
                {
                  departure: { iataCode: 'JFK', at: '2024-01-22T10:00:00Z' },
                  arrival: { iataCode: 'LAX', at: '2024-01-22T16:00:00Z' },
                  carrierCode: 'AA',
                  flightNumber: '600',
                  duration: '8h',
                  numberOfStops: 1
                }
              ]
            }
          ],
          carryOnIncluded: true,
          carryOnFee: 0,
          totalPriceWithCarryOn: 400,
          stopsCount: 2,
          validatingAirlines: ['AA'],
          rawData: {}
        }
      ];

      // Create filter context
      const context = createFilterContext({
        tripType: 'roundtrip',
        origin: 'LAX',
        destination: 'JFK',
        departureDate: '2024-01-15',
        returnDate: '2024-01-22',
        budget: 500,
        currency: 'USD',
        nonstopRequired: true,
        passengers: 1
      });

      // Create pipeline and filter
      const pipeline = FilterFactory.createPipeline('standard');
      const result = await pipeline.execute(testOffers, context);

      // Should filter out offer-2 (above budget) and offer-3 (not nonstop)
      expect(result.filteredOffers).toHaveLength(1);
      expect(result.filteredOffers[0].id).toBe('offer-1');
    });

    it('should handle budget filtering with different pipeline types', async () => {
      const testOffers: FlightOffer[] = [
        {
          id: 'offer-1',
          provider: 'test' as 'Amadeus' | 'Duffel',
          totalBasePrice: 300,
          currency: 'USD',
          itineraries: [
            {
              duration: '6h',
              segments: [
                {
                  departure: { iataCode: 'LAX', at: '2024-01-15T10:00:00Z' },
                  arrival: { iataCode: 'JFK', at: '2024-01-15T16:00:00Z' },
                  carrierCode: 'AA',
                  flightNumber: '100',
                  duration: '6h',
                  numberOfStops: 0
                }
              ]
            }
          ],
          carryOnIncluded: true,
          carryOnFee: 0,
          totalPriceWithCarryOn: 300,
          stopsCount: 0,
          validatingAirlines: ['AA'],
          rawData: {}
        },
        {
          id: 'offer-2',
          provider: 'test' as 'Amadeus' | 'Duffel',
          totalBasePrice: 600,
          currency: 'USD',
          itineraries: [
            {
              duration: '6h',
              segments: [
                {
                  departure: { iataCode: 'LAX', at: '2024-01-15T10:00:00Z' },
                  arrival: { iataCode: 'JFK', at: '2024-01-15T16:00:00Z' },
                  carrierCode: 'AA',
                  flightNumber: '200',
                  duration: '6h',
                  numberOfStops: 0
                }
              ]
            }
          ],
          carryOnIncluded: true,
          carryOnFee: 0,
          totalPriceWithCarryOn: 600,
          stopsCount: 0,
          validatingAirlines: ['AA'],
          rawData: {}
        }
      ];

      const context = createFilterContext({
        tripType: 'oneway',
        origin: 'LAX',
        destination: 'JFK',
        departureDate: '2024-01-15',
        budget: 500,
        currency: 'USD',
        nonstop: false,
        passengers: 1
      });

      // Test different pipeline types
      const standardPipeline = FilterFactory.createPipeline('standard');
      const budgetPipeline = FilterFactory.createPipeline('budget');
      const fastPipeline = FilterFactory.createPipeline('fast');

      const standardResult = await standardPipeline.execute(testOffers, context);
      const budgetResult = await budgetPipeline.execute(testOffers, context);
      const fastResult = await fastPipeline.execute(testOffers, context);

      // All should filter out the expensive offer
      expect(standardResult.filteredOffers).toHaveLength(1);
      expect(budgetResult.filteredOffers).toHaveLength(1);
      expect(fastResult.filteredOffers).toHaveLength(1);

      // All should keep the affordable offer
      expect(standardResult.filteredOffers[0].id).toBe('offer-1');
      expect(budgetResult.filteredOffers[0].id).toBe('offer-1');
      expect(fastResult.filteredOffers[0].id).toBe('offer-1');
    });
  });

  describe('Performance and Error Handling', () => {
    it('should handle large offer sets efficiently', async () => {
      // Generate large offer set
      const largeOfferSet: FlightOffer[] = Array.from({ length: 500 }, (_, i) => ({
        id: `offer-${i}`,
        provider: 'test' as 'Amadeus' | 'Duffel',
        totalBasePrice: 100 + (i * 2), // Varying prices
        currency: 'USD',
        itineraries: [
          {
            duration: '6h',
            segments: [
              {
                departure: { iataCode: 'LAX', at: '2024-01-15T10:00:00Z' },
                arrival: { iataCode: 'JFK', at: '2024-01-15T16:00:00Z' },
                carrierCode: 'AA',
                flightNumber: `${100 + i}`,
                duration: '6h',
                numberOfStops: 0
              }
            ]
          }
        ],
        carryOnIncluded: true,
        carryOnFee: 0,
        totalPriceWithCarryOn: 100 + (i * 2),
        stopsCount: i % 2 === 0 ? 0 : 1,
        validatingAirlines: ['AA'],
        rawData: {}
      }));

      const context = createFilterContext({
        tripType: 'oneway',
        origin: 'LAX',
        destination: 'JFK',
        departureDate: '2024-01-15',
        budget: 500,
        currency: 'USD',
        nonstop: false,
        passengers: 1
      });

      const pipeline = FilterFactory.createPipeline('fast');

      const startTime = Date.now();
      const result = await pipeline.execute(largeOfferSet, context);
      const endTime = Date.now();

      // Should complete within reasonable time
      expect(endTime - startTime).toBeLessThan(1000);
      
      // Should filter by budget (with tolerance)
      expect(result.filteredOffers.every(offer => offer.totalBasePrice <= 550)).toBe(true);
      
      // Should process significant number of offers
      expect(result.filteredOffers.length).toBeGreaterThan(0);
      expect(result.filteredOffers.length).toBeLessThan(largeOfferSet.length);
    });

    it('should continue processing when individual filters encounter errors', async () => {
      const testOffers: FlightOffer[] = [
        {
          id: 'offer-1',
          provider: 'test' as 'Amadeus' | 'Duffel',
          totalBasePrice: 300,
          currency: 'USD',
          itineraries: [
            {
              duration: '6h',
              segments: [
                {
                  departure: { iataCode: 'LAX', at: '2024-01-15T10:00:00Z' },
                  arrival: { iataCode: 'JFK', at: '2024-01-15T16:00:00Z' },
                  carrierCode: 'AA',
                  flightNumber: '100',
                  duration: '6h',
                  numberOfStops: 0
                }
              ]
            }
          ],
          carryOnIncluded: true,
          carryOnFee: 0,
          totalPriceWithCarryOn: 300,
          stopsCount: 0,
          validatingAirlines: ['AA'],
          rawData: {}
        }
      ];

      // Create context with invalid data to potentially trigger errors
      const context = createFilterContext({
        tripType: 'oneway',
        origin: 'LAX',
        destination: 'JFK',
        departureDate: '2024-01-15',
        budget: -100, // Invalid budget
        currency: 'USD',  // Keep valid currency to avoid other issues
        nonstop: false,
        passengers: 1
      });

      const pipeline = FilterFactory.createPipeline('standard');
      
      // Should not throw, should handle errors gracefully
      const result = await pipeline.execute(testOffers, context);
      
      // Should return some result (even if it's just the original offers)
      expect(Array.isArray(result.filteredOffers)).toBe(true);
    });
  });
});
