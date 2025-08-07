// Removed React import - not needed in Deno edge functions
// Mock mode implementation for flight-search-v2 edge function
// This allows offline testing without consuming Amadeus API quota

export interface MockFlightOffer {
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: Array<{
    duration: string;
    segments: Array<{
      departure: { iataCode: string; terminal?: string; at: string };
      arrival: { iataCode: string; terminal?: string; at: string };
      carrierCode: string;
      number: string;
      aircraft: { code: string };
      operating?: { carrierCode: string };
      duration: string;
      id: string;
      numberOfStops: number;
      blacklistedInEU: boolean;
    }>;
  }>;
  price: {
    currency: string;
    total: string;
    base: string;
    fees?: Array<{ amount: string; type: string }>;
    grandTotal?: string;
  };
  pricingOptions: {
    fareType: string[];
    includedCheckedBags?: { quantity: number };
  };
  validatingAirlineCodes: string[];
  travelerPricings: Array<{
    travelerId: string;
    fareOption: string;
    travelerType: string;
    price: { currency: string; total: string; base: string };
    fareDetailsBySegment: Array<{
      segmentId: string;
      cabin: string;
      fareBasis: string;
      brandedFare?: string;
      class: string;
      includedCheckedBags?: { quantity: number };
    }>;
  }>;
}

/**
 * Generate mock flight offers for testing
 * This simulates the Amadeus API response structure exactly
 */
