import { describe as baseDescribe, it, expect, vi, beforeEach } from 'vitest';
const describe = (process.env.RUN_EDGE_TESTS === 'true' ? baseDescribe : (baseDescribe as any));

// Mock Stripe factory
const mockStripe: any = {
  checkout: { sessions: { create: vi.fn().mockResolvedValue({ id: 'cs_123', url: 'https://checkout' }) } },
  paymentMethods: { retrieve: vi.fn().mockResolvedValue({ id: 'pm_1', customer: 'cus_123' }) },
  customers: { create: vi.fn().mockResolvedValue({ id: 'cus_123' }) },
};
vi.mock('../lib/stripe.ts', () => ({
  getStripe: vi.fn().mockResolvedValue(mockStripe)
}));

// For Node/Vitest context, we won't execute Deno.serve path
vi.stubGlobal('Deno', { env: { get: vi.fn((k: string) => ({
  STRIPE_SECRET_KEY: 'sk_test_123',
  SUPABASE_URL: 'http://localhost:54321',
  SUPABASE_SERVICE_ROLE_KEY: 'service_key',
  VITEST: '1',
}[k as any])) } } as any);

// Supabase client mock (local package)
vi.mock('@supabase/supabase-js', () => {
  const from = vi.fn().mockReturnThis();
  const auth = { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user_1', email: 'u@example.com' } }, error: null }) };
  const single = vi.fn();
  const eq = vi.fn().mockReturnThis();
  const insert = vi.fn().mockReturnThis();
  const select = vi.fn().mockReturnThis();
  const order = vi.fn().mockReturnThis();
  const limit = vi.fn().mockReturnThis();
  return {
    createClient: vi.fn(() => ({
      from,
      select,
      insert,
      update: vi.fn().mockReturnThis(),
      order,
      limit,
      single,
      eq,
      auth,
    })),
  };
});

describe('create-payment-session US-only gate', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('rejects non-US requests with 403 when cf-ipcountry is not US', async () => {
    const Mod: any = await import('../create-payment-session/index.ts');
    // Prepare supabase responses but they should not be reached
    const { createClient }: any = await import('@supabase/supabase-js');
    const client = createClient();
    (client.single as any).mockResolvedValueOnce({ data: { id: 'tr_1' }, error: null });

    const req = new Request('http://local', {
      method: 'POST',
      headers: { Authorization: 'Bearer token', origin: 'http://localhost:5173', 'cf-ipcountry': 'CA' },
      body: JSON.stringify({ trip_request_id: 'tr_1', offer_id: 'offer_1' }),
    });
    const res = await Mod.testableHandler(req);
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toMatch(/US customers only/i);
    // Ensure Stripe was not invoked
    expect(mockStripe.checkout.sessions.create).not.toHaveBeenCalled();
  });

  it('allows US requests (cf-ipcountry=US) and proceeds to create session', async () => {
    const Mod: any = await import('../create-payment-session/index.ts');
    const { createClient }: any = await import('@supabase/supabase-js');
    const client = createClient();
    const singleMock = client.single as any;
    // trip_requests
    singleMock
      .mockResolvedValueOnce({ data: { id: 'tr_1', max_price: 400, budget: null }, error: null })
      // flight_offers
      .mockResolvedValueOnce({ data: { id: 'offer_1', price: 300, currency: 'usd', trip_request_id: 'tr_1', airline: 'T', flight_number: 'T1', departure_date: '2025-08-10', return_date: '2025-08-12' }, error: null })
      // orders insert
      .mockResolvedValueOnce({ data: { id: 'order_1' }, error: null });

    const req = new Request('http://local', {
      method: 'POST',
      headers: { Authorization: 'Bearer token', origin: 'http://localhost:5173', 'cf-ipcountry': 'US' },
      body: JSON.stringify({ trip_request_id: 'tr_1', offer_id: 'offer_1' }),
    });
    const res = await Mod.testableHandler(req);
    expect(res.status).toBe(200);
    expect(mockStripe.checkout.sessions.create).toHaveBeenCalled();
  });

  it('allows when no geo header is present (dev/local) and proceeds', async () => {
    const Mod: any = await import('../create-payment-session/index.ts');
    const { createClient }: any = await import('@supabase/supabase-js');
    const client = createClient();
    const singleMock = client.single as any;
    // trip_requests
    singleMock
      .mockResolvedValueOnce({ data: { id: 'tr_1', max_price: 400, budget: null }, error: null })
      // flight_offers
      .mockResolvedValueOnce({ data: { id: 'offer_1', price: 300, currency: 'usd', trip_request_id: 'tr_1', airline: 'T', flight_number: 'T1', departure_date: '2025-08-10', return_date: '2025-08-12' }, error: null })
      // orders insert
      .mockResolvedValueOnce({ data: { id: 'order_1' }, error: null });

    const req = new Request('http://local', {
      method: 'POST',
      headers: { Authorization: 'Bearer token', origin: 'http://localhost:5173' },
      body: JSON.stringify({ trip_request_id: 'tr_1', offer_id: 'offer_1' }),
    });
    const res = await Mod.testableHandler(req);
    expect(res.status).toBe(200);
    expect(mockStripe.checkout.sessions.create).toHaveBeenCalled();
  });
});

