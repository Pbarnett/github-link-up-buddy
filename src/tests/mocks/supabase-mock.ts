// src/tests/mocks/supabase-mock.ts
import { vi } from 'vitest';

// Create a comprehensive, reusable Supabase mock
export const createSupabaseMock = () => {
  const mockSingle = vi.fn();
  const mockMaybeSingle = vi.fn();
  const mockNot = vi.fn();
  const mockEq = vi.fn();
  const mockGte = vi.fn();
  const mockLte = vi.fn();
  const mockLt = vi.fn();
  const mockOrder = vi.fn();
  const mockLimit = vi.fn();
  const mockInsert = vi.fn();
  const mockUpdate = vi.fn();
  const mockSelect = vi.fn();
  const mockFrom = vi.fn();
  const mockFunctionsInvoke = vi.fn();
  const mockAuthGetUser = vi.fn();
  const mockAuthAdminGetUserById = vi.fn();

  // Create a comprehensive chainable query object that returns the same methods across all chains
  const createQueryChain = () => ({
    eq: mockEq,
    not: mockNot,
    single: mockSingle,
    maybeSingle: mockMaybeSingle,
    gte: mockGte,
    lte: mockLte,
    lt: mockLt,
    order: mockOrder,
    limit: mockLimit,
  });

  // Set up all chainable methods to return the full query chain
  mockSelect.mockReturnValue(createQueryChain());
  mockEq.mockReturnValue(createQueryChain());
  mockNot.mockReturnValue(createQueryChain());
  mockGte.mockReturnValue(createQueryChain());
  mockLte.mockReturnValue(createQueryChain());
  mockLt.mockReturnValue(createQueryChain());
  mockOrder.mockReturnValue(createQueryChain());
  mockLimit.mockReturnValue(createQueryChain());

  mockInsert.mockReturnValue({
    select: mockSelect,
    single: mockSingle,
  });

  mockUpdate.mockReturnValue({
    eq: mockEq,
  });

  mockFrom.mockReturnValue({
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    eq: mockEq,
  });

  const supabaseMock = {
    auth: {
      getUser: mockAuthGetUser,
      getSession: vi.fn().mockResolvedValue({
        data: { session: { access_token: 'mock-token' } },
        error: null,
      }),
      admin: {
        getUserById: mockAuthAdminGetUserById,
      },
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
      signOut: vi.fn(),
    },
    from: mockFrom,
    functions: {
      invoke: mockFunctionsInvoke,
    },
    rpc: vi.fn().mockResolvedValue({ data: {}, error: null }),
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })),
    })),
    removeChannel: vi.fn(),
  };

  return {
    supabase: supabaseMock,
    mocks: {
      mockSingle,
      mockMaybeSingle,
      mockNot,
      mockEq,
      mockGte,
      mockLte,
      mockLt,
      mockOrder,
      mockLimit,
      mockInsert,
      mockUpdate,
      mockSelect,
      mockFrom,
      mockFunctionsInvoke,
      mockAuthGetUser,
      mockAuthAdminGetUserById,
    },
  };
};

// Default mock implementation
export const defaultSupabaseMock = createSupabaseMock();
