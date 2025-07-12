import { vi } from 'vitest'

// Mock Supabase client for test environment
const mockSupabaseClient = {
  from: vi.fn(() => ({
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn().mockResolvedValue({ data: { id: 'mock-notification-id' }, error: null })
      }))
    })),
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn().mockResolvedValue({ data: { id: 'user123', email: 'test@example.com' }, error: null })
      }))
    }))
  })),
  auth: {
    admin: {
      getUserById: vi.fn().mockResolvedValue({ 
        data: { user: { id: 'user123', email: 'test@example.com' } }, 
        error: null 
      })
    }
  }
}

// Export the createClient function that returns our mock
export const createClient = vi.fn(() => mockSupabaseClient)

// Export the SupabaseClient class
export const SupabaseClient = vi.fn()

export default {
  createClient,
  SupabaseClient
}
