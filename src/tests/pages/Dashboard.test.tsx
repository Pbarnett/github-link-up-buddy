
// src/tests/pages/Dashboard.test.tsx
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, type MockedFunction } from 'vitest';
import Dashboard from '@/pages/Dashboard';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// --- Mock Dependencies ---

// These MUST be at the top due to Vitest hoisting

vi.mock('@/integrations/supabase/client', () => {
  const mockAuthUser = vi.fn();
  const mockAuthOnAuthStateChange = vi.fn(() => ({
    data: { subscription: { unsubscribe: vi.fn() } },
  }));
  const mockFrom = vi.fn();
  const mockChannelOn = vi.fn().mockReturnThis();
  const mockChannelSubscribe = vi.fn(() => ({ unsubscribe: vi.fn() }));
  const mockChannel = vi.fn(() => ({
    on: mockChannelOn,
    subscribe: mockChannelSubscribe,
  }));
  const mockRemoveChannel = vi.fn();
  // Note: mockSupabaseUpdate was used in beforeEach, will need to be handled via the re-imported 'from' mock.

  return {
    supabase: {
      auth: {
        getUser: mockAuthUser,
        onAuthStateChange: mockAuthOnAuthStateChange,
        signOut: vi.fn(),
      },
      from: mockFrom,
      channel: mockChannel,
      removeChannel: mockRemoveChannel,

    },
  };
});


vi.mock('@/components/dashboard/TripHistory', () => ({
  default: vi.fn(() => <div data-testid="trip-history-mock">Trip History Mock Content</div>),
}));


vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}));


// react-router-dom mock remains unchanged for now as per instructions

const mockNavigateFn = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: vi.fn(({ to }) => <div data-testid="navigate-mock">{`Redirecting to ${to}`}</div>),
    useNavigate: () => mockNavigateFn,
  };
});


// Import mocks to get references AFTER vi.mock calls
import { supabase } from '@/integrations/supabase/client';
import TripHistory from '@/components/dashboard/TripHistory'; // Default import
import { toast as uiToast } from '@/components/ui/use-toast'; // Named import

// --- Test Data ---
const mockUser = { id: 'user-123', email: 'test@example.com' };
const mockBookingRequestsData = [
  { id: 'br1', status: 'done', created_at: new Date().toISOString(), offer_data: { airline: 'TestAir', flight_number: 'TA101' }, attempts: 0, error_message: null },
  { id: 'br2', status: 'failed', created_at: new Date().toISOString(), offer_data: { airline: 'FlyHigh', flight_number: 'FH202' }, attempts: 1, error_message: 'Booking failed' },
];
const mockTripRequestsData = [
  { id: 'tr1', destination_airport: 'JFK', earliest_departure: '2024-10-01T00:00:00Z', latest_departure: '2024-10-05T00:00:00Z', budget: 500, created_at: new Date().toISOString() },
];

