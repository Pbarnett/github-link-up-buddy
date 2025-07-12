/**
 * Production-Ready Duffel Service
 * Implements comprehensive error handling, retry logic, and idempotency
 * Following industry standards for flight booking APIs
 */

import { createClient } from "@supabase/supabase-js";

// Types for Duffel API responses
export interface DuffelOffer {
  id: string;
  total_amount: string;
  total_currency: string;
  expires_at: string;
  slices: DuffelSlice[];
  passengers: DuffelPassenger[];
  payment_requirements: {
    requires_instant_payment: boolean;
    payment_required_by: string;
  };
}

export interface DuffelSlice {
  id: string;
  origin: DuffelAirport;
  destination: DuffelAirport;
  departure_date: string;
  segments: DuffelSegment[];
}

export interface DuffelSegment {
  id: string;
  origin: DuffelAirport;
  destination: DuffelAirport;
  departing_at: string;
  arriving_at: string;
  aircraft: {
    name: string;
    iata_code: string;
  };
  operating_carrier: {
    name: string;
    iata_code: string;
  };
  marketing_carrier: {
    name: string;
    iata_code: string;
  };
}

export interface DuffelAirport {
  id: string;
  iata_code: string;
  name: string;
  city_name: string;
}

export interface DuffelPassenger {
  id: string;
  type: "adult" | "child" | "infant_without_seat";
}

export interface DuffelOrder {
  id: string;
  booking_reference: string;
  created_at: string;
  total_amount: string;
  total_currency: string;
  metadata: Record<string, any>;
  documents: any[];
  slices: DuffelSlice[];
  passengers: DuffelOrderPassenger[];
}

export interface DuffelOrderPassenger {
  id: string;
  given_name: string;
  family_name: string;
  title: string;
  born_on: string;
  gender: string;
  phone_number?: string;
  email?: string;
}

export interface CreateOrderRequest {
  selected_offers: string[];
  payments: Array<{
    type: "balance";
    amount: string;
    currency: string;
  }>;
  passengers: DuffelOrderPassenger[];
  metadata?: Record<string, any>;
}

export interface DuffelError {
  type: string;
  title: string;
  detail?: string;
  source?: {
    pointer?: string;
    parameter?: string;
  };
}

export interface DuffelApiResponse<T> {
  data: T;
  meta?: any;
}

export interface DuffelErrorResponse {
  errors: DuffelError[];
  meta?: any;
}

/**
 * Enhanced Duffel Service Class
 * Production-ready with comprehensive error handling
 */
export class DuffelService {
  private readonly baseUrl = "https://api.duffel.com";
  private readonly version = "v2";
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // Base delay in ms

  constructor(
    private readonly apiToken: string,
    private readonly isLive: boolean = false
  ) {
    if (!apiToken) {
      throw new Error("Duffel API token is required");
    }
  }

  /**
   * Get feature flag status
   */
  private async isFeatureEnabled(flag: string): Promise<boolean> {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data } = await supabase
      .from("feature_flags")
      .select("enabled")
      .eq("name", flag)
      .single();

