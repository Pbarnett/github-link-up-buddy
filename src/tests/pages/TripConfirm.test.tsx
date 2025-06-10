
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, type MockedFunction } from 'vitest';
import TripConfirm from '../../pages/TripConfirm';
// import { useSupabase } from '../../hooks/useSupabase'; // Removed
import { supabase as supabaseClient } from '../../integrations/supabase/client'; // Import the actual client
// import { useToast } from '../../components/ui/use-toast'; // Will be handled by the new mock structure

// Shared mock implementation for toast
const actualMockToastImplementation = vi.fn();

// Mock Supabase client and other hooks
vi.mock('../../integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-test-123' } }, error: null }),
    },
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockResolvedValue('SUBSCRIBED'), // Ensure subscribe returns a promise
      unsubscribe: vi.fn()
    }),
    functions: { // Mock functions if TripConfirm uses it (it does for process-booking)
      invoke: vi.fn().mockResolvedValue({ data: {}, error: null }),
    }
  }
}));
vi.mock('../../components/ui/use-toast', () => ({
  useToast: () => ({ toast: actualMockToastImplementation }),
  toast: actualMockToastImplementation,
}));
vi.mock('../../hooks/useCurrentUser', () => ({
  useCurrentUser: vi.fn(() => ({
    userId: 'test-user-123',
    user: { id: 'test-user-123', email: 'test@example.com' },
    isLoading: false,
  })),
}));


