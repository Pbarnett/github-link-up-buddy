// supabase/functions/tests/send-reminder.test.ts
import { describe, it, expect, vi, beforeEach, afterEach, Mocked, SpyInstance } from 'vitest';

// --- Mock Deno.env.get ---
const originalDeno = globalThis.Deno;
const mockEnvGet = vi.fn();
vi.stubGlobal('Deno', {
  ...originalDeno,
  env: { get: mockEnvGet },
});

// --- Mock Supabase Client ---
const mockSupabaseSingle = vi.fn(); // For checks like existing notification
const mockSupabaseLimit = vi.fn(() => ({ maybeSingle: mockSupabaseSingle }));
const mockSupabaseLte = vi.fn().mockReturnThis();
const mockSupabaseGte = vi.fn(() => ({ lte: mockSupabaseLte, lt: mockSupabaseLte })); // lt for departure_datetime
const mockSupabaseEq = vi.fn(() => ({ gte: mockSupabaseGte, limit: mockSupabaseLimit }));
const mockSupabaseSelectResult = vi.fn(); // This will be the actual .select().eq()... result
const mockSupabaseFromChainedMethods = {
  select: vi.fn(() => mockSupabaseSelectResult), // Default to returning the result mock
  eq: mockSupabaseEq, // For specific eq chains if needed directly
};

const mockSupabaseClientInstance = {
  from: vi.fn((tableName: string) => {
    // Differentiation for the duplicate notification check vs bookings query
    if (tableName === 'notifications') {
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(), // for type, user_id, payload->>booking_id
        limit: mockSupabaseLimit,
      };
    }
    // Default for 'bookings' table
    mockSupabaseSelectResult.mockImplementation(() => ({ // Ensure select() is chainable for bookings query
        eq: mockSupabaseEq, // for status
        gte: mockSupabaseGte, // for departure_datetime
        lt: mockSupabaseLte, // for departure_datetime
    }));
    return mockSupabaseFromChainedMethods;
  }),
};
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockSupabaseClientInstance),
}));


