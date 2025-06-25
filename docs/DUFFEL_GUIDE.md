# Duffel Implementation Guide

> **Purpose**: A practical guide for implementing Duffel API integration in Parker Flight. This complements the detailed API reference (`DUFFEL_API.md`) with implementation patterns, workflows, and best practices.

## Table of Contents
- [Quick Start](#quick-start)
- [Core Workflows](#core-workflows)
- [Implementation Patterns](#implementation-patterns)
- [Error Handling Strategy](#error-handling-strategy)
- [Testing Approach](#testing-approach)
- [Production Checklist](#production-checklist)
- [Common Gotchas](#common-gotchas)
- [Integration Architecture](#integration-architecture)

---

## Quick Start

### 1. Environment Setup
```bash
# Add to .env
DUFFEL_API_TOKEN_TEST=duffel_test_YOUR_TOKEN_HERE
DUFFEL_API_TOKEN_LIVE=duffel_live_YOUR_TOKEN_HERE
DUFFEL_WEBHOOK_SECRET=your_webhook_secret_here
```

### 2. Basic Client Setup
```typescript
// src/services/duffel.ts
export class DuffelClient {
  private baseURL = process.env.NODE_ENV === 'production' 
    ? 'https://api.duffel.com' 
    : 'https://api.duffel.com';
  
  private apiToken = process.env.NODE_ENV === 'production'
    ? process.env.DUFFEL_API_TOKEN_LIVE
    : process.env.DUFFEL_API_TOKEN_TEST;

  private headers = {
    'Authorization': `Bearer ${this.apiToken}`,
    'Content-Type': 'application/json',
    'Duffel-Version': 'v2',
    'Accept-Encoding': 'gzip'
  };
}
```

### 3. Rate Limiting Setup
```typescript
// Implement rate limiting from day 1
const rateLimiter = {
  search: 120, // requests per minute
  orders: 60,  // requests per minute
  other: 300   // requests per minute
};
```

---

## Core Workflows

### Workflow 1: Flight Search & Booking
```
1. Create Offer Request → 2. Get Offers → 3. Create Order → 4. Handle Payment → 5. Webhook Updates
```

**Implementation Steps:**
1. **Search**: `POST /air/offer_requests` with passenger + route details
2. **Results**: `GET /air/offers?offer_request_id={id}` to get available flights
3. **Book**: `POST /air/orders` with selected offer + passenger details
4. **Pay**: Handle payment via Duffel Payments or external processor
5. **Monitor**: Listen for webhook events for booking status updates

### Workflow 2: Auto-Booking Integration
```
Amadeus Search → Match with Duffel → Auto-book via Duffel → Fallback to Amadeus if needed
```

**Key Considerations:**
- Offer expiration timing (typically 5-20 minutes)
- Payment authorization before order creation
- Fallback strategy if Duffel booking fails
- User notification on provider switch

### Workflow 3: Order Management
```
Order Created → Payment Processing → Ticketing → Travel Documents → Post-Travel
```

**Webhook Events to Handle:**
- `order.created`
- `order.payment_succeeded`
- `order.ticketed`
- `order.cancelled`

---

## Implementation Patterns

### Pattern 1: Robust Offer Handling
```typescript
// Always check offer expiration
const isOfferValid = (offer: DuffelOffer) => {
  const now = new Date();
  const expires = new Date(offer.expires_at);
  const bufferMinutes = 2; // Safety buffer
  return expires.getTime() - now.getTime() > (bufferMinutes * 60 * 1000);
};

// Refresh offers if expired
const getValidOffer = async (offerId: string) => {
  const offer = await duffel.offers.get(offerId);
  if (!isOfferValid(offer)) {
    throw new OfferExpiredError('Offer has expired, please search again');
  }
  return offer;
};
```

### Pattern 2: Idempotent Order Creation
```typescript
// Use idempotency keys for order creation
const createOrder = async (orderData: OrderData, idempotencyKey?: string) => {
  const headers = {
    ...this.headers,
    ...(idempotencyKey && { 'Idempotency-Key': idempotencyKey })
  };
  
  return this.request('/air/orders', {
    method: 'POST',
    headers,
    body: JSON.stringify(orderData)
  });
};
```

### Pattern 3: Comprehensive Error Handling
```typescript
// Map Duffel errors to user-friendly messages
const handleDuffelError = (error: DuffelApiError) => {
  const errorMap = {
    'offer_no_longer_available': 'This flight is no longer available. Please search again.',
    'validation_error': 'Please check your travel details and try again.',
    'payment_required': 'Payment is required to complete this booking.',
    'insufficient_funds': 'Payment was declined. Please try a different card.',
    'rate_limit_exceeded': 'Too many requests. Please wait a moment and try again.'
  };
  
  return errorMap[error.type] || 'An unexpected error occurred. Please try again.';
};
```

---

## Error Handling Strategy

### 1. API Error Categories
- **Client Errors (4xx)**: Invalid requests, authentication issues
- **Server Errors (5xx)**: Duffel service issues, retry these
- **Rate Limits (429)**: Implement exponential backoff
- **Offer Expired**: Handle gracefully with re-search option

### 2. Retry Strategy
```typescript
const retryConfig = {
  maxRetries: 3,
  backoffMs: [1000, 2000, 4000], // Exponential backoff
  retryableStatuses: [429, 500, 502, 503, 504]
};
```

### 3. Fallback Patterns
- **Search Fallback**: If Duffel search fails → use Amadeus
- **Booking Fallback**: If Duffel booking fails → try Amadeus (with user consent)
- **Payment Fallback**: If Duffel Payments fails → use Stripe

---

## Testing Approach

### 1. Sandbox Environment
```typescript
// Use test data in sandbox
const testData = {
  airline: 'Duffel Airways', // Test airline
  route: 'LHR → JFK',       // Common test route
  cards: ['4242424242424242'] // Test card numbers
};
```

### 2. Test Scenarios
- ✅ Successful booking flow
- ✅ Offer expiration handling
- ✅ Payment failures
- ✅ Network timeouts
- ✅ Invalid passenger data
- ✅ Webhook processing

### 3. Mock Strategy
```typescript
// Mock external dependencies in tests
const mockDuffelClient = {
  offers: { create: jest.fn(), get: jest.fn() },
  orders: { create: jest.fn(), get: jest.fn() },
  payments: { create: jest.fn(), confirm: jest.fn() }
};
```

---

## Production Checklist

### Pre-Launch
- [ ] Live API credentials configured
- [ ] Webhook endpoints secured with signature verification
- [ ] Rate limiting implemented
- [ ] Error monitoring set up (Sentry, etc.)
- [ ] Database schema migration completed
- [ ] Fallback mechanisms tested
- [ ] Payment processing verified

### Monitoring
- [ ] API response times tracked
- [ ] Error rates monitored
- [ ] Webhook delivery success tracked
- [ ] Order completion rates measured
- [ ] User experience metrics collected

### Security
- [ ] API keys stored securely
- [ ] Webhook signatures validated
- [ ] PII handling compliant
- [ ] Payment data secured (PCI compliance)

---

## Common Gotchas

### 1. Offer Expiration
**Problem**: Offers expire quickly (5-20 minutes)
**Solution**: Always check expiration before order creation + graceful error handling

### 2. Currency Handling
**Problem**: Multiple currencies in responses
**Solution**: Always use `base_currency` and handle FX properly

### 3. Passenger Data Validation
**Problem**: Strict airline requirements for passenger details
**Solution**: Validate early and provide clear error messages

### 4. Webhook Idempotency
**Problem**: Duplicate webhook events
**Solution**: Track processed webhook IDs in database

### 5. Rate Limiting
**Problem**: API rate limits can be hit quickly
**Solution**: Implement proper queuing and backoff strategies

---

## Integration Architecture

### Current State (Amadeus Only)
```
User → Parker Flight → Amadeus API → Stripe → Confirmation
```

### Target State (Duffel Primary)
```
User → Parker Flight → {
  1. Search: Amadeus API
  2. Match: Duffel Offers
  3. Book: Duffel API → Duffel Payments
  4. Fallback: Amadeus API → Stripe (if needed)
} → Confirmation
```

### Service Layer Architecture
```
┌─────────────────┐
│   Frontend      │
└─────────────────┘
         │
┌─────────────────┐
│  API Gateway    │ ← Rate limiting, auth
└─────────────────┘
         │
┌─────────────────┐
│ Booking Service │ ← Core business logic
└─────────────────┘
         │
┌─────────────────┐
│ Provider Layer  │ ← Duffel, Amadeus clients
└─────────────────┘
         │
┌─────────────────┐
│  External APIs  │ ← Duffel, Amadeus, Stripe
└─────────────────┘
```

---

## Next Steps

1. **Phase 1**: Set up basic Duffel client and search functionality
2. **Phase 2**: Implement order creation and payment processing
3. **Phase 3**: Add webhook handling and real-time updates
4. **Phase 4**: Integrate with existing auto-booking system
5. **Phase 5**: Production deployment with monitoring

---

## Resources

- **API Reference**: `docs/DUFFEL_API.md` (Complete API documentation)
- **Implementation Plan**: `DUFFEL_IMPLEMENTATION_PLAN.md` (Technical roadmap)
- **Duffel Docs**: https://duffel.com/docs
- **Support**: support@duffel.com

---

**File Location**: `docs/DUFFEL_GUIDE.md`  
**Last Updated**: 2025-06-25  
**Maintained By**: Development Team


Javascript client library
Getting Started
To make it easy to build your Duffel integration, we offer a JavaScript client library.
Installation
To install the library using your favourite package manager:
Shell (using yarn)


yarn

yarn add @duffel/api
Usage
Then import it into your codebase and initialise it with your access token:
JavaScript


import { Duffel } from '@duffel/api'

const duffel = new Duffel({
  token: YOUR_ACCESS_TOKEN,
})

View the repository on GitHub and check out the npm package:
github icon
duffelhq/duffel-api-javascript

The JavaScript client library for the Duffel API on GitHub

npm icon
@duffel/api

JavaScript client library for the Duffel API


Getting Started with Flights
This guide will walk you through how to go from nothing to your first booking.
Before you can get started with this guide, you'll need to:
Sign up for a Duffel account (it takes about 1 minute!)

Create a test access token from the "Access tokens" page in your Dashboard

To make it easy to build your Duffel integration, we offer a JavaScript client library in JavaScript, Custom element loaded with script tag, Custom element installed with npm and React Component.
If you aren't using JavaScript, you can follow along with curl in your terminal, or you can script the flow using your preferred programming language, or you can use the API in an HTTP client like Postman.
Tip

We've put together a Postman Collection that contains all of the requests you'll need to follow along with this guide.
Overview
Everything starts with passengers and a journey. In this guide, we'll follow an example scenario:

Tony, Pepper, and their daughter Morgan want to fly from New York City to Atlanta. They'll be leaving on 11th June and returning a week later on 18th June. Tony and his family prefer flying business class.

To complete this scenario, we'll be:
Searching for flights

Selecting an offer from the search results

Creating a booking using the selected offer

Searching for flights
In our API, you create an offer request in order to search for flights.
To build the payload you'll need the flight itinerary - which should include the origin(s), destination(s) and departure date(s) - and information about the passengers. Here's how we search for Tony's flights:
JavaScript


Node.JS

duffel.offerRequests.create({
  slices : [
    {
      origin: "NYC",
      destination: "ATL",
      departure_date: "2021-06-21"
    },
    {
      origin: "ATL",
      destination: "NYC",
      departure_date: "2021-07-21"
    }
  ],
  passengers: [{ type: "adult" }, { type: "adult" }, { age: 1 }],
  cabin_class: "business",
})
What is a slice?
A slice represents a journey that the passengers want to make between a particular origin and a particular destination on a particular date. For the origin and destination, simply provide the IATA code for an airport (for example ATL for Atlanta's Hartsfield-Jackson International Airport) or for a city (for example NYC for New York City, which covers multiple airports).
In our example, we have two slices: the outbound from New York to Atlanta, and the inbound from Atlanta to New York.
How do passengers work in the API?
When searching, you must provide the age of passengers aged under 18. For adults, you can just describe them using a type: adult.
This is important as airlines will charge different fares to passengers depending on their age.
When we create our booking later, we'll need to provide more information about the passengers like their names and dates of birth.
What will I get back?
An id for the offer request. You may use this ID to retrieve the offer request later.
The response will include an array on offers.
We'll return an Offer Request object, echoing back your slices and passengers.
OfferRequests also include passengers. Each is given an id, which we'll need to refer to later, when making a booking.
Learn more
The are 2 ways to arrive at offers, the method you use will depend on your use case:
Return all offers in the offer request allows your application to pre-process the data. This is the example above. You can find the API documentation here

Streaming batches of offers is a good choice when you want to to start processing and or displaying the offers as soon as they're available. You can find the API documentation here

Selecting an offer from the search results
Offers get stale fairly quickly, and when they do, you are no longer able to book them.
Once Tony has picked an offer that works for him, you should retrieve the offer to get the most up to date version. You should do this when Tony picks an offer before you ask for his full passenger details and payment information.
To get the latest version of the offer, you can use the offer's id with the "Get a single offer" endpoint:
JavaScript


Node.JS

duffel.offers.get(OFFER_ID)
You'll need to replace $OFFER_ID with the ID of one of the offers returned.
The total cost for an offer will be up-to-date once you retrieve it using this endpoint. Its price will be under the total_currency and total_amount attributes.
Slices and segments
The itinerary for a particular offer is described by its slices. Each offer will have the same slices as you specified when you created your Offer Request, but each slice will also contain one or more segments, describing in detail the flight(s) the passenger(s) will fly on.
For Tony's trip, let's say we are choosing an offer that departs from John F Kennedy Airport in New York (JFK) and has a stop in Washington Dulles Airport (IAD) on the way to ATL, and then no stops on the way back to JFK. On the outbound slice, you'll have 2 segments: one with JFK as its origin and IAD as its destination, and a second one from IAD to ATL. As the second slice is a direct flight with no stops, there's just a single segment from ATL back to JFK.
Inside those segments, you'll also find other important information like the airline and flight number, and the baggage included with that offer on each flight.
Learn more
If you'd like to get a complete look at the offer schema and the operations to retrieve a single offer or a paginated list of them, check out our API reference.
Creating a booking using the selected offer
We are finally ready to make the booking for Tony and his family. In the Duffel API, this is called creating an order. You'll only need 3 things at this point:
The ID of the offer you'd like to book

Basic necessary information about the passengers

Payment method and information to confirm the order

You'll collect #2 and #3 in your checkout flow. During that flow and after you confirm the booking, there are some important legal notices that you must display to make sure that the customer understands how their data will be used and the rules that apply to their booking.
You should charge the customer yourself before creating the order.
To create an order, use the "Create an order" endpoint:
JavaScript


Node.JS

duffel.orders.create({
  selected_offers: [OFFER_ID],
  payments: [
    {
      type: "balance",
      currency: TOTAL_CURRENCY,
      amount: TOTAL_AMOUNT
    }
  ],
  passengers: [
    {
      phone_number: "+442080160508",
      email: "tony@example.com",
      born_on: "1980-07-24",
      title: "mr",
      gender: "m",
      family_name: "Stark",
      given_name: "Tony",
      infant_passenger_id: INFANT_PASSENGER_ID,
      id: ADULT_PASSENGER_ID_1
    },
    {
      phone_number: "+442080160509",
      email: "potts@example.com",
      born_on: "1983-11-02",
      title: "mrs",
      gender: "m",
      family_name: "Potts",
      given_name: "Pepper",
      id: ADULT_PASSENGER_ID_2
    },
    {
      phone_number: "+442080160506",
      email: "morgan@example.com",
      born_on: "2019-08-24",
      title: "mrs",
      gender: "f",
      family_name: "Stark",
      given_name: "Morgan",
      id: INFANT_PASSENGER_ID
    }
  ]
})


View full sample

Selected offers
This attribute is an array that must contain a single offer ID: Replace $OFFER_ID with the one for the offer you'd like to book.
Payments
This is an array of payment objects. Currently, we only support a single payment. There are two possible values for a payment's type:
arc_bsp_cash if you are a registered IATA travel agent and you are using your own airline relationships with Duffel.

balance if you are using Managed Content. Follow the "Collecting Customer Card Payments" guide if you want to collect the payment directly from your customer's card and use it here.

You'll also need to include the currency of the payment ($TOTAL_CURRENCY) in ISO 4217 format — it should match the offer's total_currency — and the total amount ($TOTAL_AMOUNT) of the order, which should match the offer's total_amount.
Passengers
When creating an order you also need to provide information about all of the passengers.
To do this, we'll refer to each passenger using their id from our Offer Request. To do this, simply replace the $ADULT_PASSENGER_ID_1, $ADULT_PASSENGER_ID_2 and $INFANT_PASSENGER_ID from the example above.
Additionally, you'll need to provide each passenger's name, date of birth, gender, email and phone number.
If there are any infant passengers (that is, passengers aged 0 or 1 on the date of the last flight), you must specify which of the adult passengers will be responsible for them. To do that, you'll need to assign the infant's passenger id to the responsible adult's infant_passenger_id. All infants must have unique responsible adults.
Learn more
If you'd like to get a complete look at data you can provide when creating an order and what you'll get back, check out our API reference.
Keep Learning
All set! Tony and his family have been booked on their flights. The order returned by the API includes the airline's booking_reference, which you'd use to find the booking on the airline's website. The order can be retrieved any time by its id.

Following Search Best Practices
Introduction
Flight offer payloads can sometimes contain thousands of offers, making it difficult to manage and display content.
The Duffel API supports building many kinds of search flows, but depending on your needs you might need to tweak your requests to ensure relevance of results and improve performance.
This guide outlines some options to help you deliver the best possible experience for your users.
The Scenario
A return trip flight from JKF to MAD, can have 30 outbound departures and 20 inbound departures, resulting in 600 possible itineraries.
In addition, each itinerary offers 5 fare brands that can be combined with each other (e.g. selecting flexible economy on the outbound and premium economy on the inbound) resulting in 6,000 possible itineraries.
In some of the most popular flight routes we see the number of offers go up to the tens of thousands meaning a lot of content to manage and a heavy payload.
Search Filters
Because airlines provide so very many options for flights it can be hard to find and quickly serve the right ones.
Duffel offers a series of Search Filters that can be used before sending a search request that notably reduce the number of offers.
The use of these filters prioritize relevant content to your users and optimize speed. We recommend using as many of these as possible in your integration, and in cases where it makes sense, setting them as default filters.
Cabin Class Filter
If you want your users to specify what cabin they want to fly in, you can add the cabin_classfilter to the request body.
This value is passed down to each airline, meaning you not only receive more relevant results, but also faster.
Shell


curl

curl -X POST --compressed "https://api.duffel.com/air/offer_requests?return_offers=true"
    -H "Accept-Encoding: gzip"
  -H "Accept: application/json"
  -H "Content-Type: application/json"
  -H "Duffel-Version: v2"
  -H "Authorization: Bearer $YOUR_ACCESS_TOKEN"
  -d '{
    "data": {
        "slices": [
            {
                "origin": "MAD",
                "destination": "JFK",
                "departure_date": "2023-12-05"
            },
            {
                "origin": "JFK",
                "destination": "MAD",
                "departure_date": "2023-12-10"
            }
        ],
        "passengers": [
            {
                "type": "adult"
            }
        ],
        "cabin_class":"first"
    }
})


Hide full sample

Read more in the Partial Offer Request reference and the Offer Request reference.
Max Connections
Using the max_connections filter on the request body, ensures your users only receive offers that have up to the specified number of connections.
We recommend setting this filter to either 0 or 1 to get the right balance of relevant content and search speed. Although, one can also set the value to 2 connections if looking for even more offers.
Today, Duffel defaults to searching up to 1 connection when no filter is specified.
Shell


curl

curl -X POST --compressed "https://api.duffel.com/air/offer_requests?return_offers=true"
    -H "Accept-Encoding: gzip"
  -H "Accept: application/json"
  -H "Content-Type: application/json"
  -H "Duffel-Version: v2"
  -H "Authorization: Bearer $YOUR_ACCESS_TOKEN"
  -d '{
    "data": {
        "slices": [
            {
                "origin": "MAD",
                "destination": "JFK",
                "departure_date": "2023-12-05"
            },
            {
                "origin": "JFK",
                "destination": "MAD",
                "departure_date": "2023-12-10"
            }
        ],
        "passengers": [
            {
                "type": "adult"
            }
        ],
        "max_connections": "0"
    }
})


Hide full sample

Read more in the Partial Offer Request reference and the Offer Request reference.
Departure and Arrival Time
This filter provides the fastest search experience if the user knows the flight they are looking for.
By providing the departure_time and/or arrival_time filters, we can limit the results to only those within the specified time frames.
This allows your users to e.g. search for all flights departing after 11am, or all flights arriving before 8pm. They can even specify if they want to depart and arrive between two specific times of the day.
Shell


curl

curl -X POST --compressed "https://api.duffel.com/air/offer_requests?return_offers=true"
    -H "Accept-Encoding: gzip"
  -H "Accept: application/json"
  -H "Content-Type: application/json"
  -H "Duffel-Version: v2"
  -H "Authorization: Bearer $YOUR_ACCESS_TOKEN"
  -d '{
    "data": {
        "slices": [
                {
                    "origin": "MAD",
                    "destination": "JFK",
                    "departure_time": {
                        "to": "11:00",
                        "from": "08:00"
                },
                    "departure_date": "2023-12-05",
                    "arrival_time": {
                        "to": "17:00",
                      "from": "09:45"
                  }
                },
                {
                    "origin": "JFK",
                    "destination": "MAD",
                    "departure_date": "2023-12-10"
                }
            ],
        "passengers": [
            {
                "type": "adult"
            }
        ],
    }
})


Hide full sample

Read more in the Partial Offer Request reference and the Offer Request reference.
Query Parameters
Controlling supplier timeout
Some searches take longer than others, and different users have different levels of tolerance for waiting.
The supplier_timeout allows you to specify on a per request basis, how long should a user wait for results.
A lower value is helpful if you are looking to favour speed over quantity of results, while a higher value favours more options.
By default, and as our recommendation, the Duffel API sets the limit at 20 seconds when the query parameter is unspecified.
Shell


curl

curl -X POST --compressed "https://api.duffel.com/air/offer_requests?return_offers=true&supplier_timeout=10000"
    -H "Accept-Encoding: gzip"
  -H "Accept: application/json"
  -H "Content-Type: application/json"
  -H "Duffel-Version: v2"
  -H "Authorization: Bearer $YOUR_ACCESS_TOKEN"
  -d '{
    "data": {
        "slices": [
            {
                "origin": "MAD",
                "destination": "JFK",
                "departure_date": "2023-12-05"
            },
            {
                "origin": "JFK",
                "destination": "MAD",
                "departure_date": "2023-12-10"
            }
        ],
        "passengers": [
            {
                "type": "adult"
            }
        ],
    }
})


Hide full sample

Read more in the Partial Offer Request reference and the Offer Request reference.
Accessing Private Fares
Overview
Private fares are specially discounted fares contracted between airlines and agents. They can also come in form of special conditions like different flight change conditions.
If you have fares filed with airlines, you can use Duffel API to request private fares.
How to request private fares?
There are two types of private fares which can be requested during offer request creation.
Corporate private fares: These are requested by passing a corporate_code and/or tracking_reference. These are given by the airlines and are used to identify an agency.

Leisure private fares: These are requested by passing a fare_type per passenger. You can also request these along with passing corporate private fares.

Corporate private fares
Request
The request parameters are the same as for creating an offer request, except there is an additional field passed called private_fares. The key for each object is the airline's IATA code and the value is a list of objects with codes. Currently one can only pass one per airline but this may change in future.
A corporate_code is usually your account and tracking_reference is used to identify your business with some airlines. Qantas for example, requires an Australian business number (ABN) as a tracking reference in addition or instead of corporate code. Depending on your setup with the airlines, you can pass one or both corporate_code and tracking_reference.
Shell


curl

curl -X POST --compressed "https://api.duffel.com/air/offer_requests" 
  -H "Accept-Encoding: gzip" 
  -H "Accept: application/json" 
  -H "Content-Type: application/json" 
  -H "Duffel-Version: v2" 
  -H "Authorization: Bearer $YOUR_ACCESS_TOKEN" 
  -d '{
  "data": {
   "private_fares": {
      "QF": [
        {
          "tracking_reference": "ABN:2345678",
          "corporate_code": "FLX53"
        }
      ],
      "BA": [
        {
          "corporate_code": "5623"
        }
      ]
    },
    "slices": [
      {
        "origin": "LHR",
        "destination": "JFK",
        "departure_date": "2023-11-24"
      },
      {
        "origin": "JFK",
        "destination": "LHR",
        "departure_date": "2023-12-02"
      }
    ],
    "passengers": [
      {
        "type": "adult"
      }
    ]
  }
}'


Hide full sample

Response
The response is the same as after creating an offer request, except that the offers which have private fares applied are labelled with a private_fares object. If private_fares list is empty, then private fares are not applied on that offer.
JSON


{
  "id": "orq_00009hthhsUZ8W4LxQghdf",
  // [...]
  "offers": [
    {
      // [...]
      "id": "off_00009htYpSCXrwaB9DnUm0",
      "slices": [...]
       "private_fares": [
          {
            "tracking_reference": "ABN:2345678",
            "corporate_code": "FLX53",
            "type": "corporate"
          }
        ]
     //...
    },
    {
      // [...]
      "id": "off_00009htYpSCXrwaB96254",
      "slices": [...]
       "private_fares": [
          {
            "corporate_code": "5623",
            "type": "corporate"
          }
        ]
     //...
    }
  ]
}



Hide full sample

Leisure private fares
Request
The request parameters are the same as for creating an offer request, except for each passenger for which private fares are expected, the fare_type field is passed. For some fare types involving children or infants you can pass in age as well.
Shell


curl

curl -X POST --compressed "https://api.duffel.com/air/offer_requests" 
  -H "Accept-Encoding: gzip" 
  -H "Accept: application/json" 
  -H "Content-Type: application/json" 
  -H "Duffel-Version: v2" 
  -H "Authorization: Bearer $YOUR_ACCESS_TOKEN" 
  -d '{
  "data": {
    "passengers": [
      {
        "fare_type": "student"
      },
      {
        "fare_type": "contract_bulk_child",
        "age": 5
      }
    ],
    "slices": [
      {
        "origin": "LHR",
        "destination": "JFK",
        "departure_date": "2023-12-24"
      },
      {
        "origin": "JFK",
        "destination": "LHR",
        "departure_date": "2023-12-02"
      }
    ]
  }
}'


Hide full sample

Response
The response is the same as after creating an offer request, except that the offers which have private fares applied are labelled with a private_fares object. If private_fares list is empty, then private fares are not applied on that offer.
JSON


{
  "id": "orq_00009hthhsUZ8W4LxQghdf",
  // [...]
  "offers": [
    {
      // [...]
      "id": "off_00009htYpSCXrwaB9DnUm0_0",
      "slices": [...]
       "private_fares": [
          {
            "type": "leisure"
          }
        ]
     //...
    }
  ]
}

Airlines support and other considerations
Duffel exposes a set of fare types for leisure private fares. Different airlines support a different subset of these. You should know the fare types supported as you would have filed them with the airlines. If you want to add a fare type that you already have filed with the airline but not exposed by us then contact us. Passing an unsupported fare type for an airline will result in getting no private fare or any offers for that airline.
Similarly if you pass in a corporate code for an unsupported airline or pass one that is not filed with the airline, you would not see private fare offers from that airline.
Adding Loyalty Programme Accounts
What is a Loyalty Programme Account?
In the travel industry where differentiation is key, and the customer is king, travel sellers need to think about what elements of their business can be a big driver for customer retention and how to make money selling flights. There's no shortage of places to purchase flights from direct airline websites, to meta-search engines like Skyscanner. Thinking about ways to motivate your customers to return to your website time and time again to purchase flights is more important than ever before. This is where Loyalty Programmes come in.
Travellers with Loyalty Programme Accounts can accrue points for flights taken. They then can access benefits such as discounted fares or included services such as additional baggage and seat selection. By providing travellers with the ability to supply their Loyalty Programme Accounts during searching for flights, you can significantly improve your travellers' shopping experience.
How are they included in Offers?
If the airline(s) have lower prices, more services, or anything else, they'll be represented in the existing Offer schema. The Offer schema includes Passenger Loyalty Programme Accounts, if any, that were sent to the airline(s).
Use with Offers
There are different flows for adding Loyalty Programme Accounts for Offers. This gives you flexibility in how you use the Duffel API.
The first flow is through the existing endpoint for creating an Offer Request. The second flow is through the new endpoint for updating an Offer Passenger. You will only be able to witness a discount on the ticket price in the latter flow.
In this guide we'll go through both flows. For both of them, you can provide as many unique Loyalty Programme Accounts per passenger as you'd like. We'll send them to the appropriate airlines.
What do you need to start?
It’s important you know the basics of how to search for flights and create an order. If you could use a refresher, please head over to our Quick Start Guide.
Tip

We've put together a Postman Collection that contains all of the requests you'll need to follow along with this guide.
Flow: Creating an Offer Request
The only difference to the existing endpoint is with the passengers data that you pass in. If you're creating an Offer Request without Loyalty Programme Accounts, your data may look like:
JSON


"data": {
    "slices": [
      {
        "origin": "LHR",
        "destination": "JFK",
        "departure_date": "2020-04-24"
      }
    ],
    "passengers": [
      {
        "type": "adult"
      },
      {
        "age": 14
      }
    ],
    "cabin_class": "economy"
  }

