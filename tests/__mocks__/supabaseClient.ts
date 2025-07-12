// tests/__mocks__/supabaseClient.ts
import { vi } from 'vitest';

// Export mock functions so tests can configure them
export const mockSupabaseSingle = vi.fn();
export const mockSupabaseSelect = vi.fn();
export const mockSupabaseInsert = vi.fn();
export const mockSupabaseUpdate = vi.fn();
export const mockSupabaseEq = vi.fn();
export const mockAuthAdminGetUserById = vi.fn();

// Create chainable mock methods
mockSupabaseSelect.mockReturnValue({ single: mockSupabaseSingle });
mockSupabaseInsert.mockReturnValue({ select: vi.fn().mockReturnValue({ single: mockSupabaseSingle }) });
mockSupabaseUpdate.mockReturnValue({ eq: vi.fn().mockReturnValue({ single: mockSupabaseSingle }) });
mockSupabaseEq.mockReturnValue({ single: mockSupabaseSingle });

export const mockSupabaseClientInstance = {
  from: vi.fn((tableName: string) => {
    if (tableName === 'notifications') {
      return {
        insert: mockSupabaseInsert,
      };
    } else if (tableName === 'users') {
      return {
        select: mockSupabaseSelect,
        eq: mockSupabaseEq,
      };
    } else if (tableName === 'notification_deliveries') {
      return {
        insert: mockSupabaseInsert,
        update: mockSupabaseUpdate,
      };
    }
    // Default return
    return {
      insert: mockSupabaseInsert,
      select: mockSupabaseSelect,
      update: mockSupabaseUpdate,
      eq: mockSupabaseEq,
    };
  }),
  auth: { admin: { getUserById: mockAuthAdminGetUserById } },
};

export const createClient = vi.fn(() => mockSupabaseClientInstance);

export function __resetMocks() {
  vi.clearAllMocks();
  
  // Reset default behaviors
  mockSupabaseSelect.mockReturnValue({ single: mockSupabaseSingle });
  mockSupabaseInsert.mockReturnValue({ select: vi.fn().mockReturnValue({ single: mockSupabaseSingle }) });
  mockSupabaseUpdate.mockReturnValue({ eq: vi.fn().mockReturnValue({ single: mockSupabaseSingle }) });
  mockSupabaseEq.mockReturnValue({ single: mockSupabaseSingle });
}
