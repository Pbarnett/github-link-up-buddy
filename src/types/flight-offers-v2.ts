/**
 * TypeScript types for flight_offers_v2 database schema
 * Phase 2 implementation with enhanced pricing structure and carry-on fee handling
 */

import { Database } from '@/integrations/supabase/types';

// Base types for flight offers v2
export type FlightOfferV2Row = {
  id: string;
  trip_request_id: string;
  
  // Core flight information
  airline: string;
  carrier_code: string | null;
  flight_number: string;
  origin_airport: string | null;
  destination_airport: string | null;
  
  // Flight timing
  departure_date: string; // DATE type comes as string from Supabase
  departure_time: string; // TIME type comes as string from Supabase
  return_date: string;
  return_time: string;
  duration: string;
  
  // Enhanced pricing structure
  base_price: number;      // Base price without fees
  carry_on_fee: number;    // Explicit carry-on fee (0 if included)
  total_price: number;     // Total price (base + carry_on_fee)
  price: number;          // Legacy compatibility field (same as total_price)
  
  // Flight characteristics
  stops: number;
  layover_airports: string[] | null;
  
  // Baggage and seating
  baggage_included: boolean;
  carry_on_included: boolean;
  selected_seat_type: 'AISLE' | 'WINDOW' | 'MIDDLE' | null;
  
  // Booking information
  booking_url: string | null;
  auto_book: boolean;
  
  // V2 enhancements
  pricing_transparency: 'transparent' | 'opaque';
  amadeus_offer_id: string | null;
  offer_score: number | null;
  offer_pool: 'A' | 'B' | 'C' | null;
  scoring_reasons: string[] | null;
  
  // Metadata
  created_at: string;
  updated_at: string;
};

export type FlightOfferV2Insert = {
  id?: string;
  trip_request_id: string;
  
  // Core flight information
  airline: string;
  carrier_code?: string | null;
  flight_number: string;
  origin_airport?: string | null;
  destination_airport?: string | null;
  
  // Flight timing
  departure_date: string;
  departure_time: string;
  return_date: string;
  return_time: string;
  duration: string;
  
  // Enhanced pricing structure
  base_price: number;
  carry_on_fee?: number;
  total_price: number;
  price: number;
  
  // Flight characteristics
  stops?: number;
  layover_airports?: string[] | null;
  
  // Baggage and seating
  baggage_included?: boolean;
  carry_on_included?: boolean;
  selected_seat_type?: 'AISLE' | 'WINDOW' | 'MIDDLE' | null;
  
  // Booking information
  booking_url?: string | null;
  auto_book?: boolean;
  
  // V2 enhancements
  pricing_transparency?: 'transparent' | 'opaque';
  amadeus_offer_id?: string | null;
  offer_score?: number | null;
  offer_pool?: 'A' | 'B' | 'C' | null;
  scoring_reasons?: string[] | null;
  
  // Metadata (handled by database defaults)
  created_at?: string;
  updated_at?: string;
};

export type FlightOfferV2Update = {
  id?: string;
  trip_request_id?: string;
  
  // Core flight information
  airline?: string;
  carrier_code?: string | null;
  flight_number?: string;
  origin_airport?: string | null;
  destination_airport?: string | null;
  
  // Flight timing
  departure_date?: string;
  departure_time?: string;
  return_date?: string;
  return_time?: string;
  duration?: string;
  
  // Enhanced pricing structure
  base_price?: number;
  carry_on_fee?: number;
  total_price?: number;
  price?: number;
  
  // Flight characteristics
  stops?: number;
  layover_airports?: string[] | null;
  
  // Baggage and seating
  baggage_included?: boolean;
  carry_on_included?: boolean;
  selected_seat_type?: 'AISLE' | 'WINDOW' | 'MIDDLE' | null;
  
  // Booking information
  booking_url?: string | null;
  auto_book?: boolean;
  
  // V2 enhancements
  pricing_transparency?: 'transparent' | 'opaque';
  amadeus_offer_id?: string | null;
  offer_score?: number | null;
  offer_pool?: 'A' | 'B' | 'C' | null;
  scoring_reasons?: string[] | null;
  
  // Metadata
  created_at?: string;
  updated_at?: string;
};

