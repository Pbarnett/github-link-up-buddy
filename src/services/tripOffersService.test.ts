import { describe, it, expect, vi, beforeEach } from 'vitest'
import { supabase } from '@/integrations/supabase/client'
// Added isValidDuration to imports
import { fetchTripOffers, checkTripOffersExist, getTripOffersCount, debugInspectTripOffers, isValidDuration } from './tripOffersService'

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => {
  const mockFrom = vi.fn()
  return {
    supabase: {
      from: mockFrom
    }
  }
})

describe('tripOffersService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Helper to create a full mock chain
  const createMockChain = (returnValue: any) => {
    const mockSelect = vi.fn()
    const mockEq = vi.fn()
    const mockOrder = vi.fn()
    const mockRange = vi.fn()

    mockRange.mockResolvedValue(returnValue)
    mockOrder.mockReturnValue({ range: mockRange })
    mockEq.mockReturnValue({ order: mockOrder, range: mockRange })
    mockSelect.mockReturnValue({ eq: mockEq })

    return {
      select: mockSelect,
      eq: mockEq,
      order: mockOrder,
      range: mockRange
    }
  }

  // Helper to create a count-only mock chain
  const createCountMockChain = (returnValue: any) => {
    const mockSelect = vi.fn()
    const mockEq = vi.fn()

    mockEq.mockResolvedValue(returnValue)
    mockSelect.mockReturnValue({ eq: mockEq })

    return {
      select: mockSelect,
      eq: mockEq
    }
  }

  describe('input validation', () => {
    it('should sanitize trip IDs', async () => {
      const mockData = { data: [], error: null, count: 1 }
      // Assuming checkTripOffersExist is called internally by fetchTripOffers or setup for it
      const mockCountChain = createCountMockChain({ data: [], error: null, count: 1 });
      const mockFetchChain = createMockChain(mockData)

      vi.mocked(supabase.from)
        .mockReturnValueOnce(mockCountChain as any) // For checkTripOffersExist
        .mockReturnValueOnce(mockFetchChain as any); // For the actual fetch

      await fetchTripOffers('trip-123!@#$%^')
      
      expect(supabase.from).toHaveBeenCalledWith('flight_offers')
      // Check specific calls if necessary, e.g., the one for trip_request_id
      expect(mockFetchChain.eq).toHaveBeenCalledWith('trip_request_id', 'trip-123')
    })

    it('should validate pagination parameters', async () => {
      const mockData = { data: [], error: null, count: 5 }
      const mockCountChain = createCountMockChain({ data: [], error: null, count: 5 });
      const mockFetchChain = createMockChain(mockData)

      vi.mocked(supabase.from)
      .mockReturnValueOnce(mockCountChain as any)
      .mockReturnValueOnce(mockFetchChain as any);

      await fetchTripOffers('trip-123', -1, 1000)
      
      expect(mockFetchChain.range).toHaveBeenCalledWith(0, 99) // Should clamp to valid range
    })
  })

  describe('offer validation', () => {
    const validOfferData = { // Renamed to avoid conflict with isValidDuration tests
      id: 'offer-123',
      price: 500,
      airline: 'AA',
      flight_number: 'AA123',
      departure_date: '2024-01-01',
      departure_time: '10:30',
      return_date: '2024-01-02',
      return_time: '14:45',
      duration: '2h 30m' // This will be tested by isValidDuration separately now
    }

    it('should validate and transform valid offers', async () => {
      const mockData = { 
        data: [validOfferData],
        error: null,
        count: 1
      }
      const mockCountChain = createCountMockChain({ data: [], error: null, count: 1 });
      const mockFetchChain = createMockChain(mockData)
      vi.mocked(supabase.from)
        .mockReturnValueOnce(mockCountChain as any)
        .mockReturnValueOnce(mockFetchChain as any);


      const result = await fetchTripOffers('trip-123')
      expect(result.offers).toHaveLength(1)
      // Corrected to match transformed structure if Offer interface is different
      expect(result.offers[0]).toEqual(expect.objectContaining({ id: 'offer-123', price: 500 }));
    })

    it('should filter out invalid offers', async () => {
      const invalidOfferData = { // Renamed
        ...validOfferData,
        price: -100, // Invalid price
        airline: 'INVALID_CODE_TOOLONG', // Invalid airline
        departure_date: 'not-a-date' // Invalid date
      }

      const mockData = { 
        data: [invalidOfferData], // API returns it
        error: null,
        count: 1
      }
      const mockCountChain = createCountMockChain({ data: [], error: null, count: 1 });
      const mockFetchChain = createMockChain(mockData)
      vi.mocked(supabase.from)
        .mockReturnValueOnce(mockCountChain as any)
        .mockReturnValueOnce(mockFetchChain as any);

      const result = await fetchTripOffers('trip-123')
      // The offer should be filtered out by validateOffer due to multiple invalid fields
      expect(result.offers).toHaveLength(0)
    })
  })

  describe('error handling', () => {
    it('should retry on failure', async () => {
      let attempts = 0
      const mockCountChain = createCountMockChain({ data: [], error: null, count: 1 }); // For checkTripOffersExist

      const mockFetchChain = {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockImplementation(() => {
            attempts++;
            if (attempts < 3) {
              // console.log(`Simulating failure attempt: ${attempts}`);
              throw new Error('Database error');
            }
            // console.log(`Simulating success attempt: ${attempts}`);
            return {
              order: vi.fn().mockReturnValue({
                range: vi.fn().mockResolvedValue({
                  data: [], // Successful fetch but no data
                  error: null,
                  count: 0
                })
              })
            };
          })
        })
      };
      
      vi.mocked(supabase.from)
        .mockReturnValueOnce(mockCountChain as any) // For the first checkTripOffersExist
        .mockReturnValue(mockFetchChain as any); // For subsequent fetch attempts

      const originalSetTimeout = global.setTimeout;
      global.setTimeout = vi.fn((callback) => {
        if (typeof callback === 'function') { // Ensure callback is a function
          callback();
        }
        return 1 as any;
      });
      
      const result = await fetchTripOffers('trip-123');
      
      global.setTimeout = originalSetTimeout;
      
      expect(attempts).toBe(3);
      expect(result.offers).toHaveLength(0);
    })

    it('should handle missing data gracefully', async () => {
      const mockData = { data: null, error: null, count: null }
      const mockCountChain = createCountMockChain({ data: [], error: null, count: 0 }); // checkTripOffersExist returns 0
      // fetchTripOffers might not even proceed to a second DB call if checkTripOffersExist is false.
      // If it does, this would be the mock for it:
      // const mockFetchChain = createMockChain(mockData)

      vi.mocked(supabase.from)
        .mockReturnValueOnce(mockCountChain as any)
        // .mockReturnValueOnce(mockFetchChain as any); // If a second call is made

      const result = await fetchTripOffers('trip-123')
      expect(result.offers).toHaveLength(0)
      expect(result.total).toBe(0)
    })
  })

  describe('debug inspection', () => {
    it('should return raw data for debugging', async () => {
      const mockRawData = {
        data: [{ raw_field: 'raw_value' }], // More realistic raw data
        error: null
      }
      // debugInspectTripOffers doesn't do a count call, just a select
      const mockActionChain = createCountMockChain(mockRawData) // Using createCountMockChain as it just needs from(...).select(...).eq(...)
      vi.mocked(supabase.from).mockReturnValue(mockActionChain as any)

      const result = await debugInspectTripOffers('trip-123')
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({ raw_field: 'raw_value' })
    })
  })
})

