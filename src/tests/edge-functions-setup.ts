import { vi } from 'vitest';

// Mock Deno global
global.Deno = {
  env: {
    get: (key: string) => process.env[key],
  },
} as any;

// Set up test environment variables
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
process.env.STRIPE_SECRET_KEY = 'sk_test_123';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_123';
process.env.USE_MANUAL_CAPTURE = 'true';

console.log('Edge functions test setup completed');
