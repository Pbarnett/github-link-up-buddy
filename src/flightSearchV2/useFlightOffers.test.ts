import { renderHook, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useFlightOffers } from './useFlightOffers';
import { safeQuery } from '@/lib/supabaseUtils';
import { useFlightSearchV2Flag } from './useFlightSearchV2Flag';
import type { FlightOfferV2 } from './types';

// Mock dependencies
vi.mock('@/lib/supabaseUtils', () => ({
  safeQuery: vi.fn(),
}));

vi.mock('./useFlightSearchV2Flag', () => ({
  useFlightSearchV2Flag: vi.fn(),
}));

// Mock Supabase client (though safeQuery abstracts it, some tests might want to verify its usage pattern indirectly)
// For this hook, direct Supabase client mock might not be strictly needed if safeQuery is fully trusted.
// However, if safeQuery's internal call to supabase.from(...).select(...).eq(...) needs verification,
// then a deeper mock of supabase client would be required.
// Given the spec focuses on mocking safeQuery, we'll rely on that.
vi.mock('@/integrations/supabase/client', () => ({
    supabase: {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
    }
  })
);


const mockTripRequestId = 'test-trip-123';
const mockOffers: FlightOfferV2[] = [
  { id: 'offer-1', tripRequestId: mockTripRequestId, mode: 'AUTO', priceTotal: 100, priceCarryOn: null, bagsIncluded: true, cabinClass: 'ECONOMY', nonstop: true, originIata: 'JFK', destinationIata: 'LAX', departDt: '2024-09-01T10:00:00Z', returnDt: null, seatPref: null, createdAt: '2024-08-01T12:00:00Z' },
  { id: 'offer-2', tripRequestId: mockTripRequestId, mode: 'MANUAL', priceTotal: 150, priceCarryOn: 25, bagsIncluded: false, cabinClass: 'BUSINESS', nonstop: false, originIata: 'JFK', destinationIata: 'LAX', departDt: '2024-09-02T10:00:00Z', returnDt: null, seatPref: 'AISLE', createdAt: '2024-08-01T13:00:00Z' },
];

describe('useFlightOffers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementations
    (useFlightSearchV2Flag as ReturnType<typeof vi.fn>).mockReturnValue({ enabled: true, loading: false });
    (safeQuery as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [], error: null });
  });

  it('1. Flag OFF → no query, returns empty', async () => {
    (useFlightSearchV2Flag as ReturnType<typeof vi.fn>).mockReturnValue({ enabled: false, loading: false });
    const { result } = renderHook(() => useFlightOffers(mockTripRequestId));

    expect(result.current.offers).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(safeQuery).not.toHaveBeenCalled();
  });

  it('2. Happy path (flag ON) → returns mocked rows', async () => {
    (safeQuery as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: mockOffers, error: null });
    const { result } = renderHook(() => useFlightOffers(mockTripRequestId));

    expect(result.current.isLoading).toBe(true); // Initial loading state

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.offers).toEqual(mockOffers);
      expect(result.current.error).toBeNull();
    });
    expect(safeQuery).toHaveBeenCalledTimes(1);
    // Optionally, verify arguments to safeQuery if needed (requires deeper inspection of safeQuery mock setup)
  });

  it('3. Supabase error (via safeQuery mock) → error instance exposed', async () => {
    const mockError = new Error('Supabase query failed');
    (safeQuery as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: null, error: mockError });
    const { result } = renderHook(() => useFlightOffers(mockTripRequestId));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.offers).toEqual([]);
      expect(result.current.error).toBe(mockError);
    });
    expect(safeQuery).toHaveBeenCalledTimes(1);
  });

  it('4. Invalid id (empty string) → immediate INVALID_ID error, no Supabase call', () => {
    const { result } = renderHook(() => useFlightOffers(''));

    expect(result.current.offers).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe('INVALID_ID');
    expect(safeQuery).not.toHaveBeenCalled();
  });

  it('4. Invalid id (null) → immediate INVALID_ID error, no Supabase call', () => {
    // @ts-expect-error testing invalid input
    const { result } = renderHook(() => useFlightOffers(null));

    expect(result.current.offers).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe('INVALID_ID');
    expect(safeQuery).not.toHaveBeenCalled();
  });

  it('5. Unmount safety – simulate unmount before promise resolves, assert no state-update warning', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Make safeQuery resolve after a delay
    (safeQuery as ReturnType<typeof vi.fn>).mockImplementationOnce(() =>
      new Promise(resolve => setTimeout(() => resolve({ data: mockOffers, error: null }), 50))
    );

    const { unmount, result } = renderHook(() => useFlightOffers(mockTripRequestId));

    expect(result.current.isLoading).toBe(true); // Should be loading

    // Unmount before the promise resolves
    unmount();

    // Wait for a bit longer than the promise delay
    await act(() => new Promise(resolve => setTimeout(resolve, 100)));

    // Assert that no state update warnings (like "Can't perform a React state update on an unmounted component") occurred
    // This is typically checked by ensuring console.error was not called with such a warning.
    // The hook's `cancelled` flag should prevent setState calls.
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(expect.stringContaining('Can\'t perform a React state update on an unmounted component'));

    // Note: The actual state values after unmount are less relevant than preventing the warning.
    // If you need to check state, result.current will not update after unmount.

    consoleErrorSpy.mockRestore();
  });

  it('should not fetch if opts.enabled is false', async () => {
    const { result } = renderHook(() => useFlightOffers(mockTripRequestId, { enabled: false }));

    expect(result.current.offers).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(safeQuery).not.toHaveBeenCalled();
  });

  it('should not fetch if v2 flag is loading', async () => {
    (useFlightSearchV2Flag as ReturnType<typeof vi.fn>).mockReturnValue({ enabled: true, loading: true });
    const { result } = renderHook(() => useFlightOffers(mockTripRequestId));

    expect(result.current.offers).toEqual([]);
    expect(result.current.isLoading).toBe(false); // Should be false as no fetch initiated
    expect(result.current.error).toBeNull();
    expect(safeQuery).not.toHaveBeenCalled();
  });
});
