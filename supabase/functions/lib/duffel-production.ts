import * as React from 'react';
/**
 * Production-Ready Duffel Service
 * 
 * Simplified, battle-tested Duffel API client with:
 * - Proper error handling and retries
 * - Idempotency support 
 * - Offer expiration validation
 * - Type safety
 */

export interface DuffelOffer {
  id: string;
  expires_at: string;
  total_amount: string;
  total_currency: string;
  slices: Array<{
    segments: Array<{
      origin: { iata_code: string };
      destination: { iata_code: string };
      departing_at: string;
      arriving_at: string;
      aircraft: { name: string };
      marketing_carrier: { iata_code: string; name: string };
      flight_number: string;
    }>;
  }>;
  passengers: Array<{
    id: string;
    type: 'adult' | 'child' | 'infant_without_seat';
  }>;
}

export interface DuffelOrder {
  id: string;
  booking_reference: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  total_amount: string;
  total_currency: string;
  passengers: Array<{
    id: string;
    given_name: string;
    family_name: string;
    title: string;
  }>;
  slices: Array<{
    segments: Array<{
      origin: { iata_code: string };
      destination: { iata_code: string };
      departing_at: string;
      marketing_carrier: { iata_code: string };
      flight_number: string;
    }>;
  }>;
}

export interface PassengerDetails {
  type: 'adult' | 'child' | 'infant_without_seat';
  given_name: string;
  family_name: string;
  title: 'mr' | 'ms' | 'mrs' | 'miss' | 'dr';
  gender: 'male' | 'female';
  born_on: string; // YYYY-MM-DD format
  email?: string;
  phone_number?: string;
}

export class DuffelProductionClient {
  private baseURL = 'https://api.duffel.com';
  private apiToken: string;
  private isLive: boolean;

  constructor(isLive: boolean = false) {
    const tokenEnvVar = isLive ? 'DUFFEL_LIVE_TOKEN' : 'DUFFEL_TEST_TOKEN';
    const token = Deno.env.get(tokenEnvVar);
    
    if (!token) {
      throw new Error(`${tokenEnvVar} environment variable is required`);
    }
    
    this.apiToken = token;
    this.isLive = isLive;
    
    console.log(`[Duffel] Client initialized in ${isLive ? 'LIVE' : 'TEST'} mode`);
  }

  private get headers() {
    return {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
      'Duffel-Version': 'v2',
      'Accept-Encoding': 'gzip'
    };
  }

  /**
   * Validate offer expiration with safety buffer
   */
  validateOffer(offer: DuffelOffer): { valid: boolean; minutesLeft: number } {
    const now = new Date();
    const expires = new Date(offer.expires_at);
    const timeLeft = expires.getTime() - now.getTime();
    const minutesLeft = Math.floor(timeLeft / (1000 * 60));
    const safetyBuffer = 2; // 2-minute safety buffer
    
    return {
      valid: minutesLeft > safetyBuffer,
      minutesLeft
    };
  }

