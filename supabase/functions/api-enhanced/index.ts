/**
 * Enhanced Consolidated API Edge Function
 * Demonstrates comprehensive Supabase Edge Functions best practices
 * Based on Supabase Edge Function Documentation
 */

import { 
  withErrorHandling, 
  createSuccessResponse, 
  parseJsonBody, 
  validateRequiredFields, 
  executeQuery,
  sanitizeInput,
  isValidEmail,
  isValidUUID,
  generateTraceId,
  logRequest,
  withRetry
} from '../_shared/utils.ts';

// API route handlers
const API_ROUTES = {
  // Profile operations
  'GET:/profiles': handleGetProfile,
  'PUT:/profiles': handleUpdateProfile,
  'GET:/profiles/completeness': handleGetProfileCompleteness,
  
  // Booking operations
  'GET:/bookings': handleGetBookings,
  'POST:/bookings': handleCreateBooking,
  'PUT:/bookings/:id/cancel': handleCancelBooking,
  
  // Notification operations
  'GET:/notifications': handleGetNotifications,
  'PUT:/notifications/:id/read': handleMarkNotificationRead,
  'DELETE:/notifications/:id': handleDeleteNotification,
  
  // Trip request operations
  'GET:/trip-requests': handleGetTripRequests,
  'POST:/trip-requests': handleCreateTripRequest,
  'PUT:/trip-requests/:id': handleUpdateTripRequest,
  
  // Payment method operations
  'GET:/payment-methods': handleGetPaymentMethods,
  'POST:/payment-methods': handleAddPaymentMethod,
  'PUT:/payment-methods/:id/default': handleSetDefaultPaymentMethod,
  'DELETE:/payment-methods/:id': handleDeletePaymentMethod,
};

// Main handler with comprehensive error handling and middleware
const handler = withErrorHandling(async (context) => {
  const { req, supabase, userId } = context;
  const traceId = generateTraceId();
  const startTime = Date.now();
  
  try {
    // Parse URL and extract route information
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(segment => segment.length > 0);
    const method = req.method;
    
    // Remove 'api-enhanced' from path segments
    if (pathSegments[0] === 'api-enhanced') {
      pathSegments.shift();
    }
    
    // Construct route key
    const routeKey = `${method}:/${pathSegments.join('/')}`;
    const routePattern = findMatchingRoute(routeKey, pathSegments);
    
    if (!routePattern || !API_ROUTES[routePattern]) {
      throw new Error(`Route not found: ${routeKey}`);
    }
    
    // Extract route parameters
    const params = extractRouteParams(routePattern, pathSegments);
    
    // Call the appropriate handler
    const result = await API_ROUTES[routePattern](context, params, url.searchParams);
    
    // Log successful request
    const duration = Date.now() - startTime;
    logRequest(req, { userId, duration, status: 200 });
    
    return createSuccessResponse(result, 200, traceId);
    
  } catch (error: any) {
    const duration = Date.now() - startTime;
    logRequest(req, { userId, duration, status: error.status || 500 });
    throw error;
  }
}, {
  authRequired: true,
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute per user
    keyGenerator: (req) => req.headers.get('authorization')?.substring(7, 20) || 'anonymous'
  }
});

// ============================================================================
// PROFILE OPERATIONS
// ============================================================================

async function handleGetProfile(context: any, params: any, searchParams: URLSearchParams) {
  const { supabase, userId } = context;
  
  const profile = await executeQuery(
    supabase,
    (client) => client
      .from('profiles')
      .select(`
        id,
        email,
        full_name,
        avatar_url,
        phone_number,
        date_of_birth,
        nationality,
        completion_percentage,
        privacy_settings,
        notification_preferences,
        created_at,
        updated_at
      `)
      .eq('id', userId)
      .single(),
    'Failed to fetch profile'
  );
  
  return { profile };
}

async function handleUpdateProfile(context: any, params: any, searchParams: URLSearchParams) {
  const { req, supabase, userId } = context;
  const body = await parseJsonBody(req);
  
  // Validate and sanitize input
  const allowedFields = [
    'full_name', 'phone_number', 'date_of_birth', 'nationality',
    'privacy_settings', 'notification_preferences'
  ];
  
  const updates: any = {};
  for (const [key, value] of Object.entries(body)) {
    if (allowedFields.includes(key)) {
      if (typeof value === 'string') {
        updates[key] = sanitizeInput(value);
      } else {
        updates[key] = value;
      }
    }
  }
  
  if (Object.keys(updates).length === 0) {
    throw new Error('No valid fields provided for update');
  }
  
  const updatedProfile = await executeQuery(
    supabase,
    (client) => client
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single(),
    'Failed to update profile'
  );
  
  return { profile: updatedProfile };
}

