import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getFlightOffers, clearGetFlightOffersCache } from './getFlightOffers';
import { supabase } from '@/integrations/supabase/client';
import { FlightOfferV2DbRow } from '@/flightSearchV2/types';

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
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
  beforeEach(() => {
    vi.useFakeTimers();
    // Reset mocks and cache before each test
    vi.resetAllMocks();
    clearGetFlightOffersCache(); // Ensure cache is cleared
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should fetch flight offers successfully from the edge function', async () => {
    (supabase.functions.invoke as vi.Mock).mockResolvedValueOnce({ data: mockDbRows, error: null });

    const result = await getFlightOffers(mockTripRequestId);

    expect(supabase.functions.invoke).toHaveBeenCalledTimes(1);
    expect(supabase.functions.invoke).toHaveBeenCalledWith('flight-offers-v2', {
      body: { tripRequestId: mockTripRequestId },
    });
    expect(result).toEqual(mockDbRows);
  });

  it('should throw an error if the edge function invocation fails', async () => {
    const errorMessage = 'Edge function invocation failed';
    (supabase.functions.invoke as vi.Mock).mockResolvedValueOnce({ data: null, error: new Error(errorMessage) });

    await expect(getFlightOffers(mockTripRequestId)).rejects.toThrow(
      `Failed to fetch flight offers v2: ${errorMessage}`
    );
    expect(supabase.functions.invoke).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if the edge function returns data with an error property', async () => {
    const functionErrorMessage = 'Invalid trip ID';
    (supabase.functions.invoke as vi.Mock).mockResolvedValueOnce({ data: { error: functionErrorMessage }, error: null });

    await expect(getFlightOffers(mockTripRequestId)).rejects.toThrow(
      `Failed to fetch flight offers v2: ${functionErrorMessage}`
    );
    expect(supabase.functions.invoke).toHaveBeenCalledTimes(1);
  });

  it('should throw an error for unexpected response structure', async () => {
    (supabase.functions.invoke as vi.Mock).mockResolvedValueOnce({ data: { message: "weird response" }, error: null });

    await expect(getFlightOffers(mockTripRequestId)).rejects.toThrow(
      'Unexpected response structure from flight offers v2 function.'
    );
    expect(supabase.functions.invoke).toHaveBeenCalledTimes(1);
  });

  it('should use cached data for subsequent calls within cache duration', async () => {
    (supabase.functions.invoke as vi.Mock).mockResolvedValueOnce({ data: mockDbRows, error: null });

    // First call - should fetch
    await getFlightOffers(mockTripRequestId);
    expect(supabase.functions.invoke).toHaveBeenCalledTimes(1);

    // Second call - should use cache
    const result = await getFlightOffers(mockTripRequestId);
    expect(supabase.functions.invoke).toHaveBeenCalledTimes(1); // Not called again
    expect(result).toEqual(mockDbRows);
  });

  it('should fetch new data if cache is expired', async () => {
    const CACHE_DURATION_MS = 5 * 60 * 1000;
    (supabase.functions.invoke as vi.Mock)
      .mockResolvedValueOnce({ data: mockDbRows, error: null }) // First call
      .mockResolvedValueOnce({ data: [{ ...mockDbRows[0], id: 'offer-2' }], error: null }); // Second call after cache expiry

    // First call
    await getFlightOffers(mockTripRequestId);
    expect(supabase.functions.invoke).toHaveBeenCalledTimes(1);

    // Advance time beyond cache duration
    vi.advanceTimersByTime(CACHE_DURATION_MS + 1000);

    // Second call - should fetch again
    const result = await getFlightOffers(mockTripRequestId);
    expect(supabase.functions.invoke).toHaveBeenCalledTimes(2);
    expect(result).toEqual([{ ...mockDbRows[0], id: 'offer-2' }]);
  });

  it('should use different cache entries for different tripRequestIds', async () => {
    const mockTripRequestId2 = 'test-trip-id-456';
    const mockDbRows2: FlightOfferV2DbRow[] = [{ ...mockDbRows[0], id: 'offer-3', trip_request_id: mockTripRequestId2 }];

    (supabase.functions.invoke as vi.Mock)
      .mockResolvedValueOnce({ data: mockDbRows, error: null }) // Call for mockTripRequestId
      .mockResolvedValueOnce({ data: mockDbRows2, error: null }); // Call for mockTripRequestId2

    // Fetch for first ID
    const result1 = await getFlightOffers(mockTripRequestId);
    expect(supabase.functions.invoke).toHaveBeenCalledTimes(1);
    expect(supabase.functions.invoke).toHaveBeenLastCalledWith('flight-offers-v2', { body: { tripRequestId: mockTripRequestId }});
    expect(result1).toEqual(mockDbRows);

    // Fetch for second ID
    const result2 = await getFlightOffers(mockTripRequestId2);
    expect(supabase.functions.invoke).toHaveBeenCalledTimes(2);
    expect(supabase.functions.invoke).toHaveBeenLastCalledWith('flight-offers-v2', { body: { tripRequestId: mockTripRequestId2 }});
    expect(result2).toEqual(mockDbRows2);

    // Call first ID again, should be cached
    const result1Cached = await getFlightOffers(mockTripRequestId);
    expect(supabase.functions.invoke).toHaveBeenCalledTimes(2); // Not called again for this ID
    expect(result1Cached).toEqual(mockDbRows);
  });

  it('clearGetFlightOffersCache should clear the cache', async () => {
    (supabase.functions.invoke as vi.Mock)
      .mockResolvedValueOnce({ data: mockDbRows, error: null }) // First call
      .mockResolvedValueOnce({ data: [{ ...mockDbRows[0], id: 'offer-new' }], error: null }); // Second call

    // First call - caches data
    await getFlightOffers(mockTripRequestId);
    expect(supabase.functions.invoke).toHaveBeenCalledTimes(1);

    // Clear the cache
    clearGetFlightOffersCache();

    // Second call - should fetch again as cache is cleared
    const result = await getFlightOffers(mockTripRequestId);
    expect(supabase.functions.invoke).toHaveBeenCalledTimes(2);
    expect(result).toEqual([{ ...mockDbRows[0], id: 'offer-new' }]);
  });
});