  /**
   * Search for flights with simplified parameters
   */
  async searchFlights(params: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    passengers: number;
    cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first';
  }): Promise<{ offers: DuffelOffer[]; offerRequestId: string }> {
    
    const slices = [
      {
        origin: params.origin,
        destination: params.destination,
        departure_date: params.departureDate
      }
    ];

    // Add return slice if round-trip
    if (params.returnDate) {
      slices.push({
        origin: params.destination,
        destination: params.origin,
        departure_date: params.returnDate
      });
    }

    const requestBody = {
      data: {
        slices,
        passengers: Array(params.passengers).fill({ type: 'adult' }),
        cabin_class: params.cabinClass || 'economy'
      }
    };

    console.log(`[Duffel] Creating offer request:`, JSON.stringify(requestBody, null, 2));

    // Create offer request
    const response = await this.makeRequest('/air/offer_requests', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });

    const offerRequestId = response.data.id;
    console.log(`[Duffel] Offer request created: ${offerRequestId}`);

    // Wait for offers to be processed (Duffel needs a few seconds)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Fetch offers
    const offersResponse = await this.makeRequest(
      `/air/offers?offer_request_id=${offerRequestId}&limit=50`
    );

    const offers = offersResponse.data || [];
    console.log(`[Duffel] Retrieved ${offers.length} offers`);

    return { offers, offerRequestId };
  }

  /**
   * Get a specific offer with validation
   */
  async getOffer(offerId: string): Promise<DuffelOffer | null> {
    try {
      const response = await this.makeRequest(`/air/offers/${offerId}`);
      const offer = response.data;
      
      const validation = this.validateOffer(offer);
      if (!validation.valid) {
        console.warn(`[Duffel] Offer ${offerId} expired (${validation.minutesLeft} minutes left)`);
        return null;
      }
      
      return offer;
    } catch (error) {
      console.error(`[Duffel] Failed to get offer ${offerId}:`, error);
      return null;
    }
  }

  /**
   * Create order (book flight) with idempotency
   */
  async createOrder(params: {
    offerId: string;
    passengers: PassengerDetails[];
    idempotencyKey: string;
  }): Promise<DuffelOrder> {
    
    // First validate the offer is still valid
    const offer = await this.getOffer(params.offerId);
    if (!offer) {
      throw new Error(`Offer ${params.offerId} is no longer valid or has expired`);
    }

    // Map passengers to match Duffel's expected format
    const mappedPassengers = params.passengers.map((passenger, index) => ({
      id: offer.passengers[index]?.id, // Use passenger ID from offer
      title: passenger.title,
      gender: passenger.gender,
      given_name: passenger.given_name,
      family_name: passenger.family_name,
      born_on: passenger.born_on,
      email: passenger.email,
      phone_number: passenger.phone_number
    }));

    const orderRequest = {
      data: {
        selected_offers: [params.offerId],
        passengers: mappedPassengers,
        payments: [{
          type: 'balance',
          amount: offer.total_amount,
          currency: offer.total_currency
        }]
      }
    };

    console.log(`[Duffel] Creating order with idempotency key: ${params.idempotencyKey}`);

    const response = await this.makeRequest('/air/orders', {
      method: 'POST',
      body: JSON.stringify(orderRequest),
      headers: {
        ...this.headers,
        'Idempotency-Key': params.idempotencyKey
      }
    });

    const order = response.data;
    console.log(`[Duffel] Order created: ${order.id}, Status: ${order.status}`);

    return order;
  }

  /**
   * Get order details
   */
  async getOrder(orderId: string): Promise<DuffelOrder> {
    const response = await this.makeRequest(`/air/orders/${orderId}`);
    return response.data;
  }

  /**
   * Cancel order (if supported)
   */
  async cancelOrder(orderId: string): Promise<{ success: boolean; refund?: unknown }> {
    try {
      const response = await this.makeRequest(`/air/orders/${orderId}/cancellations`, {
        method: 'POST',
        body: JSON.stringify({ data: {} })
      });
      
      return { success: true, refund: response.data };
    } catch (error) {
      console.error(`[Duffel] Failed to cancel order ${orderId}:`, error);
      return { success: false };
    }
  }

  /**
   * Internal method for making HTTP requests with retry logic
   */
  private async makeRequest(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<{ data: unknown; errors?: Array<{ message: string }>; message?: string }> {
    const url = `${this.baseURL}${endpoint}`;
    const maxRetries = 3;
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            ...this.headers,
            ...options.headers
          }
        });

        if (!response.ok) {
          const errorBody = await response.text();
          let errorMessage: string;
          
          try {
            const errorJson = JSON.parse(errorBody);
            errorMessage = errorJson.errors?.[0]?.message || errorJson.message || errorBody;
          } catch {
            errorMessage = errorBody;
          }

          // Don't retry client errors (400-499), only server errors (500+)
          if (response.status >= 400 && response.status < 500) {
            throw new Error(`Duffel API error ${response.status}: ${errorMessage}`);
          }
          
          throw new Error(`Duffel API server error ${response.status}: ${errorMessage}`);
        }

        return await response.json();
        
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < maxRetries && (error as Error).message.includes('server error')) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          console.warn(`[Duffel] Attempt ${attempt} failed, retrying in ${delay}ms:`, error);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        break;
      }
    }

    throw lastError!;
  }
}

/**
 * Factory function to create Duffel client based on feature flag
 */
export async function createDuffelProductionClient(supabaseClient: {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        single: () => Promise<{ data: { enabled?: boolean } | null; error?: unknown }>;
      };
    };
  };
}): Promise<DuffelProductionClient> {
  // Check feature flag for live mode
  const { data: flag } = await supabaseClient
    .from('feature_flags')
    .select('enabled')
    .eq('name', 'duffel_live_enabled')
    .single();

  const isLive = flag?.enabled || false;
  
  return new DuffelProductionClient(isLive);
}

/**
 * Helper to map trip request to Duffel search parameters
 */
export function mapTripRequestToDuffelSearch(tripRequest: {
  departure_airports?: string[];
  origin_location_code?: string;
  destination_location_code: string;
  departure_date: string;
  return_date?: string;
  adults?: number;
  travel_class?: string;
}) {
  return {
    origin: tripRequest.departure_airports?.[0] || tripRequest.origin_location_code,
    destination: tripRequest.destination_location_code,
    departureDate: tripRequest.departure_date,
    returnDate: tripRequest.return_date,
    passengers: tripRequest.adults || 1,
    cabinClass: tripRequest.travel_class?.toLowerCase() || 'economy'
  };
}

/**
 * Helper to map traveler data to Duffel passenger format
 */
export function mapTravelerDataToPassenger(travelerData: {
  firstName: string;
  lastName: string;
  title?: string;
  gender?: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
}): PassengerDetails {
  return {
    type: 'adult',
    given_name: travelerData.firstName,
    family_name: travelerData.lastName,
    title: travelerData.title || 'mr',
    gender: travelerData.gender || 'male',
    born_on: travelerData.dateOfBirth,
    email: travelerData.email,
    phone_number: travelerData.phone
  };
}
