import { describe as baseDescribe, it, expect, vi, beforeEach } from 'vitest';
const describe = (process.env.RUN_EDGE_TESTS === 'true' ? baseDescribe : (baseDescribe.skip as typeof baseDescribe));

// Mock Stripe factory
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
  VITEST: '1',
}[k as any])) } } as any);

// Supabase client mock (local package name)
vi.mock('@supabase/supabase-js', () => {
  const from = vi.fn().mockReturnThis();
  return {
    createClient: vi.fn(() => ({
      from,
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn(),
      eq: vi.fn().mockReturnThis(),
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user_1', email: 'u@example.com' } }, error: null }) },
    })),
  };
});

describe('create-payment-session fee integration', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('creates checkout session with total including savings fee and metadata', async () => {
    const Mod: any = await import('../create-payment-session/index.ts');

    // Arrange supabase chained responses
    const { createClient }: any = await import('@supabase/supabase-js');
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

    // Act
    const req = new Request('http://local', {
      method: 'POST',
      headers: { Authorization: 'Bearer token', origin: 'http://localhost:5173' },
      body: JSON.stringify({ trip_request_id: 'tr_1', offer_id: 'offer_1' }),
    });
    const res = await Mod.testableHandler(req);

    // Assert
    expect(res.status).toBe(200);
    expect((sessionsCreate as any)).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [ expect.objectContaining({ price_data: expect.objectContaining({ unit_amount: 30500 }) }) ],
        metadata: expect.objectContaining({ fee_model: 'savings-based', fee_amount_cents: '500', actual_price: '300' })
      }),
      expect.any(Object)
    );
  });

  it('returns 500 and does not call Stripe when trip or offer not found', async () => {
    const Mod: any = await import('../create-payment-session/index.ts');
    const { createClient }: any = await import('https://esm.sh/@supabase/supabase-js@2.45.0');
    const client = createClient();
    const singleMock = client.single as unknown as ReturnType<typeof vi.fn> & { mockResolvedValueOnce: any };
    // Simulate missing trip_request (first .single() call)
    singleMock
      .mockResolvedValueOnce({ data: null, error: { message: 'No rows returned' } });


    const req = new Request('http://local', {
      method: 'POST',
      headers: { Authorization: 'Bearer token', origin: 'http://localhost:5173' },
      body: JSON.stringify({ trip_request_id: 'missing', offer_id: 'offer_1' }),
    });
    const res = await Mod.testableHandler(req);

    expect(res.status).toBe(500);
    // Ensure Stripe was never called
    expect(mockStripe.checkout.sessions.create).not.toHaveBeenCalled();
  });

  it('returns 500 and avoids DB writes when offer is not found', async () => {
    const Mod: any = await import('../create-payment-session/index.ts');
    const { createClient }: any = await import('https://esm.sh/@supabase/supabase-js@2.45.0');
    const client = createClient();
    const singleMock = client.single as unknown as ReturnType<typeof vi.fn> & { mockResolvedValueOnce: any };
    // 1) trip_request ok
    singleMock.mockResolvedValueOnce({ data: { id: 'tr_1', max_price: 400, budget: null }, error: null });
    // 2) offer missing
    singleMock.mockResolvedValueOnce({ data: null, error: { message: 'No rows returned' } });

    const req = new Request('http://local', {
      method: 'POST',
      headers: { Authorization: 'Bearer token', origin: 'http://localhost:5173' },
      body: JSON.stringify({ trip_request_id: 'tr_1', offer_id: 'missing' }),
    });
    const res = await Mod.testableHandler(req);

    expect(res.status).toBe(500);
    expect(mockStripe.checkout.sessions.create).not.toHaveBeenCalled();
    // Verify no order was inserted
    expect(client.insert).not.toHaveBeenCalled();
    expect(client.update).not.toHaveBeenCalled();
  });
});
