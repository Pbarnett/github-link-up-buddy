import { vi } from 'vitest';

// Mock factory for creating a Supabase client with a full query chain mocked.
export function createMockSupabaseClient() {
  const mockFunction = vi.fn().mockReturnThis();

  return {
    from: vi.fn(() => ({
      select: mockFunction,
      eq: mockFunction,
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user-id', email: 'test@example.com' } }, error: null }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    rpc: vi.fn(),
    functions: {
      invoke: vi.fn(),
    },
  };
}

// Export a singleton mock client for reuse
export const mockSupabaseClient = createMockSupabaseClient();

