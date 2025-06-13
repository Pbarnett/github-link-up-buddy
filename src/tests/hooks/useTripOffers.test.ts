/// <reference types="vitest/globals" />
import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTripOffers, TripDetails, clearCache } from '@/hooks/useTripOffers';
import * as tripOffersService from '@/services/tripOffersService';
import * as flightSearchApi from '@/services/api/flightSearchApi';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Mock the services
vi.mock('@/services/tripOffersService');

// Corrected: Define vi.mock factory that returns mock functions directly
vi.mock('@/services/api/flightSearchApi', () => ({
  invokeFlightSearch: vi.fn(),
  fetchFlightSearch: vi.fn(),
}));

// Import the mocked functions here to get a reference to them
// These are now vi.fn() instances created by the factory above.
import { invokeFlightSearch, fetchFlightSearch } from '@/services/api/flightSearchApi';

vi.mock('@/components/ui/use-toast');
vi.mock('@/lib/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn(),
        }),
      }),
    }),
  },
}));

const mockTripOffersService = tripOffersService as any;
const mockToast = toast as any;

const mockTripDetails: TripDetails = {
  id: 'test-trip-id',
  earliest_departure: '2024-07-01',
  latest_departure: '2024-07-31',
  min_duration: 3,
  max_duration: 7,
  budget: 1000,
  destination_airport: 'LAX',
};

const mockOffers = [
  {
    id: 'offer-1',
    trip_request_id: 'test-trip-id',
    price: 500,
    airline: 'Test Airlines',
    flight_number: 'TA123',
    departure_date: '2024-07-15',
    departure_time: '08:00',
    return_date: '2024-07-18', // 3 days duration
    return_time: '20:00',
    duration: '3 days',
    booking_url: 'https://example.com/book',
    carrier_code: 'TA',
    origin_airport: 'JFK',
    destination_airport: 'LAX',
  },
  {
    id: 'offer-2',
    trip_request_id: 'test-trip-id',
    price: 750,
    airline: 'Another Airlines',
    flight_number: 'AA456',
    departure_date: '2024-07-20',
    departure_time: '14:00',
    return_date: '2024-07-30', // 10 days duration - exceeds max_duration
    return_time: '18:00',
    duration: '10 days',
    booking_url: 'https://example.com/book2',
    carrier_code: 'AA',
    origin_airport: 'JFK',
    destination_airport: 'LAX',
  },
];

const mockFlightSearchResponse = {
  requestsProcessed: 1,
  matchesInserted: 2,
  totalDurationMs: 5000,
  relaxedCriteriaUsed: false,
  exactDestinationOnly: true,
  details: [
    {
      tripRequestId: 'test-trip-id',
      matchesFound: 2,
      offersGenerated: 2,
      offersInserted: 2,
    },
  ],
  success: true,
  message: 'Flight search processed 1 request(s).',
};

