/**
 * @file Service layer for Duffel booking operations
 * Battle-tested integration with your validated backend functions
 */

import { supabase } from "@/integrations/supabase/client";
import logger from "@/lib/logger";

// Types for Duffel booking operations
export interface DuffelBookingRequest {
  offerId: string;
  travelers: DuffelTraveler[];
  paymentMethodId?: string;
}

export interface DuffelTraveler {
  title: string;
  given_name: string;
  family_name: string;
  born_on: string; // YYYY-MM-DD format
  gender: "male" | "female";
  email: string;
  phone_number: string;
  identity_documents?: {
    unique_identifier: string;
    issuing_country_code: string;
    expires_on: string;
    document_type: "passport" | "identity_card";
  }[];
}

export interface DuffelBookingResponse {
  success: boolean;
  order?: {
    id: string;
    booking_reference: string;
    total_amount: string;
    total_currency: string;
    status: string;
    tickets?: Array<{
      ticket_number: string;
      passenger: string;
    }>;
  };
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
}

export interface DuffelOfferResponse {
  success: boolean;
  offer?: {
    id: string;
    total_amount: string;
    total_currency: string;
    expires_at: string;
    slices: Array<{
      origin: { iata_code: string; city_name: string };
      destination: { iata_code: string; city_name: string };
      departure_date: string;
      duration: string;
      segments: Array<{
        flight_number: string;
        operating_carrier: { iata_code: string; name: string };
        departing_at: string;
        arriving_at: string;
      }>;
    }>;
  };
  error?: {
    message: string;
    details?: any;
  };
}

/**
 * Fetch a specific offer by ID from Duffel
 */
export const fetchDuffelOffer = async (offerId: string): Promise<DuffelOfferResponse> => {
  logger.info("[DUFFEL-BOOKING] Fetching offer details for:", offerId);
  
  try {
    const { data, error } = await supabase.functions.invoke("duffel-search", {
      body: { 
        action: "get_offer",
        offerId 
      }
    });

    if (error) {
      logger.error("[DUFFEL-BOOKING] Error fetching offer:", error);
      return {
        success: false,
        error: {
          message: error.message || "Failed to fetch offer details",
          details: error
        }
      };
    }

    return data as DuffelOfferResponse;
  } catch (error: any) {
    logger.error("[DUFFEL-BOOKING] Exception fetching offer:", error);
    return {
      success: false,
      error: {
        message: error.message || "Network error fetching offer",
        details: error
      }
    };
  }
};

/**
 * Create a booking with Duffel
 */
export const createDuffelBooking = async (
  bookingRequest: DuffelBookingRequest
): Promise<DuffelBookingResponse> => {
  logger.info("[DUFFEL-BOOKING] Creating booking with request:", {
    offerId: bookingRequest.offerId,
    travelersCount: bookingRequest.travelers.length
  });

  try {
    const { data, error } = await supabase.functions.invoke("duffel-book", {
      body: {
        offer_id: bookingRequest.offerId,
        passengers: bookingRequest.travelers.map(traveler => ({
          id: `passenger_${Math.random().toString(36).substr(2, 9)}`,
          title: traveler.title,
          given_name: traveler.given_name,
          family_name: traveler.family_name,
          born_on: traveler.born_on,
          gender: traveler.gender,
          email: traveler.email,
          phone_number: traveler.phone_number,
          identity_documents: traveler.identity_documents || []
        }))
      }
    });

    if (error) {
      logger.error("[DUFFEL-BOOKING] Error creating booking:", error);
      return {
        success: false,
        error: {
          message: error.message || "Failed to create booking",
          details: error
        }
      };
    }

    logger.info("[DUFFEL-BOOKING] Booking created successfully:", data);
    return data as DuffelBookingResponse;
  } catch (error: any) {
    logger.error("[DUFFEL-BOOKING] Exception creating booking:", error);
    return {
      success: false,
      error: {
        message: error.message || "Network error creating booking",
        details: error
      }
    };
  }
};

/**
 * Auto-book a flight using the validated auto-book function
 */
export const triggerAutoBooking = async (
  tripRequestId: string,
  options?: {
    maxPrice?: number;
    cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first';
  }
): Promise<DuffelBookingResponse> => {
  logger.info("[DUFFEL-BOOKING] Triggering auto-booking for trip:", tripRequestId);

  try {
    const { data, error } = await supabase.functions.invoke("auto-book-duffel", {
      body: {
        trip_request_id: tripRequestId,
        max_price: options?.maxPrice,
        cabin_class: options?.cabinClass || 'economy'
      }
    });

    if (error) {
      logger.error("[DUFFEL-BOOKING] Error in auto-booking:", error);
      return {
        success: false,
        error: {
          message: error.message || "Auto-booking failed",
          details: error
        }
      };
    }

    logger.info("[DUFFEL-BOOKING] Auto-booking completed:", data);
    return data as DuffelBookingResponse;
  } catch (error: any) {
    logger.error("[DUFFEL-BOOKING] Exception in auto-booking:", error);
    return {
      success: false,
      error: {
        message: error.message || "Network error in auto-booking",
        details: error
      }
    };
  }
};

/**
 * Check booking status
 */
export const checkBookingStatus = async (orderId: string) => {
  logger.info("[DUFFEL-BOOKING] Checking status for order:", orderId);

  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("duffel_order_id", orderId)
      .single();

    if (error) {
      logger.error("[DUFFEL-BOOKING] Error fetching booking status:", error);
      return { success: false, error: error.message };
    }

    return { success: true, booking: data };
  } catch (error: any) {
    logger.error("[DUFFEL-BOOKING] Exception checking booking status:", error);
    return { success: false, error: error.message };
  }
};
