import { describe as baseDescribe, it, expect, vi, beforeEach } from 'vitest';
const describe = (process.env.RUN_EDGE_TESTS === 'true' ? baseDescribe : (baseDescribe.skip as typeof baseDescribe));

// Mock Stripe factory (local)
const mockStripe: any = {
  checkout: { sessions: { create: vi.fn() } },
  paymentMethods: { retrieve: vi.fn() },
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
  APPLY_SAVINGS_FEE: 'false',
  VITEST: '1',
}[k as any])) } } as any);

// Supabase client mock (match Edge import URL)
vi.mock('https://esm.sh/@supabase/supabase-js@2.45.0', () => {
  const client: any = {};
  client.from = vi.fn(() => client);
  client.select = vi.fn(() => client);
  client.insert = vi.fn(() => client);
  client.update = vi.fn(() => client);
  client.order = vi.fn(() => client);
  client.limit = vi.fn(() => client);
  client.eq = vi.fn(() => client);
  client.single = vi.fn();
  client.auth = { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user_1', email: 'u@example.com' } }, error: null }) };
  return {
    createClient: vi.fn(() => client),
  };
});

describe('create-payment-session fee disabled', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('creates checkout session with unit_amount equal to actual price and fee_amount_cents 0', async () => {
    const Mod: any = await import('../create-payment-session/index.ts');

    // Arrange supabase chained responses
    const { createClient }: any = await import('https://esm.sh/@supabase/supabase-js@2.45.0');
    const client = createClient();
    const singleMock = client.single as unknown as ReturnType<typeof vi.fn> & { mockResolvedValueOnce: any };
    // trip_requests
    singleMock
      .mockResolvedValueOnce({ data: { id: 'tr_1', max_price: 400, budget: null }, error: null })
      // flight_offers
      .mockResolvedValueOnce({ data: { id: 'offer_1', price: 300, currency: 'usd', trip_request_id: 'tr_1', airline: 'T', flight_number: 'T1', departure_date: '2025-08-10', return_date: '2025-08-12' }, error: null })
      // orders insert
      .mockResolvedValueOnce({ data: { id: 'order_1' }, error: null });

    // Mock Stripe
    const sessionsCreate = mockStripe.checkout.sessions.create as unknown as ReturnType<typeof vi.fn>;
    sessionsCreate.mockResolvedValue({ id: 'cs_123', url: 'https://checkout' });
    // Ensure fee is disabled for this test
    (Deno as any).env.get = vi.fn((k: string) => ({
      STRIPE_SECRET_KEY: 'sk_test_123',
      SUPABASE_URL: 'http://localhost:54321',
      SUPABASE_SERVICE_ROLE_KEY: 'service_key',
      APPLY_SAVINGS_FEE: 'false',
      VITEST: '1',
    } as any)[k as any]);

    // Act
    const req = new Request('http://local', {
      method: 'POST',
      headers: { Authorization: 'Bearer token', origin: 'http://localhost:5173' },
      body: JSON.stringify({ trip_request_id: 'tr_1', offer_id: 'offer_1' }),
    });
    const res = await Mod.testableHandler(req);

    // Assert
    expect(res.status).toBe(200);
    expect(sessionsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [ expect.objectContaining({ price_data: expect.objectContaining({ unit_amount: 30000 }) }) ],
        metadata: expect.objectContaining({ fee_amount_cents: '0' })
      })
    );
  });
});
