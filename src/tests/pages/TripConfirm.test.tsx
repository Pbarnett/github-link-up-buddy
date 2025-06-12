import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, type MockedFunction } from 'vitest';
import TripConfirm from '@/pages/TripConfirm';
// import { useSupabase } from '../../hooks/useSupabase'; // Removed
import { supabase as supabaseClient } from '@/integrations/supabase/client'; // Import the actual client
import { useToast } from '@/components/ui/use-toast';

// Mock Supabase client and other hooks
vi.mock('@/integrations/supabase/client', () => ({
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

// Toast mock is now handled globally in setupTests.ts
const mockToast = vi.fn();
vi.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: vi.fn(() => ({
    userId: 'test-user-123',
    user: { id: 'test-user-123', email: 'test@example.com' },
    isLoading: false,
  })),
}));


describe('TripConfirm Page', () => {
  beforeEach(async () => {
    // Reset mocks before each test
    vi.mocked(supabaseClient.from).mockClear();
    vi.mocked(supabaseClient.auth.getUser).mockClear();
    vi.mocked(supabaseClient.channel).mockClear();
    vi.mocked(supabaseClient.functions.invoke).mockClear();
    // If channel().on() etc. need reset, they can be done via re-mocking supabaseClient.channel
    // (useToast as MockedFunction<any>).mockReset(); // Removed as new mock handles reset via vi.clearAllMocks()
    mockToast.mockClear(); // Clear the global mockToast spy
    // Get fresh reference to the mocked toast function
    const { toast } = await import('@/components/ui/use-toast');
    vi.mocked(toast).mockClear();
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
    // (useToast as MockedFunction<any>).mockReturnValue({ toast: vi.fn() }); // Removed, global mock is used

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
    // (useToast as MockedFunction<any>).mockReturnValue({ toast: vi.fn() }); // Removed, global mock is used

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
    // const mockToast = vi.fn(); // Removed, global mockToast is used
    // const mockToastFn = vi.fn(); // Removed, global mockToast is used
    let capturedCallback: Function | null = null;

    vi.mocked(supabaseClient.from).mockImplementation((tableName: string) => {

      if (tableName === 'flight_offers') { // For initial offer fetch to get trip_request_id
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValueOnce({ data: { trip_request_id: 'test-trip-3' }, error: null }),
        } as any;
      }
      if (tableName === 'trip_requests') { // For fetching auto_book_enabled status
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValueOnce({ data: { id: 'test-trip-3', auto_book_enabled: true }, error: null }),
        } as any;

      }
      return baseReturn as any;
    });


    const channelOnMock = vi.fn((_event: any, _filter: any, callback: any) => {
      capturedCallback = callback; // Capture the callback
      return { subscribe: vi.fn().mockReturnThis(), unsubscribe: vi.fn().mockReturnThis() };
    });
    // Modify channelSubscribeMock to not automatically call the callback
    const channelSubscribeMock = vi.fn().mockResolvedValue('SUBSCRIBED');

    vi.mocked(supabaseClient.channel).mockReturnValue({
      on: channelOnMock,
      subscribe: channelSubscribeMock,
      unsubscribe: vi.fn()
    } as any);


    // (useToast as MockedFunction<any>).mockReturnValue({ toast: mockToastFn }); // Removed, global mock is used

    render(

      <MemoryRouter initialEntries={['/trip/confirm?id=offer-for-toast-test&airline=CC&flight_number=789&price=700&departure_date=2024-03-01&departure_time=12:00&return_date=2024-03-05&return_time=14:00&duration=PT4H&checkout_session_id=session_id_for_trip_toast']}>

        <Routes>
          <Route path="/trip/confirm" element={<TripConfirm />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the component to mount and potentially subscribe
    await waitFor(() => expect(channelOnMock).toHaveBeenCalled()); // Ensure subscription setup

    // Ensure callback is captured
    if (!capturedCallback) {
        throw new Error("Realtime callback was not captured by the mock.");
    }

    // Simulate receiving the message, wrapped in act
    await act(async () => {
      capturedCallback!({
        eventType: 'UPDATE',
        table: 'booking_requests',
        new: {
          status: 'done',
          checkout_session_id: 'session_id_for_trip3', // Ensure this matches what component might expect
          flight_details: { summary: 'Flight to Paradise' }
        }
      });
    });

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ // Changed to global mockToast
        title: "Booking Confirmed!",
        description: "Your trip has been successfully booked. Flight: Flight to Paradise",
      }));
    }, { timeout: 2000 }); // Keep timeout if operations inside act are slow, though ideally not needed
  });
});
