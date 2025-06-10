import { describe, it, expect, vi, beforeEach } from 'vitest';
// Assuming the handler is exported from index.ts and can be imported.
// Adjust the import path as necessary based on how 'serve' wraps the handler.
// We might need to mock Deno's `serve` and Supabase client creation.

// Mock Supabase client
const mockSupabaseClient = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn(),
};

// Mock Deno's environment variables and Request/Response if necessary
// For example, Deno.env.get might be used by the function.
vi.stubGlobal('Deno', {
  env: {
    get: vi.fn((key) => {
      if (key === 'SUPABASE_URL') return 'http://localhost:54321';
      if (key === 'SUPABASE_ANON_KEY') return 'test-anon-key';
      return undefined;
    }),
  },
});

// Mock createClient from Supabase (npm package version - for general use if any test utility uses it)
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockSupabaseClient),
}));

// Mock createClient from Supabase (esm.sh URL version - for the function code itself)
vi.mock('https://esm.sh/@supabase/supabase-js@2', () => ({
  createClient: vi.fn(() => mockSupabaseClient),
}));

// Import the server/handler logic.
// This is tricky because Deno's `serve` starts an actual server.
// For unit testing, we typically want to test the request handler function directly.
// If the `index.ts` directly exports the handler function before calling `serve`, that's ideal.
// Otherwise, we might need to refactor `index.ts` or use a more complex mocking strategy for `serve`.

// For this example, let's assume we can extract or import the handler.
// If `supabase/functions/get-flag/index.ts` exports its request handling logic,
// for example, as `const handler = async (req) => { ... }`, then we could import it.
// However, the provided `index.ts` uses an anonymous function within `serve`.
// We'll need to use a dynamic import or other means to get the handler.

// Due to the structure of `serve(async (req) => { ... })`,
// we'll mock `serve` itself to capture the handler.
let requestHandler: ((req: Request) => Promise<Response>) | undefined;

vi.mock('https://deno.land/std@0.168.0/http/server.ts', () => ({
  serve: vi.fn((handler) => {
    requestHandler = handler; // Capture the handler
  }),
}));

describe('get-flag Edge Function', () => {
  beforeEach(async () => {
    // Reset mocks for each test
    vi.clearAllMocks();

    // Dynamically import the function to trigger serve mock and capture the handler.
    // This ensures `serve` is called with the actual handler from the latest version of index.ts.
    // The path must be relative to this test file.
    await import('../get-flag/index.ts');

    // Ensure requestHandler is captured. If not, the mock for `serve` might not be working as expected.
    if (!requestHandler) {
      throw new Error("Request handler was not captured by the 'serve' mock. Check mock setup.");
    }
  });

  it('should return enabled: true when flag exists and is enabled', async () => {
    mockSupabaseClient.single.mockResolvedValueOnce({
      data: { value: { enabled: true } },
      error: null,
    });

    const request = new Request('http://localhost/get-flag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test-jwt' },
      body: JSON.stringify({ key: 'auto_booking_v2' }),
    });

    if (!requestHandler) throw new Error("requestHandler not set");
    const response = await requestHandler(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.enabled).toBe(true);
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('feature_flags');
    expect(mockSupabaseClient.select).toHaveBeenCalledWith('value');
    expect(mockSupabaseClient.eq).toHaveBeenCalledWith('key', 'auto_booking_v2');
  });

  it('should return enabled: false when flag exists and is disabled', async () => {
    mockSupabaseClient.single.mockResolvedValueOnce({
      data: { value: { enabled: false } },
      error: null,
    });

    const request = new Request('http://localhost/get-flag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test-jwt' },
      body: JSON.stringify({ key: 'some_other_flag' }),
    });

    if (!requestHandler) throw new Error("requestHandler not set");
    const response = await requestHandler(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.enabled).toBe(false);
  });

  it('should return enabled: false and message when flag is not found', async () => {
    mockSupabaseClient.single.mockResolvedValueOnce({
      data: null,
      error: { code: 'PGRST116', message: 'Row not found' }, // PGRST116 indicates 0 rows
    });

    const request = new Request('http://localhost/get-flag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test-jwt' },
      body: JSON.stringify({ key: 'non_existent_flag' }),
    });

    if (!requestHandler) throw new Error("requestHandler not set");
    const response = await requestHandler(request);
    const body = await response.json();

    expect(response.status).toBe(200); // As per implementation
    expect(body.enabled).toBe(false);
    expect(body.message).toBe('Flag not found');
  });

  it('should return 400 if key is missing', async () => {
    const request = new Request('http://localhost/get-flag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test-jwt' },
      body: JSON.stringify({}), // Missing key
    });

    if (!requestHandler) throw new Error("requestHandler not set");
    const response = await requestHandler(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('Missing key');
  });

  it('should return enabled: false and message if flag data is malformed (e.g. value is not an object)', async () => {
    mockSupabaseClient.single.mockResolvedValueOnce({
      data: { value: "not_an_object" }, // Malformed: value is a string
      error: null,
    });

    const request = new Request('http://localhost/get-flag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test-jwt' },
      body: JSON.stringify({ key: 'malformed_flag_value_type' }),
    });

    if (!requestHandler) throw new Error("requestHandler not set");
    const response = await requestHandler(request);
    const body = await response.json();

    expect(response.status).toBe(200); // As per implementation
    expect(body.enabled).toBe(false);
    expect(body.message).toBe('Flag data format incorrect');
  });

  it('should return enabled: false and message if flag data is malformed (e.g. enabled property missing)', async () => {
    mockSupabaseClient.single.mockResolvedValueOnce({
      data: { value: { not_enabled_prop: true } }, // Malformed: enabled property missing
      error: null,
    });

    const request = new Request('http://localhost/get-flag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test-jwt' },
      body: JSON.stringify({ key: 'malformed_flag_missing_prop' }),
    });

    if (!requestHandler) throw new Error("requestHandler not set");
    const response = await requestHandler(request);
    const body = await response.json();

    expect(response.status).toBe(200); // As per implementation
    expect(body.enabled).toBe(false);
    expect(body.message).toBe('Flag data format incorrect');
  });

  it('should return 500 if Supabase client throws an unexpected error during select', async () => {
    // This test targets errors from the Supabase client that are not PGRST116
    mockSupabaseClient.single.mockResolvedValueOnce({
      data: null,
      error: { code: 'SOME_DB_ERROR', message: 'Some other database error' },
    });

    const request = new Request('http://localhost/get-flag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test-jwt' },
      body: JSON.stringify({ key: 'test_flag_db_error' }),
    });

    if (!requestHandler) throw new Error("requestHandler not set");
    const response = await requestHandler(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe('Failed to fetch flag');
  });

  it('should return 500 for other unexpected errors (e.g. req.json() fails)', async () => {
    const request = new Request('http://localhost/get-flag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test-jwt' },
      body: "this is not json", // Malformed body, req.json() will throw
    });

    // No need to mock supabaseClient.single for this test, as error should occur before.
    if (!requestHandler) throw new Error("requestHandler not set");
    const response = await requestHandler(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe('Internal server error');
  });
});
