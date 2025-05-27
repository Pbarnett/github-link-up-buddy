import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import TripConfirm from "@/pages/TripConfirm";
import { OfferProps } from "@/components/trip/TripOfferCard";

// Mock supabase client
const mockInvoke = vi.fn();
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: {
      invoke: mockInvoke,
    },
    channel: vi.fn(() => ({
      on: vi.fn(() => ({
        subscribe: vi.fn(() => ({
          unsubscribe: vi.fn(),
        })),
      })),
      unsubscribe: vi.fn(),
    })),
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: { status: 'pending_booking' }, error: null }), // Default mock for fetchBookingRequest
        })),
      })),
    })),
  },
}));

// Mock useCurrentUser hook
const mockUseCurrentUser = vi.fn();
vi.mock("@/hooks/useCurrentUser", () => ({
  useCurrentUser: mockUseCurrentUser,
}));

// Mock toast
const mockToast = vi.fn();
vi.mock("@/components/ui/use-toast", () => ({
  toast: mockToast,
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const originalModule = await vi.importActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ // Default mock for useLocation
      search: "",
      pathname: "/trip/confirm", 
    }),
  };
});


// Helper to render with Router context
const renderWithRouter = (ui: React.ReactElement, { route = '/', path = '/', search = '' } = {}) => {
  window.history.pushState({}, 'Test page', `${route}${search}`);
  return render(
    <MemoryRouter initialEntries={[`${route}${search}`]}>
      <Routes>
        <Route path={path} element={ui} />
      </Routes>
    </MemoryRouter>
  );
};


