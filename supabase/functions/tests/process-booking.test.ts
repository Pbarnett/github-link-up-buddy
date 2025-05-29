import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import handler from '../process-booking/index'; // Adjust path if actual location differs

// Mock Stripe SDK
const mockRetrieveCheckoutSession = vi.fn();
vi.mock('stripe', () => {
  const Stripe = vi.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        retrieve: mockRetrieveCheckoutSession,
      },
    },
  }));
  Stripe.errors = {
    StripeError: class StripeError extends Error {}, // Mock basic StripeError if needed
  };
  return { default: Stripe }; // Assuming Stripe is a default export
});


// Mock Supabase Admin Client
const mockSupabaseRpc = vi.fn();
const mockSupabaseUpdate = vi.fn().mockReturnThis(); // For chaining .eq()
const mockSupabaseEq = vi.fn();

vi.mock('@supabase/supabase-js', () => {
  const createClient = vi.fn().mockImplementation(() => ({
    rpc: mockSupabaseRpc,
    from: vi.fn(() => ({
      update: mockSupabaseUpdate,
      // .eq needs to be part of the object returned by update() if chained like update().eq()
      // or from() if from().select().eq()
    })),
  }));
  return { createClient };
});


// Helper to create a mock Request object
const createMockRequest = (body: any) => {
  return new Request('http://localhost', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
};

describe('Supabase Edge Function: process-booking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Stub environment variables
    vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_mock');
    vi.stubEnv('SUPABASE_URL', 'http://localhost:54321');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service_role_mock_key');

    // Reset mocks that might have chained calls
    mockSupabaseUpdate.mockReturnThis(); // Ensure `update` is chainable
    mockSupabaseEq.mockResolvedValue({ error: null }); // Default success for .eq()
    mockSupabaseUpdate.mockReturnValue({ eq: mockSupabaseEq }); // Ensure update().eq() works
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // Test Case 1: Success Scenario
  it('should process booking successfully if payment is paid and RPC succeeds', async () => {
    const sessionId = 'cs_test_success_123';
    const bookingRequestId = 'br_success_456';

    mockRetrieveCheckoutSession.mockResolvedValueOnce({
      id: sessionId,
      payment_status: 'paid',
      metadata: { booking_request_id: bookingRequestId },
    });
    mockSupabaseRpc.mockResolvedValueOnce({ error: null, data: { success: true } }); // RPC success
    // mockSupabaseEq is already set to resolve successfully by default in beforeEach

    const request = createMockRequest({ sessionId });
    const response = await handler(request);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody).toEqual({ success: true });

    expect(mockRetrieveCheckoutSession).toHaveBeenCalledWith(sessionId);
    expect(mockSupabaseRpc).toHaveBeenCalledWith('rpc_auto_book_match', {
      p_booking_request_id: bookingRequestId,
    });
    expect(mockSupabaseUpdate).toHaveBeenCalledWith({ status: 'done', updated_at: expect.any(String) });
    expect(mockSupabaseEq).toHaveBeenCalledWith('checkout_session_id', sessionId);
  });

  // Test Case 2: Failure Scenario - Stripe Payment Not Paid
  it('should return error if payment is not completed', async () => {
    const sessionId = 'cs_test_unpaid_123';
    mockRetrieveCheckoutSession.mockResolvedValueOnce({
      id: sessionId,
      payment_status: 'unpaid',
      metadata: { booking_request_id: 'br_unpaid_456' },
    });

    const request = createMockRequest({ sessionId });
    const response = await handler(request);
    const responseBody = await response.json();

    expect(response.status).toBe(400); // Or other appropriate error status
    expect(responseBody.error).toBe('Payment not completed');

    expect(mockRetrieveCheckoutSession).toHaveBeenCalledWith(sessionId);
    expect(mockSupabaseRpc).not.toHaveBeenCalled();
    
    // Check if status is updated to 'failed'
    expect(mockSupabaseUpdate).toHaveBeenCalledWith({ status: 'failed', updated_at: expect.any(String), error_message: 'Payment not completed' });
    expect(mockSupabaseEq).toHaveBeenCalledWith('checkout_session_id', sessionId);
  });

  // Test Case 3: Failure Scenario - RPC rpc_auto_book_match Throws
  it('should return error and update status to failed if RPC fails', async () => {
    const sessionId = 'cs_test_rpc_fail_123';
    const bookingRequestId = 'br_rpc_fail_456';
    const rpcErrorMessage = 'RPC failed spectacularly';

    mockRetrieveCheckoutSession.mockResolvedValueOnce({
      id: sessionId,
      payment_status: 'paid',
      metadata: { booking_request_id: bookingRequestId },
    });
    mockSupabaseRpc.mockRejectedValueOnce(new Error(rpcErrorMessage)); // RPC throws/rejects

    const request = createMockRequest({ sessionId });
    const response = await handler(request);
    const responseBody = await response.json();

    expect(response.status).toBe(500);
    expect(responseBody.error).toBe(`RPC Error: ${rpcErrorMessage}`);

    expect(mockRetrieveCheckoutSession).toHaveBeenCalledWith(sessionId);
    expect(mockSupabaseRpc).toHaveBeenCalledWith('rpc_auto_book_match', {
      p_booking_request_id: bookingRequestId,
    });
    expect(mockSupabaseUpdate).toHaveBeenCalledWith({ status: 'failed', updated_at: expect.any(String), error_message: rpcErrorMessage }); // Raw message for DB
    expect(mockSupabaseEq).toHaveBeenCalledWith('id', bookingRequestId); // Filter by booking_request_id
  });

  it('should return error if sessionId is missing', async () => {
    const request = createMockRequest({}); // Missing sessionId
    const response = await handler(request);
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody.error).toBe('Missing sessionId in request body');
    expect(mockRetrieveCheckoutSession).not.toHaveBeenCalled();
  });
  
  it('should return error if booking_request_id is missing in Stripe metadata', async () => {
    const sessionId = 'cs_test_no_br_id_123';
    mockRetrieveCheckoutSession.mockResolvedValueOnce({
      id: sessionId,
      payment_status: 'paid',
      metadata: {}, // Missing booking_request_id
    });

    const request = createMockRequest({ sessionId });
    const response = await handler(request);
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody.error).toBe('Missing booking_request_id in Stripe session metadata');
    expect(mockRetrieveCheckoutSession).toHaveBeenCalledWith(sessionId);
    expect(mockSupabaseRpc).not.toHaveBeenCalled();
    expect(mockSupabaseUpdate).toHaveBeenCalledWith({ status: 'failed', updated_at: expect.any(String), error_message: 'Missing booking_request_id in Stripe session metadata' });
    expect(mockSupabaseEq).toHaveBeenCalledWith('checkout_session_id', sessionId);
  });
  
  it('should handle Stripe API errors gracefully', async () => {
    const sessionId = 'cs_test_stripe_error_123';
    const stripeErrorMessage = 'Stripe API is down';
    // Mock StripeError object as the actual Stripe SDK might throw
    const stripeError = new Error(stripeErrorMessage) as any;
    stripeError.type = 'StripeConnectionError'; // Example Stripe error type
    mockRetrieveCheckoutSession.mockRejectedValueOnce(stripeError);


    const request = createMockRequest({ sessionId });
    const response = await handler(request);
    const responseBody = await response.json();

    expect(response.status).toBe(500);
    expect(responseBody.error).toBe(`Stripe Error: ${stripeErrorMessage}`);
    expect(mockRetrieveCheckoutSession).toHaveBeenCalledWith(sessionId);
    expect(mockSupabaseRpc).not.toHaveBeenCalled();
    // Depending on desired logic, you might still want to update status to failed
    expect(mockSupabaseUpdate).toHaveBeenCalledWith({ status: 'failed', updated_at: expect.any(String), error_message: stripeErrorMessage }); // Raw message for DB
    expect(mockSupabaseEq).toHaveBeenCalledWith('checkout_session_id', sessionId);
  });
});

// Note: The placeholder 'processBookingIndex' and related logic for 'handler'
// that was previously here has been removed, as the test will now directly use
// the 'handler' imported from '../process-booking/index.ts'.
