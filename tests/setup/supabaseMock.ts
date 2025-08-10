// tests/setup/supabaseMock.ts
// Unified Supabase mock for tests
import { vi } from 'vitest';

// Basic table query chain mock
function createQueryChain() {
  const chain: any = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    in: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
  };
  return chain;
}

export const mockFrom = vi.fn(() => createQueryChain());

export const mockSupabaseClient: any = {
  from: mockFrom,
  functions: {
    invoke: vi.fn().mockResolvedValue({ data: {}, error: null }),
  },
  auth: {
    getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null }),
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
  },
  channel: vi.fn().mockReturnValue({ on: vi.fn().mockReturnThis(), subscribe: vi.fn().mockReturnThis(), unsubscribe: vi.fn() }),
};

// Default export as a proxy of the client for convenience
export const supabase = mockSupabaseClient;

// Helper to reset mocks between tests
export function resetSupabaseMocks() {
  mockFrom.mockClear();
  mockSupabaseClient.functions.invoke.mockClear();
  mockSupabaseClient.auth.getUser.mockClear();
  mockSupabaseClient.auth.getSession.mockClear();
}