A request to create an Offer Request with Loyalty Programme Accounts would include a list of them per passenger. Previously, it was only required to provide the traveller's name when creating an Order. Airlines require the name traveller's name when searching with Loyalty Programme Accounts. Here's what your data may now look like:
For example:
JSON


"data": {
    "slices": [
      {
        "origin": "LHR",
        "destination": "JFK",
        "departure_date": "2020-04-24"
      }
    ],
    "passengers": [
      {
        "type": "adult",
        "given_name": "Amelia",
        "family_name": "Earhart"
        "loyalty_programme_accounts": [
          {
            "airline_iata_code": "QF",
            "account_number": "12901014"
          }
        ]
      },
      {
        "age": 14
      }
    ],
    "cabin_class": "economy"
  }



Hide full sample

You'd then send that request, as usual. The resulting offers will include any available benefits like discounted fares, additional baggage, or preferential seat selection.
Flow: Updating an Offer Passenger
With this flow, you already have an Offer, from creating Offer Request, that didn't include any Loyalty Programme Accounts for the passengers.
To see if the airline has a discounted fares, more services, etc., you need to update the Passengers in your Offer. This is done through the updating an Offer Passenger endpoint.
Shell


curl

curl -X PATCH --compressed "https://api.duffel.com/air/offers/$OFFER_ID/passengers/$OFFER_PASSENGER_ID" 
  -H "Accept-Encoding: gzip" 
  -H "Accept: application/json" 
  -H "Content-Type: application/json" 
  -H "Duffel-Version: v2" 
  -H "Authorization: Bearer $YOUR_ACCESS_TOKEN" 
  -d '{
  "data": {
    "given_name": "Amelia",
    "family_name": "Earhart"
    "loyalty_programme_accounts": [
      {
        "airline_iata_code": "QF",
        "account_number": "12901014"
      }
    ]
  }
}'
You'll need to repeat this for each passenger that you would like to update with Loyalty Programme Accounts since they're not shared between passengers. After you've done this, you'll need to get the Offer again.
JavaScript


Node.JS

duffel.offers.get(OFFER_ID)
Creating an Order
There's no difference when creating an Order. You do not need to provide Loyalty Programme Accounts data again when creating an Order.
Testing your integration
We provide Duffel Airways for testing features, but it's also helpful to test with other airlines. Please contact us at help@duffel.com for test data.
Using the following passenger details will result in a 10% discount, as well as a baggage allowance of six checked bags per passenger, for all Duffel Airways flights. It will also include a 10% discount off of seat services.
JSON


{
  "type": "adult",
  "given_name": "Amelia",
  "family_name": "Earhart"
  "loyalty_programme_accounts": [
    {
      "airline_iata_code": "ZZ",
      "account_number": "1234567890"
    }
  ]
}

What is a Loyalty Programme Account?
How are they included in Offers?
Use with Offers
What do you need to start?
Flow: Creating an Offer Request
Flow: Updating an Offer Passenger
Creating an Order
Testing your integration
Displaying Stops
What do you need to start?
This guide assumes that you've built a basic "search and book" flow with the Duffel API. If you haven't done this yet, we'd recommend that you read through our Quick Start guide first.
What is a stop?
When flying from your origin to your destination, it's either a non-stop flight or a flight that touches down. The main cause for a flight landing is to switch flights to continue on a journey, after a layover. We refer to these flights as segments, which are within slices.
On rare occasion, a segment itself may touchdown. This is called a stop. When this happens, you continue on the same flight number. The reason for these stops varies and is usually to take on fuel, off-load or on-load passengers, or change to a different aircraft though still with the same flight number..
Is a stopover a stop?
No. This can be confusing, so we'll cover the difference. A layover is a broad term that covers when a flight touches down and you continue after on a different flight number. The length of a layover can be as short as 30 minutes or as long as 23 hours and 59 minutes. If it's 24 hours or longer, it's a stopover. A stopover is considered a subset of a layover, by definition.
Why are stops important?
Non-stop vs direct flights are a key deciding factor for which offer a passenger would choose and is thus important to display.
How should I display stops?
This varies per your usage, so always do what is most appropriate. In general though, we recommend using the hierarchy of slice → segment → stop to inform your design. A simpler solution may be better for your product though.
Response example
This is an example taken from a full offer response.
JSON


              ..,
              "stops": [
                {
                  "id": "sto_00009htYpSCXrwaB9Dn456",
                  "duration": "PT02H26M",
                  "departing_at": "2020-06-13T16:38:02",
                  "airport": {
                    "time_zone": "America/New_York",
                    "name": "John F. Kennedy International Airport",
                    "longitude": -73.778519,
                    "latitude": 40.640556,
                    "id": "arp_jfk_us",
                    "icao_code": "KJFK",
                    "iata_country_code": "US",
                    "iata_code": "JFK",
                    "iata_city_code": "NYC",
                    "city_name": "New York",
                    "city": {
                      "name": "New York",
                      "id": "cit_nyc_us",
                      "iata_country_code": "US",
                      "iata_code": "NYC"
                    }
                  }
                }
              ],
              ...,



Hide full sample

What do you need to start?
What is a stop?
Is a stopover a stop?
Why are stops important?
How should I display stops?
Displaying Offer and Order Conditions
Overview
Airlines offer a range of different prices for the same flight(s) with different levels of flexibility. Some customers want the lowest price - even if that doesn't allow them to change their flights or get their money back if they need to change their plans. Other customers have flexibility at the top of their wish list and are willing to pay more for the freedom to change their mind later.
In this guide, you'll learn how to use data returned in the API to tell customers what will happen if they want to change or cancel their trip.
With offer and order conditions, you can see whether changes and refunds are allowed for an offer or order, and any fees (known as "penalties") that may apply. This information is available both before booking (that is, on offers) and after booking (that is, on orders).
To start using offer and order conditions and exposing them to your customers, you won't have to call any new APIs. You'll just need to interpret the conditions attributes returned in the Offers and Orders APIs you're already using.
We'll take you through the theory, and then finish with some worked examples so you can see how offer and order conditions work in practice.
What do you need to start?
In this guide, we'll assume that you've already built a basic booking flow using the Duffel API which can search for flights by creating an offer request and then book by creating an order.
If you haven't built your booking flow yet, then head over to our Quick Start guide which explains the first steps.
Setting the context
What are offers and orders?
To search for flights through Duffel, you create an offer request. As part of that offer request, you specify one or more slices.
A slice represents a journey that the passengers want to make between a particular origin and a particular destination on a particular date. That slice could be "fulfilled" by airlines in many different ways. For example, if I wanted to fly from London to Ibiza on 4th June, there are many possible options including:
Taking a direct flight with British Airways

Taking a connecting flight with Iberia via Madrid

Taking a connecting flight with Lufthansa via Munich

In response to an offer request, you get back a series of offers. Each offer represents a particular set of segments (that is, flights) that you can book for a particular price which fulfil the requested slices.
Airlines provide different offers to fly from London to Ibiza
Airlines provide different offers to fly from London to Ibiza

You'll often see multiple offers for exactly the same segments because airlines offer a range of "fare brands" with different features and benefits. For example, there might be a low-price "Basic" brand that is totally fixed and a more expensive "Standard" option that includes a bag and allows changes for a small fee.
Airlines can offer multiple options for exactly the same flight(s)
Airlines can offer multiple options for exactly the same flight(s)

Once your customer has picked the offer they want, you'll create an order, which represents the customer's booking with the airline.
What do airlines mean by "changes" and "refunds"?
When we book flights, we think in terms of changing or cancelling our plans and have our own ideas of what that means.
Airlines don't think in exactly the same way. They use two technical terms - "changes" and "refunds" - which have nuanced technical meanings. It's important to understand how airlines think if you're going to correctly explain flexibility options to your customers.
As an example, let's imagine that I've created an order with Duffel Airways like the one below:
A round-trip from London to Ibiza with Duffel Airways, departing on 4th June and returning on 11th June
A round-trip from London to Ibiza with Duffel Airways, departing on 4th June and returning on 11th June

My plans have changed. I know I can't fly to Ibiza on 4th June because I have an urgent meeting.
At this point, I have four options:
Request a refund: If my order allows me to refund before departure, then I can get my money back. If there's a penalty, that will be subtracted from the money that is refunded.

Postpone my outbound flight by a few days, but keep the inbound flight the same: If my outbound slice allows me to change before departure, then I can change that slice, pushing it back by a couple of days. I will have to pay the "fare difference" if my new flights are more expensive than the old ones. If there's a penalty, I'll also have to pay that to process the change.

Postpone my whole trip by two weeks: If my order as a whole allows me to change before departure, then I can change both slices, pushing them back by two weeks. I will have to pay any extra amount if my new flights are more expensive than the old ones. If there's a penalty, I'll also have to pay that to process the change.

Cancel both flights and pick new ones later: If my order as a whole allows me to change before departure, then I can cancel these flights and wait until later to decide my next steps. Later in the year, I can come back and pick my new dates, and at that point, I'll pay any extra amount for the flights plus any penalty that applies.

It's important to note that, in the fourth case, I cancel all of my flights but the airline still calls this a "change" because I intend to come back later and pick new flights, rather than asking for my money back.
What information is available in the Duffel API?
In the Duffel API, we return "conditions" to tell you what will happen if a customer wants to change or refund their flights.
The conditions attribute is available on offers and orders - in other words, before and after a customer makes a booking. Inside it, there can be two different types of condition: change_before_departure and refund_before_departure.
At the top level of an offer or order, we tell you what will happen if you want to change or refund all of the slices together at the same time for all of the passengers.
At the level of an individual slice, we tell you what will happen if you want to change that slice on its own for all of the passengers - for example, if you want to change the date of the inbound flights in a round trip.
Tip

We don't return refund conditions at the slice level because it isn't possible to refund one slice in an order with multiple slices. The airline thinks of that as a change, because there are still flights left over.
For each condition, we'll give you:
a boolean telling you whether it's allowed

the penalty_amount and penalty_currency of any penalty that applies - if we know it

We get our data directly from the airlines. In some cases, it won't be available. In this case, the condition will be null. This doesn't mean that changing or refunding isn't possible, or that there's no fee. It just means that we don't know.
The data we return only applies for changes and refunds before departure. If any of the flights in the booking have departed - even if the passenger didn't take those flights! - different conditions will apply.
It's also only relevant for what airlines call a "voluntary change", where the passenger chooses voluntarily to change their plans. If there's a schedule change on the airline's side - for example they change the times of the flights or cancel one or more of them - then different "involuntary change" rules will apply.
Worked examples
Let's take our example of our round trip from London to Ibiza and go through some scenarios for how the conditions could look.
An example of the way change and refund conditions can be displayed to customers
An example of the way change and refund conditions can be displayed to customers

Refunds are not allowed
This section explains the refund conditions for the Economy Basic scenario depicted above.
If refunds aren't allowed, the conditions.refund_before_departure.allowed attribute will be false, and the penalty amount and currency will be null:
JSON


{
  "id": "off_123",
  // ...
  "conditions": {
    "refund_before_departure": {
      "allowed": false,
      "penalty_amount": null,
      "penalty_currency": null
    }
    // ...
  }
}

This means that the customer can't cancel their flights and get their money back. However, depending on the change conditions, they may be able to pick new flights and hold on to some of the money they paid.
Refunds are allowed, but with a penalty
This section explains the refund conditions for the Economy Comfort scenario depicted above.
If refunds are allowed but a penalty applies, then the conditions.refund_before_departure.allowed attribute on the offer or order will be true with a non-zero amount:
JSON


{
  "id": "off_123",
  // ...
  "conditions": {
    "refund_before_departure": {
      "allowed": true,
      "penalty_amount": "100.00",
      "penalty_currency": "GBP"
    }
    // ...
  }
}

In this case, we're allowed to refund the offer or order, but a 100 GBP penalty will be subtracted from any refund.
Caution

The penalty_currency will not always match the currency of the offer or order (that is, its total_currency ). Where this is the case, the penalty will be converted into the currency you're paying in at the time that you process any change or refund, using the current exchange rate. This can happen if the airline provided the price in a different currency and Duffel is converting it into your chosen currency.
Refunds are allowed free of charge
This section explains the refund conditions for the Economy Flexible scenario depicted above.
If refunds are allowed free of charge, then the conditions.refund_before_departure.allowed attribute on the offer or order will be true with a zero penalty amount:
JSON


{
  "id": "off_123",
  // ...
  "conditions": {
    "refund_before_departure": {
      "allowed": true,
      "penalty_amount": "0.00",
      "penalty_currency": "GBP"
    }
    // ...
  }
}

This means that the customer can cancel their flights and get all of their money back.
Changes are not allowed for any of the flights
This section explains the changes conditions for the Economy Basic scenario depicted above.
If you aren't able to change any of the flights in the offer or order, the conditions.change_before_departure.allowed attribute at the top level will be false, and the penalty amount and currency will be null:
JSON


{
  "id": "off_123",
  // ...
  "conditions": {
    "change_before_departure": {
      "allowed": false,
      "penalty_amount": null,
      "penalty_currency": null
    }
    // ...
  }
}

This means that the customer can't change their flights. If they don't take them, they'll lose the money they paid.
Changes are allowed for all of the flights, but with a penalty
This section explains the changes conditions for the Economy Comfort scenario depicted above.
If changes are allowed but a penalty applies, then the conditions.change_before_departure.allowed attribute on the offer or order will be true with a non-zero amount:
JSON


{
  "id": "off_123",
  // ...
  "conditions": {
    "change_before_departure": {
      "allowed": true,
      "penalty_amount": "50.00",
      "penalty_currency": "GBP"
    }
    // ...
  }
  // ...
}

In this case, we're allowed to change all of the flights in the offer/order together, but we'll have to pay a 50 GBP penalty as well any fare difference if the new flights are more expensive than the old ones.
Changes are allowed free of charge for all of the flights
This section explains the changes conditions for the Economy Flexible scenario depicted above.
If changes are allowed free of charge, then the conditions.change_before_departure.allowed attribute on the offer or order will be true with a zero amount:
JSON


{
  "id": "off_123",
  // ...
  "conditions": {
    "refund_before_departure": {
      "allowed": true,
      "penalty_amount": "0.00",
      "penalty_currency": "GBP"
    }
    // ...
  }
}

In this case, we're allowed to change all of the flights in the offer/order, and we won't have to pay any penalty.
You'd expect to see this same condition replicated for each of the slices. If all of the slices can be changed together free of charge, then generally speaking, you can also change a single slice free of charge.
Changes are allowed for some, but not all, of the flights
Even if a change isn't allowed for the whole offer or order (i.e. changing all of the flights), it might still be possible to change some of the slices if there are multiple slices (for example a round trip).
If allowed is false at the offer or order level, but you're interested in partial changes, then you should check the conditions inside the slices. Even if changes are not allowed for the offer or order as a whole, you may find that there are slice-specific conditions where allowed is true.
In this example, the inbound flights can't be changed and thus the whole order is not changeable, but the outbound flights do allow changes for a 25 GBP fee:
JSON


{
    "id": "off_123",
    // ...
	"conditions": {
	    "change_before_departure": {
			"allowed": false,
			"penalty_amount": null,
			"penalty_currency": null
		}
		// ...
	},
	"slices": [
		{
			// ...
			"conditions": {
				"change_before_departure": {
					"allowed": true
					"penalty_amount": "25.00",
					"penalty_currency": "GBP"
				}
			}
		},
		{
			// ...
			"conditions": {
				"change_before_departure": {
                    "allowed": false,
                    "penalty_amount": null,
                    "penalty_currency": null
                }
			}
		}
	]
}



Hide full sample

There may still be a price difference to pay if the new flights are more expensive than the old ones, which the customer would also have to pay.
We don't know if changes and/or refunds are allowed
Duffel doesn't support conditions for all airlines, and even for airlines where conditions are supported, it may not be available for all offers and orders.
Where we don't know the conditions for an offer or order, the change_before_departure and/or refund_before_departure attributes will be null:
JSON


{
  "id": "off_123",
  // ...
  "conditions": {
    "change_before_departure": null,
    "refund_before_departure": null
  },
  "slices": [
    {
      // ...
      "conditions": {
        "change_before_departure": null,
        "refund_before_departure": null
      }
    },
    {
      // ...
      "conditions": {
        "change_before_departure": null,
        "refund_before_departure": null
      }
    }
  ]
}

This can also happen at the slice level.
We know that changes/refunds are allowed, but we don't know what penalty applies (if any)
In some cases, we may know that changes or refunds are allowed, but we may not know the penalty.
In this case, the allowed attribute will be true but the penalty_amount and penalty_currency inside the condition will be null:
JSON


{
  "id": "off_123",
  // ...
  "conditions": {
    "change_before_departure": {
      "allowed": true,
      "penalty_amount": null,
      "penalty_currency": null
    }
    // ...
  }
}

This can also happen at the slice level.
Finding Airports within an Area
Overview
Flights go from airport to airport, and thus that's how searches are framed. Within the airline industry, there's also the concept of cities (AKA metropolitan areas) that can have 1 or more airports attached to them.
A traveller may want to know which airport(s) best suit the location that they're wanting to go to. To help with this, we have an endpoint that can suggest places based on some filtering criteria.
Finding airports by a location
We'll use an example trip to demonstrate how to do this. Lagos, Portugal doesn't have its own airport. Which is the most reasonably close airport that could be flown into and then have a less than an hour drive?
Request
Here's an example of a query to our API to list airports within 100km of Lagos, using its latitude and longitude.
Shell


curl

curl -X GET --compressed "https://api.duffel.com/places/suggestions?lat=37.129665&lng=-8.669586&rad=100000"
    -H "Accept-Encoding: gzip"
    -H "Accept: application/json"
    -H "Duffel-Version: v2"
})
Response
We get back 2 airports from the API which are in the nearby cities of Faro and Portimão.
JSON


{
  "meta": null,
  "data": [
    {
      "type": "airport",
      "time_zone": "Europe/Lisbon",
      "name": "Portimão Airport",
      "longitude": -8.582632,
      "latitude": 37.148769,
      "id": "arp_prm_pt",
      "icao_code": "LPPM",
      "iata_country_code": "PT",
      "iata_code": "PRM",
      "iata_city_code": "PRM",
      "city_name": "Portimão"
    },
    {
      "type": "airport",
      "time_zone": "Europe/Lisbon",
      "name": "Faro Airport",
      "longitude": -7.967814,
      "latitude": 37.015998,
      "id": "arp_fao_pt",
      "icao_code": "LPFR",
      "iata_country_code": "PT",
      "iata_code": "FAO",
      "iata_city_code": "FAO",
      "city_name": "Faro"
    }
  ]
}



View full sample

Doing searches for the suggested location
Now that we have airports, you can do separate searches for each of them, and return them to your traveller to pick from. You would need to combine the offers, if any, from the 2 different responses.
If you haven't yet, we recommend reading more in the Multi-Step Search Guide or head directly to the Partial Offer Request reference.

Adding Corporate Loyalty Programme Accounts
Overview
Corporate loyalty programmes allow businesses to earn rewards and benefits when their employees travel. This guide explains how to access these programmes through the Duffel API when searching for flights.
When searching for flights using the Duffel API, you can access corporate loyalty programmes by adding specific information to your offer request.
Similar to corporate private fares, corporate loyalty programmes are accessed through the private_fares object. However, airlines require different parameters to be submitted.
Supported airlines and requirements
The following airlines support corporate loyalty programmes through the Duffel API, each with specific required parameters:
Airline	Programme Name	Required Parameter
United Airlines (UA)	PerksPlus	tour_code
American Airlines (AA)	AAdvantage	tracking_reference
Air France (AF)	Bluebiz	tracking_reference
KLM (KL)	Bluebiz	tracking_reference
Delta (DL)	SkyBonus	tracking_reference
Southwest (WN)	SWABIZ and Rapid Rewards BIZ	tracking_reference
Frontier (F9)	Biz travel for less	tracking_reference
Alaskan (AS)	EasyBiz	tracking_reference
WestJet (WS)	WestJetBiz	tracking_reference
JetBlue (B6)	JetBlue Business Travel	tracking_reference
This is not a definitive list. If there are major carriers missing from the list please reach out to use to find out about our support, it's possible we already support them.
Adding corporate loyalty programmes to your search
To add corporate loyalty programme details to your search, include the private_fares object in your offer request with the appropriate parameters for each airline.
Example: United Airlines PerksPlus
When accessing United Airlines' PerksPlus programme, you need to provide a tour_code:
Shell


curl

curl -X POST https://api.duffel.com/offer_requests \
    -H "Accept-Encoding: gzip"
    -H "Accept: application/json"
    -H "Duffel-Version: v2"
    -d '{
    "slices": [
        {
            "origin": "SFO",
            "destination": "LAX",
            "departure_date": "2025-07-15"
        }
    ],
    "passengers": [{ "type": "adult" }],
    "private_fares": {
        "UA": [
            {
                "tour_code": "CORP123"
            }
        ]
    }
}'
Example: American Airlines AAdvantage
For American Airlines' AAdvantage corporate programme, use the tracking_reference parameter:
Shell


curl

curl -X POST https://api.duffel.com/offer_requests \
    -H "Accept-Encoding: gzip"
    -H "Accept: application/json"
    -H "Duffel-Version: v2"
    -d '{
    "slices": [
            {
                    "origin": "JFK",
                    "destination": "ORD",
                    "departure_date": "2023-07-15"
            }
    ],
    "passengers": [{ "type": "adult" }],
    "private_fares": {
            "AA": [
                    {
                            "tracking_reference": "AA12345"
                    }
            ]
    }
}'
Checking if an offer includes corporate loyalty benefits
When you receive offers, you can check if they include the corporate loyalty programme benefits by examining the private_fares property of each offer. This property will include details about any corporate loyalty programme applied to the offer.
Caution

Suppliers do not usually validate that correct loyalty programmes have been input at search or order creation time. It is imperative you provide accurate information. Invalid information will often result in offers that have the incorrect information attached and nothing earned on the scheme.
Holding Orders and Paying Later
Note

The ability to hold an order and pay for it later is not yet available for all airlines. We recommend using an offer from Duffel Airways or American Airlines to follow along with this guide.
What does it mean to hold an order?
Holding an order allows you to hold space on a flight and pay for it at a later time. For example, perhaps your customer is booking a flight for a business trip and wants to hold their seat while they wait for their manager to approve the trip. In the industry, holding an order is sometimes referred to as deferred ticketing. We refer to orders that can be paid after booking as “Hold Orders”.
You hold an order by creating an order without supplying payment, and then paying for it by a particular time indicated in the order.
What do you need to start?
It’s important you know the basics of how to search for flights and create an order. If you could use a refresher, please head over to our Quick Start Guide.
Tip

We've put together a Postman Collection that contains all of the requests you'll need to follow along with this guide.
Overview
Holding an order involves three steps:
You identify an offer that can be held and paid for later

You create an order with type hold

You pay for your order before it expires

Identifying an offer that can be held and paid for later
Offers that can be held and paid for later will have payment_requirements.requires_instant_payment set to false.
For example, all American Airlines and Duffel Airways offers are eligible. Here’s a simple search for Duffel Airways flights:
Shell


curl

curl -X POST --compressed "https://api.duffel.com/air/offer_requests" 
  -H "Accept-Encoding: gzip" 
  -H "Accept: application/json" 
  -H "Content-Type: application/json" 
  -H "Duffel-Version: v2" 
  -H "Authorization: Bearer $YOUR_ACCESS_TOKEN" 
  -d '{
  "data": {
    "slices": [
      {
        "departure_date": "2024-06-21",
        "destination": "LGW",
        "origin": "LHR"
      }
    ],
    "passengers": [{"type": "adult"}]
  }
}'
Hold offers may also have a price guarantee, but not all offers that can be held have a price guarantee.
JSON


"payment_requirements": {
  "requires_instant_payment": false,
  "price_guarantee_expires_at": "2021-06-01T23:59:59Z",
  "payment_required_by": "2021-06-20T23:59:59Z"
}

Although some airlines may support holding for all orders, you should always check payment_requirements.requires_instant_payment to determine whether the particular offer is eligible. This protects against any changes in the future and allows you to support future airlines that may have more complex rules.
How does the price guarantee work?
If price_guarantee_expires_at is not null the airline will hold the price of this offer - that is, the total_amount - up to the specified time, providing you create a hold order to lock in the price quote.
If price_guarantee_expires_at is null the space on the flight will be reserved (until the payment_required_by timestamp) but the price can change between booking and payment.
Creating an order to hold the passenger’s seat
Booking a hold order is similar to booking an order that is paid instantly, but you need to take some additional steps:
Set the type field to hold

Omit the payments key, as no payment takes place at the time of booking

Shell


curl

curl -X POST --compressed "https://api.duffel.com/air/orders" 
  -H "Accept-Encoding: gzip" 
  -H "Accept: application/json" 
  -H "Content-Type: application/json" 
  -H "Duffel-Version: v2" 
  -H "Authorization: Bearer $YOUR_ACCESS_TOKEN" 
  -d '{
  "data": {
    "type": "hold",
    "selected_offers": ["'"$OFFER_ID"'"],
    "passengers": [
      {
        "phone_number": "+442080160508",
        "email": "tony@example.com",
        "born_on": "1980-07-24",
        "title": "mr",
        "gender": "m",
        "family_name": "Stark",
        "given_name": "Tony",
        "id": "'"$PASSENGER_ID"'"
      }
    ]
  }
}
After booking, you can see the payment status and timestamps through the payment_status field on the order:
JSON


"payment_status": {
  "price_guarantee_expires_at": "2021-06-01T23:59:59Z",
  "payment_required_by": "2021-06-20T23:59:59Z",
  "awaiting_payment": true
}

What happens if I don’t pay?
If you don’t pay for a flight before the time indicated in payment_required_by, the space will be released by the airline and the awaiting_payment status of the order will be set to false. You will need to create a new order if you still wish to make a similar booking.
How do I get the latest price?
You can always get the most up-to-date price by retrieving the order:
Shell


curl

curl -X GET --compressed "https://api.duffel.com/air/orders/$ORDER_ID" 
  -H "Accept-Encoding: gzip" 
  -H "Accept: application/json" 
  -H "Content-Type: application/json" 
  -H "Duffel-Version: v2" 
  -H "Authorization: Bearer $YOUR_ACCESS_TOKEN"
You should get the latest price before paying. If you haven’t checked the price and you try to pay using an out-of-date price, you’ll get a price_changed error. If you get this error you should retrieve the order to get the latest price.
Note that it isn't currently possible to access the history of prices for an order, so you will need to implement your own tracking of differences between prices if it's required for your use case.
Paying for the order
To pay for the order, use the create a payment endpoint and pass in the order_id and the latest order price.
Shell


curl

curl -X POST --compressed "https://api.duffel.com/air/payments" 
  -H "Accept-Encoding: gzip" 
  -H "Accept: application/json" 
  -H "Content-Type: application/json" 
  -H "Duffel-Version: v2" 
  -H "Authorization: Bearer $YOUR_ACCESS_TOKEN" 
  -d '{
  "data": {
    "order_id": "'"$ORDER_ID"'",
    "payment": {
      "type": "balance",
      "amount": "'"$ORDER_TOTAL_AMOUNT"'",
      "currency": "'"$ORDER_TOTAL_CURRENCY"'"
    }
  }
}
You'll also need to include the currency of the payment ($ORDER_TOTAL_CURRENCY) in ISO 4217 format — it should match the pending order's total_currency — and the total amount ($ORDER_TOTAL_AMOUNT) of the order, which should match the pending order's total_amount.
The order is now paid for and the passenger is ready to fly. To verify that the order is paid for, you can retrieve the order again and check that awaiting_payment is now set to false and that documents have been issued for the order.
JSON


{
  "payment_status": {
    "price_guarantee_expires_at": "2021-06-01T23:59:59Z",
    "payment_required_by": "2021-06-20T23:59:59Z",
    "awaiting_payment": false
  },
  "documents": [
    {
      "unique_identifier": "123-1230984567",
      "type": "electronic_ticket"
    }
  ]
}

What happens if the price guarantee expires?
The price guarantee can expire part-way through the lifetime of the order. If this happens, retrieving the order after the price_guarantee_expires_at time may give you a new price.
The price_guarantee_expires_at is always the guarantee that applies to the price at the time that the order is retrieved. This means that after we fetch a new price, the price_guarantee_expires_at timestamp will be:
updated to a new timestamp if the new price is guaranteed

updated to null if the new price doesn’t have a guarantee

Even as the price guarantee expires, the order will be available to complete until payment_required_by.
What happens if the flight schedule changes?
For instant orders, we usually notify you about changes. But for held orders, we won’t notify you of changes until they have been paid.
If the airline makes a change to an order between you creating it and paying for it, you will get a schedule_changed error when attempting to pay. This is to protect you from paying for a different itinerary than you were expecting at the time of booking.
Adding Extra Bags
Note

The ability to book baggage with your flight is not available for all airlines yet. We recommend using British Airways offers to follow along on this guide.
Ancillaries component

If you'd like to offer extra bags (and other ancillaries) to your customers quickly without having to build the user interface yourself, we offer a UI component that makes it trivially simple.


Learn how to use the Ancillaries component
→
What do you need to start?
This guide will go through the changes you need to make in the booking flow to be able to list and book services for any offer you want. It's important you know the basics of how to create a booking.
If you are not familiar with how to create an order please head over to our Quick Start Guide.

This guide will start from an offer so make sure you grab an offer ID for a British Airways flight before we start.

Tip

We've put together a Postman Collection that contains all of the requests you'll need to follow along with this guide.
Overview
Baggages are a type of what we call available_services. Available services are specific to an offer but not surfaced through the API by default. The changes we'll make to work with available services are:
Retrieve an offer along with its available_services

Include services to order creation

See the services booked on an order

