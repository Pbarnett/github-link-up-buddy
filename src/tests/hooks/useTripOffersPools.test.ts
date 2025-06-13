import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useTripOffersPools } from '@/hooks/useTripOffers';
import { ScoredOffer } from '@/types/offer';

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({
      data: {
        id: 'test-trip-id',
        budget: 1000,
        max_price: 3000,
        earliest_departure: '2024-01-01',
        latest_departure: '2024-01-02',
        min_duration: 5,
        max_duration: 10,
        destination_airport: 'LAX'
      },
      error: null
    }),
  },
}));

vi.mock('@/services/api/flightSearchApi', () => ({
  fetchFlightSearch: vi.fn().mockResolvedValue({
    pool1: [],
    pool2: [],
    pool3: [],
    requestsProcessed: 1,
    matchesInserted: 0,
    totalDurationMs: 100,
    relaxedCriteriaUsed: false,
    exactDestinationOnly: true,
    details: [],
  }),
}));

vi.mock('@/hooks/useFeatureFlag', () => ({
  useFeatureFlag: vi.fn(() => false),
}));

vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}));

describe('useTripOffersPools', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>{children}</MemoryRouter>
  );

  it('should initialize with default values', async () => {
    const { result } = renderHook(
      () => useTripOffersPools({ tripId: 'test-trip-id' }),
      { wrapper }
    );

    expect(result.current.pool1).toEqual([]);
    expect(result.current.pool2).toEqual([]);
    expect(result.current.pool3).toEqual([]);
    expect(result.current.budget).toBe(1000);
    expect(result.current.bumpsUsed).toBe(0);
    expect(result.current.mode).toBe('manual');
    expect(result.current.isLoading).toBe(true);
  });

  it('should bump budget correctly', async () => {
    const { result } = renderHook(
      () => useTripOffersPools({ tripId: 'test-trip-id' }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const initialBudget = result.current.budget;

    act(() => {
      result.current.bumpBudget();
    });

    expect(result.current.budget).toBe(initialBudget * 1.2);
    expect(result.current.bumpsUsed).toBe(1);
  });

  it('should not bump budget after 3 bumps', async () => {
    const { result } = renderHook(
      () => useTripOffersPools({ tripId: 'test-trip-id' }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Bump 3 times
    act(() => {
      result.current.bumpBudget();
      result.current.bumpBudget();
      result.current.bumpBudget();
    });

    const budgetAfterThreeBumps = result.current.budget;

    // Try to bump again
    act(() => {
      result.current.bumpBudget();
    });

    expect(result.current.budget).toBe(budgetAfterThreeBumps);
    expect(result.current.bumpsUsed).toBe(3);
  });

  it('should respect max budget limit', async () => {
    const { result } = renderHook(
      () => useTripOffersPools({ tripId: 'test-trip-id' }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Keep bumping until we hit the limit
    act(() => {
      for (let i = 0; i < 10; i++) {
        result.current.bumpBudget();
      }
    });

    expect(result.current.budget).toBeLessThanOrEqual(3000); // max_price from mock
  });
});
