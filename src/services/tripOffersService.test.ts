import { describe, it, expect, vi, beforeEach } from 'vitest'
import { supabase } from '@/integrations/supabase/client'
import { fetchTripOffers, checkTripOffersExist, getTripOffersCount, debugInspectTripOffers } from './tripOffersService'

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
      const mockChain = createMockChain(mockData)
      vi.mocked(supabase.from).mockReturnValue(mockChain as any)

      await fetchTripOffers('trip-123!@#$%^')
      
      expect(supabase.from).toHaveBeenCalledWith('flight_offers')
      expect(mockChain.select).toHaveBeenCalled()
      expect(mockChain.eq).toHaveBeenCalledWith('trip_request_id', 'trip-123')
    })

    it('should validate pagination parameters', async () => {
      const mockData = { data: [], error: null, count: 5 }
      const mockChain = createMockChain(mockData)
      vi.mocked(supabase.from).mockReturnValue(mockChain as any)

      await fetchTripOffers('trip-123', -1, 1000)
      
      expect(mockChain.range).toHaveBeenCalledWith(0, 99) // Should clamp to valid range
    })
  })

  describe('offer validation', () => {
    const validOffer = {
      id: 'offer-123',
      price: 500,
      airline: 'AA',
      flight_number: 'AA123',
      departure_date: '2024-01-01',
      departure_time: '10:30',
      return_date: '2024-01-02',
      return_time: '14:45',
      duration: '2h 30m'
    }

    it('should validate and transform valid offers', async () => {
      const mockData = { 
        data: [validOffer],
        error: null,
        count: 1
      }
      const mockChain = createMockChain(mockData)
      vi.mocked(supabase.from).mockReturnValue(mockChain as any)

      const result = await fetchTripOffers('trip-123')
      expect(result.offers).toHaveLength(1)
      expect(result.offers[0]).toEqual(validOffer)
    })

    it('should filter out invalid offers', async () => {
      const invalidOffer = {
        ...validOffer,
        price: -100,
        airline: 'INVALID',
        departure_date: 'not-a-date'
      }

      const mockData = { 
        data: [invalidOffer],
        error: null,
        count: 1
      }
      const mockChain = createMockChain(mockData)
      vi.mocked(supabase.from).mockReturnValue(mockChain as any)

      const result = await fetchTripOffers('trip-123')
      expect(result.offers).toHaveLength(0)
    })
  })

  describe('error handling', () => {
    it('should retry on failure', async () => {
      let attempts = 0
      const mockChain = {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockImplementation(() => {
            attempts++
            if (attempts < 3) {
              throw new Error('Database error')
            }
            return {
              order: vi.fn().mockReturnValue({
                range: vi.fn().mockResolvedValue({
                  data: [],
                  error: null,
                  count: 0
                })
              })
            }
          })
        })
      }
      
      vi.mocked(supabase.from).mockReturnValue(mockChain as any)

      // Mock setTimeout to avoid waiting for actual timeouts
      const originalSetTimeout = global.setTimeout
      global.setTimeout = vi.fn((callback) => {
        callback()
        return 1 as any
      })
      
      const result = await fetchTripOffers('trip-123')
      
      // Restore original setTimeout
      global.setTimeout = originalSetTimeout
      
      expect(attempts).toBe(3)
      expect(result.offers).toHaveLength(0)
    })

    it('should handle missing data gracefully', async () => {
      const mockData = { data: null, error: null, count: null }
      const mockChain = createMockChain(mockData)
      vi.mocked(supabase.from).mockReturnValue(mockChain as any)

      const result = await fetchTripOffers('trip-123')
      expect(result.offers).toHaveLength(0)
      expect(result.total).toBe(0)
    })
  })

  describe('debug inspection', () => {
    it('should return raw data for debugging', async () => {
      const mockData = { 
        data: [{ raw: 'data' }],
        error: null
      }
      const mockChain = createCountMockChain(mockData)
      vi.mocked(supabase.from).mockReturnValue(mockChain as any)

      const result = await debugInspectTripOffers('trip-123')
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({ raw: 'data' })
    })
  })
})
