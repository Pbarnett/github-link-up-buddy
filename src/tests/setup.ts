import '@testing-library/jest-dom/vitest';
import { vi, beforeAll, afterAll } from 'vitest';

// Increase test timeout to avoid timeouts in longer tests
vi.setConfig({
  testTimeout: 30000, // 30 seconds global timeout
});

// Mock ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

// Mock localStorage for browser environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
    length: 0,
  };
})();

// Assign localStorage and sessionStorage mocks
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
Object.defineProperty(window, 'sessionStorage', { value: localStorageMock });

// Set up Supabase environment variables for testing
process.env.SUPABASE_URL = 'http://localhost:54321';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
process.env.STRIPE_SECRET_KEY = 'sk_test_mock_key';

// Mock Supabase client
vi.mock('@supabase/supabase-js', async () => {
  // Mock response data
  const mockData = { success: true };
  const mockResponse = { data: mockData, error: null };
  
  // Mock channel for realtime subscriptions
  const mockChannel = vi.fn().mockReturnValue({
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn(callback => {
      if (callback) callback({ new: { status: 'done' } });
      return { 
        unsubscribe: vi.fn() 
      };
    }),
  });

  // Mock SupabaseClient implementation
  const createClient = vi.fn().mockImplementation(() => ({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue(mockResponse),
      maybeSingle: vi.fn().mockResolvedValue(mockResponse),
    }),
    rpc: vi.fn().mockResolvedValue(mockResponse),
    auth: {
      getUser: vi.fn().mockResolvedValue({ 
        data: { user: { id: 'test-user-id' } }, 
        error: null 
      }),
      getSession: vi.fn().mockResolvedValue({
        data: { session: { user: { id: 'test-user-id' } } },
        error: null
      }),
      onAuthStateChange: vi.fn().mockImplementation((callback) => {
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      }),
    },
    channel: mockChannel,
  }));

  return { createClient };
});

// Add any global test setup here
beforeAll(() => {
  // Any global setup
  
  // Mock fetch to avoid network requests during tests
  global.fetch = vi.fn().mockImplementation(() => 
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true }),
      text: () => Promise.resolve('Success'),
    })
  );
});

afterAll(() => {
  // Any global cleanup
  vi.restoreAllMocks();
});

// Export mocks for direct use in tests
export const supabaseMocks = {
  createClient: vi.fn(),
  mockChannel: vi.fn(),
  mockSubscribe: vi.fn(),
};

