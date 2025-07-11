
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { usePoolsSafe } from '@/hooks/usePoolsSafe';
import * as useTripOffers from '@/hooks/useTripOffers';
import * as useTripOffersLegacy from '@/hooks/useTripOffersLegacy';
import { toast } from '@/hooks/use-toast';

// Mock the hooks and utilities
vi.mock('@/hooks/useTripOffers');
vi.mock('@/hooks/useTripOffersLegacy');
vi.mock('@/hooks/use-toast');
vi.mock('@/lib/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

const mockTripOffers = useTripOffers as any;
const mockTripOffersLegacy = useTripOffersLegacy as any;
const mockToast = toast as any;

const mockPoolsResult = {
  pool1: [{ id: 'offer-1', score: 10 }],
  pool2: [{ id: 'offer-2', score: 8 }],
  pool3: [{ id: 'offer-3', score: 6 }],
  budget: 1000,
  maxBudget: 3000,
  dateRange: { from: '2024-07-01', to: '2024-07-31' },
  bumpsUsed: 0,
  bumpBudget: vi.fn(),
  mode: 'manual' as const,
  isLoading: false,
  hasError: false,
  errorMessage: '',
  refreshPools: vi.fn(),
};

const mockLegacyResult = {
  offers: [
    { id: 'legacy-offer-1', price: 500 },
    { id: 'legacy-offer-2', price: 750 }
  ],
  tripDetails: {
    id: 'test-trip',
    budget: 1000,
    max_price: 3000,
    earliest_departure: '2024-07-01',
    latest_departure: '2024-07-31',
    min_duration: 3,
    max_duration: 7,
  },
  isLoading: false,
  isRefreshing: false,
  hasError: false,
  errorMessage: '',
  ignoreFilter: false,
  usedRelaxedCriteria: false,
  refreshOffers: vi.fn(),
  handleOverrideSearch: vi.fn(),
  handleRelaxCriteria: vi.fn(),
};

describe('usePoolsSafe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockToast.mockImplementation(() => {});
    mockTripOffersLegacy.useTripOffers.mockReturnValue(mockLegacyResult);
    mockTripOffers.clearUnifiedCache = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Normal operation', () => {
    it('should return pools result when useTripOffersPools succeeds', () => {
      mockTripOffers.useTripOffersPools.mockReturnValue(mockPoolsResult);

      const { result } = renderHook(() =>
        usePoolsSafe({ tripId: 'test-trip-id' })
      );

      expect(result.current.isUsingFallback).toBe(false);
      expect(result.current.pool1).toEqual(mockPoolsResult.pool1);
      expect(result.current.pool2).toEqual(mockPoolsResult.pool2);
      expect(result.current.pool3).toEqual(mockPoolsResult.pool3);
    });
  });

  describe('Error handling and fallback', () => {
    it('should fall back to legacy hook when useTripOffersPools throws', async () => {
      const error = new Error('Pools failed');
      mockTripOffers.useTripOffersPools.mockImplementation(() => {
        throw error;
      });

      const { result } = renderHook(() =>
        usePoolsSafe({ tripId: 'test-trip-id' })
      );

      await waitFor(() => {
        expect(result.current.isUsingFallback).toBe(true);
      });

      expect(result.current.pool1).toHaveLength(2);
      expect(result.current.pool1[0]).toEqual({
        ...mockLegacyResult.offers[0],
        score: 1
      });
      expect(result.current.pool2).toEqual([]);
      expect(result.current.pool3).toEqual([]);
    });

    it('should show error toast when pools fail', async () => {
      const error = new Error('Pools failed');
      mockTripOffers.useTripOffersPools.mockImplementation(() => {
        throw error;
      });

      renderHook(() => usePoolsSafe({ tripId: 'test-trip-id' }));

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Loading issue detected",
          description: "Having trouble loading pools—showing full list instead.",
          variant: "destructive"
        });
      });
    });

    it('should clear cache when pools fail', async () => {
      const error = new Error('Pools failed');
      mockTripOffers.useTripOffersPools.mockImplementation(() => {
        throw error;
      });

      renderHook(() => usePoolsSafe({ tripId: 'test-trip-id' }));

      await waitFor(() => {
        expect(mockTripOffers.clearUnifiedCache).toHaveBeenCalled();
      });
    });

    it('should handle cache-related errors with specific logging', async () => {
      const cacheError = new Error('cache corruption detected');
      mockTripOffers.useTripOffersPools.mockImplementation(() => {
        throw cacheError;
      });

      renderHook(() => usePoolsSafe({ tripId: 'test-trip-id' }));

      await waitFor(() => {
        expect(mockTripOffers.clearUnifiedCache).toHaveBeenCalled();
      });
    });
  });

  describe('Fallback behavior', () => {
    it('should map legacy offers to pool1 with score', async () => {
      const error = new Error('Pools failed');
      mockTripOffers.useTripOffersPools.mockImplementation(() => {
        throw error;
      });

      const { result } = renderHook(() =>
        usePoolsSafe({ tripId: 'test-trip-id' })
      );

      await waitFor(() => {
        expect(result.current.isUsingFallback).toBe(true);
      });

      expect(result.current.pool1).toEqual([
        { ...mockLegacyResult.offers[0], score: 1 },
        { ...mockLegacyResult.offers[1], score: 1 }
      ]);
    });

    it('should map legacy trip details to budget and dateRange', async () => {
      const error = new Error('Pools failed');
      mockTripOffers.useTripOffersPools.mockImplementation(() => {
        throw error;
      });

      const { result } = renderHook(() =>
        usePoolsSafe({ tripId: 'test-trip-id' })
      );

      await waitFor(() => {
        expect(result.current.isUsingFallback).toBe(true);
      });

      expect(result.current.budget).toBe(1000);
      expect(result.current.maxBudget).toBe(3000);
      expect(result.current.dateRange).toEqual({
        from: '2024-07-01',
        to: '2024-07-31'
      });
    });
  });
});
