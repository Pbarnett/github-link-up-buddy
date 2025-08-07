import { vi } from 'vitest';

// Comprehensive Supabase Mock Factory
export function createSupabaseStub(defaultData: unknown = null, defaultError: unknown = null) {
  const mockData = vi.fn().mockReturnValue(defaultData);
  const mockError = vi.fn().mockReturnValue(defaultError);

  const chainableMethods = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    like: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    contains: vi.fn().mockReturnThis(),
    containedBy: vi.fn().mockReturnThis(),
    rangeLt: vi.fn().mockReturnThis(),
    rangeGt: vi.fn().mockReturnThis(),
    rangeGte: vi.fn().mockReturnThis(),
    rangeLte: vi.fn().mockReturnThis(),
    rangeAdjacent: vi.fn().mockReturnThis(),
    overlaps: vi.fn().mockReturnThis(),
    textSearch: vi.fn().mockReturnThis(),
    filter: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    abortSignal: vi.fn().mockReturnThis(),
    single: vi.fn().mockImplementation(() => 
      Promise.resolve({ data: mockData(), error: mockError() })
    ),
    maybeSingle: vi.fn().mockImplementation(() => 
      Promise.resolve({ data: mockData(), error: mockError() })
    ),
    then: vi.fn().mockImplementation((callback) => 
      callback({ data: mockData(), error: mockError() })
    ),
  };

  // Create the base mock object
  const baseMock = {
    ...chainableMethods,
    // Auth methods
    auth: {
      getUser: vi.fn().mockResolvedValue({ 
        data: { user: { id: 'test-user-id', email: 'test@example.com' } }, 
        error: null 
      }),
      signInWithPassword: vi.fn().mockResolvedValue({ 
        data: { user: { id: 'test-user-id' }, session: { access_token: 'test-token' } }, 
        error: null 
      }),
      signUp: vi.fn().mockResolvedValue({ 
        data: { user: { id: 'test-user-id' } }, 
        error: null 
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      }),
    },
    // Functions methods
    functions: {
      invoke: vi.fn().mockResolvedValue({ 
        data: mockData(), 
        error: mockError() 
      }),
    },
    // Storage methods
    storage: {
      from: vi.fn().mockReturnValue({
        upload: vi.fn().mockResolvedValue({ data: { path: 'test-path' }, error: null }),
        download: vi.fn().mockResolvedValue({ data: new Blob(), error: null }),
        remove: vi.fn().mockResolvedValue({ data: [], error: null }),
        list: vi.fn().mockResolvedValue({ data: [], error: null }),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'test-url' } }),
      }),
    },
    // Realtime methods
    realtime: {
      channel: vi.fn().mockReturnValue({
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn().mockReturnValue(Promise.resolve()),
        unsubscribe: vi.fn().mockReturnValue(Promise.resolve()),
      }),
    },
    // Helper methods for tests
    __setData: (data: unknown) => mockData.mockReturnValue(data),
    __setError: (error: unknown) => mockError.mockReturnValue(error),
    __reset: () => {
      mockData.mockReturnValue(defaultData);
      mockError.mockReturnValue(defaultError);
      Object.values(chainableMethods).forEach(mock => {
        if (typeof mock.mockClear === 'function') {
          mock.mockClear();
        }
      });
    },
  };

  return baseMock;
}

// Edge Function environment stub for Deno
export function createDenoEnvironmentStub(envVars: Record<string, string> = {}) {
  const defaultEnvVars = {
    SUPABASE_URL: 'http://localhost:54321',
    SUPABASE_ANON_KEY: 'test-anon-key',
    SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
    AMADEUS_CLIENT_ID: 'test-amadeus-id',
    AMADEUS_CLIENT_SECRET: 'test-amadeus-secret',
    AMADEUS_BASE_URL: 'https://test.api.amadeus.com',
    RESEND_API_KEY: 'test-resend-key',
    STRIPE_SECRET_KEY: 'sk_test_123',
    TWILIO_ACCOUNT_SID: 'test-twilio-sid',
    ...envVars,
  };

  vi.stubGlobal('Deno', {
    env: {
      get: vi.fn((key: string) => defaultEnvVars[key] || process.env[key]),
      set: vi.fn(),
      delete: vi.fn(),
      has: vi.fn((key: string) => key in defaultEnvVars || key in process.env),
      toObject: vi.fn(() => defaultEnvVars),
    },
    serve: vi.fn(),
    connect: vi.fn(),
    readTextFile: vi.fn(),
    writeTextFile: vi.fn(),
  });

  return defaultEnvVars;
}

// Mock factory for different test scenarios
export const TestScenarios = {
  // Successful database operations
  success: (data: unknown) => createSupabaseStub(data, null),
  
  // Database error scenarios
  dbError: (errorMessage: string = 'Database error') => 
    createSupabaseStub(null, { message: errorMessage, code: 'DB_ERROR' }),
  
  // Network error scenarios
  networkError: () => 
    createSupabaseStub(null, { message: 'Network error', code: 'NETWORK_ERROR' }),
  
  // Empty data scenarios
  empty: () => createSupabaseStub([], null),
  
  // Flight offers data
  flightOffers: (offers: unknown[] = []) => createSupabaseStub(offers, null),
  
  // User authentication scenarios
  authenticatedUser: (userId: string = 'test-user-id') => {
    const stub = createSupabaseStub();
    stub.auth.getUser.mockResolvedValue({
      data: { 
        user: { 
          id: userId, 
          email: 'test@example.com',
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-01T00:00:00Z',
        } 
      },
      error: null,
    });
    return stub;
  },
  
  // Unauthenticated scenarios
  unauthenticated: () => {
    const stub = createSupabaseStub();
    stub.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });
    return stub;
  },
};

// Export mock for module mocking
export const mockSupabaseClient = createSupabaseStub();

// Create client factory mock
export const createClientMock = vi.fn(() => mockSupabaseClient);
