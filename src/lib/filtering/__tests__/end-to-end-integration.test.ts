/**
 * End-to-End Integration Test for Complete Filtering System
 *
 * This test validates the entire filtering architecture from edge function
 * through to frontend display, ensuring all components work together correctly.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { FilterFactory } from '../FilterFactory';
import { normalizeOffers } from '../index';
import { AmadeusAdapter, DuffelAdapter } from '../adapters/ProviderAdapters';
import type { FilterContext } from '../core/types';

describe('End-to-End Filtering Integration', () => {
  let mockAmadeusOffer: Record<string, unknown>;
  let mockDuffelOffer: Record<string, unknown>;
  let roundTripContext: FilterContext;
  let budgetContext: FilterContext;

  beforeEach(() => {
    // Mock Amadeus offer (same structure as used in edge function)
    mockAmadeusOffer = {
      id: 'AMADEUS_001',
      source: 'GDS',
      oneWay: false,
      itineraries: [
        {
          duration: 'PT6H30M',
          segments: [
            {
              departure: { iataCode: 'JFK', at: '2024-12-15T08:00:00' },
              arrival: { iataCode: 'LAX', at: '2024-12-15T11:30:00' },
              carrierCode: 'AA',
              flightNumber: '123',
              duration: 'PT6H30M',
              numberOfStops: 0,
            },
          ],
        },
        {
          duration: 'PT6H45M',
          segments: [
            {
              departure: { iataCode: 'LAX', at: '2024-12-18T16:00:00' },
              arrival: { iataCode: 'JFK', at: '2024-12-18T19:45:00' },
              carrierCode: 'AA',
              flightNumber: '124',
              duration: 'PT6H45M',
              numberOfStops: 0,
            },
          ],
        },
      ],
      price: {
        currency: 'USD',
        total: '625.00',
        base: '550.00',
      },
      validatingAirlineCodes: ['AA'],
      travelerPricings: [
        {
          fareDetailsBySegment: [
            { cabin: 'ECONOMY', includedCheckedBags: { quantity: 1 } },
            { cabin: 'ECONOMY', includedCheckedBags: { quantity: 1 } },
          ],
        },
      ],
    };

    // Mock Duffel offer
    mockDuffelOffer = {
      id: 'DUFFEL_001',
      slices: [
        {
          segments: [
            {
              origin: { iata_code: 'JFK' },
              destination: { iata_code: 'LAX' },
              departing_at: '2024-12-15T08:00:00',
              arriving_at: '2024-12-15T11:30:00',
              marketing_carrier: { iata_code: 'AA' },
              stops: [],
            },
          ],
        },
        {
          segments: [
            {
              origin: { iata_code: 'LAX' },
              destination: { iata_code: 'JFK' },
              departing_at: '2024-12-18T16:00:00',
              arriving_at: '2024-12-18T19:45:00',
              marketing_carrier: { iata_code: 'AA' },
              stops: [],
            },
          ],
        },
      ],
      total_amount: '625.00',
      total_currency: 'USD',
      services: {
        bags: [{ quantity: 1 }],
      },
    };

    // Test contexts
    roundTripContext = FilterFactory.createFilterContext({
      budget: 1000,
      currency: 'USD',
      originLocationCode: 'JFK',
      destinationLocationCode: 'LAX',
      departureDate: '2024-12-15',
      returnDate: '2024-12-18',
      nonstopRequired: false,
      passengers: 1,
    });

    budgetContext = FilterFactory.createFilterContext({
      budget: 300,
      currency: 'USD',
      originLocationCode: 'JFK',
      destinationLocationCode: 'LAX',
      departureDate: '2024-12-15',
      returnDate: '2024-12-18',
      nonstopRequired: false,
      passengers: 1,
    });
  });

  describe('Provider Adapter Integration', () => {
    it('should normalize Amadeus offers correctly', () => {
      const adapter = new AmadeusAdapter();
      const normalized = adapter.normalize(mockAmadeusOffer, roundTripContext);

      expect(normalized).toEqual({
        provider: 'Amadeus',
        id: 'AMADEUS_001',
        itineraries: expect.arrayContaining([
          expect.objectContaining({
            duration: 'PT6H30M',
            segments: expect.arrayContaining([
              expect.objectContaining({
                departure: { iataCode: 'JFK', at: '2024-12-15T08:00:00' },
                arrival: { iataCode: 'LAX', at: '2024-12-15T11:30:00' },
                carrierCode: 'AA',
                numberOfStops: 0,
              }),
            ]),
          }),
        ]),
        totalBasePrice: 625,
        currency: 'USD',
        carryOnIncluded: true,
        carryOnFee: undefined,
        totalPriceWithCarryOn: 625,
        stopsCount: 0,
        validatingAirlines: ['AA'],
        rawData: mockAmadeusOffer,
      });
    });

    it('should normalize Duffel offers correctly', () => {
      const adapter = new DuffelAdapter();
      const normalized = adapter.normalize(mockDuffelOffer, roundTripContext);

      expect(normalized).toEqual({
        provider: 'Duffel',
        id: 'DUFFEL_001',
        itineraries: expect.arrayContaining([
          expect.objectContaining({
            segments: expect.arrayContaining([
              expect.objectContaining({
                departure: { iataCode: 'JFK', at: '2024-12-15T08:00:00' },
                arrival: { iataCode: 'LAX', at: '2024-12-15T11:30:00' },
                carrierCode: 'AA',
                numberOfStops: 0,
              }),
            ]),
          }),
        ]),
        totalBasePrice: 625,
        currency: 'USD',
        carryOnIncluded: true,
        carryOnFee: undefined,
        totalPriceWithCarryOn: 625,
        stopsCount: 0,
        validatingAirlines: [],
        bookingUrl: undefined,
        rawData: mockDuffelOffer,
      });
    });
  });

  describe('Complete Filtering Pipeline', () => {
    it('should execute standard pipeline successfully for round-trip offers', async () => {
      const rawOffers = [
        { data: mockAmadeusOffer, provider: 'Amadeus' as const },
        { data: mockDuffelOffer, provider: 'Duffel' as const },
      ];

      const normalizedOffers = normalizeOffers(rawOffers, roundTripContext);
      const pipeline = FilterFactory.createPipeline('standard');

      const result = await pipeline.execute(normalizedOffers, roundTripContext);

      expect(result.originalCount).toBe(2);
      expect(result.finalCount).toBe(2); // Both should pass all filters
      expect(result.executionTimeMs).toBeGreaterThan(0);
      expect(result.filterResults).toHaveLength(5); // RoundTrip, Budget, CarryOn, Nonstop, Airline
      expect(result.filteredOffers).toHaveLength(2);
    });

    it('should filter out offers exceeding budget', async () => {
      const rawOffers = [
        { data: mockAmadeusOffer, provider: 'Amadeus' as const },
      ];

      const normalizedOffers = normalizeOffers(rawOffers, budgetContext);
      const pipeline = FilterFactory.createPipeline('budget');

      const result = await pipeline.execute(normalizedOffers, budgetContext);

      expect(result.originalCount).toBe(1);
      expect(result.finalCount).toBe(0); // Should be filtered out due to budget ($625 > $300)
      expect(
        result.filterResults.find(f => f.filterName === 'BudgetFilter')
          ?.removedOffers
      ).toBe(1);
    });

    it('should handle one-way filtering correctly', async () => {
      // Create one-way version of Amadeus offer with higher price to pass budget filter
      const oneWayOffer = {
        ...mockAmadeusOffer,
        oneWay: true,
        itineraries: [(mockAmadeusOffer.itineraries as any)[0]], // Only outbound
        price: {
          total: '450.00', // Lower price to pass budget filter
          currency: 'USD',
        },
      };

      // Create proper one-way context without return date and higher budget
      const oneWayFilterContext = FilterFactory.createFilterContext({
        budget: 600, // Higher budget to ensure offer passes
        currency: 'USD',
        originLocationCode: 'JFK',
        destinationLocationCode: 'LAX',
        departureDate: '2024-12-15',
        // No return date for one-way
        nonstopRequired: false,
        passengers: 1,
      });

      const rawOffers = [{ data: oneWayOffer, provider: 'Amadeus' as const }];

      const normalizedOffers = normalizeOffers(rawOffers, oneWayFilterContext);
      expect(normalizedOffers).toHaveLength(1); // Ensure normalization worked

      const pipeline = FilterFactory.createPipeline('standard');
      const result = await pipeline.execute(
        normalizedOffers,
        oneWayFilterContext
      );

      expect(result.originalCount).toBe(1);
      expect(result.finalCount).toBe(1); // Should pass for one-way search
      expect(result.filteredOffers[0].itineraries).toHaveLength(1);
    });

    it('should recommend correct pipeline types', () => {
      // Budget scenario
      expect(
        FilterFactory.recommendPipelineType({
          budget: 400,
          nonstopRequired: false,
        })
      ).toBe('budget');

      // Fast scenario
      expect(
        FilterFactory.recommendPipelineType({
          budget: 1000,
          nonstopRequired: false,
        })
      ).toBe('fast');

      // Standard scenario
      expect(
        FilterFactory.recommendPipelineType({
          budget: 1000,
          nonstopRequired: true,
          preferredAirlines: ['AA'],
        })
      ).toBe('standard');
    });
  });

  describe('Edge Function Integration Simulation', () => {
    it('should simulate complete edge function flow', async () => {
      // Simulate the edge function process
      const requestData = {
        tripRequestId: 'test-trip-123',
        maxPrice: 1000,
      };

      const tripRequest = {
        origin_location_code: 'JFK',
        destination_location_code: 'LAX',
        departure_date: '2024-12-15',
        return_date: '2024-12-18',
        nonstop_required: false,
        adults: 1,
      };

      // Step 1: Create filter context (as done in edge function)
      const filterContext = FilterFactory.createFilterContext({
        budget: requestData.maxPrice,
        currency: 'USD',
        originLocationCode: tripRequest.origin_location_code,
        destinationLocationCode: tripRequest.destination_location_code,
        departureDate: tripRequest.departure_date,
        returnDate: tripRequest.return_date,
        nonstopRequired: tripRequest.nonstop_required,
      });

      // Step 2: Normalize offers (as done in edge function)
      const rawOffers = [
        { data: mockAmadeusOffer, provider: 'Amadeus' as const },
      ];
      const normalizedOffers = normalizeOffers(rawOffers, filterContext);

      // Step 3: Apply filtering pipeline (as done in edge function)
      const pipelineType = FilterFactory.recommendPipelineType({
        budget: requestData.maxPrice,
        nonstopRequired: tripRequest.nonstop_required,
        returnDate: tripRequest.return_date,
      });

      const pipeline = FilterFactory.createPipeline(pipelineType);
      const filterResult = await pipeline.execute(
        normalizedOffers,
        filterContext
      );

      // Step 4: Verify results match expected edge function behavior
      expect(filterResult.originalCount).toBe(1);
      expect(filterResult.finalCount).toBe(1);
      expect(filterResult.filteredOffers[0].provider).toBe('Amadeus');
      expect(filterResult.filteredOffers[0].totalBasePrice).toBe(625);

      // Step 5: Verify offers can be converted back for database insertion
      const dbOffer = filterResult.filteredOffers[0];
      expect(dbOffer.rawData).toBeDefined();
      expect(dbOffer.rawData?.id).toBe('AMADEUS_001');
    });
  });

  describe('Performance and Error Handling', () => {
    it('should handle empty offers gracefully', async () => {
      const pipeline = FilterFactory.createPipeline('standard');
      const result = await pipeline.execute([], roundTripContext);

      expect(result.originalCount).toBe(0);
      expect(result.finalCount).toBe(0);
      expect(result.filteredOffers).toEqual([]);
      expect(result.filterResults).toEqual([]);
    });

    it('should handle malformed offers gracefully', async () => {
      const malformedOffer = { id: 'MALFORMED', invalid: true };
      const rawOffers = [
        { data: malformedOffer, provider: 'Amadeus' as const },
      ];

      // normalizeOffers should handle malformed data gracefully
      const normalizedOffers = normalizeOffers(rawOffers, roundTripContext);
      const pipeline = FilterFactory.createPipeline('standard');

      const result = await pipeline.execute(normalizedOffers, roundTripContext);

      // Should complete without throwing
      expect(result).toBeDefined();
      expect(result.originalCount).toBeGreaterThanOrEqual(0);
    });

    it('should complete filtering within reasonable time', async () => {
      // Create many offers to test performance
      const manyOffers = Array.from({ length: 100 }, (_, i) => ({
        data: { ...mockAmadeusOffer, id: `AMADEUS_${i}` },
        provider: 'Amadeus' as const,
      }));

      const normalizedOffers = normalizeOffers(manyOffers, roundTripContext);
      const pipeline = FilterFactory.createPipeline('standard');

      const startTime = Date.now();
      const result = await pipeline.execute(normalizedOffers, roundTripContext);
      const executionTime = Date.now() - startTime;

      expect(executionTime).toBeLessThan(1000); // Should complete within 1 second
      expect(result.originalCount).toBe(100);
      expect(result.executionTimeMs).toBeLessThan(1000);
    });
  });

  describe('Filter State Integration', () => {
    it('should maintain filter execution order', async () => {
      const rawOffers = [
        { data: mockAmadeusOffer, provider: 'Amadeus' as const },
      ];
      const normalizedOffers = normalizeOffers(rawOffers, roundTripContext);
      const pipeline = FilterFactory.createPipeline('standard');

      const result = await pipeline.execute(normalizedOffers, roundTripContext);

      const filterNames = result.filterResults.map(f => f.filterName);

      // Verify filters execute in correct priority order
      expect(filterNames).toEqual([
        'RoundTripFilter', // Priority 5
        'BudgetFilter', // Priority 10
        'CarryOnFilter', // Priority 12
        'NonstopFilter', // Priority 15
        'AirlineFilter', // Priority 20
      ]);
    });

    it('should track filter performance metrics correctly', async () => {
      const rawOffers = [
        { data: mockAmadeusOffer, provider: 'Amadeus' as const },
      ];
      const normalizedOffers = normalizeOffers(rawOffers, roundTripContext);
      const pipeline = FilterFactory.createPipeline('standard');

      const result = await pipeline.execute(normalizedOffers, roundTripContext);

      result.filterResults.forEach(filterResult => {
        expect(filterResult.beforeCount).toBeGreaterThanOrEqual(0);
        expect(filterResult.afterCount).toBeGreaterThanOrEqual(0);
        expect(filterResult.executionTimeMs).toBeGreaterThanOrEqual(0);
        expect(filterResult.removedOffers).toBe(
          filterResult.beforeCount - filterResult.afterCount
        );
      });
    });
  });
});

describe('Integration with Service Layer', () => {
  it('should work seamlessly with tripOffersService integration', () => {
    // This test validates that the filtering system integrates properly
    // with the existing service layer architecture

    const filterContext = FilterFactory.createFilterContext({
      budget: 1000,
      currency: 'USD',
      originLocationCode: 'JFK',
      destinationLocationCode: 'LAX',
      departureDate: '2024-12-15',
      returnDate: '2024-12-18',
    });

    // Verify filter context has all required properties for service integration
    expect(filterContext.tripType).toBe('roundtrip');
    expect(filterContext.budget).toBe(1000);
    expect(filterContext.currency).toBe('USD');
    expect(filterContext.originCode).toBe('JFK');
    expect(filterContext.destinationCode).toBe('LAX');
    expect(filterContext.passengers).toBe(1);
    expect(filterContext.userPrefs).toBeDefined();
  });
});
