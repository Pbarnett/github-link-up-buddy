import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Deno.serve and related HTTP classes
vi.mock('https://deno.land/std@0.177.0/http/server.ts', () => ({
  serve: vi.fn(),
}));

// Mock Supabase client
vi.mock('https://esm.sh/@supabase/supabase-js@2', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: [],
          error: null,
        })),
      })),
    })),
  })),
}));

describe('Flight Offers v2 Edge Function', () => {
  let handler: (req: Request) => Promise<Response>;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Mock Deno environment variables
    vi.stubGlobal('Deno', {
      env: {
        get: (key: string) => {
          if (key === 'SUPABASE_URL') return 'https://test.supabase.co';
          if (key === 'SUPABASE_SERVICE_ROLE_KEY') return 'test-service-key';
          return undefined;
        },
      },
    });

    // Import the handler directly
    const module = await import('./index.ts');
    handler = module.default;
  });

  it('should return 200 with empty array for valid tripRequestId', async () => {
    const request = new Request('http://localhost/flight-offers-v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripRequestId: 'test-trip-123' }),
    });

    const response = await handler(request);
    
    expect(response.status).toBe(200);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(response.headers.get('Content-Type')).toContain('application/json');
    
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it('should return 400 for missing tripRequestId', async () => {
    const request = new Request('http://localhost/flight-offers-v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const response = await handler(request);
    
    expect(response.status).toBe(400);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    
    const data = await response.json();
    expect(data.error).toContain('tripRequestId is required');
  });

  it('should return 400 for invalid tripRequestId type', async () => {
    const request = new Request('http://localhost/flight-offers-v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripRequestId: 123 }),
    });

    const response = await handler(request);
    
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.error).toContain('tripRequestId is required');
  });

  it('should handle OPTIONS request for CORS', async () => {
    const request = new Request('http://localhost/flight-offers-v2', {
      method: 'OPTIONS',
    });

    const response = await handler(request);
    
    expect(response.status).toBe(200);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
    
    const text = await response.text();
    expect(text).toBe('ok');
  });
});
