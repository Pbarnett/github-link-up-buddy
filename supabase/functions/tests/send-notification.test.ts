// supabase/functions/tests/send-notification.test.ts
import { describe, it, expect, vi, beforeEach, afterEach, Mocked, SpyInstance } from 'vitest';

// --- Mock Deno.env.get ---
// Store original Deno object if it exists, otherwise create a mock structure
const originalDeno = globalThis.Deno;
const mockEnvGet = vi.fn();
vi.stubGlobal('Deno', {
  ...originalDeno, // Spread original Deno properties if any
  env: {
    get: mockEnvGet,
    // Mock other Deno.env properties if used by the function
  },
});

// --- Mock Supabase Client ---
const mockSupabaseSingle = vi.fn();
const mockSupabaseSelect = vi.fn();
const mockSupabaseInsert = vi.fn();
const mockSupabaseEq = vi.fn();
const mockAuthAdminGetUserById = vi.fn();

// Create chainable mock methods
mockSupabaseSelect.mockReturnValue({ single: mockSupabaseSingle });
mockSupabaseInsert.mockReturnValue({ select: mockSupabaseSelect });
mockSupabaseEq.mockReturnValue({ single: mockSupabaseSingle });

const mockSupabaseClientInstance = {
  from: vi.fn((tableName: string) => {
    if (tableName === 'notifications') {
      return {
        insert: mockSupabaseInsert,
      };
    } else if (tableName === 'users') {
      return {
        select: mockSupabaseSelect,
        eq: mockSupabaseEq,
      };
    }
    // Default return
    return {
      insert: mockSupabaseInsert,
      select: mockSupabaseSelect,
      eq: mockSupabaseEq,
    };
  }),
  auth: { admin: { getUserById: mockAuthAdminGetUserById } },
};
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockSupabaseClientInstance),
}));

// --- Mock Resend SDK ---
const mockResendEmailsSend = vi.fn();
vi.mock('npm:resend', () => ({
  Resend: vi.fn(() => ({
    emails: { send: mockResendEmailsSend },
  })),
}));

