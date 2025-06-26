
import { render as rtlRender, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'

import { vi, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest'; // Import jest-dom matchers for Vitest

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Wrap all components in a router for tests
export function render(ui: React.ReactElement, options = {}) {
  return rtlRender(ui, { wrapper: MemoryRouter, ...options })
}

// Re-export everything else from RTL
export * from '@testing-library/react'

// Mock window.matchMedia for JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false, // Default value for matches
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated but sometimes used
    removeListener: vi.fn(), // Deprecated but sometimes used
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver for JSDOM
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock Supabase client and auth (basic mock for useCurrentUser)
vi.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: vi.fn(() => ({
    userId: 'test-user-id-123',
    user: { id: 'test-user-id-123', email: 'test@example.com' },
    isLoading: false,
  })),
}));

// Mock usePaymentMethods hook
vi.mock('@/hooks/usePaymentMethods', () => ({
  usePaymentMethods: vi.fn(() => ({
    data: [],
    isLoading: false,
    error: undefined,
    refetch: vi.fn(),
  })),
}));

// Mock supabase client
vi.mock('@/integrations/supabase/client', () => {
  const createMockQueryBuilder = () => ({
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    like: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    contains: vi.fn().mockReturnThis(),
    containedBy: vi.fn().mockReturnThis(),
    rangeGt: vi.fn().mockReturnThis(),
    rangeGte: vi.fn().mockReturnThis(),
    rangeLt: vi.fn().mockReturnThis(),
    rangeLte: vi.fn().mockReturnThis(),
    rangeAdjacent: vi.fn().mockReturnThis(),
    overlaps: vi.fn().mockReturnThis(),
    textSearch: vi.fn().mockReturnThis(),
    match: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    filter: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: {}, error: null }),
    maybeSingle: vi.fn().mockResolvedValue({ data: {}, error: null }),
    then: vi.fn().mockResolvedValue({ data: [], error: null }),
    // Add promise-like behavior for awaiting
    catch: vi.fn(),
    finally: vi.fn(),
  });

  return {
    supabase: {
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: { session: { access_token: 'mock-token' } },
          error: null,
        }),
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'test-user-id-123' } },
          error: null,
        }),
      },
      from: vi.fn().mockImplementation(() => createMockQueryBuilder()),
      rpc: vi.fn().mockResolvedValue({ data: {}, error: null }),
      functions: {
        invoke: vi.fn().mockResolvedValue({ data: {}, error: null }),
      },
    },
  };
});

// Global mock for toast functionality
vi.mock('@/components/ui/use-toast', () => {
  const mockToast = vi.fn();
  return {
    useToast: () => ({ toast: mockToast }),
    toast: mockToast,
  };
});

// Mock @tanstack/react-query
vi.mock('@tanstack/react-query', () => ({
  QueryClient: vi.fn().mockImplementation(() => ({
    invalidateQueries: vi.fn(),
    getQueryData: vi.fn(),
    setQueryData: vi.fn(),
    clear: vi.fn(),
  })),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
    getQueryData: vi.fn(),
    setQueryData: vi.fn(),
  })),
  useQuery: vi.fn(() => ({
    data: undefined,
    isLoading: false,
    error: null,
    isError: false,
    refetch: vi.fn(),
  })),
  useMutation: vi.fn(() => ({
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    isLoading: false,
    isError: false,
    error: null,
    data: undefined,
  })),
}));

console.log('Test setup file (src/tests/setupTests.ts) loaded.');
