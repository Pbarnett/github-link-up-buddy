// src/tests/setupEdgeFunctions.ts
import { vi } from 'vitest';

// Mock Deno global for edge function tests
if (!globalThis.Deno) {
  globalThis.Deno = {
    env: {
      get: vi.fn((key: string) => {
        // Default test environment variables
        const defaultEnv = {
          'SUPABASE_URL': 'http://localhost:54321',
          'SUPABASE_SERVICE_ROLE_KEY': 'test-service-role-key',
          'AMADEUS_BASE_URL': 'https://test.api.amadeus.com',
          'AMADEUS_API_KEY': process.env.AMADEUS_API_KEY || 'test-key',
          'AMADEUS_API_SECRET': process.env.AMADEUS_API_SECRET || 'test-secret',
          'STRIPE_SECRET_KEY': 'sk_test_mock',
        };
        return defaultEnv[key] || process.env[key];
      }),
    },
    serve: vi.fn((handler: (req: Request) => Promise<Response> | Response) => {
      // Store the handler for testing access
      (globalThis as any).__testHandler = handler;
      // Return a mock server object
      return {
        shutdown: vi.fn(),
      };
    }),
  } as any;
}

// Mock URL constructor to handle https: schemes
const originalURL = globalThis.URL;
globalThis.URL = class MockURL extends originalURL {
  constructor(url: string, base?: string) {
    // Handle Deno HTTPS imports by converting them to file paths for testing
    if (url.startsWith('https://deno.land/') || url.startsWith('https://esm.sh/')) {
      super('file://mock-deno-import', base);
      return;
    }
    super(url, base);
  }
} as any;
