import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTripOffers, TripDetails } from '@/hooks/useTripOffers';
import * as tripOffersService from '@/services/tripOffersService';
import * as flightSearchApi from '@/services/api/flightSearchApi';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Mock the services
vi.mock('@/services/tripOffersService');
vi.mock('@/services/api/flightSearchApi');
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
const mockFlightSearchApi = flightSearchApi as any;
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
    
    // Setup default mocks
    mockTripOffersService.fetchTripOffers = vi.fn().mockResolvedValue(mockOffers);
    mockFlightSearchApi.invokeFlightSearch = vi.fn().mockResolvedValue(mockFlightSearchResponse);
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
      // Clear any previous calls to ensure we capture the right ones
      vi.clearAllMocks();
      mockTripOffersService.fetchTripOffers.mockResolvedValue(mockOffers);
      mockFlightSearchApi.invokeFlightSearch.mockResolvedValue(mockFlightSearchResponse);
      
      const { result } = renderHook(() =>
        useTripOffers({ tripId: 'test-trip-id' })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should only include offers that match duration criteria (3-7 days)
      expect(result.current.offers).toHaveLength(1);
      expect(result.current.offers[0].id).toBe('offer-1');
      expect(result.current.hasError).toBe(false);
      expect(mockFlightSearchApi.invokeFlightSearch).toHaveBeenCalled();
    });

    it('should show toast when duration filter is applied', async () => {
      const { result } = renderHook(() =>
        useTripOffers({ tripId: 'test-trip-id' })
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
      const { result } = renderHook(() =>
        useTripOffers({ tripId: 'test-trip-id' })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Override search to ignore duration filter
      result.current.handleOverrideSearch();

      await waitFor(() => {
        expect(result.current.offers).toHaveLength(2);
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Search without duration filter',
        description: 'Showing all 2 available offers regardless of trip duration.',
      });
    });
  });

  describe('Error handling', () => {
    it('should handle flight search API errors', async () => {
      const searchError = new Error('Flight search failed');
      mockFlightSearchApi.invokeFlightSearch.mockRejectedValue(searchError);
      
      // Mock empty existing offers
      mockTripOffersService.fetchTripOffers.mockResolvedValue([]);

      const { result } = renderHook(() =>
        useTripOffers({ tripId: 'test-trip-id' })
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
      mockFlightSearchApi.invokeFlightSearch.mockRejectedValue(searchError);
      
      // Mock existing offers available
      mockTripOffersService.fetchTripOffers.mockResolvedValueOnce(mockOffers);

      const { result } = renderHook(() =>
        useTripOffers({ tripId: 'test-trip-id' })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.hasError).toBe(false);
      expect(result.current.offers).toHaveLength(1); // Duration filtered
    });

    it('should handle Supabase errors when fetching trip details', async () => {
      // Override the mock to return an error
      const mockSingleError = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Trip not found' },
      });
      
      const mockEqError = vi.fn().mockReturnValue({ single: mockSingleError });
      const mockSelectError = vi.fn().mockReturnValue({ eq: mockEqError });
      (supabase.from as any).mockReturnValue({ select: mockSelectError });

      const { result } = renderHook(() =>
        useTripOffers({ tripId: 'test-trip-id' })
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
      const { result } = renderHook(() =>
        useTripOffers({ tripId: 'test-trip-id' })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Clear previous calls
      vi.clearAllMocks();
      mockTripOffersService.fetchTripOffers.mockResolvedValue(mockOffers);

      // Trigger refresh
      result.current.refreshOffers();

      await waitFor(() => {
        expect(result.current.isRefreshing).toBe(false);
      });

      expect(mockFlightSearchApi.invokeFlightSearch).toHaveBeenCalledWith({
        tripRequestId: 'test-trip-id',
        relaxedCriteria: false,
      });
    });

    it('should prevent rapid successive refreshes', async () => {
      const { result } = renderHook(() =>
        useTripOffers({ tripId: 'test-trip-id' })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // First refresh
      result.current.refreshOffers();
      
      // Immediate second refresh should be blocked
      result.current.refreshOffers();

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Please wait',
        description: 'Please wait a moment before refreshing again.',
      });
    });
  });

  describe('Relaxed criteria search', () => {
    it('should handle relaxed criteria search', async () => {
      const { result } = renderHook(() =>
        useTripOffers({ tripId: 'test-trip-id' })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Clear previous calls
      vi.clearAllMocks();
      mockTripOffersService.fetchTripOffers.mockResolvedValue(mockOffers);

      // Trigger relaxed criteria search
      result.current.handleRelaxCriteria();

      await waitFor(() => {
        expect(result.current.usedRelaxedCriteria).toBe(true);
      });

      expect(mockFlightSearchApi.invokeFlightSearch).toHaveBeenCalledWith({
        tripRequestId: 'test-trip-id',
        relaxedCriteria: true,
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Search with relaxed criteria',
        description: 'Finding flights with more flexible duration and budget constraints.',
      });
    });
  });

  describe('Caching', () => {
    it('should use cached results for repeated requests', async () => {
      // First render
      const { result: result1, unmount } = renderHook(() =>
        useTripOffers({ tripId: 'test-trip-id' })
      );

      await waitFor(() => {
        expect(result1.current.isLoading).toBe(false);
      });

      const firstCallCount = mockFlightSearchApi.invokeFlightSearch.mock.calls.length;
      unmount();

      // Second render with same tripId should use cache
      const { result: result2 } = renderHook(() =>
        useTripOffers({ tripId: 'test-trip-id' })
      );

      await waitFor(() => {
        expect(result2.current.isLoading).toBe(false);
      });

      // Should not have made additional API calls
      expect(mockFlightSearchApi.invokeFlightSearch.mock.calls.length).toBe(firstCallCount);
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
      mockFlightSearchApi.invokeFlightSearch.mockResolvedValue(mockFlightSearchResponse);

      const { result } = renderHook(() =>
        useTripOffers({ tripId: 'test-trip-id-new' }) // Use different tripId to avoid cache
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
      mockFlightSearchApi.invokeFlightSearch.mockResolvedValue(mockFlightSearchResponse);

      const { result } = renderHook(() =>
        useTripOffers({ tripId: 'test-trip-id-empty' }) // Use different tripId to avoid cache
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

