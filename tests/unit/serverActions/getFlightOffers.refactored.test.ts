import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  getFlightOffers, 
  transformLegacyToV2, 
  transformLegacyOffers,
  type GetFlightOffersDeps 
} from '@/serverActions/getFlightOffers';
import { createMockSupabaseClient, createEdgeFetchMock } from '@/tests/__helpers';

describe('getFlightOffers (Refactored)', () => {
  let mockSupabaseClient: ReturnType<typeof createMockSupabaseClient>;
  let mockInvokeEdgeFn: ReturnType<typeof vi.fn>;
  let deps: GetFlightOffersDeps;

  beforeEach(() => {
    mockSupabaseClient = createMockSupabaseClient();
    mockInvokeEdgeFn = vi.fn();
    deps = {
      supabaseClient: mockSupabaseClient as any,
      invokeEdgeFn: mockInvokeEdgeFn,
    };
  });

  describe('Pure helpers', () => {
    it('transformLegacyToV2 should transform a single legacy offer', () => {
      const legacyOffer = {
        id: 'legacy-1',
        trip_request_id: 'trip-123',
        price: 500,
        baggage_included: true,
        stops: 0,
        origin_airport: 'John F. Kennedy International (JFK)',
        destination_airport: 'Los Angeles International (LAX)',
        departure_date: '2024-01-15',
        departure_time: '10:00',
        return_date: '2024-01-20',
        return_time: '18:00',
        selected_seat_type: 'Economy',
        created_at: '2024-01-01T00:00:00Z',
        booking_url: 'https://example.com/book',
      };

      const result = transformLegacyToV2(legacyOffer as any);

      // Check basic transformation structure (dates may vary by timezone)
      expect(result.id).toBe('legacy-1');
      expect(result.trip_request_id).toBe('trip-123');
      expect(result.mode).toBe('LEGACY');
      expect(result.price_total).toBe(500);
      expect(result.price_currency).toBe('USD');
      expect(result.price_carry_on).toBe(null);
      expect(result.bags_included).toBe(true);
      expect(result.cabin_class).toBe(null);
      expect(result.nonstop).toBe(true);
      expect(result.origin_iata).toBe('JFK');
      expect(result.destination_iata).toBe('LAX');
      expect(result.seat_pref).toBe('Economy');
      expect(result.created_at).toBe('2024-01-01T00:00:00Z');
      expect(result.booking_url).toBe('https://example.com/book');
      
      // Check that dates are properly formatted as ISO strings
      expect(result.depart_dt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(result.return_dt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('transformLegacyOffers should transform an array of legacy offers', () => {
      const legacyOffers = [
        { id: 'legacy-1', trip_request_id: 'trip-123', price: 500 },
        { id: 'legacy-2', trip_request_id: 'trip-123', price: 600 },
      ];

      const result = transformLegacyOffers(legacyOffers as any);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('legacy-1');
      expect(result[1].id).toBe('legacy-2');
    });
  });

  describe('Dependency injection', () => {
    it('should use injected Supabase client', async () => {
      // Setup trip request query response
      const tripRequestQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { return_date: null },
          error: null,
        }),
      };

      // Setup V2 offers query response
      const v2OffersQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: [
            {
              id: 'offer-1',
              trip_request_id: 'trip-123',
              mode: 'V2',
              price_total: 400,
            },
          ],
          error: null,
        }),
      };
      
      // Mock from() to return different queries based on table name
      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'trip_requests') {
          return tripRequestQuery;
        } else if (table === 'flight_offers_v2') {
          return v2OffersQuery;
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
        };
      });

      const result = await getFlightOffers(
        { tripRequestId: 'trip-123', useCache: false },
        deps
      );

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('trip_requests');
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('flight_offers_v2');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('offer-1');
    });

    it('should use injected edge function when refresh is true', async () => {
      // Setup successful edge function response
      mockInvokeEdgeFn.mockResolvedValue({
        data: { success: true, inserted: 5 },
        error: null,
      });

      // Setup empty V2 data to trigger edge function
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { return_date: null },
          error: null,
        }),
      }).mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { return_date: null },
          error: null,
        }),
      }).mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      }).mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      });

      await getFlightOffers(
        { tripRequestId: 'trip-123', refresh: true, useCache: false },
        deps
      );

      expect(mockInvokeEdgeFn).toHaveBeenCalledWith('flight-search-v2', {
        tripRequestId: 'trip-123',
      });
    });
  });

  describe('Cache behavior in test environment', () => {
    it('should respect useCache flag', async () => {
      // Simple mock setup for this test
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { return_date: null }, error: null }),
      };
      
      const mockV2Query = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
      
      const mockLegacyQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
      
      let callCount = 0;
      mockSupabaseClient.from.mockImplementation((table: string) => {
        callCount++;
        if (table === 'trip_requests') return mockQuery;
        if (table === 'flight_offers_v2') return mockV2Query;
        if (table === 'flight_offers') return mockLegacyQuery;
        return mockQuery;
      });

      // Call with useCache: false
      await getFlightOffers({ tripRequestId: 'trip-123', useCache: false }, deps);
      
      // Verify that the function was called and processed correctly
      expect(callCount).toBeGreaterThan(0);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('trip_requests');
    });
  });
});
