import { describe as baseDescribe, it, expect, vi, beforeEach } from 'vitest';
const describe = (process.env.RUN_EDGE_TESTS === 'true' ? baseDescribe : (baseDescribe.skip as typeof baseDescribe));

// Mock Stripe (ESM URL)
vi.mock('https://esm.sh/stripe@14.21.0', () => {
  const paymentIntents = { create: vi.fn() };
  const checkout = { sessions: { create: vi.fn() } };
  const Ctor = vi.fn(() => ({ paymentIntents, checkout }));
  return { default: Ctor } as any;
});

// For Node/Vitest context, we won't execute Deno.serve path
vi.stubGlobal('Deno', { env: { get: vi.fn((k: string) => ({
  STRIPE_SECRET_KEY: 'sk_test_123',
  SUPABASE_URL: 'http://localhost:54321',
  SUPABASE_SERVICE_ROLE_KEY: 'service_key',
}[k as any])) } } as any);

// Supabase client mock
vi.mock('https://esm.sh/@supabase/supabase-js@2.45.0', () => {
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

// Note: We'll dynamically import the module after configuring USE_MANUAL_CAPTURE per-test.

// Under test will be imported inside each test

// Note: This test is a high-level smoke assertion around amount & metadata structure.
// In practice, your repo’s existing test harness for Edge functions may differ; adjust as needed.

describe('create-booking-request fee integration', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('computes total with fee and includes metadata on PaymentIntent path', async () => {
    // Force manual capture
    vi.doMock('../lib/config.ts', async (importOriginal) => {
      const actual: any = await importOriginal();
      return { ...actual, USE_MANUAL_CAPTURE: true };
    });
    const CreateBooking: any = await import('../create-booking-request/index.ts');

    // Arrange supabase chained responses
    const { createClient }: any = await import('https://esm.sh/@supabase/supabase-js@2.45.0');
    const client = createClient();
    // .single() is called multiple times; sequence:
    // 1) fetch flight_offers -> return offer
    // 2) insert booking_requests -> return booking_request
    // 3) update booking_requests -> return OK (can be empty)
    const singleMock = client.single as unknown as ReturnType<typeof vi.fn> & { mockResolvedValueOnce: any };
    singleMock
      .mockResolvedValueOnce({ data: { id: 'offer_1', price: 300, currency: 'usd', trip_request_id: 'tr_1', airline: 'Test', flight_number: 'T1', departure_date: '2025-08-10', return_date: '2025-08-12' }, error: null })
      .mockResolvedValueOnce({ data: { id: 'br_1' }, error: null })
      .mockResolvedValueOnce({ data: {}, error: null });

    // Mock Stripe
    const StripeMod: any = await import('https://esm.sh/stripe@14.21.0');
    const stripeCtor = StripeMod.default as any;
    const stripeInstance = stripeCtor.mock.results[0]?.value || stripeCtor();
    const piCreate = stripeInstance.paymentIntents.create as unknown as ReturnType<typeof vi.fn>;
    piCreate.mockResolvedValue({ id: 'pi_123', client_secret: 'secret' });

    // Stub Deno.env.get
    // @ts-ignore
    globalThis.Deno = { env: { get: (k: string) => ({ STRIPE_SECRET_KEY: 'sk', SUPABASE_URL: 'u', SUPABASE_SERVICE_ROLE_KEY: 's', VITEST: '1' } as any)[k] } } as any;

    // Act
    const res = await (CreateBooking as any).testableHandler(new Request('http://local', { method: 'POST', body: JSON.stringify({ userId: 'user_1', offerId: 'offer_1' }) }));
    expect(res.status).toBe(200);

    // Assert Stripe amount and metadata
    expect(piCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 30500,
        currency: 'usd',
        metadata: expect.objectContaining({
          fee_model: 'savings-based',
          actual_price: '300',
          fee_amount_cents: '500',
        }),
      }),
      expect.objectContaining({ idempotencyKey: 'pi_create_br_1' })
    );
  });

  it('computes total with fee and includes metadata on Checkout Session path', async () => {
    // Force checkout session path
    vi.doMock('../lib/config.ts', async (importOriginal) => {
      const actual: any = await importOriginal();
      return { ...actual, USE_MANUAL_CAPTURE: false };
    });
    const CreateBooking: any = await import('../create-booking-request/index.ts');

    // Arrange supabase chained responses
    const { createClient }: any = await import('https://esm.sh/@supabase/supabase-js@2.45.0');
    const client = createClient();
    const singleMock = client.single as unknown as ReturnType<typeof vi.fn> & { mockResolvedValueOnce: any };
    singleMock
      .mockResolvedValueOnce({ data: { id: 'offer_1', price: 300, currency: 'usd', trip_request_id: 'tr_1', airline: 'Test', flight_number: 'T1', departure_date: '2025-08-10', return_date: '2025-08-12' }, error: null })
      .mockResolvedValueOnce({ data: { id: 'br_1' }, error: null })
      .mockResolvedValueOnce({ data: {}, error: null });

    // Mock Stripe sessions.create
    const StripeMod: any = await import('https://esm.sh/stripe@14.21.0');
    const stripeCtor = StripeMod.default as any;
    const stripeInstance = stripeCtor.mock.results[0]?.value || stripeCtor();
    const sessionsCreate = stripeInstance.checkout.sessions.create as unknown as ReturnType<typeof vi.fn>;
    sessionsCreate.mockResolvedValue({ id: 'cs_123', url: 'https://checkout' });
    // Capture second arg (options) for idempotency assertions via mock.calls

    // Stub Deno.env.get
    // @ts-ignore
    globalThis.Deno = { env: { get: (k: string) => ({ STRIPE_SECRET_KEY: 'sk', SUPABASE_URL: 'u', SUPABASE_SERVICE_ROLE_KEY: 's', VITEST: '1' } as any)[k] } } as any;

    // Act
    const res = await (CreateBooking as any).testableHandler(new Request('http://local', { method: 'POST', body: JSON.stringify({ userId: 'user_1', offerId: 'offer_1' }) }));
    expect(res.status).toBe(200);

    expect(sessionsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'payment',
        line_items: [
          expect.objectContaining({
            price_data: expect.objectContaining({ unit_amount: 30500 })
          })
        ],
        metadata: expect.objectContaining({
          fee_model: 'savings-based',
          actual_price: '300',
          fee_amount_cents: '500',
        }),
      }),
      expect.objectContaining({ idempotencyKey: 'checkout_br_1' })
    );
  });
  it('returns 500 and does not call Stripe when offer is missing', async () => {
    // Force manual capture path for variety
    vi.doMock('../lib/config.ts', async (importOriginal) => {
      const actual: any = await importOriginal();
      return { ...actual, USE_MANUAL_CAPTURE: true };
    });
    const CreateBooking: any = await import('../create-booking-request/index.ts');

    const { createClient }: any = await import('https://esm.sh/@supabase/supabase-js@2.45.0');
    const client = createClient();
    const singleMock = client.single as unknown as ReturnType<typeof vi.fn> & { mockResolvedValueOnce: any };
    // 1) offer fetch fails
    singleMock.mockResolvedValueOnce({ data: null, error: { message: 'No rows returned' } });

    const StripeMod: any = await import('https://esm.sh/stripe@14.21.0');
    const stripeCtor = StripeMod.default as any;
    const stripeInstance = stripeCtor.mock.results[0]?.value || stripeCtor();

    const res = await (CreateBooking as any).testableHandler(new Request('http://local', { method: 'POST', body: JSON.stringify({ userId: 'u', offerId: 'missing' }) }));

    expect(res.status).toBe(500);
    expect(stripeInstance.paymentIntents.create).not.toHaveBeenCalled();
    expect(stripeInstance.checkout.sessions.create).not.toHaveBeenCalled();
  });

  it('returns 500 when Stripe PaymentIntent creation fails and no DB update persists', async () => {
    vi.doMock('../lib/config.ts', async (importOriginal) => {
      const actual: any = await importOriginal();
      return { ...actual, USE_MANUAL_CAPTURE: true };
    });
    const CreateBooking: any = await import('../create-booking-request/index.ts');

    const { createClient }: any = await import('https://esm.sh/@supabase/supabase-js@2.45.0');
    const client = createClient();
    const singleMock = client.single as unknown as ReturnType<typeof vi.fn> & { mockResolvedValueOnce: any };
    singleMock
      .mockResolvedValueOnce({ data: { id: 'offer_1', price: 300, currency: 'usd', trip_request_id: 'tr_1', airline: 'T', flight_number: 'T1', departure_date: '2025-08-10', return_date: '2025-08-12' }, error: null })
      .mockResolvedValueOnce({ data: { id: 'br_1' }, error: null });

    const StripeMod: any = await import('https://esm.sh/stripe@14.21.0');
    const stripeCtor = StripeMod.default as any;
    const stripeInstance = stripeCtor.mock.results[0]?.value || stripeCtor();
    (stripeInstance.paymentIntents.create as any).mockRejectedValue(new Error('Stripe down'));

    const res = await (CreateBooking as any).testableHandler(new Request('http://local', { method: 'POST', body: JSON.stringify({ userId: 'u', offerId: 'offer_1' }) }));

    expect(res.status).toBe(500);
    // Ensure DB update to attach PI did not occur
    expect(client.update).not.toHaveBeenCalled();
  });

  it('returns 500 when Stripe Checkout Session creation fails and no DB update persists', async () => {
    vi.doMock('../lib/config.ts', async (importOriginal) => {
      const actual: any = await importOriginal();
      return { ...actual, USE_MANUAL_CAPTURE: false };
    });
    const CreateBooking: any = await import('../create-booking-request/index.ts');

    const { createClient }: any = await import('https://esm.sh/@supabase/supabase-js@2.45.0');
    const client = createClient();
    const singleMock = client.single as unknown as ReturnType<typeof vi.fn> & { mockResolvedValueOnce: any };
    singleMock
      .mockResolvedValueOnce({ data: { id: 'offer_1', price: 300, currency: 'usd', trip_request_id: 'tr_1', airline: 'Test', flight_number: 'T1', departure_date: '2025-08-10', return_date: '2025-08-12' }, error: null })
      .mockResolvedValueOnce({ data: { id: 'br_1' }, error: null });

    const StripeMod: any = await import('https://esm.sh/stripe@14.21.0');
    const stripeCtor = StripeMod.default as any;
    const stripeInstance = stripeCtor.mock.results[0]?.value || stripeCtor();
    (stripeInstance.checkout.sessions.create as any).mockRejectedValue(new Error('Stripe down'));

    const res = await (CreateBooking as any).testableHandler(new Request('http://local', { method: 'POST', body: JSON.stringify({ userId: 'u', offerId: 'offer_1' }) }));

    expect(res.status).toBe(500);
    // Ensure DB update to attach checkout_session_id did not occur
    expect(client.update).not.toHaveBeenCalled();
  });
});

