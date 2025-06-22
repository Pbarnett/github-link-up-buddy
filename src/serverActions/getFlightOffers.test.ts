import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getFlightOffers, clearGetFlightOffersCache } from './getFlightOffers';
import { supabase } from '@/integrations/supabase/client';
import { FlightOfferV2DbRow } from '@/flightSearchV2/types';

// Mock the supabase client with chainable fluent API
vi.mock('@/integrations/supabase/client', () => {
  const mockEq = vi.fn();
  const mockSelect = vi.fn(() => ({ eq: mockEq }));
  const mockFrom = vi.fn(() => ({ select: mockSelect }));
  const mockFunctionsInvoke = vi.fn();
  
  return {
    supabase: {
      from: mockFrom,
      functions: {
        invoke: mockFunctionsInvoke,
      },
    },
  };
});

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
    
    // Reset mocks and set up fresh mock chain for each test
    vi.resetAllMocks();
    mockEq = vi.fn();
    mockSelect = vi.fn(() => ({ eq: mockEq }));
    mockFrom.mockReturnValue({ select: mockSelect });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should fetch flight offers successfully from the database table', async () => {
    mockEq.mockResolvedValueOnce({ data: mockDbRows, error: null });

    const result = await getFlightOffers(mockTripRequestId);

    expect(mockFrom).toHaveBeenCalledWith('flight_offers_v2');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockEq).toHaveBeenCalledWith('trip_request_id', mockTripRequestId);
    expect(result).toEqual(mockDbRows);
  });

  it('should throw an error if the database query fails', async () => {
    const errorMessage = 'Database query failed';
    mockEq.mockResolvedValueOnce({ data: null, error: new Error(errorMessage) });

    await expect(getFlightOffers(mockTripRequestId)).rejects.toThrow(
      `Failed to fetch flight offers v2: ${errorMessage}`
    );
    expect(mockEq).toHaveBeenCalledTimes(1);
  });

  it('should trigger refresh when refresh=true', async () => {
    // Mock flight-search-v2 edge function call
    mockFunctionsInvoke.mockResolvedValueOnce({ data: { inserted: 2, message: 'Success' }, error: null });
    // Mock database read after refresh
    mockEq.mockResolvedValueOnce({ data: mockDbRows, error: null });

    const result = await getFlightOffers(mockTripRequestId, true);

    // Should call flight-search-v2 to trigger new search
    expect(mockFunctionsInvoke).toHaveBeenCalledWith('flight-search-v2', {
      body: { tripRequestId: mockTripRequestId },
    });
    // Should then read from database
    expect(mockFrom).toHaveBeenCalledWith('flight_offers_v2');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockEq).toHaveBeenCalledWith('trip_request_id', mockTripRequestId);
    expect(result).toEqual(mockDbRows);
  });

  it('should throw error if refresh search fails', async () => {
    const searchError = new Error('Search service unavailable');
    mockFunctionsInvoke.mockResolvedValueOnce({ data: null, error: searchError });

    await expect(getFlightOffers(mockTripRequestId, true)).rejects.toThrow(
      `Failed to trigger flight search v2: ${searchError.message}`
    );
    expect(mockFunctionsInvoke).toHaveBeenCalledWith('flight-search-v2', {
      body: { tripRequestId: mockTripRequestId },
    });
    // Should not attempt database read if refresh fails
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('should invalidate cache when refresh=true', async () => {
    // First, populate cache with regular call
    mockEq.mockResolvedValueOnce({ data: mockDbRows, error: null });
    await getFlightOffers(mockTripRequestId);
    expect(mockEq).toHaveBeenCalledTimes(1);

    // Clear just the mock call counts without breaking the chain
    mockEq.mockClear();
    mockSelect.mockClear();
    mockFrom.mockClear();
    mockFunctionsInvoke.mockClear();
    
    // Re-setup the chain after clearing
    mockFrom.mockReturnValue({ select: mockSelect });
    
    // Now call with refresh=true, should ignore cache and fetch fresh data
    mockFunctionsInvoke.mockResolvedValueOnce({ data: { inserted: 1 }, error: null });
    const newData = [{ ...mockDbRows[0], id: 'offer-refreshed' }];
    mockEq.mockResolvedValueOnce({ data: newData, error: null });
    
    const result = await getFlightOffers(mockTripRequestId, true);
    
    // Should have called search function and database read
    expect(mockFunctionsInvoke).toHaveBeenCalledTimes(1);
    expect(mockEq).toHaveBeenCalledTimes(1);
    expect(result).toEqual(newData);
  });

  it('should use cached data for subsequent calls within cache duration', async () => {
    mockEq.mockResolvedValueOnce({ data: mockDbRows, error: null });

    // First call - should fetch from database
    await getFlightOffers(mockTripRequestId);
    expect(mockEq).toHaveBeenCalledTimes(1);

    // Second call - should use cache
    const result = await getFlightOffers(mockTripRequestId);
    expect(mockEq).toHaveBeenCalledTimes(1); // Not called again
    expect(result).toEqual(mockDbRows);
  });

  it('should fetch new data if cache is expired', async () => {
    const CACHE_DURATION_MS = 5 * 60 * 1000;
    mockEq
      .mockResolvedValueOnce({ data: mockDbRows, error: null }) // First call
      .mockResolvedValueOnce({ data: [{ ...mockDbRows[0], id: 'offer-2' }], error: null }); // Second call after cache expiry

    // First call
    await getFlightOffers(mockTripRequestId);
    expect(mockEq).toHaveBeenCalledTimes(1);

    // Advance time beyond cache duration
    vi.advanceTimersByTime(CACHE_DURATION_MS + 1000);

    // Second call - should fetch again
    const result = await getFlightOffers(mockTripRequestId);
    expect(mockEq).toHaveBeenCalledTimes(2);
    expect(result).toEqual([{ ...mockDbRows[0], id: 'offer-2' }]);
  });

  it('should use different cache entries for different tripRequestIds', async () => {
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

  it('clearGetFlightOffersCache should clear the cache', async () => {
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
