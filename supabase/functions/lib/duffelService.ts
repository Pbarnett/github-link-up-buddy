/**
 * Production-Ready Duffel Service
 * 
 * Following industry standards for flight booking APIs with:
 * - Comprehensive error handling and retry logic
 * - Idempotency support for Saga patterns
 * - Type safety and validation
 * - Performance monitoring hooks
 */

export interface DuffelPassenger {
  id?: string; // From offer request
  title: 'mr' | 'ms' | 'mrs' | 'dr';
  gender: 'M' | 'F';
  given_name: string;
  family_name: string;
  born_on: string; // YYYY-MM-DD
  email?: string;
  phone_number?: string;
  passport_number?: string;
  passport_country?: string;
  passport_expiry?: string;
  type: 'adult' | 'child' | 'infant_without_seat';
}

export interface DuffelOfferRequest {
  slices: Array<{
    origin: string;
    destination: string;
    departure_date: string;
  }>;
  passengers: Array<{
    type: 'adult' | 'child' | 'infant_without_seat';
    age?: number;
  }>;
  cabin_class?: 'economy' | 'premium_economy' | 'business' | 'first';
  max_connections?: number;
}

export interface DuffelOffer {
  id: string;
  expires_at: string;
  total_amount: string;
  total_currency: string;
  payment_requirements: {
    requires_instant_payment: boolean;
    payment_required_by: string | null;
    price_guarantee_expires_at: string | null;
  };
  passenger_identity_documents_required: boolean;
  slices: Array<{
    segments: Array<{
      aircraft: { iata_code: string; name: string };
      airline: { iata_code: string; name: string };
      arrival_airport: { iata_code: string; name: string; city_name: string };
      departure_airport: { iata_code: string; name: string; city_name: string };
      departing_at: string;
      arriving_at: string;
      duration: string;
    }>;
  }>;
}

export interface DuffelOrder {
  id: string;
  booking_reference: string;
  status: 'pending' | 'paid' | 'confirmed' | 'cancelled';
  total_amount: string;
  total_currency: string;
  passengers: DuffelPassenger[];
  slices: DuffelOffer['slices'];
  documents?: Array<{
    type: 'electronic_ticket';
    number: string;
  }>;
  conditions?: {
    refund_before_departure?: {
      allowed: boolean;
      penalty_amount?: string;
    };
    change_before_departure?: {
      allowed: boolean;
      penalty_amount?: string;
    };
  };
}

export interface DuffelOrderRequest {
  offer_id: string;
  passengers: DuffelPassenger[];
  payments: Array<{
    type: 'balance';
    amount: string;
    currency: string;
  }>;
}

export interface DuffelApiResponse<T> {
  data: T;
  meta?: {
    count?: number;
    limit?: number;
    offset?: number;
  };
}

export interface DuffelError {
  type: string;
  title: string;
  detail: string;
  source?: {
    pointer?: string;
    parameter?: string;
  };
}

export class DuffelServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly errors?: DuffelError[],
    public readonly retriable: boolean = false
  ) {
    super(message);
    this.name = 'DuffelServiceError';
  }
}

export class DuffelService {
  private readonly baseURL = 'https://api.duffel.com';
  private readonly version = 'v2';
  
  constructor(private readonly apiToken: string) {
    if (!apiToken) {
      throw new Error('Duffel API token is required');
    }
  }

  private get headers() {
    return {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
      'Duffel-Version': this.version,
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip'
    };
  }

  /**
   * Enhanced fetch with retry logic and comprehensive error handling
   */
  private async fetchWithRetry(
    url: string, 
    options: RequestInit, 
    idempotencyKey?: string,
    maxRetries: number = 3
  ): Promise<Response> {
    const headers = {
      ...this.headers,
      ...options.headers,
      ...(idempotencyKey && { 'Idempotency-Key': idempotencyKey })
    };

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Performance monitoring hook
        const startTime = Date.now();
        
        const response = await fetch(url, {
          ...options,
          headers,
          // Timeout after 15 seconds
          signal: AbortSignal.timeout(15000)
        });

        // Log performance metrics
        const duration = Date.now() - startTime;
        console.log(`[DuffelService] ${options.method || 'GET'} ${url} - ${response.status} (${duration}ms)`);

        // Handle rate limiting with exponential backoff
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const backoffMs = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, attempt) * 1000;
          
