// src/tests/setupEdgeFunctions.ts
import { vi } from 'vitest';

// Mock Deno global for edge function tests
if (!globalThis.Deno) {
  globalThis.Deno = {
    env: {
      get: vi.fn((key: string) => {
        // Default test environment variables
        const defaultEnv = {
          'VITEST': 'true', // Critical: prevents serve() calls in edge functions
          'SUPABASE_URL': 'https://test.supabase.co',
          'SUPABASE_SERVICE_ROLE_KEY': 'test-service-role-key',
          'SUPABASE_ANON_KEY': 'test-anon-key',
          'AMADEUS_BASE_URL': 'https://test.api.amadeus.com',
          'AMADEUS_CLIENT_ID': process.env.AMADEUS_CLIENT_ID || 'test-client-id',
          'AMADEUS_CLIENT_SECRET': process.env.AMADEUS_CLIENT_SECRET || 'test-client-secret',
          'AMADEUS_API_KEY': process.env.AMADEUS_API_KEY || 'test-key',
          'AMADEUS_API_SECRET': process.env.AMADEUS_API_SECRET || 'test-secret',
          'RESEND_API_KEY': 're_test_mock_key',
          'TWILIO_ACCOUNT_SID': 'AC_test_mock_sid',
          'TWILIO_AUTH_TOKEN': 'test_mock_token',
          'OPENAI_API_KEY': 'sk-test-mock-openai-key',
          'STRIPE_SECRET_KEY': 'sk_test_mock',
          'STRIPE_WEBHOOK_SECRET': 'whsec_test_mock',
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

// Also set environment variables in process.env for Edge Functions that check both
Object.assign(process.env, {
  VITEST: 'true',
  SUPABASE_URL: 'https://test.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
  SUPABASE_ANON_KEY: 'test-anon-key',
  STRIPE_SECRET_KEY: 'sk_test_mock',
  STRIPE_WEBHOOK_SECRET: 'whsec_test_mock',
});

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