Getting services for an offer
We start by fetching the offer to make sure to get its most up-to-date information. The get offer endpoint gives you the ability to retrieve available services with the offer by applying the query parameter return_available_services set to true. Using a valid offer ID you can use:
Shell


curl

curl -X GET --compressed "https://api.duffel.com/air/offers/$OFFER_ID?return_available_services=true"
  -H "Accept-Encoding: gzip"
  -H "Accept: application/json"
  -H "Duffel-Version: v2"
  -H "Authorization: Bearer $YOUR_ACCESS_TOKEN"
This request will return an offer which now includes the available_services attribute.
Available services
The only available service currently supported is baggages. Each available service is unique and identifiable by ID. The price of the service is described by total_currency and total_amount. And the actual service information is determined by its type and metadata.
Important to notice that services are specific to segments and passengers. The relationship is described by the attributes segment_ids and passenger_ids.
Learn more
For a complete description of the available services schema check out the API reference.
https://duffel.com/docs/api/offers/schema

Booking with services
Once you know what offer and service a user wants to book, all you have to do is send a request to the create order endpoint with 2 small changes to the payload.
Shell


curl

curl -X POST --compressed "https://api.duffel.com/air/orders"
  -H "Accept-Encoding: gzip"
  -H "Accept: application/json"
  -H "Content-Type: application/json"
  -H "Duffel-Version: v2"
  -H "Authorization: Bearer $YOUR_ACCESS_TOKEN"
  -d '{
  "data": {
    "selected_offers": ["'"$OFFER_ID"'"],
    "payments": [
      {
        "type": "balance",
        "currency": "'"$TOTAL_CURRENCY"'",
        "amount": "'"$TOTAL_AMOUNT"'"
      }
    ],
    "passengers": [
      {
        "phone_number": "+442080160508",
        "email": "tony@example.com",
        "born_on": "1980-07-24",
        "title": "mr",
        "gender": "m",
        "family_name": "Stark",
        "given_name": "Tony",
        "infant_passenger_id": "'"$INFANT_PASSENGER_ID"'",
        "id": "'"$ADULT_PASSENGER_ID_1"'"
      },
      {
        "phone_number": "+442080160509",
        "email": "potts@example.com",
        "born_on": "1983-11-02",
        "title": "mrs",
        "gender": "m",
        "family_name": "Potts",
        "given_name": "Pepper",
        "id": "'"$ADULT_PASSENGER_ID_2"'"
      },
      {
        "phone_number": "+442080160506",
        "email": "morgan@example.com",
        "born_on": "2019-08-24",
        "title": "mrs",
        "gender": "f",
        "family_name": "Stark",
        "given_name": "Morgan",
        "id": "'"$INFANT_PASSENGER_ID"'"
      }
    ],
    "services": [
      {
        "quantity": 2,
        "id": "'"$SERVICE_ID_1"'"
      },
      {
        "quantity": 1,
        "id": "'"$SERVICE_ID_2"'"
      }
    ]
  }
}'


Hide full sample

You must add the attribute services to your request payload. This field should contain a list of services to be book along with the offer specified in the selected_offers field. Each service on the list here must contain the available service ID ($SERVICE_ID_N) and the desired quantity.
The payment amount ($TOTAL_AMOUNT) must be increased by the amount times quantity of each service you'd like to purchase. For example, if your offer total is 50 GBP and you include service A with quantity 2 and total_amount 10 GBP, the amount of the payment should now be 70 GBP.
Services on Order
Once the booking has gone through in the airline's system we will return the usual order create response payload to you. You can always retrieve your order by ID:
Shell


curl

curl -X GET --compressed "https://api.duffel.com/air/orders/$ORDER_ID"
  -H "Accept-Encoding: gzip"
  -H "Accept: application/json"
  -H "Duffel-Version: v2"
  -H "Authorization: Bearer $YOUR_ACCESS_TOKEN"
Services
The service object will look exactly the same as the available service except for maximum_quantity being replaced with quantity. It's worth flagging that any ancillary baggages booked as services will not be present in the slices[].segments[].passengers[].baggages[]. They are only present in the services field. If you want the full picture of a passenger's baggage you will need to combine both.
Documents
Some airlines record the booking and the payment of ancillary services in a document different from the electronic ticket issued for the flight. These documents are called Electronic Miscellaneous Documents. When available we expose them in the API as a document with a type of electronic_miscellaneous_document_associated.
Adding Seats
Note

The ability to pick a seat is not yet available for all airlines. We recommend using an offer from American Airlines to follow along with this guide.
Ancillaries component

If you'd like to offer seat selection (and other ancillaries) to your customers quickly without having to build the user interface yourself, we offer a UI component that makes it trivially simple.


Learn how to use the Ancillaries component
→
What do you need to start?
This guide assumes that you've built a basic "search and book" flow with the Duffel API. If you haven't done this yet, we'd recommend that you read through our Quick Start guide first.
We also recommend reading through the seat maps endpoint API documentation before you continue on reading this guide.
Tip

We've put together a Postman Collection that contains all of the requests you'll need to follow along with this guide.
Overview
In this guide, we'll show you how to select free or paid seats for passengers when booking flights through the Duffel API.
We'll explain how to interpret the seat map data returned in the API so you can build your own interactive seat map, allowing customers to pick their own seats.
Searching for flights
To search for flights, you'll need to create an offer request. You'll get back a series of search results called offers. Each has a unique ID.
We recommend using an offer from American Airlines to follow along with this guide. To find an American Airlines offer where seat selection is available, we'd recommend searching with one slice from DFW (Dallas) to AUS (Austin), about three months from today's date. to follow along with this guide.
Requesting seat maps for an offer
Seat Maps in the Duffel API show you the layout of the plane, what seats are available and how much they cost, if anything.
You'll request seat maps in the context of an offer, using its ID. For this guide, we suggest using an offer from American Airlines. You can identify an American Airlines offer by looking at its owner attribute:
{
  "owner": {
    "iata_code": "AA",
    "id": "arl_00009VME7DAGiJjwomhv32",
    "name": "American Airlines"
  }
}
You'll use the "Get seat maps" API to get the seat maps for an offer:
Shell


curl

curl -X GET --compressed "https://api.duffel.com/air/seat_maps?offer_id=$OFFER_ID"
  -H "Accept-Encoding: gzip"
  -H "Accept: application/json"
  -H "Duffel-Version: v2"
  -H "Authorization: Bearer $YOUR_ACCESS_TOKEN"
The data attribute in the response will be an array with a list of seats maps. One offer can include multiple segments (i.e. flights), so we may return multiple seat maps:
JSON


{
  "data": [
    {
      "cabins": [
        {
          "aisles": 2,
          "cabin_class": "economy",
          "deck": 0,
          "rows": [
            {
              "sections": [
                {
                  "elements": [
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA1A",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "30.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "1A",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    },
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA1B",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "30.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "1B",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    },
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA1C",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "30.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "1C",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA1D",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "30.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "1D",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    },
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA1E",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "30.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "1E",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    },
                    {
                      "available_services": [],
                      "designator": "1F",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    },
                    {
                      "available_services": [],
                      "designator": "1G",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA1J",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "30.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "1H",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    },
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA1K",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "30.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "1J",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    },
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA1M",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "30.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "1K",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    }
                  ]
                }
              ]
            },
            {
              "sections": [
                {
                  "elements": [
                    {
                      "type": "exit_row"
                    }
                  ]
                },
                {
                  "elements": []
                },
                {
                  "elements": [
                    {
                      "type": "exit_row"
                    }
                  ]
                }
              ]
            },
            {
              "sections": [
                {
                  "elements": [
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA2A",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "20.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "2A",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    },
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA2B",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "20.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "2B",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    },
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA2C",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "20.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "2C",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "available_services": [],
                      "designator": "2D",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    },
                    {
                      "available_services": [],
                      "designator": "2E",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    },
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA2F",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "20.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "2F",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    },
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA2G",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "20.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "2G",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "available_services": [],
                      "designator": "2H",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    },
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA2J",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "20.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "2J",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    },
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA2K",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "20.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "2K",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    }
                  ]
                }
              ]
            },
            {
              "sections": [
                {
                  "elements": [
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA3A",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "10.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "3A",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    },
                    {
                      "available_services": [],
                      "designator": "3B",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    },
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA3C",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "10.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "3C",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA3D",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "10.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "3D",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    },
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA3E",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "10.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "3E",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    },
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA3F",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "10.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "3F",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    },
                    {
                      "available_services": [],
                      "designator": "3G",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA3H",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "10.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "3H",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    },
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA3J",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "10.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "3J",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    },
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA3K",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "10.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "3K",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    }
                  ]
                }
              ]
            },
            {
              "sections": [
                {
                  "elements": [
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA4A",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "10.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "4A",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    },
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA4B",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "10.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "4B",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    },
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA4C",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "10.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "4C",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA4D",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "10.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "4D",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    },
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA4E",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "10.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "4E",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    },
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA4F",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "10.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "4F",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    },
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA4G",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "10.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "4G",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "available_services": [],
                      "designator": "4H",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    },
                    {
                      "available_services": [],
                      "designator": "4J",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    },
                    {
                      "available_services": [
                        {
                          "id": "ase_00009UhD4ongolulWAAA4K",
                          "passenger_id": "pas_00009hj8USM7Ncg31cAAA",
                          "total_amount": "10.00",
                          "total_currency": "GBP"
                        }
                      ],
                      "designator": "4K",
                      "disclosures": [],
                      "name": "",
                      "type": "seat"
                    }
                  ]
                }
              ]
            },
            {
              "sections": [
                {
                  "elements": [
                    {
                      "type": "lavatory"
                    }
                  ]
                },
                {
                  "elements": []
                },
                {
                  "elements": [
                    {
                      "type": "lavatory"
                    }
                  ]
                }
              ]
            },
            {
              "sections": [
                {
                  "elements": [
                    {
                      "type": "galley"
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "type": "galley"
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "type": "galley"
                    }
                  ]
                }
              ]
            }
          ],
          "wings": {
            "first_row_index": 1,
            "last_row_index": 2
          }
        }
      ],
      "id": "sea_00003hthlsHZ8W4LxXjkzo",
      "segment_id": "seg_00009htYpSCXrwaB9Dn456",
      "slice_id": "sli_00009htYpSCXrwaB9Dn123"
    }
  ]
}



Hide full sample

Seat selection isn't currently available for all airlines. Even for airlines that support seat selection, there may be some offers where it isn't available (for example offers that include flights from other airlines).
If seat selection isn't available, the Seat Maps API will return an empty list of seat maps. You should handle this gracefully in your integration:
JSON


{
  "data": [],
  "meta": null
}

Turning the Seat Maps API response into a visual seat map
Next, you'll probably use the response from the Seat Maps API to render a visual seat map, where your customers can see the available seats and their prices, and pick a seat that meets their needs.
In this step, we'll show you how to interpret that data and turn it into something beautiful, like you see in the Duffel booking tool.
The goal of this guide is to show you how to interpret the data. You can, of course, apply your own visual style.
Example seat map in the Duffel booking tool
Example seat map in the Duffel booking tool

Here's an example seat map response for an offer with a single passenger, a single slice and a single segment:
JSON


{
  "data": [
    {
      "id": "sea_0000A8okiQhItNg1JSmCuW",
      "cabins": [
        {
          "wings": {
            "last_row_index": 1,
            "first_row_index": 0
          },
          "rows": [
            {
              "sections": [
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "28A",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "28B",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQhes3xbKYwUS1",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [
                        "Passenger must be an adult",
                        "Do not seat passengers with special needs in exit row seats or bulkheads"
                      ],
                      "designator": "28C",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQhes3xbKYwUSz",
                          "total_currency": "GBP",
                          "total_amount": "20.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "28D",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [
                        "Passenger must be an adult",
                        "Do not seat passengers with special needs in exit row seats or bulkheads"
                      ],
                      "designator": "28E",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQhes3xbKYwUT4",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "28F",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQhes3xbKYwUT7",
                          "total_currency": "GBP",
                          "total_amount": "20.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [
                        "Passenger must be an adult",
                        "Do not seat passengers with special needs in exit row seats or bulkheads"
                      ],
                      "designator": "28H",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [
                        "Passenger must be an adult",
                        "Do not seat passengers with special needs in exit row seats or bulkheads"
                      ],
                      "designator": "28J",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "28K",
                      "available_services": []
                    }
                  ]
                }
              ]
            },
            {
              "sections": [
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "29A",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "29B",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQi0qkFBLf6m17",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "29C",
                      "available_services": []
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "29D",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "29E",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "29F",
                      "available_services": []
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "29H",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "29J",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "29K",
                      "available_services": []
                    }
                  ]
                }
              ]
            },
            {
              "sections": [
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "30A",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "30B",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "30C",
                      "available_services": []
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "30D",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "30E",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "30F",
                      "available_services": []
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "30H",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQi0qkFBLf6m1T",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "30J",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQi0qkFBLf6m1W",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "30K",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQiMpQWlMlH3ZK",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "sections": [
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "31A",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "31B",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQiMpQWlMlH3ZQ",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "31C",
                      "available_services": []
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "31D",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQiMpQWlMlH3ZV",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "31E",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "31F",
                      "available_services": []
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "31H",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQiMpQWlMlH3Zb",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "31J",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "31K",
                      "available_services": []
                    }
                  ]
                }
              ]
            },
            {
              "sections": [
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "32A",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQiMpQWlMlH3Zi",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "32B",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "32C",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQiio6oLNrRL7a",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "32D",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "32E",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "32F",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQiio6oLNrRL7g",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "32H",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQiio6oLNrRL7k",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "32J",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQiio6oLNrRL7n",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "32K",
                      "available_services": []
                    }
                  ]
                }
              ]
            },
            {
              "sections": [
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "33A",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "33B",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "33C",
                      "available_services": []
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "33D",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQiio6oLNrRL7x",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "33E",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "33F",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQj4mn5vOxbcfq",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "33H",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQj4mn5vOxbcfu",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "33J",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQj4mn5vOxbcfx",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "33K",
                      "available_services": []
                    }
                  ]
                }
              ]
            },
            {
              "sections": [
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "34A",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "34B",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "34C",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQj4mn5vOxbcg5",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "34D",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "34E",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQjQlTNVQ3luE8",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "34F",
                      "available_services": []
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "34H",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "34J",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "34K",
                      "available_services": []
                    }
                  ]
                }
              ]
            },
            {
              "sections": [
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "35A",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQjQlTNVQ3luEI",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "35B",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "35C",
                      "available_services": []
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "35D",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQjQlTNVQ3luEO",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "35E",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "35F",
                      "available_services": []
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "35H",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQjmk9f5R9wBmP",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "35J",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQjmk9f5R9wBmS",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "35K",
                      "available_services": []
                    }
                  ]
                }
              ]
            },
            {
              "sections": [
                {
                  "elements": [
                    {
                      "type": "lavatory"
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "type": "lavatory"
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "type": "lavatory"
                    }
                  ]
                }
              ]
            },
            {
              "sections": [
                {
                  "elements": [
                    {
                      "type": "exit_row"
                    }
                  ]
                },
                {
                  "elements": []
                },
                {
                  "elements": [
                    {
                      "type": "exit_row"
                    }
                  ]
                }
              ]
            },
            {
              "sections": [
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "36A",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQmcZbvjZxGSCT",
                          "total_currency": "GBP",
                          "total_amount": "20.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "36B",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQmcZbvjZxGSCW",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "36C",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQmcZbvjZxGSCZ",
                          "total_currency": "GBP",
                          "total_amount": "20.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "36D",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "36E",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQmcZbvjZxGSCe",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "36F",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQmcZbvjZxGSCh",
                          "total_currency": "GBP",
                          "total_amount": "20.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "36H",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "36J",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQmcZbvjZxGSCm",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "36K",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQmyYIDJb3Qjkg",
                          "total_currency": "GBP",
                          "total_amount": "20.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "sections": [
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "37A",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "37B",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQmyYIDJb3Qjkm",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "37C",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQmyYIDJb3Qjkp",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "37D",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "37E",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "37F",
                      "available_services": []
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "37H",
                      "available_services": [
                        {
                          "id": "ase_0000A8okiQmyYIDJb3Qjkx",
                          "total_currency": "GBP",
                          "total_amount": "0.0",
                          "passenger_id": "pas_0000A8oTVsAt8YurG9h4xn"
                        }
                      ]
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "37J",
                      "available_services": []
                    },
                    {
                      "type": "seat",
                      "name": "",
                      "disclosures": [],
                      "designator": "37K",
                      "available_services": []
                    }
                  ]
                }
              ]
            },
            {
              "sections": [
                {
                  "elements": [
                    {
                      "type": "galley"
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "type": "galley"
                    }
                  ]
                },
                {
                  "elements": [
                    {
                      "type": "galley"
                    }
                  ]
                }
              ]
            }
          ],
          "deck": 0,
          "aisles": 2,
          "cabin_class": "economy"
        }
      ],
      "slice_id": "sli_0000A8oTVsOiJ9yVx2A7Vp",
      "segment_id": "seg_0000A8oTVsOiJ9yVx2A7Vo"
    }
  ]
}



Hide full sample

The response includes seats in the cabin that the passenger is flying in (economy).
This cabin has 2 aisles, so there will be 3 sections in each row . We'll refer to these as the left, middle, and right sections. In the response there are 13 rows, which consist of seats and other features (which we call "elements").
Tip

Rows are zero-indexed in our API. That means if you have 3 rows, the first row is at index 0, the second row at index 1, etc. In this guide, we'll refer to rows in a more "human" way (first row, second row, etc.).
Looking at our example response, a typical row has 3 seats each in the left section (ABC), middle section (DEF), and the right section (HJK). Aircraft configurations can be complex, so keep in mind that rows could have missing seats or contain other elements such as toilets.
We'll render each row one-by-one to build up a full seat map. A row is made up of elements. Seat elements have a type attribute that says seat.
Where a seat is available, the seat element will have a list of one or more available_services attached to it. The services will contain information about the seat like the total amount it costs (which can be free!) and any disclosures (text to display about the "rules" for the seat).
Where there are multiple passengers, there will be a service per passenger with the passenger's ID, to allow for the fact that an airline might charge different prices for the same seat, depending on who the passenger is.
If a seat doesn't have an available service (represented as an empty list, []), it means that the seat is unavailable. We'll want to make that clear on our map. On our example, we can see that seats 28A, 28D, 28H, 28J and 28K are not available.
Row 28 of the seat map
Row 28 of the seat map

You may just want to render the seat elements - this is enough for a basic seat selection experience.
However, in our seat maps we also include additional information which you can optionally use to visualise a more complete seat map and provide a better user experience. The next few rows in our example will demonstrate that.
The ninth row in the response has toilets in the left, center and right sections. We'll display this row like this:
Toilets on the seat map
Toilets on the seat map

The tenth row in the response is an exit row, as signified by its exit_row elements. We will render this as empty space and exit markers before the following rows of seats:
Multiple rows and exit row on the seat map
Multiple rows and exit row on the seat map

The last row (thirteenth row in the response) has one galley in each section. Following the rendering suggestions in the API documentation, to fill the section, we will render it like this:
Galleys on the seat map
Galleys on the seat map

Finally, the wings data in the response shows us that the wings are positioned over the rows from 28 to 29, which ends up being the first and second rows in our rendered seat map. We can render some markers on the side of the seat map to indicate that, completing our seat map:
Full seat map
Full seat map

Creating an order with one or more seats selected
When creating an order, you'll need to pass in a list of services to refer to the seat(s) you want to book.
Looking back to our seat map, we knew that a seat was available because it had one or more available_services attached to it.
The services attribute when creating an order is a list. Each entry in the list should have an id and a quantity. The quantity will always be 1, and the $SEAT_SERVICE_ID should be the ID of the available service which corresponds to the passenger you want to book the seat for.
Looking back to our example above, if we wanted to select seat 28B for passenger pas_0000A8oTVsAt8YurG9h4xn, we'd use the service ID ase_0000A8okiQhes3xbKYwUS1:
JSON


{
  "data": {
    "services": [
      {
        "quantity": 1,
        "id": "$SEAT_SERVICE_ID"
      }
    ]
  }
}

You can add extra bags alongside any seats. To do this, you'd just add more items to the services list.
In the order creation request, you'll also specify payments information. The amount for your payment must include the price of all the seats and other services you're adding. To reach the final amount, you'd add together the total_amount of the selected offer and the total_amount of any services.
Checking the created order
In the response after you create an order or if you retrieve your order later, you'll see any seat services you selected in the top-level services field.
If you delve into the passengers inside the segments inside the slices, you'll also see a seat attribute with the designator (e.g. 1D) of the passenger's seat.
Cancelling an Order
Note

Cancellation is not yet supported for every order. If an order has the string cancel in its available_actions then you should be able to cancel it via the API. Otherwise, it is recommended to manually request a cancellation quote by clicking on the "Cancellation quote" option under "Manage this order" when viewing the order in the dashboard. The cancellation will then be handled by a member of our team.
What do you need to start?
All you need to get started is the id of the order you'd like to cancel. You must also ensure that the order is cancellable by checking whether "cancel" is a member of the available_actions property of the order.
Tip

We've put together a Postman Collection that contains all of the requests you'll need to follow along with this guide.
Overview
The order cancellation process happens in 2 steps:
You create an unconfirmed cancellation quote

You confirm the cancellation

Create Cancellation Quote
You have the ability to create a cancellation quote before cancelling an order. This allows you to review the conditions of the cancellation before confirming it such as the amount of money that will be refunded and where it will be refunded to (airline credit, the original form of payment or otherwise). You can create a cancellation quote by creating a new Order Cancellation using the id of the order you'd like to cancel.
Shell


curl

curl -X POST --compressed "https://api.duffel.com/air/order_cancellations" 
  -H "Accept-Encoding: gzip" 
  -H "Accept: application/json" 
  -H "Content-Type: application/json" 
  -H "Duffel-Version: v2" 
  -H "Authorization: Bearer $YOUR_ACCESS_TOKEN" 
  -d '{
  "data": {
    "order_id": "'"$ORDER_ID"'"
  }
}'
This request will return an Order Cancellation object which contains details of the cancellation quote. It will not be confirmed however it will contain important details about the prospective cancellation that you may wish to review before confirming it. Some of the important properties of the Order Cancellation object are explained below.
JSON


{
  // we'll use the id on the next step
  "id": "ore_00009qzZWzjDipIkqpaUAj",

  // determine whether you want to continue with the
  // cancellation or not based on the refund amount
  "refund_currency": "GBP",
  "refund_amount": "90.80",

  // if this timestamp is in the past you will
  // not be able to confirm your cancellation and
  // will need to re-request a cancellation quote
  "expires_at": "2020-01-17T10:42:14.545052Z",

  // where the refund will be returned to. In this
  // case the refund amount will be sent to the
  // original form of payment used to pay for the order.
  "refund_to": "original_form_of_payment"
  ...
}

The full schema definition can be found in the API documentation.
Confirm Cancellation
You can confirm the cancellation if you are happy with the quote provided. Please note that you can only confirm the most recent Order Cancellation quote otherwise you will receive a order_cancellation_stale error. Make the following request using the unique id of the Order Cancellation object created previously.
Shell


curl

curl -X POST --compressed "https://api.duffel.com/air/order_cancellations/$ORDER_CANCELLATION_ID/actions/confirm" 
  -H "Accept-Encoding: gzip" 
  -H "Accept: application/json" 
  -H "Duffel-Version: v2" 
  -H "Authorization: Bearer $YOUR_ACCESS_TOKEN"
The Order Cancellation object will be returned but it will now include a timestamp in the confirmed_at attribute. Your order is now cancelled and the refund offered in the quote should be applied. A cancelled order will also include the confirmed Order Cancellation object at the cancellation property.
Airline Credits
Occasionally an airline will provide airline credits instead of a monetary refund when an order is cancelled which the passenger can use to get a discount on future flights. These typically take the form of a "code" that the passenger can use on the airline's website.
Cancellations that will be refunded to airline credits will have the refund_to property set to airline_credits. The unconfirmed credits will also be included in the airline_credits array of the Order Cancellation albeit with the credit_code set to null. You can see an example of an Order Cancellation with airline credits below.
JSON


{
  "id": "ore_00009qzZWzjDipIkqpaUAj",

  // the total value of the airline credits detailed below
  "refund_currency": "GBP",
  "refund_amount": "90.80",

  // indicates that the cancellation will be refunded to
  // airline credits
  "refund_to": "airline_credits"

  // details about the specific airline credits
  "airline_credits": [
    {
      // typically the credit will be tied to a specific
      // passenger.
      "passenger_id": "pas_00009hj8USM7Ncg31cBCLL",

      // different airlines will have different names for
      // airline credit.
      "credit_name": "Duffel Travel Credit",

      // The value of the credit
      "credit_currency": "GBP",
      "credit_amount": "90.80"

      // The credit code that the passenger can use to
      // redeem the airline credit. this will be null
      // until the cancellation is confirmed at which
      // point it should be sent to the passenger.
      "credit_code": "1234567890123",
      ...
    }
  ]
  ...
}



Hide full sample

You can view the full airline credits schema in the API documentation. We also provide a test route from London Luton Airport (LTN) to London Stansted Airport (STN) which you can use to test your airline credits integration.
Changing an Order
What do you need to start?
All you need to get started with order changes is the id of the order you'd like to change.
Note that changes are not available for all orders. You can check if individual slices in an order can be changed by looking at its changeable property.
In this guide, we'll build on the example used on the quick start guide.
Tip

We've put together a Postman Collection that contains all of the requests you'll need to follow along with this guide.
Overview
Everything starts with an existing order:

Tony, Pepper, and their daughter Morgan have booked flights from New York City to Atlanta, leaving on 11th June and returning a week later on 18th June. They want to delay their return date by a week, coming back on 24th June instead.

We can start by using the "Get a single order" API to check the current details for their order:
JavaScript


Node.JS

duffel.orders.get(ORDER_ID)
You'll need to replace ORDER_ID with the ID of the order you want to change.
JSON


