import { supabase } from '@/integrations/supabase/client';
import logger from '@/lib/logger';

export interface DuffelTraveler {
  id?: string;
  type: 'adult' | 'child' | 'infant_without_seat';
  given_name: string;
  family_name: string;
  title: 'mr' | 'ms' | 'mrs' | 'miss' | 'dr';
  gender: 'male' | 'female';
  born_on: string; // YYYY-MM-DD format
  email: string;
  phone_number: string;
}

export interface DuffelBookingRequest {
  offerId: string;
  travelers: DuffelTraveler[];
}

export interface DuffelOrder {
  id: string;
  booking_reference: string;
  status: 'pending' | 'paid' | 'confirmed' | 'cancelled';
  total_amount: string;
  total_currency: string;
  tickets?: Array<{
    id: string;
    ticket_number: string;
    passenger: string;
  }>;
  passengers: Array<{
    id: string;
    given_name: string;
    family_name: string;
  }>;
}

export interface DuffelBookingResponse {
  success: boolean;
  order?: DuffelOrder;
  error?: {
    message: string;
    type: string;
    details?: any;
  };
}

/**
 * Create a flight booking with Duffel
 */
export async function createDuffelBooking(
  request: DuffelBookingRequest
): Promise<DuffelBookingResponse> {
  try {
    logger.info('[DuffelBookingApi] Creating Duffel booking', {
      offerId: request.offerId,
      travelersCount: request.travelers.length
    });
    
    // Call the auto-book-duffel edge function
    const { data, error } = await supabase.functions.invoke('auto-book-duffel', {
      body: {
        offer_id: request.offerId,
        travelers: request.travelers
      }
    });

    if (error) {
      logger.error('[DuffelBookingApi] Error from edge function:', error);
      return {
        success: false,
        error: {
          message: error.message || 'Booking failed',
          type: 'api_error',
          details: error
        }
      };
    }

    logger.info('[DuffelBookingApi] Booking completed successfully');
    return {
      success: true,
      order: data as DuffelOrder
    };
  } catch (error: any) {
    logger.error('[DuffelBookingApi] createDuffelBooking error:', error);
    return {
      success: false,
      error: {
        message: error.message || 'Network error during booking',
        type: 'network_error',
        details: error
      }
    };
  }
}

/**
 * Get a Duffel order by ID
 */
export async function getDuffelOrder(orderId: string): Promise<DuffelOrder | null> {
  try {
    logger.info('[DuffelBookingApi] Fetching Duffel order:', orderId);
    
    const { data, error } = await supabase.functions.invoke('duffel-order', {
      body: {
        action: 'get',
        orderId
      }
    });

    if (error) {
      logger.error('[DuffelBookingApi] Error fetching order:', error);
      return null;
    }

    return data as DuffelOrder;
  } catch (error) {
    logger.error('[DuffelBookingApi] getDuffelOrder error:', error);
    return null;
  }
}

/**
 * Cancel a Duffel order
 */
export async function cancelDuffelOrder(orderId: string): Promise<boolean> {
  try {
    logger.info('[DuffelBookingApi] Cancelling Duffel order:', orderId);
    
    const { data, error } = await supabase.functions.invoke('duffel-order', {
      body: {
        action: 'cancel',
        orderId
      }
    });

    if (error) {
      logger.error('[DuffelBookingApi] Error cancelling order:', error);
      return false;
    }

    return data?.success || false;
  } catch (error) {
    logger.error('[DuffelBookingApi] cancelDuffelOrder error:', error);
    return false;
  }
}
