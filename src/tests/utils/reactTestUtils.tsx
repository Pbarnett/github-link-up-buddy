type _Component<P = {}, S = {}> = React.Component<P, S>;

import { vi } from 'vitest';
import * as React from 'react';
import { ReactNode, ComponentType } from 'react';
import { render, screen, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { userEvent } from '@testing-library/user-event';
import { createSupabaseStub } from './supabaseMocks';
// Mock toast notifications
export const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
  dismiss: vi.fn(),
  promise: vi.fn(),
};

// Setup toast mocking
vi.mock('sonner', () => ({
  toast: mockToast,
  Toaster: ({ children }: { children?: ReactNode }) => (
    <div data-testid="toaster">{children}</div>
  ),
}));

// Mock react-hot-toast if used
vi.mock('react-hot-toast', () => ({
  toast: mockToast,
  Toaster: ({ children }: { children?: ReactNode }) => (
    <div data-testid="toaster">{children}</div>
  ),
}));

// Mock Supabase context/hooks if they exist
export const mockSupabaseContext = {
  supabase: createSupabaseStub(),
  session: null,
  user: null,
};

// Custom render function with all providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  // Router options
  initialEntries?: string[];
  route?: string;

  // Auth options
  user?: Record<string, unknown> | null;
  session?: Record<string, unknown> | null;

  // Query client options
  queryClient?: QueryClient;

  // Custom wrapper
  wrapper?: ComponentType<{ children: ReactNode }>;
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) {
  const {
    initialEntries = ['/'],
    route = '/*',
    user = null, // eslint-disable-line @typescript-eslint/no-unused-vars
    session = null, // eslint-disable-line @typescript-eslint/no-unused-vars
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    }),
    wrapper: CustomWrapper,
    ...renderOptions
  } = options;

  // Create a wrapper with all necessary providers
  function AllTheProviders({ children }: { children: ReactNode }) {
    const content = (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path={route} element={<>{children}</>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    return CustomWrapper ? <CustomWrapper>{content}</CustomWrapper> : content;
  }

  return {
    ...render(ui, { wrapper: AllTheProviders, ...renderOptions }),
    queryClient,
  };
}

// Utility to create a user event with proper async handling
export { userEvent } from '@testing-library/user-event';

// Helper for waiting for async operations
export async function waitForAsyncOperations() {
  await new Promise(resolve => setTimeout(resolve, 0));
}

// Helper for testing form submissions
export async function submitForm(form: HTMLFormElement) {
  const { userEvent } = await import('@testing-library/user-event');
  const _user = userEvent.setup();

  const submitButton = form.querySelector(
    'button[type="submit"]'
  ) as HTMLButtonElement;
  if (submitButton) {
    await _user.click(submitButton);
  } else {
    // Fallback to programmatic submit
    form.submit();
  }
}

// Helper for filling form fields
export async function fillFormField(labelText: string | RegExp, value: string) {
  const { screen } = await import('@testing-library/react');
  const { userEvent } = await import('@testing-library/user-event');
  const _user = userEvent.setup();

  const field = screen.getByLabelText(labelText);
  await _user.clear(field);
  await _user.type(field, value);
}

// Mock router utilities
export const mockNavigate = vi.fn();
export const mockLocation = {
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'default',
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

// Cleanup helpers
export function resetAllMocks() {
  vi.clearAllMocks();
  mockNavigate.mockClear();
  Object.values(mockToast).forEach(mock => {
    if (typeof mock.mockClear === 'function') {
      mock.mockClear();
    }
  });
}

// Test data factories
export const TestData = {
  user: (overrides: Partial<Record<string, unknown>> = {}) => ({
    id: 'test-user-id',
    email: 'test@example.com',
    created_at: '2024-01-01T00:00:00Z',
    ...overrides,
  }),

  flightOffer: (overrides: Partial<Record<string, unknown>> = {}) => ({
    id: 'offer-1',
    airline: 'Test Airlines',
    departure_date: '2024-07-15',
    return_date: '2024-07-18',
    duration: '3 days',
    price: 500,
    price_currency: 'USD',
    origin_iata: 'JFK',
    destination_iata: 'LAX',
    nonstop: true,
    cabin_class: 'ECONOMY',
    ...overrides,
  }),

  tripRequest: (overrides: Partial<Record<string, unknown>> = {}) => ({
    id: 'trip-1',
    user_id: 'test-user-id',
    origin: 'JFK',
    destination: 'LAX',
    departure_date: '2024-07-15',
    return_date: '2024-07-18',
    auto_book_enabled: false,
    max_price: 1000,
    created_at: '2024-01-01T00:00:00Z',
    ...overrides,
  }),

  booking: (overrides: Partial<Record<string, unknown>> = {}) => ({
    id: 'booking-1',
    user_id: 'test-user-id',
    trip_request_id: 'trip-1',
    status: 'confirmed',
    pnr: 'ABC123',
    total_price: 500,
    created_at: '2024-01-01T00:00:00Z',
    ...overrides,
  }),
};

// Enhanced query selectors for common patterns
export const QueryHelpers = {
  // Get by role with better error messages
  getButton: (name: string | RegExp) => {
    return screen.getByRole('button', { name });
  },

  // Get form elements
  getTextInput: (labelText: string | RegExp) => {
    return screen.getByLabelText(labelText);
  },

  // Get by test id with prefix
  getByTestId: (testId: string) => {
    return screen.getByTestId(testId);
  },

  // Find async elements
  findText: async (text: string | RegExp) => {
    return screen.findByText(text);
  },

  // Query for optional elements
  queryText: (text: string | RegExp) => {
    return screen.queryByText(text);
  },
};

// Component-specific helpers
export const ComponentHelpers = {
  // Dashboard helpers
  dashboard: {
    async switchToTripHistory() {
      const { userEvent } = await import('@testing-library/user-event');
      const _user = userEvent.setup();
      const tab = screen.getByRole('tab', { name: /trip history/i });
      await _user.click(tab);
    },

    async switchToCurrentRequests() {
      const { userEvent } = await import('@testing-library/user-event');
      const _user = userEvent.setup();
      const tab = screen.getByRole('tab', {
        name: /current booking requests/i,
      });
      await _user.click(tab);
    },
  },

  // Form helpers
  form: {
    async fillTripRequest(data: {
      origin?: string;
      destination?: string;
      departureDate?: string;
      returnDate?: string;
      maxPrice?: string;
    }) {
      if (data.origin) await fillFormField(/origin/i, data.origin);
      if (data.destination)
        await fillFormField(/destination/i, data.destination);
      if (data.departureDate)
        await fillFormField(/departure date/i, data.departureDate);
      if (data.returnDate) await fillFormField(/return date/i, data.returnDate);
      if (data.maxPrice) await fillFormField(/max price/i, data.maxPrice);
    },

    async submitForm() {
      const _userEvent = await import('@testing-library/user-event');
      const _user = userEvent.setup();
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await _user.click(submitButton);
    },
  },
};

export default renderWithProviders;
