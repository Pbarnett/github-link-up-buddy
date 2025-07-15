/**
 * Type-safe Supabase service layer
 * 
 * This service provides type-safe operations for Supabase tables with JSON columns,
 * using the schemas defined in supabase-json-schemas.ts.
 */

import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import {
  travelerDataSchema,
  offerDataSchema,
  campaignCriteriaSchema,
  priceHistorySchema,
  flightDetailsSchema,
  parseJsonColumn,
  validateJsonColumn,
  type TravelerData,
  type OfferData,
  type CampaignCriteria,
  type PriceHistory,
  type FlightDetails,
} from '@/types/supabase-json-schemas';


/**
 * Service for type-safe booking request operations
 */
export class BookingRequestService {
  /**
   * Get a booking request with validated JSON data
   */
  static async getBookingRequest(id: string) {
    const { data, error } = await supabase
      .from('booking_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    // Validate and parse JSON columns
    const offerData = parseJsonColumn(
      offerDataSchema, 
      data.offer_data, 
      'offer_data'
    );

    const travelerData = data.traveler_data 
      ? parseJsonColumn(travelerDataSchema, data.traveler_data, 'traveler_data')
      : null;

    return {
      ...data,
      offer_data: offerData,
      traveler_data: travelerData,
    };
  }

  /**
   * Create a booking request with validated data
   */
  static async createBookingRequest(params: {
    user_id: string;
    offer_id: string;
    offer_data: OfferData;
    traveler_data?: TravelerData;
    trip_request_id?: string;
    auto?: boolean;
  }) {
    // Validate data before inserting
    const validatedOfferData = parseJsonColumn(
      offerDataSchema,
      params.offer_data,
      'offer_data'
    );

    const validatedTravelerData = params.traveler_data
      ? parseJsonColumn(travelerDataSchema, params.traveler_data, 'traveler_data')
      : null;

    const { data, error } = await supabase
      .from('booking_requests')
      .insert({
        user_id: params.user_id,
        offer_id: params.offer_id,
        offer_data: validatedOfferData as unknown as Database['public']['Tables']['booking_requests']['Insert']['offer_data'],
        traveler_data: validatedTravelerData as unknown as Database['public']['Tables']['booking_requests']['Insert']['traveler_data'],
        trip_request_id: params.trip_request_id,
        auto: params.auto ?? false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update booking request with validated traveler data
   */
  static async updateTravelerData(id: string, travelerData: TravelerData) {
    const validatedData = parseJsonColumn(
      travelerDataSchema,
      travelerData,
      'traveler_data'
    );

    const { data, error } = await supabase
      .from('booking_requests')
      .update({
        traveler_data: validatedData as unknown as Database['public']['Tables']['booking_requests']['Update']['traveler_data'],
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

/**
 * Service for type-safe booking operations
 */
export class BookingService {
  /**
   * Get a booking with validated flight details
   */
  static async getBooking(id: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    // Validate and parse JSON columns
    const flightDetails = data.flight_details
      ? parseJsonColumn(flightDetailsSchema, data.flight_details, 'flight_details')
      : null;

    return {
      ...data,
      flight_details: flightDetails,
    };
  }

  /**
   * Update booking with validated flight details
   */
  static async updateFlightDetails(id: string, flightDetails: FlightDetails) {
    const validatedDetails = parseJsonColumn(
      flightDetailsSchema,
      flightDetails,
      'flight_details'
    );

    const { data, error } = await supabase
      .from('bookings')
      .update({
        flight_details: validatedDetails as unknown as Database['public']['Tables']['bookings']['Update']['flight_details'],
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

/**
 * Service for type-safe auto-booking request operations
 */
export class AutoBookingRequestService {
  /**
   * Get an auto-booking request with validated criteria and price history
   */
  static async getAutoBookingRequest(id: string) {
    const { data, error } = await supabase
      .from('auto_booking_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    // Validate and parse JSON columns
    const criteria = parseJsonColumn(
      campaignCriteriaSchema,
      data.criteria,
      'criteria'
    );

    const priceHistory = data.price_history
      ? parseJsonColumn(priceHistorySchema, data.price_history, 'price_history')
      : null;

    return {
      ...data,
      criteria,
      price_history: priceHistory,
    };
  }

  /**
   * Create an auto-booking request with validated criteria
   */
  static async createAutoBookingRequest(params: {
    user_id: string;
    trip_request_id: string;
    criteria: CampaignCriteria;
    status?: string;
  }) {
    const validatedCriteria = parseJsonColumn(
      campaignCriteriaSchema,
      params.criteria,
      'criteria'
    );

    const { data, error } = await supabase
      .from('auto_booking_requests')
      .insert({
        user_id: params.user_id,
        trip_request_id: params.trip_request_id,
        criteria: validatedCriteria as unknown as Database['public']['Tables']['auto_booking_requests']['Insert']['criteria'],
        status: params.status ?? 'active',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update price history for an auto-booking request
   */
  static async updatePriceHistory(id: string, priceHistory: PriceHistory) {
    const validatedHistory = parseJsonColumn(
      priceHistorySchema,
      priceHistory,
      'price_history'
    );

    const { data, error } = await supabase
      .from('auto_booking_requests')
      .update({
        price_history: validatedHistory as unknown as Database['public']['Tables']['auto_booking_requests']['Update']['price_history'],
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

/**
 * Validation utilities for frontend forms
 */
export class ValidationService {
  /**
   * Validate traveler data without throwing
   */
  static validateTravelerData(data: unknown) {
    return validateJsonColumn(travelerDataSchema, data);
  }

  /**
   * Validate offer data without throwing
   */
  static validateOfferData(data: unknown) {
    return validateJsonColumn(offerDataSchema, data);
  }

  /**
   * Validate campaign criteria without throwing
   */
  static validateCampaignCriteria(data: unknown) {
    return validateJsonColumn(campaignCriteriaSchema, data);
  }

  /**
   * Validate flight details without throwing
   */
  static validateFlightDetails(data: unknown) {
    return validateJsonColumn(flightDetailsSchema, data);
  }
}

/**
 * Migration utilities for existing data
 */
export class MigrationService {
  /**
   * Validate all booking requests and identify invalid data
   */
  static async auditBookingRequests(limit = 100) {
    const { data, error } = await (supabase
      .from('booking_requests')
      .select('id, offer_data, traveler_data')
      .limit(limit) as any);

    if (error) throw error;

    const results = data.map((row: any) => {
      const offerValidation = this.validateOfferData(row.offer_data);
      const travelerValidation = row.traveler_data 
        ? this.validateTravelerData(row.traveler_data)
        : { success: true, data: null };

      return {
        id: row.id,
        offer_data_valid: offerValidation.success,
        offer_data_error: offerValidation.success ? null : (offerValidation as { success: false; error: string }).error,
        traveler_data_valid: travelerValidation.success,
        traveler_data_error: travelerValidation.success ? null : (travelerValidation as { success: false; error: string }).error,
      };
    });

    return results;
  }

  /**
   * Helper method for validating offer data
   */
  private static validateOfferData(data: unknown) {
    return validateJsonColumn(offerDataSchema, data);
  }

  /**
   * Helper method for validating traveler data
   */
  private static validateTravelerData(data: unknown) {
    return validateJsonColumn(travelerDataSchema, data);
  }
}

//
// Auto-added placeholder exports so TypeScript can compile.
// Replace with real implementation when ready.
export const placeholder = () => undefined;
export default placeholder;
