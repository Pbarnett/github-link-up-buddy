// src/tests/setupEdgeFunctionTests.ts
// Setup for edge function tests - minimal setup without DOM dependencies

import { beforeAll, afterEach, vi } from 'vitest'

// Mock Deno globally at module load time for all edge function tests
vi.stubGlobal('Deno', {
  env: {
    get: vi.fn((key: string) => {
      // Provide default values for environment variables used by edge functions
      const envs: Record<string, string | undefined> = {
        'AMADEUS_CLIENT_ID': 'mock-client-id',
        'AMADEUS_CLIENT_SECRET': 'mock-client-secret', 
        'TEST_MODE': 'true',
        'SUPABASE_URL': 'http://mock-supabase.url',
        'SUPABASE_SERVICE_ROLE_KEY': 'mock-service-role-key',
        'VITE_RESEND_API_KEY': 'mock-resend-api-key',
        'RESEND_FROM_EMAIL': 'from@example.com'
      };
      return envs[key];
    })
  }
});

// Mock console methods to prevent excessive logging during tests
beforeAll(() => {
  // Only mock console methods that are too verbose
  const originalConsoleWarn = console.warn
  console.warn = (...args) => {
    // Filter out specific warnings that are expected during tests
    const message = args[0]
    if (typeof message === 'string' && (
      message.includes('React Router') || 
      message.includes('useRoutes') ||
      message.includes('BrowserRouter')
    )) {
      return
    }
    originalConsoleWarn(...args)
  }
})

afterEach(() => {
  // Clear all mocks after each test
  vi.clearAllMocks()
})
