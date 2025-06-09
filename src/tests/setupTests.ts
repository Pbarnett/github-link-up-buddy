
import { vi } from 'vitest';
import '@testing-library/jest-dom'; // Import jest-dom matchers

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
// This is a very basic mock. Depending on how useCurrentUser is implemented
// and what other Supabase features are used, this might need to be more sophisticated.
vi.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: vi.fn(() => ({
    userId: 'test-user-id-123', // Provide a mock user ID
    user: { id: 'test-user-id-123', email: 'test@example.com' }, // Provide mock user object
    isLoading: false,
    // Add any other properties returned by your actual useCurrentUser hook
  })),
}));

// Mock supabase client if it's directly imported and used in components for non-auth calls
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: {}, error: null }), // Default single mock
    rpc: vi.fn().mockResolvedValue({ data: {}, error: null }), // Default rpc mock
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: {}, error: null }),
    },
    // Mock other Supabase client methods as needed by your components during tests
  },
}));

// You might also need to mock other global objects or functions here
// e.g., IntersectionObserver, navigation objects if not using MemoryRouter appropriately etc.

console.log('Test setup file (src/tests/setupTests.ts) loaded.');
