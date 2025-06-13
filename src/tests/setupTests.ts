
import { render as rtlRender } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'

import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest'; // Import jest-dom matchers for Vitest

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
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { access_token: 'mock-token' } },
        error: null,
      }),
    },
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: {}, error: null }),
    rpc: vi.fn().mockResolvedValue({ data: {}, error: null }),
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: {}, error: null }),
    },
  },
}));

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
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
  })),
  useQuery: vi.fn(() => ({
    data: undefined,
    isLoading: false,
    error: null,
  })),
}));

console.log('Test setup file (src/tests/setupTests.ts) loaded.');
