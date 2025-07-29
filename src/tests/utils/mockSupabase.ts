import * as React from 'react';
import { vi } from 'vitest';
// Enhanced Supabase mock that properly handles method chaining
export function createMockSupabaseClient(
  customMocks: Record<string, any> = {}
) {
  // Mock data that can be customized per test
  const defaultData = [{ id: '123', name: 'TestData' }];

  // Create chainable query builder mock
  const createQueryBuilder = (data = defaultData, error = null) => ({
    select: vi.fn(() => createQueryBuilder(data, error)),
    insert: vi.fn(() => createQueryBuilder(data, error)),
    update: vi.fn(() => createQueryBuilder(data, error)),
    delete: vi.fn(() => createQueryBuilder(data, error)),
    eq: vi.fn(() => createQueryBuilder(data, error)),
    neq: vi.fn(() => createQueryBuilder(data, error)),
    gt: vi.fn(() => createQueryBuilder(data, error)),
    gte: vi.fn(() => createQueryBuilder(data, error)),
    lt: vi.fn(() => createQueryBuilder(data, error)),
    lte: vi.fn(() => createQueryBuilder(data, error)),
    like: vi.fn(() => createQueryBuilder(data, error)),
    ilike: vi.fn(() => createQueryBuilder(data, error)),
    is: vi.fn(() => createQueryBuilder(data, error)),
    in: vi.fn(() => createQueryBuilder(data, error)),
    contains: vi.fn(() => createQueryBuilder(data, error)),
    containedBy: vi.fn(() => createQueryBuilder(data, error)),
    rangeGt: vi.fn(() => createQueryBuilder(data, error)),
    rangeGte: vi.fn(() => createQueryBuilder(data, error)),
    rangeLt: vi.fn(() => createQueryBuilder(data, error)),
    rangeLte: vi.fn(() => createQueryBuilder(data, error)),
    rangeAdjacent: vi.fn(() => createQueryBuilder(data, error)),
    overlaps: vi.fn(() => createQueryBuilder(data, error)),
    textSearch: vi.fn(() => createQueryBuilder(data, error)),
    match: vi.fn(() => createQueryBuilder(data, error)),
    not: vi.fn(() => createQueryBuilder(data, error)),
    filter: vi.fn(() => createQueryBuilder(data, error)),
    or: vi.fn(() => createQueryBuilder(data, error)),
    order: vi.fn(() => createQueryBuilder(data, error)),
    limit: vi.fn(() => createQueryBuilder(data, error)),
    range: vi.fn(() => createQueryBuilder(data, error)),
    single: vi.fn(() => Promise.resolve({ data: data[0] || null, error })),
    maybeSingle: vi.fn(() => Promise.resolve({ data: data[0] || null, error })),
    // Make the query builder thenable for direct awaiting
    then: vi.fn(resolve => resolve({ data, error })),
    // Also support promise-like behavior
    data,
    error,
  });

  return {
    from: vi.fn((table: string) => {
      // Allow per-table customization
      const tableData = customMocks[table] || defaultData;
      const tableError = customMocks[`${table}_error`] || null;
      return createQueryBuilder(tableData, tableError);
    }),

    // Auth mock
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user', email: 'test@example.com' } },
        error: null,
      }),
      signUp: vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user' }, session: null },
        error: null,
      }),
      signInWithPassword: vi.fn().mockResolvedValue({
        data: {
          user: { id: 'test-user' },
          session: { access_token: 'test-token' },
        },
        error: null,
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
      getSession: vi.fn().mockResolvedValue({
        data: { session: { access_token: 'test-token' } },
        error: null,
      }),
    },

    // Storage mock
    storage: {
      from: vi.fn(() => ({
        upload: vi
          .fn()
          .mockResolvedValue({ data: { path: 'test-path' }, error: null }),
        download: vi.fn().mockResolvedValue({ data: new Blob(), error: null }),
        remove: vi.fn().mockResolvedValue({ data: null, error: null }),
        list: vi.fn().mockResolvedValue({ data: [], error: null }),
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: 'https://test.com/test.jpg' },
        }),
        createSignedUrl: vi.fn().mockResolvedValue({
          data: { signedUrl: 'https://test.com/signed' },
          error: null,
        }),
      })),
    },

    // Functions mock
    functions: {
      invoke: vi
        .fn()
        .mockResolvedValue({ data: { result: 'success' }, error: null }),
    },

    // Channel mock for real-time
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnValue(Promise.resolve('SUBSCRIBED')),
      unsubscribe: vi.fn().mockReturnValue(Promise.resolve('CLOSED')),
    })),

    // Other utility methods
    removeAllChannels: vi.fn(),
    getChannels: vi.fn().mockReturnValue([]),

    // Allow direct access to mock functions for test assertions
    _mockFunctions: {
      from: vi.fn(),
      auth: {
        getUser: vi.fn(),
        signUp: vi.fn(),
        signInWithPassword: vi.fn(),
        signOut: vi.fn(),
      },
    },
  };
}

// Enhanced mock for hooks that use Supabase
export const mockSupabaseHook = (
  hookName: string,
  customReturnValue: any = {}
) => {
  const defaultReturnValue = {
    data: null,
    error: null,
    loading: false,
    refetch: vi.fn(),
    mutate: vi.fn(),
    ...customReturnValue,
  };

  return vi.fn(() => defaultReturnValue);
};

// Mock for specific Supabase error scenarios
export const createMockSupabaseError = (message: string, code?: string) => ({
  message,
  code,
  details: null,
  hint: null,
});

// Utility to reset all Supabase mocks
export const resetSupabaseMocks = () => {
  vi.clearAllMocks();
};
