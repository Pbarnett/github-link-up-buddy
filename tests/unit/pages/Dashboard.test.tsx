
// src/tests/pages/Dashboard.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, type MockedFunction } from 'vitest';
import Dashboard from '@/pages/Dashboard';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// --- Mock Dependencies ---

// Mock personalization hook
vi.mock('@/contexts/PersonalizationContext', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    usePersonalization: () => ({
      personalizationData: { firstName: 'John' },
      loading: false,
      error: null,
      abTestVariant: 'treatment',
      experimentConfig: {},
      trackPersonalizationEvent: vi.fn(),
      isPersonalizationEnabled: true,
    }),
  };
});

// Mock useAnalytics hook
vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    track: vi.fn(),
  }),
}));

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
      onAuthStateChange: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(),
    channel: vi.fn(),
    removeChannel: vi.fn(),
  },
}));

// Mock TripHistory component
vi.mock('@/components/dashboard/TripHistory', () => ({
  default: vi.fn(() => <div data-testid="trip-history-mock">Trip History Mock Content</div>),
}));

// Mock useToast
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
  useToast: () => ({ toast: vi.fn() }),
}));

// Mock react-router-dom's Navigate component for unauthenticated test
// Also mock useNavigate as it might be used by sub-components or if Dashboard itself uses it.
const mockNavigateFn = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: vi.fn(({ to }) => <div data-testid="navigate-mock">{`Redirecting to ${to}`}</div>),
    useNavigate: () => mockNavigateFn,
  };
});


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
  beforeEach(async () => {
    vi.clearAllMocks();

    // Get access to the mocked supabase instance
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Reset all mocks to default values
    (supabase.auth.getUser as any).mockResolvedValue({ 
      data: { user: { id: 'user-123', email: 'test@example.com' } }, 
      error: null 
    });
    
    (supabase.auth.onAuthStateChange as any).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
    
    (supabase.auth.signOut as any).mockResolvedValue({ error: null });
    
    (supabase.channel as any).mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })),
    });
    
    (supabase.removeChannel as any).mockImplementation(() => {});
    
    // Mock Supabase 'from' chained calls more robustly
    (supabase.from as any).mockImplementation((tableName: string) => {
      const chain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        update: vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ error: null }) })),
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

      return chain;
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
    const { supabase } = await import('@/integrations/supabase/client');
    (supabase.auth.getUser as any).mockImplementationOnce(() => new Promise(() => {})); // Simulate pending promise
    renderDashboardWithRouter();
    // Look for loading skeleton elements - the Dashboard shows skeleton loaders with animate-pulse class
    const pulseElements = document.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  it('2. Renders "Active Watches" tab by default when authenticated', async () => {
    renderDashboardWithRouter();
    await screen.findByText(/welcome back, john/i);
    expect(screen.getByText(new RegExp(mockUser.email.split('@')[0], 'i'))).toBeInTheDocument();

    expect(screen.getByRole('tab', { name: /Active Watches/i, selected: true })).toBeInTheDocument();
    expect(screen.getByText(/TestAir TA101/i)).toBeInTheDocument();
    expect(screen.getByText(/FlyHigh FH202/i)).toBeInTheDocument();
    expect(screen.queryByTestId('trip-history-mock')).not.toBeInTheDocument();
  });

  it('3. Switches to "My Trips" tab, renders TripHistory component with userId', async () => {
    const user = userEvent.setup();
    renderDashboardWithRouter();
    await screen.findByText(/welcome back, john/i);
    expect(screen.getByText(new RegExp(mockUser.email.split('@')[0], 'i'))).toBeInTheDocument();

    // Wait for booking requests to be displayed (indicating data has loaded)
    await waitFor(() => expect(screen.getByText(/TestAir TA101/i)).toBeInTheDocument());
    
    // Now look for the tab and click it with userEvent for proper Radix UI interaction
    const tripHistoryTabTrigger = await waitFor(() => screen.getByRole('tab', { name: /My Trips/i }));
    await user.click(tripHistoryTabTrigger);

    await waitFor(() => expect(screen.getByTestId('trip-history-mock')).toBeInTheDocument());
    const { default: TripHistoryMock } = await import('@/components/dashboard/TripHistory');
    expect(TripHistoryMock).toHaveBeenCalledWith(expect.objectContaining({ userId: mockUser.id }), expect.anything());

    expect(screen.queryByText(/TestAir TA101/i)).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /My Trips/i, selected: true })).toBeInTheDocument();
  });

  it('4. Switches back to "Active Watches" tab', async () => {
    const user = userEvent.setup();
    renderDashboardWithRouter();
    await screen.findByText(/welcome back, john/i);
    expect(screen.getByText(new RegExp(mockUser.email.split('@')[0], 'i'))).toBeInTheDocument();

    // Wait for booking requests to be displayed (indicating data has loaded)
    await waitFor(() => expect(screen.getByText(/TestAir TA101/i)).toBeInTheDocument());

    const tripHistoryTabTrigger = await waitFor(() => screen.getByRole('tab', { name: /My Trips/i }));
    await user.click(tripHistoryTabTrigger);
    await waitFor(() => expect(screen.getByTestId('trip-history-mock')).toBeInTheDocument());

    const currentRequestsTabTrigger = screen.getByRole('tab', { name: /Active Watches/i });
    await user.click(currentRequestsTabTrigger);

    await waitFor(() => expect(screen.getByText(/TestAir TA101/i)).toBeInTheDocument());
    expect(screen.queryByTestId('trip-history-mock')).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Active Watches/i, selected: true })).toBeInTheDocument();
  });

  it('5. Handles unauthenticated state (simulates redirect to /login)', async () => {
    const { supabase } = await import('@/integrations/supabase/client');
    (supabase.auth.getUser as any).mockResolvedValueOnce({ data: { user: null }, error: null });
    renderDashboardWithRouter();

    await waitFor(() => {
      expect(screen.getByTestId('navigate-mock')).toHaveTextContent('Redirecting to /login');
    });
    expect(screen.queryByText(/welcome back, john/i)).not.toBeInTheDocument();
    expect(screen.queryByText(new RegExp(mockUser.email.split('@')[0], 'i'))).not.toBeInTheDocument();
  });
});
