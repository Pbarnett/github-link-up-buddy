/**
 * Basic Duffel API Client - Phase 1: Foundation
 * 
 * This is the minimal implementation to test API connectivity.
 * Following methodical approach - start simple, build incrementally.
 */

export interface DuffelOfferRequest {
  id?: string;
  cabin_class?: string;
  passengers: Array<{
    type: 'adult' | 'child' | 'infant_without_seat';
    age?: number;
  }>;
  slices: Array<{
    origin: string;
    destination: string;
    departure_date: string;
  }>;
}

export interface DuffelOffer {
  id: string;
  expires_at: string; // Critical: offers expire in 5-20 minutes
  total_amount: string;
  total_currency: string;
  payment_requirements: {
    requires_instant_payment: boolean;
    payment_required_by: string | null;
    price_guarantee_expires_at: string | null;
  };
  passenger_identity_documents_required: boolean;
}

export interface DuffelApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export class DuffelClient {
  private baseURL = 'https://api.duffel.com';
  private apiToken: string;

  constructor(apiToken: string) {
    this.apiToken = apiToken;
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
   * Phase 1, Step 1.1: Test basic API connectivity
   */
  async testConnection(): Promise<boolean> {
    try {
      // Simple test - create a basic offer request
      const testRequest = await this.createOfferRequest({
        cabin_class: 'economy',
        passengers: [{ type: 'adult' }],
        slices: [{
          origin: 'LHR',
          destination: 'JFK', 
          departure_date: '2025-07-15' // Future date for testing
        }]
      });
      
      console.log('✅ Duffel API connection successful:', testRequest.id);
      return true;
    } catch (error) {
      console.error('❌ Duffel API connection failed:', error);
      return false;
    }
  }

  /**
   * Phase 1, Step 1.1: Create basic offer request
   * Start with simplest possible request to test API
   */
  async createOfferRequest(request: DuffelOfferRequest): Promise<DuffelOfferRequest> {
    const response = await fetch(`${this.baseURL}/air/offer_requests`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ data: request })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Duffel API error: ${response.status} - ${JSON.stringify(error)}`);
    }

    const result: DuffelApiResponse<DuffelOfferRequest> = await response.json();
    return result.data;
  }

  /**
   * Phase 1, Step 1.1: Get offers from offer request
   */
  async getOffers(offerRequestId: string): Promise<DuffelOffer[]> {
    const response = await fetch(
      `${this.baseURL}/air/offers?offer_request_id=${offerRequestId}`,
      {
        method: 'GET',
        headers: this.headers
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Duffel API error: ${response.status} - ${JSON.stringify(error)}`);
    }

    const result: DuffelApiResponse<DuffelOffer[]> = await response.json();
    return result.data;
  }

  /**
   * Phase 1, Step 1.2: Basic offer expiration validation
   * This is CRITICAL - offers expire in 5-20 minutes
   */
  validateOfferExpiration(offer: DuffelOffer): { valid: boolean; timeLeft: number; timeLeftMinutes: number } {
    const now = new Date();
    const expires = new Date(offer.expires_at);
    const timeLeft = expires.getTime() - now.getTime();
    const timeLeftMinutes = Math.floor(timeLeft / (1000 * 60));
    const bufferMinutes = 2; // Safety buffer
    const valid = timeLeft > (bufferMinutes * 60 * 1000);

    return {
      valid,
      timeLeft,
      timeLeftMinutes
    };
  }

  /**
   * Phase 1, Step 1.2: Get single offer with expiration check
   */
  async getOfferWithValidation(offerId: string): Promise<{ 
    offer: DuffelOffer | null; 
    expired: boolean; 
    timeLeft: number;
  }> {
    try {
      const response = await fetch(`${this.baseURL}/air/offers/${offerId}`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        return { offer: null, expired: true, timeLeft: 0 };
      }

      const result: DuffelApiResponse<DuffelOffer> = await response.json();
      const validation = this.validateOfferExpiration(result.data);

      return {
        offer: result.data,
        expired: !validation.valid,
        timeLeft: validation.timeLeft
      };
    } catch (error) {
      console.error('Error getting offer:', error);
      return { offer: null, expired: true, timeLeft: 0 };
    }
  }
}

/**
 * Factory function to create Duffel client with environment token
 */
export function createDuffelClient(): DuffelClient {
  const apiToken = Deno.env.get('DUFFEL_API_TOKEN_TEST');
  if (!apiToken) {
    throw new Error('DUFFEL_API_TOKEN_TEST environment variable is required');
  }
  return new DuffelClient(apiToken);
}

/**
 * Helper function for logging Duffel operations
 */
export function logDuffelOperation(operation: string, details: unknown) {
  console.log(`[DUFFEL] ${operation}:`, JSON.stringify(details, null, 2));
}