// --- Mock global fetch ---
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// --- Test Suite ---
describe('send-reminder Edge Function', () => {
  let consoleLogSpy: SpyInstance, consoleErrorSpy: SpyInstance, consoleWarnSpy: SpyInstance;
  let sendReminderHandler: (req: Request) => Promise<Response>;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Default environment variable mocks
    mockEnvGet.mockImplementation((key: string) => {
      if (key === 'SUPABASE_URL') return 'http://mock-supabase.url';
      if (key === 'SUPABASE_SERVICE_ROLE_KEY') return 'mock-service-role-key';
      return undefined;
    });

    // Default fetch mock (successful invocation of send-notification)
    mockFetch.mockResolvedValue(new Response(JSON.stringify({ success: true, notification_id: 'notif_123' }), { status: 200 }));

    // Default Supabase booking query (no bookings due)
    // This setup makes select().eq().gte().lt() return the final promise
    (mockSupabaseFromChainedMethods.select() as any).eq().gte().lt.mockResolvedValue({ data: [], error: null });

    // Default for duplicate notification check (no existing notification)
    mockSupabaseSingle.mockResolvedValue({ data: null, error: null });
    
    // Ensure the complex query chain works properly
    mockSupabaseEq.mockReturnValue({
      gte: mockSupabaseGte,
      limit: mockSupabaseLimit,
    });
    
    mockSupabaseGte.mockReturnValue({
      lte: mockSupabaseLte,
      lt: mockSupabaseLte, // Both lte and lt should work
    });
    
    mockSupabaseLte.mockResolvedValue({ data: [], error: null });
    mockSupabaseLimit.mockReturnValue({ maybeSingle: mockSupabaseSingle });


    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const module = await import('../send-reminder/index.ts');
    sendReminderHandler = (module as any).testableHandler ||
        (module as any).default?.handler ||
        (async (_req: Request) => new Response("Handler not found in module", { status: 501 }));
    if (sendReminderHandler.toString().includes("Handler not found in module")) {
        console.warn("Test setup: Could not get testableHandler from send-reminder/index.ts. Tests may not run correctly.");
    }
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  const createMockReminderRequest = (method = 'POST') =>
    new Request('http://localhost/send-reminder', { method });

  it('1. should do nothing if no bookings are due for reminder', async () => {
    // Default mock for bookings query (empty array) is already set in beforeEach
    const response = await sendReminderHandler(createMockReminderRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.message).toContain('No bookings due for reminder');
    expect(body.reminders_sent).toBe(0);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('2. should send one reminder if one booking is due', async () => {
    const mockBooking = {
      id: 'booking_1', user_id: 'user_A', pnr: 'PNR001',
      departure_datetime: new Date(Date.now() + 23.5 * 60 * 60 * 1000).toISOString(), // ~23.5 hours from now
      flight_details: { airline: 'TestAir', flight_number: 'TA101' }, price: 100, currency: 'USD'
    };
    (mockSupabaseFromChainedMethods.select() as any).eq().gte().lt.mockResolvedValueOnce({ data: [mockBooking], error: null });
    // mockSupabaseSingle.mockResolvedValueOnce({ data: null, error: null }); // Duplicate check: no existing

    await sendReminderHandler(createMockReminderRequest());

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      'http://mock-supabase.url/functions/v1/send-notification',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': 'Bearer mock-service-role-key',
          'apikey': 'mock-service-role-key',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          user_id: mockBooking.user_id,
          type: 'reminder_23h',
          payload: expect.objectContaining({
            booking_id: mockBooking.id,
            pnr: mockBooking.pnr,
            departure_datetime: mockBooking.departure_datetime,
            airline: 'TestAir'
          }),
        }),
      })
    );
    const response = await sendReminderHandler(createMockReminderRequest()); // Call again to get the response after mocks ran
    const body = await response.json();
    expect(body.reminders_sent).toBe(1); // This assertion needs the test to run the handler again or capture result differently
  });

  it('3. should send multiple reminders if multiple bookings are due', async () => {
    const mockBooking1 = { id: 'booking_2', user_id: 'user_B', pnr: 'PNR002', departure_datetime: new Date(Date.now() + 23.6 * 60 * 60 * 1000).toISOString(), flight_details: {} };
    const mockBooking2 = { id: 'booking_3', user_id: 'user_C', pnr: 'PNR003', departure_datetime: new Date(Date.now() + 23.7 * 60 * 60 * 1000).toISOString(), flight_details: {} };
    (mockSupabaseFromChainedMethods.select() as any).eq().gte().lt.mockResolvedValueOnce({ data: [mockBooking1, mockBooking2], error: null });
    // mockSupabaseSingle.mockResolvedValue({ data: null, error: null }); // No existing for both

    const response = await sendReminderHandler(createMockReminderRequest()); // Call to execute
    const body = await response.json();

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(body.reminders_sent).toBe(2);
  });

  it('4. should skip reminder if already sent (duplicate check active)', async () => {
    const mockBooking = { id: 'booking_4', user_id: 'user_D', pnr: 'PNR004', departure_datetime: new Date(Date.now() + 23.8 * 60 * 60 * 1000).toISOString(), flight_details: {} };
    (mockSupabaseFromChainedMethods.select() as any).eq().gte().lt.mockResolvedValueOnce({ data: [mockBooking], error: null }); // Booking is due
    mockSupabaseSingle.mockResolvedValueOnce({ data: { id: 'existing_notif_id' }, error: null }); // Simulate existing notification found

    const response = await sendReminderHandler(createMockReminderRequest());
    const body = await response.json();

    expect(mockFetch).not.toHaveBeenCalled();
    expect(body.reminders_sent).toBe(0);
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Reminder_23h notification already exists for booking booking_4'));
  });

  it('5. should return 500 if error querying bookings', async () => {
    (mockSupabaseFromChainedMethods.select() as any).eq().gte().lt.mockResolvedValueOnce({ data: null, error: new Error('Database Query Failed') });

    const response = await sendReminderHandler(createMockReminderRequest());
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toContain('Failed to query bookings for reminders: Database Query Failed');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('6. should continue processing if one send-notification call fails', async () => {
    const mockBooking1 = { id: 'booking_5', user_id: 'user_E', pnr: 'PNR005', departure_datetime: new Date(Date.now() + 23.1 * 60 * 60 * 1000).toISOString(), flight_details: {} };
    const mockBooking2 = { id: 'booking_6', user_id: 'user_F', pnr: 'PNR006', departure_datetime: new Date(Date.now() + 23.2 * 60 * 60 * 1000).toISOString(), flight_details: {} };
    (mockSupabaseFromChainedMethods.select() as any).eq().gte().lt.mockResolvedValueOnce({ data: [mockBooking1, mockBooking2], error: null });
    // mockSupabaseSingle.mockResolvedValue({ data: null, error: null }); // No existing for both

    mockFetch
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: false, error: 'Failed to send' }), { status: 500 })) // Fail for booking1
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, notification_id: 'notif_for_booking2' }), { status: 200 })); // Succeed for booking2

    const response = await sendReminderHandler(createMockReminderRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(body.reminders_sent).toBe(1); // Only one succeeded
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to send notification for booking booking_5'));
  });
});