{
  "data": {
    "total_currency": "GBP",
    "total_amount": "7477.00",
    "tax_currency": "GBP",
    "tax_amount": "1140.56",
    "slices": [
      {
        "segments": [
          {
            "passengers": [
              {
                "seat": null,
                "passenger_id": "pas_0000A8L6LYhCn9xjBRTP60",
                "fare_basis_code": null,
                "cabin_class_marketing_name": "Business",
                "cabin_class": "business",
                "baggages": [
                  {
                    "type": "checked",
                    "quantity": 1
                  }
                ]
              },
              {
                "seat": null,
                "passenger_id": "pas_0000A8L6LYhCn9xjBRTP61",
                "fare_basis_code": null,
                "cabin_class_marketing_name": "Business",
                "cabin_class": "business",
                "baggages": [
                  {
                    "type": "checked",
                    "quantity": 1
                  }
                ]
              },
              {
                "seat": null,
                "passenger_id": "pas_0000A8L6LYhCn9xjBRTP62",
                "fare_basis_code": null,
                "cabin_class_marketing_name": "Business",
                "cabin_class": "business",
                "baggages": [
                  {
                    "type": "checked",
                    "quantity": 1
                  }
                ]
              }
            ],
            "origin_terminal": "2",
            "origin": {
              "type": "airport",
              "time_zone": "America/New_York",
              "name": "New York Stewart International Airport",
              "longitude": -74.102724,
              "latitude": 41.501292,
              "id": "arp_swf_us",
              "icao_code": "KSWF",
              "iata_country_code": "US",
              "iata_code": "SWF",
              "iata_city_code": "NYC",
              "city_name": "Newburgh",
              "city": {
                "type": "city",
                "time_zone": null,
                "name": "New York",
                "longitude": null,
                "latitude": null,
                "id": "cit_nyc_us",
                "icao_code": null,
                "iata_country_code": "US",
                "iata_code": "NYC",
                "iata_city_code": "NYC",
                "city_name": null
              }
            },
            "operating_carrier_flight_number": "7879",
            "operating_carrier": {
              "name": "Duffel Airways",
              "id": "arl_00009VME7D6ivUu8dn35WK",
              "iata_code": "ZZ"
            },
            "marketing_carrier_flight_number": "7879",
            "marketing_carrier": {
              "name": "Duffel Airways",
              "id": "arl_00009VME7D6ivUu8dn35WK",
              "iata_code": "ZZ"
            },
            "id": "seg_0000A8L6LZGIgg2EwHtQnY",
            "duration": "PT2H23M",
            "distance": "1360.5217397388235",
            "destination_terminal": "7",
            "destination": {
              "type": "airport",
              "time_zone": "America/New_York",
              "name": "Hartsfield-Jackson Atlanta International Airport",
              "longitude": -84.4279,
              "latitude": 33.638714,
              "id": "arp_atl_us",
              "icao_code": "KATL",
              "iata_country_code": "US",
              "iata_code": "ATL",
              "iata_city_code": "ATL",
              "city_name": "Atlanta",
              "city": {
                "type": "city",
                "time_zone": null,
                "name": "Atlanta",
                "longitude": null,
                "latitude": null,
                "id": "cit_atl_us",
                "icao_code": null,
                "iata_country_code": "US",
                "iata_code": "ATL",
                "iata_city_code": "ATL",
                "city_name": null
              }
            },
            "departure_terminal": "2",
            "departure_datetime": "2022-06-11T23:00:00",
            "departing_at": "2022-06-11T23:00:00",
            "arriving_at": "2022-06-12T01:23:00",
            "arrival_terminal": "7",
            "arrival_datetime": "2022-06-12T01:23:00",
            "aircraft": {
              "name": "Boeing 777-300",
              "id": "arc_00009VMF8AhXSSRnQDI6HE",
              "iata_code": "773"
            }
          }
        ],
        "origin_type": "airport",
        "origin": {
          "type": "airport",
          "time_zone": "America/New_York",
          "name": "New York Stewart International Airport",
          "longitude": -74.102724,
          "latitude": 41.501292,
          "id": "arp_swf_us",
          "icao_code": "KSWF",
          "iata_country_code": "US",
          "iata_code": "SWF",
          "iata_city_code": "NYC",
          "city_name": "Newburgh",
          "city": {
            "type": "city",
            "time_zone": null,
            "name": "New York",
            "longitude": null,
            "latitude": null,
            "id": "cit_nyc_us",
            "icao_code": null,
            "iata_country_code": "US",
            "iata_code": "NYC",
            "iata_city_code": "NYC",
            "city_name": null
          }
        },
        "id": "sli_0000A8L6Pqy4nZVh0nPdK5",
        "duration": "PT2H23M",
        "destination_type": "airport",
        "destination": {
          "type": "airport",
          "time_zone": "America/New_York",
          "name": "Hartsfield-Jackson Atlanta International Airport",
          "longitude": -84.4279,
          "latitude": 33.638714,
          "id": "arp_atl_us",
          "icao_code": "KATL",
          "iata_country_code": "US",
          "iata_code": "ATL",
          "iata_city_code": "ATL",
          "city_name": "Atlanta",
          "city": {
            "type": "city",
            "time_zone": null,
            "name": "Atlanta",
            "longitude": null,
            "latitude": null,
            "id": "cit_atl_us",
            "icao_code": null,
            "iata_country_code": "US",
            "iata_code": "ATL",
            "iata_city_code": "ATL",
            "city_name": null
          }
        },
        "conditions": {
          "change_before_departure": {
            "penalty_currency": null,
            "penalty_amount": null,
            "allowed": false
          }
        },
        "changeable": true
      },
      {
        "segments": [
          {
            "passengers": [
              {
                "seat": null,
                "passenger_id": "pas_0000A8L6LYhCn9xjBRTP60",
                "fare_basis_code": null,
                "cabin_class_marketing_name": "Business",
                "cabin_class": "business",
                "baggages": [
                  {
                    "type": "checked",
                    "quantity": 1
                  }
                ]
              },
              {
                "seat": null,
                "passenger_id": "pas_0000A8L6LYhCn9xjBRTP61",
                "fare_basis_code": null,
                "cabin_class_marketing_name": "Business",
                "cabin_class": "business",
                "baggages": [
                  {
                    "type": "checked",
                    "quantity": 1
                  }
                ]
              },
              {
                "seat": null,
                "passenger_id": "pas_0000A8L6LYhCn9xjBRTP62",
                "fare_basis_code": null,
                "cabin_class_marketing_name": "Business",
                "cabin_class": "business",
                "baggages": [
                  {
                    "type": "checked",
                    "quantity": 1
                  }
                ]
              }
            ],
            "origin_terminal": "2",
            "origin": {
              "type": "airport",
              "time_zone": "America/New_York",
              "name": "Hartsfield-Jackson Atlanta International Airport",
              "longitude": -84.4279,
              "latitude": 33.638714,
              "id": "arp_atl_us",
              "icao_code": "KATL",
              "iata_country_code": "US",
              "iata_code": "ATL",
              "iata_city_code": "ATL",
              "city_name": "Atlanta",
              "city": {
                "type": "city",
                "time_zone": null,
                "name": "Atlanta",
                "longitude": null,
                "latitude": null,
                "id": "cit_atl_us",
                "icao_code": null,
                "iata_country_code": "US",
                "iata_code": "ATL",
                "iata_city_code": "ATL",
                "city_name": null
              }
            },
            "operating_carrier_flight_number": "9303",
            "operating_carrier": {
              "name": "Duffel Airways",
              "id": "arl_00009VME7D6ivUu8dn35WK",
              "iata_code": "ZZ"
            },
            "marketing_carrier_flight_number": "9303",
            "marketing_carrier": {
              "name": "Duffel Airways",
              "id": "arl_00009VME7D6ivUu8dn35WK",
              "iata_code": "ZZ"
            },
            "id": "seg_0000A8L6LZGIgg2EwHtQna",
            "duration": "PT2H23M",
            "distance": "1360.5217397388235",
            "destination_terminal": "7",
            "destination": {
              "type": "airport",
              "time_zone": "America/New_York",
              "name": "New York Stewart International Airport",
              "longitude": -74.102724,
              "latitude": 41.501292,
              "id": "arp_swf_us",
              "icao_code": "KSWF",
              "iata_country_code": "US",
              "iata_code": "SWF",
              "iata_city_code": "NYC",
              "city_name": "Newburgh",
              "city": {
                "type": "city",
                "time_zone": null,
                "name": "New York",
                "longitude": null,
                "latitude": null,
                "id": "cit_nyc_us",
                "icao_code": null,
                "iata_country_code": "US",
                "iata_code": "NYC",
                "iata_city_code": "NYC",
                "city_name": null
              }
            },
            "departure_terminal": "2",
            "departure_datetime": "2022-06-18T23:00:00",
            "departing_at": "2022-06-18T23:00:00",
            "arriving_at": "2022-06-19T01:23:00",
            "arrival_terminal": "7",
            "arrival_datetime": "2022-06-19T01:23:00",
            "aircraft": {
              "name": "Boeing 777-300",
              "id": "arc_00009VMF8AhXSSRnQDI6HE",
              "iata_code": "773"
            }
          }
        ],
        "origin_type": "airport",
        "origin": {
          "type": "airport",
          "time_zone": "America/New_York",
          "name": "Hartsfield-Jackson Atlanta International Airport",
          "longitude": -84.4279,
          "latitude": 33.638714,
          "id": "arp_atl_us",
          "icao_code": "KATL",
          "iata_country_code": "US",
          "iata_code": "ATL",
          "iata_city_code": "ATL",
          "city_name": "Atlanta",
          "city": {
            "type": "city",
            "time_zone": null,
            "name": "Atlanta",
            "longitude": null,
            "latitude": null,
            "id": "cit_atl_us",
            "icao_code": null,
            "iata_country_code": "US",
            "iata_code": "ATL",
            "iata_city_code": "ATL",
            "city_name": null
          }
        },
        "id": "sli_0000A8L6Pqy4nZVh0nPdK6",
        "duration": "PT2H23M",
        "destination_type": "airport",
        "destination": {
          "type": "airport",
          "time_zone": "America/New_York",
          "name": "New York Stewart International Airport",
          "longitude": -74.102724,
          "latitude": 41.501292,
          "id": "arp_swf_us",
          "icao_code": "KSWF",
          "iata_country_code": "US",
          "iata_code": "SWF",
          "iata_city_code": "NYC",
          "city_name": "Newburgh",
          "city": {
            "type": "city",
            "time_zone": null,
            "name": "New York",
            "longitude": null,
            "latitude": null,
            "id": "cit_nyc_us",
            "icao_code": null,
            "iata_country_code": "US",
            "iata_code": "NYC",
            "iata_city_code": "NYC",
            "city_name": null
          }
        },
        "conditions": {
          "change_before_departure": {
            "penalty_currency": null,
            "penalty_amount": null,
            "allowed": false
          }
        },
        "changeable": true
      }
    ],
    "services": [],
    "payment_status": {
      "price_guarantee_expires_at": null,
      "payment_required_by": null,
      "awaiting_payment": false
    },
    "passengers": [
      {
        "type": "adult",
        "title": "mr",
        "infant_passenger_id": "pas_0000A8L6LYhCn9xjBRTP62",
        "id": "pas_0000A8L6LYhCn9xjBRTP60",
        "given_name": "Tony",
        "gender": "m",
        "family_name": "Stark",
        "born_on": "1980-07-24"
      },
      {
        "type": "adult",
        "title": "mrs",
        "infant_passenger_id": null,
        "id": "pas_0000A8L6LYhCn9xjBRTP61",
        "given_name": "Pepper",
        "gender": "m",
        "family_name": "Potts",
        "born_on": "1983-11-02"
      },
      {
        "type": "infant_without_seat",
        "title": "mrs",
        "infant_passenger_id": null,
        "id": "pas_0000A8L6LYhCn9xjBRTP62",
        "given_name": "Morgan",
        "gender": "f",
        "family_name": "Stark",
        "born_on": "2019-08-24"
      }
    ],
    "owner": {
      "name": "Duffel Airways",
      "id": "arl_00009VME7D6ivUu8dn35WK",
      "iata_code": "ZZ"
    },
    "metadata": null,
    "live_mode": false,
    "id": "ord_0000A8L6Pqy4nZVh0nPdK4",
    "documents": [
      {
        "unique_identifier": "1",
        "type": "electronic_ticket"
      },
      {
        "unique_identifier": "2",
        "type": "electronic_ticket"
      },
      {
        "unique_identifier": "3",
        "type": "electronic_ticket"
      }
    ],
    "created_at": "2021-06-16T09:40:25.456538Z",
    "conditions": {
      "refund_before_departure": {
        "penalty_currency": null,
        "penalty_amount": null,
        "allowed": false
      },
      "change_before_departure": {
        "penalty_currency": null,
        "penalty_amount": null,
        "allowed": false
      }
    },
    "cancelled_at": null,
    "booking_reference": "CKNG4U",
    "base_currency": "GBP",
    "base_amount": "6336.44"
  }
}



Hide full sample

We can see the order has two slices: one for the outbound flight, and one for the inbound flight. Both slices have changeable set to true indicating they can be removed or replaced.
Notice each slice has a unique ID, we will be using them next to make changes to the order.
The order change process happens in 4 steps:
You create an order change request

You review the available order change offers

You create a pending order change

You confirm the order change

Create an order change request
To request changes for an order, you need to provide a list of slices to remove, plus a list of search criteria for slices you want to add.
In our example, we want to remove the current inbound flight, so we will be adding its slice.id to the remove list. We also want to find new flights on the updated date 24th June, we can do that by adding the relevant search criteria to the add list:
JavaScript


Node.JS

duffel.orderChangeRequests.create({
    order_id: ORDER_ID,
    slices: {
      remove: [
        {slice_id: SLICE_TO_REMOVE_ID}
      ],
      add: [
        {
          origin: "ATL",
          destination: "SWF",
          departure_date: "2022-06-24",
          cabin_class: "business"
        }
      ]
    }
  })
You'll need to replace ORDER_ID with the ID of the order you want to change, and SLICE_TO_REMOVE_ID with the ID of the slice you want to replace.
We'll return an order change request, echoing back the remove and add criteria.
The response will also include an unique ID for the change request, we'll be using it on the next step to review the available change offers.
JSON


{
  "meta": null,
  "data": {
    "updated_at": "2021-06-16T10:41:31.954687Z",
    "slices": {
      "remove": [
        {
          "slice_id": "sli_0000A8L6Pqy4nZVh0nPdK6"
        }
      ],
      "add": [
        {
          "origin": "ATL",
          "destination": "SWF",
          "departure_date": "2022-06-24",
          "cabin_class": "business"
        }
      ]
    },
    "live_mode": false,
    "id": "ocr_0000A8LBrykRxt3J1MGlcG",
    "created_at": "2021-06-16T10:41:31.954687Z"
  }
}

Review available order change offers
Now that you have requested an order change, you should review the available offers. You can do this with the "Get a single order change request" endpoint:
JavaScript


Node.JS

duffel.orderChangeRequests.get(ORDER_CHANGE_REQUEST_ID)
The response will include a list of order_change_offers, each including details for the slices that would be added and removed from the order. They also include the difference in price change_total_amount, as well as the penalty imposed by the airline penalty_total_amount. The price of new flights could be more expensive or cheaper than the original.
If you'd like to get a complete look at the change offer schema, check out our API reference.
JSON


{
  "meta": null,
  "data": {
    "updated_at": "2021-06-16T10:41:31.954687Z",
    "slices": {
      "remove": [
        {
          "slice_id": "sli_0000A8L6Pqy4nZVh0nPdK6"
        }
      ],
      "add": [
        {
          "origin": "ATL",
          "destination": "SWF",
          "departure_date": "2022-06-24",
          "cabin_class": "business"
        }
      ]
    },
    "order_change_offers": [
      {
        "updated_at": "2021-06-16T10:41:31.970983Z",
        "slices": {
          "remove": [
            {
              "segments": [
                {
                  "origin_terminal": "2",
                  "origin": {
                    "type": "airport",
                    "time_zone": "America/New_York",
                    "name": "Hartsfield-Jackson Atlanta International Airport",
                    "longitude": -84.4279,
                    "latitude": 33.638714,
                    "id": "arp_atl_us",
                    "icao_code": "KATL",
                    "iata_country_code": "US",
                    "iata_code": "ATL",
                    "iata_city_code": "ATL",
                    "city_name": "Atlanta",
                    "city": {
                      "type": "city",
                      "time_zone": null,
                      "name": "Atlanta",
                      "longitude": null,
                      "latitude": null,
                      "id": "cit_atl_us",
                      "icao_code": null,
                      "iata_country_code": "US",
                      "iata_code": "ATL",
                      "iata_city_code": "ATL",
                      "city_name": null
                    }
                  },
                  "operating_carrier_flight_number": "9303",
                  "operating_carrier": {
                    "name": "Duffel Airways",
                    "id": "arl_00009VME7D6ivUu8dn35WK",
                    "iata_code": "ZZ"
                  },
                  "marketing_carrier_flight_number": "9303",
                  "marketing_carrier": {
                    "name": "Duffel Airways",
                    "id": "arl_00009VME7D6ivUu8dn35WK",
                    "iata_code": "ZZ"
                  },
                  "id": "seg_0000A8L6LZGIgg2EwHtQna",
                  "duration": "PT2H23M",
                  "distance": "1360.5217397388235",
                  "destination_terminal": "7",
                  "destination": {
                    "type": "airport",
                    "time_zone": "America/New_York",
                    "name": "New York Stewart International Airport",
                    "longitude": -74.102724,
                    "latitude": 41.501292,
                    "id": "arp_swf_us",
                    "icao_code": "KSWF",
                    "iata_country_code": "US",
                    "iata_code": "SWF",
                    "iata_city_code": "NYC",
                    "city_name": "Newburgh",
                    "city": {
                      "type": "city",
                      "time_zone": null,
                      "name": "New York",
                      "longitude": null,
                      "latitude": null,
                      "id": "cit_nyc_us",
                      "icao_code": null,
                      "iata_country_code": "US",
                      "iata_code": "NYC",
                      "iata_city_code": "NYC",
                      "city_name": null
                    }
                  },
                  "departing_at": "2022-06-18T23:00:00",
                  "arriving_at": "2022-06-19T01:23:00",
                  "aircraft": {
                    "name": "Boeing 777-300",
                    "id": "arc_00009VMF8AhXSSRnQDI6HE",
                    "iata_code": "773"
                  }
                }
              ],
              "origin_type": "airport",
              "origin": {
                "type": "airport",
                "time_zone": "America/New_York",
                "name": "Hartsfield-Jackson Atlanta International Airport",
                "longitude": -84.4279,
                "latitude": 33.638714,
                "id": "arp_atl_us",
                "icao_code": "KATL",
                "iata_country_code": "US",
                "iata_code": "ATL",
                "iata_city_code": "ATL",
                "city_name": "Atlanta",
                "city": {
                  "type": "city",
                  "time_zone": null,
                  "name": "Atlanta",
                  "longitude": null,
                  "latitude": null,
                  "id": "cit_atl_us",
                  "icao_code": null,
                  "iata_country_code": "US",
                  "iata_code": "ATL",
                  "iata_city_code": "ATL",
                  "city_name": null
                }
              },
              "id": "sli_0000A8L6Pqy4nZVh0nPdK6",
              "duration": "PT2H23M",
              "destination_type": "airport",
              "destination": {
                "type": "airport",
                "time_zone": "America/New_York",
                "name": "New York Stewart International Airport",
                "longitude": -74.102724,
                "latitude": 41.501292,
                "id": "arp_swf_us",
                "icao_code": "KSWF",
                "iata_country_code": "US",
                "iata_code": "SWF",
                "iata_city_code": "NYC",
                "city_name": "Newburgh",
                "city": {
                  "type": "city",
                  "time_zone": null,
                  "name": "New York",
                  "longitude": null,
                  "latitude": null,
                  "id": "cit_nyc_us",
                  "icao_code": null,
                  "iata_country_code": "US",
                  "iata_code": "NYC",
                  "iata_city_code": "NYC",
                  "city_name": null
                }
              }
            }
          ],
          "add": [
            {
              "segments": [
                {
                  "origin_terminal": "2",
                  "origin": {
                    "type": "airport",
                    "time_zone": "America/New_York",
                    "name": "Hartsfield-Jackson Atlanta International Airport",
                    "longitude": -84.4279,
                    "latitude": 33.638714,
                    "id": "arp_atl_us",
                    "icao_code": "KATL",
                    "iata_country_code": "US",
                    "iata_code": "ATL",
                    "iata_city_code": "ATL",
                    "city_name": "Atlanta",
                    "city": {
                      "type": "city",
                      "time_zone": null,
                      "name": "Atlanta",
                      "longitude": null,
                      "latitude": null,
                      "id": "cit_atl_us",
                      "icao_code": null,
                      "iata_country_code": "US",
                      "iata_code": "ATL",
                      "iata_city_code": "ATL",
                      "city_name": null
                    }
                  },
                  "operating_carrier_flight_number": "5901",
                  "operating_carrier": {
                    "name": "Duffel Airways",
                    "id": "arl_00009VME7D6ivUu8dn35WK",
                    "iata_code": "ZZ"
                  },
                  "marketing_carrier_flight_number": "5901",
                  "marketing_carrier": {
                    "name": "Duffel Airways",
                    "id": "arl_00009VME7D6ivUu8dn35WK",
                    "iata_code": "ZZ"
                  },
                  "id": "seg_0000A8LBrymDrITD6r6BNY",
                  "duration": "PT2H23M",
                  "distance": "1360.5217397388235",
                  "destination_terminal": "7",
                  "destination": {
                    "type": "airport",
                    "time_zone": "America/New_York",
                    "name": "New York Stewart International Airport",
                    "longitude": -74.102724,
                    "latitude": 41.501292,
                    "id": "arp_swf_us",
                    "icao_code": "KSWF",
                    "iata_country_code": "US",
                    "iata_code": "SWF",
                    "iata_city_code": "NYC",
                    "city_name": "Newburgh",
                    "city": {
                      "type": "city",
                      "time_zone": null,
                      "name": "New York",
                      "longitude": null,
                      "latitude": null,
                      "id": "cit_nyc_us",
                      "icao_code": null,
                      "iata_country_code": "US",
                      "iata_code": "NYC",
                      "iata_city_code": "NYC",
                      "city_name": null
                    }
                  },
                  "departing_at": "2022-06-24T23:00:00",
                  "arriving_at": "2022-06-25T01:23:00",
                  "aircraft": {
                    "name": "Boeing 777-300",
                    "id": "arc_00009VMF8AhXSSRnQDI6HE",
                    "iata_code": "773"
                  }
                }
              ],
              "origin_type": "airport",
              "origin": {
                "type": "airport",
                "time_zone": "America/New_York",
                "name": "Hartsfield-Jackson Atlanta International Airport",
                "longitude": -84.4279,
                "latitude": 33.638714,
                "id": "arp_atl_us",
                "icao_code": "KATL",
                "iata_country_code": "US",
                "iata_code": "ATL",
                "iata_city_code": "ATL",
                "city_name": "Atlanta",
                "city": {
                  "type": "city",
                  "time_zone": null,
                  "name": "Atlanta",
                  "longitude": null,
                  "latitude": null,
                  "id": "cit_atl_us",
                  "icao_code": null,
                  "iata_country_code": "US",
                  "iata_code": "ATL",
                  "iata_city_code": "ATL",
                  "city_name": null
                }
              },
              "id": "sli_0000A8LBrymDrITD6r6BNZ",
              "duration": "PT2H23M",
              "destination_type": "airport",
              "destination": {
                "type": "airport",
                "time_zone": "America/New_York",
                "name": "New York Stewart International Airport",
                "longitude": -74.102724,
                "latitude": 41.501292,
                "id": "arp_swf_us",
                "icao_code": "KSWF",
                "iata_country_code": "US",
                "iata_code": "SWF",
                "iata_city_code": "NYC",
                "city_name": "Newburgh",
                "city": {
                  "type": "city",
                  "time_zone": null,
                  "name": "New York",
                  "longitude": null,
                  "latitude": null,
                  "id": "cit_nyc_us",
                  "icao_code": null,
                  "iata_country_code": "US",
                  "iata_code": "NYC",
                  "iata_city_code": "NYC",
                  "city_name": null
                }
              }
            }
          ]
        },
        "refund_to": "original_form_of_payment",
        "penalty_total_currency": "GBP",
        "penalty_total_amount": "25.00",
        "order_change_id": null,
        "new_total_currency": "GBP",
        "new_total_amount": "25.00",
        "live_mode": false,
        "id": "oco_0000A8LBrynHnLJxA9b22K",
        "expires_at": "2021-06-19T10:41:31Z",
        "created_at": "2021-06-16T10:41:31.970983Z",
        "change_total_currency": "GBP",
        "change_total_amount": "50.00"
      },
      {
        "updated_at": "2021-06-16T10:41:31.979325Z",
        "slices": {
          "remove": [
            {
              "segments": [
                {
                  "origin_terminal": "2",
                  "origin": {
                    "type": "airport",
                    "time_zone": "America/New_York",
                    "name": "Hartsfield-Jackson Atlanta International Airport",
                    "longitude": -84.4279,
                    "latitude": 33.638714,
                    "id": "arp_atl_us",
                    "icao_code": "KATL",
                    "iata_country_code": "US",
                    "iata_code": "ATL",
                    "iata_city_code": "ATL",
                    "city_name": "Atlanta",
                    "city": {
                      "type": "city",
                      "time_zone": null,
                      "name": "Atlanta",
                      "longitude": null,
                      "latitude": null,
                      "id": "cit_atl_us",
                      "icao_code": null,
                      "iata_country_code": "US",
                      "iata_code": "ATL",
                      "iata_city_code": "ATL",
                      "city_name": null
                    }
                  },
                  "operating_carrier_flight_number": "9303",
                  "operating_carrier": {
                    "name": "Duffel Airways",
                    "id": "arl_00009VME7D6ivUu8dn35WK",
                    "iata_code": "ZZ"
                  },
                  "marketing_carrier_flight_number": "9303",
                  "marketing_carrier": {
                    "name": "Duffel Airways",
                    "id": "arl_00009VME7D6ivUu8dn35WK",
                    "iata_code": "ZZ"
                  },
                  "id": "seg_0000A8L6LZGIgg2EwHtQna",
                  "duration": "PT2H23M",
                  "distance": "1360.5217397388235",
                  "destination_terminal": "7",
                  "destination": {
                    "type": "airport",
                    "time_zone": "America/New_York",
                    "name": "New York Stewart International Airport",
                    "longitude": -74.102724,
                    "latitude": 41.501292,
                    "id": "arp_swf_us",
                    "icao_code": "KSWF",
                    "iata_country_code": "US",
                    "iata_code": "SWF",
                    "iata_city_code": "NYC",
                    "city_name": "Newburgh",
                    "city": {
                      "type": "city",
                      "time_zone": null,
                      "name": "New York",
                      "longitude": null,
                      "latitude": null,
                      "id": "cit_nyc_us",
                      "icao_code": null,
                      "iata_country_code": "US",
                      "iata_code": "NYC",
                      "iata_city_code": "NYC",
                      "city_name": null
                    }
                  },
                  "departing_at": "2022-06-18T23:00:00",
                  "arriving_at": "2022-06-19T01:23:00",
                  "aircraft": {
                    "name": "Boeing 777-300",
                    "id": "arc_00009VMF8AhXSSRnQDI6HE",
                    "iata_code": "773"
                  }
                }
              ],
              "origin_type": "airport",
              "origin": {
                "type": "airport",
                "time_zone": "America/New_York",
                "name": "Hartsfield-Jackson Atlanta International Airport",
                "longitude": -84.4279,
                "latitude": 33.638714,
                "id": "arp_atl_us",
                "icao_code": "KATL",
                "iata_country_code": "US",
                "iata_code": "ATL",
                "iata_city_code": "ATL",
                "city_name": "Atlanta",
                "city": {
                  "type": "city",
                  "time_zone": null,
                  "name": "Atlanta",
                  "longitude": null,
                  "latitude": null,
                  "id": "cit_atl_us",
                  "icao_code": null,
                  "iata_country_code": "US",
                  "iata_code": "ATL",
                  "iata_city_code": "ATL",
                  "city_name": null
                }
              },
              "id": "sli_0000A8L6Pqy4nZVh0nPdK6",
              "duration": "PT2H23M",
              "destination_type": "airport",
              "destination": {
                "type": "airport",
                "time_zone": "America/New_York",
                "name": "New York Stewart International Airport",
                "longitude": -74.102724,
                "latitude": 41.501292,
                "id": "arp_swf_us",
                "icao_code": "KSWF",
                "iata_country_code": "US",
                "iata_code": "SWF",
                "iata_city_code": "NYC",
                "city_name": "Newburgh",
                "city": {
                  "type": "city",
                  "time_zone": null,
                  "name": "New York",
                  "longitude": null,
                  "latitude": null,
                  "id": "cit_nyc_us",
                  "icao_code": null,
                  "iata_country_code": "US",
                  "iata_code": "NYC",
                  "iata_city_code": "NYC",
                  "city_name": null
                }
              }
            }
          ],
          "add": [
            {
              "segments": [
                {
                  "origin_terminal": "2",
                  "origin": {
                    "type": "airport",
                    "time_zone": "America/New_York",
                    "name": "Hartsfield-Jackson Atlanta International Airport",
                    "longitude": -84.4279,
                    "latitude": 33.638714,
                    "id": "arp_atl_us",
                    "icao_code": "KATL",
                    "iata_country_code": "US",
                    "iata_code": "ATL",
                    "iata_city_code": "ATL",
                    "city_name": "Atlanta",
                    "city": {
                      "type": "city",
                      "time_zone": null,
                      "name": "Atlanta",
                      "longitude": null,
                      "latitude": null,
                      "id": "cit_atl_us",
                      "icao_code": null,
                      "iata_country_code": "US",
                      "iata_code": "ATL",
                      "iata_city_code": "ATL",
                      "city_name": null
                    }
                  },
                  "operating_carrier_flight_number": "7189",
                  "operating_carrier": {
                    "name": "Duffel Airways",
                    "id": "arl_00009VME7D6ivUu8dn35WK",
                    "iata_code": "ZZ"
                  },
                  "marketing_carrier_flight_number": "7189",
                  "marketing_carrier": {
                    "name": "Duffel Airways",
                    "id": "arl_00009VME7D6ivUu8dn35WK",
                    "iata_code": "ZZ"
                  },
                  "id": "seg_0000A8LBrymZpykn7xGSvo",
                  "duration": "PT2H23M",
                  "distance": "1360.5217397388235",
                  "destination_terminal": "7",
                  "destination": {
                    "type": "airport",
                    "time_zone": "America/New_York",
                    "name": "New York Stewart International Airport",
                    "longitude": -74.102724,
                    "latitude": 41.501292,
                    "id": "arp_swf_us",
                    "icao_code": "KSWF",
                    "iata_country_code": "US",
                    "iata_code": "SWF",
                    "iata_city_code": "NYC",
                    "city_name": "Newburgh",
                    "city": {
                      "type": "city",
                      "time_zone": null,
                      "name": "New York",
                      "longitude": null,
                      "latitude": null,
                      "id": "cit_nyc_us",
                      "icao_code": null,
                      "iata_country_code": "US",
                      "iata_code": "NYC",
                      "iata_city_code": "NYC",
                      "city_name": null
                    }
                  },
                  "departing_at": "2022-06-24T23:00:00",
                  "arriving_at": "2022-06-25T01:23:00",
                  "aircraft": {
                    "name": "Boeing 777-300",
                    "id": "arc_00009VMF8AhXSSRnQDI6HE",
                    "iata_code": "773"
                  }
                }
              ],
              "origin_type": "airport",
              "origin": {
                "type": "airport",
                "time_zone": "America/New_York",
                "name": "Hartsfield-Jackson Atlanta International Airport",
                "longitude": -84.4279,
                "latitude": 33.638714,
                "id": "arp_atl_us",
                "icao_code": "KATL",
                "iata_country_code": "US",
                "iata_code": "ATL",
                "iata_city_code": "ATL",
                "city_name": "Atlanta",
                "city": {
                  "type": "city",
                  "time_zone": null,
                  "name": "Atlanta",
                  "longitude": null,
                  "latitude": null,
                  "id": "cit_atl_us",
                  "icao_code": null,
                  "iata_country_code": "US",
                  "iata_code": "ATL",
                  "iata_city_code": "ATL",
                  "city_name": null
                }
              },
              "id": "sli_0000A8LBrymZpykn7xGSvp",
              "duration": "PT2H23M",
              "destination_type": "airport",
              "destination": {
                "type": "airport",
                "time_zone": "America/New_York",
                "name": "New York Stewart International Airport",
                "longitude": -74.102724,
                "latitude": 41.501292,
                "id": "arp_swf_us",
                "icao_code": "KSWF",
                "iata_country_code": "US",
                "iata_code": "SWF",
                "iata_city_code": "NYC",
                "city_name": "Newburgh",
                "city": {
                  "type": "city",
                  "time_zone": null,
                  "name": "New York",
                  "longitude": null,
                  "latitude": null,
                  "id": "cit_nyc_us",
                  "icao_code": null,
                  "iata_country_code": "US",
                  "iata_code": "NYC",
                  "iata_city_code": "NYC",
                  "city_name": null
                }
              }
            }
          ]
        },
        "refund_to": "original_form_of_payment",
        "penalty_total_currency": "GBP",
        "penalty_total_amount": "25.00",
        "order_change_id": null,
        "new_total_currency": "GBP",
        "new_total_amount": "25.00",
        "live_mode": false,
        "id": "oco_0000A8LBryndm1bXBFlJac",
        "expires_at": "2021-06-19T10:41:31Z",
        "created_at": "2021-06-16T10:41:31.979325Z",
        "change_total_currency": "GBP",
        "change_total_amount": "50.00"
      },
      {
        "updated_at": "2021-06-16T10:41:31.983198Z",
        "slices": {
          "remove": [
            {
              "segments": [
                {
                  "origin_terminal": "2",
                  "origin": {
                    "type": "airport",
                    "time_zone": "America/New_York",
                    "name": "Hartsfield-Jackson Atlanta International Airport",
                    "longitude": -84.4279,
                    "latitude": 33.638714,
                    "id": "arp_atl_us",
                    "icao_code": "KATL",
                    "iata_country_code": "US",
                    "iata_code": "ATL",
                    "iata_city_code": "ATL",
                    "city_name": "Atlanta",
                    "city": {
                      "type": "city",
                      "time_zone": null,
                      "name": "Atlanta",
                      "longitude": null,
                      "latitude": null,
                      "id": "cit_atl_us",
                      "icao_code": null,
                      "iata_country_code": "US",
                      "iata_code": "ATL",
                      "iata_city_code": "ATL",
                      "city_name": null
                    }
                  },
                  "operating_carrier_flight_number": "9303",
                  "operating_carrier": {
                    "name": "Duffel Airways",
                    "id": "arl_00009VME7D6ivUu8dn35WK",
                    "iata_code": "ZZ"
                  },
                  "marketing_carrier_flight_number": "9303",
                  "marketing_carrier": {
                    "name": "Duffel Airways",
                    "id": "arl_00009VME7D6ivUu8dn35WK",
                    "iata_code": "ZZ"
                  },
                  "id": "seg_0000A8L6LZGIgg2EwHtQna",
                  "duration": "PT2H23M",
                  "distance": "1360.5217397388235",
                  "destination_terminal": "7",
                  "destination": {
                    "type": "airport",
                    "time_zone": "America/New_York",
                    "name": "New York Stewart International Airport",
                    "longitude": -74.102724,
                    "latitude": 41.501292,
                    "id": "arp_swf_us",
                    "icao_code": "KSWF",
                    "iata_country_code": "US",
                    "iata_code": "SWF",
                    "iata_city_code": "NYC",
                    "city_name": "Newburgh",
                    "city": {
                      "type": "city",
                      "time_zone": null,
                      "name": "New York",
                      "longitude": null,
                      "latitude": null,
                      "id": "cit_nyc_us",
                      "icao_code": null,
                      "iata_country_code": "US",
                      "iata_code": "NYC",
                      "iata_city_code": "NYC",
                      "city_name": null
                    }
                  },
                  "departing_at": "2022-06-18T23:00:00",
                  "arriving_at": "2022-06-19T01:23:00",
                  "aircraft": {
                    "name": "Boeing 777-300",
                    "id": "arc_00009VMF8AhXSSRnQDI6HE",
                    "iata_code": "773"
                  }
                }
              ],
              "origin_type": "airport",
              "origin": {
                "type": "airport",
                "time_zone": "America/New_York",
                "name": "Hartsfield-Jackson Atlanta International Airport",
                "longitude": -84.4279,
                "latitude": 33.638714,
                "id": "arp_atl_us",
                "icao_code": "KATL",
                "iata_country_code": "US",
                "iata_code": "ATL",
                "iata_city_code": "ATL",
                "city_name": "Atlanta",
                "city": {
                  "type": "city",
                  "time_zone": null,
                  "name": "Atlanta",
                  "longitude": null,
                  "latitude": null,
                  "id": "cit_atl_us",
                  "icao_code": null,
                  "iata_country_code": "US",
                  "iata_code": "ATL",
                  "iata_city_code": "ATL",
                  "city_name": null
                }
              },
              "id": "sli_0000A8L6Pqy4nZVh0nPdK6",
              "duration": "PT2H23M",
              "destination_type": "airport",
              "destination": {
                "type": "airport",
                "time_zone": "America/New_York",
                "name": "New York Stewart International Airport",
                "longitude": -74.102724,
                "latitude": 41.501292,
                "id": "arp_swf_us",
                "icao_code": "KSWF",
                "iata_country_code": "US",
                "iata_code": "SWF",
                "iata_city_code": "NYC",
                "city_name": "Newburgh",
                "city": {
                  "type": "city",
                  "time_zone": null,
                  "name": "New York",
                  "longitude": null,
                  "latitude": null,
                  "id": "cit_nyc_us",
                  "icao_code": null,
                  "iata_country_code": "US",
                  "iata_code": "NYC",
                  "iata_city_code": "NYC",
                  "city_name": null
                }
              }
            }
          ],
          "add": [
            {
              "segments": [
                {
                  "origin_terminal": "2",
                  "origin": {
                    "type": "airport",
                    "time_zone": "America/New_York",
                    "name": "Hartsfield-Jackson Atlanta International Airport",
                    "longitude": -84.4279,
                    "latitude": 33.638714,
                    "id": "arp_atl_us",
                    "icao_code": "KATL",
                    "iata_country_code": "US",
                    "iata_code": "ATL",
                    "iata_city_code": "ATL",
                    "city_name": "Atlanta",
                    "city": {
                      "type": "city",
                      "time_zone": null,
                      "name": "Atlanta",
                      "longitude": null,
                      "latitude": null,
                      "id": "cit_atl_us",
                      "icao_code": null,
                      "iata_country_code": "US",
                      "iata_code": "ATL",
                      "iata_city_code": "ATL",
                      "city_name": null
                    }
                  },
                  "operating_carrier_flight_number": "2303",
                  "operating_carrier": {
                    "name": "Duffel Airways",
                    "id": "arl_00009VME7D6ivUu8dn35WK",
                    "iata_code": "ZZ"
                  },
                  "marketing_carrier_flight_number": "2303",
                  "marketing_carrier": {
                    "name": "Duffel Airways",
                    "id": "arl_00009VME7D6ivUu8dn35WK",
                    "iata_code": "ZZ"
                  },
                  "id": "seg_0000A8LBrymvof2N93QkU4",
                  "duration": "PT2H23M",
                  "distance": "1360.5217397388235",
                  "destination_terminal": "7",
                  "destination": {
                    "type": "airport",
                    "time_zone": "America/New_York",
                    "name": "New York Stewart International Airport",
                    "longitude": -74.102724,
                    "latitude": 41.501292,
                    "id": "arp_swf_us",
                    "icao_code": "KSWF",
                    "iata_country_code": "US",
                    "iata_code": "SWF",
                    "iata_city_code": "NYC",
                    "city_name": "Newburgh",
                    "city": {
                      "type": "city",
                      "time_zone": null,
                      "name": "New York",
                      "longitude": null,
                      "latitude": null,
                      "id": "cit_nyc_us",
                      "icao_code": null,
                      "iata_country_code": "US",
                      "iata_code": "NYC",
                      "iata_city_code": "NYC",
                      "city_name": null
                    }
                  },
                  "departing_at": "2022-06-24T23:00:00",
                  "arriving_at": "2022-06-25T01:23:00",
                  "aircraft": {
                    "name": "Boeing 777-300",
                    "id": "arc_00009VMF8AhXSSRnQDI6HE",
                    "iata_code": "773"
                  }
                }
              ],
              "origin_type": "airport",
              "origin": {
                "type": "airport",
                "time_zone": "America/New_York",
                "name": "Hartsfield-Jackson Atlanta International Airport",
                "longitude": -84.4279,
                "latitude": 33.638714,
                "id": "arp_atl_us",
                "icao_code": "KATL",
                "iata_country_code": "US",
                "iata_code": "ATL",
                "iata_city_code": "ATL",
                "city_name": "Atlanta",
                "city": {
                  "type": "city",
                  "time_zone": null,
                  "name": "Atlanta",
                  "longitude": null,
                  "latitude": null,
                  "id": "cit_atl_us",
                  "icao_code": null,
                  "iata_country_code": "US",
                  "iata_code": "ATL",
                  "iata_city_code": "ATL",
                  "city_name": null
                }
              },
              "id": "sli_0000A8LBrymvof2N93QkU5",
              "duration": "PT2H23M",
              "destination_type": "airport",
              "destination": {
                "type": "airport",
                "time_zone": "America/New_York",
                "name": "New York Stewart International Airport",
                "longitude": -74.102724,
                "latitude": 41.501292,
                "id": "arp_swf_us",
                "icao_code": "KSWF",
                "iata_country_code": "US",
                "iata_code": "SWF",
                "iata_city_code": "NYC",
                "city_name": "Newburgh",
                "city": {
                  "type": "city",
                  "time_zone": null,
                  "name": "New York",
                  "longitude": null,
                  "latitude": null,
                  "id": "cit_nyc_us",
                  "icao_code": null,
                  "iata_country_code": "US",
                  "iata_code": "NYC",
                  "iata_city_code": "NYC",
                  "city_name": null
                }
              }
            }
          ]
        },
        "refund_to": "original_form_of_payment",
        "penalty_total_currency": "GBP",
        "penalty_total_amount": "25.00",
        "order_change_id": null,
        "new_total_currency": "GBP",
        "new_total_amount": "25.00",
        "live_mode": false,
        "id": "oco_0000A8LBryoLjOAhDS5sh6",
        "expires_at": "2021-06-19T10:41:31Z",
        "created_at": "2021-06-16T10:41:31.983198Z",
        "change_total_currency": "GBP",
        "change_total_amount": "50.00"
      }
    ],
    "live_mode": false,
    "id": "ocr_0000A8LBrykRxt3J1MGlcG",
    "created_at": "2021-06-16T10:41:31.954687Z"
  }
}



