/**
 * Duffel API Service for Parker Flight
 * Handles flight booking through Duffel as Merchant of Record
 */

// Duffel API Types
export interface DuffelPassenger {
  title: 'mr' | 'ms' | 'mrs' | 'miss' | 'dr';
  gender: 'male' | 'female';
  given_name: string;
  family_name: string;
  born_on: string; // YYYY-MM-DD format
  email: string;
  phone_number: string;
  identity_documents?: Array<{
    type: 'passport' | 'national_id';
    number: string;
    issuing_country_code: string;
    expires_on?: string;
  }>;
}

export interface DuffelOfferRequest {
  slices: Array<{
    origin: string; // IATA code
    destination: string; // IATA code
    departure_date: string; // YYYY-MM-DD
  }>;
  passengers: Array<{
    type: 'adult' | 'child' | 'infant_without_seat';
  }>;
  cabin_class?: 'first' | 'business' | 'premium_economy' | 'economy';
  max_connections?: number;
}

export interface DuffelOffer {
  id: string;
  total_amount: string;
  total_currency: string;
  slices: any[];
  expires_at: string;
}

export interface DuffelOrder {
  id: string;
  booking_reference: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_status: {
    awaiting_payment: boolean;
    payment_required_by?: string;
    price_guarantee_expires_at?: string;
  };
  tickets?: Array<{
    id: string;
    number: string;
    passenger_id: string;
  }>;
}

export interface DuffelOrderRequest {
  offer_id: string;
  passengers: DuffelPassenger[];
  payments: Array<{
    type: 'balance' | 'card';
    amount: string;
    currency: string;
  }>;
}

// Environment configuration
const DUFFEL_API_URL = 'https://api.duffel.com/air';
const DUFFEL_VERSION = 'v2';

function getDuffelToken(): string {
  // Check for live vs test mode via environment or feature flag
  const isLive = process.env.DUFFEL_LIVE_ENABLED === 'true';
  const token = isLive ? process.env.DUFFEL_LIVE_TOKEN : process.env.DUFFEL_TEST_TOKEN;
  
  if (!token) {
    throw new Error(`Missing Duffel ${isLive ? 'live' : 'test'} token in environment`);
  }
  
  return token;
}

async function duffelRequest<T>(
  endpoint: string, 
  options: RequestInit & { idempotencyKey?: string } = {}
): Promise<T> {
  const { idempotencyKey, ...fetchOptions } = options;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Duffel-Version': DUFFEL_VERSION,
    'Authorization': `Bearer ${getDuffelToken()}`,
    ...fetchOptions.headers as Record<string, string>
  };

  if (idempotencyKey) {
    headers['Idempotency-Key'] = idempotencyKey;
  }

  const response = await fetch(`${DUFFEL_API_URL}${endpoint}`, {
    ...fetchOptions,
    headers
  });

  const responseText = await response.text();
  
  if (!response.ok) {
    let errorMessage = `Duffel API error: ${response.status}`;
    try {
      const errorData = JSON.parse(responseText);
      errorMessage = errorData.errors?.[0]?.message || errorMessage;
    } catch {
      // Response is not JSON
    }
    
    console.error('Duffel API Error:', {
      status: response.status,
      endpoint,
      response: responseText
    });
    
    throw new Error(errorMessage);
  }

  try {
    return JSON.parse(responseText);
  } catch {
    throw new Error('Invalid JSON response from Duffel API');
  }
}

/**
 * Create an offer request to get bookable offers from Duffel
 */
export async function createOfferRequest(request: DuffelOfferRequest): Promise<DuffelOffer[]> {
  const response = await duffelRequest<{ data: { offers: DuffelOffer[] } }>(
    '/offer_requests?return_offers=true',
    {
      method: 'POST',
      body: JSON.stringify({ data: request })
    }
  );

  return response.data.offers;
}

/**
 * Create a booking order with Duffel
 */
export async function createOrder(
  orderRequest: DuffelOrderRequest,
  idempotencyKey: string
): Promise<DuffelOrder> {
  const response = await duffelRequest<{ data: DuffelOrder }>(
    '/orders',
    {
      method: 'POST',
      body: JSON.stringify({ data: orderRequest }),
      idempotencyKey
    }
  );

  return response.data;
}

/**
 * Get an existing order by ID
 */
export async function getOrder(orderId: string): Promise<DuffelOrder> {
  const response = await duffelRequest<{ data: DuffelOrder }>(
    `/orders/${orderId}`
  );

  return response.data;
}

/**
 * Cancel an order (if possible)
 */
export async function cancelOrder(orderId: string): Promise<DuffelOrder> {
  const response = await duffelRequest<{ data: DuffelOrder }>(
    `/orders/${orderId}/actions/cancel`,
    { method: 'POST' }
  );

  return response.data;
}

/**
 * Convert Parker Flight passenger data to Duffel format
 */
export function mapPassengerToDuffel(passenger: any): DuffelPassenger {
  return {
    title: passenger.title || 'mr',
    gender: passenger.gender || 'male',
    given_name: passenger.first_name,
    family_name: passenger.last_name,
    born_on: passenger.date_of_birth, // Should be YYYY-MM-DD
    email: passenger.email,
    phone_number: passenger.phone_number,
    identity_documents: passenger.passport_number ? [{
      type: 'passport',
      number: passenger.passport_number,
      issuing_country_code: passenger.passport_country || 'US',
      expires_on: passenger.passport_expiry
    }] : undefined
  };
}

/**
 * Convert Amadeus search results to Duffel offer request format
 */
export function mapAmadeusSearchToDuffelRequest(
  searchParams: any,
  passengerCount: { adults: number; children?: number; infants?: number }
): DuffelOfferRequest {
  const passengers: Array<{ type: 'adult' | 'child' | 'infant_without_seat' }> = [];
  
  // Add adults
  for (let i = 0; i < passengerCount.adults; i++) {
    passengers.push({ type: 'adult' });
  }
  
  // Add children
  for (let i = 0; i < (passengerCount.children || 0); i++) {
    passengers.push({ type: 'child' });
  }
  
  // Add infants
  for (let i = 0; i < (passengerCount.infants || 0); i++) {
    passengers.push({ type: 'infant_without_seat' });
  }

  return {
    slices: [{
      origin: searchParams.origin,
      destination: searchParams.destination,
      departure_date: searchParams.departure_date
    }],
    passengers,
    cabin_class: searchParams.cabin_class || 'economy',
    max_connections: searchParams.max_connections
  };
}
