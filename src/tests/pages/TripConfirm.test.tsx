// First, test framework imports
import { describe, it, expect, vi, beforeEach, afterEach, afterAll } from "vitest";
import { render, screen, fireEvent, waitFor, act, cleanup } from "@testing-library/react";

// React Router imports
import { MemoryRouter, Routes, Route } from "react-router-dom";
import type { Location, NavigateFunction } from "react-router-dom";

// Mock implementations
const mockNavigate = vi.fn();
const mockLocation: Location = {
  pathname: '/trip/confirm',
  search: '',
  hash: '',
  state: null,
  key: 'default'
};

// React Router mock must come before any component imports
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual, // Keep actual components for proper rendering
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
  };
});

// Other dependency mocks
vi.mock("@/components/ui/use-toast", () => ({
  toast: vi.fn()
}));

// Comprehensive Supabase mock with more controlled behavior
vi.mock("@/integrations/supabase/client", () => {
  // Create mock functions with explicit implementation
  const mockInvoke = vi.fn();
  const mockSingle = vi.fn().mockResolvedValue({ data: { status: 'pending_booking' }, error: null });

  // Enhanced realtime subscription mocks
  const mockUnsubscribe = vi.fn();
  const mockSubscribe = vi.fn().mockReturnValue({ unsubscribe: mockUnsubscribe });

  // Store callback for testing realtime updates
  let realtimeCallback: Function | null = null;

  const mockOn = vi.fn((event, options, callback) => {
    // Store the callback so we can trigger it in tests
    if (event === 'postgres_changes') {
      realtimeCallback = callback;
    }
    return {
      subscribe: mockSubscribe
    };
  });

  // Make channel return a properly structured object
  const mockChannel = vi.fn(() => ({
    on: mockOn,
    unsubscribe: mockUnsubscribe
  }));

  // Make these functions available in the test scope
  globalThis.__mocks = {
    ...globalThis.__mocks || {},
    mockInvoke,
    mockSingle,
    mockSubscribe,
    mockOn,
    mockChannel,
    mockUnsubscribe,
    getRealtimeCallback: () => realtimeCallback,
    setRealtimeCallback: (cb: Function | null) => { realtimeCallback = cb; },
    // Helper to simulate realtime updates
    simulateRealtimeUpdate: (status: string) => {
      if (realtimeCallback) {
        realtimeCallback({
          new: { status },
          event: 'UPDATE',
          schema: 'public',
          table: 'booking_requests'
        });
      }
    }
  };

  return {
    supabase: {
      functions: { invoke: mockInvoke },
      channel: mockChannel,
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: mockSingle
          }))
        }))
      }))
    }
  };
});

vi.mock("@/hooks/useCurrentUser", () => ({
  useCurrentUser: vi.fn()
}));

// Component imports after all mocks
import TripConfirm from "@/pages/TripConfirm";
import { OfferProps } from "@/components/trip/TripOfferCard";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { Tables } from "@/integrations/supabase/types";

// Define known status text constants for more reliable matching
const STATUS_TEXTS = {
  PROCESSING_PAYMENT: "Processing payment...",
  FINALIZING_BOOKING: "Finalizing your booking details...",
  PAYMENT_RECEIVED: "Payment received! Booking your flight...",
  BOOKING_FLIGHT: "Finalizing your booking...",
  FLIGHT_BOOKED: "Your flight is booked!",
  BOOKING_FAILED: "Booking failed",
  ERROR: "An error occurred"
};

// Access to stored mock functions
const mocks = globalThis.__mocks as {
  mockInvoke: ReturnType<typeof vi.fn>;
  mockSingle: ReturnType<typeof vi.fn>;
  mockSubscribe: ReturnType<typeof vi.fn>;
  mockOn: ReturnType<typeof vi.fn>;
  mockChannel: ReturnType<typeof vi.fn>;
  mockUnsubscribe: ReturnType<typeof vi.fn>;
  getRealtimeCallback: () => Function | null;
  setRealtimeCallback: (cb: Function | null) => void;
  simulateRealtimeUpdate: (status: string) => void;
};

// Update test timeout configuration
vi.setConfig({
  testTimeout: 10000, // Reduced from 30000 for faster test runs
  hookTimeout: 5000   // Reduced from 10000
});

