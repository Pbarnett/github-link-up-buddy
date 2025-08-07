import { vi } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../../types/database'

// Mock Supabase client type that includes all methods
export type MockSupabaseClient = {
  from: ReturnType<typeof vi.fn>
  auth: {
    getUser: ReturnType<typeof vi.fn>
    getSession: ReturnType<typeof vi.fn>
    onAuthStateChange: ReturnType<typeof vi.fn>
    signOut: ReturnType<typeof vi.fn>
    signInWithPassword: ReturnType<typeof vi.fn>
    signInWithOAuth: ReturnType<typeof vi.fn>
    signUp: ReturnType<typeof vi.fn>
    getSettings: ReturnType<typeof vi.fn>
  }
  rpc: ReturnType<typeof vi.fn>
  functions: {
    invoke: ReturnType<typeof vi.fn>
  }
  channel: ReturnType<typeof vi.fn>
  removeChannel: ReturnType<typeof vi.fn>
  storage: {
    from: ReturnType<typeof vi.fn>
  }
  realtime: {
    channel: ReturnType<typeof vi.fn>
  }
}

// Create a chainable query mock that supports all Supabase operations
const createChainableQueryMock = () => {
  const mockQuery = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    like: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    contains: vi.fn().mockReturnThis(),
    containedBy: vi.fn().mockReturnThis(),
    rangeGt: vi.fn().mockReturnThis(),
    rangeGte: vi.fn().mockReturnThis(),
    rangeLt: vi.fn().mockReturnThis(),
    rangeLte: vi.fn().mockReturnThis(),
    rangeAdjacent: vi.fn().mockReturnThis(),
    overlaps: vi.fn().mockReturnThis(),
    textSearch: vi.fn().mockReturnThis(),
    match: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    filter: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockReturnThis(),
    csv: vi.fn().mockReturnThis(),
    geojson: vi.fn().mockReturnThis(),
    explain: vi.fn().mockReturnThis(),
    rollback: vi.fn().mockReturnThis(),
    returns: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    // Promise interface
    then: vi.fn((onFulfilled) => {
      const result = { data: [], error: null }
      if (onFulfilled) {
        return Promise.resolve(onFulfilled(result))
      }
      return Promise.resolve(result)
    }),
    catch: vi.fn(() => {
      return Promise.resolve({ data: [], error: null })
    }),
    finally: vi.fn((onFinally) => {
      if (onFinally) {
        onFinally()
      }
      return Promise.resolve({ data: [], error: null })
    }),
  }
  
  return mockQuery
}

// Create comprehensive mock Supabase client
export const createMockSupabaseClient = (): MockSupabaseClient => ({
  from: vi.fn(() => createChainableQueryMock()),
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: { user: { id: 'test-user-id', email: 'test@example.com' } },
      error: null
    }),
    getSession: vi.fn().mockResolvedValue({
      data: { session: { user: { id: 'test-user-id' } } },
      error: null
    }),
    onAuthStateChange: vi.fn((callback) => {
      // Simulate auth state change
      setTimeout(() => {
        callback('SIGNED_IN', { user: { id: 'test-user-id' } })
      }, 0)
      return {
        data: { subscription: { unsubscribe: vi.fn() } },
        error: null
      }
    }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    signInWithPassword: vi.fn().mockResolvedValue({
      data: { user: { id: 'test-user-id', email: 'test@example.com' }, session: { access_token: 'test-token' } },
      error: null
    }),
    signInWithOAuth: vi.fn().mockResolvedValue({
      data: { user: { id: 'test-user-id' }, session: { access_token: 'test-token' } },
      error: null
    }),
    signUp: vi.fn().mockResolvedValue({
      data: { user: { id: 'test-user-id' }, session: { access_token: 'test-token' } },
      error: null
    }),
    getSettings: vi.fn().mockResolvedValue({
      data: { settings: {} },
      error: null
    })
  },
  rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
  functions: {
    invoke: vi.fn().mockResolvedValue({ data: null, error: null })
  },
  channel: vi.fn(() => ({
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn().mockReturnThis(),
    unsubscribe: vi.fn().mockReturnThis()
  })),
  removeChannel: vi.fn(),
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn().mockResolvedValue({ data: { path: 'test-path' }, error: null }),
      download: vi.fn().mockResolvedValue({ data: new Blob(), error: null }),
      remove: vi.fn().mockResolvedValue({ data: [], error: null }),
      list: vi.fn().mockResolvedValue({ data: [], error: null }),
      getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'test-url' } })
    }))
  },
  realtime: {
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
      unsubscribe: vi.fn().mockReturnThis()
    }))
  }
})

// Export default mock client
export const mockSupabaseClient = createMockSupabaseClient()