// --- Test Suite ---
describe('send-notification Edge Function', () => {
  let consoleLogSpy: SpyInstance, consoleErrorSpy: SpyInstance, consoleWarnSpy: SpyInstance;
  let sendNotificationHandler: (req: Request) => Promise<Response>;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Default environment variable mocks
    mockEnvGet.mockImplementation((key: string) => {
      const envs: Record<string, string | undefined> = {
        'SUPABASE_URL': 'http://mock-supabase.url',
        'SUPABASE_SERVICE_ROLE_KEY': 'mock-service-role-key',
        'VITE_RESEND_API_KEY': 'mock-resend-api-key',
        'RESEND_FROM_EMAIL': 'from@example.com',
        'VITE_TWILIO_ACCOUNT_SID': undefined, // Default to not configured
      };
      return envs[key];
    });

    // Default Supabase client mocks
    mockSupabaseSingle.mockResolvedValue({ data: { id: 'notification_id_123' }, error: null }); // For insert
    mockAuthAdminGetUserById.mockResolvedValue({ data: { user: { id: 'user123', email: 'test@example.com' } }, error: null });

    // Default Resend mock
    mockResendEmailsSend.mockResolvedValue({ data: { id: 'resend_email_id_123' }, error: null });

    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Import the testable handler
    try {
      console.log("Attempting to import send-notification handler...");
      const module = await import('../send-notification/index.ts');
      console.log("Import successful, available exports:", Object.keys(module));
      sendNotificationHandler = (module as any).testableHandler;
      if (!sendNotificationHandler) {
        console.warn("Test setup: testableHandler not found in send-notification/index.ts");
        console.warn("Available exports:", Object.keys(module));
        sendNotificationHandler = async (_req: Request) => new Response("testableHandler not found", { status: 501 });
      } else {
        console.log("testableHandler found and assigned successfully");
      }
    } catch (error) {
      console.error("Test setup: Failed to import send-notification handler:", error);
      console.error("Error details:", error.stack);
      sendNotificationHandler = async (_req: Request) => new Response("Handler import failed", { status: 501 });
    }
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  const createMockRequest = (body: any, method = 'POST') =>
    new Request('http://localhost/send-notification', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

  it('1. Valid Request (booking_success): records notification, sends email, returns 200', async () => {
    const requestBody = {
      user_id: 'user123',
      type: 'booking_success',
      payload: { pnr: 'PNR123', airline: 'TestAir', flight_number: 'TA101', departure_datetime: '2024-12-25T10:00:00Z', price: 250 },
    };
    const response = await sendNotificationHandler(createMockRequest(requestBody));
    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response text:', responseText);
    
    if (response.status === 501) {
      throw new Error(`Handler not properly imported: ${responseText}`);
    }
    
    const body = JSON.parse(responseText);

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.notification_id).toBe('notification_id_123');
    expect(mockSupabaseInsert).toHaveBeenCalledWith(expect.objectContaining({ user_id: 'user123', type: 'booking_success' }));
    expect(mockAuthAdminGetUserById).toHaveBeenCalledWith('user123');
    expect(mockResendEmailsSend).toHaveBeenCalledWith(expect.objectContaining({
      to: ['test@example.com'],
      subject: '✈️ Your flight is booked!',
      html: expect.stringContaining('PNR123'),
    }));
  });

  it('2. Valid Request (booking_failure): records notification, sends email', async () => {
    const requestBody = { user_id: 'user123', type: 'booking_failure', payload: { error: 'Payment declined' }};
    await sendNotificationHandler(createMockRequest(requestBody));
    expect(mockResendEmailsSend).toHaveBeenCalledWith(expect.objectContaining({ subject: '⚠️ Important: Flight Booking Issue' }));
  });

  it('3. Valid Request (reminder_23h): records notification, sends email', async () => {
    const requestBody = { user_id: 'user123', type: 'reminder_23h', payload: { pnr: 'PNRXYZ' }};
    await sendNotificationHandler(createMockRequest(requestBody));
    expect(mockResendEmailsSend).toHaveBeenCalledWith(expect.objectContaining({ subject: '✈️ Reminder: Your Flight is in Approximately 23 Hours!' }));
  });

  it('4. Skips email if Resend API key is missing, logs warning', async () => {
    mockEnvGet.mockImplementation((key: string) => {
      const envs: Record<string, string | undefined> = {
        'SUPABASE_URL': 'http://mock-supabase.url',
        'SUPABASE_SERVICE_ROLE_KEY': 'mock-service-role-key',
        'VITE_RESEND_API_KEY': undefined, // Explicitly undefined for this test
        'RESEND_FROM_EMAIL': 'from@example.com',
        'VITE_TWILIO_ACCOUNT_SID': undefined,
      };
      return envs[key];
    });

    const requestBody = { user_id: 'user123', type: 'booking_success', payload: {} };
    await sendNotificationHandler(createMockRequest(requestBody));

    expect(mockResendEmailsSend).not.toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('RESEND_API_KEY (VITE_RESEND_API_KEY) not configured'));
  });

  it('5a. Logs SMS stub message if Twilio SID is present', async () => {
    mockEnvGet.mockImplementation((key: string) => {
        if (key === 'VITE_TWILIO_ACCOUNT_SID') return 'twilio_sid_mock';
        if (key === 'SUPABASE_URL') return 'http://mock-supabase.url';
        if (key === 'SUPABASE_SERVICE_ROLE_KEY') return 'mock-service-role-key';
        if (key === 'VITE_RESEND_API_KEY') return 'mock-resend-api-key';
        if (key === 'RESEND_FROM_EMAIL') return 'from@example.com';
        return undefined;
    });

    const requestBody = { user_id: 'user123', type: 'booking_success', payload: {} };
    await sendNotificationHandler(createMockRequest(requestBody));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('SMS STUB: Would attempt to send SMS'));
  });

  it('5b. Logs SMS not configured if Twilio SID is missing', async () => {
    // Default Deno.env.get mock already returns undefined for VITE_TWILIO_ACCOUNT_SID
    const requestBody = { user_id: 'user123', type: 'booking_success', payload: {} };
    await sendNotificationHandler(createMockRequest(requestBody));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('SMS (Twilio SID) not configured, skipping SMS'));
  });

  it('6. Skips email if user email not found, logs warning', async () => {
    mockAuthAdminGetUserById.mockResolvedValue({ data: { user: null }, error: { message: 'User not found' } });
    // Mock fallback to public.users if that's part of the logic being tested
    mockSupabaseClientInstance.from.mockImplementation((tableName) => {
        if (tableName === 'users') {
            return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), single: vi.fn().mockResolvedValue({data: null, error: new Error("Not found in public.users")}) };
        }
        return { insert: mockSupabaseInsert, select: mockSupabaseSelect, eq: mockSupabaseEq }; // Default for 'notifications'
    });


    const requestBody = { user_id: 'user_no_email', type: 'booking_success', payload: {} };
    await sendNotificationHandler(createMockRequest(requestBody));

    expect(mockResendEmailsSend).not.toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to fetch email for user user_no_email'));
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Also failed to fetch email from public.users'));
  });

  it('7. Returns 500 if database insert fails', async () => {
    mockSupabaseSingle.mockResolvedValueOnce({ data: null, error: new Error('DB Insert Failed') }); // For insert

    const requestBody = { user_id: 'user_db_fail', type: 'booking_success', payload: {} };
    const response = await sendNotificationHandler(createMockRequest(requestBody));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toContain('Failed to record notification: DB Insert Failed');
  });

  it('8a. Returns 400 if user_id is missing', async () => {
    const requestBody = { type: 'booking_success', payload: {} }; // Missing user_id
    const response = await sendNotificationHandler(createMockRequest(requestBody));
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error).toBe('Missing user_id or type');
  });

  it('8b. Returns 400 if type is missing', async () => {
    const requestBody = { user_id: 'user123', payload: {} }; // Missing type
    const response = await sendNotificationHandler(createMockRequest(requestBody));
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error).toBe('Missing user_id or type');
  });
});