// Helper for flexible text matching
const matchStatusText = (element: HTMLElement, expectedStatuses: string[]): boolean => {
  const content = element.textContent?.toLowerCase() || '';
  return expectedStatuses.some(status =>
    content.includes(status.toLowerCase())
  );
};

// Helper to wait for elements with a specific data-testid
const waitForTestId = async (testId: string, options = { timeout: 5000 }) => {
  return await waitFor(
    () => {
      const element = screen.getByTestId(testId);
      expect(element).toBeInTheDocument();
      return element;
    },
    options
  );
};

// Helper to simulate a realtime status update
const simulateStatusUpdate = async (status: string) => {
  await act(async () => {
    mocks.simulateRealtimeUpdate(status);
    // Ensure any state updates are processed
    await Promise.resolve();
  });
};

// Clear all tests after each run to prevent side effects
afterEach(() => {
  cleanup(); // Clean up React Testing Library
  vi.useRealTimers(); // Make sure we're back to real timers

  // Clear any mock data stored in global scope
  if (globalThis.__testCleanup) {
    globalThis.__testCleanup.forEach(fn => fn());
    delete globalThis.__testCleanup;
  }

  // Reset stored callback
  if (mocks?.setRealtimeCallback) {
    mocks.setRealtimeCallback(null);
  }
});