Hide full sample

Create a pending order change
After reviewing the available change offers, Tony's family has chosen a new return flight.
We can now create a pending order change using the change offer's unique ID and the Create a pending order change endpoint:
JavaScript


Node.JS

duffel.orderChanges.create({selected_order_change_offer: ORDER_CHANGE_OFFER_ID})
We will return an order change. You can see the value of confirmed_at is null, indicating that the change has not been confirmed yet.
If you'd like to get a complete look at the order change schema, check out our API reference.
The price of a pending change order can change over time. You should let your customers review the final price before confirming the order. You can use Get a single order change endpoint to obtain the latest price using the pending order change's id.
JavaScript


Node.JS

duffel.orderChanges.get(ORDER_CHANGE_ID)
There are also some important legal notices that you must display to make sure that the customer understands how their data will be used and the rules that apply to their booking.
JSON


{
  "meta": null,
  "data": {
    "updated_at": "2021-06-16T12:50:09.386961Z",
    "slices": {
      "remove": [
        {
          "segments": [
            {
              "origin_terminal": "2",
              "origin": {
                "type": "airport",
                "time_zone": "America/New_York",
                "name": "Hartsfield-Jackson Atlanta International Airport",
                "longitude": -84.4279,
                "latitude": 33.638714,
                "id": "arp_atl_us",
                "icao_code": "KATL",
                "iata_country_code": "US",
                "iata_code": "ATL",
                "iata_city_code": "ATL",
                "city_name": "Atlanta",
                "city": {
                  "type": "city",
                  "time_zone": null,
                  "name": "Atlanta",
                  "longitude": null,
                  "latitude": null,
                  "id": "cit_atl_us",
                  "icao_code": null,
                  "iata_country_code": "US",
                  "iata_code": "ATL",
                  "iata_city_code": "ATL",
                  "city_name": null
                }
              },
              "operating_carrier_flight_number": "9303",
              "operating_carrier": {
                "name": "Duffel Airways",
                "id": "arl_00009VME7D6ivUu8dn35WK",
                "iata_code": "ZZ"
              },
              "marketing_carrier_flight_number": "9303",
              "marketing_carrier": {
                "name": "Duffel Airways",
                "id": "arl_00009VME7D6ivUu8dn35WK",
                "iata_code": "ZZ"
              },
              "id": "seg_0000A8L6LZGIgg2EwHtQna",
              "duration": "PT2H23M",
              "distance": "1360.5217397388235",
              "destination_terminal": "7",
              "destination": {
                "type": "airport",
                "time_zone": "America/New_York",
                "name": "New York Stewart International Airport",
                "longitude": -74.102724,
                "latitude": 41.501292,
                "id": "arp_swf_us",
                "icao_code": "KSWF",
                "iata_country_code": "US",
                "iata_code": "SWF",
                "iata_city_code": "NYC",
                "city_name": "Newburgh",
                "city": {
                  "type": "city",
                  "time_zone": null,
                  "name": "New York",
                  "longitude": null,
                  "latitude": null,
                  "id": "cit_nyc_us",
                  "icao_code": null,
                  "iata_country_code": "US",
                  "iata_code": "NYC",
                  "iata_city_code": "NYC",
                  "city_name": null
                }
              },
              "departing_at": "2022-06-18T23:00:00",
              "arriving_at": "2022-06-19T01:23:00",
              "aircraft": {
                "name": "Boeing 777-300",
                "id": "arc_00009VMF8AhXSSRnQDI6HE",
                "iata_code": "773"
              }
            }
          ],
          "origin_type": "airport",
          "origin": {
            "type": "airport",
            "time_zone": "America/New_York",
            "name": "Hartsfield-Jackson Atlanta International Airport",
            "longitude": -84.4279,
            "latitude": 33.638714,
            "id": "arp_atl_us",
            "icao_code": "KATL",
            "iata_country_code": "US",
            "iata_code": "ATL",
            "iata_city_code": "ATL",
            "city_name": "Atlanta",
            "city": {
              "type": "city",
              "time_zone": null,
              "name": "Atlanta",
              "longitude": null,
              "latitude": null,
              "id": "cit_atl_us",
              "icao_code": null,
              "iata_country_code": "US",
              "iata_code": "ATL",
              "iata_city_code": "ATL",
              "city_name": null
            }
          },
          "id": "sli_0000A8L6Pqy4nZVh0nPdK6",
          "duration": "PT2H23M",
          "destination_type": "airport",
          "destination": {
            "type": "airport",
            "time_zone": "America/New_York",
            "name": "New York Stewart International Airport",
            "longitude": -74.102724,
            "latitude": 41.501292,
            "id": "arp_swf_us",
            "icao_code": "KSWF",
            "iata_country_code": "US",
            "iata_code": "SWF",
            "iata_city_code": "NYC",
            "city_name": "Newburgh",
            "city": {
              "type": "city",
              "time_zone": null,
              "name": "New York",
              "longitude": null,
              "latitude": null,
              "id": "cit_nyc_us",
              "icao_code": null,
              "iata_country_code": "US",
              "iata_code": "NYC",
              "iata_city_code": "NYC",
              "city_name": null
            }
          }
        }
      ],
      "add": [
        {
          "segments": [
            {
              "origin_terminal": "2",
              "origin": {
                "type": "airport",
                "time_zone": "America/New_York",
                "name": "Hartsfield-Jackson Atlanta International Airport",
                "longitude": -84.4279,
                "latitude": 33.638714,
                "id": "arp_atl_us",
                "icao_code": "KATL",
                "iata_country_code": "US",
                "iata_code": "ATL",
                "iata_city_code": "ATL",
                "city_name": "Atlanta",
                "city": {
                  "type": "city",
                  "time_zone": null,
                  "name": "Atlanta",
                  "longitude": null,
                  "latitude": null,
                  "id": "cit_atl_us",
                  "icao_code": null,
                  "iata_country_code": "US",
                  "iata_code": "ATL",
                  "iata_city_code": "ATL",
                  "city_name": null
                }
              },
              "operating_carrier_flight_number": "5901",
              "operating_carrier": {
                "name": "Duffel Airways",
                "id": "arl_00009VME7D6ivUu8dn35WK",
                "iata_code": "ZZ"
              },
              "marketing_carrier_flight_number": "5901",
              "marketing_carrier": {
                "name": "Duffel Airways",
                "id": "arl_00009VME7D6ivUu8dn35WK",
                "iata_code": "ZZ"
              },
              "id": "seg_0000A8LBrymDrITD6r6BNY",
              "duration": "PT2H23M",
              "distance": "1360.5217397388235",
              "destination_terminal": "7",
              "destination": {
                "type": "airport",
                "time_zone": "America/New_York",
                "name": "New York Stewart International Airport",
                "longitude": -74.102724,
                "latitude": 41.501292,
                "id": "arp_swf_us",
                "icao_code": "KSWF",
                "iata_country_code": "US",
                "iata_code": "SWF",
                "iata_city_code": "NYC",
                "city_name": "Newburgh",
                "city": {
                  "type": "city",
                  "time_zone": null,
                  "name": "New York",
                  "longitude": null,
                  "latitude": null,
                  "id": "cit_nyc_us",
                  "icao_code": null,
                  "iata_country_code": "US",
                  "iata_code": "NYC",
                  "iata_city_code": "NYC",
                  "city_name": null
                }
              },
              "departing_at": "2022-06-24T23:00:00",
              "arriving_at": "2022-06-25T01:23:00",
              "aircraft": {
                "name": "Boeing 777-300",
                "id": "arc_00009VMF8AhXSSRnQDI6HE",
                "iata_code": "773"
              }
            }
          ],
          "origin_type": "airport",
          "origin": {
            "type": "airport",
            "time_zone": "America/New_York",
            "name": "Hartsfield-Jackson Atlanta International Airport",
            "longitude": -84.4279,
            "latitude": 33.638714,
            "id": "arp_atl_us",
            "icao_code": "KATL",
            "iata_country_code": "US",
            "iata_code": "ATL",
            "iata_city_code": "ATL",
            "city_name": "Atlanta",
            "city": {
              "type": "city",
              "time_zone": null,
              "name": "Atlanta",
              "longitude": null,
              "latitude": null,
              "id": "cit_atl_us",
              "icao_code": null,
              "iata_country_code": "US",
              "iata_code": "ATL",
              "iata_city_code": "ATL",
              "city_name": null
            }
          },
          "id": "sli_0000A8LBrymDrITD6r6BNZ",
          "duration": "PT2H23M",
          "destination_type": "airport",
          "destination": {
            "type": "airport",
            "time_zone": "America/New_York",
            "name": "New York Stewart International Airport",
            "longitude": -74.102724,
            "latitude": 41.501292,
            "id": "arp_swf_us",
            "icao_code": "KSWF",
            "iata_country_code": "US",
            "iata_code": "SWF",
            "iata_city_code": "NYC",
            "city_name": "Newburgh",
            "city": {
              "type": "city",
              "time_zone": null,
              "name": "New York",
              "longitude": null,
              "latitude": null,
              "id": "cit_nyc_us",
              "icao_code": null,
              "iata_country_code": "US",
              "iata_code": "NYC",
              "iata_city_code": "NYC",
              "city_name": null
            }
          }
        }
      ]
    },
    "refund_to": "original_form_of_payment",
    "penalty_total_currency": "GBP",
    "penalty_total_amount": "25.00",
    "order_id": "ord_0000A8L6Pqy4nZVh0nPdK4",
    "new_total_currency": "GBP",
    "new_total_amount": "25.00",
    "live_mode": false,
    "id": "oce_0000A8LNLgZVCzBypYW5mC",
    "expires_at": "2021-06-19T12:50:09Z",
    "created_at": "2021-06-16T12:50:09.386961Z",
    "confirmed_at": null,
    "change_total_currency": "GBP",
    "change_total_amount": "50.00"
  }
}



Hide full sample

Confirm an order change
We are finally ready to confirm the order changes for Tony and his family. You'll only need two things at this point:
The ID of the order change you'd like to confirm

Payment method and details to confirm the change

To confirm an order, use the Confirm an order change endpoint:
JavaScript


Node.JS

duffel.orderChanges.confirm({
    ORDER_CHANGE_ID,
    "payment": {
      "type": "balance",
      "currency": "GBP",
      "amount": "50.00"
    }
  })
We will return an order change. This time you will see the updated confirmed_at value, indicating the order change has now been confirmed.
JSON


{
  "meta": null,
  "data": {
    "updated_at": "2021-06-16T13:14:25.143485Z",
    "slices": {
      "remove": [
        {
          "segments": [
            {
              "origin_terminal": "2",
              "origin": {
                "type": "airport",
                "time_zone": "America/New_York",
                "name": "Hartsfield-Jackson Atlanta International Airport",
                "longitude": -84.4279,
                "latitude": 33.638714,
                "id": "arp_atl_us",
                "icao_code": "KATL",
                "iata_country_code": "US",
                "iata_code": "ATL",
                "iata_city_code": "ATL",
                "city_name": "Atlanta",
                "city": {
                  "type": "city",
                  "time_zone": null,
                  "name": "Atlanta",
                  "longitude": null,
                  "latitude": null,
                  "id": "cit_atl_us",
                  "icao_code": null,
                  "iata_country_code": "US",
                  "iata_code": "ATL",
                  "iata_city_code": "ATL",
                  "city_name": null
                }
              },
              "operating_carrier_flight_number": "9303",
              "operating_carrier": {
                "name": "Duffel Airways",
                "id": "arl_00009VME7D6ivUu8dn35WK",
                "iata_code": "ZZ"
              },
              "marketing_carrier_flight_number": "9303",
              "marketing_carrier": {
                "name": "Duffel Airways",
                "id": "arl_00009VME7D6ivUu8dn35WK",
                "iata_code": "ZZ"
              },
              "id": "seg_0000A8L6LZGIgg2EwHtQna",
              "duration": "PT2H23M",
              "distance": "1360.5217397388235",
              "destination_terminal": "7",
              "destination": {
                "type": "airport",
                "time_zone": "America/New_York",
                "name": "New York Stewart International Airport",
                "longitude": -74.102724,
                "latitude": 41.501292,
                "id": "arp_swf_us",
                "icao_code": "KSWF",
                "iata_country_code": "US",
                "iata_code": "SWF",
                "iata_city_code": "NYC",
                "city_name": "Newburgh",
                "city": {
                  "type": "city",
                  "time_zone": null,
                  "name": "New York",
                  "longitude": null,
                  "latitude": null,
                  "id": "cit_nyc_us",
                  "icao_code": null,
                  "iata_country_code": "US",
                  "iata_code": "NYC",
                  "iata_city_code": "NYC",
                  "city_name": null
                }
              },
              "departing_at": "2022-06-18T23:00:00",
              "arriving_at": "2022-06-19T01:23:00",
              "aircraft": {
                "name": "Boeing 777-300",
                "id": "arc_00009VMF8AhXSSRnQDI6HE",
                "iata_code": "773"
              }
            }
          ],
          "origin_type": "airport",
          "origin": {
            "type": "airport",
            "time_zone": "America/New_York",
            "name": "Hartsfield-Jackson Atlanta International Airport",
            "longitude": -84.4279,
            "latitude": 33.638714,
            "id": "arp_atl_us",
            "icao_code": "KATL",
            "iata_country_code": "US",
            "iata_code": "ATL",
            "iata_city_code": "ATL",
            "city_name": "Atlanta",
            "city": {
              "type": "city",
              "time_zone": null,
              "name": "Atlanta",
              "longitude": null,
              "latitude": null,
              "id": "cit_atl_us",
              "icao_code": null,
              "iata_country_code": "US",
              "iata_code": "ATL",
              "iata_city_code": "ATL",
              "city_name": null
            }
          },
          "id": "sli_0000A8L6Pqy4nZVh0nPdK6",
          "duration": "PT2H23M",
          "destination_type": "airport",
          "destination": {
            "type": "airport",
            "time_zone": "America/New_York",
            "name": "New York Stewart International Airport",
            "longitude": -74.102724,
            "latitude": 41.501292,
            "id": "arp_swf_us",
            "icao_code": "KSWF",
            "iata_country_code": "US",
            "iata_code": "SWF",
            "iata_city_code": "NYC",
            "city_name": "Newburgh",
            "city": {
              "type": "city",
              "time_zone": null,
              "name": "New York",
              "longitude": null,
              "latitude": null,
              "id": "cit_nyc_us",
              "icao_code": null,
              "iata_country_code": "US",
              "iata_code": "NYC",
              "iata_city_code": "NYC",
              "city_name": null
            }
          }
        }
      ],
      "add": [
        {
          "segments": [
            {
              "origin_terminal": "2",
              "origin": {
                "type": "airport",
                "time_zone": "America/New_York",
                "name": "Hartsfield-Jackson Atlanta International Airport",
                "longitude": -84.4279,
                "latitude": 33.638714,
                "id": "arp_atl_us",
                "icao_code": "KATL",
                "iata_country_code": "US",
                "iata_code": "ATL",
                "iata_city_code": "ATL",
                "city_name": "Atlanta",
                "city": {
                  "type": "city",
                  "time_zone": null,
                  "name": "Atlanta",
                  "longitude": null,
                  "latitude": null,
                  "id": "cit_atl_us",
                  "icao_code": null,
                  "iata_country_code": "US",
                  "iata_code": "ATL",
                  "iata_city_code": "ATL",
                  "city_name": null
                }
              },
              "operating_carrier_flight_number": "5901",
              "operating_carrier": {
                "name": "Duffel Airways",
                "id": "arl_00009VME7D6ivUu8dn35WK",
                "iata_code": "ZZ"
              },
              "marketing_carrier_flight_number": "5901",
              "marketing_carrier": {
                "name": "Duffel Airways",
                "id": "arl_00009VME7D6ivUu8dn35WK",
                "iata_code": "ZZ"
              },
              "id": "seg_0000A8LBrymDrITD6r6BNY",
              "duration": "PT2H23M",
              "distance": "1360.5217397388235",
              "destination_terminal": "7",
              "destination": {
                "type": "airport",
                "time_zone": "America/New_York",
                "name": "New York Stewart International Airport",
                "longitude": -74.102724,
                "latitude": 41.501292,
                "id": "arp_swf_us",
                "icao_code": "KSWF",
                "iata_country_code": "US",
                "iata_code": "SWF",
                "iata_city_code": "NYC",
                "city_name": "Newburgh",
                "city": {
                  "type": "city",
                  "time_zone": null,
                  "name": "New York",
                  "longitude": null,
                  "latitude": null,
                  "id": "cit_nyc_us",
                  "icao_code": null,
                  "iata_country_code": "US",
                  "iata_code": "NYC",
                  "iata_city_code": "NYC",
                  "city_name": null
                }
              },
              "departing_at": "2022-06-24T23:00:00",
              "arriving_at": "2022-06-25T01:23:00",
              "aircraft": {
                "name": "Boeing 777-300",
                "id": "arc_00009VMF8AhXSSRnQDI6HE",
                "iata_code": "773"
              }
            }
          ],
          "origin_type": "airport",
          "origin": {
            "type": "airport",
            "time_zone": "America/New_York",
            "name": "Hartsfield-Jackson Atlanta International Airport",
            "longitude": -84.4279,
            "latitude": 33.638714,
            "id": "arp_atl_us",
            "icao_code": "KATL",
            "iata_country_code": "US",
            "iata_code": "ATL",
            "iata_city_code": "ATL",
            "city_name": "Atlanta",
            "city": {
              "type": "city",
              "time_zone": null,
              "name": "Atlanta",
              "longitude": null,
              "latitude": null,
              "id": "cit_atl_us",
              "icao_code": null,
              "iata_country_code": "US",
              "iata_code": "ATL",
              "iata_city_code": "ATL",
              "city_name": null
            }
          },
          "id": "sli_0000A8LBrymDrITD6r6BNZ",
          "duration": "PT2H23M",
          "destination_type": "airport",
          "destination": {
            "type": "airport",
            "time_zone": "America/New_York",
            "name": "New York Stewart International Airport",
            "longitude": -74.102724,
            "latitude": 41.501292,
            "id": "arp_swf_us",
            "icao_code": "KSWF",
            "iata_country_code": "US",
            "iata_code": "SWF",
            "iata_city_code": "NYC",
            "city_name": "Newburgh",
            "city": {
              "type": "city",
              "time_zone": null,
              "name": "New York",
              "longitude": null,
              "latitude": null,
              "id": "cit_nyc_us",
              "icao_code": null,
              "iata_country_code": "US",
              "iata_code": "NYC",
              "iata_city_code": "NYC",
              "city_name": null
            }
          }
        }
      ]
    },
    "refund_to": "original_form_of_payment",
    "penalty_total_currency": "GBP",
    "penalty_total_amount": "25.00",
    "order_id": "ord_0000A8L6Pqy4nZVh0nPdK4",
    "new_total_currency": "GBP",
    "new_total_amount": "25.00",
    "live_mode": false,
    "id": "oce_0000A8LNLgZVCzBypYW5mC",
    "expires_at": "2021-06-19T12:50:09Z",
    "created_at": "2021-06-16T12:50:09.386961Z",
    "confirmed_at": "2021-06-16T13:14:25Z",
    "change_total_currency": "GBP",
    "change_total_amount": "50.00"
  }
}

Adding Post Booking Bags
Note

The ability to book post-order is not available for all airlines yet. We recommend using easyJet to follow along on this guide.
What do you need to start?
This guide will go through the changes you need to list and book services for an order you've previously booked. It's important you have already made a booking before following this guide.
If you are not familiar with how to create an order please heads over to our Quick Start Guide.

This guide will start from an order so make sure you grab an order ID for an easyJet flight before we start.

Tip

We've put together a Postman Collection that contains all of the requests you'll need to follow along with this guide.
Overview
Baggages are a type of what we call available_services. The changes we'll make to work with available services are:
Retrieve a list of available_services for an order

