// supabase/functions/flight-search-v2/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const FlightSearchRequestSchema = z.object({
  tripRequestId: z.string(),
});

const mockFlightOffers = [
  {
    id: 'mock-offer-1',
    source: 'GDS',
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: '2024-08-15',
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: 'PT10H25M',
        segments: [
          {
            departure: { iataCode: 'JFK', terminal: '1', at: '2024-09-01T08:00:00' },
            arrival: { iataCode: 'LHR', terminal: '5', at: '2024-09-01T20:30:00' },
            carrierCode: 'BA',
            number: '245',
            aircraft: { code: '77W' },
            operating: { carrierCode: 'BA' },
            duration: 'PT7H30M',
            id: '1',
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: { iataCode: 'LHR', terminal: '5', at: '2024-09-01T22:00:00' },
            arrival: { iataCode: 'CDG', terminal: '2E', at: '2024-09-01T23:25:00' },
            carrierCode: 'BA',
            number: '330',
            aircraft: { code: '32A' },
            operating: { carrierCode: 'BA' },
            duration: 'PT1H25M',
            id: '2',
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: 'USD',
      total: '650.00',
      base: '500.00',
      fees: [{ amount: '150.00', type: 'TAX' }],
      grandTotal: '650.00',
    },
    pricingOptions: {
      fareType: ['PUBLISHED'],
      includedCheckedBagsOnly: true,
    },
    validatingAirlineCodes: ['BA'],
    travelerPricings: [
      {
        travelerId: '1',
        fareOption: 'STANDARD',
        travelerType: 'ADULT',
        price: { currency: 'USD', total: '650.00', base: '500.00' },
        fareDetailsBySegment: [
          {
            segmentId: '1',
            cabin: 'ECONOMY',
            fareBasis: 'YNRC',
            class: 'Y',
            includedCheckedBags: { quantity: 1 },
          },
          {
            segmentId: '2',
            cabin: 'ECONOMY',
            fareBasis: 'YNRC',
            class: 'Y',
            includedCheckedBags: { quantity: 1 },
          },
        ],
      },
    ],
  },
  {
    id: 'mock-offer-2',
    source: 'GDS',
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: '2024-08-20',
    numberOfBookableSeats: 5,
    itineraries: [
      {
        duration: 'PT13H0M',
        segments: [
          {
            departure: { iataCode: 'LAX', terminal: 'B', at: '2024-09-05T10:00:00' },
            arrival: { iataCode: 'FRA', terminal: '1', at: '2024-09-06T06:00:00' },
            carrierCode: 'LH',
            number: '451',
            aircraft: { code: '74H' },
            operating: { carrierCode: 'LH' },
            duration: 'PT11H0M',
            id: '3',
            numberOfStops: 0,
            blacklistedInEU: false,
          },
           {
            departure: { iataCode: 'FRA', terminal: '1', at: '2024-09-06T07:30:00' },
            arrival: { iataCode: 'VIE', terminal: '3', at: '2024-09-06T09:00:00' },
            carrierCode: 'LH',
            number: '1234',
            aircraft: { code: '320' },
            operating: { carrierCode: 'LH' },
            duration: 'PT1H30M',
            id: '4',
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: 'USD',
      total: '720.50',
      base: '580.50',
      fees: [{ amount: '140.00', type: 'TAX' }],
      grandTotal: '720.50',
    },
    pricingOptions: {
      fareType: ['PUBLISHED'],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ['LH'],
    travelerPricings: [
      {
        travelerId: '1',
        fareOption: 'STANDARD',
        travelerType: 'ADULT',
        price: { currency: 'USD', total: '720.50', base: '580.50' },
        fareDetailsBySegment: [
          {
            segmentId: '3',
            cabin: 'ECONOMY',
            fareBasis: 'QNRC',
            class: 'Q',
            includedCheckedBags: { quantity: 1 },
          },
           {
            segmentId: '4',
            cabin: 'ECONOMY',
            fareBasis: 'QNRC',
            class: 'Q',
            includedCheckedBags: { quantity: 1 },
          },
        ],
      },
    ],
  },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const body = await req.json();
    const validationResult = FlightSearchRequestSchema.safeParse(body);

    if (!validationResult.success) {
      const errorDetails = (validationResult as import('https://deno.land/x/zod@v3.22.4/mod.ts').SafeParseError<{ tripRequestId: string; }>).error;
      console.log('[fs-v2] Bad request:', errorDetails.flatten());
      return new Response(JSON.stringify({ error: 'Bad Request', details: errorDetails.flatten() }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const { tripRequestId } = validationResult.data;
    console.log('[fs-v2] received', tripRequestId);

    // Return two mock Amadeus Flight-Offers-v2 objects
    return new Response(JSON.stringify(mockFlightOffers), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    console.error('[fs-v2] Internal server error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
});

console.log('Flight search v2 function started...');
