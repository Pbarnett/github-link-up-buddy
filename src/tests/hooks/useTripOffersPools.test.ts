
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTripOffersPools } from '@/hooks/useTripOffers';

// Mock the dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({ data: { id: 'test-trip-id', earliest_departure: '', latest_departure: '', min_duration: 0, max_duration: 0, budget: 1000 }, error: null }))
        }))
      }))
    }))
  }
}));

vi.mock('react-router-dom', () => ({
  useSearchParams: vi.fn(() => [new URLSearchParams()])
}));

vi.mock('@/services/api/flightSearchApi', () => ({
  fetchFlightSearch: vi.fn(() => Promise.resolve({
    pool1: [],
    pool2: [],
    pool3: [],
    success: true,
    message: 'Test success'
  }))
}));

vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn()
}));

describe('useTripOffersPools', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

it('should initialize with default values', () => {
    const { result } = renderHook(() => useTripOffersPools({ tripId: null }));

    expect(result.current.pool1).toEqual([]);
    expect(result.current.pool2).toEqual([]);
    expect(result.current.pool3).toEqual([]);
    expect(result.current.budget).toBe(1000);
    expect(result.current.bumpsUsed).toBe(0);
    expect(result.current.mode).toBe('manual');
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle budget bumping correctly', () => {
    const { result } = renderHook(() => useTripOffersPools({ tripId: 'test-trip' }));

    act(() => {
      result.current.bumpBudget();
    });

    expect(result.current.budget).toBe(1200); // 1000 * 1.2
    expect(result.current.bumpsUsed).toBe(1);
  });

  it('should prevent budget bumping after 3 uses', () => {
    const { result } = renderHook(() => useTripOffersPools({ tripId: 'test-trip' }));

    // Bump 3 times
    act(() => {
      result.current.bumpBudget();
      result.current.bumpBudget();
      result.current.bumpBudget();
    });

    const budgetAfterThreeBumps = result.current.budget;

    // Try to bump a 4th time
    act(() => {
      result.current.bumpBudget();
    });

    expect(result.current.budget).toBe(budgetAfterThreeBumps);
    expect(result.current.bumpsUsed).toBe(3);
  });
});
