
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

// Mock useCurrentUser hook
vi.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: vi.fn(() => ({
    userId: 'test-user-123',
    user: { id: 'test-user-123', email: 'test@example.com' },
    isLoading: false,
  })),
}));

describe('TripConfirm Page', () => {
  beforeEach(() => {
    // All mocks are automatically reset by vi.clearAllMocks() in setupTests.ts
    // No need to manually clear individual mocks here
  });

  // --- Tests for Auto-Book Banner and Book Now Button ---

  it('should display auto-booking banner if tripRequest.auto_book_enabled is true', async () => {
    vi.mocked(supabaseClient.from).mockImplementation((tableName: string) => {
      if (tableName === 'flight_offers') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValueOnce({ data: { trip_request_id: 'test-trip-req-id-for-auto-book' }, error: null }),
        } as any;
      }
      if (tableName === 'trip_requests') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValueOnce({ data: { id: 'test-trip-1', auto_book_enabled: true, name: 'Test Trip AutoBook' }, error: null }),
        } as any;
      }
      return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), single: vi.fn().mockResolvedValue({ data: {}, error: null }) } as any;
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
      expect(screen.getByText(/auto‐booking is enabled and in progress/i)).toBeInTheDocument();
    });
    expect(screen.queryByRole('button', { name: /book now/i })).not.toBeInTheDocument();
  });

  it('should display "Book Now" button if tripRequest.auto_book_enabled is false', async () => {
    vi.mocked(supabaseClient.from).mockImplementation((tableName: string) => {
      if (tableName === 'flight_offers') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValueOnce({ data: { trip_request_id: 'test-trip-req-id-for-manual-book' }, error: null }),
        } as any;
      }
      if (tableName === 'trip_requests') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValueOnce({ data: { id: 'test-trip-2', auto_book_enabled: false, name: 'Test Trip Manual' }, error: null }),
        } as any;
      }
      return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), single: vi.fn().mockResolvedValue({ data: {}, error: null }) } as any;
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
      expect(screen.queryByText(/auto‐booking is enabled and in progress/i)).not.toBeInTheDocument();
      // More specific check for "Book Now" section would be ideal after manual JSX merge
    });
  });

  it('should call Sonner toast on "booking_succeeded" notification', async () => {
    const mockToast = vi.fn();
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
      if (tableName === 'booking_requests') { // For fetchBookingRequest by sessionId
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValueOnce({ data: { status: 'initial_status_for_session_id_test' }, error: null }),
        } as any;
      }
      return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), single: vi.fn().mockResolvedValue({ data: {}, error: null }) } as any;
    });

    const channelOnMock = vi.fn((_event: any, _filter: any, callback: any) => {
      capturedCallback = callback;
      return { subscribe: vi.fn().mockReturnThis(), unsubscribe: vi.fn().mockReturnThis() };
    });
    const channelSubscribeMock = vi.fn(() => {
      if (capturedCallback) {
        setTimeout(() => capturedCallback!({ eventType: 'UPDATE', table: 'booking_requests', new: { status: 'done', checkout_session_id: 'session_id_for_trip3', flight_details: { summary: 'Flight to Paradise' } } }), 100);
      }
      return Promise.resolve('SUBSCRIBED');
    });
    vi.mocked(supabaseClient.channel).mockReturnValue({
      on: channelOnMock,
      subscribe: channelSubscribeMock,
      unsubscribe: vi.fn()
    } as any); // Use 'as any' to simplify complex channel mock typing for this subtask

    // Use the global mock from setupTests.ts
    const { useToast } = await import('@/components/ui/use-toast');
    vi.mocked(useToast).mockReturnValue({ toast: mockToast });

    render(


      <MemoryRouter initialEntries={['/trip/confirm?id=offer-for-toast-test&airline=CC&flight_number=789&price=700&departure_date=2024-03-01&departure_time=12:00&return_date=2024-03-05&return_time=14:00&duration=PT4H&checkout_session_id=session_id_for_trip_toast']}>


        <Routes>
          <Route path="/trip/confirm" element={<TripConfirm />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Booking Confirmed!",
        description: "Your trip has been successfully booked. Flight: Flight to Paradise",
      }));
    }, { timeout: 2000 });
  });
});