export function generateMockOffers(
  tripRequest: {
    origin_location_code?: string;
    destination_location_code?: string;
    departure_date?: string;
    return_date?: string;
  },
  maxPrice?: number
): MockFlightOffer[] {
  console.log('[MOCK MODE] Generating mock flight offers for testing');
  
  const origin = tripRequest.origin_location_code || 'JFK';
  const destination = tripRequest.destination_location_code || 'LAX';
  const departureDate = tripRequest.departure_date || '2025-07-25';
  const returnDate = tripRequest.return_date;
  
  const mockOffers: MockFlightOffer[] = [
    {
      id: 'MOCK_DIRECT_001',
      source: 'GDS',
      instantTicketingRequired: false,
      nonHomogeneous: false,
      oneWay: !returnDate,
      lastTicketingDate: '2025-12-31',
      numberOfBookableSeats: 9,
      itineraries: [{
        duration: 'PT5H54M',
        segments: [{
          departure: {
            iataCode: origin,
            terminal: '4',
            at: `${departureDate}T08:00:00`
          },
          arrival: {
            iataCode: destination,
            terminal: '4',
            at: `${departureDate}T10:54:00`
          },
          carrierCode: 'NK',
          number: '1234',
          aircraft: { code: '320' },
          operating: { carrierCode: 'NK' },
          duration: 'PT5H54M',
          id: '1',
          numberOfStops: 0,
          blacklistedInEU: false
        }]
      }],
      price: {
        currency: 'USD',
        total: '189.99',
        base: '159.99',
        fees: [{ amount: '30.00', type: 'SUPPLIER' }]
      },
      pricingOptions: {
        fareType: ['PUBLISHED'],
        includedCheckedBags: { quantity: 0 }
      },
      validatingAirlineCodes: ['NK'],
      travelerPricings: [{
        travelerId: '1',
        fareOption: 'STANDARD',
        travelerType: 'ADULT',
        price: {
          currency: 'USD',
          total: '189.99',
          base: '159.99'
        },
        fareDetailsBySegment: [{
          segmentId: '1',
          cabin: 'ECONOMY',
          fareBasis: 'Y',
          class: 'Y',
          includedCheckedBags: { quantity: 0 }
        }]
      }]
    },
    {
      id: 'MOCK_CONNECTING_002',
      source: 'GDS',
      instantTicketingRequired: false,
      nonHomogeneous: false,
      oneWay: !returnDate,
      lastTicketingDate: '2025-12-31',
      numberOfBookableSeats: 5,
      itineraries: [{
        duration: 'PT8H15M',
        segments: [
          {
            departure: {
              iataCode: origin,
              terminal: 'B',
              at: `${departureDate}T14:30:00`
            },
            arrival: {
              iataCode: 'ORD',
              terminal: '1',
              at: `${departureDate}T16:45:00`
            },
            carrierCode: 'AA',
            number: '456',
            aircraft: { code: '737' },
            operating: { carrierCode: 'AA' },
            duration: 'PT2H15M',
            id: '2a',
            numberOfStops: 0,
            blacklistedInEU: false
          },
          {
            departure: {
              iataCode: 'ORD',
              terminal: '3',
              at: `${departureDate}T18:00:00`
            },
            arrival: {
              iataCode: destination,
              terminal: '7',
              at: `${departureDate}T19:45:00`
            },
            carrierCode: 'AA',
            number: '789',
            aircraft: { code: '321' },
            operating: { carrierCode: 'AA' },
            duration: 'PT4H45M',
            id: '2b',
            numberOfStops: 0,
            blacklistedInEU: false
          }
        ]
      }],
      price: {
        currency: 'USD',
        total: '299.50',
        base: '259.50',
        fees: [{ amount: '40.00', type: 'SUPPLIER' }]
      },
      pricingOptions: {
        fareType: ['PUBLISHED'],
        includedCheckedBags: { quantity: 1 }
      },
      validatingAirlineCodes: ['AA'],
      travelerPricings: [{
        travelerId: '1',
        fareOption: 'STANDARD',
        travelerType: 'ADULT',
        price: {
          currency: 'USD',
          total: '299.50',
          base: '259.50'
        },
        fareDetailsBySegment: [
          {
            segmentId: '2a',
            cabin: 'ECONOMY',
            fareBasis: 'Y',
            class: 'Y',
            includedCheckedBags: { quantity: 1 }
          },
          {
            segmentId: '2b',
            cabin: 'ECONOMY',
            fareBasis: 'Y',
            class: 'Y',
            includedCheckedBags: { quantity: 1 }
          }
        ]
      }]
    },
    {
      id: 'MOCK_PREMIUM_003',
      source: 'GDS',
      instantTicketingRequired: false,
      nonHomogeneous: false,
      oneWay: !returnDate,
      lastTicketingDate: '2025-12-31',
      numberOfBookableSeats: 3,
      itineraries: [{
        duration: 'PT6H30M',
        segments: [{
          departure: {
            iataCode: origin,
            terminal: '4',
            at: `${departureDate}T09:15:00`
          },
          arrival: {
            iataCode: destination,
            terminal: '7',
            at: `${departureDate}T12:45:00`
          },
          carrierCode: 'DL',
          number: '101',
          aircraft: { code: '757' },
          operating: { carrierCode: 'DL' },
          duration: 'PT6H30M',
          id: '3',
          numberOfStops: 0,
          blacklistedInEU: false
        }]
      }],
      price: {
        currency: 'USD',
        total: '449.00',
        base: '399.00',
        fees: [{ amount: '50.00', type: 'SUPPLIER' }]
      },
      pricingOptions: {
        fareType: ['PUBLISHED'],
        includedCheckedBags: { quantity: 2 }
      },
      validatingAirlineCodes: ['DL'],
      travelerPricings: [{
        travelerId: '1',
        fareOption: 'STANDARD',
        travelerType: 'ADULT',
        price: {
          currency: 'USD',
          total: '449.00',
          base: '399.00'
        },
        fareDetailsBySegment: [{
          segmentId: '3',
          cabin: 'PREMIUM_ECONOMY',
          fareBasis: 'W',
          class: 'W',
          includedCheckedBags: { quantity: 2 }
        }]
      }]
    }
  ];
  
  // Apply price filter to mock data
  let filteredOffers = mockOffers;
  if (maxPrice !== undefined) {
    filteredOffers = mockOffers.filter(offer => {
      const price = parseFloat(offer.price.total);
      return price <= maxPrice;
    });
    console.log(`[MOCK MODE] Filtered to ${filteredOffers.length} offers by max price: $${maxPrice}`);
  }
  
  console.log(`[MOCK MODE] Generated ${filteredOffers.length} mock offers`);
  return filteredOffers;
}

/**
 * Check if mock mode should be enabled
 * This can be controlled via environment variable or function parameter
 */
export function shouldUseMockMode(): boolean {
  // Check for explicit mock mode environment variable
  const mockMode = Deno.env.get('AMADEUS_MOCK_MODE');
  if (mockMode === 'true' || mockMode === '1') {
    console.log('[MOCK MODE] Enabled via AMADEUS_MOCK_MODE environment variable');
    return true;
  }
  
  // Check for test mode
  const testMode = Deno.env.get('TEST_MODE');
  if (testMode === 'true' || testMode === '1') {
    console.log('[MOCK MODE] Enabled via TEST_MODE environment variable');
    return true;
  }
  
  // Check if Amadeus credentials are missing (fallback to mock)
  const clientId = Deno.env.get('AMADEUS_CLIENT_ID');
  const clientSecret = Deno.env.get('AMADEUS_CLIENT_SECRET');
  if (!clientId || !clientSecret || clientId.includes('mock') || clientSecret.includes('mock')) {
    console.log('[MOCK MODE] Enabled due to missing or mock Amadeus credentials');
    return true;
  }
  
  return false;
}
