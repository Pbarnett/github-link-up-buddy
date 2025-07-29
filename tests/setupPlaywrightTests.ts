import * as nodeCrypto from 'node:crypto';

export default async function setupPlaywrightTests() {
  // Set up environment variables for testing before any imports
  Object.defineProperty(process, 'env', {
    value: {
      ...process.env,
      NODE_ENV: 'test',
      SUPABASE_URL: process.env.SUPABASE_URL || 'http://localhost:54321',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || 'test-anon-key',
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'process.env.STRIPE_TEST_KEY || "sk_test_PLACEHOLDER"',
      LAUNCHDARKLY_SDK_KEY: process.env.LAUNCHDARKLY_SDK_KEY || 'sdk-demo-key',
    },
    configurable: true,
  });

  // Crypto API polyfill using Node.js crypto for OAuth token generation
  if (!globalThis.crypto) {
    globalThis.crypto = {
      getRandomValues: nodeCrypto.getRandomValues || function(arr) {
        const bytes = nodeCrypto.randomBytes(arr.length);
        for (let i = 0; i < arr.length; i++) {
          arr[i] = bytes[i];
        }
        return arr;
      },
      randomUUID: nodeCrypto.randomUUID || function() {
        return nodeCrypto.randomBytes(16).toString('hex');
      },
      subtle: nodeCrypto.webcrypto?.subtle || {}
    } as any;
  }

  // Base64 encoding/decoding for JWT tokens
  if (!globalThis.atob) {
    globalThis.atob = function(str) {
      return Buffer.from(str, 'base64').toString('binary');
    };
  }

  if (!globalThis.btoa) {
    globalThis.btoa = function(str) {
      return Buffer.from(str, 'binary').toString('base64');
    };
  }

  // URL constructor for OAuth redirects
  if (!globalThis.URL && typeof URL !== 'undefined') {
    globalThis.URL = URL;
  }

  // URLSearchParams for OAuth parameter parsing  
  if (!globalThis.URLSearchParams && typeof URLSearchParams !== 'undefined') {
    globalThis.URLSearchParams = URLSearchParams;
  }

  console.log('✅ Playwright test setup completed');
}