describe("TripConfirm Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCurrentUser.mockReturnValue({
      user: { id: "test-user-id", email: "test@example.com" },
      userId: "test-user-id",
      loading: false,
    });
    
    // Default window.location.href mock
    Object.defineProperty(window, 'location', {
      value: {
        href: '',
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers(); // Ensure timers are reset after each test
  });

  describe("onConfirm flow", () => {
    const mockOffer: OfferProps = {
      id: "offer-123",
      airline: "Test Airline",
      flight_number: "TA123",
      price: 250,
      departure_date: "2024-08-15",
      departure_time: "10:00",
      return_date: "2024-08-22",
      return_time: "14:00",
      duration: "5h",
    };

    const offerSearchParams = new URLSearchParams({
      id: mockOffer.id,
      airline: mockOffer.airline,
      flight_number: mockOffer.flight_number,
      price: mockOffer.price.toString(),
      departure_date: mockOffer.departure_date,
      departure_time: mockOffer.departure_time,
      return_date: mockOffer.return_date,
      return_time: mockOffer.return_time,
      duration: mockOffer.duration,
    }).toString();

    it("should handle flight confirmation, call create-booking-request, and redirect", async () => {
      mockInvoke.mockResolvedValueOnce({ data: { url: 'https://checkout.stripe.com/test-session' }, error: null });

      renderWithRouter(<TripConfirm />, { route: '/trip/confirm', path: '/trip/confirm', search: `?${offerSearchParams}` });
      
      // Check if offer details are displayed
      expect(await screen.findByText("Test Airline")).toBeInTheDocument();
      expect(screen.getByText("TA123")).toBeInTheDocument();
      expect(screen.getByText("$250")).toBeInTheDocument();

      const confirmButton = screen.getByRole("button", { name: /Pay & Book/i });
      fireEvent.click(confirmButton);

      expect(await screen.findByText(/Processing…/i)).toBeInTheDocument();

      expect(mockInvoke).toHaveBeenCalledWith("create-booking-request", {
        body: {
          userId: "test-user-id",
          offerId: mockOffer.id,
          bookingRequestId: mockOffer.id, // As per component logic using searchParams.get("id")
        },
      });
      
      // Check if window.location.href was set
      // Need to wait for the async operations within onConfirm to complete
      await waitFor(() => {
        expect(window.location.href).toBe('https://checkout.stripe.com/test-session');
      });
    });

    it("should display error toast if create-booking-request fails", async () => {
      mockInvoke.mockResolvedValueOnce({ data: null, error: { message: "Network Error" } });
      
      renderWithRouter(<TripConfirm />, { route: '/trip/confirm', path: '/trip/confirm', search: `?${offerSearchParams}` });

      expect(await screen.findByText("Test Airline")).toBeInTheDocument();
      const confirmButton = screen.getByRole("button", { name: /Pay & Book/i });
      fireEvent.click(confirmButton);

      expect(await screen.findByText(/Processing…/i)).toBeInTheDocument();
      
      await waitFor(()_ => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Booking Failed",
          description: "Network Error",
          variant: "destructive",
        });
      });
      expect(screen.getByRole("button", { name: /Pay & Book/i })).not.toBeDisabled(); // Button should be re-enabled
    });


    it("should display error toast if user is not logged in", async () => {
      mockUseCurrentUser.mockReturnValueOnce({ user: null, userId: null, loading: false });
      
      renderWithRouter(<TripConfirm />, { route: '/trip/confirm', path: '/trip/confirm', search: `?${offerSearchParams}` });

      expect(await screen.findByText("Test Airline")).toBeInTheDocument();
      const confirmButton = screen.getByRole("button", { name: /Pay & Book/i });
      fireEvent.click(confirmButton);
      
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Authentication Error",
          description: "You must be logged in to book a flight.",
          variant: "destructive",
        });
      });
    });
  });

  describe("session_id effect (booking status updates)", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.runOnlyPendingTimers();
      vi.useRealTimers();
    });

    it("handles successful booking process and redirects to dashboard", async () => {
      const sessionId = "test-session-123";
      // Mock for initial fetchBookingRequest
      const mockSingle = vi.fn().mockResolvedValue({ data: { status: 'pending_booking' }, error: null });
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
      const mockFrom = vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ eq: mockEq }) });
      
      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      // Mock for process-booking function
      mockInvoke.mockResolvedValueOnce({ data: { success: true }, error: null }); // For process-booking

      renderWithRouter(<TripConfirm />, { route: '/trip/confirm', path: '/trip/confirm', search: `?session_id=${sessionId}` });
      
      // Initial status from useEffect before process-booking or realtime
      expect(await screen.findByText("Processing payment...")).toBeInTheDocument();
      
      // Wait for process-booking to be called and UI to update
      // The invokeProcessBooking also sets status.
      await waitFor(() => {
         expect(mockInvoke).toHaveBeenCalledWith("process-booking", {
           body: { sessionId },
         });
      });

      // As per current component logic, process-booking success optimistically sets status to "done"
      // and shows a success toast immediately.
      await waitFor(() => {
        expect(screen.getByText("✅ Your flight is booked!")).toBeInTheDocument();
      });
      
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Booking Confirmed!",
        variant: "default",
      }));

      // Advance timers to trigger navigation
      vi.advanceTimersByTime(3000);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
      });
    });

    it("handles failed booking process and displays error message", async () => {
      const sessionId = "test-session-error-456";
      const mockSingle = vi.fn().mockResolvedValue({ data: { status: 'pending_booking' }, error: null });
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
      const mockFrom = vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ eq: mockEq }) });
      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      // Mock for process-booking function to simulate failure
      mockInvoke.mockResolvedValueOnce({ data: null, error: { message: "Booking processing failed" } });

      renderWithRouter(<TripConfirm />, { route: '/trip/confirm', path: '/trip/confirm', search: `?session_id=${sessionId}` });

      expect(await screen.findByText("Processing payment...")).toBeInTheDocument(); // Initial state

      await waitFor(() => {
        expect(mockInvoke).toHaveBeenCalledWith("process-booking", {
          body: { sessionId },
        });
      });
      
      await waitFor(() => {
        // Status becomes "failed" due to error in process-booking
        expect(screen.getByText("❌ Booking failed")).toBeInTheDocument();
      });
      
      expect(await screen.findByText(/Booking processing failed/i)).toBeInTheDocument(); // Error message displayed on card

      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Booking Finalization Error",
        description: "Booking processing failed",
        variant: "destructive",
      }));
      
      // Ensure no navigation occurs on failure
      vi.advanceTimersByTime(3000);
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    // Test for realtime update (more complex to perfectly isolate from process-booking, but can test the handler)
    // This test will focus on the realtime callback if process-booking was, for instance, delayed or handled separately.
    it("updates booking status via realtime subscription", async () => {
      const sessionId = "test-session-realtime-789";
      let realtimeCallback: ((payload: any) => void) | null = null;

      const mockSubscribe = vi.fn(() => ({ unsubscribe: vi.fn() }));
      const mockOn = vi.fn((event, options, callback) => {
        if (event === 'postgres_changes' && options.table === 'booking_requests') {
          realtimeCallback = callback;
        }
        return { subscribe: mockSubscribe };
      });
      const mockChannel = vi.fn(() => ({ on: mockOn, unsubscribe: vi.fn() }));
      
      vi.mocked(supabase.channel).mockImplementation(mockChannel);
      
      // Mock process-booking to be pending to not interfere immediately
      mockInvoke.mockImplementation(async (functionName) => {
        if (functionName === "process-booking") {
          return new Promise(() => {}); // Keep it pending
        }
        return { data: null, error: null };
      });
      
      // Mock initial fetch to show some status
      const mockSingle = vi.fn().mockResolvedValue({ data: { status: 'processing' }, error: null });
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
      const mockFrom = vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ eq: mockEq }) });
      vi.mocked(supabase.from).mockImplementation(mockFrom as any);


      renderWithRouter(<TripConfirm />, { route: '/trip/confirm', path: '/trip/confirm', search: `?session_id=${sessionId}` });

      expect(await screen.findByText("Processing payment...")).toBeInTheDocument(); // Initial state before process-booking
      
      // Wait for channel subscription setup
      await waitFor(() => {
        expect(supabase.channel).toHaveBeenCalledWith(`checkout:${sessionId}`);
        expect(mockOn).toHaveBeenCalled();
      });

      // Simulate a realtime update
      expect(realtimeCallback).not.toBeNull();
      if (realtimeCallback) {
        act(() => { // Ensure updates are wrapped in act
          realtimeCallback({
            new: { status: 'done' },
            table: 'booking_requests',
            schema: 'public',
            event: 'UPDATE',
          });
        });
      }
      
      await waitFor(() => {
        expect(screen.getByText("✅ Your flight is booked!")).toBeInTheDocument();
      });

      // Advance timers to trigger navigation
      vi.advanceTimersByTime(3000);
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
      });
    });
  });
});