// --- New tests for isValidDuration ---
describe('isValidDuration', () => {
  it('should return true for valid ISO 8601 durations', () => {
    expect(isValidDuration("PT4H15M")).toBe(true);
    expect(isValidDuration("PT7H10M")).toBe(true);
    expect(isValidDuration("PT2H")).toBe(true);
    expect(isValidDuration("PT15M")).toBe(true);
  });

  it('should return true for valid human-readable durations', () => {
    expect(isValidDuration("4h 15m")).toBe(true);
    expect(isValidDuration("4h")).toBe(true);
  });

  it('should return false for invalid or edge-case ISO 8601 durations', () => {
    expect(isValidDuration("PT")).toBe(false);
    expect(isValidDuration("P1D")).toBe(false);
    expect(isValidDuration("PT15S")).toBe(false);
    expect(isValidDuration("PT1H2M3S")).toBe(false);
    expect(isValidDuration("PTM")).toBe(false);
    expect(isValidDuration("PTH")).toBe(false);
    expect(isValidDuration("PT15H M")).toBe(false);
  });

  it('should return false for invalid human-readable durations', () => {
    expect(isValidDuration("15m")).toBe(false);
    expect(isValidDuration("4h15m")).toBe(false);
  });

  it('should return false for empty or garbage strings', () => {
    expect(isValidDuration("")).toBe(false);
    expect(isValidDuration("invalid-duration")).toBe(false);
  });
});
