import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Dashboard from '../../pages/Dashboard';
// import { useSupabase } from '../../hooks/useSupabase'; // Removed
import { supabase as supabaseClient } from '../../integrations/supabase/client'; // Import the actual client for mocking
import { useToast } from '../../components/ui/use-toast';

// Mock Supabase client and other hooks
vi.mock('../../integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-test-123' } }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(), // Ensure subscribe is mockable
      unsubscribe: vi.fn()
    }),
    removeChannel: vi.fn(), // Added removeChannel mock
    // Default 'from' mock that supports limit, specific tests will override implementation as needed
    from: vi.fn().mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({ data: [], error: null }) // Default .limit() behavior
    })),
  }
}));
vi.mock('../../hooks/useCurrentUser', () => ({
  useCurrentUser: vi.fn(() => ({
    userId: 'test-user-id-123',
    user: { id: 'test-user-id-123', email: 'test@example.com' },
    isLoading: false,
  })),
}));
vi.mock('../../components/ui/use-toast');
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: vi.fn(), // Mock useNavigate
  };
});

describe('Dashboard Page', () => {
  beforeEach(async () => {
    // Reset mocks before each test
    vi.mocked(supabaseClient.from).mockClear();
    vi.mocked(supabaseClient.auth.getUser).mockClear();
    vi.mocked(supabaseClient.auth.onAuthStateChange).mockClear();
    vi.mocked(supabaseClient.removeChannel).mockClear(); // Clear new mock
    (useNavigate as jest.Mock).mockReset();
    (useToast as jest.Mock).mockReset();
    // Reset useCurrentUser if needed, or refine its mock per test-suite
    const { useCurrentUser } = vi.mocked(await import('../../hooks/useCurrentUser'));
    useCurrentUser.mockReturnValue({
        userId: 'test-user-id-123',
        user: { id: 'test-user-id-123', email: 'test@example.com' },
        isLoading: false
    });
  });
  // Placeholder for existing tests or new tests will be added below

  // --- Tests for Trip History ---
  describe('Trip History section', () => {
    const mockNavigate = vi.fn();
    // Default mockCurrentUser is provided by the global mock, can be overridden in tests if needed
    const mockCurrentUser = { id: 'user-test-123' }; // This variable is not actually used, useCurrentUser mock below is what matters
    const mockTrips = [
      { id: 'trip-1', destination_airport: 'JFK', earliest_departure: '2024-08-01', latest_departure: '2024-08-05', auto_book_enabled: true, booking_status: 'Booked', created_at: '2024-07-01T10:00:00Z' },
      { id: 'trip-2', destination_airport: 'LAX', earliest_departure: '2024-09-10', latest_departure: '2024-09-15', auto_book_enabled: false, booking_status: 'Pending', created_at: '2024-07-02T10:00:00Z' },
    ];

    beforeEach(async () => { // Made this async
      // vi.clearAllMocks(); // This is broad; specific resets are in the main describe's beforeEach
      (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
      // Ensure useCurrentUser is reset to a default for this suite if needed, or rely on the global mock
      const { useCurrentUser } = vi.mocked(await import('../../hooks/useCurrentUser'));
      useCurrentUser.mockReturnValue({
          userId: 'user-test-123',
          user: { id: 'user-test-123', email: 'test@example.com' },
          isLoading: false
      });
    });

    it('should fetch and display trip history for the current user', async () => {
      // Configure the mock for supabase.from() for this test
      vi.mocked(supabaseClient.from).mockImplementation((tableName: string) => {
        const eqMock = vi.fn().mockReturnThis();
        const orderMock = vi.fn().mockReturnThis();
        const limitMock = vi.fn().mockResolvedValue({ data: [], error: null }); // Default for limit

        const fromChain = {
          select: vi.fn().mockReturnThis(),
          eq: eqMock,
          order: orderMock,
          limit: limitMock,
        };

        if (tableName === 'trip_requests') {
          // This mock will be used by BOTH Dashboard's own loadTripRequests and TripHistory's fetchTripHistory
          // We need to differentiate if their return values should be different.
          // For this specific test, we want TripHistory to get mockTrips.
          // Dashboard's own "Recent Trip Requests" might also get this if not further refined.
          // Let's assume TripHistory's call is the one we are targeting with mockTrips.
          // A more advanced mock could check the select string or other query details if needed.
           vi.mocked(limitMock).mockResolvedValue({ data: mockTrips, error: null }); // For Dashboard's own recent trips (can be different)
           // For TripHistory, the mockTrips are returned by the order() call if no limit is applied
           vi.mocked(orderMock).mockResolvedValue({ data: mockTrips, error: null });
        } else if (tableName === 'booking_requests') { // Used by Dashboard directly
           vi.mocked(orderMock).mockResolvedValue({ data: [], error: null });
        }
        return fromChain as any;
      });
      (useToast as jest.Mock).mockReturnValue({ toast: vi.fn() });


      render(
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      );

      expect(await screen.findByRole('heading', { name: /my past trips/i })).toBeInTheDocument();

      for (const trip of mockTrips) {
        expect(await screen.findByText(new RegExp(trip.destination_airport, 'i'))).toBeInTheDocument();
        expect(await screen.findByText(new RegExp(new Date(trip.earliest_departure).toLocaleDateString(), 'i'))).toBeInTheDocument();
        expect(await screen.findByText(trip.auto_book_enabled ? /Enabled/i : /Disabled/i)).toBeInTheDocument();
        expect(await screen.findByText(new RegExp(trip.booking_status, 'i'))).toBeInTheDocument();
      }
    });

    it('should display "No past trips found" if history is empty', async () => {
      vi.mocked(supabaseClient.from).mockImplementation((tableName: string) => {
        const eqMock = vi.fn().mockReturnThis();
        const orderMock = vi.fn().mockReturnThis();
        const limitMock = vi.fn().mockResolvedValue({ data: [], error: null });

        const fromChain = {
          select: vi.fn().mockReturnThis(),
          eq: eqMock,
          order: orderMock,
          limit: limitMock,
        };

        if (tableName === 'trip_requests') {
          vi.mocked(limitMock).mockResolvedValue({ data: [], error: null }); // For Dashboard's own load
          vi.mocked(orderMock).mockResolvedValue({ data: [], error: null }); // For TripHistory
        } else if (tableName === 'booking_requests') {
           vi.mocked(orderMock).mockResolvedValue({ data: [], error: null });
        }
        return fromChain as any;
      });
      (useToast as jest.Mock).mockReturnValue({ toast: vi.fn() });

      render(
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      );
      expect(await screen.findByText(/no past trips found/i)).toBeInTheDocument();
    });

    it('should navigate to trip confirm page when "View Details" is clicked', async () => {
      vi.mocked(supabaseClient.from).mockImplementation((tableName: string) => {
        const eqMock = vi.fn().mockReturnThis();
        const orderMock = vi.fn().mockReturnThis();
        const limitMock = vi.fn().mockResolvedValue({ data: [], error: null });

        const fromChain = {
          select: vi.fn().mockReturnThis(),
          eq: eqMock,
          order: orderMock,
          limit: limitMock,
        };

        if (tableName === 'trip_requests') {
          vi.mocked(limitMock).mockResolvedValue({ data: [mockTrips[0]], error: null }); // For Dashboard's own load
          vi.mocked(orderMock).mockResolvedValue({ data: [mockTrips[0]], error: null }); // For TripHistory
        } else if (tableName === 'booking_requests') {
           vi.mocked(orderMock).mockResolvedValue({ data: [], error: null });
        }
        return fromChain as any;
      });
      (useToast as jest.Mock).mockReturnValue({ toast: vi.fn() });
      render(
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      );

      expect(await screen.findByText(new RegExp(mockTrips[0].destination_airport, 'i'))).toBeInTheDocument();
      const viewDetailsButtons = await screen.findAllByRole('button', { name: /view details/i });
      expect(viewDetailsButtons.length).toBeGreaterThan(0);

      fireEvent.click(viewDetailsButtons[0]);
      expect(mockNavigate).toHaveBeenCalledWith(`/trip/confirm?tripRequestId=${mockTrips[0].id}`);
    });
  });
});
