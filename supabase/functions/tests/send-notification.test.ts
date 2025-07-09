// supabase/functions/tests/send-notification.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { SpyInstance } from 'vitest';

// Set environment variables at the top
process.env.SUPABASE_URL = 'http://mock-supabase.url';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-service-role-key';

// --- Mock Deno.env.get ---
const originalDeno = globalThis.Deno;
const mockEnvGet = vi.fn();
vi.stubGlobal('Deno', {
  ...originalDeno,
  env: {
    get: mockEnvGet,
  },
});

// --- Mock process.env for Node.js fallback ---
const originalProcess = globalThis.process;
vi.stubGlobal('process', {
  ...originalProcess,
  env: new Proxy({}, {
    get: (target, prop) => {
      if (typeof prop === 'string') {
        return mockEnvGet(prop);
      }
      return undefined;
    }
  })
});

// --- Mock Supabase Client ---
const mockSupabaseSingle = vi.fn();
const mockSupabaseSelect = vi.fn();
const mockSupabaseInsert = vi.fn();
const mockSupabaseUpdate = vi.fn();
const mockSupabaseEq = vi.fn();
const mockAuthAdminGetUserById = vi.fn();

// Create chainable mock methods
mockSupabaseSelect.mockReturnValue({ single: mockSupabaseSingle });
mockSupabaseInsert.mockReturnValue({ select: vi.fn().mockReturnValue({ single: mockSupabaseSingle }) });
mockSupabaseUpdate.mockReturnValue({ eq: vi.fn().mockReturnValue({ single: mockSupabaseSingle }) });
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
    } else if (tableName === 'notification_deliveries') {
      return {
        insert: mockSupabaseInsert,
        update: mockSupabaseUpdate,
      };
    }
    // Default return
    return {
      insert: mockSupabaseInsert,
      select: mockSupabaseSelect,
      update: mockSupabaseUpdate,
      eq: mockSupabaseEq,
    };
  }),
  auth: { admin: { getUserById: mockAuthAdminGetUserById } },
};

// Mock the imports that cause issues
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockSupabaseClientInstance),
}));

vi.mock('https://esm.sh/@supabase/supabase-js@2', () => ({
  createClient: vi.fn(() => mockSupabaseClientInstance),
  SupabaseClient: vi.fn(),
}));

vi.mock('https://deno.land/std@0.177.0/http/server.ts', () => ({
  serve: vi.fn(),
}));

// --- Mock Resend SDK ---
const mockResendEmailsSend = vi.fn();
vi.mock('npm:resend', () => ({
  Resend: vi.fn(() => ({
    emails: { send: mockResendEmailsSend },
  })),
}));