// Enhanced pricing structure interface
export interface FlightPricingV2 {
  base: number;
  carryOnFee: number;
  total: number;
}

// Enhanced offer interface with v2 features
export interface FlightOfferV2Enhanced extends FlightOfferV2Row {
  // Additional computed fields for UI
  tripDays?: number;
  friendlyAirline?: string;
  originLabel?: string;
  destinationLabel?: string;
  humanDuration?: string;
  
  // Structured pricing for backward compatibility
  priceStructure: FlightPricingV2;
  
  // Pool and scoring information
  poolInfo?: {
    pool: 'A' | 'B' | 'C';
    score: number;
    reasons: string[];
  };
}

// Type for creating offers from API data (Amadeus transformation)
export interface AmadeusToFlightOfferV2Params {
  tripRequestId: string;
  amadeusOffer: any; // Raw Amadeus offer object
  primaryOrigin: string;
  destination: string;
  basePrice: number;
  carryOnFee: number;
  totalPrice: number;
  carryOnIncluded: boolean;
  score?: number;
  pool?: 'A' | 'B' | 'C';
  reasons?: string[];
}

// Search result interface for v2 offers
export interface FlightSearchResultV2 {
  offers: FlightOfferV2Enhanced[];
  pools: {
    poolA: FlightOfferV2Enhanced[];
    poolB: FlightOfferV2Enhanced[];
    poolC: FlightOfferV2Enhanced[];
  };
  metadata: {
    totalOffers: number;
    transparentOffers: number;
    opaqueOffers: number;
    averageScore: number;
  };
}

// Utility type for offer filtering and sorting
export interface OfferFilterV2 {
  maxPrice?: number;
  minScore?: number;
  pools?: ('A' | 'B' | 'C')[];
  carryOnIncluded?: boolean;
  nonstopOnly?: boolean;
  seatTypes?: ('AISLE' | 'WINDOW' | 'MIDDLE')[];
}

// Type for offer comparison
export interface OfferComparisonV2 {
  id: string;
  airline: string;
  totalPrice: number;
  basePrice: number;
  carryOnFee: number;
  score: number;
  pool: 'A' | 'B' | 'C' | null;
  advantages: string[];
  disadvantages: string[];
}

// Export types for backward compatibility with existing v1 code
export type FlightOfferV2 = FlightOfferV2Row;
export type FlightOfferV2Create = FlightOfferV2Insert;

// Validation helpers
export const isValidSeatType = (seat: string | null): seat is 'AISLE' | 'WINDOW' | 'MIDDLE' | null => {
  return seat === null || ['AISLE', 'WINDOW', 'MIDDLE'].includes(seat);
};

export const isValidPool = (pool: string | null): pool is 'A' | 'B' | 'C' | null => {
  return pool === null || ['A', 'B', 'C'].includes(pool);
};

export const isValidTransparency = (transparency: string): transparency is 'transparent' | 'opaque' => {
  return ['transparent', 'opaque'].includes(transparency);
};

// Helper to calculate pricing from raw values
export const createPricingStructure = (base: number, carryOnFee: number): FlightPricingV2 => ({
  base,
  carryOnFee,
  total: base + carryOnFee,
});

// Helper to validate price calculation integrity
export const validatePriceCalculation = (offer: { base_price: number; carry_on_fee: number; total_price: number; price: number }): boolean => {
  const calculatedTotal = offer.base_price + offer.carry_on_fee;
  return Math.abs(calculatedTotal - offer.total_price) < 0.01 && Math.abs(offer.total_price - offer.price) < 0.01;
};