// Final cleanup after all tests
afterAll(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

// Enhanced helper function to reset all mocks and setup test environment
const setupTests = () => {
  // Reset all mocks and timers
  vi.resetAllMocks();
  vi.useRealTimers();

  // Reset window.location
  delete (window as any).location;
  window.location = new URL('http://localhost:3000/trip/confirm') as any;

  // Set up global test cleanup array
  globalThis.__testCleanup = globalThis.__testCleanup || [];

  // Set up default mock implementations
  vi.mocked(useCurrentUser).mockReturnValue({
    user: { id: "test-user-id", email: "test@example.com" },
    userId: "test-user-id",
    loading: false,
  });

  // Reset location mock to default state
  Object.assign(mockLocation, {
    pathname: '/trip/confirm',
    search: '',
    hash: '',
    state: null,
    key: 'default'
  });

  // Reset supabase mocks using our global reference for better control
  if (globalThis.__mocks) {
    Object.entries(globalThis.__mocks).forEach(([key, mock]) => {
      if (typeof mock === 'function' && typeof mock.mockReset === 'function' &&
          !key.startsWith('get') && !key.startsWith('set') && !key.startsWith('simulate')) {
        mock.mockReset();
      }
    });
  }

  // Reset realtime callback
  if (mocks?.setRealtimeCallback) {
    mocks.setRealtimeCallback(null);
  }

  // Set up default Supabase mock behavior

  // Default invoke implementation
  mocks.mockInvoke.mockImplementation((functionName, options) => {
    if (functionName === 'create-booking-request') {
      return Promise.resolve({
        data: { url: 'https://checkout.stripe.com/test-session' },
        error: null
      });
    }
    if (functionName === 'process-booking') {
      return Promise.resolve({ data: { success: true }, error: null });
    }
    return Promise.resolve({ data: null, error: null });
  });

  // Default channel implementation
  mocks.mockChannel.mockImplementation((channelName) => ({
    on: mocks.mockOn,
    unsubscribe: mocks.mockUnsubscribe
  }));

  // Default database query implementation
  mocks.mockSingle.mockResolvedValue({
    data: { status: 'pending_booking' },
    error: null
  });

  // Reset other mocks
  vi.mocked(toast).mockReset();

  // Add debugging output to help trace test flow
  console.log("Test environment reset and initialized");
};

// Enhanced helper to render with Router context
const renderWithRouter = async (
  ui: React.ReactElement,
  {
    route = '/',
    path = '/',
    search = '',
    params = {},
    initialState = {}
  } = {}
) => {
  // Clean up any previous renders
  cleanup();

  // Build search params
  const searchParams = new URLSearchParams();
  if (Object.keys(params).length > 0) {
    Object.entries(params).forEach(([key, value]) => {
      // Don't encode values as they'll be encoded by URLSearchParams automatically
      searchParams.append(key, String(value));
    });
  } else if (search) {
    const searchString = search.startsWith('?') ? search.slice(1) : search;
    searchString.split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      if (key) searchParams.append(key, value || '');
    });
  }

  const searchString = searchParams.toString();
  const fullPath = `${route}${searchString ? '?' + searchString : ''}`;

  // Pre-setup location and history
  window.history.pushState({}, 'Test page', fullPath);

  // Update mock location
  Object.assign(mockLocation, {
    pathname: route,
    search: searchString ? `?${searchString}` : '',
    hash: '',
    state: null,
    key: 'default'
  });

  // Use act to ensure all effects are processed
  let renderResult;
  await act(async () => {
    renderResult = render(
      <MemoryRouter initialEntries={[fullPath]}>
        <Routes>
          <Route path={path} element={ui} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for component to stabilize
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  // Return rendered component with debug info
  return {
    ...(renderResult as ReturnType<typeof render>),
    searchParams,
    debug: {
      url: fullPath,
      params: Object.fromEntries(searchParams.entries()),
      location: mockLocation,
      searchParams,
      bodyHTML: () => document.body.innerHTML
    }
  };
};


describe("TripConfirm Page", () => {
  beforeEach(() => {
    // Use the centralized setup function
    setupTests();
  });

  // Common test data across test suites
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

  const offerParams = {
    id: mockOffer.id,
    airline: mockOffer.airline,
    flight_number: mockOffer.flight_number,
    price: mockOffer.price.toString(),
    departure_date: mockOffer.departure_date,
    departure_time: mockOffer.departure_time,
    return_date: mockOffer.return_date,
    return_time: mockOffer.return_time,
    duration: mockOffer.duration,
  };

  describe("Initial Rendering", () => {
    it("renders loading state initially", async () => {
      // Mock user loading state
      vi.mocked(useCurrentUser).mockReturnValueOnce({
        user: null,
        userId: null,
        loading: true,
      });
      
      const { findByRole } = await renderWithRouter(<TripConfirm />, {
        route: '/trip/confirm',
        path: '/trip/confirm',
        params: offerParams // Include valid params to avoid error view
      });

      const loadingSpinner = await findByRole('status');
      expect(loadingSpinner).toBeInTheDocument();
      expect(loadingSpinner).toHaveTextContent(/loading/i);
    });

    it("displays error when missing required params", async () => {
      // Render with incomplete params
      await renderWithRouter(<TripConfirm />, {
        route: '/trip/confirm',
        path: '/trip/confirm',
        params: {
          airline: "Test Airline" // Missing id and other required fields
        }
      });

      // Should display error message
      const errorElement = await screen.findByTestId('error-message');
      expect(errorElement).toBeInTheDocument();

      // Toast should show error
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Error",
        variant: "destructive"
      }));
    });

    it("renders offer details correctly", async () => {
      // Render component with offer params
      await renderWithRouter(<TripConfirm />, {
        route: '/trip/confirm',
        path: '/trip/confirm',
        params: offerParams
      });

      // Verify offer details are displayed
      const airlineElement = await screen.findByTestId('airline-name');
      expect(airlineElement).toHaveTextContent('Test Airline');

      const priceElement = await screen.findByTestId('offer-price');
      expect(priceElement).toHaveTextContent('$250');

      // Verify flight info is present
      expect(screen.getByText(mockOffer.flight_number)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(mockOffer.duration))).toBeInTheDocument();
    });

    it("renders session view when session_id is present", async () => {
      const sessionId = "test-session-123";

      mocks.mockSingle.mockResolvedValueOnce({
        data: { status: 'pending_payment' },
        error: null
      });

      const { findByTestId } = await renderWithRouter(<TripConfirm />, {
        route: '/trip/confirm',
        path: '/trip/confirm',
        params: { session_id: sessionId }
      });

      const statusElement = await findByTestId('booking-status');
      expect(statusElement).toHaveTextContent(/processing payment/i);

      // Should show loader
      const loaderElement = await findByTestId('booking-loader');
      expect(loaderElement).toBeInTheDocument();

      // Should call process-booking
      expect(mocks.mockInvoke).toHaveBeenCalledWith(
        "process-booking",
        { body: { sessionId } }
      );
    });
  });

  describe("onConfirm flow", () => {

  it("should handle flight confirmation, call create-booking-request, and redirect", async () => {
      // Use real timers for window.location changes
      vi.useRealTimers();
      
      // Save original window.location to restore after test
      const originalLocation = window.location;

      try {
        // Set up window.location mock
        const mockRedirectUrl = 'https://checkout.stripe.com/test-session';
        let currentHref = 'http://localhost:3000/trip/confirm';

        Object.defineProperty(window, 'location', {
          value: {
            get href() { return currentHref; },
            set href(value) {
              console.log(`Redirecting to: ${value}`);
              currentHref = value;
            }
          },
          writable: true
        });

        // Mock create-booking-request to return redirect URL
        mocks.mockInvoke.mockImplementation((functionName, options) => {
          if (functionName === 'create-booking-request') {
            return Promise.resolve({
              data: { url: mockRedirectUrl },
              error: null
            });
          }
          return Promise.resolve({ data: null, error: null });
        });

        // Render component with offer parameters
        const { debug } = await renderWithRouter(<TripConfirm />, {
          route: '/trip/confirm',
          path: '/trip/confirm',
          params: offerParams
        });

        // Wait for component to fully render
        const airlineElement = await screen.findByTestId('airline-name', {
          timeout: 5000
        });

        // Verify initial render shows correct details
        expect(airlineElement).toHaveTextContent('Test Airline');
        expect(screen.getByText('TA123')).toBeInTheDocument();
        expect(screen.getByTestId('offer-price')).toHaveTextContent('$250');

        // Find and click confirmation button
        const confirmButton = await screen.findByRole('button', {
          name: /Pay & Book/i
        });

        // Click button with act to ensure all effects run
        await act(async () => {
          fireEvent.click(confirmButton);
        });

        // Verify API call was made with correct parameters
        await waitFor(() => {
          expect(mocks.mockInvoke).toHaveBeenCalledWith(
            'create-booking-request',
            expect.objectContaining({
              body: expect.objectContaining({
                userId: 'test-user-id',
                offerId: 'offer-123'
              })
            })
          );
        });

        // Wait for redirect to happen
        await waitFor(() => {
          expect(window.location.href).toBe(mockRedirectUrl);
        }, { timeout: 5000 });

        console.log("Redirect confirmed, test passed!");
      } catch (error) {
        console.error('Test failed:', error);
        throw error;
      } finally {
        // Restore original window.location
        Object.defineProperty(window, 'location', {
          value: originalLocation,
          writable: true
        });
      }
    }, 15000); // Increased timeout

  it("should display error toast if create-booking-request fails", async () => {
      // Use real timers for simplicity
      vi.useRealTimers();

      // Set up the network error simulation
      const errorMessage = "Network Error";
      mocks.mockInvoke.mockImplementation((functionName) => {
        if (functionName === 'create-booking-request') {
          return Promise.resolve({
            data: null,
            error: { message: errorMessage }
          });
        }
        return Promise.resolve({ data: null, error: null });
      });

      // Render component with offer params
      const { debug } = await renderWithRouter(<TripConfirm />, {
        route: '/trip/confirm',
        path: '/trip/confirm',
        params: offerParams
      });

      // Wait for the component to be ready
      const airlineElement = await screen.findByTestId("airline-name");
      expect(airlineElement).toHaveTextContent("Test Airline");

      // Find and click the confirm button
      const confirmButton = await screen.findByRole("button", {
        name: /Pay & Book/i
      });

      await act(async () => {
        fireEvent.click(confirmButton);
      });

      // Verify API call was made
      await waitFor(() => {
        expect(mocks.mockInvoke).toHaveBeenCalledWith(
          'create-booking-request',
          expect.anything()
        );
      });
      
      // Verify error is displayed
      await waitFor(() => {
        expect(screen.getByTestId("error-message")).toHaveTextContent(errorMessage);
      });

      // Verify toast was called with correct parameters
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Booking Failed",
          description: errorMessage,
          variant: "destructive",
        })
      );

      // Confirm button should be re-enabled after error
      await waitFor(() => {
        const button = screen.getByRole("button", { name: /Pay & Book/i });
        expect(button).not.toBeDisabled();
      });
    }, 15000);


    it("should display error toast if user is not logged in", async () => {
      vi.mocked(useCurrentUser).mockReturnValue({
        user: null,
        userId: null,
        loading: false
      });

      const { findByRole } = await renderWithRouter(<TripConfirm />, {
        route: '/trip/confirm',
        path: '/trip/confirm',
        params: offerParams
      });

      const confirmButton = await findByRole('button', { name: /pay & book/i });
      await act(async () => {
        fireEvent.click(confirmButton);
      });

      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Authentication Error",
        description: "You must be logged in to book a flight.",
        variant: "destructive"
      }));

      // API should not be called
      expect(mocks.mockInvoke).not.toHaveBeenCalled();
    });
  });

  describe("session_id effect (booking status updates)", () => {
    beforeEach(() => {
      setupTests();
      vi.useRealTimers();
    });

    it("handles successful booking process and redirects to dashboard", async () => {
      const sessionId = "test-session-123";
      
      mocks.mockSingle.mockResolvedValueOnce({
        data: { status: 'done' },
        error: null
      });
      
      await renderWithRouter(<TripConfirm />, {
        route: '/trip/confirm',
        path: '/trip/confirm',
        params: { session_id: sessionId }
      });

      await act(async () => {
        mocks.simulateRealtimeUpdate("done");
        // Use smaller timeout for tests
        vi.advanceTimersByTime(1000);
      });

      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Booking Confirmed!",
        variant: "default"
      }));

      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });

    it("handles failed booking process and displays error message", async () => {
      const sessionId = "test-session-error-456";
      const errorMessage = "Booking processing failed";

      // Mock process-booking to fail with specific error
      mocks.mockInvoke.mockImplementation((functionName, options) => {
        if (functionName === "process-booking") {
          return Promise.resolve({
            data: null,
            error: { message: errorMessage }
          });
        }
        return Promise.resolve({ data: null, error: null });
      });

      // Render component with session ID
      await renderWithRouter(<TripConfirm />, {
        route: '/trip/confirm',
        path: '/trip/confirm',
        params: { session_id: sessionId }
      });

      // Wait for initial status
      const initialStatus = await waitForTestId("booking-status");
      expect(
        matchStatusText(initialStatus, [
          STATUS_TEXTS.PROCESSING_PAYMENT,
          STATUS_TEXTS.FINALIZING_BOOKING
        ])
      ).toBe(true);

      // Verify process-booking was called
      await waitFor(() => {
        expect(mocks.mockInvoke).toHaveBeenCalledWith("process-booking", {
          body: { sessionId },
        });
      });
      
      // Wait for error to be displayed
      await waitFor(() => {
        const statusElement = screen.getByTestId("booking-status");
        expect(statusElement).toHaveTextContent(STATUS_TEXTS.BOOKING_FAILED);
      });
      
      // Error message should be displayed
      const errorElement = await screen.findByTestId("error-message");
      expect(errorElement).toHaveTextContent(errorMessage);

      // Toast should be called with the right parameters
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Booking Finalization Error",
        description: errorMessage,
        variant: "destructive",
      }));
      
      // Verify no navigation occurs
      vi.advanceTimersByTime(3000);
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("updates booking status via realtime subscription", async () => {
      const sessionId = "test-session-realtime-789";

      // Mock database query to return processing status
      mocks.mockSingle.mockResolvedValue({
        data: { status: 'processing' },
        error: null
      });

      // Render component with session ID
      await renderWithRouter(<TripConfirm />, {
        route: '/trip/confirm',
        path: '/trip/confirm',
        params: { session_id: sessionId }
      });

      // Wait for initial status
      const initialStatusElement = await waitForTestId("booking-status");
      expect(initialStatusElement).toBeInTheDocument();

      // Verify channel subscription was created
      await waitFor(() => {
        expect(mocks.mockChannel).toHaveBeenCalledWith(`checkout:${sessionId}`);
        expect(mocks.mockOn).toHaveBeenCalled();
        expect(mocks.mockSubscribe).toHaveBeenCalled();
      });

      // Switch to fake timers for navigation test
      vi.useFakeTimers();

      // Simulate realtime update with done status
      await simulateStatusUpdate("done");

      // Verify status updates
      await waitFor(() => {
        const statusElement = screen.getByTestId("booking-status");
        expect(statusElement).toHaveTextContent(STATUS_TEXTS.FLIGHT_BOOKED);
      });

      // Verify toast was shown
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Booking Confirmed!",
        variant: "default",
      }));

      // Advance timers to trigger navigation
      vi.advanceTimersByTime(3000);

      // Verify navigation was called
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
      
      // Clean up timers
      vi.useRealTimers();
    });

    it("handles network error during processing gracefully", async () => {
      const sessionId = "test-session-network-error";
      const errorMessage = "Network Error";
      
      // Mock process-booking to fail with network error
      mocks.mockInvoke.mockImplementation((functionName) => {
        if (functionName === "process-booking") {
          return Promise.resolve({
            data: null,
            error: { message: errorMessage }
          });
        }
        return Promise.resolve({ data: null, error: null });
      });
      
      // Render component with session ID
      await renderWithRouter(<TripConfirm />, {
        route: '/trip/confirm',
        path: '/trip/confirm',
        params: { session_id: sessionId }
      });
      
      // Wait for initial status
      const initialStatus = await waitForTestId("booking-status");
      expect(
        matchStatusText(initialStatus, [
          STATUS_TEXTS.PROCESSING_PAYMENT,
          STATUS_TEXTS.FINALIZING_BOOKING
        ])
      ).toBe(true);

      // Verify process-booking was called
      await waitFor(() => {
        expect(mocks.mockInvoke).toHaveBeenCalledWith(
          "process-booking",
          { body: { sessionId } }
        );
      });
      
      // Wait for error to be displayed
      const errorElement = await waitForTestId("error-message");
      expect(errorElement).toHaveTextContent(errorMessage);

      // Verify toast was called with error
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        description: errorMessage,
        variant: "destructive"
      }));

      // No navigation should occur
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("handles booking status updates from database fetch", async () => {
      const sessionId = "test-session-db-fetch";

      // Mock database query to return done status
      mocks.mockSingle.mockResolvedValue({
        data: { status: 'done' },
        error: null
      });

      // Render component with session ID
      await renderWithRouter(<TripConfirm />, {
        route: '/trip/confirm',
        path: '/trip/confirm',
        params: { session_id: sessionId }
      });

      // Wait for booking status to update based on DB fetch
      await waitFor(() => {
        const statusElement = screen.getByTestId("booking-status");
        expect(statusElement).toHaveTextContent(STATUS_TEXTS.FLIGHT_BOOKED);
      });

      // Verify toast was shown
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Booking Confirmed!",
        variant: "default"
      }));

      // Switch to fake timers to test navigation
      vi.useFakeTimers();
      vi.advanceTimersByTime(3000);

      // Verify navigation occurs
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");

      // Clean up timers
      vi.useRealTimers();
    });

    it("cleans up subscription when component unmounts", async () => {
      const sessionId = "test-session-cleanup";

      // Render component with session ID
      const { unmount } = await renderWithRouter(<TripConfirm />, {
        route: '/trip/confirm',
        path: '/trip/confirm',
        params: { session_id: sessionId }
      });

      // Wait for subscription to be created
      await waitFor(() => {
        expect(mocks.mockChannel).toHaveBeenCalledWith(`checkout:${sessionId}`);
        expect(mocks.mockSubscribe).toHaveBeenCalled();
      });

      // Unmount component
      unmount();

      // Verify unsubscribe was called
      expect(mocks.mockUnsubscribe).toHaveBeenCalled();
    });
  });

  describe("Error Handling", () => {
    it("handles database query errors gracefully", async () => {
      const sessionId = "test-session-db-error";

      // Mock database query to fail
      mocks.mockSingle.mockResolvedValue({
        data: null,
        error: { message: "Database query failed" }
      });

      // Render component with session ID
      await renderWithRouter(<TripConfirm />, {
        route: '/trip/confirm',
        path: '/trip/confirm',
        params: { session_id: sessionId }
      });

      // Initial status should still show
      const initialStatus = await waitForTestId("booking-status");
      expect(initialStatus).toBeInTheDocument();

      // Toast should show database error
      await waitFor(() => {
        expect(toast).toHaveBeenCalledWith(expect.objectContaining({
          title: "Error Fetching Booking Details",
          variant: "destructive"
        }));
      });
    });

    it("displays error for invalid offer data", async () => {
      const { findByText } = await renderWithRouter(<TripConfirm />, {
        route: '/trip/confirm',
        path: '/trip/confirm',
        params: {
          id: "offer-123",
          // Missing required fields
        }
      });

      const errorMessage = await findByText(/missing flight information/i);
      expect(errorMessage).toBeInTheDocument();

      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Error",
        variant: "destructive"
      }));
    });
  });
});
