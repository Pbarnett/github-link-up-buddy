import { test, expect } from '@playwright/test';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://bbonngdyfyfjqfhvoljl.supabase.co';

test.describe('CORS E2E Tests', () => {
  test('Edge Function should return proper CORS headers', async ({ request }) => {
    // Test the manage-payment-methods-kms function - refactored to use shared CORS
    const response = await request.get(`${SUPABASE_URL}/functions/v1/manage-payment-methods-kms`);
    
    // Check that the response has proper CORS headers regardless of status
    expect([200, 401, 404, 500]).toContain(response.status()); // Various expected statuses
    
    // Check that CORS headers are present
    expect(response.headers()['access-control-allow-origin']).toBe('*');
    expect(response.headers()['access-control-allow-headers']).toContain('authorization');
    expect(response.headers()['access-control-allow-headers']).toContain('x-client-info');
    expect(response.headers()['access-control-allow-headers']).toContain('apikey');
    expect(response.headers()['content-type']).toBe('application/json');
  });

  test('Edge Function should handle CORS preflight requests', async ({ request }) => {
    // Test CORS preflight request
    const response = await request.fetch(`${SUPABASE_URL}/functions/v1/manage-profiles-kms`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://example.com',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    });
    
    // Check that the OPTIONS request is successful
    expect(response.status()).toBe(200);
    
    // Check that CORS headers are present
    expect(response.headers()['access-control-allow-origin']).toBe('*');
    expect(response.headers()['access-control-allow-headers']).toContain('authorization');
    expect(response.headers()['access-control-allow-headers']).toContain('content-type');
    expect(response.headers()['access-control-allow-methods']).toContain('POST');
    expect(response.headers()['access-control-allow-methods']).toContain('OPTIONS');
  });
});