// --- Test Suite ---
describe('Dashboard Page', () => {
  // Obtain references to the mock functions from the imported modules
  const mockedSupabaseAuthUser = supabase.auth.getUser as MockedFunction<typeof supabase.auth.getUser>;
  const mockedSupabaseFrom = supabase.from as MockedFunction<typeof supabase.from>;
  // const mockedSupabaseChannel = supabase.channel as MockedFunction<typeof supabase.channel>;
  // const mockedSupabaseRemoveChannel = supabase.removeChannel as MockedFunction<typeof supabase.removeChannel>;
  const mockedTripHistory = TripHistory as MockedFunction<typeof TripHistory>;
  const mockedUiToast = uiToast as MockedFunction<typeof uiToast>;

  beforeEach(() => {
    // Clear all mocks that were obtained by importing
    mockedSupabaseAuthUser.mockClear();
    mockedSupabaseFrom.mockClear();
    // mockedSupabaseChannel.mockClear(); // If needed
    // mockedSupabaseRemoveChannel.mockClear(); // If needed
    mockedTripHistory.mockClear();
    mockedUiToast.mockClear();

    // Also clear mocks from react-router-dom if they were top-level consts (mockNavigateFn is)
    mockNavigateFn.mockClear();
    // If Navigate itself was a const mock, clear it too: (vi.mocked(Navigate) as MockedFunction<any>).mockClear();


    // Default: Authenticated user
    mockedSupabaseAuthUser.mockResolvedValue({ data: { user: mockUser }, error: null } as any);

    // Mock Supabase 'from' chained calls more robustly
    mockedSupabaseFrom.mockImplementation((tableName: string) => {
      const mockUpdateInstance = vi.fn().mockReturnThis();
      const mockEqForUpdate = vi.fn().mockResolvedValue({ error: null });
      (mockUpdateInstance as any).eq = mockEqForUpdate;

      const chain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        update: mockUpdateInstance,
        single: vi.fn(),
      };

      if (tableName === 'booking_requests') {
        (chain.order as MockedFunction<any>).mockResolvedValue({ data: mockBookingRequestsData, error: null });
      } else if (tableName === 'trip_requests') {
        (chain.limit as MockedFunction<any>).mockResolvedValue({ data: mockTripRequestsData, error: null });
      } else {
        (chain.order as MockedFunction<any>).mockResolvedValue({ data: [], error: null });
        (chain.limit as MockedFunction<any>).mockResolvedValue({ data: [], error: null });
      }
      return chain as any;
    });
  });

  const renderDashboardWithRouter = (initialEntries = ['/dashboard']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<div>Login Page Mock</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('1. Renders loading state initially', async () => {
    mockedSupabaseAuthUser.mockImplementationOnce(() => new Promise(() => {})); // Simulate pending promise
    renderDashboardWithRouter();
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('2. Renders "Current Booking Requests" tab by default when authenticated', async () => {
    renderDashboardWithRouter();
    await waitFor(() => expect(screen.getByText(`Hello, ${mockUser.email}`)).toBeInTheDocument());

    expect(screen.getByRole('tab', { name: /Current Booking Requests/i, selected: true })).toBeInTheDocument();
    expect(screen.getByText(/TestAir TA101/i)).toBeInTheDocument();
    expect(screen.getByText(/FlyHigh FH202/i)).toBeInTheDocument();
    expect(screen.queryByTestId('trip-history-mock')).not.toBeInTheDocument();
  });

  it('3. Switches to "Trip History" tab, renders TripHistory component with userId', async () => {
    renderDashboardWithRouter();
    await waitFor(() => expect(screen.getByText(`Hello, ${mockUser.email}`)).toBeInTheDocument());

    const tripHistoryTabTrigger = screen.getByRole('tab', { name: /Trip History/i });
    await userEvent.click(tripHistoryTabTrigger);

    await waitFor(() => {
      // Check if the tab trigger itself believes it's selected
      expect(tripHistoryTabTrigger).toHaveAttribute('aria-selected', 'true');

      // Then, check if the mock function was called
      expect(mockedTripHistory).toHaveBeenCalledWith({ userId: mockUser.id }, expect.anything());

      // Then, check if its rendered output is in the document.
      expect(screen.getByTestId('trip-history-mock')).toBeInTheDocument();
    });

    expect(screen.queryByText(/TestAir TA101/i)).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Trip History/i, selected: true })).toBeInTheDocument();
  });

  it('4. Switches back to "Current Booking Requests" tab', async () => {
    renderDashboardWithRouter();
    await waitFor(() => expect(screen.getByText(`Hello, ${mockUser.email}`)).toBeInTheDocument());

    const tripHistoryTabTrigger = screen.getByRole('tab', { name: /Trip History/i });
    await userEvent.click(tripHistoryTabTrigger);
    await waitFor(() => expect(screen.getByTestId('trip-history-mock')).toBeInTheDocument());

    const currentRequestsTabTrigger = screen.getByRole('tab', { name: /Current Booking Requests/i });
    await userEvent.click(currentRequestsTabTrigger);

    await waitFor(() => expect(screen.getByText(/TestAir TA101/i)).toBeInTheDocument());
    expect(screen.queryByTestId('trip-history-mock')).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Current Booking Requests/i, selected: true })).toBeInTheDocument();
  });

  it('5. Handles unauthenticated state (simulates redirect to /login)', async () => {
    mockedSupabaseAuthUser.mockResolvedValue({ data: { user: null }, error: null } as any);
    renderDashboardWithRouter();

    await waitFor(() => {
      expect(screen.getByTestId('navigate-mock')).toHaveTextContent('Redirecting to /login');
    });
    expect(screen.queryByText(`Hello, ${mockUser.email}`)).not.toBeInTheDocument();
  });
});
