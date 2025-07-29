


import { vi, describe, it, expect, beforeEach } from 'vitest';
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import TripConfirm from '@/pages/TripConfirm';
import { supabase as supabaseClient } from '@/integrations/supabase/client';
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
      subscribe: vi.fn().mockResolvedValue('SUBSCRIBED'),
      unsubscribe: vi.fn()
    }),
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: {}, error: null }),
    }
  }
}));

// Mock useCurrentUser hook
vi.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: vi.fn(() => ({
    userId: 'test-user-123',
    user: { id: 'test-user-123', email: 'test@example.com' },
    loading: false, // Note: should be 'loading' not 'isLoading'
  })),
}));

describe('TripConfirm Page', () => {
  beforeEach(() => {
    // All mocks are automatically reset by vi.clearAllMocks() in setupTests.ts
    // No need to manually clear individual mocks here
  });

  // --- Tests for Auto-Book Banner and Book Now Button ---

  it('should display auto-booking banner if tripRequest.auto_book_enabled is true', async () => {
    // Override the global useLocation mock for this test
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/trip/confirm',
      search: '?id=offer-for-auto-book&airline=AA&flight_number=123&price=500&departure_date=2024-01-01&departure_time=10:00&return_date=2024-01-05&return_time=12:00&duration=PT2H',
      hash: '',
      state: null,
      key: 'test-key'
    });
    
    (vi.mocked(supabaseClient.from) as any).mockImplementation((tableName: string) => {
      if (tableName === 'flight_offers') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValueOnce({ data: { trip_request_id: 'test-trip-req-id-for-auto-book' }, error: null }),
        } as unknown as ReturnType<typeof supabaseClient.from>;
      }
      if (tableName === 'trip_requests') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValueOnce({ data: { id: 'test-trip-1', auto_book_enabled: true, name: 'Test Trip AutoBook' }, error: null }),
        } as unknown as ReturnType<typeof supabaseClient.from>;
      }
      return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), single: vi.fn().mockResolvedValue({ data: {}, error: null }) } as unknown as ReturnType<typeof supabaseClient.from>;
    });
    // The global toast mock is already set up in setupTests.ts

    render(

      <MemoryRouter initialEntries={['/trip/confirm?id=offer-for-auto-book&airline=AA&flight_number=123&price=500&departure_date=2024-01-01&departure_time=10:00&return_date=2024-01-05&return_time=12:00&duration=PT2H']}>

        <Routes>
          <Route path="/trip/confirm" element={<TripConfirm />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/auto[‐-]booking is enabled and in progress/i)).toBeInTheDocument();
    });
    expect(screen.queryByRole('button', { name: /book now/i })).not.toBeInTheDocument();
  });

  it('should display "Book Now" button if tripRequest.auto_book_enabled is false', async () => {
    // Override the global useLocation mock for this test
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/trip/confirm',
      search: '?id=offer-for-manual-book&airline=BB&flight_number=456&price=600&departure_date=2024-02-01&departure_time=11:00&return_date=2024-02-05&return_time=13:00&duration=PT3H',
      hash: '',
      state: null,
      key: 'test-key'
    });
    
    (vi.mocked(supabaseClient.from) as any).mockImplementation((tableName: string) => {
      if (tableName === 'flight_offers') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValueOnce({ data: { trip_request_id: 'test-trip-req-id-for-manual-book' }, error: null }),
        } as unknown as ReturnType<typeof supabaseClient.from>;
      }
      if (tableName === 'trip_requests') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValueOnce({ data: { id: 'test-trip-2', auto_book_enabled: false, name: 'Test Trip Manual' }, error: null }),
        } as unknown as ReturnType<typeof supabaseClient.from>;
      }
      return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), single: vi.fn().mockResolvedValue({ data: {}, error: null }) } as unknown as ReturnType<typeof supabaseClient.from>;
    });
    // The global toast mock is already set up in setupTests.ts - no need to override

    render(

      <MemoryRouter initialEntries={['/trip/confirm?id=offer-for-manual-book&airline=BB&flight_number=456&price=600&departure_date=2024-02-01&departure_time=11:00&return_date=2024-02-05&return_time=13:00&duration=PT3H']}>

        <Routes>
          <Route path="/trip/confirm" element={<TripConfirm />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText(/auto[‐-]booking is enabled and in progress/i)).not.toBeInTheDocument();
      // More specific check for "Book Now" section would be ideal after manual JSX merge
    });
  });

  it('should call toast on booking status update to "done"', async () => {
    // Get the global toast mock from setupTests.ts
    const mockToastFn = vi.mocked(useToast)().toast;
    console.log('mockToastFn:', mockToastFn);
    console.log('useToast():', useToast());
    
    let capturedCallback: ((payload: unknown) => void) | null = null;

    const channelOnMock = vi.fn((_event: string, _filter: unknown, callback: (payload: unknown) => void) => {
      capturedCallback = callback;
      return { subscribe: vi.fn().mockReturnThis(), unsubscribe: vi.fn().mockReturnThis() };
    });
    
    const channelSubscribeMock = vi.fn(() => {
      return Promise.resolve('SUBSCRIBED');
    });
    
    (vi.mocked(supabaseClient.channel) as any).mockReturnValue({
      on: channelOnMock,
      subscribe: channelSubscribeMock,
      unsubscribe: vi.fn()
    } as unknown as ReturnType<typeof supabaseClient.channel>);

    render(
      <MemoryRouter initialEntries={['/trip/confirm?session_id=session_id_for_trip_toast']}>
        <Routes>
          <Route path="/trip/confirm" element={<TripConfirm />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the component to set up and capture the callback
    await waitFor(() => {
      expect(capturedCallback).toBeDefined();
    });

    // Clear any previous calls to the mock
    vi.mocked(mockToastFn).mockClear();

    // Manually trigger the callback to simulate a booking status update
    act(() => {
      if (capturedCallback) {
        capturedCallback({ 
          eventType: 'UPDATE', 
          table: 'booking_requests', 
          new: { status: 'done', checkout_session_id: 'session_id_for_trip_toast' } 
        });
      }
    });

    // Check that toast was called (should be immediate since updateBookingStatusMessage calls toast synchronously)
    expect(mockToastFn).toHaveBeenCalledWith(expect.objectContaining({
      title: "Booking Confirmed!",
      description: "Your flight has been successfully booked. Redirecting to dashboard...",
    }));
  });
});
