import { describe as baseDescribe, it, expect, vi, beforeEach } from 'vitest';
const describe = (process.env.RUN_EDGE_TESTS === 'true' ? baseDescribe : (baseDescribe.skip as typeof baseDescribe));

// Mock Stripe factory (local module)
const mockStripe: any = {
  paymentIntents: { create: vi.fn() },
  checkout: { sessions: { create: vi.fn() } },
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

// Supabase client mock (local package name)
vi.mock('@supabase/supabase-js', () => {
  const from = vi.fn().mockReturnThis();
  return {
    createClient: vi.fn(() => ({
      from,
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      single: vi.fn(),
      eq: vi.fn().mockReturnThis(),
    })),
  };
});

describe('create-booking-request fee disabled', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('charges actual price only and fee_amount_cents is 0 on PaymentIntent path when disabled', async () => {
    // Force manual capture
    vi.doMock('../lib/config.ts', async (importOriginal) => {
      const actual: any = await importOriginal();
      return { ...actual, USE_MANUAL_CAPTURE: true };
    });
    const CreateBooking: any = await import('../create-booking-request/index.ts');

    // Arrange supabase chained responses
    const { createClient }: any = await import('@supabase/supabase-js');
    const client = createClient();
    const singleMock = client.single as unknown as ReturnType<typeof vi.fn> & { mockResolvedValueOnce: any };
    singleMock
      .mockResolvedValueOnce({ data: { id: 'offer_1', price: 300, currency: 'usd', trip_request_id: 'tr_1', airline: 'Test', flight_number: 'T1', departure_date: '2025-08-10', return_date: '2025-08-12' }, error: null })
      .mockResolvedValueOnce({ data: { id: 'br_1' }, error: null })
      .mockResolvedValueOnce({ data: {}, error: null });

    // Mock Stripe
    const piCreate = mockStripe.paymentIntents.create as unknown as ReturnType<typeof vi.fn>;
    piCreate.mockResolvedValue({ id: 'pi_123', client_secret: 'secret' });

    // Act
    const res = await (CreateBooking as any).testableHandler(new Request('http://local', { method: 'POST', body: JSON.stringify({ userId: 'user_1', offerId: 'offer_1' }) }));
    expect(res.status).toBe(200);

    expect(piCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 30000,
        metadata: expect.objectContaining({ fee_amount_cents: '0' })
      }),
      expect.any(Object)
    );
  });
});
