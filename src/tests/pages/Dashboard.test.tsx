/// <reference types="vitest/globals" />
// React import might no longer be needed if complex mock is removed
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, type MockedFunction } from 'vitest';
import Dashboard from '@/pages/Dashboard';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// --- Mock Dependencies ---
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
  default: mockTripHistoryComponent,
}));


vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(), // Assuming useToast is not directly used, but toast is. Adjust if useToast hook is primary.
}));

// react-router-dom mock
const mockNavigateFn = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: vi.fn(({ to }) => <div data-testid="navigate-mock">{`Redirecting to ${to}`}</div>),
    useNavigate: () => mockNavigateFn,

  };
});

vi.mock('@/components/ui/tabs', async () => {
  const actualTabs = await vi.importActual('@/components/ui/tabs');
  const ReactActual = await vi.importActual('react');

  const MockTabs = ({ children, defaultValue, value, onValueChange }: any) => {
    const currentTab = value !== undefined ? value : activeTabForMock();

    const list: React.ReactNode[] = [];
    const contents: React.ReactNode[] = [];

    ReactActual.Children.forEach(children, (child: React.ReactNode) => {
      if (ReactActual.isValidElement(child)) {
        if (child.type === (actualTabs as any).TabsList) {
          list.push(ReactActual.cloneElement(child as React.ReactElement, {
            children: ReactActual.Children.map(child.props.children, (trigger: any) => {
              if (ReactActual.isValidElement(trigger) && trigger.type === (actualTabs as any).TabsTrigger) {
                return ReactActual.cloneElement(trigger, {
                  'aria-selected': trigger.props.value === currentTab,
                  'data-state': trigger.props.value === currentTab ? 'active' : 'inactive',
                  onClick: () => {
                    setActiveTabForMock(trigger.props.value);
                    if (onValueChange) onValueChange(trigger.props.value);
                  }
                });
              }
              return trigger;
            })
          }));
        } else if (child.type === (actualTabs as any).TabsContent) {
          if (child.props.value === currentTab) {
            contents.push(child);
          }
        } else {
          contents.push(child);
        }
      }
    });
    return ReactActual.createElement('div', {}, ...list, ...contents);
  };
  return {
    ...actualTabs,
    Tabs: MockTabs,
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

  const mockedSupabaseAuthUser = supabase.auth.getUser as MockedFunction<typeof supabase.auth.getUser>;
  const mockedSupabaseFrom = supabase.from as MockedFunction<typeof supabase.from>;
  const mockedTripHistory = TripHistory as MockedFunction<typeof TripHistory>;
  const mockedUiToast = uiToast as MockedFunction<typeof uiToast>;

  beforeEach(() => {
    mockedSupabaseAuthUser.mockClear();
    mockedSupabaseFrom.mockClear();
    mockedTripHistory.mockClear();
    mockedUiToast.mockClear();
    mockNavigateFn.mockClear();
    // setActiveTabForMock('currentRequests'); // Removed

    mockedSupabaseAuthUser.mockResolvedValue({ data: { user: mockUser }, error: null } as any);
    mockedSupabaseFrom.mockImplementation((tableName: string) => {
      const mockUpdateInstance = vi.fn().mockReturnThis();
      const mockEqForUpdate = vi.fn().mockResolvedValue({ error: null });

      const chain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        update: mockSupabaseUpdate, // Specific mock for update
        single: vi.fn(), // For single record fetches if any
      };
      if (tableName === 'booking_requests') {
        (chain.order as MockedFunction<any>).mockResolvedValue({ data: mockBookingRequestsData, error: null });
      } else if (tableName === 'trip_requests') {
        (chain.limit as MockedFunction<any>).mockResolvedValue({ data: mockTripRequestsData, error: null });
      } else {
        // Default for other tables or unspecific calls in order() context
        (chain.order as MockedFunction<any>).mockResolvedValue({ data: [], error: null });
        (chain.limit as MockedFunction<any>).mockResolvedValue({ data: [], error: null });
      }
      // Mock the update chain to resolve successfully by default
      const mockEq = vi.fn().mockResolvedValue({ error: null });
      (mockSupabaseUpdate as any).eq = mockEq;

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

    mockedSupabaseAuthUser.mockImplementationOnce(() => new Promise(() => {}));

    renderDashboardWithRouter();
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('2. Renders "Current Booking Requests" tab by default when authenticated', async () => {
    renderDashboardWithRouter();
    await waitFor(() => expect(screen.getByText(`Hello, ${mockUser.email}`)).toBeInTheDocument());
    expect(screen.getByRole('tab', { name: /Current Booking Requests/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/TestAir TA101/i)).toBeInTheDocument();
    expect(screen.getByText(/FlyHigh FH202/i)).toBeInTheDocument();
    expect(screen.queryByTestId('trip-history-mock')).not.toBeInTheDocument();
  });

  it('3. Switches to "Trip History" tab, renders TripHistory component with userId', async () => {
    renderDashboardWithRouter();
    await waitFor(() => expect(screen.getByText(`Hello, ${mockUser.email}`)).toBeInTheDocument());


    setActiveTabForMock('tripHistory');
    renderDashboardWithRouter(); // Re-render to apply the new activeTabForMock


    const tripHistoryTabTrigger = screen.getByRole('tab', { name: /Trip History/i });
    await user.click(tripHistoryTabTrigger);

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

    const user = userEvent.setup();
    const tripHistoryTabTrigger = screen.getByRole('tab', { name: /Trip History/i });
    await user.click(tripHistoryTabTrigger);
    await waitFor(() => expect(screen.getByTestId('trip-history-mock')).toBeInTheDocument());

    const currentRequestsTabTrigger = screen.getByRole('tab', { name: /Current Booking Requests/i });
    await user.click(currentRequestsTabTrigger);

    await waitFor(() => expect(screen.getByText(/TestAir TA101/i)).toBeInTheDocument());
    expect(screen.queryByTestId('trip-history-mock')).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Current Booking Requests/i, selected: true })).toBeInTheDocument();
  });

  it('5. Handles unauthenticated state (simulates redirect to /login)', async () => {
    mockSupabaseAuthUser.mockResolvedValue({ data: { user: null }, error: null });
    renderDashboardWithRouter();
    await waitFor(() => {
      expect(screen.getByTestId('navigate-mock')).toHaveTextContent('Redirecting to /login');
    });
    expect(screen.queryByText(`Hello, ${mockUser.email}`)).not.toBeInTheDocument();
  });
});
