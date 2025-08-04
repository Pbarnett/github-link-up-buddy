/**
 * Offer selection logic for auto-booking pipeline
 * Implements intelligent selection based on user preferences and criteria
 */

import { supabase } from '../supabase/client';

export interface FlightOffer {
  id: string;
  trip_request_id: string;
  external_offer_id: string;
  price_total: number;
  currency: string;
  cabin_class: string;
  bags_included: boolean;
  duration_minutes: number;
  stops: number;
  airline_name: string;
  expires_at: string;
  raw_offer_data: any;
  created_at: string;
}

export interface TripRequest {
  id: string;
  user_id: string;
  auto_book_enabled: boolean;
  max_price: number | null;
  budget: number | null;
  selected_offer_id: string | null;
  auto_book_status: string;
}

export interface OfferSelectionCriteria {
  maxPrice?: number;
  preferredCabin?: string;
  maxStops?: number;
  preferredAirlines?: string[];
  bagsRequired?: boolean;
  maxDuration?: number;
}

export class OfferSelection {
  /**
   * Select the best offer for auto-booking based on user criteria
   */
  static async selectBestOffer(
    tripRequestId: string,
    criteria?: OfferSelectionCriteria
  ): Promise<FlightOffer | null> {
    try {
      // Get trip request details
      const { data: tripRequest, error: tripError } = await supabase
        .from('trip_requests')
        .select('*')
        .eq('id', tripRequestId)
        .single();

      if (tripError || !tripRequest) {
        console.error('Failed to fetch trip request:', tripError);
        return null;
      }

      // Get available offers for this trip request
      const { data: offers, error: offersError } = await supabase
        .from('flight_offers')
        .select('*')
        .eq('trip_request_id', tripRequestId)
        .gt('expires_at', new Date().toISOString()) // Only non-expired offers
        .order('price_total', { ascending: true }); // Start with cheapest

      if (offersError || !offers || offers.length === 0) {
        console.error('No valid offers found:', offersError);
        return null;
      }

      // Build selection criteria from trip request and user preferences
      const selectionCriteria: OfferSelectionCriteria = {
        maxPrice: criteria?.maxPrice || tripRequest.max_price || tripRequest.budget,
        preferredCabin: criteria?.preferredCabin,
        maxStops: criteria?.maxStops,
        preferredAirlines: criteria?.preferredAirlines,
        bagsRequired: criteria?.bagsRequired,
        maxDuration: criteria?.maxDuration,
      };

      // Filter and score offers
      const scoredOffers = offers
        .filter(offer => this.meetsBasicCriteria(offer, selectionCriteria))
        .map(offer => ({
          offer,
          score: this.calculateOfferScore(offer, selectionCriteria)
        }))
        .sort((a, b) => b.score - a.score); // Sort by score descending

      if (scoredOffers.length === 0) {
        console.log('No offers meet the selection criteria');
        return null;
      }

      const bestOffer = scoredOffers[0].offer;
      
      // Log selection reasoning
      console.log(`Selected offer ${bestOffer.id} with score ${scoredOffers[0].score}`, {
        price: bestOffer.price_total,
        cabin: bestOffer.cabin_class,
        stops: bestOffer.stops,
        airline: bestOffer.airline_name,
        duration: bestOffer.duration_minutes
      });

      return bestOffer;
    } catch (error) {
      console.error('Error in offer selection:', error);
      return null;
    }
  }

  /**
   * Check if an offer meets basic filtering criteria
   */
  private static meetsBasicCriteria(
    offer: FlightOffer,
    criteria: OfferSelectionCriteria
  ): boolean {
    // Price constraint (most important)
    if (criteria.maxPrice && offer.price_total > criteria.maxPrice) {
      return false;
    }

    // Max stops constraint
    if (criteria.maxStops !== undefined && offer.stops > criteria.maxStops) {
      return false;
    }

    // Max duration constraint (in minutes)
    if (criteria.maxDuration && offer.duration_minutes > criteria.maxDuration) {
      return false;
    }

    // Bags requirement
    if (criteria.bagsRequired && !offer.bags_included) {
      return false;
    }

    return true;
  }

