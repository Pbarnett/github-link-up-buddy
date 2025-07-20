import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import {
  createServiceClient,
  createClientWithAuth,
  authenticateUser,
  createResponse,
  createErrorResponse,
  validateRequiredFields,
  checkRateLimit,
  logFunctionStart,
  logFunctionEnd,
  logFunctionError,
  corsHeaders,
} from '../_shared/database-utils.ts';

interface ApiRequest {
  operation: 'health' | 'profile' | 'bookings' | 'notifications' | 'trip_requests' | 'payment_methods';
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  filters?: Record<string, any>;
  userId?: string;
}

serve(async (req) => {
  const startTime = Date.now();
  const functionName = 'api-consolidated';
  
  logFunctionStart(functionName, { method: req.method, url: req.url });

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimit = checkRateLimit(clientIP, 100, 60000); // 100 requests per minute
    
    if (!rateLimit.allowed) {
      return createErrorResponse('Rate limit exceeded', 429);
    }

    // Authentication
    const authHeader = req.headers.get('authorization');
    const user = await authenticateUser(authHeader);
    
    if (!user) {
      return createErrorResponse('Authentication required', 401);
    }

    // Parse request body
    let requestData: ApiRequest;
    try {
      requestData = await req.json();
    } catch {
      return createErrorResponse('Invalid JSON in request body', 400);
    }

    // Validate required fields
    const missing = validateRequiredFields(requestData, ['operation', 'method']);
    if (missing.length > 0) {
      return createErrorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
    }

    // Create authenticated client
    const supabase = createClientWithAuth(authHeader?.replace('Bearer ', '') || '');
    
    let result;

    // Route to appropriate handler based on operation
    switch (requestData.operation) {
      case 'health':
        result = await handleHealthCheck();
        break;
      case 'profile':
        result = await handleProfileOperations(supabase, user.id, requestData);
        break;
      case 'bookings':
        result = await handleBookingOperations(supabase, user.id, requestData);
        break;
      case 'notifications':
        result = await handleNotificationOperations(supabase, user.id, requestData);
        break;
      case 'trip_requests':
        result = await handleTripRequestOperations(supabase, user.id, requestData);
        break;
      case 'payment_methods':
        result = await handlePaymentMethodOperations(supabase, user.id, requestData);
        break;
      default:
        return createErrorResponse(`Unsupported operation: ${requestData.operation}`, 400);
    }

    const duration = Date.now() - startTime;
    logFunctionEnd(functionName, duration, { operation: requestData.operation });
    
    return createResponse(result, 200, {
      'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      'X-Response-Time': `${duration}ms`,
    });

  } catch (error: any) {
    const duration = Date.now() - startTime;
    logFunctionError(functionName, error);
    
    return createErrorResponse(
      error.message || 'Internal server error',
      500
    );
  }
});

// Handler functions for different operations
async function handleHealthCheck() {
  const supabase = createServiceClient();
  
  try {
    const startTime = Date.now();
    const { error } = await supabase
      .from('feature_flags')
      .select('id')
      .limit(1);
    
    const latency = Date.now() - startTime;
    
    return {
      status: 'healthy',
      latency,
      timestamp: new Date().toISOString(),
      error: error?.message,
    };
  } catch (error: any) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

async function handleProfileOperations(supabase: any, userId: string, request: ApiRequest) {
  const { method, data, filters } = request;

  switch (method) {
    case 'GET':
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return profile;

    case 'PUT':
      if (!data) throw new Error('Profile data is required for update');
      
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', userId)
        .select()
        .single();
      
      if (updateError) throw updateError;
      return updatedProfile;

    default:
      throw new Error(`Unsupported method for profiles: ${method}`);
  }
}

async function handleBookingOperations(supabase: any, userId: string, request: ApiRequest) {
  const { method, data, filters } = request;

  switch (method) {
    case 'GET':
      let query = supabase
        .from('bookings')
        .select(`
          *,
          trip_requests(origin_location_code, destination_location_code),
          flight_offers(airline, flight_number)
        `)
        .eq('user_id', userId)
        .order('booked_at', { ascending: false });

      // Apply filters if provided
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      const { data: bookings, error } = await query;
      if (error) throw error;
      return bookings;

    case 'POST':
      if (!data) throw new Error('Booking data is required');
      
      const { data: newBooking, error: createError } = await supabase
        .from('bookings')
        .insert({ ...data, user_id: userId })
        .select()
        .single();
      
      if (createError) throw createError;
      return newBooking;

    default:
      throw new Error(`Unsupported method for bookings: ${method}`);
  }
}

async function handleNotificationOperations(supabase: any, userId: string, request: ApiRequest) {
  const { method, data, filters } = request;

  switch (method) {
    case 'GET':
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50); // Limit to recent notifications

      // Apply filters if provided
      if (filters?.unread_only) {
        query = query.eq('is_read', false);
      }

      const { data: notifications, error } = await query;
      if (error) throw error;
      return notifications;

    case 'PUT':
      // Mark notification as read
      if (!data?.notificationId) {
        throw new Error('Notification ID is required');
      }

      const { data: updatedNotification, error: updateError } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', data.notificationId)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (updateError) throw updateError;
      return updatedNotification;

    default:
      throw new Error(`Unsupported method for notifications: ${method}`);
  }
}

async function handleTripRequestOperations(supabase: any, userId: string, request: ApiRequest) {
  const { method, data, filters } = request;

  switch (method) {
    case 'GET':
      let query = supabase
        .from('trip_requests')
        .select(`
          *,
          flight_offers_v2(count),
          bookings(count)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Apply filters for active trips, etc.
      if (filters?.active_only) {
        const now = new Date().toISOString();
        query = query.gte('departure_date', now);
      }

      const { data: tripRequests, error } = await query;
      if (error) throw error;
      return tripRequests;

    case 'POST':
      if (!data) throw new Error('Trip request data is required');
      
      const { data: newTripRequest, error: createError } = await supabase
        .from('trip_requests')
        .insert({ ...data, user_id: userId })
        .select()
        .single();
      
      if (createError) throw createError;
      
      // Trigger flight search (async)
      try {
        await supabase.functions.invoke('flight-search-v2', {
          body: { tripRequestId: newTripRequest.id }
        });
      } catch (error) {
        console.warn('Failed to trigger flight search:', error);
      }
      
      return newTripRequest;

    default:
      throw new Error(`Unsupported method for trip_requests: ${method}`);
  }
}

async function handlePaymentMethodOperations(supabase: any, userId: string, request: ApiRequest) {
  const { method, data, filters } = request;

  switch (method) {
    case 'GET':
      const { data: paymentMethods, error } = await supabase
        .from('payment_methods')
        .select('id, brand, last4, exp_month, exp_year, is_default, nickname')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return paymentMethods;

    case 'PUT':
      // Set default payment method
      if (!data?.paymentMethodId) {
        throw new Error('Payment method ID is required');
      }

      // First, unset all defaults for this user
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', userId);

      // Then set the selected one as default
      const { data: updatedPaymentMethod, error: updateError } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', data.paymentMethodId)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (updateError) throw updateError;
      return updatedPaymentMethod;

    case 'DELETE':
      if (!data?.paymentMethodId) {
        throw new Error('Payment method ID is required');
      }

      const { error: deleteError } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', data.paymentMethodId)
        .eq('user_id', userId);
      
      if (deleteError) throw deleteError;
      return { success: true };

    default:
      throw new Error(`Unsupported method for payment_methods: ${method}`);
  }
}
