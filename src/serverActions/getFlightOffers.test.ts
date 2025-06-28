import { vi, describe, it, expect, beforeEach, afterEach, type MockedFunction } from 'vitest';
import { getFlightOffers, clearGetFlightOffersCache } from './getFlightOffers';
import { FlightOfferV2DbRow } from '@/flightSearchV2/types';
import { supabase } from '@/integrations/supabase/client';

// Mock the supabase client
vi.mock('@/integrations/supabase/client');


const mockTripRequestId = 'test-trip-id-123';
const mockDbRows: FlightOfferV2DbRow[] = [
  {
    id: 'offer-1',
    trip_request_id: mockTripRequestId,
    mode: 'AUTO',
    price_total: 500,
    price_currency: 'USD',
    price_carry_on: 25,
    bags_included: true,
    cabin_class: 'ECONOMY',
    nonstop: true,
    origin_iata: 'JFK',
    destination_iata: 'LAX',
    depart_dt: '2024-09-01T10:00:00Z',
    return_dt: '2024-09-15T14:00:00Z',
    seat_pref: 'WINDOW',
    created_at: '2024-08-01T12:00:00Z',
    booking_url: 'https://example.com/book1',
  },
];

describe('getFlightOffers server action', () => {
  // Extract mock functions from the actual mocked supabase instance
  const mockFrom = supabase.from as MockedFunction<typeof supabase.from>;
  const mockFunctionsInvoke = supabase.functions.invoke as MockedFunction<typeof supabase.functions.invoke>;

  beforeEach(() => {
    vi.useFakeTimers();
    clearGetFlightOffersCache(); // Ensure cache is cleared
    
    // Reset all mocks to clear state from previous tests
    vi.clearAllMocks();

    // Reset the implementation for mockFrom to default behavior
    // This ensures each test starts with a clean mock state
    mockFrom.mockReset();
    mockFunctionsInvoke.mockReset();

    // Set up default query chain behavior for round trip detection
    const mockTripRequestSelect = {
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ 
          data: { return_date: '2024-12-10' }, 
          error: null 
        })
      })
    };

    // Set up main query chain for flight offers
    const mockFlightOffersQuery = {
      eq: vi.fn().mockReturnValue({
        not: vi.fn().mockResolvedValue({ data: mockDbRows, error: null })
      })
    };

    // Configure mockFrom to return different chains for different tables
    mockFrom.mockImplementation((tableName: string) => {
      if (tableName === 'trip_requests') {
        return { select: vi.fn().mockReturnValue(mockTripRequestSelect) };
      } else if (tableName === 'flight_offers_v2') {
        return { select: vi.fn().mockReturnValue(mockFlightOffersQuery) };
      } else if (tableName === 'flight_offers') {
        // Legacy table mock - should return empty by default so V2 data is used
        return { 
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: [], error: null })
          })
        };
      } else {
        return { select: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [], error: null }) }) };
      }
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });


  it('should fetch flight offers successfully from the table (cache miss)', async () => {

    const result = await getFlightOffers(mockTripRequestId);

    expect(mockFrom).toHaveBeenCalledWith('flight_offers_v2');
    expect(result).toEqual(mockDbRows);
    expect(supabase.functions.invoke).not.toHaveBeenCalled();
  });


  it('should throw an error if fetching from table fails', async () => {
    const errorMessage = 'Table fetch failed';
    
    // Clear and reset mocks for this specific test
    mockFrom.mockReset();
    
    // Set up for this specific test case
    mockFrom.mockReturnValueOnce({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ 
            data: { return_date: '2024-12-10' }, 
            error: null 
          })
        })
      })
    }).mockReturnValueOnce({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          not: vi.fn().mockResolvedValue({ data: null, error: new Error(errorMessage) })
        })
      })
    });

    await expect(getFlightOffers(mockTripRequestId)).rejects.toThrow(
      `Failed to fetch flight offers from table: ${errorMessage}`
    );
    expect(mockFrom).toHaveBeenCalledWith('flight_offers_v2');
  });



  it('should use cached data for subsequent calls within cache duration', async () => {
    // First call - should fetch from table
    const result1 = await getFlightOffers(mockTripRequestId);
    expect(result1).toEqual(mockDbRows);

    // Second call - should use cache (same result)
    const result2 = await getFlightOffers(mockTripRequestId);
    expect(result2).toEqual(mockDbRows);
    expect(supabase.functions.invoke).not.toHaveBeenCalled();
  });

  it('should fetch new data from table if cache is expired', async () => {
    const CACHE_DURATION_MS = 5 * 60 * 1000;

    // First call
    const result1 = await getFlightOffers(mockTripRequestId);
    expect(result1).toEqual(mockDbRows);

    // Advance time beyond cache duration
    vi.advanceTimersByTime(CACHE_DURATION_MS + 1000);

    // Override mock to return different data for second call
    mockFrom.mockImplementationOnce((tableName: string) => {
      if (tableName === 'trip_requests') {
        return { select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { return_date: '2024-12-10' }, error: null })
          })
        }) };
      } else if (tableName === 'flight_offers_v2') {
        return { select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            not: vi.fn().mockResolvedValue({ data: [{ ...mockDbRows[0], id: 'offer-2' }], error: null })
          })
        }) };
      }
      return { select: vi.fn() };
    });

    // Second call - should fetch again from table
    const result2 = await getFlightOffers(mockTripRequestId);
    expect(result2).toEqual([{ ...mockDbRows[0], id: 'offer-2' }]);
    expect(supabase.functions.invoke).not.toHaveBeenCalled();
  });

  describe('with refresh = true', () => {
    it('should invoke flight-search-v2, invalidate cache, then fetch from table', async () => {
      (supabase.functions.invoke as Mock).mockResolvedValueOnce({ data: { inserted: 1, message: "Refreshed" }, error: null });
      
      // Override mock for refreshed data
      mockFrom.mockImplementationOnce((tableName: string) => {
        if (tableName === 'trip_requests') {
          return { select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { return_date: '2024-12-10' }, error: null })
            })
          }) };
        } else if (tableName === 'flight_offers_v2') {
          return { select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              not: vi.fn().mockResolvedValue({ data: [{...mockDbRows[0], id: 'refreshed-offer'}], error: null })
            })
          }) };
        }
        return { select: vi.fn() };
      });

      // Call with refresh=true
      const refreshedResult = await getFlightOffers(mockTripRequestId, true);

      expect(supabase.functions.invoke).toHaveBeenCalledTimes(1);
      expect(supabase.functions.invoke).toHaveBeenCalledWith('flight-search-v2', {
        body: { tripRequestId: mockTripRequestId },
      });

      expect(mockFrom).toHaveBeenCalledWith('flight_offers_v2');
      expect(refreshedResult).toEqual([{...mockDbRows[0], id: 'refreshed-offer'}]);
    });

    it('should throw error if flight-search-v2 invocation fails during refresh', async () => {
      const refreshErrorMessage = 'Refresh function failed';
      (supabase.functions.invoke as Mock).mockResolvedValueOnce({ data: null, error: new Error(refreshErrorMessage) });

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
        (supabase.functions.invoke as Mock).mockResolvedValueOnce({ data: { inserted: 0, message: "No new offers" }, error: null });
        
        // Override mock to return data after refresh
        mockFrom.mockImplementationOnce((tableName: string) => {
          if (tableName === 'trip_requests') {
            return { select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: { return_date: '2024-12-10' }, error: null })
              })
            }) };
          } else if (tableName === 'flight_offers_v2') {
            return { select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                not: vi.fn().mockResolvedValue({ data: mockDbRows, error: null })
              })
            }) };
          }
          return { select: vi.fn() };
        });

        const result = await getFlightOffers(mockTripRequestId, true);

        expect(supabase.functions.invoke).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockDbRows);
    });
  });

  it('should use different cache entries for different tripRequestIds (table fetch)', async () => {
    const mockTripRequestId2 = 'test-trip-id-456';
    const mockDbRows2: FlightOfferV2DbRow[] = [{ ...mockDbRows[0], id: 'offer-3', trip_request_id: mockTripRequestId2 }];

    // Fetch for first ID
    const result1 = await getFlightOffers(mockTripRequestId);
    expect(result1).toEqual(mockDbRows);

    // Override mock for second ID
    mockFrom.mockImplementationOnce((tableName: string) => {
      if (tableName === 'trip_requests') {
        return { select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { return_date: '2024-12-10' }, error: null })
          })
        }) };
      } else if (tableName === 'flight_offers_v2') {
        return { select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            not: vi.fn().mockResolvedValue({ data: mockDbRows2, error: null })
          })
        }) };
      }
      return { select: vi.fn() };
    });

    // Fetch for second ID
    const result2 = await getFlightOffers(mockTripRequestId2);
    expect(result2).toEqual(mockDbRows2);

    // Call first ID again, should be cached
    const result1Cached = await getFlightOffers(mockTripRequestId);
    expect(result1Cached).toEqual(mockDbRows);
  });


  it('clearGetFlightOffersCache should clear the cache (table fetch)', async () => {
    // First call - caches data
    const result1 = await getFlightOffers(mockTripRequestId);
    expect(result1).toEqual(mockDbRows);

    // Clear the cache
    clearGetFlightOffersCache();
    
    // Override mock for second call to return different data
    mockFrom.mockImplementationOnce((tableName: string) => {
      if (tableName === 'trip_requests') {
        return { select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { return_date: '2024-12-10' }, error: null })
          })
        }) };
      } else if (tableName === 'flight_offers_v2') {
        return { select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            not: vi.fn().mockResolvedValue({ data: [{ ...mockDbRows[0], id: 'offer-new' }], error: null })
          })
        }) };
      }
      return { select: vi.fn() };
    });

    // Second call - should fetch again as cache is cleared
    const result2 = await getFlightOffers(mockTripRequestId);
    expect(result2).toEqual([{ ...mockDbRows[0], id: 'offer-new' }]);
  });

  it('should fallback to legacy flight_offers table when V2 table is empty', async () => {
    const legacyOffer = {
      id: 'legacy-offer-1',
      trip_request_id: mockTripRequestId,
      price: 150,
      baggage_included: true,
      stops: 0,
      origin_airport: 'John F. Kennedy International (JFK)',
      destination_airport: 'Los Angeles International (LAX)',
      departure_date: '2024-12-01',
      departure_time: '10:00:00',
      return_date: '2024-12-10',
      return_time: '18:00:00',
      selected_seat_type: 'aisle',
      created_at: '2024-07-29T12:00:00Z',
      booking_url: 'https://example.com/book-legacy',
    };

    // Mock V2 table to return empty data and legacy table to return data
    mockFrom.mockImplementation((tableName: string) => {
      if (tableName === 'trip_requests') {
        return { select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { return_date: '2024-12-10' }, error: null })
          })
        }) };
      } else if (tableName === 'flight_offers_v2') {
        return { select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            not: vi.fn().mockResolvedValue({ data: [], error: null }) // Empty V2 data
          })
        }) };
      } else if (tableName === 'flight_offers') {
        return { select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: [legacyOffer], error: null }) // Legacy data
        }) };
      }
      return { select: vi.fn() };
    });

    const result = await getFlightOffers(mockTripRequestId);
    
    // Should get transformed legacy data
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(expect.objectContaining({
      id: 'legacy-offer-1',
      trip_request_id: mockTripRequestId,
      mode: 'LEGACY',
      price_total: 150,
      price_carry_on: null,
      bags_included: true,
      cabin_class: null,
      nonstop: true,
      origin_iata: 'JFK',
      destination_iata: 'LAX',
      seat_pref: 'aisle',
      booking_url: 'https://example.com/book-legacy',
    }));
    
    expect(mockFrom).toHaveBeenCalledWith('flight_offers_v2');
    expect(mockFrom).toHaveBeenCalledWith('flight_offers');
  });
});