Pay for and book the services

Getting services for an order
We start by fetching the bags for the order. Using a valid order id you can use:
Shell


curl

curl -X GET --compressed "https://api.duffel.com/air/orders/$ORDER_ID/available_services"
  -H "Accept-Encoding: gzip"
  -H "Accept: application/json"
  -H "Duffel-Version: v2"
  -H "Authorization: Bearer $YOUR_ACCESS_TOKEN"
This request will return a list of the available_services.
Available services
The only available service currently supported is baggages. Each available service is unique and identifiable by id. The price of the service is described by total_currency and total_amount. And the actual service information is determined by its type and metadata.
Important to notice that services are specific to segments and passengers. The relationship is described by the attributes segment_ids and passenger_ids.
Note

Please also note that baggage can only be added to existing orders where baggage was not part of the original booking.
Learn more
For a complete description of the available services schema checkout the API reference.
https://duffel.com/docs/api/offers/schema

Booking services
Once you know what service a user wants to book all you have to send request to the post-booking services endpoint with the following payload.
Shell


curl

curl -X POST --compressed "https://api.duffel.com/air/orders/$ORDER_ID/services"
  -H "Accept-Encoding: gzip"
  -H "Accept: application/json"
  -H "Content-Type: application/json"
  -H "Duffel-Version: v2"
  -H "Authorization: Bearer $YOUR_ACCESS_TOKEN"
  -d '{
  "data": {
    "payment": {
      "type": "balance",
      "currency": "'"$TOTAL_CURRENCY"'",
      "amount": "'"$TOTAL_AMOUNT"'"
    },
    "add_services": [
      {
        "quantity": 2,
        "id": "'"$SERVICE_ID_1"'"
      },
      {
        "quantity": 1,
        "id": "'"$SERVICE_ID_2"'"
      }
    ]
  }
}'
You must add the attribute services to your request payload. This field should contain a list of add_services. Each service on the list here must contain the available service id ($SERVICE_ID_N) and the desired quantity.
The payment amount ($TOTAL_AMOUNT) must be increased by the amount times quantity of each service you'd like to purchase. For example, if you include service A with quantity 2 and total_amount 10 GBP, the amount of the payment should now be 20 GBP.
Services on Order
Once the booking has gone through in the airline's system we will return the usual order create response payload to you. You can always retrieve your order by id:
Shell


curl

curl -X GET --compressed "https://api.duffel.com/air/orders/$ORDER_ID"
  -H "Accept-Encoding: gzip"
  -H "Accept: application/json"
  -H "Duffel-Version: v2"
  -H "Authorization: Bearer $YOUR_ACCESS_TOKEN"
Services
The service object will look exactly the same as the available service except for maximum_quantity being replaced with quantity. It's worth flagging that any ancillary baggages booked as services will not be present in the slices[].segments[].passengers[].baggages[]. They are only present in the services field. If you want the full picture of a passenger's baggage you will need to combine both.

Paying with customer cards
Overview
Duffel Cards provides a PCI-compliant way for your customers to pay airlines and accommodation providers directly for their bookings.
PCI
Payment card industry (PCI) compliance is required by credit card companies when make secure online transactions to minimise the risk of fraud and identity theft. Any merchant that handles credit card information, including processing, storing or transmitting, is required to be compliant.
Duffel is a PCI DSS Level 1 certified service provider, adhering to the highest compliance standards.
By following this guide, you can minimise your PCI compliance requirements. Duffel’s functionality for managing all card data collection means your customers' card information never touches your servers, significantly reducing your PCI compliance obligations.
This guide will walk you through how to use Duffel Cards to capture your customers' cards, have the customers complete a 3DS challenge when required, and book flights or accommodation directly with these cards. Duffel Cards adds new steps to the normal search, select and create instant orders workflow:
Search for Offers

Select Offer

Capture Customer Card

Initiate 3DSecure Session

Create Order

Tip

Although this guide is focused on the flow of booking instant orders, Duffel Cards can also be used to pay for hold orders, order changes or Stays bookings.
The payment flow starts on your checkout page and includes the following steps:
Capture your customers' card - Use Duffel's card component, DuffelCardForm, to capture all the required card details and store them securely on Duffel's servers.

Authenticating the payment - Start a Duffel 3DSecure Session using our createThreeDSecureSession function to authenticate the customer intent to purchase the travel service. As part of this step we contact the customer's card issuer to see if the cardholder is required to authenticate the transaction. This may trigger a challenge screen where your customer needs to enter a confirmation code to proceed with the booking.

Book a flight or accommodation - Taking the 3DSecure Session response and using that as part of booking a flight or accommodation with the customers card.

Requirements
This guide assumes that you already have a working integration with the Duffel API. Only the basics of searching and booking are required for this guide. If you could use a refresher, please head over to our Quick Start Guide.
Is this guide right for you?
This section helps you understand which implementation guide to follow based on the types of cards your customers plan to pay with.
Individual cards are physical or virtual cards that are issued to an individual person. These can be either cards issued for personal use, or corporate cards issued in the name of an employee.
Corporate cards are physical or virtual cards that are issued to a business, and are issued with a company name as the cardholder name.
To determine if this integration guide is right for your integration please answer the following questions for each type of card you plan to accept:
Question 1: Is your customer paying with a physical card issued to an individual?
If the answer is Yes → This guide is written for you, please continue reading from the Approval requirement step below.
If the answer is No → Please continue to the next question.
Question 2: Is the card being used within a secure corporate environment?
A secure corporate environment is where company employees require secure logins to make bookings. Examples of a secure corporate environment:
You offer a corporate travel Online Booking Tool (OBT) that is only accessible by authorised employees through a secure login.

You are a Travel Management Company (TMC) that stores corporate card details of your customers’ employees using secure profiles that are only accessible by your authorised employees through a secure login.

If the answer is Yes → Please read our Paying with cards in corporate booking tools guide.
If the answer is No → Please get in touch with the Duffel support team at help@duffel.com to see if we fully support your payment needs.
Approval
Approval is required to pay using cards. Please get in touch with the Duffel support team at help@duffel.com to request approval before beginning your integration.
Capture customer card
A Card is a resource that will be used to represent a card that does not expose PCI sensitive data and can be used to pay travel suppliers directly.
Once your customer has searched for and selected an offer to book, the first step to use Duffel Cards is to use the DuffelCardForm component on your checkout pages from the Duffel JavaScript library @duffel/components.
Install
Start by installing the library in your JavaScript project.
npm i @duffel/components

# -- or --

yarn add @duffel/components
You can find up to date documentation on how to use it on github:
Instructions to install the package

List of available versions

Examples

Create client component key
To use the card component a client component key needs to be created on the server side and be made available to your checkout pages.
The client component key is a token that is safe to be used client side.
Render card form component
Next render the DuffelCardForm component in the payment section of your checkout page. This is usually the final step once the final price is known. Using the client component key, this will render a PCI-complaint form to capture the card and return a Card ID that will get used in the next step.
Actions are made available through an imperative interface. The component ref exposes two actions that will issue a request to Duffel to handle the user’s card data. You may choose to manage the ref yourself but we recommend using the useDuffelCardFormActions hook.
JavaScript


function YourComponent() {
  const { ref, createCardForTemporaryUse } = useDuffelCardFormActions()

  return (
    <>
      <DuffelCardForm ref={cardFormRef} {...props} />
      <button onClick={createCardForTemporaryUse}>Pay</button>
    </>
  )
}

Once the form is submitted there are two different action handlers:
Validate This action gives you visibility into whether the form data is valid. This will happen automatically and does not require you to trigger a ref action. You should use the success handler to enable the following steps on your UI. To handle this action use:
onValidateSuccess: The card data input is valid.

onValidateFailure: The card data input is not valid. Note this will only be called when the form modified in a way that fails validation after validation had previously passed.

createCardForTemporaryUse When successful, this action will return a card ID that can be used for creating orders and bookings. To handle this action use:
onCreateCardForTemporaryUseSuccess: Returns the Card record.

onCreateCardForTemporaryUseFailure: Return information about the error.

Example of the card component
Example of the card component

Learn more

If you'd like to get a complete look how to use the DuffelCardForm component, please read our Card Form and 3DSecure Session guide
Initiate 3DS Session
Card payments must be authenticated before authorisation of a payment can be given. In this step, we will perform a 3DS authentication for a card payment with the cardholder's issuing bank and use the result to place an order using the Duffel API.
3D Secure
3D Secure (3DS) is an authentication protocol that provides an extra layer of authentication for online card transactions before the payment is authorised to be taken.
In a typical e-commerce scenario, the same entity authenticates and authorises a payment. When selling travel services indirectly, you present the customer with the shopping experience and checkout page to purchase a travel service, such as a flight, on behalf of the travel supplier. As such, you must authenticate the card before they can authorise the payment.
Duffel's 3DS Session functionality is provided for you to perform that authentication. Using it for every card transaction helps maximise your card payment acceptance by ensuring you to use a 3DS authentication challenge when required, and confirmation when it's OK to proceed without.
The need for 3DS authentication can vary due to geography, card type, brand, and the card issuer or acquirer. Duffel simplifies this process by handling these complexities and determining when 3DS is needed during checkout so you don’t have to.
The flow starts by asking the cardholder's issuing bank to authenticate a payment amount to a specific merchant. The issuing bank might require fingerprinting of the cardholder's browser and requiring a verification challenge during checkout. The issuing bank determines the challenge flow, which usually involves the cardholder confirming the transaction using the method set up with their issuing bank (SMS, banking app, or email).
Example of a 3DSecure challenge
Example of a 3DSecure challenge

Usage
For 3DS authentication, use the createThreeDSecureSession function provided in @duffel/components. You will need a client key, resource information (i.e. its ID and any associated services), and Card ID created in the previous step.
If a 3DS challenge is required, the function will open a modal for the cardholder to action.
The createThreeDSecureSession functions returns a promise. If the transaction is authenticated successfully, this promise will resolve to a 3DS Session object with the status ready_for_payment. You must pass the ID of the 3DS Session when creating a payment for your resource as three_d_secure_session_id .
Otherwise the promise will reject with an error or a 3DS Session with a different status. Any other status means the session is not ready for payment - either the user failed the challenge, or there was an error during the challenge. The full list of possible statuses can be found in the interface below. When rejected the challenge should be retried by calling the function again.
In the below example, you can see how to use createThreeDSecureSession to get the three_d_secure_session_id required to create an order.
JavaScript


const offerId = 'off_0000AJyeTUCEoY5PhVPN8k_0'
const offerServices = [{ id: 'ase_00009UhD4ongolulWAAA1A', quantity: 1 }] // This can be bags or seats when booking flights

const clientKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiaWN1XzAwMDBBZ1ppdHBPblF0ZDNOUXhqd08iLCJvcmRlcl9pZCI6Im9yZF8wMDAwQUJkWm5nZ1NjdDdCb3JhVTFvIiwiaWF0IjoxNTE2MjM5MDIyfQ.GtJDKrfum7aLlNaXmUj-RtQIbx0-Opwjdid0fiJk6DE' // See the Client Key section above in the document
const cardId = 'tcd_00009hthhsUZ8W4LxQgkjb' // You can use the Duffel card component or API to get the card ID.

const threeDSecureSession = createThreeDSecureSession(
  clientKey,
  cardId, // This is the Card ID from the previous step
  offerId,
  offerServices,
  true
)
  .then(async (threeDSecureSession) => {
    if (threeDSecureSession.status === 'ready_for_payment') {
      createOrder({
        ... // plus passenger and other order creation information
        selected_offers: [offerId],
        services: offerServices,
        payments: [
          {
            type: 'card',
            currency: offerCurrency,
            amount: offerAmount,
            three_d_secure_session_id: threeDSecureSession.id,
          },
        ],
      })
    } else {
      console.warn(
        '3DS session status is not ready_for_payment, please try again',
        {
          threeDSecureSession,
        }
      )
    }
  })
  .catch((error) => {
    console.error('Error creating 3DS session', error)
  })



Hide full sample

Testing your integration
Caution

Use Duffel Airways or Duffel Hotel Group for testing card payments. The test scenarios described below only work with these suppliers.
Test Scenarios - 3DS Challenge
In test mode the following card details can be used to trigger different outcomes on the card acceptance of the 3DS flow.
Follow the below instructions to simulate the different 3DS authentication scenarios in test mode:
Card number:
Test scenario	Visa	Mastercard	American Express
3DS Challenge Required	4242424242424242	5555555555554444	378282246310005
No 3DS Challenge Required	4111110116638870	5555550130659057	378282246310005
Expiry date: Use any future date for expiry_month and expiry_year
Card Verification Code (CVC): Use any valid value for cvc. 3 digits for Visa and Mastercard, 4 digits for American Express.
Address details: Use any valid address.
3DS Challenge Verification code: When completing a 3DS challenge, entering 111-111 will result in a successful challenge. Any other value will result in a failure.
Learn more

If you'd like to get a complete look how to use the createThreeDSecureSession function, please read our Card Form and 3DSecure Session guide
Test Scenarios - Card Payment Declined
Suppliers can decline card payments for multiple reasons (perceived risk, insufficient funds, etc.).
Follow the below instructions to simulate payment declined scenarios in test mode:
To simulate a payment declined in Flights, use Declined as name when creating the card record.

To simulate a payment declined in Stays, select the Payment declined when Booking room on the Duffel Test Hotel.

Paying with cards in corporate booking tools
Overview
Duffel provides a Payment card industry (PCI) compliant way for your corporate customers to pay airlines and accommodation providers directly for their bookings.
This guide will walk you through how to capture your cards, have the customers complete a 3DS challenge when required, and book flights or accommodation directly with these cards. To pay with cards adds new steps to the normal search, select and create instant orders workflow:
Search for Offers

Select Offer

Sending Card details

Initiate 3DSecure Session

Create Order

Tip

Although this guide is focused on the flow of booking instant orders, Duffel Cards can also be used to pay for hold orders, order changes or Stays bookings.
Requirements
This guide assumes that you already have a working integration with the Duffel API. Only the basics of searching and booking are required for this guide. If you could use a refresher, please head over to our Quick Start Guide.
Is this guide right for you?
This section helps you understand which implementation guide to follow based on the types of cards your customers plan to pay with.
Individual cards are physical or virtual cards that are issued to an individual person. These can be either cards issued for personal use, or corporate cards issued in the name of an employee.
Corporate cards are physical or virtual cards that are issued to a business, and may be issued with either individual or a company as the cardholder name. Personal use cards that are used for business use by an employee or contractor are not classified as corporate cards even if the transactions are for business.
To determine if this integration guide is right for your integration please answer the following questions for each type of card you plan to accept:
Question 1: Is your customer paying with a physical card issued to an individual?
If the answer is Yes → Please implement our Paying with customer card guide.
If the answer is No → Please continue to the next question.
Question 2: Is the card being used within a secure corporate environment?
A secure corporate environment is where company employees require secure logins to make bookings. Examples of a secure corporate environment:
You offer a corporate travel Online Booking Tool (OBT) that is only accessible by authorised employees through a secure login.

You are a Travel Management Company (TMC) that stores corporate card details of your customers’ employees using secure profiles that are only accessible by your authorised employees through a secure login.

If the answer is No → Please implement our Paying with customer card guide.
If the answer is Yes → Please continue, this guide is written for you.
Note

Not sure if your use case is supported? Please get in touch with the Duffel support team at help@duffel.com to see if we support your payment needs.
PCI compliance
Payment card industry (PCI) compliance is required by credit card companies when make secure online transactions to minimise the risk of fraud and identity theft. Any merchant that handles credit card information, including processing, storing or transmitting, is required to be compliant.
Duffel is a PCI DSS Level 1 certified service provider, adhering to the highest compliance standards.
By following this guide, you can minimise your PCI compliance requirements. Duffel’s functionality for managing all card data collection means your customers' card information never touches your servers, significantly reducing your PCI compliance obligations.
All companies who handle card data are required to perform annual assessments to ensure you take appropriate measures to handle card details securely. Customers collecting customer card details using our web component typically are only required to do the lightest form of self-assessment questionnaire (SAQ-A). It is your responsibility to ensure you are complying with PCI guidelines for your business. Please see the PCI security standards website to find out which SAQ is right for your business.
Approval
Approval is required to pay using cards. Please get in touch with the Duffel support team at help@duffel.com to request approval for your corporate booking tool before beginning your integration.
Sending cards details
A card is a resource that will be used to represent a card that does not expose PCI sensitive data and can be used to pay travel suppliers directly.
Once your customer has searched for and selected an offer to book, you now need to pass the card details to be able to pay for the booking from your environment to Duffel.
Use Duffel’s card endpoints to securely store the card details on Duffel’s servers ready for checkout.
Request
Caution

This request hostname is different from other endpoints: api.duffel.cards
Shell


curl -X POST --compressed "https://api.duffel.cards/payments/cards" \
  -H "Accept-Encoding: gzip" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Duffel-Version: v2" \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
  -d '{
  "data": {
    "address_city": "London",
    "address_country_code": "GB",
    "address_line_1": "1 Downing St",
    "address_line_2": "First floor",
    "address_postal_code": "EC2A 4RQ",
    "address_region": "London",
    "expiry_month": "03",
    "expiry_year": "30",
    "name": "Neil Armstrong",
    "number": "4242424242424242",
    "cvc": "123",
    "multi_use": false
  }
}'

Response
JSON


{
  "data": {
    "id": "tcd_00009hthhsUZ8W4LxQgkjb",
    "live_mode": false,
    "last_4_digits": "4242",
    "multi_use": false,
    "brand": "visa",
    "unavailable_at": "2024-01-20T12:00:00Z"
  }
}

Field definitions can be found in the API reference.
Initiating a 3DS Session
Card payments must be authenticated before authorisation of a payment can be given. In this step, we will perform 3DS authentication for a card payment and use the result to place an order using the Duffel API.
3D Secure
3D Secure (3DS) is an authentication protocol that provides an extra layer of authentication for online card transactions before the payment is authorised to be taken.
In a typical e-commerce scenario, the same entity authenticates and authorises a payment. When selling travel services indirectly, you present the customer with the shopping experience and checkout page to purchase a travel service, such as a flight, on behalf of the travel supplier. As such, you must authenticate the card before they can authorise the payment.
Duffel's 3DS Session functionality is provided for you to perform that authentication. When required, we initiate a 3DS authentication challenge to maximise the likelihood of card acceptance.
The need for 3DS authentication can vary due to geography, card type, brand, and the card issuer or acquirer. Duffel simplifies this process by handling these complexities and determining when 3DS is needed during checkout so you don’t have to.
All bookings made in a secure corporate environment with a corporate card do not require the end user to authorise the payment using an authentication challenge. Instead, you must declare that the transaction was initiated inside a secure corporate environment. To make that declaration, you must initiate a 3DS Session with the exception parameter set to secure_corporate_payment.
Tip

When paying with physical corporate cards issued to an individual employee an authentication challenge may still be required or the transaction could be declined. You must not pass the exemption for individual physical corporate cards. Implement the 3DS challenge component to handle situations when a challenge occurs. For guidance on how to do that please follow the Initiate 3DS Session section of the Customer card guide .
In the example below you can see how to create a 3DS session using the exception for a secure corporate payment which allows you to then go straight to payment.
Request
Shell


curl -X POST --compressed "https://api.duffel.com/payments/three_d_secure_sessions" \
  -H "Accept-Encoding: gzip" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Duffel-Version: v2" \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
  -d '{
  "data": {
    "card_id": "tcd_00009hthhsUZ8W4LxQgkjb",
    "resource_id": "off_00009htYpSCXrwaB9DnUm0",
    "services": [{"id": "sea_00003hthlsHZ8W4LxXjkzo", "quantity": 1}],
    "multi_use": false,
    "exception": "secure_corporate_payment"
  }
}'

Response
JSON


{
  "data": {
    "id": "3ds_00004htsssTG8W4LxQgrtp",
    "live_mode": false,
    "card_id": "tcd_00009hthhsUZ8W4LxQgkjb",
    "resource_id": "off_00009htYpSCXrwaB9DnUm0",
    "expires_at": "2024-12-21T12:21:12Z",
    "status": "ready_for_payment",
    "client_id": "tds_visa_5a9a7b0a574c"
  }
}

Note that the status field is ready_for_payment.
The three_d_secure_session_id can now be used to pay when creating a Flights order, hold order, order change or to pay for a Stays booking.
There are 2 outcomes when using secure_corporate_payment exception, either the status is ready_for_payment or failed because the card can't be used with the secure_corporate_payment exception.
Further information in the request and response schema can be found in the API reference.
Testing your integration
In test mode the following card details can be used to trigger different outcomes on the card acceptance of the 3DS flow.
Follow the below instructions to simulate the different 3DS authentication scenarios in test mode:
Card number:
Test scenario	Visa	Mastercard	American Express
Ready for payment	4111110116638870	5555550130659057	378282246310005
Failed	4242424242424242	5555555555554444	378282246310005
Expiry date: Use any future date for expiry_month and expiry_year
Card Verification Code (CVC): Use any valid value for cvc. 3 digits for Visa and Mastercard, 4 digits for American Express.
Address details: Use any valid address.
Test Scenarios - Card Payment Declined
Suppliers can decline card payments for multiple reasons (perceived risk, insufficient funds, etc.).
Follow the below instructions to simulate payment declined scenarios in test mode:
To simulate a payment declined in Flights, use Declined as name when creating the card record.

To simulate a payment declined in Stays, select the Payment declined when Booking room on the Duffel Test Hotel.

Receiving Webhooks
Overview
In this guide, you'll learn how to set up and handle webhooks in your Duffel integration.
After you've set up webhooks, you'll receive notifications about events that happen in your Duffel account - for example, when an airline has a schedule change affecting one of your orders.
We'll send these events to your server, and then you can process them and take action automatically - for example updating your database or emailing a customer.
We'll go through three simple steps to set this up:
Build a simple webhook receiver in Python

Create a webhook

Send a test event to our webhook

Building a simple webhook receiver in Python
Let's start by creating a server, running locally on our machine, that can receive event notifications.
For this example, we'll write our server in Python 3, but you can use any modern programming language.
We'll assume that you have Python 3 and pip installed. We'll use Flask to quickly build a server. You can install Flask with pip install flask.
Once you have Flask installed, copy the code below and paste it into an app.py file. After you've set up your webhook in step 2, we'll replace <your-generated-webhook-secret> with your webhook's secret.
import json
import hmac
import hashlib
import base64

from flask import Flask, jsonify, request
app = Flask(__name__)

# Secret as bytes, ready for comparison
secret = b"<your-generated-webhook-secret>"


# Our route that will receive the webhooks from Duffel's servers
@app.route('/webhooks', methods=['POST'])
def hello_world():
    if not compare(secret, request):
        print('⚠️  Unsafe payload')
        return jsonify(success=True)

    # Sample event:
    # {'updated_at': None, 'type': 'order.created', 'live_mode': False, 'inserted_at': None, 'idempotency_key': 'ord_0000ApoiwggSbt7BordU1o', 'identity_organisation_id': 'org_0000A5IcgBRqte1uoxkDU8', 'id': 'wev_0000A5O5f2N91XniqO9DdY', 'data': {'object': {}}}
    event = None

    try:
        # Get the payload as JSON
        event = request.json
        print('ℹ️ Parsed event')

    except:
        print('⚠️  Webhook error while parsing basic request.' + str(e))
        return jsonify(success=False)

    # Handle the event
    if event and event['type'] in ['order.updated', 'order.airline_initiated_change_detected', 'ping.triggered']:
        print('ℹ️ Event type: ' + event['type'])

    else:
        # Unexpected event type
        print('⚠️ Unhandled event type {}'.format(event['type']))
        return jsonify(success=True)

    print('✅Handled event!')

    return jsonify(success=True)


# Compare the request's payload with our secret to verify that it was sent
# from Duffel, and not from a malicious actor.
def compare(secret, request):
    # Get the payload as bytes so that we can construct the signature from
    # raw/unparsed data
    raw_payload = request.get_data()

    # Format:
    # t=1616202842,v1=8aebaa7ecaf36950721e4321b6a56d7493d13e73814de672ac5ce4ddd7435054
    raw_signature = request.headers['X-Duffel-Signature']
    pairs = list(map(lambda x: x.split('='), raw_signature.split(',')))
    t = pairs[0][1]
    v1 = pairs[1][1]

    # Recreate the signature
    local_signature = signature(secret, raw_payload, t)

    # Use a secure comparison function to check that they're the same
    return hmac.compare_digest(v1, local_signature)


# Generate a signature
def signature(secret, payload, timestamp):
    # We need the signed payload as bytes
    signed_payload = timestamp.encode() + b"." + payload
    # The signature in bytes
    signature = hmac.new(secret, signed_payload, hashlib.sha256).digest()
    # Base16 encode the signature, in lowercase, then decode to a string
    return base64.b16encode(signature).lower().decode()



Hide full sample

The application is very simple. The comments throughout explain the flow of how we process a received notification.
You can run this application on port 4567 with a simple command:
Shell


FLASK_ENV=development FLASK_RUN_PORT=4567 FLASK_APP=app.py flask run

You'll need to expose your application to the internet to be able to receive events from Duffel. The simplest way to do this on your local machine is to use ngrok, which is free to download across all major operating systems.
Once you've installed ngrok, you can run it from the command line and expose port 4567 to the internet with the following command:
Shell


ngrok http 4567

With ngrok running, you'll need to copy the URL it gives you so you can pass that to Duffel and we can send you events.
You should see output from ngrok with a line that looks something like $ Forwarding http://be3baxdc.ngrok.io -> 127.0.0.1:4567. You should copy the http://be3baxdc.ngrok.io part.
You'll need to keep the Python script and ngrok running for the next steps of this guide.
Creating a webhook
Next, we need to use the Duffel API to create a new webhook pointing to our webhook receiver.
Duffel can send a range of different kinds of "event" via a webhook. Let's start by creating a webhook which is subscribed to the order.airline_initiated_change_detected event. This event will be triggered, and we'll send a request to your webhook, when an order has a schedule change initiated by the airline.
You can use a request like this to create a webhook - you'll need to replace <YOUR_ACCESS_TOKEN> with your access token for the Duffel API, and the url with the URL you got from ngrok above:
Shell


curl -X POST --compressed "https://api.duffel.com/air/webhooks" \
  -H "Accept-Encoding: gzip" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Duffel-Version: v2" \
  -H "Authorization: Bearer $YOUR_ACCESS_TOKEN" \
  -d '{
  "data": {
    "url": "https://www.example.com:4000/webhooks",
    "events": [
      "order.airline_initiated_change_detected"
    ]
  }
}'

You'll get back a response like this:
JSON


{
  "meta": null,
  "data": {
    "url": "http://be3baxdc.ngrok.io/webhooks",
    "secret": "54vFWvaSbbzYpxXPeB4YEw==",
    "id": "end_0000A5TK3psWyzKIU2La52",
    "live_mode": false,
    "events": ["order.airline_initiated_change_detected"],
    "created_at": "2021-03-22T15:14:42.127734Z",
    "active": true
  }
}

You'll see that the webhook is currently active. You can deactivate a webhook using the update a webhook endpoint in the API, you can also change the URL if you wish with this endpoint.
You must write down the returned secret as it's only available at the time when you create a webhook. You'll never be able to see it again.
You'll need to take that secret and replace <your-generated-webhook-secret> in your Python code above with it, and then restart the application.
Note that you'll have specific, separate webhooks for Duffel's live mode and test mode. When you create a webhook, its mode will be determined by the access token you use. live_mode will be set to true if you create the webhook using a live mode access token. It'll be set to false if you use a test mode access token. You should start in test mode.
Sending a test event to our webhook
We now have our local webhook receiver running and we've created a webhook in Duffel to send events to that receiver. Congratulations! 🎉 The next step is to make sure it works.
We have an API endpoint that allows you to trigger a ping event to your webhook. To trigger a ping, you'll need the ID for the webhook (which was returned when you created your webhook - for example sev_0000A5TK3psWyzKIU2La52). With that, you can send a request to Duffel to trigger the ping event:
Shell


curl

curl -X POST --compressed "https://api.duffel.com/air/webhooks/id/$WEBHOOK_ID/actions/ping"
  -H "Accept-Encoding: gzip"
  -H "Accept: application/json"
  -H "Content-Type: application/json"
  -H "Duffel-Version: v2"
  -H "Authorization: Bearer $YOUR_ACCESS_TOKEN"
  -d '{}'
You'll need to replace $YOUR_ACCESS_TOKEN with your Duffel access token and $WEBHOOK_ID with the ID of your webhook.
If your webhook was configured successfully and your code was running and accessible to the internet, your local Python server should output ✅ Handled event!.
What's next?
You've created a webhook which subscribes to the order.airline_initiated_change_detected event, so you'd receive a push whenever an airline changes the schedule of your order.
An order.airline_initiated_change_detected webhook looks like this:
JSON


{
  "created_at": "2021-04-22T13:13:18.420272Z",
  "data": {
    "object": {
      ..
    }
  },
  "id": "wev_0000A6VP9fgKxAccTSKWUy",
  "live_mode": false,
  "object": "order",
  "type": "order.airline_initiated_change_detected",
  "idempotency_key": "aic_0000ApoiwggSbt7BordU1o"
}

In your code, you should look at the type of events that you receive and handle that appropriately. As our system will retry failed events, there can be cases when we will send you duplicate events, in those cases you should use the idempotency_key to check for uniqueness.
Overview
Building a simple webhook receiver in Python
Creating a webhook
Sending a test event to our webhook
What's next?