    return data?.enabled ?? false;
  }

  /**
   * Make authenticated request to Duffel API with retry logic
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    idempotencyKey?: string
  ): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    
    const headers: Record<string, string> = {
      "Authorization": `Bearer ${this.apiToken}`,
      "Content-Type": "application/json",
      "Duffel-Version": this.version,
      "Accept": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    // Add idempotency key for order creation
    if (idempotencyKey) {
      headers["Idempotency-Key"] = idempotencyKey;
    }

    let lastError: Error;

    // Retry logic with exponential backoff
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`[DuffelService] Attempt ${attempt + 1}/${this.maxRetries + 1} for ${endpoint}`);

        const response = await fetch(url, {
          ...options,
          headers,
        });

        const responseData = await response.json();

        if (!response.ok) {
          const errorResponse = responseData as DuffelErrorResponse;
          const primaryError = errorResponse.errors?.[0];
          
          // Handle rate limiting
          if (response.status === 429) {
            const retryAfter = response.headers.get("Retry-After");
            const delay = retryAfter ? parseInt(retryAfter) * 1000 : this.retryDelay * Math.pow(2, attempt);
            
            if (attempt < this.maxRetries) {
              console.log(`[DuffelService] Rate limited, retrying after ${delay}ms`);
              await this.delay(delay);
              continue;
            }
          }

          // Handle server errors (5xx) with retry
          if (response.status >= 500 && attempt < this.maxRetries) {
            const delay = this.retryDelay * Math.pow(2, attempt);
            console.log(`[DuffelService] Server error ${response.status}, retrying after ${delay}ms`);
            await this.delay(delay);
            continue;
          }

          // Throw error for client errors (4xx) or final retry
          const errorMessage = primaryError?.detail || primaryError?.title || `Duffel API error: ${response.status}`;
          throw new DuffelApiError(errorMessage, response.status, errorResponse.errors);
        }

        console.log(`[DuffelService] Success for ${endpoint}`);
        return (responseData as DuffelApiResponse<T>).data;

      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Don't retry for client errors or DuffelApiError
        if (error instanceof DuffelApiError || (error as any)?.status < 500) {
          throw error;
        }

        // Retry for network errors
        if (attempt < this.maxRetries) {
          const delay = this.retryDelay * Math.pow(2, attempt);
          console.log(`[DuffelService] Network error, retrying after ${delay}ms:`, error);
          await this.delay(delay);
          continue;
        }
      }
    }

    throw new Error(`Failed after ${this.maxRetries + 1} attempts. Last error: ${lastError.message}`);
  }

  /**
   * Search for flight offers
   */
  async searchOffers(params: {
    origin: string;
    destination: string;
    departure_date: string;
    return_date?: string;
    passengers: Array<{
      type: "adult" | "child" | "infant_without_seat";
    }>;
    cabin_class?: "economy" | "premium_economy" | "business" | "first";
    max_connections?: number;
  }): Promise<DuffelOffer[]> {
    console.log("[DuffelService] Searching for offers:", params);

    const requestBody = {
      data: {
        slices: [
          {
            origin: params.origin,
            destination: params.destination,
            departure_date: params.departure_date,
          },
          ...(params.return_date ? [{
            origin: params.destination,
            destination: params.origin,
            departure_date: params.return_date,
          }] : []),
        ],
        passengers: params.passengers,
        cabin_class: params.cabin_class || "economy",
        max_connections: params.max_connections ?? 1,
      },
    };

    return await this.makeRequest<DuffelOffer[]>("air/offer_requests", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });
  }

  /**
   * Retrieve a specific offer by ID
   */
  async getOffer(offerId: string): Promise<DuffelOffer> {
    console.log("[DuffelService] Retrieving offer:", offerId);

    return await this.makeRequest<DuffelOffer>(`air/offers/${offerId}`);
  }

  /**
   * Create an order (book the flight)
   * This is the critical production method
   */
  async createOrder(
    offerId: string,
    passengers: DuffelOrderPassenger[],
    totalAmount: string,
    currency: string,
    idempotencyKey: string,
    metadata?: Record<string, any>
  ): Promise<DuffelOrder> {
    console.log("[DuffelService] Creating order for offer:", offerId);

    // Validate inputs
    if (!offerId) throw new Error("Offer ID is required");
    if (!passengers || passengers.length === 0) throw new Error("Passengers are required");
    if (!totalAmount || parseFloat(totalAmount) <= 0) throw new Error("Valid total amount is required");
    if (!currency) throw new Error("Currency is required");
    if (!idempotencyKey) throw new Error("Idempotency key is required");

    // Validate passenger data
    for (const passenger of passengers) {
      if (!passenger.given_name || !passenger.family_name) {
        throw new Error("Passenger name is required");
      }
      if (!passenger.born_on) {
        throw new Error("Passenger date of birth is required");
      }
    }

    const requestBody: CreateOrderRequest = {
      selected_offers: [offerId],
      payments: [{
        type: "balance",
        amount: totalAmount,
        currency: currency,
      }],
      passengers,
      metadata: {
        ...metadata,
        booking_attempt_id: idempotencyKey,
        created_by: "parker-flight-auto-book",
        integration_version: "v1.0.0",
      },
    };

    console.log("[DuffelService] Order request prepared, creating order...");

    const order = await this.makeRequest<DuffelOrder>(
      "air/orders",
      {
        method: "POST",
        body: JSON.stringify({ data: requestBody }),
      },
      idempotencyKey
    );

    console.log("[DuffelService] Order created successfully:", order.id);
    return order;
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string): Promise<any> {
    console.log("[DuffelService] Cancelling order:", orderId);

    return await this.makeRequest(`air/orders/${orderId}/actions/cancel`, {
      method: "POST",
      body: JSON.stringify({ data: {} }),
    });
  }

  /**
   * Utility method for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Custom error class for Duffel API errors
 */
export class DuffelApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly errors: DuffelError[]
  ) {
    super(message);
    this.name = "DuffelApiError";
  }

  get isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500;
  }

  get isServerError(): boolean {
    return this.statusCode >= 500;
  }

  get isOfferExpired(): boolean {
    return this.errors.some(error => 
      error.type === "validation_error" && 
      error.detail?.includes("expired")
    );
  }

  get isInsufficientBalance(): boolean {
    return this.errors.some(error => 
      error.type === "validation_error" && 
      error.detail?.includes("insufficient")
    );
  }
}

/**
 * Factory function to create DuffelService instance
 */
export function createDuffelService(): DuffelService {
  const isLive = Deno.env.get("DUFFEL_LIVE_ENABLED") === "true";
  const apiToken = isLive 
    ? Deno.env.get("DUFFEL_API_TOKEN_LIVE")
    : Deno.env.get("DUFFEL_API_TOKEN_TEST");

  if (!apiToken) {
    throw new Error(`Duffel API token not found for ${isLive ? "live" : "test"} environment`);
  }

  return new DuffelService(apiToken, isLive);
}