async function handleGetProfileCompleteness(context: any, params: any, searchParams: URLSearchParams) {
  const { supabase, userId } = context;
  
  const completeness = await executeQuery(
    supabase,
    (client) => client.rpc('calculate_profile_completeness', { user_id: userId }),
    'Failed to calculate profile completeness'
  );
  
  return completeness;
}

// ============================================================================
// BOOKING OPERATIONS
// ============================================================================

async function handleGetBookings(context: any, params: any, searchParams: URLSearchParams) {
  const { supabase, userId } = context;
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');
  
  let query = supabase
    .from('booking_requests')
    .select(`
      id,
      flight_offer_id,
      status,
      payment_status,
      total_amount,
      currency,
      confirmation_number,
      booking_reference,
      created_at,
      updated_at,
      flight_offers (
        airline,
        departure_airport,
        arrival_airport,
        departure_datetime,
        arrival_datetime,
        flight_duration,
        booking_class
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const bookings = await executeQuery(
    supabase,
    () => query,
    'Failed to fetch bookings'
  );
  
  return { bookings, pagination: { limit, offset, count: bookings.length } };
}

async function handleCreateBooking(context: any, params: any, searchParams: URLSearchParams) {
  const { req, supabase, userId } = context;
  const body = await parseJsonBody(req);
  
  validateRequiredFields(body, ['flight_offer_id', 'payment_method_id']);
  
  if (!isValidUUID(body.flight_offer_id) || !isValidUUID(body.payment_method_id)) {
    throw new Error('Invalid flight offer ID or payment method ID');
  }
  
  // Verify flight offer exists and is available
  const flightOffer = await executeQuery(
    supabase,
    (client) => client
      .from('flight_offers')
      .select('*')
      .eq('id', body.flight_offer_id)
      .eq('status', 'available')
      .gt('valid_until', new Date().toISOString())
      .single(),
    'Flight offer not found or expired'
  );
  
  // Verify payment method belongs to user
  const paymentMethod = await executeQuery(
    supabase,
    (client) => client
      .from('payment_methods')
      .select('id')
      .eq('id', body.payment_method_id)
      .eq('user_id', userId)
      .eq('is_active', true)
      .single(),
    'Payment method not found or inactive'
  );
  
  // Create booking request
  const booking = await executeQuery(
    supabase,
    (client) => client
      .from('booking_requests')
      .insert({
        user_id: userId,
        flight_offer_id: body.flight_offer_id,
        payment_method_id: body.payment_method_id,
        total_amount: flightOffer.total_price,
        currency: flightOffer.currency || 'USD',
        status: 'pending',
        payment_status: 'pending',
        traveler_details: body.traveler_details || {},
        special_requests: body.special_requests
      })
      .select()
      .single(),
    'Failed to create booking'
  );
  
  return { booking };
}

async function handleCancelBooking(context: any, params: any, searchParams: URLSearchParams) {
  const { supabase, userId } = context;
  const bookingId = params.id;
  
  if (!isValidUUID(bookingId)) {
    throw new Error('Invalid booking ID');
  }
  
  const cancelledBooking = await executeQuery(
    supabase,
    (client) => client
      .from('booking_requests')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .eq('user_id', userId)
      .in('status', ['pending', 'confirmed'])
      .select()
      .single(),
    'Failed to cancel booking or booking not found'
  );
  
  return { booking: cancelledBooking };
}

// ============================================================================
// NOTIFICATION OPERATIONS  
// ============================================================================

async function handleGetNotifications(context: any, params: any, searchParams: URLSearchParams) {
  const { supabase, userId } = context;
  const unreadOnly = searchParams.get('unread_only') === 'true';
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');
  
  let query = supabase
    .from('notifications')
    .select(`
      id,
      notification_type,
      title,
      message,
      is_read,
      priority,
      channel,
      metadata,
      created_at
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (unreadOnly) {
    query = query.eq('is_read', false);
  }
  
  const notifications = await executeQuery(
    supabase,
    () => query,
    'Failed to fetch notifications'
  );
  
  return { notifications, pagination: { limit, offset, count: notifications.length } };
}

async function handleMarkNotificationRead(context: any, params: any, searchParams: URLSearchParams) {
  const { supabase, userId } = context;
  const notificationId = params.id;
  
  if (!isValidUUID(notificationId)) {
    throw new Error('Invalid notification ID');
  }
  
  const notification = await executeQuery(
    supabase,
    (client) => client
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId)
      .eq('user_id', userId)
      .select()
      .single(),
    'Failed to mark notification as read'
  );
  
  return { notification };
}

