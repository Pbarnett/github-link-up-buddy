export interface CampaignFormData {
  name?: string;
  destination: string;
  departureDates: string;
  maxPrice: number;
  directFlightsOnly: boolean;
  // Additional fields that will be expanded
  departureAirports?: string[];
  minDuration?: number;
  maxDuration?: number;
  cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first';
  travelerProfileId?: string;
  paymentMethodId?: string;
}

export interface CampaignCriteria {
  destination: string;
  departure_dates: string;
  max_price: number;
  direct_flights_only: boolean;
  departure_airports?: string[];
  min_duration?: number;
  max_duration?: number;
  cabin_class?: string;
  traveler_profile_id?: string;
  payment_method_id?: string;
}

export interface Campaign {
  id: string;
  user_id: string;
  trip_request_id: string;
  name?: string;
  status:
    | 'active'
    | 'watching'
    | 'paused'
    | 'booked'
    | 'completed'
    | 'cancelled'
    | 'expired';
  criteria: CampaignCriteria;
  price_history?: {
    timestamp: string;
    price: number;
    currency: string;
    offerId?: string;
  }[];
  latest_booking_request_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCampaignRequest {
  trip_request_id: string;
  user_id: string;
  status: string;
  criteria: CampaignCriteria;
}

export interface UpdateCampaignRequest {
  status?: string;
  criteria?: Partial<CampaignCriteria>;
}