          if (attempt < maxRetries) {
            console.warn(`[DuffelService] Rate limited, retrying after ${backoffMs}ms (attempt ${attempt}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, backoffMs));
            continue;
          }
        }

        // Handle server errors with retry
        if (response.status >= 500 && attempt < maxRetries) {
          const backoffMs = Math.pow(2, attempt) * 1000;
          console.warn(`[DuffelService] Server error ${response.status}, retrying after ${backoffMs}ms (attempt ${attempt}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
          continue;
        }

        return response;
      } catch (error) {
        if (error.name === 'TimeoutError' && attempt < maxRetries) {
          const backoffMs = Math.pow(2, attempt) * 1000;
          console.warn(`[DuffelService] Timeout, retrying after ${backoffMs}ms (attempt ${attempt}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
          continue;
        }
        
        if (attempt === maxRetries) {
          throw new DuffelServiceError(
            `Network error after ${maxRetries} attempts: ${error.message}`,
            0,
            undefined,
            false
          );
        }
      }
    }

    throw new Error('Unexpected retry loop exit');
  }

  /**
   * Parse and handle Duffel API errors with proper classification
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.ok) {
      const data: DuffelApiResponse<T> = await response.json();
      return data.data;
    }

    let errorData: { errors?: DuffelError[] };
    try {
      errorData = await response.json();
    } catch {
      throw new DuffelServiceError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        undefined,
        response.status >= 500
      );
    }

    const errors = errorData.errors || [];
    const errorMessage = errors.length > 0 
      ? errors.map(e => e.detail || e.title).join('; ')
      : `HTTP ${response.status}: ${response.statusText}`;

    // Classify retriable vs non-retriable errors
    const retriable = response.status >= 500 || response.status === 429;

    throw new DuffelServiceError(
      errorMessage,
      response.status,
      errors,
      retriable
    );
  }

  /**
   * Create offer request with comprehensive validation
   */
  async createOfferRequest(request: DuffelOfferRequest): Promise<{ id: string }> {
    // Validate request
    if (!request.slices?.length) {
      throw new Error('At least one slice is required');
    }
    if (!request.passengers?.length) {
      throw new Error('At least one passenger is required');
    }

    const url = `${this.baseURL}/air/offer_requests`;
    const response = await this.fetchWithRetry(url, {
      method: 'POST',
      body: JSON.stringify({ data: request })
    });

    return this.handleResponse<{ id: string }>(response);
  }

  /**
   * Get offers from offer request with expiration validation
   */
  async getOffers(offerRequestId: string, limit: number = 50): Promise<DuffelOffer[]> {
    const url = `${this.baseURL}/air/offers?offer_request_id=${offerRequestId}&limit=${limit}`;
    const response = await this.fetchWithRetry(url, { method: 'GET' });
    
    const offers = await this.handleResponse<DuffelOffer[]>(response);
    
    // Filter out expired offers
    const now = new Date();
    const validOffers = offers.filter(offer => {
      const expiresAt = new Date(offer.expires_at);
      const timeLeft = expiresAt.getTime() - now.getTime();
      const bufferMinutes = 2; // 2-minute safety buffer
      return timeLeft > (bufferMinutes * 60 * 1000);
    });

    console.log(`[DuffelService] Retrieved ${offers.length} offers, ${validOffers.length} still valid`);
    return validOffers;
  }

  /**
   * Get specific offer with expiration check
   */
  async getOffer(offerId: string): Promise<DuffelOffer | null> {
    try {
      const url = `${this.baseURL}/air/offers/${offerId}`;
      const response = await this.fetchWithRetry(url, { method: 'GET' });
      
      const offer = await this.handleResponse<DuffelOffer>(response);
      
      // Check if offer is still valid
      const now = new Date();
      const expiresAt = new Date(offer.expires_at);
      const timeLeft = expiresAt.getTime() - now.getTime();
      const bufferMinutes = 2;
      
      if (timeLeft <= (bufferMinutes * 60 * 1000)) {
        console.warn(`[DuffelService] Offer ${offerId} has expired or expires soon`);
        return null;
      }
      
      return offer;
    } catch (error) {
      if (error instanceof DuffelServiceError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Create order with idempotency support for Saga pattern
   */
  async createOrder(
    orderRequest: DuffelOrderRequest, 
    idempotencyKey: string
  ): Promise<DuffelOrder> {
    // Validate order request
    if (!orderRequest.offer_id) {
      throw new Error('Offer ID is required');
    }
    if (!orderRequest.passengers?.length) {
      throw new Error('At least one passenger is required');
    }

    // Validate passenger data
    for (const passenger of orderRequest.passengers) {
      if (!passenger.given_name?.trim()) {
        throw new Error('Passenger given_name is required');
      }
      if (!passenger.family_name?.trim()) {
        throw new Error('Passenger family_name is required');
      }
      if (!passenger.born_on) {
        throw new Error('Passenger born_on is required');
      }
    }

    const url = `${this.baseURL}/air/orders`;
    const requestBody = {
      data: {
        type: 'instant',
        selected_offers: [orderRequest.offer_id],
        passengers: orderRequest.passengers,
        payments: orderRequest.payments
      }
    };

    console.log(`[DuffelService] Creating order for offer ${orderRequest.offer_id} with idempotency key ${idempotencyKey}`);

    const response = await this.fetchWithRetry(
      url,
      {
        method: 'POST',
        body: JSON.stringify(requestBody)
      },
      idempotencyKey
    );

    const order = await this.handleResponse<DuffelOrder>(response);
    
    console.log(`[DuffelService] Order created successfully: ${order.id}, PNR: ${order.booking_reference}, Status: ${order.status}`);
    return order;
  }

  /**
   * Cancel order for compensation in Saga pattern
   */
  async cancelOrder(orderId: string): Promise<{ id: string; status: string }> {
    const url = `${this.baseURL}/air/orders/${orderId}/actions/cancel`;
    const response = await this.fetchWithRetry(url, {
      method: 'POST',
      body: JSON.stringify({ data: {} })
    });

    return this.handleResponse<{ id: string; status: string }>(response);
  }

  /**
   * Get order details for reconciliation
   */
  async getOrder(orderId: string): Promise<DuffelOrder> {
    const url = `${this.baseURL}/air/orders/${orderId}`;
    const response = await this.fetchWithRetry(url, { method: 'GET' });
    
    return this.handleResponse<DuffelOrder>(response);
  }

  /**
   * Map Amadeus search criteria to Duffel offer request
   */
  static mapAmadeusSearchToDuffelRequest(
    searchCriteria: {
      origin: string;
      destination: string;
      departure_date: string;
      return_date?: string;
      cabin_class?: string;
      max_connections?: number;
    },
    passengers: { adults: number; children?: number; infants?: number }
  ): DuffelOfferRequest {
    const slices = [
      {
        origin: searchCriteria.origin,
        destination: searchCriteria.destination,
        departure_date: searchCriteria.departure_date
      }
    ];

    // Add return slice if round trip
    if (searchCriteria.return_date) {
      slices.push({
        origin: searchCriteria.destination,
        destination: searchCriteria.origin,
        departure_date: searchCriteria.return_date
      });
    }

    const duffelPassengers: Array<{ type: 'adult' | 'child' | 'infant_without_seat' }> = [];
    
    // Add adults
    for (let i = 0; i < passengers.adults; i++) {
      duffelPassengers.push({ type: 'adult' });
    }
    
    // Add children if specified
    if (passengers.children) {
      for (let i = 0; i < passengers.children; i++) {
        duffelPassengers.push({ type: 'child' });
      }
    }
    
    // Add infants if specified
    if (passengers.infants) {
      for (let i = 0; i < passengers.infants; i++) {
        duffelPassengers.push({ type: 'infant_without_seat' });
      }
    }

    return {
      slices,
      passengers: duffelPassengers,
      cabin_class: searchCriteria.cabin_class as any,
      max_connections: searchCriteria.max_connections
    };
  }

  /**
   * Map passenger data from internal format to Duffel format
   */
  static mapPassengerToDuffel(passenger: {
    title?: string;
    gender?: string;
    first_name: string;
    last_name: string;
    date_of_birth?: string;
    email?: string;
    phone_number?: string;
    passport_number?: string;
    passport_country?: string;
    passport_expiry?: string;
  }): DuffelPassenger {
    return {
      title: (passenger.title?.toLowerCase() as any) || 'mr',
      gender: passenger.gender?.toUpperCase() === 'FEMALE' ? 'F' : 'M',
      given_name: passenger.first_name,
      family_name: passenger.last_name,
      born_on: passenger.date_of_birth || '1990-01-01', // Default if not provided
      email: passenger.email,
      phone_number: passenger.phone_number,
      passport_number: passenger.passport_number,
      passport_country: passenger.passport_country || 'US',
      passport_expiry: passenger.passport_expiry,
      type: 'adult'
    };
  }
}

/**
 * Factory function to create Duffel service with appropriate token
 */
export function createDuffelService(useLive: boolean = false): DuffelService {
  const tokenKey = useLive ? 'DUFFEL_LIVE_TOKEN' : 'DUFFEL_TEST_TOKEN';
  const token = Deno.env.get(tokenKey);
  
  if (!token) {
    throw new Error(`${tokenKey} environment variable is required`);
  }
  
  console.log(`[DuffelService] Initialized with ${useLive ? 'LIVE' : 'TEST'} token`);
  return new DuffelService(token);
}

/**
 * Utility function for performance and error logging
 */
export function logDuffelOperation(
  operation: string, 
  details: any, 
  duration?: number,
  error?: Error
) {
  const logData = {
    operation,
    details,
    duration,
    error: error?.message,
    timestamp: new Date().toISOString()
  };
  
  if (error) {
    console.error(`[DUFFEL ERROR] ${operation}:`, logData);
  } else {
    console.log(`[DUFFEL] ${operation}:`, logData);
  }
}
