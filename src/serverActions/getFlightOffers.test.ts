import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getFlightOffers, clearGetFlightOffersCache } from './getFlightOffers';
import { supabase } from '@/integrations/supabase/client';
import { FlightOfferV2DbRow } from '@/flightSearchV2/types';


// Mock the supabase client
const mockEq = vi.fn();
const mockSelect = vi.fn(() => ({ eq: mockEq }));
const mockFrom = vi.fn(() => ({ select: mockSelect }));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
    from: mockFrom,
  },
}));


const mockTripRequestId = 'test-trip-id-123';
const mockDbRows: FlightOfferV2DbRow[] = [
  {
    id: 'offer-1',
    trip_request_id: mockTripRequestId,
    mode: 'AUTO',
    price_total: 100,
    price_carry_on: 20,
    bags_included: true,
    cabin_class: 'ECONOMY',
    nonstop: true,
    origin_iata: 'JFK',
    destination_iata: 'LAX',
    depart_dt: '2024-12-01T10:00:00Z',
    return_dt: '2024-12-10T18:00:00Z',
    seat_pref: 'AISLE',
    created_at: '2024-07-29T12:00:00Z',
  },
];

describe('getFlightOffers server action', () => {
  // Get references to the mocked functions
  const mockFrom = supabase.from as vi.MockedFunction<typeof supabase.from>;
  const mockFunctionsInvoke = supabase.functions.invoke as vi.MockedFunction<typeof supabase.functions.invoke>;
  let mockSelect: vi.MockedFunction<any>;
  let mockEq: vi.MockedFunction<any>;

  beforeEach(() => {
    vi.useFakeTimers();
    clearGetFlightOffersCache(); // Ensure cache is cleared

    // Reset supabase.functions.invoke mock
    (supabase.functions.invoke as vi.Mock).mockClear();
    // Reset supabase client query mocks
    mockFrom.mockClear();
    mockSelect.mockClear();
    mockEq.mockClear();

  });

  afterEach(() => {
    vi.useRealTimers();
  });


  it('should fetch flight offers successfully from the table (cache miss)', async () => {

    mockEq.mockResolvedValueOnce({ data: mockDbRows, error: null });

    const result = await getFlightOffers(mockTripRequestId);

    expect(mockFrom).toHaveBeenCalledWith('flight_offers_v2');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockEq).toHaveBeenCalledWith('trip_request_id', mockTripRequestId);
    expect(result).toEqual(mockDbRows);
    expect(supabase.functions.invoke).not.toHaveBeenCalled();
  });


  it('should throw an error if fetching from table fails', async () => {
    const errorMessage = 'Table fetch failed';
    mockEq.mockResolvedValueOnce({ data: null, error: new Error(errorMessage) });

    await expect(getFlightOffers(mockTripRequestId)).rejects.toThrow(
      `Failed to fetch flight offers from table: ${errorMessage}`
    );
    expect(mockFrom).toHaveBeenCalledWith('flight_offers_v2');
  });



  it('should use cached data for subsequent calls within cache duration', async () => {
    mockEq.mockResolvedValueOnce({ data: mockDbRows, error: null });


    // First call - should fetch from table

    await getFlightOffers(mockTripRequestId);
    expect(mockEq).toHaveBeenCalledTimes(1);

    // Second call - should use cache
    const result = await getFlightOffers(mockTripRequestId);
    expect(mockEq).toHaveBeenCalledTimes(1); // Not called again
    expect(result).toEqual(mockDbRows);
    expect(supabase.functions.invoke).not.toHaveBeenCalled();
  });

  it('should fetch new data from table if cache is expired', async () => {
    const CACHE_DURATION_MS = 5 * 60 * 1000;
    mockEq
      .mockResolvedValueOnce({ data: mockDbRows, error: null }) // First call
      .mockResolvedValueOnce({ data: [{ ...mockDbRows[0], id: 'offer-2' }], error: null }); // Second call

    // First call
    await getFlightOffers(mockTripRequestId);
    expect(mockEq).toHaveBeenCalledTimes(1);

    // Advance time beyond cache duration
    vi.advanceTimersByTime(CACHE_DURATION_MS + 1000);

    // Second call - should fetch again from table
    const result = await getFlightOffers(mockTripRequestId);
    expect(mockEq).toHaveBeenCalledTimes(2);
    expect(result).toEqual([{ ...mockDbRows[0], id: 'offer-2' }]);
    expect(supabase.functions.invoke).not.toHaveBeenCalled();
  });

  describe('with refresh = true', () => {
    it('should invoke flight-search-v2, invalidate cache, then fetch from table', async () => {
      (supabase.functions.invoke as vi.Mock).mockResolvedValueOnce({ data: { inserted: 1, message: "Refreshed" }, error: null });
      // Mock for the first table read (to populate cache initially)
      mockEq.mockResolvedValueOnce({ data: mockDbRows, error: null });
      // Mock for the table read AFTER refresh
      mockEq.mockResolvedValueOnce({ data: [{...mockDbRows[0], id: 'refreshed-offer'}], error: null });


      // First, populate cache without refresh
      await getFlightOffers(mockTripRequestId);
      expect(mockEq).toHaveBeenCalledTimes(1);
      mockEq.mockClear(); // Clear call count for eq for the next assertion
      mockFrom.mockClear();
      mockSelect.mockClear();


      // Call with refresh=true
      const refreshedResult = await getFlightOffers(mockTripRequestId, true);

      expect(supabase.functions.invoke).toHaveBeenCalledTimes(1);
      expect(supabase.functions.invoke).toHaveBeenCalledWith('flight-search-v2', {
        body: { tripRequestId: mockTripRequestId },
      });

      expect(mockFrom).toHaveBeenCalledWith('flight_offers_v2');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('trip_request_id', mockTripRequestId);
      expect(mockEq).toHaveBeenCalledTimes(1); // Called once for the fetch after refresh
      expect(refreshedResult).toEqual([{...mockDbRows[0], id: 'refreshed-offer'}]);

      // Verify cache was busted and repopulated: subsequent call (without refresh) should hit the cache
      mockEq.mockClear();
      mockFrom.mockClear();
      mockSelect.mockClear();

      const resultAfterRefreshCache = await getFlightOffers(mockTripRequestId);
      expect(mockEq).not.toHaveBeenCalled(); // Should hit cache now
      expect(resultAfterRefreshCache).toEqual([{...mockDbRows[0], id: 'refreshed-offer'}]);
    });

    it('should throw error if flight-search-v2 invocation fails during refresh', async () => {
      const refreshErrorMessage = 'Refresh function failed';
      (supabase.functions.invoke as vi.Mock).mockResolvedValueOnce({ data: null, error: new Error(refreshErrorMessage) });

      await expect(getFlightOffers(mockTripRequestId, true)).rejects.toThrow(
        `Failed to refresh flight offers via flight-search-v2: ${refreshErrorMessage}`
      );
      expect(supabase.functions.invoke).toHaveBeenCalledTimes(1);
      expect(supabase.functions.invoke).toHaveBeenCalledWith('flight-search-v2', {
        body: { tripRequestId: mockTripRequestId },
      });
      expect(mockFrom).not.toHaveBeenCalled();
    });

    it('refresh=true should still fetch from table if flight-search-v2 succeeds but finds no new offers (e.g. inserted: 0)', async () => {
        (supabase.functions.invoke as vi.Mock).mockResolvedValueOnce({ data: { inserted: 0, message: "No new offers" }, error: null });
        mockEq.mockResolvedValueOnce({ data: mockDbRows, error: null });

        const result = await getFlightOffers(mockTripRequestId, true);

        expect(supabase.functions.invoke).toHaveBeenCalledTimes(1);
        expect(mockEq).toHaveBeenCalledTimes(1); // Still fetches from table
        expect(result).toEqual(mockDbRows);
    });
  });

  it('should use different cache entries for different tripRequestIds (table fetch)', async () => {
    const mockTripRequestId2 = 'test-trip-id-456';
    const mockDbRows2: FlightOfferV2DbRow[] = [{ ...mockDbRows[0], id: 'offer-3', trip_request_id: mockTripRequestId2 }];

    mockEq
      .mockResolvedValueOnce({ data: mockDbRows, error: null }) // Call for mockTripRequestId
      .mockResolvedValueOnce({ data: mockDbRows2, error: null }); // Call for mockTripRequestId2

    // Fetch for first ID
    const result1 = await getFlightOffers(mockTripRequestId);
    expect(mockEq).toHaveBeenCalledTimes(1);
    expect(mockEq).toHaveBeenLastCalledWith('trip_request_id', mockTripRequestId);
    expect(result1).toEqual(mockDbRows);

    // Fetch for second ID
    const result2 = await getFlightOffers(mockTripRequestId2);
    expect(mockEq).toHaveBeenCalledTimes(2);
    expect(mockEq).toHaveBeenLastCalledWith('trip_request_id', mockTripRequestId2);
    expect(result2).toEqual(mockDbRows2);

    // Call first ID again, should be cached
    const result1Cached = await getFlightOffers(mockTripRequestId);
    expect(mockEq).toHaveBeenCalledTimes(2); // Not called again for this ID
    expect(result1Cached).toEqual(mockDbRows);
  });


  it('clearGetFlightOffersCache should clear the cache (table fetch)', async () => {

    mockEq
      .mockResolvedValueOnce({ data: mockDbRows, error: null }) // First call
      .mockResolvedValueOnce({ data: [{ ...mockDbRows[0], id: 'offer-new' }], error: null }); // Second call

    // First call - caches data
    await getFlightOffers(mockTripRequestId);
    expect(mockEq).toHaveBeenCalledTimes(1);

    // Clear the cache
    clearGetFlightOffersCache();

    // Second call - should fetch again as cache is cleared
    const result = await getFlightOffers(mockTripRequestId);
    expect(mockEq).toHaveBeenCalledTimes(2);
    expect(result).toEqual([{ ...mockDbRows[0], id: 'offer-new' }]);
  });
});