Modelling Customers in Duffel
Introduction
When building a travel application with the Duffel API, you'll often need to represent your end users within our system. This is where Customer Users and Customer User Groups come in.
These flexible constructs allow you to:
Associate your users with bookings and orders

Enable access to the Travel Support Assistant

Organise users into meaningful groups

Maintain consistent user information across the Duffel API

Allow Duffel to send confirmation and support emails if desired

This guide will walk you through creating and managing Customer Users and Customer User Groups, and show you how to use them when creating orders and bookings.
Understanding Customer Users
A Customer User represents one of your application's end users within the Duffel API.
JSON


{
  "data": {
    "id": "icu_0000AgZitpOnQtd3NQxjwO",
    "email": "tony@stark.com",
    "phone_number": "+14155550123",
    "given_name": "Tony",
    "family_name": "Stark",
    "created_at": "2023-06-01T12:00:00Z",
    "group": null
  }
}

When you create a Customer User, the information is persisted within the Duffel API and can be referenced in future API calls.
Understanding Customer User Groups
A Customer User Group allows you to organise your Customer Users into logical collections.
JSON


{
  "data": {
    "id": "usg_0000AgZitpOnQtd3NQxjwO",
    "name": "Stark Industries",
    "created_at": "2023-06-01T12:00:00Z"
  }
}

Groups can represent any meaningful segmentation in your application, such as organisations or companies.
Creating a Customer User
Let's start by creating a simple Customer User without assigning them to a group:
Shell


curl

curl -X POST https://api.duffel.com/identity/customer/users \
  -H "Accept-Encoding: gzip" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Duffel-Version: v2" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "email": "tony@stark.com",
    "phone_number": "+14155550123",
    "given_name": "Tony",
    "family_name": "Stark"
  }'
The response will include a Customer User ID that you can reference in future API calls:
JSON


{
  "data": {
    "id": "icu_0000AgZitpOnQtd3NQxjwO",
    "email": "tony@stark.com",
    "phone_number": "+14155550123",
    "given_name": "Tony",
    "family_name": "Stark",
    "created_at": "2023-06-01T12:00:00Z",
    "live_mode": false,
    "group": null
  }
}

Required and Optional Fields
When creating a Customer User, remember:
email is required and must be unique within a group (or among users without groups)

given_name and family_name are required

phone_number is optional

A Customer User's email must be unique within their group. This means:
- Two Customer Users in the same group cannot have the same email
- Two Customer Users with no group cannot have the same email
- Two Customer Users in different groups can have the same email
Creating a Customer User Group
Now, let's create a Customer User Group:
Shell


curl

curl -X POST https://api.duffel.com/identity/customer/user_groups \
  -H "Accept-Encoding: gzip" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Duffel-Version: v2" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Stark Industries"
  }'
The response will include the new group's ID:
JSON


{
  "data": {
    "id": "usg_0000AgZitpOnQtd3NQxjwO",
    "name": "Stark Industries",
    "created_at": "2023-06-01T12:00:00Z"
  }
}

Creating a Customer User within a Group
To create a Customer User directly within a group, include the group ID:
Shell


curl

curl -X POST https://api.duffel.com/identity/customer/users \
  -H "Accept-Encoding: gzip" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Duffel-Version: v2" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "email": "pepper@stark.com",
    "phone_number": "+14155550124",
    "given_name": "Pepper",
    "family_name": "Potts",
    "group_id": "usg_0000AgZitpOnQtd3NQxjwO"
  }'
Response:
JSON


{
  "data": {
    "id": "icu_0000AgZpQrZjNcR4Mqklwx",
    "email": "pepper@stark.com",
    "phone_number": "+14155550124",
    "live_mode": false,
    "given_name": "Pepper",
    "family_name": "Potts",
    "created_at": "2023-06-01T12:15:00Z",
    "group": {
      "id": "usg_0000AgZitpOnQtd3NQxjwO",
      "name": "Stark Industries"
    }
  }
}

Using Customer Users when Creating Orders
When creating an order, you can associate Customer Users with it:
Shell


curl

curl -X POST https://api.duffel.com/air/orders \
  -H "Accept-Encoding: gzip" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Duffel-Version: v2" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "data": {
      "users": [
        "icu_0000AgZitpOnQtd3NQxjwO"
      ],
      "type": "instant",
      "selected_offers": [
        "off_0000AgZitpOnQtd3NQxjwO"
      ],
      "payments": [
        {
          "type": "balance",
          "currency": "GBP",
          "amount": "430.00"
        }
      ],
      "passengers": [
        {
          "user_id": "icu_0000AgZitpOnQtd3NQxjwO",
          "title": "mr",
          "phone_number": "+14155550123",
          "id": "pas_0000AgZpQrZjNcR4Mqklwx",
          "identity_documents": [
            {
              "unique_identifier": "75209451",
              "type": "passport",
              "issuing_country_code": "US",
              "expires_on": "2030-06-25"
            }
          ],
          "given_name": "Tony",
          "gender": "m",
          "family_name": "Stark",
          "email": "tony@stark.com",
          "born_on": "1970-05-29"
        }
      ],
      "metadata": {
        "internal_order_id": "avengers-123",
        "mission": "conference"
      }
    }
  }'


Hide full sample

By including the Customer User in your order creation request (both in the users array and as the user_id in the passenger object), you:
Associate the order with a specific user in your system

Enable that user to access this order through the Travel Support Assistant

Make it easier to track and manage orders for specific users

Using Customer Users when Creating Bookings
Similarly, you can associate Customer Users with bookings:
Shell


curl

curl -X POST https://api.duffel.com/stays/bookings \
  -H "Accept-Encoding: gzip" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Duffel-Version: v2" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "data": {
      "users": [
        "icu_0000AgZitpOnQtd3NQxjwO"
      ],
      "quote_id": "quo_0000AS0NZdKjjnnHZmSUbI",
      "phone_number": "+14155550123",
      "payment": {
        "three_d_secure_session_id": "3ds_0000AWr2Xs1Vp34gh5"
      },
      "metadata": {
        "customer_reference_number": "STARK001"
      },
      "loyalty_programme_account_number": "201154908",
      "guests": [
        {
          "user_id": "icu_0000AgZitpOnQtd3NQxjwO",
          "given_name": "Tony",
          "family_name": "Stark"
        }
      ],
      "email": "tony@stark.com",
      "accommodation_special_requests": "Need large workbench space for technical projects"
    }
  }'


Hide full sample

As with orders, including the Customer User ID in both the users array and as the user_id in the guest object provides the same benefits of user association and support access.
Using Additional Customer Users
You can also specify additional Customer Users who should have access to an order, even if they're not the primary customer, by adding multiple IDs to the users array:
Shell


curl

curl -X POST https://api.duffel.com/air/orders \
  -H "Accept-Encoding: gzip" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Duffel-Version: v2" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "data": {
      "users": [
        "icu_0000AgZitpOnQtd3NQxjwO",
        "icu_0000AgZpQrZjNcR4Mqklwx"
      ],
      "type": "instant",
      "selected_offers": [
        "off_0000AgZitpOnQtd3NQxjwO"
      ],
      "payments": [
        {
          "type": "balance",
          "three_d_secure_session_id": "3ds_0000AWr2Xs1Vp34gh5",
          "currency": "GBP",
          "amount": "430.00"
        }
      ],
      "passengers": [
        {
          "user_id": "icu_0000AgZitpOnQtd3NQxjwO",
          "title": "mr",
          "phone_number": "+14155550123",
          "id": "pas_0000AgZpQrZjNcR4Mqklwx",
          "identity_documents": [
            {
              "unique_identifier": "75209451",
              "type": "passport",
              "issuing_country_code": "US",
              "expires_on": "2030-06-25"
            }
          ],
          "given_name": "Tony",
          "gender": "m",
          "family_name": "Stark",
          "email": "tony@stark.com",
          "born_on": "1970-05-29"
        }
      ],
      "metadata": {
        "internal_order_id": "avengers-123",
        "mission": "conference"
      }
    }
  }'


Hide full sample

This is useful when:
A personal assistant is booking on behalf of an executive

A team leader needs access to team members' bookings

Family members need to access each other's travel information

Additional Management Options
There are additional endpoints available for managing your Customer Users and Groups, including retrieving, listing, and updating them. For complete details, refer to the API references for Customer Users and Customer User Groups.
Best Practices
Here are some recommendations for implementing Customer Users and Groups effectively:
Create Customer Users early: Create them when users register in your application, not just at booking time

Use meaningful group names: Choose names that reflect your business structure or customer segmentation, this is especially important if accessing the Travel Support Assistant

Associate all orders and bookings: Even if you don't immediately need the Travel Support Assistant, associating users with their orders creates a better foundation for the future

Keep user information updated: When your users update their contact information, be sure to update their Customer User records in Duffel too

Conclusion
Customer Users and Customer User Groups provide a flexible way to represent your users within the Duffel API. By properly implementing them, you can create a more integrated experience for your users and unlock powerful support features like the Travel Support Assistant.
For more information, refer to the API references for Customer Users and Customer User Groups.
Duffel Links
What do you need to start?
Before you can get started with this guide, you'll need to:
Sign up for a Duffel account (it takes about 1 minute!)

To make it easy to build your Duffel integration, we offer a JavaScript client library in JavaScript, Custom element loaded with script tag, Custom element installed with npm and React Component.
In order to access Duffel Links, your Duffel organisation must be set up with a country that is supported by Duffel Payments.
Tip

If you want to see this in action, you can log in to the dashboard and start creating test links from the Duffel Links page.
Tip

We've put together a Postman Collection that contains all of the requests you'll need to follow along with this guide.
Overview
This guide will walk you through how to use Duffel Links to offer a Duffel-powered search and book user interface to your customers so they can find and book their ideal accommodation, flights as well as add flight ancillaries.
Creating Links
First, using our sessions endpoint, you will need to create a link for your user. At creation, you will need to specify the brand customisation you want to use and the URLs you would like us to direct your user to on completion. You will also have the option at this point to specify a checkout currency and a markup you would like to be applied to the flights.
Note

A new session should be created every time a user comes to book flights or accommodation with Duffel Links. Unused sessions will expire after 24 hours, rendering the link invalid, and once a link has been used by one user, it will not be useable for another.
Shell


curl

curl -X POST --compressed "https://api.duffel.com/links/sessions" \
  -H "Accept-Encoding: gzip" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Duffel-Version: v2" \
  -H "Authorization: Bearer $YOUR_ACCESS_TOKEN" \
  -d '{
  "data": {
    "reference": "USER_1",
    "success_url": "https://www.starkindustries.com/success",
    "failure_url": "https://www.starkindustries.com/failure",
    "abandonment_url": "https://www.starkindustries.com/abandon",
    "logo_url":"https://assets.starkindustries.com/logos/logo.svg",
    "primary_color":"#000000",
    "traveller_currency": "USD",
    "markup_amount": "1.00",
    "markup_currency": "USD",
    "markup_rate": "0.01",
    "flights": {
      "enabled": "true"
    },
    "stays": {
      "enabled": "false"
    }
  }
}'


View full sample

The link that is returned will take them to a Duffel-hosted search and book experience which is customised to match your brand. Your users should navigate to this address where they will be able to purchase their accommodation or flights as well as any ancillary products.
A screenshot of the search page on Duffel Links
A screenshot of the search page on Duffel Links

Depending on the outcome of the session, the user will be directed to one of three urls specified at the time of link creation.
Success - Once an order has been successfully created, the user will be provided with details of the booking (itinerary and booking reference) and then prompted to return to the link provided as success_url in the link creation request. This will include order_id and reference query params where the order_id is the Duffel ID that corresponds to the order and reference is the reference value provided in the link creation request. For example: https://www.starkindustries.com/success/?order_id=ord_0000ASPa29O14a2RheVaZE&reference=USER_1

Abandonment - If the user decides to abandon the checkout process by pressing the ‘Return’ button, the user will be redirected to the abandonment_url provided in the link creation request.

Failure - If there is a failure that the Duffel Links session cannot mitigate, the user will be redirected to the failure_url provided in the link creation request.

A screenshot of the order confirmation page on Duffel Links
A screenshot of the order confirmation page on Duffel Links

If completed successfully, your user will have been provided with a confirmation page containing all the information they need in order to fly. All the orders that are created will also be accessible to you in the dashboard and our APIs where you can see and manage all of your customers' orders.
Sending a Travel Booking Confirmation
The final step in a travel booking journey is the receipt of a travel booking confirmation. You need to send this travel booking confirmation. It gives the traveller all the information they need on the day of travel to board a plane or check-in to an accommodation.
You can detect a booking by listening for a Flights order.created or a Stays stays.booking.created webhook event. Alternatively, all bookings are also available via the agent dashboard and the API.
Learn more about Receiving Webhooks.
It is important you include all the key information for the traveller. More information can be found in our Duffel Flight booking confirmation and Duffel Stays booking confirmation guides.

Card Form Component with 3DSecure
Overview
The Card Form Javascript component and 3DSecure Session function provide a PCI-compliant way for you to collect customer card details during checkout for use when creating a booking.
This guide is only relevant to you if your customers use their credit or debit cards to pay airlines and accommodation providers directly for their bookings.
PCI
Payment card industry (PCI) compliance is required by credit card companies when make secure online transactions to minimise the risk of fraud and identity theft. Any merchant that handles credit card information, including processing, storing or transmitting, is required to be compliant.
Duffel is a PCI DSS Level 1 certified service provider, adhering to the highest compliance standards.
By following this guide, you can minimise your PCI compliance requirements. Duffel's functionality for managing all card data collection means your customers' card information never touches your servers, significantly reducing your PCI compliance obligations.
For more information on how to use these components within your checkout experience, please read our Paying with Customer Cards implementation guide.
Continue reading for further information to help with your integration, including interface documentation, styling the components to match your brand, examples and sample code.
This guide covers the Card Form component and the 3DSecure Session function along with common getting started guidance.
Getting Started
These are common steps required to use the Card Form component and creating 3DSecure Sessions.
Installing
The functionality described in this document is available from version 3.7.22. Install it with:
Shell


npm i @duffel/components

# -- or --

yarn add @duffel/components

Client key
The components can only be initiated with a client key. To create one, use the endpoint to create a Component client key.
Card Form Component
The Card Form Javascript component provides a PCI-compliant way for you to collect customer card details during checkout for use when creating a booking.
Logo for undefined
See it on GitHub →
You can find the source code and release notes for this component on GitHub.

Logo for undefined
See it on npm →
This component is available to be installed with npm.

Demo
You can find the source code for the example above in GitHub →
Use cases
The DuffelCardForm component supports three checkout flows:
Using a card for single transaction
Steps:
Users fill out a form with their card and cardholder address information.

The card is safely stored and the component will return an ID, along with some identifiers for the card (i.e. last 4 digits, brand, card holder name).

You should use the ID in the createThreeDSecureSession function or creating orders or booking endpoints.

Saving a card for multiple future transactions
Typically used in scenarios such as storing a card on a traveller profile for faster checkout.
Steps:
Users fill out a form with their card and cardholder address information. The Card Verification Code (CVC) will not be asked for in the form. Once a card is saved, the user need to enter their CVC for ever future transaction.

The card is safely stored and the component will return an ID, along with some identifiers for the card (i.e. last 4 digits, brand, card holder name). This card will be stored in our system until you delete it, or the expiry date lapses.

You store the card ID along with any required identifiers in your system and associate it with a user. You can then present the card as a payment option when users want to create an order or booking.

Using a saved card for a single transaction
Steps:
You supply a saved card ID when initiating the component. The component will only render the CVC input.

User fills out the CVC. A new single use card ID is returned for this specific transaction, along with some identifiers for the card (i.e. last 4 digits, brand, card holder name).

You will then use the ID in the createThreeDSecureSession function or creating orders or booking endpoints.

Intents
Each of the use cases above requires a different UI. To tell the component which use case you are rendering it for, you must provide an intent property:
Use case	Intent value
Using a card for single transaction	to-create-card-for-temporary-use
Saving a card for multiple future transactions	to-save-card
Using a saved card for a single transaction	to-use-saved-card
Actions
Actions are made available through an imperative interface. The component ref exposes two actions that will issue request to Duffel to handle the user’s card data. You may choose to manage the ref yourself but we recommend using the useDuffelCardFormActions hook:
React


function YourComponent() {
   const { ref, saveCard, createCardForTemporaryUse } = useDuffelCardFormActions()

	 return <>
      <DuffelCardForm ref={ref} ... />

      <button onClick={saveCard}>Save</button>
      <button onClick={createCardForTemporaryUse}>Pay</button>
	 </>
}

Event handlers
Once an action is triggered, it will issue a request to Duffel and you must setup event handlers as props on the component for the success and failure cases.
Form validation
This will happen automatically. It doesn’t require you to trigger a ref action. You should use the success handler to enable the following steps on your UI.
To handle this action use:
onValidateSuccess : The card data input is valid.

onValidateFailure : The card data input is no longer valid after it has been successfully validated at least once before.

Calling saveCard
When the to-save-card intent is supplied, use saveCard to initiate the request to Duffel. When successful, you will have the card ID, along with some identifiers for the card (i.e. last 4 digits, brand, card holder name) available for storing in your system.
To handle this action use:
onSaveCardSuccess : Returns the Card record.

onSaveCardFailure : Returns information about the error.

Calling createCardForTemporaryUse
When supplying the to-create-card-for-temporary-use or to-use-saved-card intents, you should call createCardForTemporaryUse to make the request to Duffel to create a card that can be used for creating order, bookings and 3DS sessions.
To handle this action use:
onCreateCardForTemporaryUseSuccess : Returns the Card record.

onCreateCardForTemporaryUseFailure : Return information about the error.

Tip

After calling createCardForTemporaryUse, you’ll have 25 minutes to use the card resource. The objects’s unavailable_at attribute tells you when the card is no longer available for use.
You can find the complete interface for the component below →
Saving and using card during checkout
A fourth common consumer use case is to offer the option to save a card during checkout for future bookings. This can be achieved using the saveCard and createCardForTemporaryUse intents in conjunction. Actions work independently and can be triggered asynchronously based on different events you may capture on your UI.
To support both the saveCard and createCardForTemporaryUse actions use the to-create-card-for-temporary-use intent and set up the success and failure handlers for both of these actions.
You may call saveCard along with createCardForTemporaryUse when the form submitted and with confirmation from the user that they’d like their card to be saved.
Please note: You will receive a different Card object from each action. You need to make sure to save the card information returned from onSaveCardSuccess is stored for future use, and use the card information from onCreateCardForTemporaryUseFailure for the current transaction.
You can also find an example covering this use case on Github →
Component Interface
export interface DuffelCardFormProps {
  /**
   * The client key retrieved from the Duffel API.
   */
  clientKey: string

  /**
   * The styles to apply to the iframe input elements.
   */
  styles?: DuffelCardFormStyles

  /**
   * The card intent defines what the form is meant to look like.
   * It can be one of:
   *
   * - `to-create-card-for-temporary-use`: The full form will be shown. You may also use this intent for the use case of saving and using the card.
   * - `to-use-saved-card`: Only a CVC field will be shown. When using this intent a saved card ID is required.
   * - `to-save-card`: The form will be shown without the CVC field. This only allows you to save a card for future use,
   *    but not create an ID for immediate, temporary use. For the use case of saving and using during checkout, use the `to-create-card-for-temporary-use` intent.
   */
  intent: DuffelCardFormIntent

  /**
   * When using the `use-saved-card` intent, you must provide the card ID.
   */
  cardId?: string

  /**
   * This function is called when the card form validation has been successful.
   */
  onValidateSuccess?: () => void

  /**
   * This function is called if the card form validation is successful but data is changed afterwards,
   * making it invalid.
   */
  onValidateFailure?: () => void

  /**
   * This function is called when the card has been created for temporary, single use.
   *
   * This callback is triggered if the `create-card-for-temporary-use`
   * action is present in the `actions` prop. Alternatively,
   * you may use the `triggerCreateCardForTemporaryUse` function from the
   * `useDuffelCardFormActions` hook.
   */
  onCreateCardForTemporaryUseSuccess?: (
    data: CreateCardForTemporaryUseData
  ) => void

  /**
   * This function is called when the component has failed to create the card for temporary use.
   *
   * This callback is triggered if the `create-card-for-temporary-use`
   * action is present in the `actions` prop. Alternatively,
   * you may use the `triggerCreateCardForTemporaryUse` function from the
   * `useDuffelCardFormActions` hook.
   */
  onCreateCardForTemporaryUseFailure?: (
    error: CreateCardForTemporaryUseError
  ) => void

  /**
   * This function is called when the card has been saved for multi-use.
   *
   * This callback is triggered if the `save-card`
   * action is present in the `actions` prop. Alternatively,
   * you may use the `triggerSaveCard` function from the
   * `useDuffelCardFormActions` hook.
   */
  onSaveCardSuccess?: (data: SaveCardData) => void

  /**
   * This function is called when saving the card has failed.
   *
   * This callback is triggered if the `save-card`
   * action is present in the `actions` prop. Alternatively,
   * you may use the `triggerSaveCard` function from the
   * `useDuffelCardFormActions` hook.
   */
  onSaveCardFailure?: (error: SaveCardError) => void
}

// Supporting types
export interface CreateCardForTemporaryUseData {
  id: string
  live_mode: boolean
}

export type CreateCardForTemporaryUseError = {
  status: number
  message: string
}

export type SaveCardError = {
  status: number
  message: string
}

export interface SaveCardData {
  /**
   * Duffel's unique identifier for the resource
   */
  id: string

  /**
   * Whether the card was created in live mode. This field will be set to true
   * if the card was created in live mode, or false if it was created in test mode.
   */
  live_mode: boolean

  /**
   * Last 4 digits of the card number.
   */
  last_4_digits: string

  /**
   * The card expiry month as an integer with two digits.
   */
  expiry_month: number

  /**
   * The card expiry year as an integer with two digits.
   */
  expiry_year: number

  /**
   * Card brand name.
   */
  brand:
    | 'visa'
    | 'mastercard'
    | 'uatp'
    | 'american_express'
    | 'diners_club'
    | 'jcb'
    | 'discover'

  /**
   * The ISO 8601 datetime at which the card will be automatically deleted.
   */
  unavailable_at: string | null
}



Hide full sample

Styling
You can customise the component styles to match your brand. We support system fonts for font customisation.
You can customise any styles for a few different aspects of the component. The style customisation interface is below:
React


/**
 * An object where each key value pair is a style to be applied.
 * e.g. { 'background-image': 'red', 'color': '#000', 'margin-inline': '8px' }
 *
 * Note: If you rely on css variables these will not work as they are
 * defined on a stylesheet the component does not have access to.
 */
type StylesMap = Record<string, string>

export interface InteractiveElementStyles {
  default?: StylesMap
  hover?: StylesMap
  active?: StylesMap
  focus?: StylesMap
}

export interface DuffelCardFormStyles {
  input?: InteractiveElementStyles
  select?: InteractiveElementStyles
  label?: StylesMap
  inputErrorMessage?: StylesMap
  sectionTitle?: StylesMap
  layoutGrid?: StylesMap
}

3DSecure Session function
Card payments must be authenticated before authorisation of a payment can be given. In some circumstances, you will be required to perform that authentication, in the form of a 3D Secure (3DS) challenge, on behalf of the airline or accommodation provider.
You must call the create3DSecureSession function prior to attempting to pay with a customer card to minimise the risk of payment declines.
If the card does not require authentication then the create3DSecureSession function will instruct you to go straight to payment.
For more information on 3D Secure, please read the callout in the Pay with customer card guide.
This section will now guide you through how to present the 3D Secure challenge screen and handle the possible responses.
Example of a 3DSecure challenge
Example of a 3DSecure challenge

Use Cases
During an online payment checkout, the user may need to complete a challenge provided by their card issuer. You’ll use the createThreeDSecureSession to create and render the challenge.
The challenge flow starts on your checkout page and includes the following steps:
Step 1: Collect the customers card details
You need a valid card details to start this process. Collect card details from your user with the Card Form outlined above.
Step 2: Initiate 3DSecure Session
Calling the createThreeDSecureSession function initiates the following process with the cardholder’s issuing bank:
A request to the cardholder's issuing bank to authenticate a payment amount for a payment to a specific merchant.

The issuing bank might require fingerprinting of the cardholder's browser and requiring a verification challenge during checkout. The issuing bank determines the challenge flow, which usually involves the cardholder confirming the transaction using the method set up with their issuing bank (SMS, banking app, or email).

If the issuing bank deems a challenge is required, the function will inform you a challenge UI is required to be presented to the user.

Step 3: Present Authentication Challenge
The authentication challenge interface is rendered if required. Your user enters the code received from their card issuer.
Step 4: Handle 3DSecure Session result
The function output informs you whether the authentication was successful and you can proceed to payment with a 3DS Session ID.
Step 5: Make a payment
You proceed to creating the booking with the 3DS Session ID.
Caution

If you are collecting card details offline, for example an agent interface for entering card details received from the traveller over the phone, then you must specify the cardholder as not present when calling the createThreeDSecureSession function.
Integrating 3DSecure Session in your checkout page
This section outlines the actions required to integrate the process described above into your checkout page:
Step 2: Initiate 3DSecure Session
Using the createThreeDSecureSession function provided in @duffel/components.
To create the 3DS Session you will need a client key, resource information (i.e. its ID and any associated services), and a tokenised card ID you created using the [Card Form](link to section above).
If a 3DS challenge is required, the function will open a modal for the user to action the challenge.
Step 4: Handle 3DSecure Session result
The createThreeDSecureSession functions returns a promise which results in one of two states:
Authentication successful: The promise will resolve to a 3DS session object with the status ready_for_payment. The object will also include a three_d_secure_session_id which can then be used to pay for a booking.
Authentication failed: The promise will reject with an error or a 3DS session with a different status (the possible statuses can be found in the interface below). Any other status means the session is not ready for payment - either the user failed the challenge, or there was an error during the challenge, so the challenge should be retried. You can retry the authentication by calling the function again.
Step 5: Make a payment
To complete the users checkout and make the payment you pass the three_d_secure_session_id value in the payment object when creating an order, confirming an order change or paying for a hold order.
Function Interface
React


createThreeDSecureSession: (
      clientKey: string, // The client key used to authenticate with the Duffel API.
      cardId: string, // The card ID used for the 3DS session.
      resourceId: string, // The resource (offer, order, order change) ID that the 3DS session is for.
      services: Array<{ id: string; quantity: number }>, // Optional. Include all services that are being added, empty if no services are being added. This is required when services are also being purchased to ensure an accurate total amount to be authorised.
      cardholderPresent: boolean // Whether the cardholder was present when the 3DS session was created. If you are collecting card details offline, for example an agent interface for entering card details received from the traveller over the phone, then you must specify the cardholder as not present
    ) => Promise<ThreeDSecureSession>

interface ThreeDSecureSession {
  /**
   * The card ID used for the 3DS session.
   */
  id: string;

  /**
   * Whether the 3DS session was created in live mode. This field will be set to `true` if the card was created in live mode, or `false` if it was created in test mode.
   */
  live_mode: boolean;

  /**
   * The resource (offer, order, order change..) ID that the 3DS session is for.
   */
  resource_id: string;

  /**
   * Whether the cardholder was present when the 3DS session was created.
   */
  cardholder_present: boolean;

  /**
   * The status of the 3DS session.
   *  - `client_action_required` - The 3DS session requires the UI Component to be initailised. This is the initial state when the payment is eligible for SCA and requires a 3DS challenge.
   *  - `ready_for_payment` - The 3DS session is ready to be used on a payment object as part of a order creation/payment request. This is the initial state if the card or the supplier does not support 3DS.
   *  - `failed` - The 3DS session was not authenticated to proceed with the payment. Payment should not be attempted. Cardholder should try again, possibly with a different card. Additionally, this is the initial state if the cardholder details are invalid.
   *  - `expired` - The 3DS session has expired. A new session should be created if needed.
   */
  status: "client_action_required" | "ready_for_payment" | "expired" | "failed";

  /**
   * Used to initiate the UI component when `status` is `challenge_required`.
   */
  client_id: string | null;
}



Hide full sample

Example
In the below example, you can see how to use createThreeDSecureSession to get the three_d_secure_session_id required to create an order.
The prerequisites to working with this example are:
A component client key

A card ID

The resource ID you’d like to book, in this case an offer ID and its related services.

React


const clientKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiaWN1XzAwMDBBZ1ppdHBPblF0ZDNOUXhqd08iLCJvcmRlcl9pZCI6Im9yZF8wMDAwQUJkWm5nZ1NjdDdCb3JhVTFvIiwiaWF0IjoxNTE2MjM5MDIyfQ.GtJDKrfum7aLlNaXmUj-RtQIbx0-Opwjdid0fiJk6DE' // See the Client Key section above in the document
const cardId = 'tcd_00009hthhsUZ8W4LxQgkjb' // You can use the Duffel card component or API to get the card ID.
const offerId = 'off_0000AJyeTUCEoY5PhVPN8k_0'
const offerServices = [{id: 'ase_00009UhD4ongolulWAAA1A', quantity: 1}] // This can be bags or seats when booking flights

const threeDSecureSession = createThreeDSecureSession(
  clientKey,
  cardId,
  offerId,
  offerServices,
  true,
)
  .then(async (threeDSecureSession) => {
    if (threeDSecureSession.status === 'ready_for_payment') {
	    createOrder({
		    ... // plus passenger and other order creation information
        selected_offers: [offerId],
        services: offerServices,
        payments: [
          {
            type: 'card',
            currency: offerCurrency,
            amount: offerAmount,
            three_d_secure_session_id: threeDSecureSession.id,
          },
        ]})
    } else {
      console.warn('3DS session status is not ready_for_payment, please try again', {
        threeDSecureSession,
      });
    }
  })
  .catch((error) => {
    console.error('Error creating 3DS session', error);
  });



