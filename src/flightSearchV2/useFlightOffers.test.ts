import { renderHook, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import type { MockInstance } from 'vitest';
import { useFlightOffers, mapFlightOfferDbRowToV2 } from './useFlightOffers'; // mapFlightOfferDbRowToV2 is also exported here
import * as featureFlagHook from '@/hooks/useFeatureFlag';
import * as serverActions from '@/serverActions/getFlightOffers';
import type { FlightOfferV2, FlightOfferV2DbRow } from './types';

// Mock dependencies
vi.mock('@/hooks/useFeatureFlag');
vi.mock('@/serverActions/getFlightOffers');

const mockTripRequestId = 'test-trip-123';

const mockDbRows: FlightOfferV2DbRow[] = [
  { id: 'offer-db-1', trip_request_id: mockTripRequestId, mode: 'AUTO', price_total: 100, price_currency: 'USD', price_carry_on: null, bags_included: true, cabin_class: 'ECONOMY', nonstop: true, origin_iata: 'JFK', destination_iata: 'LAX', depart_dt: '2024-09-01T10:00:00Z', return_dt: null, seat_pref: null, created_at: '2024-08-01T12:00:00Z', booking_url: null },
  { id: 'offer-db-2', trip_request_id: mockTripRequestId, mode: 'MANUAL', price_total: 150, price_currency: 'USD', price_carry_on: 25, bags_included: false, cabin_class: 'BUSINESS', nonstop: false, origin_iata: 'JFK', destination_iata: 'LAX', depart_dt: '2024-09-02T10:00:00Z', return_dt: null, seat_pref: 'AISLE', created_at: '2024-08-01T13:00:00Z', booking_url: null },
];

const expectedMappedOffers: FlightOfferV2[] = mockDbRows.map(mapFlightOfferDbRowToV2);

describe('useFlightOffers Hook', () => {
  let mockUseFeatureFlag: MockInstance;
  let mockGetFlightOffers: MockInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default mocks
    mockUseFeatureFlag = vi.spyOn(featureFlagHook, 'useFeatureFlag').mockReturnValue({ data: true, isLoading: false, isError: false, error: null });
    mockGetFlightOffers = vi.spyOn(serverActions, 'getFlightOffers').mockResolvedValue([]);
  });

  it('should return initial state and featureEnabled: false if feature flag is off', () => {
    mockUseFeatureFlag.mockReturnValue({ data: false, isLoading: false, isError: false, error: null });
    const { result } = renderHook(() => useFlightOffers(mockTripRequestId));

    expect(result.current.offers).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isFeatureEnabled).toBe(false);
    expect(mockGetFlightOffers).not.toHaveBeenCalled();
  });

  it('should set error if tripRequestId is invalid and feature is enabled', () => {
    const { result } = renderHook(() => useFlightOffers('')); // Invalid ID

    expect(result.current.offers).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toEqual(new Error('Invalid tripRequestId provided.'));
    expect(result.current.isFeatureEnabled).toBe(true);
    expect(mockGetFlightOffers).not.toHaveBeenCalled();
  });

  it('should not fetch if opts.enabled is false, even if feature is enabled', () => {
    const { result } = renderHook(() => useFlightOffers(mockTripRequestId, { enabled: false }));

    expect(result.current.offers).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isFeatureEnabled).toBe(true); // Feature flag is on
    expect(mockGetFlightOffers).not.toHaveBeenCalled();
  });

  it('should fetch and map offers successfully when feature is enabled and hook is enabled', async () => {
    mockGetFlightOffers.mockResolvedValue(mockDbRows);
    const { result } = renderHook(() => useFlightOffers(mockTripRequestId));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isFeatureEnabled).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.offers).toEqual(expectedMappedOffers);
      expect(result.current.error).toBeNull();
    });
    expect(mockGetFlightOffers).toHaveBeenCalledTimes(1);
    expect(mockGetFlightOffers).toHaveBeenCalledWith({
      tripRequestId: mockTripRequestId,
      refresh: false,
      useCache: true
    });
  });

  it('should handle errors from getFlightOffers server action', async () => {
    const mockError = new Error('Server action failed');
    mockGetFlightOffers.mockRejectedValue(mockError);
    const { result } = renderHook(() => useFlightOffers(mockTripRequestId));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.offers).toEqual([]);
      expect(result.current.error).toBe(mockError);
    });
  });

  it('should handle AbortController signal on unmount', async () => {
    const abortSpy = vi.spyOn(AbortController.prototype, 'abort');
    mockGetFlightOffers.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockDbRows), 50)));

    const { unmount, result } = renderHook(() => useFlightOffers(mockTripRequestId));
    expect(result.current.isLoading).toBe(true);

    unmount();

    // Wait for longer than the mock fetch
    await act(() => new Promise(resolve => setTimeout(resolve, 100)));

    expect(abortSpy).toHaveBeenCalledTimes(1);
    // State should not have updated after unmount, so isLoading might still be true
    // or values might be from initial state if unmount was very fast.
    // The key is that no setState warning occurs (Vitest handles this by default).
  });

  it('refetch function should trigger a new fetch', async () => {
    mockGetFlightOffers
      .mockResolvedValueOnce(mockDbRows)
      .mockResolvedValueOnce([{ ...mockDbRows[0], id: 'refetched-offer' }]);

    const { result } = renderHook(() => useFlightOffers(mockTripRequestId));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.offers).toEqual(expectedMappedOffers);
    expect(mockGetFlightOffers).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.refetch();
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockGetFlightOffers).toHaveBeenCalledTimes(2);
    // Second call should have refresh: true
    expect(mockGetFlightOffers).toHaveBeenNthCalledWith(2, {
      tripRequestId: mockTripRequestId,
      refresh: true,
      useCache: true
    });
    // Check if the offers updated based on the second mock call
    const expectedRefetchedOffer = mapFlightOfferDbRowToV2({ ...mockDbRows[0], id: 'refetched-offer' });
    expect(result.current.offers).toEqual([expectedRefetchedOffer]);
  });

   it('should return new data if tripRequestId changes', async () => {
    const initialId = 'trip-id-1';
    const newId = 'trip-id-2';
    const initialData = [{ ...mockDbRows[0], id: 'initial-offer', trip_request_id: initialId }];
    const newData = [{ ...mockDbRows[1], id: 'new-offer', trip_request_id: newId }];

    mockGetFlightOffers.mockResolvedValueOnce(initialData);
    const { result, rerender } = renderHook(
      ({ id }) => useFlightOffers(id),
      { initialProps: { id: initialId } }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.offers).toEqual(initialData.map(mapFlightOfferDbRowToV2));
    expect(mockGetFlightOffers).toHaveBeenCalledWith({
      tripRequestId: initialId,
      refresh: false,
      useCache: true
    });

    mockGetFlightOffers.mockResolvedValueOnce(newData); // For the new ID
    rerender({ id: newId });

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.offers).toEqual(newData.map(mapFlightOfferDbRowToV2));
    expect(mockGetFlightOffers).toHaveBeenCalledWith({
      tripRequestId: newId,
      refresh: false,
      useCache: true
    });
    expect(mockGetFlightOffers).toHaveBeenCalledTimes(2);
  });
});