async function handleDeleteNotification(context: any, params: any, searchParams: URLSearchParams) {
  const { supabase, userId } = context;
  const notificationId = params.id;
  
  if (!isValidUUID(notificationId)) {
    throw new Error('Invalid notification ID');
  }
  
  await executeQuery(
    supabase,
    (client) => client
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', userId)
      .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()), // Only delete notifications older than 30 days
    'Failed to delete notification or notification too recent'
  );
  
  return { success: true };
}

// ============================================================================
// TRIP REQUEST OPERATIONS
// ============================================================================

async function handleGetTripRequests(context: any, params: any, searchParams: URLSearchParams) {
  const { supabase, userId } = context;
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');
  
  let query = supabase
    .from('trip_requests')
    .select(`
      id,
      departure_location,
      arrival_location,
      departure_date,
      return_date,
      passenger_count,
      budget_min,
      budget_max,
      status,
      preferences,
      created_at,
      updated_at
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const tripRequests = await executeQuery(
    supabase,
    () => query,
    'Failed to fetch trip requests'
  );
  
  return { trip_requests: tripRequests, pagination: { limit, offset, count: tripRequests.length } };
}

async function handleCreateTripRequest(context: any, params: any, searchParams: URLSearchParams) {
  const { req, supabase, userId } = context;
  const body = await parseJsonBody(req);
  
  validateRequiredFields(body, [
    'departure_location',
    'arrival_location', 
    'departure_date',
    'passenger_count'
  ]);
  
  // Validate dates
  const departureDate = new Date(body.departure_date);
  if (departureDate < new Date()) {
    throw new Error('Departure date must be in the future');
  }
  
  if (body.return_date) {
    const returnDate = new Date(body.return_date);
    if (returnDate <= departureDate) {
      throw new Error('Return date must be after departure date');
    }
  }
  
  // Check user's active trip request limit
  const activeCount = await executeQuery(
    supabase,
    (client) => client
      .from('trip_requests')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .in('status', ['pending', 'active']),
    'Failed to check active trip requests'
  );
  
  if (activeCount.length >= 5) {
    throw new Error('Maximum number of active trip requests reached');
  }
  
  const tripRequest = await executeQuery(
    supabase,
    (client) => client
      .from('trip_requests')
      .insert({
        user_id: userId,
        departure_location: sanitizeInput(body.departure_location),
        arrival_location: sanitizeInput(body.arrival_location),
        departure_date: body.departure_date,
        return_date: body.return_date,
        passenger_count: Math.max(1, Math.min(9, parseInt(body.passenger_count))),
        budget_min: body.budget_min ? Math.max(0, parseFloat(body.budget_min)) : null,
        budget_max: body.budget_max ? Math.max(0, parseFloat(body.budget_max)) : null,
        preferences: body.preferences || {},
        status: 'pending'
      })
      .select()
      .single(),
    'Failed to create trip request'
  );
  
  return { trip_request: tripRequest };
}

async function handleUpdateTripRequest(context: any, params: any, searchParams: URLSearchParams) {
  const { req, supabase, userId } = context;
  const tripRequestId = params.id;
  const body = await parseJsonBody(req);
  
  if (!isValidUUID(tripRequestId)) {
    throw new Error('Invalid trip request ID');
  }
  
  // Only allow updates to pending/draft trip requests
  const allowedFields = [
    'departure_location', 'arrival_location', 'departure_date', 
    'return_date', 'passenger_count', 'budget_min', 'budget_max', 'preferences'
  ];
  
  const updates: any = {};
  for (const [key, value] of Object.entries(body)) {
    if (allowedFields.includes(key)) {
      if (typeof value === 'string') {
        updates[key] = sanitizeInput(value);
      } else {
        updates[key] = value;
      }
    }
  }
  
  if (Object.keys(updates).length === 0) {
    throw new Error('No valid fields provided for update');
  }
  
  updates.updated_at = new Date().toISOString();
  
  const tripRequest = await executeQuery(
    supabase,
    (client) => client
      .from('trip_requests')
      .update(updates)
      .eq('id', tripRequestId)
      .eq('user_id', userId)
      .in('status', ['pending', 'draft'])
      .select()
      .single(),
    'Failed to update trip request or trip request not editable'
  );
  
  return { trip_request: tripRequest };
}

// ============================================================================
// PAYMENT METHOD OPERATIONS
// ============================================================================

async function handleGetPaymentMethods(context: any, params: any, searchParams: URLSearchParams) {
  const { supabase, userId } = context;
  
  const paymentMethods = await executeQuery(
    supabase,
    (client) => client
      .from('payment_methods')
      .select(`
        id,
        payment_type,
        payment_provider,
        last_four,
        expiry_month,
        expiry_year,
        card_brand,
        is_default,
        created_at
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false }),
    'Failed to fetch payment methods'
  );
  
  return { payment_methods: paymentMethods };
}

