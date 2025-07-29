import * as React from 'react';
import { ReactNode } from 'react';
import { vi } from 'vitest';
import DOMPurify from 'dompurify';
// ==============================================================================
// REACT TESTING UTILITIES
// ==============================================================================

// Create a custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
}

export const renderWithProviders = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    }),
    ...renderOptions
  } = options;

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// ==============================================================================
// MOCK UTILITIES
// ==============================================================================

// Create mock component
export const createMockComponent = (
  name: string,
  props?: Record<string, any>
) => {
  const MockComponent = (componentProps: any) => (
    <div
      data-testid={`mock-${name.toLowerCase()}`}
      {...props}
      {...componentProps}
    >
      Mock {name}
    </div>
  );
  MockComponent.displayName = `Mock${name}`;
  return MockComponent;
};

// Create mock hook
export const createMockHook = <T extends any>(name: string, returnValue: T) => {
  const mockHook = vi.fn(() => returnValue);
  mockHook.mockName = `use${name}`;
  return mockHook;
};

// ==============================================================================
// CONFIG MOCK UTILITIES (for handling minPriceUSD errors)
// ==============================================================================

export const createMockBusinessConfig = (
  overrides: Record<string, any> = {}
) => ({
  version: '1.0.0',
  ui: {
    destination: true,
    budget: true,
    paymentMethod: true,
    ...overrides.ui,
  },
  flightSearch: {
    minPriceUSD: 100,
    maxPriceUSD: 5000,
    defaultNonstopRequired: true,
    allowedCabinClasses: ['economy', 'business', 'first'],
    ...overrides.flightSearch,
  },
  autoBooking: {
    enabled: true,
    maxConcurrentCampaigns: 3,
    ...overrides.autoBooking,
  },
  ...overrides,
});

export const createMockBusinessRulesHook = (
  configOverrides: Record<string, any> = {}
) => ({
  config: createMockBusinessConfig(configOverrides),
  loading: false,
  error: null,
  refetch: vi.fn(),
});

// ==============================================================================
// FORM TESTING UTILITIES
// ==============================================================================

export const mockFormAnalytics = {
  trackFieldInteraction: vi.fn(),
  trackFieldError: vi.fn(),
  trackFormSubmit: vi.fn(),
  trackFormSuccess: vi.fn(),
  trackFormError: vi.fn(),
};

export const createMockFormAnalyticsHook = (
  overrides: Record<string, any> = {}
) => ({
  ...mockFormAnalytics,
  sessionId: 'test-session-123',
  ...overrides,
});

// ==============================================================================
// ASYNC TESTING UTILITIES
// ==============================================================================

// Wait for async operations with timeout
export const waitForAsyncOperations = async (timeout = 1000) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

// Wait for all pending promises to resolve
export const flushPromises = async () => {
  return new Promise(resolve => setImmediate(resolve));
};

// ==============================================================================
// ERROR TESTING UTILITIES
// ==============================================================================

// Suppress console.error during tests that expect errors
export const suppressConsoleError = (callback: () => void | Promise<void>) => {
  const originalError = console.error;
  console.error = vi.fn();

  try {
    return callback();
  } finally {
    console.error = originalError;
  }
};

// Create mock error with proper structure
export const createMockError = (
  message: string,
  code?: string,
  status?: number
) => ({
  message,
  code,
  status,
  name: 'TestError',
  stack: `TestError: ${message}\\n    at test`,
});

// ==============================================================================
// ENVIRONMENT UTILITIES
// ==============================================================================

// Mock environment variables for test
export const mockEnvVars = (vars: Record<string, string>) => {
  Object.entries(vars).forEach(([key, value]) => {
    vi.stubEnv(key, value);
  });
};

// Reset environment variables
export const resetEnvVars = () => {
  vi.unstubAllEnvs();
};

// ==============================================================================
// ACT WRAPPER UTILITIES
// ==============================================================================

// Safe act wrapper for async operations
export const actAsync = async (callback: () => Promise<void> | void) => {
  const { act } = await import('@testing-library/react');
  await act(callback);
};

// ==============================================================================
// MOCK DATA GENERATORS
// ==============================================================================

export const createMockFlightOffer = (overrides: Record<string, any> = {}) => ({
  id: 'flight-123',
  price: {
    total_amount: '299.00',
    currency: 'USD',
    ...overrides.price,
  },
  segments: [
    {
      origin: { name: 'New York', iata_code: 'JFK' },
      destination: { name: 'Los Angeles', iata_code: 'LAX' },
      departure_time: '2024-01-15T08:00:00',
      arrival_time: '2024-01-15T11:00:00',
      ...overrides.segment,
    },
  ],
  ...overrides,
});

export const createMockTripRequest = (overrides: Record<string, any> = {}) => ({
  id: 'trip-123',
  user_id: 'user-123',
  origin: 'JFK',
  destination: 'LAX',
  departure_date: '2024-01-15',
  return_date: '2024-01-20',
  passengers: 1,
  cabin_class: 'economy',
  ...overrides,
});

export const createMockUser = (overrides: Record<string, any> = {}) => ({
  id: 'user-123',
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  created_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

// ==============================================================================
// CLEANUP UTILITIES
// ==============================================================================

// Comprehensive test cleanup
export const cleanupTest = () => {
  vi.clearAllMocks();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();

  // Clear localStorage/sessionStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.clear();
  }
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.clear();
  }

  // Reset document body
  if (typeof document !== 'undefined') {
    const sanitizer = DOMPurify.sanitize;
    document.body.innerHTML = sanitizer('');
  }
};

// ==============================================================================
// EXPORTS
// ==============================================================================

export * from '@testing-library/react';
export { vi } from 'vitest';

export default {
  renderWithProviders,
  createMockComponent,
  createMockHook,
  createMockBusinessConfig,
  createMockBusinessRulesHook,
  mockFormAnalytics,
  createMockFormAnalyticsHook,
  waitForAsyncOperations,
  flushPromises,
  suppressConsoleError,
  createMockError,
  mockEnvVars,
  resetEnvVars,
  actAsync,
  createMockFlightOffer,
  createMockTripRequest,
  createMockUser,
  cleanupTest,
};