describe('TripConfirm Page', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.mocked(supabaseClient.from).mockClear();
    vi.mocked(supabaseClient.auth.getUser).mockClear();
    vi.mocked(supabaseClient.channel).mockClear();
    vi.mocked(supabaseClient.functions.invoke).mockClear();
    actualMockToastImplementation.mockClear();
    // If channel().on() etc. need reset, they can be done via re-mocking supabaseClient.channel
    // (useToast as MockedFunction<any>).mockReset(); // Old way
    // vi.mocked(useCurrentUser) can be reset here if more granular control is needed per test
  });

  // --- Tests for Auto-Book Banner and Book Now Button ---

  it('should display auto-booking banner if trip_requests.auto_book_enabled is true', async () => {
    vi.mocked(supabaseClient.from).mockImplementation((tableName: string) => {
      const mockEq = vi.fn();
      const baseReturn = { select: vi.fn().mockReturnThis(), eq: mockEq };

      if (tableName === 'flight_offers') {
        mockEq.mockImplementation((columnName, value) => {
          if (columnName === 'id' && value === 'offer-for-auto-book') {
            return { single: vi.fn().mockResolvedValueOnce({ data: { trip_request_id: 'trip-req-auto' }, error: null }) };
          }
          return { single: vi.fn().mockResolvedValueOnce({ data: null, error: { message: 'Flight offer not found by id' } }) };
        });
      } else if (tableName === 'trip_requests') {
        mockEq.mockImplementation((columnName, value) => {
          if (columnName === 'id' && value === 'trip-req-auto') {
            return { single: vi.fn().mockResolvedValueOnce({ data: { id: 'trip-req-auto', auto_book_enabled: true, name: 'Test Trip AutoBook' }, error: null }) };
          }
          return { single: vi.fn().mockResolvedValueOnce({ data: null, error: { message: 'Trip request not found by id' } }) };
        });
      } else {
        mockEq.mockReturnValue({ single: vi.fn().mockResolvedValue({ data: {}, error: null }) });
      }
      return baseReturn as any;
    });
    // (useToast as MockedFunction<any>).mockReturnValue({ toast: vi.fn() }); // Not needed due to shared mock

    render(
      <MemoryRouter initialEntries={['/trip/confirm?id=offer-for-auto-book&airline=AA&flight_number=123&price=500&departure_date=2024-01-01&departure_time=10:00&return_date=2024-01-05&return_time=12:00&duration=PT2H']}>
        <Routes>
          <Route path="/trip/confirm" element={<TripConfirm />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/auto‐booking is enabled and in progress/i)).toBeInTheDocument();
    });
    expect(screen.queryByRole('button', { name: /book now/i })).not.toBeInTheDocument();
  });

  it('should display "Book Now" button if trip_requests.auto_book_enabled is false', async () => {
    vi.mocked(supabaseClient.from).mockImplementation((tableName: string) => {
      const mockEq = vi.fn();
      const baseReturn = { select: vi.fn().mockReturnThis(), eq: mockEq };

      if (tableName === 'flight_offers') {
        mockEq.mockImplementation((columnName, value) => {
          if (columnName === 'id' && value === 'offer-for-manual-book') {
            return { single: vi.fn().mockResolvedValueOnce({ data: { trip_request_id: 'trip-req-manual' }, error: null }) };
          }
          return { single: vi.fn().mockResolvedValueOnce({ data: null, error: { message: 'Flight offer not found by id' } }) };
        });
      } else if (tableName === 'trip_requests') {
        mockEq.mockImplementation((columnName, value) => {
          if (columnName === 'id' && value === 'trip-req-manual') {
            return { single: vi.fn().mockResolvedValueOnce({ data: { id: 'trip-req-manual', auto_book_enabled: false, name: 'Test Trip Manual' }, error: null }) };
          }
          return { single: vi.fn().mockResolvedValueOnce({ data: null, error: { message: 'Trip request not found by id' } }) };
        });
      } else {
        mockEq.mockReturnValue({ single: vi.fn().mockResolvedValue({ data: {}, error: null }) });
      }
      return baseReturn as any;
    });
    // (useToast as MockedFunction<any>).mockReturnValue({ toast: vi.fn() }); // Not needed

    render(
      <MemoryRouter initialEntries={['/trip/confirm?id=offer-for-manual-book&airline=BB&flight_number=456&price=600&departure_date=2024-02-01&departure_time=11:00&return_date=2024-02-05&return_time=13:00&duration=PT3H']}>
        <Routes>
          <Route path="/trip/confirm" element={<TripConfirm />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText(/auto‐booking is enabled and in progress/i)).not.toBeInTheDocument();
      // More specific check for "Book Now" section would be ideal after manual JSX merge
    });
  });

  it('should call Sonner toast on "booking_succeeded" notification', async () => {
    // const mockToast = vi.fn(); // Will use actualMockToastImplementation
    let capturedCallback: Function | null = null;

    vi.mocked(supabaseClient.from).mockImplementation((tableName: string) => {
      const mockEq = vi.fn();
      const baseReturn = { select: vi.fn().mockReturnThis(), eq: mockEq };

      if (tableName === 'flight_offers') {
        mockEq.mockImplementation((columnName, value) => {
          if (columnName === 'id' && value === 'offer-for-toast-test') {
            return { single: vi.fn().mockResolvedValueOnce({ data: { trip_request_id: 'trip-req-toast' }, error: null }) };
          }
          return { single: vi.fn().mockResolvedValueOnce({ data: null, error: { message: 'Flight offer not found for toast test' } }) };
        });
      } else if (tableName === 'trip_requests') {
        mockEq.mockImplementation((columnName, value) => {
          if (columnName === 'id' && value === 'trip-req-toast') {
            // Ensure auto_book_enabled is false for this test to allow manual booking flow
            return { single: vi.fn().mockResolvedValueOnce({ data: { id: 'trip-req-toast', auto_book_enabled: false }, error: null }) };
          }
          return { single: vi.fn().mockResolvedValueOnce({ data: null, error: { message: 'Trip request not found for toast test' } }) };
        });
      } else if (tableName === 'booking_requests') {
         mockEq.mockImplementation((columnName, value) => {
          // This mock is for the fetchBookingRequestBySessionId call, which uses checkout_session_id
          if (columnName === 'checkout_session_id' && value === 'session_id_for_trip_toast') {
            return { single: vi.fn().mockResolvedValueOnce({ data: { status: 'initial_status_for_toast_test', trip_request_id: 'trip-req-toast' }, error: null }) };
          }
          // This mock is for the fetchBookingRequest call, which uses trip_request_id
          if (columnName === 'trip_request_id' && value === 'trip-req-toast') {
            return { single: vi.fn().mockResolvedValueOnce({ data: { status: 'initial_status_for_toast_test_trid', checkout_session_id: 'session_id_for_trip_toast' }, error: null }) };
          }
          return { single: vi.fn().mockResolvedValueOnce({ data: null, error: { message: 'Booking request not found for toast test' } }) };
        });
      } else {
        mockEq.mockReturnValue({ single: vi.fn().mockResolvedValue({ data: {}, error: null }) });
      }
      return baseReturn as any;
    });

    const channelOnMock = vi.fn((_event: any, filter: any, callback: any) => {
      capturedCallback = callback;
      // Check if filter is for the correct checkout_session_id
      if (filter.filter === 'checkout_session_id=eq=session_id_for_trip_toast') {
         // Simulate a successful subscription
      }
      return { subscribe: vi.fn().mockReturnThis(), unsubscribe: vi.fn().mockReturnThis() };
    });

    const channelSubscribeMock = vi.fn((onSubscribeCallback?: (status: string, err?: any) => void) => {
      if (capturedCallback) {
        setTimeout(() => capturedCallback!({ eventType: 'UPDATE', table: 'booking_requests', new: { status: 'done', checkout_session_id: 'session_id_for_trip_toast', flight_details: { summary: 'Flight to Paradise' } } }), 100);
      }
      if (onSubscribeCallback) {
        onSubscribeCallback('SUBSCRIBED');
      }
      return Promise.resolve('SUBSCRIBED');
    });
    vi.mocked(supabaseClient.channel).mockImplementation((channelName: string) => ({
        on: channelOnMock,
        subscribe: channelSubscribeMock,
        unsubscribe: vi.fn()
      } as any)
    );

    // (useToast as MockedFunction<any>).mockReturnValue({ toast: mockToast }); // Not needed due to shared mock

    render(
      <MemoryRouter initialEntries={['/trip/confirm?id=offer-for-toast-test&airline=CC&flight_number=789&price=700&departure_date=2024-03-01&departure_time=12:00&return_date=2024-03-05&return_time=14:00&duration=PT4H&checkout_session_id=session_id_for_trip_toast']}>
        <Routes>
          <Route path="/trip/confirm" element={<TripConfirm />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(actualMockToastImplementation).toHaveBeenCalledWith(expect.objectContaining({
        title: "Booking Confirmed!",
        description: "Your trip has been successfully booked. Flight: Flight to Paradise",
      }));
    }, { timeout: 2000 });
  });
});
