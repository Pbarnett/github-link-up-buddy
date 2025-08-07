import { vi } from 'vitest';

export interface MockSupabaseClient {
  from: ReturnType<typeof vi.fn>;
  functions: {
    invoke: ReturnType<typeof vi.fn>;
  };
}

export const createMockSupabaseClient = (): MockSupabaseClient => {
  const createMockQuery = () => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
  });

  return {
    from: vi.fn().mockImplementation(() => createMockQuery()),
    functions: {
      invoke: vi.fn(),
    },
  };
};

export const resetMockSupabaseClient = (client: MockSupabaseClient) => {
  vi.clearAllMocks();
  // Reset all mock implementations
  Object.values(client).forEach((method) => {
    if (typeof method === 'function') {
      (method as ReturnType<typeof vi.fn>).mockClear();
    } else if (typeof method === 'object') {
      Object.values(method).forEach((nestedMethod) => {
        if (typeof nestedMethod === 'function') {
          (nestedMethod as ReturnType<typeof vi.fn>).mockClear();
        }
      });
    }
  });
};