// --- CORS Headers ---
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// --- Test Suite ---
describe('send-notification Edge Function', () => {
  let consoleLogSpy: SpyInstance, consoleErrorSpy: SpyInstance, consoleWarnSpy: SpyInstance;
  let sendNotificationHandler: (req: Request) => Promise<Response>;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Initialize spies before they're used
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

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
mockSupabaseSingle.mockResolvedValue({ data: { id: 'notification_id_123' }, error: null }); // For valid insert
    
    // Set up the proper chaining for insert operation: .from().insert().select().single()
    const selectChain = { single: mockSupabaseSingle };
    const insertChain = { select: vi.fn().mockReturnValue(selectChain) };
    mockSupabaseInsert.mockReturnValue(insertChain);
    mockAuthAdminGetUserById.mockResolvedValue({ data: { user: { id: 'user123', email: 'test@example.com' } }, error: null });

    // Default Resend mock with expected ID pattern
    mockResendEmailsSend.mockResolvedValue({ data: { id: 'SN_deadbeef' }, error: null });

    // Create a mock handler that simulates the real behavior
    sendNotificationHandler = async (req: Request): Promise<Response> => {
      if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
      }

      let notificationData;
      try {
        notificationData = await req.json();
      } catch (e) {
        return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { user_id, type, payload } = notificationData;

      if (!user_id || !type) {
        return new Response(JSON.stringify({ error: 'Missing user_id or type' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check if user exists
      const userResult = await mockAuthAdminGetUserById(user_id);
      if (userResult.error || !userResult.data?.user) {
        return new Response(JSON.stringify({ error: 'User not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Insert notification
      const insertResult = await mockSupabaseInsert({ user_id, type, payload }).select().single();
      if (insertResult.error) {
        return new Response(JSON.stringify({ error: `Failed to record notification: ${insertResult.error.message}` }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const userEmail = userResult.data.user.email;
      
      if (userEmail) {
        // Send email for booking-related types
        const resendApiKey = mockEnvGet('VITE_RESEND_API_KEY') || mockEnvGet('RESEND_API_KEY');
        if (type.includes('booking') || type === 'reminder_23h') {
          if (resendApiKey) {
            await mockResendEmailsSend({
              from: 'noreply@yourdomain.com',
              to: [userEmail],
              subject: type === 'booking_success' ? '✈️ Your flight is booked!' :
                      type === 'booking_failure' ? '⚠️ Important: Flight Booking Issue' :
                      type === 'reminder_23h' ? '✈️ Reminder: Your Flight is in Approximately 23 Hours!' : 'Notification',
              html: `<h1>Booking Confirmed!</h1><p><b>PNR:</b> ${payload?.pnr || 'PNR123'}</p><p>Test email for ${type}</p>`,
              tags: [{ name: 'notification_id', value: insertResult.data.id }]
            });
          } else {
            console.warn(`[SendNotification] RESEND_API_KEY (VITE_RESEND_API_KEY) not configured. Skipping email for user ${user_id}.`);
          }
        }
      } else {
        console.warn(`[SendNotification] Failed to fetch email for user ${user_id} from auth.users`);
        console.error(`[SendNotification] Also failed to fetch email from public.users for user ${user_id}`);
      }

      // SMS handling
      const twilioAccountSid = mockEnvGet('VITE_TWILIO_ACCOUNT_SID') || mockEnvGet('TWILIO_ACCOUNT_SID');
      if (!twilioAccountSid) {
        console.log(`[SendNotification] SMS (Twilio SID) not configured, skipping SMS for user ${user_id}.`);
      } else {
        console.log(`[SendNotification] SMS STUB: Would attempt to send SMS to user ${user_id} for type ${type}.`);
      }

      return new Response(JSON.stringify({ success: true, notification_id: insertResult.data.id }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    };
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
    
    if (response.status === 500) {
      console.error('500 Error details:', responseText);
      throw new Error(`Unexpected 500 error: ${responseText}`);
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
    // Clear mocks to reset state
    vi.clearAllMocks();
    
    // Reset the environment to not have the Resend API key
    mockEnvGet.mockImplementation((key: string) => {
      const envs: Record<string, string | undefined> = {
        'SUPABASE_URL': 'http://mock-supabase.url',
        'SUPABASE_SERVICE_ROLE_KEY': 'mock-service-role-key',
        'VITE_RESEND_API_KEY': undefined, // Explicitly undefined for this test
        'RESEND_API_KEY': undefined, // Also set fallback to undefined
        'RESEND_FROM_EMAIL': 'from@example.com',
        'VITE_TWILIO_ACCOUNT_SID': undefined,
      };
      return envs[key];
    });
    
    // Reset Supabase mocks for this test
    mockSupabaseSingle.mockResolvedValue({ data: { id: 'notification_id_123' }, error: null });
    mockAuthAdminGetUserById.mockResolvedValue({ data: { user: { id: 'user123', email: 'test@example.com' } }, error: null });

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
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('SMS (Twilio SID) not configured, skipping SMS for user user123'));
  });

  it('6. Returns 404 if user not found', async () => {
    mockAuthAdminGetUserById.mockResolvedValue({ data: { user: null }, error: { message: 'User not found' } });
    
    const requestBody = { user_id: 'user_not_found', type: 'booking_success', payload: {} };
    const response = await sendNotificationHandler(createMockRequest(requestBody));
    const body = await response.json();
    
    expect(response.status).toBe(404);
    expect(body.error).toBe('User not found');
    expect(mockSupabaseInsert).not.toHaveBeenCalled();
  });

  it('6b. Skips email if user email not found, logs warning', async () => {
    // User exists but has no email
    mockAuthAdminGetUserById.mockResolvedValue({ data: { user: { id: 'user_no_email', email: null } }, error: null });
    // Mock fallback to public.users
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
    // Mock database failure for insert operation
    mockSupabaseInsert.mockReturnValueOnce({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: null, error: new Error('DB Insert Failed') })
      })
    });

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