Hide full sample

You can also find an example covering this use case on Github →
Testing your integration
In test mode we provide test card details to trigger different outcomes. These test details can be found in our Paying with customer cards integration guide.

Ancillaries Component
About
The ancillaries component is a JavaScript component you can use to allow your customers to add ancillaries to their order. It's simple to add to your website and can be customised to fit your brand.
This guide explains how to integrate it, along with examples and sample code.
Logo for undefined
See it on GitHub →
You can find the source code and release notes for this component on GitHub.

Logo for undefined
See it on npm →
This component is available to be installed with npm.

Why sell ancillaries?
Ancillaries in air travel refer to additional products and services that airlines offer beyond the basic ticket price, for example seat selection or extra baggage.
Ancillaries have higher profit margins than the base ticket price, so selling them can increase your revenue and profit. Selling ancillaries also helps you provide more value to your customers, differentiating you from your competitors.
Our component makes it easy to apply a markup to the ancillaries you sell, so you can increase your revenue even further.
Live demo
Below is an interactive demo of the ancillaries component in a test environment.
View the source code for this demo on CodeSandbox »


Step-by-step guide
The following instructions are aimed at people using React, but the component can be used in any JavaScript environment with a few tweaks. To learn more, see Using the component in non-React environments.
For a working example of this setup, see the example in the repository.
1. Install the component
Shell (using yarn)


yarn

yarn add @duffel/components
⒉ Add the component to your page
The components expects a few properties: either an offer or offer ID, passengers, and an array of which ancillaries to display. For this example, we'll use the offer ID "fixture_off_1", which will tell the component to load a pre-made example offer. We'll also add debug={true} which enables debug mode, which will show you more information about what's happening in the component in your browser's console.
Other properties can be supplied too, but they aren't used in this guide. For a full list of all properties, see configuration options below.
React


import { DuffelAncillaries } from '@duffel/components'

const MyComponent = () => (
  <DuffelAncillaries
    debug={true}
    offer_id="fixture_off_1"
    services={['bags', 'seats', 'cancel_for_any_reason']}
    passengers={[
      {
        id: 'pas_0000AUde3KY1SptM6ABSfU',
        given_name: 'Mae',
        family_name: 'Jemison',
        gender: 'F',
        title: 'dr',
        born_on: '1956-10-17',
        email: 'm.jemison@nasa.gov',
        phone_number: '+16177562626',
      },
      {
        id: 'pas_0000AUde3KY1SptM6ABSfT',
        given_name: 'Dorothy',
        family_name: 'Green',
        gender: 'F',
        title: 'dr',
        born_on: '1942-10-17',
      },
    ]}
    onPayloadReady={console.log}
  />
)



Hide full sample

3. Handling selection
Every time a user selects ancillaries, the component emits an onPayloadReady event, which is an object containing two properties:
data: A JSON object matching the Duffel API's order creation payload schema that you can then use to create the order from your server.

metadata: An object with helpful information about the selected ancillaries, which can be used to enrich your price breakdown or order summary with the description and price of the selected ancillaries.

This event is emitted every time a user completes each separate ancillaries flow. For example, if the user selects additional baggage, then selects seats, the event will be sent twice. Because of this, you should only create the order once the user has indicated they're ready to place the order, for example by pressing a Book button in your booking flow.
React


<DuffelAncillaries
  debug={true}
  offer_id="fixture_off_1"
  services={["bags", "seats", "cancel_for_any_reason"]}
  passengers={[ ... ]}
  onPayloadReady={(data: CreateOrderPayload, metadata: OnPayloadReadyMetadata) => {
    /**
     * In a real environment, instead of logging the data, you'd post the payload
     * to your server so it can be used to
     * create an order with the Duffel API.
     *
     * For more information on creating orders, see
     * https://duffel.com/docs/guides/quick-start#creating-a-booking-using-the-selected-offer
     */
    console.log('Ancillaries selected. Order payload:', data)
    console.log('Ancillaries selected. Ancillary services chosen:', metadata)
  }}
/>

Using real data
By now you should have a working example of the ancillaries component, using a pre-made example offer. There are two ways you can make the component use real offers retrieved from the Duffel API.
Option A: Using an offer ID and client key
By passing in an offer ID, the component can use the Duffel API to retrieve information about the offer, like which ancillaries are available and the plane's seat maps. When using this method, you must include a client key for authentication. The client key is returned with a create offer request to the Duffel API.
React


<DuffelAncillaries
  debug={true}
  offer_id='offer_id_here'
  client_key='client_key_here'
  services={["bags", "seats", "cancel_for_any_reason"]}
  passengers={[ ... ]}
  onPayloadReady={console.log}
/>

Option B: Using a full offer
If you already have an offer object retrieved from a create offer request to the Duffel API, you can pass this into the component instead of an offer ID.
Because the component needs to know the seat maps of the plane, you have two options for supplying it. You can pass in a client key that was returned with your initial create offer request to the Duffel API, in which case the component will retrieve the seat maps using the Duffel API on your behalf, or if you've already retrieved the seat maps for this offer, you can pass it in yourself.
React


// Using a client key so that the component retrieves the seat map itself.

<DuffelAncillaries
  debug={true}
  services={['bags', 'seats', 'cancel_for_any_reason']}
  offer={ ... }
  client_key='client_key_here'
  passengers={[ ... ]}
/>

// You may include the seat map, so the component won't retrieve it.

<DuffelAncillaries
  debug={true}
  services={['bags', 'seats', 'cancel_for_any_reason']}
  offer={ ... }
  seat_maps={ ... }
  passengers={[ ... ]}
/>

Adding a markup
Duffel helps you make money from selling travel, and adding markups is one of the best tools you have to do this. The component offers two ways to add markups to the ancillaries you sell.
Note

Adding markup only changes the price that your users see when using the component. The price that you pay to Duffel for the ancillaries will not change, and it's your responsibility to charge your users accordingly.
The metadata object returned by the onPayloadReady event will include the ancillaries with the markup applied, so you can use this to calculate the price that you should charge your users.
Option A: Simple markup
Pass a markup object as a property when initialising the component, with a key for each ancillary you want to mark up. Each ancillary has an amount and a rate property. The amount property is a fixed amount to add to the price of each ancillary, and the rate property is a percentage to add to the price of each ancillary.
JavaScript


markup: {
  bags: {
    amount: 1, // Add 1.00 to the price of each bag
    rate: 0.01, // Also add 1% to the price of each bag
  },
  seats: {
    amount: 2, // Add 2.00 to the price of each seat
    rate: 0, // Don't add any percentage markup
  },
  cancel_for_any_reason: {
    amount: 0, // Don't add any amount markup
    rate: 0.25, // Add 25% to Cancel For Any Reason.
  },
}

When calculating prices, rate is applied first, followed by amount. For example, if a bag costs 10.00, and you have a markup of amount: 1 and rate: 0.1, the final price will be 12.00 (10 increased by 10% is 11, plus 1 to make 12).
Option B: Advanced markup
This is aimed at those who need more control over how the markup is calculated. For example, you might want to mark up some bags more than others. If you don't need this level of control, we recommend using the simpler markup option instead.
JavaScript


priceFormatters: {
  bags: (amount, currency, service) => {
    // If the bag costs less than $20, add a 20% markup.
    // Otherwise, add a 10% markup.
    const percentageMarkup = amount < 20 ? 0.2 : 0.1
    return { amount: amount * (1 + percentageMarkup) }
  }
}

You can also use this option to display prices in bespoke currencies, like loyalty scheme points. To do this, include a currency property in the object you return from the price formatter.
JavaScript


priceFormatters: {
  bags: (amount, currency, service) => {
    const moneyToPointsExchangeRate = 100 // $1.00 = 100 points
    return {
      amount: amount * moneyToPointsExchangeRate,
      currency: 'Duffel Points',
    }
  }
}

Using the component in non-React environments
If you're not using React, there are two methods you can use to add the component to your website.
Option A: Using npm or yarn
For a working example of this setup, see the example in the repository.
Install the component:
Shell (using yarn)


yarn

yarn add @duffel/components
Import it into your page:
JavaScript


import {
  onDuffelAncillariesPayloadReady,
  renderDuffelAncillariesCustomElement,
} from '@duffel/components'

Add it to the place on your page you want it to appear:
HTML


<duffel-ancillaries></duffel-ancillaries>

Finally, call renderDuffelAncillariesCustomElement to render it. The function accepts an object with the same properties as the React component, so see the React guide for more details.
JavaScript


window.onload = function () {
  renderDuffelAncillariesCustomElement({
    debug: true,
    offer_id: 'fixture_off_1',
    services: ['bags', 'seats', 'cancel_for_any_reason'],
    passengers: [ ... ]
}

A callback function can be passed to onDuffelAncillariesPayloadReady to receive the payload when the user selects ancillaries. This function executes every time a user completes each separate ancillaries flow. For example, if the user selects additional baggage, then selects seats, the event will be sent twice.
JavaScript


onDuffelAncillariesPayloadReady((data, metadata) => {
  /**
   * In a real environment, instead of logging the data, you'd post the payload
   * to your server so it can be used to
   * create an order with the Duffel API.
   *
   * For more information on creating orders, see
   * https://duffel.com/docs/guides/quick-start#creating-a-booking-using-the-selected-offer
   */
  console.log('Ancillaries selected. Order payload:', data)
  console.log('Ancillaries selected. Ancillary services chose:', metadata)
})

Option B: Using the Duffel CDN
For a working example of this setup, see the example in the repository.
Load the component by adding a script to your page's <head> element.
HTML


<!-- 
Replace <VERSION> with the version you want to use. See 
https://github.com/duffelhq/duffel-components/releases
for a list of versions.
-->
<script
  type="text/javascript"
  src="https://assets.duffel.com/components/ancillaries/<VERSION>/index.js"
></script>

Add it to the place on your page you want it to appear:
HTML


<duffel-ancillaries></duffel-ancillaries>

Finally, select the component on your page and call render to render it. The function accepts an object with the same properties as the React component, so see the React guide for more details.
JavaScript


window.onload = function () {
  document.querySelector('duffel-ancillaries').render({
    debug: true,
    offer_id: 'fixture_off_1',
    services: ['bags', 'seats', 'cancel_for_any_reason'],
    passengers: [ ... ],
  })
}

An event is emitted every time the user selects ancillaries, allowing you to receive the order creation payload. This event is emitted every time a user completes each separate ancillaries flow. For example, if the user selects additional baggage, then selects seats, the event will be sent twice.
JavaScript


document
  .querySelector('duffel-ancillaries')
  .addEventListener('onPayloadReady', (event) => {
    /**
     * In a real environment, instead of logging the data, you'd post the payload
     * to your server so it can be used to
     * create an order with the Duffel API.
     *
     * For more information on creating orders, see
     * https://duffel.com/docs/guides/quick-start#creating-a-booking-using-the-selected-offer
     */
    console.log('Ancillaries selected. Order payload:', event.detail.data)
    console.log(
      'Ancillaries selected. Ancillary services chose:',
      event.detail.metadata
    )
  })

Render options
All possible properties that can be included when initialising the component.
debug
Whether to print extra information about how the component is being set up to your browser's console. Defaults to false.
**Note: ** We advise setting this to true when you're first setting up the component, but to set it to false in production.
services
Which ancillaries to include when displaying the component. The possible values are bags, seats and cancel_for_any_reason, and you must include at least one ancillary.
client_key
A client key for authentication. This is returned under the attribute client_key with a create offer request to the Duffel API. This field is required if offer or seat_maps are not part of the configuration options.
offer
An offer retrieved from Duffel's API. You can pass in either this or offer_id, but not both.
offer_id
The ID of an offer retrieved from Duffel's API. You can pass in either this or offer, but not both. If you include offer_id, client_key is required.
seat_maps
A seat map from The Duffel API's get seat map endpoint. This is optional, but if you don't supply it you must supply client_key so that the component can retrieve the seat maps from the Duffel API itself.
passengers
An array of passengers. Below are some example passengers you can use.
JavaScript


passengers: [
  {
    id: 'pas_001',
    given_name: 'Mae',
    family_name: 'Jemison',
    gender: 'F',
    title: 'dr',
    born_on: '1956-10-17',
    email: 'm.jemison@nasa.gov',
    phone_number: '+16177562626',
  },
  {
    id: 'pas_002',
    given_name: 'Amelia',
    family_name: 'Earhart',
    gender: 'F',
    title: 'mrs',
    born_on: '1987-07-24',
    email: 'amelia@duffel.com',
    phone_number: '+442080160509',
  },
]

markup
An object that can be used to add markups to the ancillaries you sell. See the Adding a markup section for more details.
markup is an object with the following structure:
JavaScript


{
  // The service you want to add a markup to.
  // Possible values are 'bags', 'seats' and 'cancel_for_any_reason'.
  [service]: {

    // A fixed amount to add to the price of each ancillary, e.g. 1
    amount: number,

    // A percentage to add to the price of each ancillary, e.g. 0.1 for 10%
    rate: number,
  },
}

You cannot supply both markup and priceFormatters at the same time for the same service.
priceFormatters
An object that can be used to customise the prices displayed in the component. See the Adding a markup section for more details.
priceFormatters is an object with the following structure:
JavaScript


{
  // The service you want to add a markup to.
  // Possible values are 'bags', 'seats' and 'cancel_for_any_reason'.
  [service]: (amount, currency, service) => {

    // A function that takes the amount, currency and service as arguments
    // and returns an object with the following structure:

    return {

      // The new amount to display.
      amount: number,

      // The currency to display, e.g. "GBP", or "Points".
      // Currency is optional, and if not supplied the original currency will be used.
      // If currency is a valid ISO 4217 currency code, the amount will be formatted automatically.
      // For example, if currency is "GBP" and amount is 1.23, the amount will be formatted as "£1.23".
      currency: string,
    }
  },
}

You cannot supply both priceFormatters and markup at the same time for the same service.
styles
An object that can be used to make the component match your brand. It includes:
accentColor: A comma-separated string of RGB values to customise the component's UI, for example "34,139,34".

buttonCornerRadius: A string with the corner radius to apply to buttons, for example "8px".

fontFamily: A string with the name of the font family to use, for example "Menlo".

JavaScript


styles: {
  accentColor: "34,139,34",
  buttonCornerRadius: "8px",
  fontFamily: "Menlo, Courier, Monospace",
}

Margin and Markups
In business - and especially in travel - markup is a common method for making money. But how do margin and markup differ, what options are available, and how can you manage it with Duffel?
Markup is generally known as the amount a business adds to the cost of a product to make up the final selling price so they can make money.
Margin is generally known as the profit generated after accounting for costs.
Markup is shown as a percentage of costs while margin is shown as a percentage of revenue. These two terms usually get confused as they both have similar inputs: what the product sold for and the cost of the product.
Let's take an example to help clarify:
A flight sells for £100 and it costs the airline £70 - so the difference is £30.
Markup would be calculated as £30/£70 = 42.9%

Margin would be calculated as £30/£100 = 30%

Can I charge my customers a markup?
Yes, you can add a markup. You can choose to add a markup to flights and/or ancillaries such as seat selection and additional baggage.
It's a common pricing strategy to add a markup to cover your operating costs and make a profit.
You can learn more ways to make money selling flights by reading our blog post: How NDC helps travel sellers make money in 2022 .
How much can I mark up?
Adding a markup is completely in your control.
If you're using Duffel Payments, you can choose any amount as long as it covers the offer and services total amount, foreign exchange rate (if applicable), and Duffel Payments fee.
If you're using Duffel Balance, you have greater flexibility on the markup, as long as your balance has enough funds to cover the cost of the flight.
If the entire cost of the flight is greater than £5,000 you'll get a validation error. Read the Payment Intents documentation to learn more. To have this limit increased, please reach out to us.
You have the flexibility to choose markup based on your own pricing strategy. For example, you could add 3% on flights from Europe if that's your most popular region or 5% on ancillaries from easyJet if most of your passengers add extras to easyJet flights. You still pass the field amountto us that includes your own markup and covers the cost of the flight.
How do I add markup?
Can my customer see the markup? How do I add markup so the customer only sees one price?
If you're integrating Duffel into your own app or website, you have control over exactly what the customer sees, so you can choose to show them whatever price you want. That could be the price that Duffel is charging you, more, or less.
Remember, some customers are more price sensitive than others and will go directly to the airline's website or use a price comparison tool when researching flights. Also note, if the customer books their flight with you but goes to the airline website to confirm their flight details with their booking reference number, they will see the price excluding markup.
When you build your integration, you also need to build tools to control what markups are applied and when for example setting rules to determine when markup is applied or forecasting prices based on different scenarios to optimise your markup. We don't offer tools for this today.
Adding markup in the test order environment
Check out our Collecting Customer Card Payments guide that walks through collecting customer payments including adding a markup:
Partial screenshot of the Duffel documentation showing the "collecting customer card payments" guide
Partial screenshot of the Duffel documentation showing the "collecting customer card payments" guide

Once you're ready, you can move this over to the live environment.
Adding a markup in the Dashboard
Currently, we do not provide the ability for agents to markup fares in our Dashboard. You must integrate with the API to add markup.
How do I calculate the amount to charge my customer to account for Duffel Payment fees and currency conversion?
To calculate the amount you need to charge your customer to cover the price of an offer plus any markup, you can use this calculation:
((offer and services total_amount + markup) × foreign exchange rate) / (1 - Duffel Payments fee)
Offer and services total amount: this is the total cost of the flight plus any extra services without Duffel fees. We always present the offer and service(s) total_amount in your settlement currency.
Markup: This is the amount on top of the flight cost that you might charge your customer to cover operational costs and any profits you want to make on the sale of the flight.
Foreign exchange rate: The foreign exchange rate would be the mid-market exchange for the day you charge your customer.
You should use an external source to get this rate (for example, https://fixer.io/).
If using Duffel Payments:
Duffel applies a 2% interchange fee on transactions through Duffel Payments. You should include this in the amount you charge your customer.

To determine the correct rate you should add a 2% markup on top of your foreign exchange rate in order to cover Duffel Payments FX fee (fx rate x 1.02).

We recommend that you add slightly more than 2% to account for the fact the FX you use might be slightly different from the one used by Duffel.

Duffel Payment fee: fee is determined based on the card country. It varies if the card is considered domestic or international, an example would be 2.9% or 0.029.
When rounding is required you should round half away from zero.
Example:
Your balance currency is Euros (EUR), and your customer wants to pay for a flight in Great British Pounds (GBP), the foreign exchange rate between these two currencies is 0.85, they want to book a flight that costs €120.00 in total, you want to charge them €1.00 for your booking service, and the Duffel Payments fee is 2.9%. The amount would be calculated as follows ((€120.00 + €1.00) x 0.85) / (1 - 0.029) ~= £105.92.
Diagram illustrating the flow of money from the customer into the Duffel platform and your organisation balance
Diagram illustrating the flow of money from the customer into the Duffel platform and your organisation balance

On average how much do travel sellers mark up flights?
Unfortunately, there isn't a one-size-fits-all when it comes to markup as it varies based on a multitude of factors. Here are a few examples:
Domestic/international flights

Time of year

How far away the flight is from booking

Competitors' prices

If you bundle other offerings such as accommodation, experiences, land transport, travel insurance, etc., you'll have more room to play around with the markup on flights as well as your other products.
Although we can't advise a specific percentage that works for everyone, you could expect on average a range between 2-6%. As you explore your integration further with Duffel, we'd be happy to have more conversations around markup.
Can I charge my customers a markup?
How much can I mark up?
How do I add markup?
How do I calculate the amount to charge my customer to account for Duffel Payment fees and currency conversion?
On average how much do travel sellers mark up flights?
Handling Flight Booking Confirmation Emails
After a flight booking is complete, your customers expect to receive a confirmation showing the order has gone through correctly and summarising the details of their flight. But what is your responsibility as a travel seller and what is the responsibility of the airline or tech provider?
We summarise common questions related to order confirmations in this resource.
What communication about orders do I need to send customers?
An order (sometimes referred to as a booking) confirmation

Notification about any changes

Do I need to the send the order confirmation to my customers?
Yes. When you book flights through Duffel, it's your responsibility to send a booking confirmation (usually by email) to the customer.
Duffel will never contact your customer directly, and most airlines on Duffel do not send a confirmation themselves either, so it's in your hands. Providing the right information can help reduce the amount of support calls you’ll receive from customers and can greatly improve their day of travel experience.
A small number of airlines, mostly Low-Cost Carriers (LCCs), may also send the passenger their own booking confirmation with the itinerary, and sometimes the price paid for their booking.
Which airlines send booking confirmations?*
Easyjet

Iberia

Singapore Airlines

United

We recommend that you manage your customer's experience and always send a booking confirmation as this list is not exhaustive and in some scenarios these airlines may not send out booking confirmations.
*List of airlines updated on 13th June 2022.
Why do you need an email address and phone number if you don’t send the confirmation?
When you book flights through Duffel, we require an email address and phone number for each of the passengers.
We pass this information to the airline so they can send customers operational notifications related to their flights, for example, if there is a schedule change or a flight is disrupted by bad weather.
Airline industry rules explicitly state that airlines must not use passengers' contact details for sales & marketing purposes, for example, for advertising extra products. Despite these rules, you might find that on rare occasions, airlines still send these kinds of communications.
What should I include in the booking confirmation email?
In the confirmation, you should include information about the itinerary, payment details, and booking reference, which the passenger will use to check in.
Our Flights API includes all of the details you need to send in that email. Below is an example booking confirmation email overlaid with all the key data you need to convey to your customer.
Booking confirmation including data description tooltips
Booking confirmation including data description tooltips

How do I send a order confirmation?
Based on the mockup above, you can take the data and create an email template that pulls this information in from your backend. You can then confirm your event name that will trigger the email to your user (e.g. order_confirmed, booking_completed).
Most travel sellers use an email provider to send transactional and/or marketing emails to their customers to comply with regulations and keep up-to-date records for their customers. Emails are generally created in HTML. You can code an email from scratch in-house or explore the web for examples to use. Some email providers also supply easy-to-use templates. A few examples of email platforms you may have heard of include Mailchimp, SendGrid, Sendinblue and Hubspot — but there are many more.
Once the email is set up with the custom data parameters inserted, you should test that it shows accurate information before using it with live orders. Once it’s live, your customers will receive an email that looks like the example above as soon as a booking has been completed.
Where do I go if I can’t find certain information?
There are 3 places you can go to find information on a customer’s flight:
The airline website/app for you or your customers

The Duffel Dashboard for Managed Content users

The NDC portal for BYO Content users

Airline website/app
For the airline associated with the booking, download the app or log in online using the booking reference number and last name to access the flight details.
You can also have your customers do this step themselves so they can easily reference their booking information at any time.
Partial screenshot of the Air Canada order booking page
Partial screenshot of the Air Canada order booking page

Duffel Dashboard
For users on Managed Content, log in to the Dashboard and view ‘Orders’ to see flight details.
Partial screenshot of the Duffel dashboard order page
Partial screenshot of the Duffel dashboard order page

NDC Portal
For users on self-managed / BYO content, check the booking in the relevant NDC portal to access flight details.
Partial screenshot of the NDC portal
Partial screenshot of the NDC portal

What communication about orders do I need to send customers?
Do I need to the send the order confirmation to my customers?
Which airlines send booking confirmations?\*
Why do you need an email address and phone number if you don’t send the confirmation?
What should I include in the booking confirmation email?
How do I send a order confirmation?
Where do I go if I can’t find certain information?

Getting Started with the Dashboard
Step 1
Follow the step-by-step interactive tutorial.
After you sign up, a pop-up will appear that takes you through our Quick start tutorial to get you familiar with our Flights API.
Partial screenshot of onboarding onto the Duffel dashboard
Partial screenshot of onboarding onto the Duffel dashboard

See how you can make offer requests, select an offer, collect payments (in countries that support Duffel Payments), and create the order.
Partial screenshot of the order creation tutorial on the Duffel dashboard
Partial screenshot of the order creation tutorial on the Duffel dashboard

Step 2
Explore the Home screen.
From here, you have a variety of activities and tabs you can explore to get your travel business up and running.
To learn how to build and test your integration in our Flights API, you can head to our Quick Start guide .
Partial screenshot of the Duffel dashboard home screen
Partial screenshot of the Duffel dashboard home screen

Orders
Orders is where you can access a history of all your bookings — confirmed, cancelled, changed, or pending.
When you select an order, you can view the booking reference number, journey information passenger details, and billing summary. This is also where you can make changes, cancel an order, and, if the airline has changed that order, view those changes and either change, accept, or cancel the new itinerary.
Partial screenshot of the Duffel dashboard orders page
Partial screenshot of the Duffel dashboard orders page

Balance
Balance displays the current amount of available funds you can use to make orders.
You can also complete a balance top-up, request a payout, or view a list of transactions by date range.
Partial screenshot of the Duffel dashboard balance page
Partial screenshot of the Duffel dashboard balance page

Airlines
Airlines includes the complete list of airlines live with Duffel and highlights the ancillaries and type of content available.
You can also choose to filter based on region, alliance, or features like adding additional bags when booking.
Partial screenshot of the Duffel dashboard airlines page
Partial screenshot of the Duffel dashboard airlines page

Some airlines will require additional information to before you can access them. See further details on those next steps in the To learn how to build and test your integration in our Flights API, you can head to our Sources section of our Help Centre.
Access tokens
Here you can receive access tokens for test mode and live mode.
Test token
To use test mode, you'll need to create a test access token.
In the Dashboard, make sure that you're in ’test mode’ and create a token. Test tokens are easy to recognise: they start with duffel_test_.
With a testing access token, you'll only be able to access resources created in test mode.
Partial screenshot of the Duffel dashboard token page
Partial screenshot of the Duffel dashboard token page

Live token
Once you’ve activated your account (see Step 5), live tokens will be enabled. You'll need to create a live access token to use live mode. With a live access token, you'll only be able to access resources created in live mode.
You also need a live access token to include in every request you make to the API. When you create an access token, you'll be able to choose whether to give it read-only or read-write access. Learn more in our docs on making requests.
Partial screenshot of the Duffel dashboard tokens list page
Partial screenshot of the Duffel dashboard tokens list page

Step 3
Customise your account.
Start by adding your team name. You can change any time in Team settings → Preferences.
Partial screenshot of the Duffel dashboard organisation preferences
Partial screenshot of the Duffel dashboard organisation preferences

You can also create separate teams if you have different geographies, currencies, or business types.
Partial screenshot of the Duffel dashboard create new team page
Partial screenshot of the Duffel dashboard create new team page

Step 4
Invite teammates to your account.
You can select their team role to apply different settings. Go to Team settings → Team members to add teammates. They will get an email invite to confirm sign up.
Partial screenshot of the Duffel dashboard invite team member page
Partial screenshot of the Duffel dashboard invite team member page

Step 5
Activate your account.
Complete these two steps in order to get access to Live Mode.
You can choose to save and finish some details later if needed.
Email
First, verify your email address.
Partial screenshot of receiving a confirmation email from Duffel
Partial screenshot of receiving a confirmation email from Duffel

Verification
Second, complete the verification process.
Tell us your type of business

Verify your personal details

Share information about the business

Verify information for Know Your Customer (KYC) purposes

Duffel dashboard activation page for organisation in countries where Duffel Payments is not supported
Duffel dashboard activation page for organisation in countries where Duffel Payments is not supported

Duffel KYC step with Stripe for organisations in countries where Duffel Payments is supported
Duffel KYC step with Stripe for organisations in countries where Duffel Payments is supported

Why do I have to give this information?
This information relates to industry regulations called ‘Know Your Customer’ (KYC).
KYC obligations are set by regulators to prevent abuse of the financial system. They ensure businesses that accept and pay out funds collect and maintain information on all their users. Every country has its own requirements that users must meet.
Typically these requirements revolve around:
Collecting information about the individual and business

Verifying information to establish that we know who our customers are

Step 6
Choose how to collect payments and go live with your integration.
You’ve now unlocked Live Mode. If Duffel Payments is your preferred method for charging your customers, you can start integrating and accepting payments directly. Check out our Collecting Customer Card Payments guide to get set up in a matter of minutes.
Partial screenshot of the Duffel dashboard activation page
Partial screenshot of the Duffel dashboard activation page

If you choose not to integrate with our Payments API, you can top up the Balance and just utilise the Flights API.
At this point, you’ve now completed your Flights API integration and Payments API integration. This means you are ready to make your first real request to airlines - you just need to create and use a live token.
Step 7
Explore the other tabs in Settings.
My Account Preferences
Here you can change your name or email and can update your password.
Partial screenshot of the Duffel dashboard settings page
Partial screenshot of the Duffel dashboard settings page

Balance
Determine a low balance threshold to receive notifications so you top up your balance on time to continue to make orders with your account.
You may want to start with a low amount at first and can come back to this section once you're making live orders to better determine which amount works for your business.
Partial screenshot of the Duffel dashboard settings balance page
Partial screenshot of the Duffel dashboard settings balance page

Billing
In Billing, you can see the plan you are on and set up automatic credit card payments to pay your monthly invoice.
Partial screenshot of the Duffel dashboard billing page
Partial screenshot of the Duffel dashboard billing page

Step 8
Know where to find help.
For help with common questions around pricing, APIs, your Duffel Balance, Duffel Payments and more, search our Help Centre.
Partial screenshot of the Duffel help centre
Partial screenshot of the Duffel help centre

For help with all your post-ticket servicing needs, we have a dedicated Travel Ops team available for support. They can assist with managing your bookings or issuing refunds for changes you need to make on behalf of your customers. You can reach support via email help@duffel.com.