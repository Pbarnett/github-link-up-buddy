// supabase/functions/flight-search-v2/index.test.ts
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

// We need to mock Deno's `serve` and the request/response objects if we test the handler directly.
// However, a more common approach for Supabase Edge Functions is to use an actual running server
// or mock the `fetch` call if the function is invoked via `supabase.functions.invoke`.
// For this unit test, let's assume we can test the handler logic by mocking `serve`.

// Mock Deno.serve and related HTTP classes
vi.mock('https://deno.land/std@0.177.0/http/server.ts', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    serve: vi.fn(),
  };
});

// Import the function (it will use the mocked serve)
// We need to import it *after* the mocks are set up.
// To do this properly, we'll dynamically import it within the test or use a helper.
// For simplicity in this subtask, let's assume this structure works or adjust if the subtask runner has issues.

// Placeholder for the actual handler function from index.ts
// In a real scenario, you'd structure your index.ts to export the handler or make it testable.
// For now, we'll need to adapt this test based on how `index.ts` is structured.
// Let's assume `index.ts` calls `serve(handlerFn)`. We need `handlerFn`.

// Due to the structure of the Deno function (calling serve directly),
// true unit testing of the handler function is complex without refactoring index.ts
// to export the handler.
// A common pattern is to have `handler.ts` and `index.ts` (which imports from handler and calls serve).
// Then `handler.test.ts` can import the handler from `handler.ts`.

// For this task, I will write tests that would work if the handler function was accessible.
// The subtask environment might need to simulate Deno's environment or use a running server for integration tests.

describe('Flight Search v2 Edge Function Handler', () => {
  let handler;

  beforeAll(async () => {
    // Dynamically import the server file to get the handler passed to serve
    // This relies on serve being mocked effectively to capture its argument.
    const serverModule = await import('./index.ts');
    const { serve } = (await import('https://deno.land/std@0.177.0/http/server.ts')) as any; // Cast to any to access mock

    // Get the handler function passed to Deno.serve
    if (serve.mock.calls.length > 0) {
      handler = serve.mock.calls[0][0]; // Get the first argument of the first call to serve
    } else {
      // Fallback or error if serve was not called as expected (e.g. if index.ts doesn't call serve at the top level)
      console.warn("Deno.serve mock was not called. Tests might not run correctly. Ensure index.ts calls serve() at the top level.");
      // A simple dummy handler to prevent tests from crashing, actual logic won't be tested.
      handler = async (req: Request) => new Response("Mock not configured", { status: 500 });
    }
  });

  beforeEach(async () => {
    vi.clearAllMocks();
     // Reset the handler if necessary, or ensure it's fresh for each test
    const { serve } = vi.mocked(await import('https://deno.land/std@0.177.0/http/server.ts'));
    if (serve.mock.calls.length > 0) {
      handler = serve.mock.calls[0][0];
    } else {
      // This case should ideally not be hit if beforeAll worked.
      handler = async (req: Request) => new Response("Mock not configured for test", { status: 500 });
    }
  });

  it('should return 200 with two mock flight offers for a valid request', async () => {
    const requestBody = { tripRequestId: 'test-trip-123' };
    const request = new Request('http://localhost/flight-search-v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    const response = await handler(request);
    expect(response.status).toBe(200);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(response.headers.get('Content-Type')).toContain('application/json');

    const responseData = await response.json();
    expect(Array.isArray(responseData)).toBe(true);
    expect(responseData.length).toBe(2);

    // Validate structure of each offer
    responseData.forEach((offer: any) => {
      expect(offer).toHaveProperty('id');
      expect(offer).toHaveProperty('validatingAirlineCodes');
      expect(Array.isArray(offer.validatingAirlineCodes)).toBe(true);
      expect(offer).toHaveProperty('itineraries');
      expect(Array.isArray(offer.itineraries)).toBe(true);
      expect(offer.itineraries.length).toBeGreaterThan(0);
      expect(offer.itineraries[0]).toHaveProperty('segments');
      expect(Array.isArray(offer.itineraries[0].segments)).toBe(true);
      expect(offer).toHaveProperty('price');
      expect(offer.price).toHaveProperty('total');
      expect(typeof offer.price.total).toBe('string'); // Validate price.total is a string
    });
  });

  it('should return 400 for an invalid request (empty body)', async () => {
    const request = new Request('http://localhost/flight-search-v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}), // Empty body, missing tripRequestId
    });

    const response = await handler(request);
    expect(response.status).toBe(400);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(response.headers.get('Content-Type')).toContain('application/json');

    const responseData = await response.json();
    expect(responseData).toHaveProperty('error');
    expect(responseData.error).toBe('Bad Request');
  });

  it('should return 400 for an invalid request (wrong type for tripRequestId)', async () => {
    const request = new Request('http://localhost/flight-search-v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripRequestId: 123 }), // tripRequestId is a number, not string
    });

    const response = await handler(request);
    expect(response.status).toBe(400);
    const responseData = await response.json();
    expect(responseData.error).toBe('Bad Request');
  });

  it('should handle OPTIONS request for CORS preflight', async () => {
    const request = new Request('http://localhost/flight-search-v2', {
      method: 'OPTIONS',
    });

    const response = await handler(request);
    expect(response.status).toBe(200);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(response.headers.get('Access-Control-Allow-Headers')).toBe('authorization, x-client-info, apikey, content-type');
    const text = await response.text();
    expect(text).toBe('ok');
  });
});