  /**
   * Calculate a score for an offer based on criteria and preferences
   * Higher score = better offer
   */
  private static calculateOfferScore(
    offer: FlightOffer,
    criteria: OfferSelectionCriteria
  ): number {
    let score = 0;

    // Price score (most important factor)
    // Lower price = higher score, scaled 0-100
    if (criteria.maxPrice) {
      const priceRatio = offer.price_total / criteria.maxPrice;
      score += Math.max(0, (1 - priceRatio) * 100);
    } else {
      // If no max price, give moderate score for reasonable prices
      score += Math.max(0, 50 - (offer.price_total / 1000) * 10);
    }

    // Cabin class preference
    if (criteria.preferredCabin) {
      if (offer.cabin_class.toLowerCase() === criteria.preferredCabin.toLowerCase()) {
        score += 30;
      }
    } else {
      // Default preference for economy
      if (offer.cabin_class.toLowerCase() === 'economy') {
        score += 10;
      }
    }

    // Stops preference (direct flights preferred)
    if (offer.stops === 0) {
      score += 25;
    } else if (offer.stops === 1) {
      score += 10;
    }
    // More than 1 stop gets no bonus

    // Airline preference
    if (criteria.preferredAirlines && criteria.preferredAirlines.length > 0) {
      if (criteria.preferredAirlines.some(airline => 
        offer.airline_name.toLowerCase().includes(airline.toLowerCase())
      )) {
        score += 20;
      }
    }

    // Duration bonus (shorter is better)
    if (offer.duration_minutes <= 240) { // 4 hours or less
      score += 15;
    } else if (offer.duration_minutes <= 480) { // 8 hours or less
      score += 10;
    } else if (offer.duration_minutes <= 720) { // 12 hours or less
      score += 5;
    }

    // Bags included bonus
    if (offer.bags_included) {
      score += 10;
    }

    // Freshness bonus (newer offers are better)
    const offerAge = Date.now() - new Date(offer.created_at).getTime();
    const ageHours = offerAge / (1000 * 60 * 60);
    if (ageHours < 1) {
      score += 5;
    } else if (ageHours < 6) {
      score += 3;
    }

    return Math.max(0, score);
  }

  /**
   * Mark an offer as selected for auto-booking
   */
  static async markOfferSelected(
    tripRequestId: string,
    offerId: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('trip_requests')
        .update({
          selected_offer_id: offerId,
          auto_book_status: 'PROCESSING'
        })
        .eq('id', tripRequestId);

      if (error) {
        console.error('Failed to mark offer as selected:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error marking offer as selected:', error);
      return false;
    }
  }

  /**
   * Get the currently selected offer for a trip request
   */
  static async getSelectedOffer(tripRequestId: string): Promise<FlightOffer | null> {
    try {
      const { data: tripRequest, error: tripError } = await supabase
        .from('trip_requests')
        .select('selected_offer_id')
        .eq('id', tripRequestId)
        .single();

      if (tripError || !tripRequest?.selected_offer_id) {
        return null;
      }

      const { data: offer, error: offerError } = await supabase
        .from('flight_offers')
        .select('*')
        .eq('id', tripRequest.selected_offer_id)
        .single();

      if (offerError || !offer) {
        console.error('Failed to fetch selected offer:', offerError);
        return null;
      }

      return offer;
    } catch (error) {
      console.error('Error getting selected offer:', error);
      return null;
    }
  }

  /**
   * Check if a selected offer is still valid (not expired, still bookable)
   */
  static async isOfferStillValid(offerId: string): Promise<boolean> {
    try {
      const { data: offer, error } = await supabase
        .from('flight_offers')
        .select('expires_at')
        .eq('id', offerId)
        .single();

      if (error || !offer) {
        return false;
      }

      const expiresAt = new Date(offer.expires_at);
      const now = new Date();
      
      return expiresAt > now;
    } catch (error) {
      console.error('Error checking offer validity:', error);
      return false;
    }
  }
}