async function handleAddPaymentMethod(context: any, params: any, searchParams: URLSearchParams) {
  const { req, supabase, userId } = context;
  const body = await parseJsonBody(req);
  
  validateRequiredFields(body, ['stripe_payment_method_id', 'payment_type']);
  
  // Verify the Stripe payment method exists
  // Note: In a real implementation, you'd validate with Stripe API
  
  const paymentMethod = await executeQuery(
    supabase,
    (client) => client
      .from('payment_methods')
      .insert({
        user_id: userId,
        stripe_payment_method_id: body.stripe_payment_method_id,
        payment_type: body.payment_type,
        payment_provider: 'stripe',
        last_four: body.last_four || null,
        expiry_month: body.expiry_month || null,
        expiry_year: body.expiry_year || null,
        card_brand: body.card_brand || null,
        is_default: false,
        is_active: true
      })
      .select()
      .single(),
    'Failed to add payment method'
  );
  
  return { payment_method: paymentMethod };
}

async function handleSetDefaultPaymentMethod(context: any, params: any, searchParams: URLSearchParams) {
  const { supabase, userId } = context;
  const paymentMethodId = params.id;
  
  if (!isValidUUID(paymentMethodId)) {
    throw new Error('Invalid payment method ID');
  }
  
  // Use a transaction-like approach (multiple operations)
  await withRetry(async () => {
    // First, unset all other defaults
    await executeQuery(
      supabase,
      (client) => client
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', userId)
        .eq('is_active', true),
      'Failed to unset default payment methods'
    );
    
    // Then set the new default
    await executeQuery(
      supabase,
      (client) => client
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', paymentMethodId)
        .eq('user_id', userId)
        .eq('is_active', true),
      'Failed to set default payment method'
    );
  });
  
  return { success: true };
}

async function handleDeletePaymentMethod(context: any, params: any, searchParams: URLSearchParams) {
  const { supabase, userId } = context;
  const paymentMethodId = params.id;
  
  if (!isValidUUID(paymentMethodId)) {
    throw new Error('Invalid payment method ID');
  }
  
  // Soft delete by setting is_active to false
  await executeQuery(
    supabase,
    (client) => client
      .from('payment_methods')
      .update({ 
        is_active: false, 
        is_default: false,
        deactivated_at: new Date().toISOString()
      })
      .eq('id', paymentMethodId)
      .eq('user_id', userId)
      .eq('is_active', true),
    'Failed to delete payment method'
  );
  
  return { success: true };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function findMatchingRoute(routeKey: string, pathSegments: string[]): string | null {
  // Check for exact match first
  if (API_ROUTES[routeKey]) {
    return routeKey;
  }
  
  // Check for parameterized routes
  const method = routeKey.split(':')[0];
  for (const pattern of Object.keys(API_ROUTES)) {
    if (pattern.startsWith(method + ':')) {
      const patternPath = pattern.split(':')[1];
      const patternSegments = patternPath.split('/').filter(s => s.length > 0);
      
      if (patternSegments.length === pathSegments.length) {
        let matches = true;
        for (let i = 0; i < patternSegments.length; i++) {
          if (!patternSegments[i].startsWith(':') && patternSegments[i] !== pathSegments[i]) {
            matches = false;
            break;
          }
        }
        if (matches) {
          return pattern;
        }
      }
    }
  }
  
  return null;
}

function extractRouteParams(routePattern: string, pathSegments: string[]): Record<string, string> {
  const params: Record<string, string> = {};
  const patternPath = routePattern.split(':')[1];
  const patternSegments = patternPath.split('/').filter(s => s.length > 0);
  
  for (let i = 0; i < patternSegments.length; i++) {
    if (patternSegments[i].startsWith(':')) {
      const paramName = patternSegments[i].substring(1);
      params[paramName] = pathSegments[i];
    }
  }
  
  return params;
}

// Export the handler
export default handler;