describe('useTripOffers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Clear the cache manually to ensure test isolation
    clearCache();
    
    // Setup default mocks
    mockTripOffersService.fetchTripOffers = vi.fn().mockResolvedValue(mockOffers);
    (invokeFlightSearch as vi.Mock).mockResolvedValue(mockFlightSearchResponse);
    (fetchFlightSearch as vi.Mock).mockResolvedValue({ pool1: [], pool2: [], pool3: [] });
    mockToast.mockImplementation(() => {});
    
    // Mock Supabase response for trip details
    const mockSingle = vi.fn().mockResolvedValue({
      data: {
        id: 'test-trip-id',
        earliest_departure: '2024-07-01',
        latest_departure: '2024-07-31',
        min_duration: 3,
        max_duration: 7,
        budget: 1000,
        destination_airport: 'LAX',
      },
      error: null,
    });
    
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    (supabase.from as any).mockReturnValue({ select: mockSelect });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial loading', () => {
    it('should initialize with loading state when tripId is provided', () => {
      const { result } = renderHook(() =>
        useTripOffers({ tripId: 'test-trip-id' })
      );

      expect(result.current.isLoading).toBe(true);
      expect(result.current.offers).toEqual([]);
      expect(result.current.hasError).toBe(false);
    });

    it('should not load when tripId is null', () => {
      const { result } = renderHook(() =>
        useTripOffers({ tripId: null })
      );

      expect(result.current.isLoading).toBe(false);
      expect(result.current.offers).toEqual([]);
    });

    it('should use initialTripDetails when provided', () => {
      const { result } = renderHook(() =>
        useTripOffers({ 
          tripId: 'test-trip-id', 
          initialTripDetails: mockTripDetails 
        })
      );

      expect(result.current.tripDetails).toEqual(mockTripDetails);
    });
  });

  describe('Loading offers successfully', () => {
    it('should load offers and apply duration filter by default', async () => {

      // beforeEach already clears mocks and sets up default responses.
      // If specific mock behavior is needed for this test, adjust it here.
      // For this test, the default mocks from beforeEach should be fine.
      // Use a unique tripId to avoid cache interference from other tests.
      const uniqueTripId = 'test-trip-id-duration-filter';

      // Full Supabase mock for this specific test and ID
      const mockSingleUnique = vi.fn().mockResolvedValue({
        data: { ...mockTripDetails, id: uniqueTripId, min_duration: 3, max_duration: 7 }, // Ensure all fields
        error: null,
      });
      const mockEqUnique = vi.fn().mockReturnValue({ single: mockSingleUnique });
      const mockSelectUnique = vi.fn().mockReturnValue({ eq: mockEqUnique });
      (supabase.from as vi.Mock).mockImplementation((table: string) => {
        if (table === 'trip_requests') {
          return { select: mockSelectUnique };
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: null, error: new Error(`Unexpected table '${table}' in duration filter test`) })
        };
      });

      // Ensure other service mocks are as expected for this test
      mockTripOffersService.fetchTripOffers.mockResolvedValue(mockOffers);
      (invokeFlightSearch as vi.Mock).mockResolvedValue(mockFlightSearchResponse);
      

      const { result } = renderHook(() =>
        useTripOffers({ tripId: uniqueTripId })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should only include offers that match duration criteria (3-7 days)
      expect(result.current.offers).toHaveLength(1);
      expect(result.current.offers[0].id).toBe('offer-1');
      expect(result.current.hasError).toBe(false);
      expect(invokeFlightSearch).toHaveBeenCalledWith({
        tripRequestId: uniqueTripId,
        relaxedCriteria: false,
      });
    });

    it('should show toast when duration filter is applied', async () => {
      const uniqueToastTestTripId = 'test-trip-id-toast-filter';

      mockTripOffersService.fetchTripOffers.mockResolvedValue(mockOffers);
      (invokeFlightSearch as vi.Mock).mockResolvedValue(mockFlightSearchResponse);
      mockToast.mockClear();

      const mockSingleToast = vi.fn().mockResolvedValue({
        data: { ...mockTripDetails, id: uniqueToastTestTripId, min_duration: 3, max_duration: 7 }, // Ensure all fields from mockTripDetails are there
        error: null,
      });
      const mockEqToast = vi.fn().mockReturnValue({ single: mockSingleToast });
      const mockSelectToast = vi.fn().mockReturnValue({ eq: mockEqToast });

      // Specifically mock supabase.from for 'trip_requests' table for this test
      (supabase.from as vi.Mock).mockImplementation((table: string) => {
        if (table === 'trip_requests') {
          return { select: mockSelectToast };
        }
        // Fallback to a default behavior or error if other tables are called unexpectedly
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: null, error: new Error('Unexpected table query in toast test') })
        };
      });

      const { result } = renderHook(() =>
        useTripOffers({ tripId: uniqueToastTestTripId })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Duration filter applied',
        description: 'Found 2 offers, but only 1 match your 3-7 day trip duration.',
      });
    });

    it('should load all offers when ignoreFilter is true', async () => {
      const uniqueOverrideTripId = 'test-trip-id-override';

      // Initial mock setup for this specific test and tripId
      mockTripOffersService.fetchTripOffers.mockResolvedValue(mockOffers);
      (invokeFlightSearch as vi.Mock).mockResolvedValue(mockFlightSearchResponse);
      mockToast.mockClear();

      const mockSingleOverride = vi.fn().mockResolvedValue({
        data: { ...mockTripDetails, id: uniqueOverrideTripId, min_duration: 3, max_duration: 7 }, // Use unique ID & ensure fields
        error: null,
      });
      const mockEqOverride = vi.fn().mockReturnValue({ single: mockSingleOverride });
      const mockSelectOverride = vi.fn().mockReturnValue({ eq: mockEqOverride });
      (supabase.from as vi.Mock).mockImplementation((table: string) => {
        if (table === 'trip_requests') {
          return { select: mockSelectOverride };
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: null, error: new Error(`Unexpected table '${table}' in override test`) })
        };
      });

      const { result } = renderHook(() => useTripOffers({ tripId: uniqueOverrideTripId }));

      // Wait for initial load to complete
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // Clear mocks that would have been called during initial load
      // before calling the function that will trigger new calls.
      (invokeFlightSearch as vi.Mock).mockClear();
      mockTripOffersService.fetchTripOffers.mockClear();
      mockToast.mockClear();

      // Re-mock for the specific calls within loadOffers triggered by handleOverrideSearch
      mockTripOffersService.fetchTripOffers.mockResolvedValue(mockOffers);
      (invokeFlightSearch as vi.Mock).mockResolvedValue(mockFlightSearchResponse);


      // Action: Override search to ignore duration filter
      result.current.handleOverrideSearch();

      // Assertions
      await waitFor(() => {
        expect(result.current.offers).toHaveLength(2); // All offers should be loaded
        expect(result.current.ignoreFilter).toBe(true); // ignoreFilter state should be true
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Search without duration filter',
        description: 'Showing all 2 available offers regardless of trip duration.',
      });
    });
  });

  describe('Error handling', () => {
    it('should handle flight search API errors', async () => {

      const uniqueErrorTripId = 'test-trip-id-flight-error';

      const searchError = new Error('Flight search failed');
      

      // Mock setup: Supabase fetch is SUCCESSFUL, invokeFlightSearch is REJECTED.
      const mockSingleFlightApiError = vi.fn().mockResolvedValue({
        data: { ...mockTripDetails, id: uniqueErrorTripId, min_duration: 3, max_duration: 7 },
        error: null,
      });
      const mockEqFlightApiError = vi.fn().mockReturnValue({ single: mockSingleFlightApiError });
      const mockSelectFlightApiError = vi.fn().mockReturnValue({ eq: mockEqFlightApiError });
      (supabase.from as vi.Mock).mockImplementation((table: string) => {
        if (table === 'trip_requests') {
          return { select: mockSelectFlightApiError };
        }
        return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), single: vi.fn().mockResolvedValue({ data: null, error: new Error(`Unexpected table '${table}'`) }) };
      });

      (invokeFlightSearch as vi.Mock).mockRejectedValue(searchError);

      mockTripOffersService.fetchTripOffers.mockResolvedValue([]);
      
      // Setup Supabase mock
      const mockSingle = vi.fn().mockResolvedValue({
        data: {
          id: 'test-trip-id-error',
          earliest_departure: '2024-07-01',
          latest_departure: '2024-07-31',
          min_duration: 3,
          max_duration: 7,
          budget: 1000,
          destination_airport: 'LAX',
        },
        error: null,
      });
      
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      (supabase.from as any).mockReturnValue({ select: mockSelect });

      const { result } = renderHook(() =>

        useTripOffers({ tripId: uniqueErrorTripId })

      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.hasError).toBe(true);
      expect(result.current.errorMessage).toBe('Flight search failed');
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error Loading Flight Offers',
        description: 'Flight search failed',
        variant: 'destructive',
      });
    });

    it('should fall back to existing offers when search fails', async () => {
      const searchError = new Error('Flight search failed');
      (invokeFlightSearch as vi.Mock).mockRejectedValue(searchError);
      
      // Mock existing offers available - the hook will call fetchTripOffers twice:
      // Once during normal search, then again during error fallback
      mockTripOffersService.fetchTripOffers.mockResolvedValue(mockOffers);

      const uniqueFallbackTripId = 'test-trip-id-fallback';
      // Supabase fetch is SUCCESSFUL for this test
      const mockSingleFallback = vi.fn().mockResolvedValue({
        data: { ...mockTripDetails, id: uniqueFallbackTripId, min_duration: 3, max_duration: 7 },
        error: null,
      });
      const mockEqFallback = vi.fn().mockReturnValue({ single: mockSingleFallback });
      const mockSelectFallback = vi.fn().mockReturnValue({ eq: mockEqFallback });
      (supabase.from as vi.Mock).mockImplementation((table: string) => {
        if (table === 'trip_requests') {
          return { select: mockSelectFallback };
        }
        return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), single: vi.fn().mockResolvedValue({ data: null, error: new Error(`Unexpected table '${table}'`) }) };
      });

      (invokeFlightSearch as vi.Mock).mockRejectedValue(new Error('Flight search failed'));

      const { result } = renderHook(() =>
        useTripOffers({ tripId: uniqueFallbackTripId })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.hasError).toBe(false);

      expect(result.current.offers).toHaveLength(1);
    });

    it('should handle Supabase errors when fetching trip details', async () => {
      const uniqueSupabaseErrorId = 'test-trip-id-supabase-error';
      // Mock setup: Supabase fetch results in an ERROR.
      const mockSingleSupabaseError = vi.fn().mockResolvedValue({

        data: null,
        error: { message: 'Trip not found', code: 'PGRST116', details: '', hint: '' }, // PGRST116: "Invalid response from database" (example)
      });
      const mockEqSupabaseError = vi.fn().mockReturnValue({ single: mockSingleSupabaseError });
      const mockSelectSupabaseError = vi.fn().mockReturnValue({ eq: mockEqSupabaseError });
      (supabase.from as vi.Mock).mockImplementation((table: string) => {
        if (table === 'trip_requests') {
          return { select: mockSelectSupabaseError };
        }
        return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), single: vi.fn().mockResolvedValue({ data: null, error: new Error(`Unexpected table '${table}'`) }) };
      });

      // Ensure other mocks don't interfere or are set as neutral if needed
      (invokeFlightSearch as vi.Mock).mockResolvedValue(mockFlightSearchResponse);
      mockTripOffersService.fetchTripOffers.mockResolvedValue([]);

      const { result } = renderHook(() =>

        useTripOffers({ tripId: uniqueSupabaseErrorId })

      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.hasError).toBe(true);
      expect(result.current.errorMessage).toBe('Trip not found');
    });

    it('should handle missing trip ID', () => {
      const { result } = renderHook(() =>
        useTripOffers({ tripId: '' })
      );

      expect(result.current.isLoading).toBe(false);
      expect(result.current.hasError).toBe(false);
    });
  });

  describe('Refresh functionality', () => {
    it('should refresh offers when refreshOffers is called', async () => {
      const uniqueRefreshTripId = 'test-trip-id-refresh';
      const mockSingleRefresh = vi.fn().mockResolvedValue({ data: { ...mockTripDetails, id: uniqueRefreshTripId, min_duration: 3, max_duration: 7 }, error: null });
      const mockEqRefresh = vi.fn().mockReturnValue({ single: mockSingleRefresh });
      const mockSelectRefresh = vi.fn().mockReturnValue({ eq: mockEqRefresh });
      (supabase.from as vi.Mock).mockImplementation((table: string) => {
        if (table === 'trip_requests') return { select: mockSelectRefresh };
        return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), single: vi.fn().mockResolvedValue({data: null, error: new Error("unexpected table")})};
      });
      (invokeFlightSearch as vi.Mock).mockResolvedValue(mockFlightSearchResponse);
      mockTripOffersService.fetchTripOffers.mockResolvedValue(mockOffers);

      const { result } = renderHook(() =>
        useTripOffers({ tripId: uniqueRefreshTripId })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });


      // Clear previous calls from initial load & set up for the refresh call
      (invokeFlightSearch as vi.Mock).mockClear();
      (invokeFlightSearch as vi.Mock).mockResolvedValue(mockFlightSearchResponse);

      mockTripOffersService.fetchTripOffers.mockClear();

      mockTripOffersService.fetchTripOffers.mockResolvedValue(mockOffers);
      (invokeFlightSearch as vi.Mock).mockResolvedValue(mockFlightSearchResponse);

      // Trigger refresh wrapped in act
      await act(async () => {
        await result.current.refreshOffers();
      });

      // Wait for the refresh to complete
      await waitFor(() => {
         expect(result.current.isRefreshing).toBe(false);
      });


      // Wait directly for the mock call to happen, as it's the core of the test.
      await waitFor(() => {
        expect(invokeFlightSearch).toHaveBeenCalledWith({
          tripRequestId: uniqueRefreshTripId,
          relaxedCriteria: false,
        });
      }, { timeout: 5000 }); // Increased timeout for this specific assertion
      // Optionally, also check that isRefreshing eventually becomes false if that's a separate concern.
      expect(result.current.isRefreshing).toBe(false);

    });

    it('should prevent rapid successive refreshes', async () => {
      const uniqueRapidRefreshId = 'test-trip-id-rapid-refresh';
      const mockSingleRapid = vi.fn().mockResolvedValue({ data: { ...mockTripDetails, id: uniqueRapidRefreshId }, error: null });
      const mockEqRapid = vi.fn().mockReturnValue({ single: mockSingleRapid });
      (supabase.from('trip_requests').select('*').eq as vi.Mock).mockImplementation((col, val) =>
        (col === 'id' && val === uniqueRapidRefreshId) ? mockEqRapid : { single: vi.fn().mockResolvedValue({data: null, error: new Error("unexpected id")})}
      );
      mockToast.mockClear();


      const { result } = renderHook(() =>
        useTripOffers({ tripId: uniqueRapidRefreshId })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Clear mocks to isolate this test's calls
      vi.clearAllMocks();
      mockTripOffersService.fetchTripOffers.mockResolvedValue(mockOffers);

      // First refresh - wrap in act to handle state updates
      await act(async () => {
        result.current.refreshOffers();
      });
      
      // Immediate second refresh should be blocked

      result.current.refreshOffers(); // This one should trigger the toast


      // It might take a moment for the toast to be called due to async nature and debounce checks
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Please wait',
          description: 'Please wait a moment before refreshing again.',
        });
      });
    });
  });

  describe('Relaxed criteria search', () => {
    it('should handle relaxed criteria search', async () => {
      const uniqueRelaxedId = 'test-trip-id-relaxed';
      const mockSingleRelaxed = vi.fn().mockResolvedValue({ data: { ...mockTripDetails, id: uniqueRelaxedId, min_duration: 3, max_duration: 7 }, error: null });
      const mockEqRelaxed = vi.fn().mockReturnValue({ single: mockSingleRelaxed });
      const mockSelectRelaxed = vi.fn().mockReturnValue({ eq: mockEqRelaxed });
      (supabase.from as vi.Mock).mockImplementation((table: string) => {
        if (table === 'trip_requests') return { select: mockSelectRelaxed };
        return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), single: vi.fn().mockResolvedValue({data: null, error: new Error("unexpected table")})};
      });
      (invokeFlightSearch as vi.Mock).mockResolvedValue(mockFlightSearchResponse);
      mockTripOffersService.fetchTripOffers.mockResolvedValue(mockOffers);
      mockToast.mockClear();

      const { result } = renderHook(() =>
        useTripOffers({ tripId: uniqueRelaxedId })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Clear previous calls from initial load
      (invokeFlightSearch as vi.Mock).mockClear();
      mockTripOffersService.fetchTripOffers.mockClear();
      mockTripOffersService.fetchTripOffers.mockResolvedValue(mockOffers);
      (invokeFlightSearch as vi.Mock).mockResolvedValue(mockFlightSearchResponse);


      // Trigger relaxed criteria search
      result.current.handleRelaxCriteria();

      await waitFor(() => {
        expect(result.current.usedRelaxedCriteria).toBe(true);
      });

      expect(invokeFlightSearch).toHaveBeenCalledWith({
        tripRequestId: uniqueRelaxedId,
        relaxedCriteria: true,
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Search with relaxed criteria',
        description: 'Finding flights with more flexible duration and budget constraints.',
      });
    });
  });

  describe('Caching', () => {
    // Note: Caching tests can be tricky due to shared module-level cache.
    // Ensure this test runs in a context where cache state is predictable,
    // or clear the cache explicitly if possible (requires exporting cache or a clear function).
    it('should use cached results for repeated requests', async () => {
      const cachedTripId = 'test-trip-id-cache';
      const mockSingleCache = vi.fn().mockResolvedValue({ data: { ...mockTripDetails, id: cachedTripId, min_duration: 3, max_duration: 7 }, error: null });
      const mockEqCache = vi.fn().mockReturnValue({ single: mockSingleCache });
      const mockSelectCache = vi.fn().mockReturnValue({ eq: mockEqCache });
      (supabase.from as vi.Mock).mockImplementation((table: string) => {
        if (table === 'trip_requests') return { select: mockSelectCache };
        return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), single: vi.fn().mockResolvedValue({data: null, error: new Error("unexpected table")})};
      });
      (invokeFlightSearch as vi.Mock).mockResolvedValue(mockFlightSearchResponse);
      mockTripOffersService.fetchTripOffers.mockResolvedValue(mockOffers);

      // First render
      const { result: result1, unmount } = renderHook(() =>
        useTripOffers({ tripId: cachedTripId })
      );

      await waitFor(() => {
        expect(result1.current.isLoading).toBe(false);
      }, { timeout: 2000 }); // Increased timeout for initial load

      const firstCallCount = (invokeFlightSearch as vi.Mock).mock.calls.length;
      expect(firstCallCount).toBeGreaterThan(0);
      unmount();

      // Second render with same tripId should use cache
      // No need to re-mock supabase for the second call if it's a cache hit for tripDetails too.
      // The hook also caches tripDetailsState if fetched from DB.
      const { result: result2 } = renderHook(() =>
        useTripOffers({ tripId: cachedTripId })
      );

      await waitFor(() => {
        expect(result2.current.isLoading).toBe(false);
      }, { timeout: 2000 });


      // Should not have made additional API calls for flight search
      expect((invokeFlightSearch as vi.Mock).mock.calls.length).toBe(firstCallCount);
      expect(result2.current.offers).toHaveLength(1);
    });
  });

  describe('Duration validation', () => {
    it('should filter out offers with invalid dates', async () => {
      const offersWithInvalidDates = [
        ...mockOffers,
        {
          id: 'offer-3',
          trip_request_id: 'test-trip-id',
          price: 600,
          airline: 'Invalid Airlines',
          flight_number: 'IA789',
          departure_date: 'invalid-date',
          departure_time: '10:00',
          return_date: 'also-invalid',
          return_time: '15:00',
          duration: 'unknown',
          carrier_code: 'IA',
          origin_airport: 'JFK',
          destination_airport: 'LAX',
        },
      ];

      mockTripOffersService.fetchTripOffers.mockResolvedValue(offersWithInvalidDates);

      const { result } = renderHook(() =>
        useTripOffers({ tripId: 'test-trip-id' })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should only include valid offers that also match duration
      expect(result.current.offers).toHaveLength(1);
      expect(result.current.offers[0].id).toBe('offer-1');
    });

    it('should show appropriate message when no offers match duration', async () => {
      // Mock offers that don't match duration criteria
      const offersOutsideDuration = [
        {
          ...mockOffers[1], // 10 days duration
        },
      ];

      // Clear all mocks to ensure we get a fresh start
      vi.clearAllMocks();
      mockTripOffersService.fetchTripOffers.mockResolvedValue(offersOutsideDuration);
      (invokeFlightSearch as vi.Mock).mockResolvedValue(mockFlightSearchResponse);

      const { result } = renderHook(() =>
        useTripOffers({ tripId: 'test-trip-id-new' })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.offers).toHaveLength(0);
      expect(mockToast).toHaveBeenCalledWith({
        title: 'No offers match duration',
        description: 'Found 1 offers, but none match your 3-7 day duration. Consider searching any duration.',
        variant: 'destructive',
      });
    });
  });

  describe('No offers scenarios', () => {
    it('should handle when no offers are found', async () => {
      // Clear mocks and setup for empty offers
      vi.clearAllMocks();
      mockTripOffersService.fetchTripOffers.mockResolvedValue([]);
      (invokeFlightSearch as vi.Mock).mockResolvedValue(mockFlightSearchResponse);

      const { result } = renderHook(() =>
        useTripOffers({ tripId: 'test-trip-id-empty' })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.offers).toHaveLength(0);
      expect(mockToast).toHaveBeenCalledWith({
        title: 'No flight offers found',
        description: 'Try relaxing your search criteria or refreshing.',
        variant: 'destructive',
      });
    });
  });
});

