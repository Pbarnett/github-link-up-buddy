# Amadeus API Reference Documentation

This document provides comprehensive API reference for Amadeus integration.

# Amadeus API Reference Documentation

> **Purpose**: This file serves as a comprehensive reference for the Amadeus API integration in Parker Flight. Copy and paste your Amadeus API documentation, examples, and important details here for easy AI assistant reference.

## Table of Contents
- [Quick Reference](#quick-reference)
- [Authentication](#authentication)
- [Core Endpoints](#core-endpoints)
- [Data Models](#data-models)
- [Flight Search](#flight-search)
- [Flight Booking](#flight-booking)
- [Airport & City Codes](#airport--city-codes)
- [Error Handling](#error-handling)
- [Rate Limits & Quotas](#rate-limits--quotas)
- [Testing & Sandbox](#testing--sandbox)
- [Code Examples](#code-examples)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Quick Reference

### Base URLs
```
Test Environment: https://test.api.amadeus.com
Production: https://api.amadeus.com
```

### Key Endpoints
- **OAuth Token**: `POST /v1/security/oauth2/token`
- **Flight Search**: `GET /v2/shopping/flight-offers`
- **Flight Price**: `POST /v1/shopping/flight-offers/pricing`
- **Flight Create Order**: `POST /v1/booking/flight-orders`
- **Flight Booking**: `POST /v1/booking/flight-orders`

### Authentication Flow
```
1. Get Access Token → 2. Use Token in API Calls → 3. Refresh when expired
```

*[Paste your Amadeus quick reference info here]*

---

## Authentication

### OAuth 2.0 Client Credentials
```http
POST /v1/security/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET
```

### Access Token Response
```json
{
  "type": "amadeusOAuth2Token",
  "username": "your_username",
  "application_name": "your_app_name",
  "client_id": "your_client_id",
  "token_type": "Bearer",
  "access_token": "2YotnFZFEjr1zCsicMWpAA",
  "expires_in": 1799,
  "state": "xyz",
  "scope": ""
}
```

### Request Headers
```http
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

*[Paste your Amadeus authentication details here]*

---

## Core Endpoints

### 1. Flight Offers Search
```http
GET /v2/shopping/flight-offers
```

**Parameters:**
- `originLocationCode` (required): IATA code of origin
- `destinationLocationCode` (required): IATA code of destination  
- `departureDate` (required): YYYY-MM-DD format
- `returnDate` (optional): YYYY-MM-DD format for round trips
- `adults` (required): Number of adult passengers (1-9)
- `children` (optional): Number of child passengers (0-9)
- `infants` (optional): Number of infant passengers (0-9)
- `travelClass` (optional): ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
- `currencyCode` (optional): ISO currency code
- `max` (optional): Maximum number of results (1-250)

*[Paste your flight search documentation here]*

### 2. Flight Offers Pricing
```http
POST /v1/shopping/flight-offers/pricing
```

*[Paste your flight pricing documentation here]*

### 3. Flight Order Creation
```http
POST /v1/booking/flight-orders
```

*[Paste your flight booking documentation here]*

### 4. Airport/City Search
```http
GET /v1/reference-data/locations
```

*[Paste your location search documentation here]*

---

## Data Models

### Flight Offer Schema
```json
{
  "type": "flight-offer",
  "id": "1",
  "source": "GDS",
  "instantTicketingRequired": false,
  "nonHomogeneous": false,
  "oneWay": false,
  "lastTicketingDate": "2021-03-01",
  "numberOfBookableSeats": 7,
  "itineraries": [
    {
      "duration": "PT2H10M",
      "segments": [
        {
          "departure": {
            "iataCode": "JFK",
            "terminal": "4",
            "at": "2021-03-01T14:15:00"
          },
          "arrival": {
            "iataCode": "ATL",
            "terminal": "S",
            "at": "2021-03-01T17:25:00"
          },
          "carrierCode": "DL",
          "number": "1234",
          "aircraft": {
            "code": "321"
          },
          "operating": {
            "carrierCode": "DL"
          },
          "duration": "PT2H10M",
          "id": "1",
          "numberOfStops": 0,
          "blacklistedInEU": false
        }
      ]
    }
  ],
  "price": {
    "currency": "USD",
    "total": "284.84",
    "base": "250.00",
    "fees": [
      {
        "amount": "0.00",
        "type": "SUPPLIER"
      },
      {
        "amount": "0.00",
        "type": "TICKETING"
      }
    ],
    "grandTotal": "284.84"
  },
  "pricingOptions": {
    "fareType": [
      "PUBLISHED"
    ],
    "includedCheckedBagsOnly": true
  },
  "validatingAirlineCodes": [
    "DL"
  ],
  "travelerPricings": [
    {
      "travelerId": "1",
      "fareOption": "STANDARD",
      "travelerType": "ADULT",
      "price": {
        "currency": "USD",
        "total": "284.84",
        "base": "250.00"
      },
      "fareDetailsBySegment": [
        {
          "segmentId": "1",
          "cabin": "ECONOMY",
          "fareBasis": "ULOWDN",
          "class": "U",
          "includedCheckedBags": {
            "quantity": 1
          }
        }
      ]
    }
  ]
}
```

*[Paste your complete Amadeus data models here]*

### Traveler Schema
*[Paste your traveler schema here]*

### Pricing Schema
*[Paste your pricing schema here]*

---

## Flight Search

### Basic Search Request
```http
GET /v2/shopping/flight-offers?originLocationCode=NYC&destinationLocationCode=MAD&departureDate=2021-11-01&adults=1
```

### Round Trip Search
```http
GET /v2/shopping/flight-offers?originLocationCode=SYD&destinationLocationCode=BKK&departureDate=2021-11-01&returnDate=2021-11-08&adults=1&children=1&travelClass=BUSINESS&currencyCode=USD&max=50
```

### Multi-City Search
*[Paste your multi-city search documentation here]*

### Search Response Format
*[Paste your search response documentation here]*

---

## Flight Booking

### Pricing Confirmation
Before booking, confirm the price:
```http
POST /v1/shopping/flight-offers/pricing
```

### Flight Order Creation
```http
POST /v1/booking/flight-orders
```

### Booking Request Schema
```json
{
  "data": {
    "type": "flight-order",
    "flightOffers": [
      {
        // ... flight offer from search results
      }
    ],
    "travelers": [
      {
        "id": "1",
        "dateOfBirth": "1982-01-16",
        "name": {
          "firstName": "JORGE",
          "lastName": "GONZALES"
        },
        "gender": "MALE",
        "contact": {
          "emailAddress": "jorge.gonzales@amadeus.com",
          "phones": [
            {
              "deviceType": "MOBILE",
              "countryCallingCode": "34",
              "number": "480080076"
            }
          ]
        },
        "documents": [
          {
            "documentType": "PASSPORT",
            "birthPlace": "Madrid",
            "issuanceLocation": "Madrid",
            "issuanceDate": "2015-04-14",
            "number": "00000000",
            "expiryDate": "2025-04-14",
            "issuanceCountry": "ES",
            "validityCountry": "ES",
            "nationality": "ES",
            "holder": true
          }
        ]
      }
    ]
  }
}
```

*[Paste your complete booking documentation here]*

---

## Airport & City Codes

### Location Search
```http
GET /v1/reference-data/locations?subType=AIRPORT,CITY&keyword=paris
```

### Response Format
```json
{
  "meta": {
    "count": 8,
    "links": {
      "self": "https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT%2CCITY&keyword=paris"
    }
  },
  "data": [
    {
      "type": "location",
      "subType": "CITY",
      "name": "PARIS",
      "detailedName": "PARIS/FR",
      "id": "CPAR",
      "self": {
        "href": "https://test.api.amadeus.com/v1/reference-data/locations/CPAR",
        "methods": [
          "GET"
        ]
      },
      "timeZoneOffset": "+02:00",
      "iataCode": "PAR",
      "geoCode": {
        "latitude": 48.85341,
        "longitude": 2.3488
      },
      "address": {
        "cityName": "PARIS",
        "countryName": "FRANCE",
        "countryCode": "FR",
        "regionCode": "EUROP"
      },
      "analytics": {
        "travelers": {
          "score": 96
        }
      }
    }
  ]
}
```

*[Paste your location data documentation here]*

---

## Error Handling

### Error Response Format
```json
{
  "errors": [
    {
      "status": 400,
      "code": 477,
      "title": "INVALID FORMAT",
      "detail": "invalid query parameter format",
      "source": {
        "parameter": "departureDate",
        "example": "2017-12-25"
      }
    }
  ]
}
```

### Common Error Codes
- **400**: Bad Request - Invalid parameters
- **401**: Unauthorized - Invalid or expired token
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource not found
- **429**: Too Many Requests - Rate limit exceeded
- **500**: Internal Server Error - Amadeus service issue

### Error Categories
- **Client Errors (4xx)**: Fix request parameters
- **Server Errors (5xx)**: Retry with backoff
- **Rate Limits (429)**: Implement rate limiting

*[Paste your error handling documentation here]*

---

## Rate Limits & Quotas

### API Quotas
- **Test Environment**: 
  - Flight Offers Search: 2,000 calls/month
  - Flight Booking: 10 bookings/month
  
- **Production Environment**:
  - Varies by subscription tier
  - Contact Amadeus for production quotas

### Rate Limiting
- **Requests per second**: Varies by endpoint
- **Concurrent requests**: Limited per API key
- **Best practices**: Implement exponential backoff

*[Paste your rate limiting documentation here]*

---

## Testing & Sandbox

### Test Environment
- **URL**: https://test.api.amadeus.com
- **Test Bookings**: Use test credentials only
- **Test Cards**: Specific test card numbers required

### Test Data
```javascript
const testData = {
  routes: {
    domestic: { origin: 'JFK', destination: 'LAX' },
    international: { origin: 'NYC', destination: 'LON' },
    europe: { origin: 'CDG', destination: 'MAD' }
  },
  dates: {
    future: '2024-12-01',
    returnDate: '2024-12-08'
  },
  passengers: {
    adult: 1,
    child: 0,
    infant: 0
  }
};
```

*[Paste your testing documentation here]*

---

## Code Examples

### Complete Booking Flow
```javascript
// 1. Get access token
const auth = await amadeus.auth();

// 2. Search for flights
const flightOffers = await amadeus.shopping.flightOffers.get({
  originLocationCode: 'JFK',
  destinationLocationCode: 'LAX',
  departureDate: '2024-12-01',
  adults: 1
});

// 3. Price the offer
const pricing = await amadeus.shopping.flightOffers.pricing.post(
  JSON.stringify({
    'data': {
      'type': 'flight-offers-pricing',
      'flightOffers': [flightOffers.data[0]]
    }
  })
);

// 4. Create the booking
const booking = await amadeus.booking.flightOrders.post(
  JSON.stringify({
    'data': {
      'type': 'flight-order',
      'flightOffers': [pricing.data.flightOffers[0]],
      'travelers': [
        {
          'id': '1',
          'dateOfBirth': '1990-01-01',
          'name': {
            'firstName': 'JOHN',
            'lastName': 'DOE'
          },
          'gender': 'MALE',
          'contact': {
            'emailAddress': 'john.doe@example.com',
            'phones': [{
              'deviceType': 'MOBILE',
              'countryCallingCode': '1',
              'number': '1234567890'
            }]
          }
        }
      ]
    }
  })
);
```

*[Paste your code examples here]*

---

## Best Practices

### Performance Optimization
1. **Cache access tokens** until expiration
2. **Implement request pooling** for concurrent searches
3. **Use appropriate timeouts** for API calls
4. **Compress requests** when possible

### Error Handling
1. **Retry on 5xx errors** with exponential backoff
2. **Handle rate limits** gracefully
3. **Validate inputs** before API calls
4. **Log errors** for debugging

### Security
1. **Store credentials securely** in environment variables
2. **Use HTTPS** for all API calls
3. **Validate API responses** for security
4. **Implement request signing** if available

*[Paste your best practices here]*

---

## Troubleshooting

### Common Issues
1. **Token Expiration**: Access tokens expire in ~30 minutes
2. **Invalid IATA Codes**: Use 3-letter airport codes
3. **Date Format**: Use YYYY-MM-DD format
4. **Passenger Count**: Must match pricing request
5. **Currency Codes**: Use ISO 4217 currency codes

### Debug Checklist
- [ ] Valid access token
- [ ] Correct API endpoint URL
- [ ] Proper request headers
- [ ] Valid IATA airport codes
- [ ] Correct date formats
- [ ] Matching passenger counts
- [ ] Valid traveler information

### Support Resources
- **Documentation**: https://developers.amadeus.com
- **Support Portal**: https://developers.amadeus.com/support
- **Community**: https://developers.amadeus.com/community

*[Paste your troubleshooting info here]*

---

## Integration Notes

### Current Usage in Parker Flight
- **Primary provider** for flight search
- **Search functionality** implemented
- **Booking workflow** established
- **Auto-booking system** integrated

### Integration with Duffel
- **Search**: Continue using Amadeus for comprehensive search
- **Booking**: Migrate to Duffel for better booking experience
- **Fallback**: Keep Amadeus as fallback booking provider

---

## Notes for AI Assistant

**When working with Amadeus integration:**
1. Always get fresh access token before API calls
2. Handle token expiration gracefully
3. Implement proper rate limiting
4. Use exact IATA codes from location search
5. Follow traveler data validation strictly
6. Cache search results appropriately
7. Handle multi-step booking flow correctly

**File Location**: `docs/AMADEUS_API.md`  
**Last Updated**: 2025-06-25  
**Maintained By**: Development Team

---

*[Continue pasting your complete Amadeus API documentation below this line...]*


Flights
The Flights category contains a wide array of APIs that can help you manage flights, from searching for flight options to actually booking a flight.

APIs	Description
Flight booking	
Flight Offers Search	Lets you can search flights between two cities, perform multi-city searches for longer itineraries and access one-way combinable fares to offer the cheapest options possible.
Flight Offers Price	Confirms the availability and final price (including taxes and fees) of flights returned by the Flight Offers Search API.
Flight Create Orders	Provides a unique booking ID and reservation details once the reservation is completed.
Flight Order Management	Checks the latest status of a reservation, shows post-booking modifications like ticket information or form of payment and lets you cancel reservations.
Seatmap Display	Shows airplane cabin plan from a Flight Offer in order for the traveler to be able to choose their seat during the flight booking flow.
Branded Fares Upsell	Provides the branded fares available for a given flight, along with pricing and a fare description.
Flight Price Analysis	Uses an Artificial Intelligence algorithm trained on Amadeus historical flight booking data to show how current flight prices compare to historical fares and whether the price of a flight is below or above average.
Flight Choice Prediction	Uses Artificial Intelligence and Amadeus historical flight booking data to identify which flights in search results are most likely to be booked.
Flight inspiration	
Flight Inspiration Search	Provides a list of destinations from a given city that is ordered by price and can be filtered by departure date or maximum price.
Flight Cheapest Date Search	Provides a list of flight options with dates and prices, and allows you to order by price, departure date or duration.
Flight Availabilities Search	Provides a list of flights with seats for sale on a given itinerary and the quantity of seats available in different fare classes.
Travel Recommendations	Uses Artificial Intelligence trained on Amadeus historical flight search data to determine which destinations are also popular among travelers with similar profiles, and provides a list of recommended destinations with name, IATA code, coordinates and similarity score.
Flight schedule	
On Demand Flight Status	Provides real-time flight schedule data including up-to-date departure and arrival times, terminal and gate information, flight duration and real-time delay status. Help travelers track the live status of their flight and enjoy a stress-free trip.
Flight Delay Prediction	Provides delay probabilities for four possible delay lengths
Airport	
Airport & City Search	Finds airports and cities that match a specific word or a string of letters.
Airport Nearest Relevant	Provides a list of commercial airports within a 500km (311mi) radius of a given point that are ordered by relevance, which considers their distance from the starting point and their yearly flight traffic.
Airport Routes API	Finds all destinations served by a given airport.
Airport On-Time Performance	Predicts an airport's overall performance based on the delay of all flights during a day.
Airlines	
Flight Check-in Links	Simplifies the check-in process by providing direct links to the airline check-in page.
Airline Code Lookup	Finds the name of an airline by its IATA or ICAO airline codes.
Airline Routes	Finds all destinations served by a given airline.
Search flights
Search to get flight inspirations
The Flight Inspiration Search API provides a list of destinations from a given airport that is searched by the IATA code of the origin, ordered by price and filtered by departure date, one-way/round-trip, trip duration, connecting flights or maximum price.

Information

The Flight Inspiration Search API uses dynamic cache data. This cache data is created daily based on the most trending options that are derived from past searches and bookings. In this way, only the most trending options are included in the response.

The only mandatory query parameter is the IATA code of the origin as in the following example request that retrieves a list of destinations from Boston:


GET https://test.api.amadeus.com/v1/shopping/flight-destinations?origin=BOS
The departure date is an optional parameter, which needs to be provided in the YYYY-MM-DD format:


GET https://test.api.amadeus.com/v1/shopping/flight-destinations?origin=BOS&departureDate=2022-12-12
If the oneWay parameter set to true, only one way flight options will be provided in the response. Alternatively, if the oneWay parameter set to false, the search results will show round-trip flights. Otherwise, both flight options will be included in the results. For example, the following request shows one-way flights out of Boston:


GET https://test.api.amadeus.com/v1/shopping/flight-destinations?origin=BOS&oneWay=true
One-way journeys can be optionally refined by the journey duration provided in days with the duration parameter:


GET https://test.api.amadeus.com/v1/shopping/flight-destinations?origin=BOS&oneWay=true&duration=2
The nonStop parameter filters the search query to direct flights only:


GET https://test.api.amadeus.com/v1/shopping/flight-destinations?origin=BOS&nonStop=true
If you need to cap the maximum ticket price, just specify the maximum price in decimals using the maxPrice parameter:


GET https://test.api.amadeus.com/v1/shopping/flight-destinations?origin=BOS&maxPrice=100
Information

This API returns cached prices. Once a destination is chosen, use the Flight Offers Search API to get real-time pricing and availability.

The API provides a link to the Flight Offers Search API to search for flights once a destination is chosen and a link to the Flight Cheapest Date Search API to check the cheapest dates to fly:


"data": [
        {
            "type": "flight-destination",
            "origin": "BOS",
            "destination": "CHI",
            "departureDate": "2022-07-22",
            "returnDate": "2022-07-28",
            "price": {
                "total": "52.18"
            },
            "links": {
                "flightDates": "https://test.api.amadeus.com/v1/shopping/flight-dates?origin=BOS&destination=CHI&departureDate=2022-07-02,2022-12-28&oneWay=false&duration=1,15&nonStop=false&maxPrice=300&currency=USD&viewBy=DURATION",
                "flightOffers": "https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=BOS&destinationLocationCode=CHI&departureDate=2022-07-22&returnDate=2022-07-28&adults=1&nonStop=false&maxPrice=300&currency=USD"
            }
        }
    ]
Search for destinations for a specific duration of stay
For example, let's say a traveler wants to spend six days in a city but doesn't have a strong preference for the destination. With the Flight Inspiration Search API we can recommend the traveler the cheapest destinations based on the stay duration. 

This can be done using the parameter viewBy which returns flight destinations by DATE, DESTINATION, DURATION, WEEK, or COUNTRY. In our scenario we need to pass the value DURATION to the parameter viewBy, like in the example below. Also, as input we give a duration of six days and origin Miami. The departure date will be between the 1st and 3rd of September 2021.

GET https://test.api.amadeus.com/v1/shopping/flight-destinations?departureDate=2021-09-01,2021-09-03&duration=6&origin=MIA&viewBy=DURATION


  {
            "type": "flight-destination",
            "origin": "MIA",
            "destination": "MSP",
            "departureDate": "2021-09-01",
            "returnDate": "2021-09-07",
            "price": {
                "total": "136.79"
            },
            "links": {
                "flightDates": "https://test.api.amadeus.com/v1/shopping/flight-dates?origin=MIA&destination=MSP&departureDate=2021-09-01,2021-09-03&oneWay=false&duration=6&nonStop=false&viewBy=DURATION",
                "flightOffers": "https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=MIA&destinationLocationCode=MSP&departureDate=2021-09-01&returnDate=2021-09-07&adults=1&nonStop=false"
            }
        },
        {
            "type": "flight-destination",
            "origin": "MIA",
            "destination": "STT",
            "departureDate": "2021-09-02",
            "returnDate": "2021-09-08",
            "price": {
                "total": "137.36"
            },
            "links": {
                "flightDates": "https://test.api.amadeus.com/v1/shopping/flight-dates?origin=MIA&destination=STT&departureDate=2021-09-01,2021-09-03&oneWay=false&duration=6&nonStop=false&viewBy=DURATION",
                "flightOffers": "https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=MIA&destinationLocationCode=STT&departureDate=2021-09-02&returnDate=2021-09-08&adults=1&nonStop=false"
            }
        }
As you can see, all the recommendations have a duration of six days and are sorted by the lowest price. The API also provides link to the Flight Offers Search API for each result in order to check for available flights.

Search for cheapest flights regardless of the dates
The Flight Cheapest Date Search API finds the cheapest dates to travel from one city to another. The API provides a list of flight options with dates and prices, and allows you to order by price, departure date or duration.

Information

The Flight Cheapest Date Search API uses dynamic cache data. This cache data is created daily based on the most trending options that are derived from past searches and bookings. In this way, only the most trending options are included in the response.

Information

This API returns cached prices. Once the dates are chosen, use the Flight Offers Search API to get real-time pricing and availability.

The origin and destination are the two mandatory query parameters:


GET https://test.api.amadeus.com/v1/shopping/flight-dates?origin=MAD&destination=MUC
We can further refine our search query by the departure dates, one-way/round-trip, trip duration, connecting flights or maximum price.

The API supports one or multiple departure dates in the query provided the dates are speficied in the ISO 8601 YYYY-MM-DD format and separated by a comma:


GET https://test.api.amadeus.com/v1/shopping/flight-dates?origin=BOS&destination=CHI&departureDate=2022-08-15,2022-08-28
If the oneWay parameter set to true, only one way flight options will be provided in the response. Alternatively, if the oneWay parameter set to false, the search results will show round-trip flights. Otherwise, both flight options will be included in the results. For example, the following request shows one-way flights out of Boston:


GET https://test.api.amadeus.com/v1/shopping/flight-dates?origin=BOS&oneWay=true
One-way journeys can be optionally refined by the journey duration provided in days with the duration parameter:


GET https://test.api.amadeus.com/v1/shopping/flight-dates?origin=BOS&oneWay=true&duration=2
The nonStop parameter filters the search query to direct flights only:


GET https://test.api.amadeus.com/v1/shopping/flight-dates?origin=BOS&nonStop=true
If you need to cap the maximum ticket price, just specify the maximum price in decimals using the maxPrice parameter:


GET https://test.api.amadeus.com/v1/shopping/flight-dates?origin=BOS&maxPrice=100
The API provides a link to the Flight Offers Search API to search for flights once a destination is chosen, in order to proceed with the booking flow.

Search for best flight offers
The Flight Offers Search API searches over 500 airlines to find the cheapest flights for a given itinerary. The API lets you search flights between two cities, perform multi-city searches for longer itineraries and access one-way combinable fares to offer the cheapest options possible. For each itinerary, the API provides a list of flight offers with prices, fare details, airline names, baggage allowances and departure terminals.

Tip

Flight Offers Search API is the first step of Flight booking engine flow. Check the details from Video Tutorials and Blog Tutorial.
Warning

Flights from low-cost carriers, American Airlines, Delta and British Airways are unavailable.
The Flight Offers Search API starts the booking cycle with a search for the best fares. The API returns a list of the cheapest flights given a city/airport of departure, a city/airport of arrival, the number and type of passengers and travel dates. The results are complete with airline name and fares as well as additional information, such as bag allowance and pricing for additional baggage.

The API comes in two flavors:

Simple version: GET operation with few parameters but which is quicker to integrate.
On steroids: POST operation offering the full functionalities of the API.
The minimum GET request has following mandatory query parameters:

IATA code for the origin location
IATA code for the destination location
Departure date in the ISO 8601 YYYY-MM-DD format
Number of adult travellers

GET https://test.api.amadus.com/v2/shopping/flight-offers?adults=1&originLocationCode=BOS&destinationLocationCode=CHI&departureDate=2022-07-22
Let's have a look at all the optional parameters that we can use to refine the search query. One or more of these parameters can be used in addition to the mandatory query parameters.

Return date in the ISO 8601 YYYY-MM-DD format, same as the departure date:


GET https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=BOS&destinationLocationCode=CHI&departureDate=2022-07-22&returnDate=2022-07-26&adults=1
Number of children travelling, same as the number of adults:


GET https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=BOS&destinationLocationCode=CHI&departureDate=2022-07-26&adults=1&children=1
Number of infants travelling, same as the number of adults:


GET https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=BOS&destinationLocationCode=CHI&departureDate=2022-07-26&adults=1&infants=1
Travel class, which includes economy, premium economy, business or first:


GET https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=BOS&destinationLocationCode=CHI&departureDate=2022-07-26&adults=1&travelClass=ECONOMY
We can limit the search to a specific airline by providing its IATA airline code, such as BA for the British Airways:


GET https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=BOS&destinationLocationCode=CHI&departureDate=2022-07-26&adults=1&includedAirlineCodes=BA
Alternatively, we can exclude an airline from the search in a similar way:


GET https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=BOS&destinationLocationCode=CHI&departureDate=2022-07-26&adults=1&excludedAirlineCodes=BA
The nonStop parameter filters the search query to direct flights only:


GET https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=BOS&destinationLocationCode=CHI&departureDate=2022-07-26&adults=1&nonStop=true
The currencyCode defines the currency in which we will see the offer prices:


GET https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=BOS&destinationLocationCode=CHI&departureDate=2022-07-26&adults=1&currencyCode=EUR
We can limit the maximum price to a certain amount and specify the currency as described above:


GET https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=BOS&destinationLocationCode=CHI&departureDate=2022-07-26&adults=1&maxPrice=500&currencyCode=EUR
The maximum number of results retrieved can be limited using the max parameter in the search query:


GET https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=BOS&destinationLocationCode=CHI&departureDate=2022-07-26&adults=1&max=1
The API returns a list of flight-offer objects (up to 250), including information such as itineraries, price, pricing options, etc.


"data": [
    {
      "type": "flight-offer",
      "id": "1",
      "source": "GDS",
      "instantTicketingRequired": false,
      "nonHomogeneous": false,
      "oneWay": false,
      "lastTicketingDate": "2022-07-02",
      "numberOfBookableSeats": 9,
      "itineraries": [ ],
      "price": {
        "currency": "EUR",
        "total": "22.00",
        "base": "13.00",
        "fees": [
          {
            "amount": "0.00",
            "type": "SUPPLIER"
          },
          {
            "amount": "0.00",
            "type": "TICKETING"
          }
        ],
        "grandTotal": "22.00"
      }
    }
  ]
The POST endpoint consumes JSON data in the format described below. So, instead of constructing a search query, we can specify all the required parameters in the payload and pass it onto the API in the request body. In addition to this, a X-HTTP-Method-Override header parameter is required.


{
  "currencyCode": "USD",
  "originDestinations": [
    {
      "id": "1",
      "originLocationCode": "RIO",
      "destinationLocationCode": "MAD",
      "departureDateTimeRange": {
        "date": "2022-11-01",
        "time": "10:00:00"
      }
    },
    {
      "id": "2",
      "originLocationCode": "MAD",
      "destinationLocationCode": "RIO",
      "departureDateTimeRange": {
        "date": "2022-11-05",
        "time": "17:00:00"
      }
    }
  ],
  "travelers": [
    {
      "id": "1",
      "travelerType": "ADULT"
    },
    {
      "id": "2",
      "travelerType": "CHILD"
    }
  ],
  "sources": [
    "GDS"
  ],
  "searchCriteria": {
    "maxFlightOffers": 2,
    "flightFilters": {
      "cabinRestrictions": [
        {
          "cabin": "BUSINESS",
          "coverage": "MOST_SEGMENTS",
          "originDestinationIds": [
            "1"
          ]
        }
      ],
      "carrierRestrictions": {
        "excludedCarrierCodes": [
          "AA",
          "TP",
          "AZ"
        ]
      }
    }
  }
}
Search for flights including or excluding specific airlines
If you want your search to return flights with only specified airlines, you can use the parameter includedAirlineCodes to consider specific airlines. For example, there is a traveler who wants to travel from Berlin to Athens only with Aegean Airlines (A3):

GET https://test.api.amadeus.com/v2/shopping/flight-offers?max=3&adults=1&includedAirlineCodes=A3&originLocationCode=BER&destinationLocationCode=ATH&departureDate=2022-12-06

With the parameter excludedAirlineCodes you can ignore specific airlines. For example, there is a traveler who wants to travel from Berlin to Athens ignoring both Aegean Airlines (A3) and Iberia (IB):

GET https://test.api.amadeus.com/v2/shopping/flight-offers?max=3&adults=1&excludedAirlineCodes=A3,IB&originLocationCode=BER&destinationLocationCode=ATH&departureDate=2021-09-06

Interactive code examples
Check out this interactive code example which provides a flight search form to help you build your app. You can easily customize it and use the Flight Offers Search API to get the cheapest flight offers.

Search for the best flight option
The Flight Choice Prediction API predicts the flight your users will choose. Our machine-learning models have analyzed historical interactions with the Flight Offers Search API and can determine each flight’s probability of being chosen. Boost conversions and create a personalized experience by filtering out the noise and showing your users the flights which are best for them.

Here is a quick cURL example piping the Flight Offers Search API results directly to the prediction API. Please note that a X-HTTP-Method-Override header parameter is required.

Let’s look at flight offers for a Madrid-New York round trip (limiting to four options for this test illustration)


curl --request GET \
     --header 'Authorization: Bearer <token>' \
     --url https://test.api.amadeus.com/v2/shopping/flight-offers\?origin\=MAD\&destination\=NYC\&departureDate\=2019-08-24\&returnDate\=2019-09-19\&adults\=1 \
| curl --request POST \
       --header 'content-type: application/json' \
       --header 'Authorization: Bearer <token>' \
       --header 'X-HTTP-Method-Override: POST' \
       --url https://test.api.amadeus.com/v2/shopping/flight-offers/prediction --data @-
The prediction API returns the same content as the Low Fare search with the addition of the choiceProbability field for each flight offer element.


 {
  "data": [
    {
      "choiceProbability": "0.9437563627430908",
      "id": "1558602440311-352021104",
      "offerItems": [...],
      "type": "flight-offer"
    },
    {
      "choiceProbability": "0.0562028823257711",
      "id": "1558602440311--1831925786",
      "offerItems": [...],
      "type": "flight-offer"
    },
    {
      "choiceProbability": "0.0000252425060482",
      "id": "1558602440311-480701674",
      "offerItems": [...],
      "type": "flight-offer"
    },
    {
      "choiceProbability": "0.0000155124250899",
      "id": "1558602440311--966634676",
      "offerItems": [...],
      "type": "flight-offer"
    }
  ],
  "dictionaries": {...}
  },
  "meta": {...}
  }
}
Search for flight offers for multiple cities
Many travelers take advantage of their international trips to visit several destinations. Multi-city search is a functionality that lets you search for consecutive one-way flights between multiple destinations in a single request. The returned flights are packaged as a complete, bookable itinerary.

To perform multi-city searches, you must use the POST method of the Flight Offers Search API. The API lets you search for up to six origin and destination city pairs.

In the following example, we’ll fly from Madrid to Paris, where we’ll spend a couple of days, then fly to Munich for three days. Next, we’ll visit Amsterdam for two days before finishing our journey with a return to Madrid. We'll use the following IATA city codes: MAD > PAR > MUC > AMS > MAD

The request will look like this:


curl https://test.api.amadeus.com/v2/shopping/flight-offers \
-d '{ 
  "originDestinations": [ 
    { 
      "id": "1", 
      "originLocationCode": "MAD", 
      "destinationLocationCode": "PAR", 
      "departureDateTimeRange": { 
        "date": "2022-10-03" 
      } 
    }, 
    { 
      "id": "2", 
      "originLocationCode": "PAR", 
      "destinationLocationCode": "MUC", 
      "departureDateTimeRange": { 
        "date": "2022-10-05" 
      } 
    }, 
    { 
      "id": "3", 
      "originLocationCode": "MUC", 
      "destinationLocationCode": "AMS", 
      "departureDateTimeRange": { 
        "date": "2022-10-08" 
      } 
    }, 
    { 
      "id": "4", 
      "originLocationCode": "AMS", 
      "destinationLocationCode": "MAD", 
      "departureDateTimeRange": { 
        "date": "2022-10-11" 
      } 
    } 
  ], 
  "travelers": [ 
    { 
      "id": "1", 
      "travelerType": "ADULT", 
      "fareOptions": [ 
        "STANDARD" 
      ] 
    } 
  ], 
  "sources": [ 
    "GDS" 
  ], 
  "searchCriteria": { 
    "maxFlightOffers": 1 
  } 
}' 
Search using loyalty programs
The Flight Offers Price API and the Seatmap Display API both accept Frequent Flyer information so end-users can benefit from their loyalty program. When adding Frequent Flyer information, please remember that each airline policy is different, and some require additional information, such as passenger name, email or phone number to validate the account. If the validation fails, your user won’t receive their loyalty program advantages.

Search for routes from a specific airport
The Airport Routes API shows all destinations from a given airport. To follow up on our previous example, let's check where we can fly to from Madrid (MAD). The options are obviously quite broad, so we can limit the maximum number of results to 10. Keep in mind that this limit will apply from the beginning of the results list in the alphabetical order of the airport IATA codes.

The request will look like this:


curl --request GET \
     --header 'Authorization: Bearer <token>' \
     --url https://test.api.amadeus.com/v1/airport/direct-destinations?departureAirportCode=MAD&max=10 \
So we can see the the following results:


{
  "meta": {
    "count": 10,
    "links": {
      "self": "https://test.api.amadeus.com/v1/airport/direct-destinations?departureAirportCode=MAD&max=10"
    }
  },
  "data": [
    {
      "type": "location",
      "subtype": "city",
      "name": "ALBACETE",
      "iataCode": "ABC"
    },
    {
      "type": "location",
      "subtype": "city",
      "name": "LANZAROTE",
      "iataCode": "ACE"
    },
    {
      "type": "location",
      "subtype": "city",
      "name": "MALAGA",
      "iataCode": "AGP"
    },
    {
      "type": "location",
      "subtype": "city",
      "name": "ALGHERO",
      "iataCode": "AHO"
    },
    {
      "type": "location",
      "subtype": "city",
      "name": "ALICANTE",
      "iataCode": "ALC"
    },
    {
      "type": "location",
      "subtype": "city",
      "name": "ALGIERS",
      "iataCode": "ALG"
    },
    {
      "type": "location",
      "subtype": "city",
      "name": "AMMAN",
      "iataCode": "AMM"
    },
    {
      "type": "location",
      "subtype": "city",
      "name": "AMSTERDAM",
      "iataCode": "AMS"
    },
    {
      "type": "location",
      "subtype": "city",
      "name": "ASUNCION",
      "iataCode": "ASU"
    },
    {
      "type": "location",
      "subtype": "city",
      "name": "ATHENS",
      "iataCode": "ATH"
    }
  ]
}
Search for routes for a specific airline
The Airline Routes API shows all destinations for a given airline. To follow up on our previous example, let's check what destinations the British Airways fly to. There's definitely plenty of options, so we can limit the maximum number of results to two for the sake of simplicity. Keep in mind that this limit will apply from the beginning of the results list in the alphabetical order of the city names.

The request will look like this:


curl --request GET \
     --header 'Authorization: Bearer <token>' \
     --url https://test.api.amadeus.com/v1/airline/destinations?airlineCode=BA&max=2 \
So we can see the the following results:


{
  "data": [
    {
      "type": "location",
      "subtype": "city",
      "name": "Bangalore",
      "iataCode": "BLR"
    },
    {
      "type": "location",
      "subtype": "city",
      "name": "Paris",
      "iataCode": "PAR"
    }
  ],
  "meta": {
    "count": "2",
    "sort": "iataCode",
    "links": {
      "self": "https://test.api.amadeus.com/v1/airline/destinations?airlineCode=BA&max=2"
    }
  }
}
Look up the airline ICAO code by the IATA code
If we need to know the IATA code for a particular airline but only have the airline's ICAO code, the Airline Code Lookup API can help us out. Just specify the IATA code in the query and send out the request:


curl --request GET \
     --header 'Authorization: Bearer <token>' \
     --url https://test.api.amadeus.com/v1/reference-data/airlines?airlineCodes=BA \
The response is pretty straightforward:


{
  "meta": {
    "count": 1,
    "links": {
      "self": "https://test.api.amadeus.com/v1/reference-data/airlines?airlineCodes=BA"
    }
  },
  "data": [
    {
      "type": "airline",
      "iataCode": "BA",
      "icaoCode": "BAW",
      "businessName": "BRITISH AIRWAYS",
      "commonName": "BRITISH A/W"
    }
  ]
}
Search for flight and fare availability
With the Flight Availabilities Search API you can check the flight and fare availability for any itinerary. This refers to the full inventory of fares available for an itinerary at any given time. The concept of flight availability originated in the early days of flight booking as a way for agents to check what options existed for their travelers’ itineraries.

You can build the request by passing into the body of the POST request an object that you can customise to your needs. An example of such object is provided in the specification of the Flight Availabilities Search API. In addition to this, a X-HTTP-Method-Override header parameter is required.

Here’s an example request for a one-way flight from Mad (MIA) to Atlanta (ATL) for one traveler departing on December 12, 2021:

POST https://test.api.amadeus.com/v1/shopping/availability/flight-availabilities


{
    "originDestinations": [
        {
            "id": "1",
            "originLocationCode": "MIA",
            "destinationLocationCode": "ATL",
            "departureDateTime": {
                "date": "2021-11-01"
            }
        }
    ],
    "travelers": [
        {
            "id": "1",
            "travelerType": "ADULT"
        }
    ],
    "sources": [
        "GDS"
    ]
}
The response contains a list of available flights matching our request criteria (for the sake of this example, we only show the first result). Each flight availability includes descriptive data about the flight and an availabilityClasses list containing the available fare classes and the number of bookable seats remaining in each fare class.


"data": [
        {
            "type": "flight-availability",
            "id": "1",
            "originDestinationId": "1",
            "source": "GDS",
            "instantTicketingRequired": false,
            "paymentCardRequired": false,
            "duration": "PT1H54M",
            "segments": [
                {
                    "id": "1",
                    "numberOfStops": 0,
                    "blacklistedInEU": false,
                    "departure": {
                        "iataCode": "MIA",
                        "at": "2021-11-01T05:30:00"
                    },
                    "arrival": {
                        "iataCode": "ATL",
                        "terminal": "S",
                        "at": "2022-11-01T07:24:00"
                    },
                    "carrierCode": "DL",
                    "number": "2307",
                    "aircraft": {
                        "code": "321"
                    },
                    "operating": {},
                    "availabilityClasses": [
                        {
                            "numberOfBookableSeats": 9,
                            "class": "J"
                        },
                        {
                            "numberOfBookableSeats": 9,
                            "class": "C"
                        },
                        {
                            "numberOfBookableSeats": 9,
                            "class": "D"
                        },
                        {
                            "numberOfBookableSeats": 9,
                            "class": "I"
                        },
                        {
                            "numberOfBookableSeats": 9,
                            "class": "Z"
                        },
                        {
                            "numberOfBookableSeats": 9,
                            "class": "W"
                        },
                        {
                            "numberOfBookableSeats": 9,
                            "class": "Y"
                        },
                        {
                            "numberOfBookableSeats": 9,
                            "class": "B"
                        },
                        {
                            "numberOfBookableSeats": 9,
                            "class": "M"
                        },
                        {
                            "numberOfBookableSeats": 9,
                            "class": "H"
                        },
                        {
                            "numberOfBookableSeats": 9,
                            "class": "Q"
                        },
                        {
                            "numberOfBookableSeats": 9,
                            "class": "K"
                        },
                        {
                            "numberOfBookableSeats": 9,
                            "class": "L"
                        },
                        {
                            "numberOfBookableSeats": 9,
                            "class": "U"
                        },
                        {
                            "numberOfBookableSeats": 9,
                            "class": "T"
                        },
                        {
                            "numberOfBookableSeats": 9,
                            "class": "E"
                        }
                    ]
                }
            ]
        },
Note that airlines’ bookable seat counters goe up to a maximum of 9, even if more seats are available in that fare class. If there are less than 9 bookable seats available, the exact number is displayed.

Search branded fares
Branded fares are airfares that bundle tickets with extras, such as checked bags, seat selection, refundability or loyalty points accrual. Each airline defines and packages its own branded fares and they vary from one airline to another. Branded fares not only help build brand recognition and loyalty, but also offer travelers an attractive deal as the incremental cost of the fare is usually less than that of buying the included services à la carte.

The Branded Fares Upsell API receives flight offers from the Flight Offers Search API and returns branded fares as flight offers which can be easily passed to the next step in the booking funnel. The booking flow is the following:

Search for flights using the Flight Offers Search API.
Find branded fare options for a selected flight using the Branded Fares Upsell API.
Confirm the fare and get the final price using the Flight Offers Price API.
Book the flight using the Flight Create Orders API.
Let's see an example of how to search for branded fares.

You can build the request by passing the flight-offer object from the Flight Offers Search API into the body of the POST request including the mandatory X-HTTP-Method-Override header parameter:


POST https://test.api.amadeus.com/v1/shopping/flight-offers/upselling
Please not that the X-HTTP-Method-Override header parameter is required to make this call.


{ 
  "data": { 
    "type": "flight-offers-upselling", 
    "flightOffers": [ 
      {
            "type": "flight-offer",
            "id": "1",
            "source": "GDS",
            "instantTicketingRequired": false,
            "nonHomogeneous": false,
            "oneWay": false,
            "lastTicketingDate": "2022-06-12",
            "numberOfBookableSeats": 3,
            "itineraries": [
                {
                    "duration": "PT6H10M",
                    "segments": [
                        {
                            "departure": {
                                "iataCode": "MAD",
                                "terminal": "1",
                                "at": "2022-06-22T17:40:00"
                            },
                            "arrival": {
                                "iataCode": "FCO",
                                "terminal": "1",
                                "at": "2022-06-22T20:05:00"
                            },
                            "carrierCode": "AZ",
                            "number": "63",
                            "aircraft": {
                                "code": "32S"
                            },
                            "operating": {
                                "carrierCode": "AZ"
                            },
                            "duration": "PT2H25M",
                            "id": "13",
                            "numberOfStops": 0,
                            "blacklistedInEU": false
                        },
                        {
                            "departure": {
                                "iataCode": "FCO",
                                "terminal": "1",
                                "at": "2022-06-22T21:50:00"
                            },
                            "arrival": {
                                "iataCode": "ATH",
                                "at": "2022-06-23T00:50:00"
                            },
                            "carrierCode": "AZ",
                            "number": "722",
                            "aircraft": {
                                "code": "32S"
                            },
                            "operating": {
                                "carrierCode": "AZ"
                            },
                            "duration": "PT2H",
                            "id": "14",
                            "numberOfStops": 0,
                            "blacklistedInEU": false
                        }
                    ]
                }
            ],
            "price": {
                "currency": "EUR",
                "total": "81.95",
                "base": "18.00",
                "fees": [
                    {
                        "amount": "0.00",
                        "type": "SUPPLIER"
                    },
                    {
                        "amount": "0.00",
                        "type": "TICKETING"
                    }
                ],
                "grandTotal": "81.95",
                "additionalServices": [
                    {
                        "amount": "45.00",
                        "type": "CHECKED_BAGS"
                    }
                ]
            },
            "pricingOptions": {
                "fareType": [
                    "PUBLISHED"
                ],
                "includedCheckedBagsOnly": false
            },
            "validatingAirlineCodes": [
                "AZ"
            ],
            "travelerPricings": [
                {
                    "travelerId": "1",
                    "fareOption": "STANDARD",
                    "travelerType": "ADULT",
                    "price": {
                        "currency": "EUR",
                        "total": "81.95",
                        "base": "18.00"
                    },
                    "fareDetailsBySegment": [
                        {
                            "segmentId": "13",
                            "cabin": "ECONOMY",
                            "fareBasis": "OOLGEU1",
                            "class": "O",
                            "includedCheckedBags": {
                                "quantity": 0
                            }
                        },
                        {
                            "segmentId": "14",
                            "cabin": "ECONOMY",
                            "fareBasis": "OOLGEU1",
                            "brandedFare": "ECOLIGHT",
                            "class": "O",
                            "includedCheckedBags": {
                                "quantity": 0
                            }
                        }
                    ]
                }
            ]
        } 
    ]
  } 
}  
The API will procide the following JSON in the response:


{
    "meta": {
        "count": 5
    },
    "data": [{
                "type": "flight-offer",
                "id": "2",
                "source": "GDS",
                "instantTicketingRequired": false,
                "paymentCardRequired": false,
                "lastTicketingDate": "2022-11-30",
                "itineraries": [{
                    "segments": [{
                        "departure": {
                            "iataCode": "MAD",
                            "terminal": "2",
                            "at": "2022-12-01T07:10:00"
                        },
                        "arrival": {
                            "iataCode": "ORY",
                            "at": "2022-12-01T09:05:00"
                        },
                        "carrierCode": "UX",
                        "number": "1027",
                        "aircraft": {
                            "code": "333"
                        },
                        "operating": {
                            "carrierCode": "UX"
                        },
                        "duration": "PT1H55M",
                        "id": "7",
                        "numberOfStops": 0,
                        "blacklistedInEU": false
                    }]
                }],
                "price": {
                    "currency": "EUR",
                    "total": "228.38",
                    "base": "210.00",
                    "fees": [{
                        "amount": "0.00",
                        "type": "TICKETING"
                    }],
                    "grandTotal": "228.38"
                },
                "pricingOptions": {
                    "fareType": [
                        "PUBLISHED"
                    ],
                    "includedCheckedBagsOnly": false,
                    "refundableFare": false,
                    "noRestrictionFare": false,
                    "noPenaltyFare": false
                },
                "validatingAirlineCodes": [
                    "UX"
                ],
                "travelerPricings": [{
                            "travelerId": "1",
                            "fareOption": "STANDARD",
                            "travelerType": "ADULT",
                            "price": {
                                "currency": "EUR",
                                "total": "228.38",
                                "base": "210.00",
                                "taxes": [{
                                        "amount": "3.27",
                                        "code": "QV"
                                    },
                                    {
                                        "amount": "0.63",
                                        "code": "OG"
                                    },
                                    {
                                        "amount": "14.48",
                                        "code": "JD"
                                    }
                                ]
                            },
                            "fareDetailsBySegment": [{
                                "segmentId": "7",
                                "cabin": "ECONOMY",
                                "fareBasis": "KYYO5L",
                                "brandedFare": "LITE",
                                "class": "K",
                                "includedCheckedBags": {
                                    "quantity": 0
                                },
                                "amenities": [{
                                        "code": "0L5",
                                        "description": "CARRY ON HAND BAGGAGE",
                                        "isChargeable": false,
                                        "amenityType": "BAGGAGE"
                                    },
                                    {
                                        "code": "0CC",
                                        "description": "FIRST PREPAID BAG",
                                        "isChargeable": true,
                                        "amenityType": "BAGGAGE"
                                    },
                                    {
                                        "code": "0GO",
                                        "description": "PREPAID BAG",
                                        "isChargeable": true,
                                        "amenityType": "BAGGAGE"
                                    },
                                    {
                                        "code": "059",
                                        "description": "CHANGEABLE TICKET",
                                        "isChargeable": true,
                                        "amenityType": "BRANDED_FARES"
                                    },
                                    {
                                        "code": "0B5",
                                        "description": "PRE RESERVED SEAT ASSIGNMENT",
                                        "isChargeable": true,
                                        "amenityType": "PRE_RESERVED_SEAT"
                                    },
                                    {
                                        "code": "0G6",
                                        "description": "PRIORITY BOARDING",
                                        "isChargeable": true,
                                        "amenityType": "TRAVEL_SERVICES"
                                    }
                                ]
                            }],
                            "dictionaries": {
                                "locations": {
                                    "MAD": {
                                        "cityCode": "MAD",
                                        "countryCode": "ES"
                                    },
                                    "ORY": {
                                        "cityCode": "PAR",
                                        "countryCode": "FR"
                                    }
                                }
                            }
                        }
You can also see the process step to step How to upsell with branded fares in this video tutorial from Advanced flight booking engine series.


Search for personalized destination recommendations
The Travel Recommendations API provides personalized destinations based on the traveler's location and an input destination, such as a previously searched flight destination or city of interest.

For example, for a traveler based in San Francisco who has searched for multiple flights to Barcelona, what other similar destinations the API could recommend? The API takes as input the country of the traveler and the IATA code of the city that was searched, in our case this will be US and BCN respectively.

GET https://test.api.amadeus.com/v1/reference-data/recommended-locations?cityCodes=BCN&travelerCountryCode=US

The response will look like this:


{
     "type": "flight-date",
     "origin": "SFO",
     "destination": "ROM",
     "departureDate": "2021-09-19",
     "returnDate": "2021-09-23",
     "price": {
         "total": "348.75"
     },
     "links": {
         "flightDestinations": "https://test.api.amadeus.com/v1/shopping/flight-destinations?origin=SFO&departureDate=2021-04-15,2021-10-11&oneWay=false&duration=1,15&nonStop=false&viewBy=DURATION",
         "flightOffers": "https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=SFO&destinationLocationCode=ROM&departureDate=2021-09-19&returnDate=2021-09-23&adults=1&nonStop=false"
     }
 }
The only required parameter for the Travel Recommendations API is the city code. So, the API is capable of suggesting flight based on that input alone:


https://test.api.amadeus.com/v1/reference-data/recommended-locations?cityCodes=PAR
You can also narrow the query down by using the destinationCountryCodes parameter, which supports one or more IATA country codes, separated by a comma:


https://test.api.amadeus.com/v1/reference-data/recommended-locations?cityCodes=PAR&destinationCountryCodes=US
To expand the example of the San Francisco-based traveler searching for multiple flights to Barcelona, we can specify the destination country as well:


https://test.api.amadeus.com/v1/reference-data/recommended-locations?cityCodes=BCN&travelerCountryCode=US&destinationCountryCodes=ES
If you want to take it to the next level, you can call the Flight Cheapest Date Search API to let the users know not only the recommended destinations but also what are the cheapest dates to visit any of these cities. For real-time flights, you can also call the Flight Offers Search API. The Travel Recommendations API has returned links to both APIs.

Search for recommended nearby destinations
With the Airport Nearest Relevant API you can find the closest major airports to a starting point. By default, results are sorted by relevance but they can also be sorted by distance, flights, travelers using the parameter sort.

Information

To get the latitude and longitude of a city you can use the Airport & City Search API using the city's IATA code.

Let's call the Airport Nearest Relevant API to find airports within the 500km radius of Madrid.

GET https://test.api.amadeus.com/v1/reference-data/locations/airports?latitude=40.416775&longitude=-3.703790&radius=500

A part of the response looks like:


        {
            "type": "location",
            "subType": "AIRPORT",
            "name": "AIRPORT",
            "detailedName": "BARCELONA/ES:AIRPORT",
            "timeZoneOffset": "+02:00",
            "iataCode": "BCN",
            "geoCode": {
                "latitude": 41.29694,
                "longitude": 2.07833
            },
            "address": {
                "cityName": "BARCELONA",
                "cityCode": "BCN",
                "countryName": "SPAIN",
                "countryCode": "ES",
                "regionCode": "EUROP"
            },
            "distance": {
                "value": 496,
                "unit": "KM"
            },
            "analytics": {
                "flights": {
                    "score": 25
                },
                "travelers": {
                    "score": 25
                }
            },
            "relevance": 5.11921
        }
What we want to do at this point, is to find the cheapest dates for all these destinations.
We can do this by calling the Flight Cheapest Date Search API which finds the cheapest dates to travel from one city to another. Let's see, for example, the cheapest dates to fly to Barcelona in November 2021.

GET https://test.api.amadeus.com/v1/shopping/flight-dates?origin=MAD&destination=BCN&departureDate=2021-05-01,2021-05-30


{
    "type": "flight-date",
    "origin": "MAD",
    "destination": "BCN",
    "departureDate": "2021-05-29",
    "returnDate": "2021-06-11",
    "price": {
        "total": "73.61"
    },
    "links": {
        "flightDestinations": "https://test.api.amadeus.com/v1/shopping/flight-destinations?origin=MAD&departureDate=2021-05-01,2021-05-30&oneWay=false&duration=1,15&nonStop=false&viewBy=DURATION",
        "flightOffers": "https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=MAD&destinationLocationCode=BCN&departureDate=2022-09-29&returnDate=2021-06-11&adults=1&nonStop=false"
    },
{
    "type": "flight-date",
    "origin": "MAD",
    "destination": "BCN",
    "departureDate": "2021-05-05",
    "returnDate": "2021-05-06",
    "price": {
        "total": "79.67"
    },
    "links": {
        "flightDestinations": "https://test.api.amadeus.com/v1/shopping/flight-destinations?origin=MAD&departureDate=2021-05-01,2021-05-30&oneWay=false&duration=1,15&nonStop=false&viewBy=DURATION",
        "flightOffers": "https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=MAD&destinationLocationCode=BCN&departureDate=2021-05-05&returnDate=2021-05-06&adults=1&nonStop=false"
    }
},
{
    "type": "flight-date",
    "origin": "MAD",
    "destination": "BCN",
    "departureDate": "2021-05-02",
    "returnDate": "2021-05-06",
    "price": {
        "total": "80.61"
    },
    "links": {
        "flightDestinations": "https://test.api.amadeus.com/v1/shopping/flight-destinations?origin=MAD&departureDate=2021-05-01,2021-05-30&oneWay=false&duration=1,15&nonStop=false&viewBy=DURATION",
        "flightOffers": "https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=MAD&destinationLocationCode=BCN&departureDate=2021-05-02&returnDate=2021-05-06&adults=1&nonStop=false"
    }
}
As you can see above, in the results we have a list of dates for a roundtrip from Madrid to Barcelona ordered by the lowest price.
In the last step, we want to let the traveler perform a flight search for any of the above dates that are convenient for them. That is very easy with our APIs, as the Flight Cheapest Date Search API for each result contains a link to the Flight Offers Search API. For example, if we want to perform a flight search for the first result, we only have to take the link provided and make an API call:

GET https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=MAD&destinationLocationCode=BCN&departureDate=2021-05-29&returnDate=2021-06-11&adults=1&nonStop=false

Search for a city that has an airport
The Airport & City Search API finds airports and cities that match a specific word or a string of letters. Using this API, you can automatically suggest airports based on what the traveler enters in the search field. The API provides a list of airports/cities ordered by yearly passenger volume with the name, 3-letter IATA code, time zone and coordinates of each airport.

Information

Please keep in mind that Airport & City Search API only returns the cities which have an airport. If you want to retrieve any city that matches a search keyword, check out City Search API.

The Airport & City Search API has two endpoints:

You can see the process step to step in this video tutorial.


GET ​/reference-data​/locations to return a list of airports and cities by a keyword
GET ​/reference-data​/locations//reference-data/locations/{locationId} to return an airport or city by Id
To get a list of airports and cities by a keyword, we need to two mandatory query parameters:

subType - this defines whether we are looking for an airport or a city
keyword - this defines the keyword (or a part of it) used in our search, which can be any character in the range of A-Za-z0-9./:-'()"
Here is a basic query to look for any airport whose name starts with a letter M:


https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT&keyword=M
To narrow the search down, we can use an optional parameter countryCode, which is a location code in the ISO 3166-1 alpha-2 format:


https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT&keyword=M&countryCode=US
The Airport & City Search API supports pagination and dynamic sorting. The dynamic sorting enables you to sort by the results by the number of travelers by airport or city where the airports and cities with the highest traffic will be on top of the list:


https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT&keyword=M&countryCode=US&sort=analytics.travelers.score
In addition to that, we can select how detailed the response will be. This is done by the optional view parameter, which can be:

LIGHT - to only show the iataCode, name, detailedName, cityName and countryName
FULL - to add on top of the LIGHT information the timeZoneOffset, geoCode, detailed address and travelers.score
The default option is FULL:


https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT&keyword=M&countryCode=US&sort=analytics.travelers.score&view=FULL
To search an airport or city by Id, we need to obtain the Id by using the GET ​/reference-data​/locations endpoint. For example:


{
  "meta": {
    "count": 2,
    "links": {
      "self": "https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=MUC&countryCode=DE"
    }
  },
  "data": [
    {
      "type": "location",
      "subType": "CITY",
      "name": "MUNICH INTERNATIONAL",
      "detailedName": "MUNICH/DE:MUNICH INTERNATIONAL",
      "id": "CMUC",
      "self": {
        "href": "https://test.api.amadeus.com/v1/reference-data/locations/CMUC",
        "methods": [
          "GET"
        ]
      },
      "timeZoneOffset": "+02:00",
      "iataCode": "MUC",
      "geoCode": {
        "latitude": 48.35378,
        "longitude": 11.78609
      },
      "address": {
        "cityName": "MUNICH",
        "cityCode": "MUC",
        "countryName": "GERMANY",
        "countryCode": "DE",
        "regionCode": "EUROP"
      },
      "analytics": {
        "travelers": {
          "score": 27
        }
      }
    },
    {
      "type": "location",
      "subType": "AIRPORT",
      "name": "MUNICH INTERNATIONAL",
      "detailedName": "MUNICH/DE:MUNICH INTERNATIONAL",
      "id": "AMUC",
      "self": {
        "href": "https://test.api.amadeus.com/v1/reference-data/locations/AMUC",
        "methods": [
          "GET"
        ]
      },
      "timeZoneOffset": "+02:00",
      "iataCode": "MUC",
      "geoCode": {
        "latitude": 48.35378,
        "longitude": 11.78609
      },
      "address": {
        "cityName": "MUNICH",
        "cityCode": "MUC",
        "countryName": "GERMANY",
        "countryCode": "DE",
        "regionCode": "EUROP"
      },
      "analytics": {
        "travelers": {
          "score": 27
        }
      }
    }
  ]
}
The Id for the city of Munich is CMUC. However, for the Munich Airport the Id will be AMUC. Once we know this Id, we can use it to call the GET ​/reference-data​/locations//reference-data/locations/{locationId}, as it is the only parameter that the query requires:


GET https://test.api.amadeus.com/v1/reference-data/locations/CMUC
Compare the flight price to historical fares
When booking a flight, travelers need to be confident that they're getting a good deal. You can compare a flight price to historical fares for the same flight route using the Flight Price Analysis API. It uses an Artificial Intelligence algorithm trained on Amadeus historical flight booking data to show how current flight prices compare to historical fares and whether the price of a flight is below or above average.

The only mandatory parameters for this search are the origin airport IATA code, destination airport IATA code and the departure date in the ISO 8601 YYYY-MM-DD format.

Let's see how it works. In our example we will be flying from Madrid (MAD) to Paris (CDG) on 12 December 2022:


https://test.api.amadeus.com/v1/analytics/itinerary-price-metrics?originIataCode=MAD&destinationIataCode=CDG&departureDate=2022-12-12
This is what we get in the response:


{
  "warnings": [],
  "data": [
    {
      "type": "itinerary-price-metric",
      "origin": {
        "iataCode": "MAD"
      },
      "destination": {
        "iataCode": "CDG"
      },
      "departureDate": "2022-12-12",
      "transportType": "FLIGHT",
      "currencyCode": "EUR",
      "oneWay": true,
      "priceMetrics": [
        {
          "amount": "29.59",
          "quartileRanking": "MINIMUM"
        },
        {
          "amount": "76.17",
          "quartileRanking": "FIRST"
        },
        {
          "amount": "129.24",
          "quartileRanking": "MEDIUM"
        },
        {
          "amount": "185.59",
          "quartileRanking": "THIRD"
        },
        {
          "amount": "198.15",
          "quartileRanking": "MAXIMUM"
        }
      ]
    }
  ],
  "meta": {
    "count": 1,
    "links": {
      "self": "https://test.api.amadeus.com/v1/analytics/flight-price-metrics?originIataCode=MAD&destinationIataCode=CDG&departureDate=2022-12-12&currencyCode=EUR&oneWay=True"
    }
  }
}
By default the price will be shown in Euros. In this example we can see that the lowest price for such ticket should be 29.59 Euros and the highest 198.15 Euros. The first, medium and trird choices give you an idea about the possible price ranges for this flight.

We also have an option to request the result in a different currency. This is done by using the currencyCode parameter, which is an ISO 4217 format currency code. In addition, we can specify whether we are inquiring about a round trip or a one way ticket.


GET https://test.api.amadeus.com/v1/analytics/itinerary-price-metrics?originIataCode=MAD&destinationIataCode=CDG&departureDate=2021-03-21&currencyCode=EUR&oneWay=true
Confirm Fares
The availability and price of airfare fluctuate, so it’s important to confirm before proceeding to book. This is especially true if time passes between the initial search and the decision to book, as fares are limited and there are thousands of bookings occurring every minute. During this step, you can also add ancillary products like extra bags or legroom. For that you can use the Flight Offers Price API.

Once a flight has been selected, you’ll need to confirm the availability and price of the fare. This is where the Flight Offers Price API comes in. This API returns the final fare price (including taxes and fees) of flights from the Flight Offers Search as well as pricing for ancillary products and the payment information that will be needed to make the final booking.

The body to be sent via POST is built by a new object of type flight-offers-pricing composed by a list of flight-offers (up to 6) + payment information. In addition to this, a X-HTTP-Method-Override header parameter is required.


{
   "data": {
        "type": "flight-offers-princing",
        "flightOffers": [
            { "type": "flight-offer" }
        ],
        "payment" : [
            { Payment_Object }
        ]
    }
Return fare rules
The Flight Offers Price API confirms the final price and availability of a fare. It also returns detailed fare rules, including the cancellation policy and other information. In addition to this, a X-HTTP-Method-Override header parameter is required. To get the fare rules, add the parameter include=detailed-fare-rules to your API call, as shown below:


POST https://test.api.amadeus.com/v1/shopping/flight-offers/pricing?include=detailed-fare-rules
The FareRules object represents a collection of fare rules and penalties associated with a specific fare. Each rule is represented as a TermAndCondition object, containing information about the rule category, circumstances, applicability, maximum penalty amount, and detailed descriptions.

FareRules:

currency: The currency in which the penalties are expressed.
rules: An array of TermAndCondition objects, each representing a specific fare rule or condition.
TermAndCondition:

category: A string defining the type of modification concerned in the rule, such as REFUND, EXCHANGE, REVALIDATION, REISSUE, REBOOK, or CANCELLATION.
circumstances: A string providing additional information on the circumstances under which the rule applies.
notApplicable: A boolean indicating if the rule does not apply to the fare.
maxPenaltyAmount: A string representing the maximum penalty amount for the given rule.
descriptions: An array of Description objects that provide further details on the rule. Each Description object includes:
descriptionType: A string representing the type of description.
text: The actual text of the description, providing more context or explanation for the rule.
You can also see the process step to step How to display farerules in this video tutorial from Advanced flight booking engine series.


Check CO2 emissions data
The Flight Offers Price API allows you to see the emissions data for your itinerary. This data is returned as part of the reponse in the following format:


                "co2Emissions": [
                  {
                    "weight": 46,
                    "weightUnit": "KG",
                    "cabin": "ECONOMY"
                  }
                ]
weight is an integer representing the weight of CO2 emitted for the concerned flight segment
weightUnit is a string indicating the unit of measurement for the weight of CO2 emissions, which can be specified in either pounds or kilos.
cabin is a string representing the quality of service offered in the cabin where the seat is located. This is an enum, which can be ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST.
Book a Flight
Once the fare is confirmed, you’re ready to use the Flight Create Orders API to perform the actual booking. This API lets you log a reservation in the airlines’ systems and create a PNR, and returns a unique Id number and the reservation details. If you’re using an airline consolidator, the PNR will be automatically sent to the consolidator for ticket issuance. Visit the Flight Create Orders documentation page for more details on this API.

Remember, you need to be able to issue a ticket to make bookings with our Flight Create Orders API. To access the API in production, you need to either sign a contract with an airline consolidator or be accredited to issue tickets yourself.

Issue a ticket
Once the booking is made, you need to complete payment. In most cases, you’ll receive payment from the customer and then pay the airline, typically via an industry-specific settlement procedure like the BSP or ARC (more on those later).

In the final step, a flight ticket is issued. In industry terms, a flight ticket is a confirmation that payment has been received, the reservation has been logged, and the customer has the right to enjoy the flight. For IATA member airlines, only certain accredited parties can issue tickets. In the next section, we’ll go into detail about your options for managing this final step in the booking process.

You can see How to manage and issue flight booking process in this video tutorial from Flight Booking Engine 101 series.


If you are interested in knowing more about issuing tickets in travel industry, please check out this article.

View the aircraft cabin layout
With the Seatmap Display API you can view the aircraft cabin layout:

deckConfiguration - the dimensions of the passenger deck in (x,y) coordinates, including the location of the wings, exit rows, and cabins. These dimensions form a grid on which you will later place facilities and seats.
facilities - the (x,y) coordinates of aircraft facilities, such as bathrooms or galleys.
seats - the (x,y) coordinates of all seats on the aircraft, with their respective availability status, characteristics, and prices.
To help you build a more consistent display, the API returns a uniform width for all cabins and classes. Rows with special seating like business class or extra-legroom seats have fewer seats per row (e.g., 4 seats for width of 7 coordinates) than economy rows (e.g. 7 seats for a width of 7 coordinates).

You can see the more details about the aircraft cabin layout in the video below.


Display in-flight amenities
Both endpoints of the Seatmap Display API return information about the following in-flight amenities:

Seat
Wi-fi
Entertainment
Power
Food
Beverage
Select a seat
Requests to either endpoint of the Seatmap Display API will return a list of seating options with their characteristics, pricing, and coordinates. Let's look at an example response:


{
                "cabin": "M",
                "number": "20D",
                "characteristicsCodes": [
                  "A",
                  "CH",
                  "RS"
                ],
                "travelerPricing": [
                  {
                    "travelerId": "1",
                    "seatAvailabilityStatus": "AVAILABLE",
                    "price": {
                      "currency": "EUR",
                      "total": "17.00",
                      "base": "17.00",
                      "taxes": [
                        {
                          "amount": "0.00",
                          "code": "SUPPLIER"
                        }
                      ]
                    }
                  }
                ],
                "coordinates": {
                  "x": 10,
                  "y": 4
                }
              },
For each seat, the Seatmap Display API provides a seatAvailabilityStatus so you can indicate which seats are currently available for booking. Seats may have one of three availability statuses:

AVAILABLE – the seat is not occupied and is available to book.
BLOCKED – the seat is not occupied but isn’t available to book for the user. This is usually due to the passenger type (e.g., children may not sit in exit rows) or their fare class (e.g., some seats may be reserved for flyers in higher classes).
OCCUPIED – the seat is  occupied and unavailable to book.
If a flight is fully booked, the API returns an OCCUPIED status for all seats. In most cases, fully booked flights are filtered out during search with the Flight Offers Search API or when confirming the price with the Flight Offers Price API. The Flight Create Orders API returns an error message if you try to book an unavailable seat. For more information on the booking flow, check out how to build a flight booking engine.

Once your user has selected their seat, the next step is to add the desired seat to the flight offer and prepare them for booking.

In the above example response, seat 20D is indicated as AVAILABLE. For your user to be able to book the seat, you must add the seat to the flightOffer object and call Flight Offers Price to get a final order summary with the included seat.

To include the seat in the flightOffer object, add it to fareDetailsBySegment → additionalServices → chargeableSeatNumber, as shown below:


"fareDetailsBySegment": [
            {
            "additionalServices": {
             "chargeableSeatNumber": "20D"
              },
              "segmentId": "60",
              "cabin": "ECONOMY",
              "fareBasis": "NLYO5L",
              "brandedFare": "LITE",
              "class": "N",
              "includedCheckedBags": {
                "quantity": 0
              }
            }
          ]
The Flight Offers Price API then returns the flightOffer object with the price of the chosen seat included within additionalServices:


"additionalServices":
            {
              "type": "SEATS",
              "amount": "17.00"
            }
You can use the same process to select seats for multiple passengers. For each passenger, you must add the selected seats in fareDetailsBySegment for each travelerId within the flight offer.

At this point, you now have a priced flightOffer which includes your user's selected seat. The final step is to book the flight using the Flight Create Orders API. To do this, simply pass the flightOffer object into a request to the Flight Create Orders API, which will book the flight and return an order summary and a booking Id.

Add additional baggage
Search additional baggage options
The first step is to find the desired flight offer using the Flight Offers Search API. Each flight offer contains an additionalServices field with the types of additional services available, in this case bags, and the maximum price of the first additional bag. Note that at this point, the price is for informational purposes only.

To get the final price of the added baggage with the airline policy and the traveler's tier level taken into account, you must call the Flight Offers Price API. To do this, add the include=bags parameter in the path of the Flight Offers Price API:


POST https://test.api.amadeus.com/v1/shopping/flight-offers/pricing?include=bags 
As you see below, the API returns the catalog of baggage options with the price and quantity (or weight):


"bags": { 
    "1": { 
        "quantity": 1, 
        "name": "CHECKED_BAG", 
        "price": { 
            "amount": "25.00", 
            "currencyCode": "EUR" 
        }, 
        "bookableByItinerary": true, 
        "segmentIds": [ 
            "1", 
            "14" 
        ], 
        "travelerIds": [ 
            "1" 
        ] 
    } 
    "2": {  
        "quantity": 2, 
        "name": "CHECKED_BAG", 
        "price": { 
            "amount": "50.00", 
            "currencyCode": "EUR" 
        }, 
        "bookableByItinerary": true, 
        "segmentIds": [ 
            "1", 
            "14" 
        ], 
        "travelerIds": [ 
            "1" 
        ] 
    } 
} 
The Flight Offers Price API returns two bag offers for the given flight. The catalog shows that either one or two bags are available to be booked per passenger. Higher bag quantity will be rejected due to the airline's policy.

In the example above, the price of two bags is double that of one bag, though some airlines do offer discounts for purchasing more than one checked bag. Each bag offer is coupled to the specific segment and traveler Id returned in each bag offer.

If there is no extra baggage service available, the API won’t return a baggage catalog.

Add additional baggage to the flight offer
Next, you need to add the additional baggage to the desired flight segments. This gives you the flexibility to include extra bags on only certain segments of the flight.

Fill in chargeableCheckedBags with the desired quantity (or weight, depending on what the airline returns) in travelerPricings/fareDetailsBySegment/additionalServices, as shown below:


"fareDetailsBySegment": [{ 
    "segmentId": "1", 
    "cabin": "ECONOMY", 
    "fareBasis": "TNOBAGD", 
    "brandedFare": "GOLIGHT", 
    "class": "T", 
    "includedCheckedBags": { 
        "quantity": 0 
    }, 
    "additionalServices": { 
        "chargeableCheckedBags": { 
            "quantity": 1 
        } 
    } 
}] 
Confirm the final price and book
Once you’ve added the desired bags to the flight order, you need to call the Flight Offers Price API to get the final price of the flight with all additional services included. Once this is done, you can then call the Flight Create Orders API to book the flight. If you want to add different numbers of bags for different itineraries, you can do it following the same flow.

If the desired flight you want to book, does not permit the additional service, the Flight Create Orders API will reject the booking and return the following error:


{ 
    "errors": [{ 
        "status": 400, 
        "code": 38034, 
        "title": "ONE OR MORE SERVICES ARE NOT AVAILABLE", 
        "detail": "Error booking additional services" 
    }] 
} 
You can see the process step to step in this video tutorial.

Video Tutorial
You can also see the process step to step How to add additional baggages in this video tutorial from Advanced flight booking engine series.


Check the flight status
The On-Demand Flight Status API provides real-time flight schedule data including up-to-date departure and arrival times, terminal and gate information, flight duration and real-time delay status.

To get this information, the only mandatory parameters to send a query are the IATA carrier code, flight number and scheduled departure date, and you'll be up to date about your flight schedule. For example, checking the Iberia flight 532 on 23 March 2022:


https://test.api.amadeus.com/v2/schedule/flights?carrierCode=IB&flightNumber=532&scheduledDepartureDate=2022-03-23
If the flight changes and the carrier assigns a prefix to the flight number to indicate the change, you can specify it in the query using the additional one-letter operationalSuffix parameter:


https://test.api.amadeus.com/v2/schedule/flights?carrierCode=IB&flightNumber=532&scheduledDepartureDate=2021-03-23&operationalSuffix=A
The example response looks as follows:


{
  "meta": {
    "count": 1,
    "links": {
      "self": "https://test.api.amadeus.com/v2/schedule/flights?carrierCode=AZ&flightNumber=319&scheduledDepartureDate=2021-03-13"
    }
  },
  "data": [
    {
      "type": "DatedFlight",
      "scheduledDepartureDate": "2021-03-13",
      "flightDesignator": {
        "carrierCode": "AZ",
        "flightNumber": 319
      },
      "flightPoints": [
        {
          "iataCode": "CDG",
          "departure": {
            "timings": [
              {
                "qualifier": "STD",
                "value": "2021-03-13T11:10+01:00"
              }
            ]
          }
        },
        {
          "iataCode": "FCO",
          "arrival": {
            "timings": [
              {
                "qualifier": "STA",
                "value": "2021-03-13T13:15+01:00"
              }
            ]
          }
        }
      ],
      "segments": [
        {
          "boardPointIataCode": "CDG",
          "offPointIataCode": "FCO",
          "scheduledSegmentDuration": "PT2H5M"
        }
      ],
      "legs": [
        {
          "boardPointIataCode": "CDG",
          "offPointIataCode": "FCO",
          "aircraftEquipment": {
            "aircraftType": "32S"
          },
          "scheduledLegDuration": "PT2H5M"
        }
      ]
    }
  ]
}
Check for any flight delays
For any traveller it's quite important to know how far in advance they should get to the airport. The Flight Delay Prediction API estimates the probability of a specific flight being delayed.

The query consists of ten mandatory parameters:

originLocationCode - IATA code of the city or airport from which the traveler is departing, e.g. PAR for Paris
destinationLocationCode - IATA code of the city or airport to which the traveler is going, e.g. PAR for Paris
departureDate - the date on which the traveler will depart from the origin to go to the destination in the ISO 8601 YYYY-MM-DD format, e.g. 2019-12-25
departureTime - local time relative to originLocationCode on which the traveler will depart from the origin in the ISO 8601 format, e.g. 13:22:00
arrivalDate - the date on which the traveler will arrive to the destination from the origin in the ISO 8601 in the YYYY-MM-DD format, e.g. 2019-12-25
arrivalTime - local time relative to destinationLocationCode on which the traveler will arrive to destination in the ISO 8601 standard. e.g. 13:22:00
aircraftCode - IATA aircraft code
carrierCode - airline / carrier code, e.g. TK
flightNumber - flight number as assigned by the carrier, e.g. 1816
duration - flight duration in the ISO 8601 PnYnMnDTnHnMnS format, e.g. PT2H10M

GET https://test.api.amadeus.com/v1/travel/predictions/flight-delay?originLocationCode=NCE&destinationLocationCode=IST&departureDate=2020-08-01&departureTime=18%3A20%3A00&arrivalDate=2020-08-01&arrivalTime=22%3A15%3A00&aircraftCode=321&carrierCode=TK&flightNumber=1816&duration=PT31H10M
The response result will look as follows:


{
  "data": [
    {
      "id": "TK1816NCEIST20200801",
      "probability": "0.13336977",
      "result": "LESS_THAN_30_MINUTES",
      "subType": "flight-delay",
      "type": "prediction"
    },
    {
      "id": "TK1816NCEIST20200801",
      "probability": "0.42023364",
      "result": "BETWEEN_30_AND_60_MINUTES",
      "subType": "flight-delay",
      "type": "prediction"
    },
    {
      "id": "TK1816NCEIST20200801",
      "probability": "0.34671372",
      "result": "BETWEEN_60_AND_120_MINUTES",
      "subType": "flight-delay",
      "type": "prediction"
    },
    {
      "id": "TK1816NCEIST20200801",
      "probability": "0.09968289",
      "result": "OVER_120_MINUTES_OR_CANCELLED",
      "subType": "flight-delay",
      "type": "prediction"
    }
  ],
  "meta": {
    "count": 4,
    "links": {
      "self": "https://test.api.amadeus.com/v1/travel/predictions/flight-delay?originLocationCode=NCE&destinationLocationCode=IST&departureDate=2020-08-01&departureTime=18:20:00&arrivalDate=2020-08-01&arrivalTime=22:15:00&aircraftCode=321&carrierCode=TK&flightNumber=1816&duration=PT31H10M"
    }
  }
}
The main parameter of the dataset is the result, which contains a self-explanatory value, e.g. LESS_THAN_30_MINUTES, BETWEEN_30_AND_60_MINUTES, etc.

Check the on-time performance of an airport
Another way to get prepared for any delays, is checking the on-time performance of the actual airport. The Airport On-Time Performance API estimates the probability of a specific flight being delayed.

The search query is very simple. In our query we only need to provide our flight departure date and the departure airport. For example, JFK on 12 December 2022.


GET https://test.api.amadeus.com/v1/airport/predictions/on-time?airportCode=JFK&date=2022-12-12 
This is the result:


{
  "data": {
    "id": "JFK20221212",
    "probability": "0.928",
    "result": "0.77541769",
    "subType": "on-time",
    "type": "prediction"
  },
  "meta": {
    "links": {
      "self": "https://test.api.amadeus.com/v1/airport/predictions/on-time?airportCode=JFK&date=2022-12-12"
    }
  }
}
The probability parameter shows the probability of the airport running smoothly. In our example, this metric means that there is a 92.8% chance that there will be no delays.

Get a direct link to the airline check-in page
Suppose we are building an app with an integrated check-in flow for a particular airline. In this case, we can leverage the Flight Check-in Links API to generate a link to the airline's official check-in page in a required language for both web and mobile platforms. The only parameter that we need to provide in our search query is the airline's IATA code. If required, we can request the links in a specific language, such as UK English (en-GB). This is what our request would look like:


curl --request GET \
     --header 'Authorization: Bearer <token>' \
     --url https://test.api.amadeus.com/v2/reference-data/urls/checkin-links?airlineCode=BA&language=en-GB \
This is what we get in the response:


{
  "meta": {
    "count": 3,
    "links": {
      "self": "https://test.api.amadeus.com/v2/reference-data/urls/checkin-links?airlineCode=BA&language=EN-GB"
    }
  },
  "data": [
    {
      "type": "checkin-link",
      "id": "BAEN-GBAll",
      "href": "https://www.britishairways.com/travel/olcilandingpageauthreq/public/en_gb",
      "channel": "All"
    },
    {
      "type": "checkin-link",
      "id": "BAEN-GBMobile",
      "href": "https://www.britishairways.com/travel/olcilandingpageauthreq/public/en_gb/device-mobile",
      "channel": "Mobile"
    },
    {
      "type": "checkin-link",
      "id": "BAEN-GBWeb",
      "href": "https://www.britishairways.com/travel/olcilandingpageauthreq/public/en_gb",
      "channel": "Web"
    }
  ]
}
Here we've got a dedicated link for web applications, a dedicated link for mobile applications and a link that works on all platforms.

Cancel a reservation
Just as you can help users book a flight with the Flight Create Orders API, you can now also help them cancel their reservations with the Flight Order Management API. However, you have a limited window of time to cancel via API. If you’re working with an airline consolidator for ticketing, cancellations via API are generally only allowed while the order is queued for ticketing. Once the ticket has been issued, you’ll have to contact your consolidator directly to handle the cancellation.

To call the Flight Order Management API, you have pass as a parameter the flight-orderId from the Flight Create Orders API.

To retrieve the flight order data:


GET https://test.api.amadeus.com/v1/booking/flight-orders/eJzTd9f3NjIJdzUGAAp%2fAiY
To delete the flight order data:


DELETE https://test.api.amadeus.com/v1/booking/flight-orders/eJzTd9f3NjIJdzUGAAp%2fAiY
View reservation details
With the Flight Order Management API you can consult and check your flight reservation.

To call the Flight Order Management API, you have pass as a parameter the flight-orderId from the Flight Create Orders API, such as:


GET https://test.api.amadeus.com/v1/booking/flight-orders/eJzTd9f3NjIJdzUGAAp%2fAiY
Common Errors
Issuance not allowed in Self Service
Self-Service users must work with an airline consolidator that can issue tickets on your behalf. In that case, the payment is not processed by the API but directly between you and the consolidator. Adding a form of payment to the Flight Create Orders API will be rejected by error INVALID FORMAT.

Price discrepancy
The price of airfare fluctuates constantly. Creating an order for a flight whose price is no longer valid at the time of booking will trigger the following error:


{
  "errors": [
    {
      "status": 400,
      "code": 37200,
      "title": "PRICE DISCREPANCY",
      "detail": "Current grandTotal price (2780.28) is different from request one (2779.58)"
    }
  ]
}
If you receive this error, reconfirm the fare price with the Flight Offers Price API before booking.

The following is a common error in the test environment, as you can perform many bookings without restrictions (no real payment), but the inventory is a copy of the real one, so if you book many seats, the inventory will be empty and you won't be able to book anymore.


{
            "status": 400,
            "code": 34651,
            "title": "SEGMENT SELL FAILURE",
            "detail": "Could not sell segment 1"
        }
Notes
Carriers and rates
Low cost carriers (LCCs), American Airlines are not available. Depending on the market, British Airways is also not available.
Published rates only returned in Self-Service. Cannot access to negotiated rates, or any other special rates.
Post-booking modifications
With the current version of our Self-Service APIs, you can’t add additional baggage after the flight has been booked. This and other post-booking modifications must be handled directly with the airline consolidator that is issuing tickets on your behalf.

How payment works
There are two things to consider regarding payments for flight booking:

The payment between you (the app owner) and your customers (for the services provided + the price of the flight ticket). You decide how to collect this payment, it is not included in the API. A third party payment gateway, such as Stripe will be an easier solution for this.
The payment between you and the consolidator (to be able to pay the airline and issue the flight ticket). This will be done between you and your consolidator of choice, and is to be agreed with the consolidator.
Code Examples
To help you get up and running with the Amadeus Self-Service APIs as smoothly as possible, we have provided code examples for each SDK and API endpoint. Simply copy and paste these examples into your project to make API requests.

If you have any questions or ideas for improvement, don't hesitate to raise an issue or a pull request directly from GitHub examples repository.

Flights
Airline Routes

Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    What are the destinations served by the British Airways (BA)?
    '''
    response = amadeus.airline.destinations.get(airlineCode='BA')
    print(response.data)
except ResponseError as error:
    raise error

Airport Routes

Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    What are the destinations served by MAD airport?
    '''
    response = amadeus.airport.direct_destinations.get(departureAirportCode='MAD')
    print(response.data)
except ResponseError as error:
    raise error

Flight Offers Search
GET


Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    Find the cheapest flights from SYD to BKK
    '''
    response = amadeus.shopping.flight_offers_search.get(
        originLocationCode='SYD', destinationLocationCode='BKK', departureDate='2022-07-01', adults=1)
    print(response.data)
except ResponseError as error:
    raise error

POST


Python
Node
Java

import json
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

json_string = '{ "currencyCode": "ZAR", "originDestinations": [ { "id": "1", "originLocationCode": "JNB", ' \
              '"destinationLocationCode": "CPT", "departureDateTimeRange": { "date": "2022-07-01", "time": "00:00:00" ' \
              '} }, { "id": "2", "originLocationCode": "CPT", "destinationLocationCode": "JNB", ' \
              '"departureDateTimeRange": { "date": "2022-07-29", "time": "00:00:00" } } ], "travelers": [ { "id": ' \
              '"1", "travelerType": "ADULT" }, { "id": "2", "travelerType": "ADULT" }, { "id": "3", "travelerType": ' \
              '"HELD_INFANT", "associatedAdultId": "1" } ], "sources": [ "GDS" ], "searchCriteria": { ' \
              '"excludeAllotments": true, "addOneWayOffers": false, "maxFlightOffers": 10, ' \
              '"allowAlternativeFareOptions": true, "oneFlightOfferPerDay": true, "additionalInformation": { ' \
              '"chargeableCheckedBags": true, "brandedFares": true, "fareRules": false }, "pricingOptions": { ' \
              '"includedCheckedBagsOnly": false }, "flightFilters": { "crossBorderAllowed": true, ' \
              '"moreOvernightsAllowed": true, "returnToDepartureAirport": true, "railSegmentAllowed": true, ' \
              '"busSegmentAllowed": true, "carrierRestrictions": { "blacklistedInEUAllowed": true, ' \
              '"includedCarrierCodes": [ "FA" ] }, "cabinRestrictions": [ { "cabin": "ECONOMY", "coverage": ' \
              '"MOST_SEGMENTS", "originDestinationIds": [ "2" ] }, { "cabin": "ECONOMY", "coverage": "MOST_SEGMENTS", ' \
              '"originDestinationIds": [ "1" ] } ], "connectionRestriction": { "airportChangeAllowed": true, ' \
              '"technicalStopsAllowed": true } } } }'

body = json.loads(json_string)
try:
    response = amadeus.shopping.flight_offers_search.post(body)
    print(response.data)
except ResponseError as error:
    raise error

Flight Offers Price

Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    Confirm availability and price from SYD to BKK in summer 2022
    '''
    flights = amadeus.shopping.flight_offers_search.get(originLocationCode='SYD', destinationLocationCode='BKK',
                                                        departureDate='2022-07-01', adults=1).data
    response_one_flight = amadeus.shopping.flight_offers.pricing.post(
        flights[0])
    print(response_one_flight.data)

    response_two_flights = amadeus.shopping.flight_offers.pricing.post(
        flights[0:2])
    print(response_two_flights.data)
except ResponseError as error:
    raise error

Flight Inspiration Search

Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus/# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    Find cheapest destinations from Madrid
    '''
    response = amadeus.shopping.flight_destinations.get(origin='MAD')
    print(response.data)
except ResponseError as error:
    raise error

Flight Cheapest Date Search

Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    Find cheapest dates from Madrid to Munich
    '''
    response = amadeus.shopping.flight_dates.get(origin='MAD', destination='MUC')
    print(response.data)
except ResponseError as error:
    raise error

Flight Availabilities Search

Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    body = {
        "originDestinations": [
            {
                "id": "1",
                "originLocationCode": "MIA",
                "destinationLocationCode": "ATL",
                "departureDateTime": {
                    "date": "2022-11-01"
                }
            }
        ],
        "travelers": [
            {
                "id": "1",
                "travelerType": "ADULT"
            }
        ],
        "sources": [
            "GDS"
        ]
    }

    response = amadeus.shopping.availability.flight_availabilities.post(body)
    print(response.data)
except ResponseError as error:
    raise error

Branded Upsell

Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
import json
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    json_string = '{ "data": { "type": "flight-offers-upselling", "flightOffers": [ { "type": "flight-offer", ' \
                  '"id": "1", ' \
                  '"source": "GDS", "instantTicketingRequired": false, "nonHomogeneous": false, "oneWay": false, ' \
                  '"lastTicketingDate": "2022-05-11", "numberOfBookableSeats": 9, "itineraries": [ { "duration": ' \
                  '"PT2H10M", ' \
                  '"segments": [ { "departure": { "iataCode": "CDG", "terminal": "3", "at": "2022-07-04T20:45:00" }, ' \
                  '"arrival": { ' \
                  '"iataCode": "MAD", "terminal": "4", "at": "2022-07-04T22:55:00" }, "carrierCode": "IB", ' \
                  '"number": "3741", ' \
                  '"aircraft": { "code": "32A" }, "operating": { "carrierCode": "I2" }, "duration": "PT2H10M", ' \
                  '"id": "4", ' \
                  '"numberOfStops": 0, "blacklistedInEU": false } ] } ], "price": { "currency": "EUR", ' \
                  '"total": "123.02", ' \
                  '"base": "92.00", "fees": [ { "amount": "0.00", "type": "SUPPLIER" }, { "amount": "0.00", ' \
                  '"type": "TICKETING" } ' \
                  '], "grandTotal": "123.02", "additionalServices": [ { "amount": "30.00", "type": "CHECKED_BAGS" } ] ' \
                  '}, ' \
                  '"pricingOptions": { "fareType": [ "PUBLISHED" ], "includedCheckedBagsOnly": false }, ' \
                  '"validatingAirlineCodes": [ ' \
                  '"IB" ], "travelerPricings": [ { "travelerId": "1", "fareOption": "STANDARD", "travelerType": ' \
                  '"ADULT", ' \
                  '"price": { "currency": "EUR", "total": "123.02", "base": "92.00" }, "fareDetailsBySegment": [ { ' \
                  '"segmentId": ' \
                  '"4", "cabin": "ECONOMY", "fareBasis": "SDNNEOB2", "brandedFare": "NOBAG", "class": "S", ' \
                  '"includedCheckedBags": { ' \
                  '"quantity": 0 } } ] } ] } ], "payments": [ { "brand": "VISA_IXARIS", "binNumber": 123456, ' \
                  '"flightOfferIds": [ 1 ' \
                  '] } ] } } '

    body = json.loads(json_string)
    response = amadeus.shopping.flight_offers.upselling.post(body)
    print(response.data)
except ResponseError as error:
    raise error

SeatMap Display
GET


Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    Retrieve the seat map of a flight present in an order
    '''
    response = amadeus.shopping.seatmaps.get(flightorderId='eJzTd9cPDPMwcooAAAtXAmE=')
    print(response.data)
except ResponseError as error:
    raise error

POST


Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    Retrieve the seat map of a given flight offer 
    '''
    body = amadeus.shopping.flight_offers_search.get(originLocationCode='MAD',
                                                     destinationLocationCode='NYC',
                                                     departureDate='2022-11-01',
                                                     adults=1,
                                                     max=1).result
    response = amadeus.shopping.seatmaps.post(body)
    print(response.data)
except ResponseError as error:
    raise error

Flight Create Orders

Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

traveler = {
    'id': '1',
    'dateOfBirth': '1982-01-16',
    'name': {
        'firstName': 'JORGE',
        'lastName': 'GONZALES'
    },
    'gender': 'MALE',
    'contact': {
        'emailAddress': 'jorge.gonzales833@telefonica.es',
        'phones': [{
            'deviceType': 'MOBILE',
            'countryCallingCode': '34',
            'number': '480080076'
        }]
    },
    'documents': [{
        'documentType': 'PASSPORT',
        'birthPlace': 'Madrid',
        'issuanceLocation': 'Madrid',
        'issuanceDate': '2015-04-14',
        'number': '00000000',
        'expiryDate': '2025-04-14',
        'issuanceCountry': 'ES',
        'validityCountry': 'ES',
        'nationality': 'ES',
        'holder': True
    }]
}

try:
    # Flight Offers Search to search for flights from MAD to ATH
    flight_search = amadeus.shopping.flight_offers_search.get(originLocationCode='MAD',
                                                              destinationLocationCode='ATH',
                                                              departureDate='2022-12-01',
                                                              adults=1).data

    # Flight Offers Price to confirm the price of the chosen flight
    price_confirm = amadeus.shopping.flight_offers.pricing.post(
        flight_search[0]).data

    # Flight Create Orders to book the flight
    booked_flight = amadeus.booking.flight_orders.post(
        flight_search[0], traveler).data

except ResponseError as error:
    raise error

Flight Order Management
GET


Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import ResponseError, Client

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    # Retrieve the flight order based on it's id
    '''
    response = amadeus.booking.flight_order('MlpZVkFMfFdBVFNPTnwyMDE1LTExLTAy').get()
    print(response.data)
except ResponseError as error:
    raise error

DELETE


Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import ResponseError, Client

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    # Delete a given flight order based on it's id
    '''
    response = amadeus.booking.flight_order('MlpZVkFMfFdBVFNPTnwyMDE1LTExLTAy').delete()
    print(response.data)
except ResponseError as error:
    raise error

Flight Price Analysis

Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import ResponseError, Client

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    Returns price metrics of a given itinerary
    '''
    response = amadeus.analytics.itinerary_price_metrics.get(originIataCode='MAD',
                                                             destinationIataCode='CDG',
                                                             departureDate='2022-03-21')
    print(response.data)
except ResponseError as error:
    raise error

Flight Delay Prediction

Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    Will there be a delay from BRU to FRA? If so how much delay?
    '''
    response = amadeus.travel.predictions.flight_delay.get(originLocationCode='NCE', destinationLocationCode='IST',
                                                           departureDate='2022-08-01', departureTime='18:20:00',
                                                           arrivalDate='2022-08-01', arrivalTime='22:15:00',
                                                           aircraftCode='321', carrierCode='TK',
                                                           flightNumber='1816', duration='PT31H10M')
    print(response.data)
except ResponseError as error:
    raise error

Airport On Time Performance

Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    Will there be a delay in the JFK airport on the 1st of December?
    '''
    response = amadeus.airport.predictions.on_time.get(
        airportCode='JFK', date='2021-12-01')
    print(response.data)
except ResponseError as error:
    raise error

Flight Choice Prediction

Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    Find the probability of the flight MAD to NYC to be chosen
    '''
    body = amadeus.shopping.flight_offers_search.get(originLocationCode='MAD',
                                                     destinationLocationCode='NYC',
                                                     departureDate='2022-11-01',
                                                     returnDate='2022-11-09',
                                                     adults=1).result
    response = amadeus.shopping.flight_offers.prediction.post(body)
    print(response.data)
except ResponseError as error:
    raise error

On Demand Flight Status

Python
Node
Java

from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    Returns flight status of a given flight
    '''
    response = amadeus.schedule.flights.get(carrierCode='AZ',
                                            flightNumber='319',
                                            scheduledDepartureDate='2022-03-13')
    print(response.data)
except ResponseError as error:
    raise error

Flight Most Traveled Destinations

Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    Where were people flying to from Madrid in the January 2017?
    '''
    response = amadeus.travel.analytics.air_traffic.traveled.get(originCityCode='MAD', period='2017-01')
    print(response.data)
except ResponseError as error:
    raise error

Flight Busiest Traveling Period

Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    What were the busiest months for Madrid in 2022?
    '''
    response = amadeus.travel.analytics.air_traffic.busiest_period.get(
        cityCode='MAD', period='2017', direction='ARRIVING')
    print(response.data)
except ResponseError as error:
    raise error

Flight Most Booked Destinations

Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    Where were people flying to from Madrid in the August 2017?
    '''
    response = amadeus.travel.analytics.air_traffic.booked.get(originCityCode='MAD', period='2017-08')
    print(response.data)
except ResponseError as error:
    raise error

Flight CheckIn Links

Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    What is the URL to my online check-in?
    '''
    response = amadeus.reference_data.urls.checkin_links.get(airlineCode='BA')
    print(response.data)
except ResponseError as error:
    raise error

Airport Nearest Relevant

Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    What relevant airports are there around a specific location?
    '''
    response = amadeus.reference_data.locations.airports.get(longitude=49.000, latitude=2.55)
    print(response.data)
except ResponseError as error:
    raise error

Airport & City Search
By keyword


Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError
from amadeus import Location

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    Which cities or airports start with 'r'?
    '''
    response = amadeus.reference_data.locations.get(keyword='r',
                                                    subType=Location.ANY)
    print(response.data)
except ResponseError as error:
    raise error

By Id


Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError
from amadeus import Location

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    Which cities or airports start with 'r'?
    '''
    response = amadeus.reference_data.locations.get(keyword='r',
                                                    subType=Location.ANY)
    print(response.data)
except ResponseError as error:
    raise error

Airline Code Lookup

Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    What's the airline name for the IATA code BA?
    '''
    response = amadeus.reference_data.airlines.get(airlineCodes='BA')
    print(response.data)
except ResponseError as error:
    raise error

Hotel
Hotel List
By geolocation


Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import ResponseError, Client

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    Get list of hotels by a geocode
    '''
    response = amadeus.reference_data.locations.hotels.by_geocode.get(longitude=2.160873,latitude=41.397158)

    print(response.data)
except ResponseError as error:
    raise error

By city


Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import ResponseError, Client

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    Get list of hotels by city code
    '''
    response = amadeus.reference_data.locations.hotels.by_city.get(cityCode='PAR')

    print(response.data)
except ResponseError as error:
    raise error

By hotel


Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import ResponseError, Client

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    Get list of hotels by hotel id
    '''
    response = amadeus.reference_data.locations.hotels.by_hotels.get(hotelIds='ADPAR001')

    print(response.data)
except ResponseError as error:
    raise error

Hotel Search
By hotel


Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    # Get list of available offers in specific hotels by hotel ids
    hotels_by_city = amadeus.shopping.hotel_offers_search.get(
        hotelIds='RTPAR001', adults='2', checkInDate='2023-10-01', checkOutDate='2023-10-04')
except ResponseError as error:
    raise error

By offer


Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    # Get list of Hotels by city code
    hotels_by_city = amadeus.shopping.hotel_offer_search('63A93695B58821ABB0EC2B33FE9FAB24D72BF34B1BD7D707293763D8D9378FC3').get()
except ResponseError as error:
    raise error

Hotel Booking

Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    # Hotel List API to get list of Hotels by city code
    hotels_by_city = amadeus.reference_data.locations.hotels.by_city.get(cityCode='DEL')
    hotelIds = [hotel.get('hotelId') for hotel in hotels_by_city.data[:5]]

    # Hotel Search API to get list of offers for a specific hotel
    hotel_offers = amadeus.shopping.hotel_offers_search.get(
        hotelIds=hotelIds, adults='2', checkInDate='2023-10-01', checkOutDate='2023-10-04')
    offerId = hotel_offers.data[0]['offers'][0]['id']

    guests = [{'id': 1, 'name': {'title': 'MR', 'firstName': 'BOB', 'lastName': 'SMITH'},
               'contact': {'phone': '+33679278416', 'email': 'bob.smith@email.com'}}]
    payments = {'id': 1, 'method': 'creditCard', 'card': {
        'vendorCode': 'VI', 'cardNumber': '4151289722471370', 'expiryDate': '2027-08'}}

    # Hotel booking API to book the offer 
    hotel_booking = amadeus.booking.hotel_bookings.post(
        offerId, guests, payments)
    print(hotel_booking.data)
except ResponseError as error:
    raise error

Hotel Ratings

Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    What travelers think about this hotel?
    '''
    response = amadeus.e_reputation.hotel_sentiments.get(hotelIds = 'ADNYCCTB')
    print(response.data)
except ResponseError as error:
    raise error

Hotel Name Autocomplete

Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from ast import keyword
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    Hotel name autocomplete for keyword 'PARI' using HOTEL_GDS category of search
    '''
    response = amadeus.reference_data.locations.hotel.get(keyword='PARI', subType=[Hotel.HOTEL_GDS])
    print(response.data)
except ResponseError as error:
    raise error

Destination Content
Points of Interest
By geolocation


Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    What are the popular places in Barcelona (based on a geo location and a radius)
    '''
    response = amadeus.reference_data.locations.points_of_interest.get(latitude=41.397158, longitude=2.160873)
    print(response.data)
except ResponseError as error:
    raise error

By square


Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    What are the popular places in Barcelona? (based on a square)
    '''
    response = amadeus.reference_data.locations.points_of_interest.by_square.get(north=41.397158,
                                                                                 west=2.160873,
                                                                                 south=41.394582,
                                                                                 east=2.177181)
    print(response.data)
except ResponseError as error:
    raise error

By Id


Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    Give me information about a place based on it's ID
    '''
    response = amadeus.reference_data.locations.point_of_interest('9CB40CB5D0').get()
    print(response.data)
except ResponseError as error:
    raise error

Tours and Activities
By geolocation


Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import ResponseError, Client

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    Returns activities for a location in Barcelona based on geolocation coordinates
    '''
    response = amadeus.shopping.activities.get(latitude=40.41436995, longitude=-3.69170868)
    print(response.data)
except ResponseError as error:
    raise error

By square


Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import ResponseError, Client

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    Returns activities in Barcelona within a designated area
    '''
    response = amadeus.shopping.activities.by_square.get(north=41.397158,
                                                         west=2.160873,
                                                         south=41.394582,
                                                         east=2.177181)
    print(response.data)
except ResponseError as error:
    raise error

By Id


Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import ResponseError, Client

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    Returns information of an activity from a given Id
    '''
    response = amadeus.shopping.activity('3216547684').get()
    print(response.data)
except ResponseError as error:
    raise error

Location Score

Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from ast import keyword
from amadeus import Client, ResponseError

amadeus = Client(
)

try:
    '''
    What are the location scores for the given coordinates?
    '''
    response = amadeus.location.analytics.category_rated_areas.get(latitude=41.397158, longitude=2.160873)
    print(response.data)
except ResponseError as error:
    raise error

Trip
City Search

Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    What are the cities matched with keyword 'Paris' ?
    '''
    response = amadeus.reference_data.locations.cities.get(keyword='Paris')
    print(response.data)
except ResponseError as error:
    raise error

Trip Purpose Prediction

Python
Node
Java

# Install the Python library from https://pypi.org/project/amadeus
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    The passenger is traveling for leisure or business?
    '''
    response = amadeus.travel.predictions.trip_purpose.get(originLocationCode='NYC', destinationLocationCode='MAD',
                                                           departureDate='2022-08-01', returnDate='2022-08-12',
                                                           searchDate='2022-06-11')
    print(response.data)
except ResponseError as error:
    raise error

Travel Recommendations

Python
Node
Java

from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

try:
    '''
    Recommends travel destinations similar to Paris for travelers in France
    '''
    response = amadeus.reference_data.recommended_locations.get(cityCodes='PAR', travelerCountryCode='FR')
    print(response.data)
except ResponseError as error:
    raise error

Cars and Transfers
Transfer Search

Python
Node
Java

import json
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

json_string = '{ "startLocationCode": "CDG", "endAddressLine": "Avenue Anatole France, 5", "endCityName": "Paris", "endZipCode": "75007", "endCountryCode": "FR", \
"endName": "Souvenirs De La Tour", "endGeoCode": "48.859466,2.2976965", "transferType": "PRIVATE", "startDateTime": "2023-11-10T10:30:00", "providerCodes": "TXO", \
"passengers": 2, "stopOvers": [ { "duration": "PT2H30M", "sequenceNumber": 1, "addressLine": "Avenue de la Bourdonnais, 19", "countryCode": "FR", "cityName": "Paris", \
"zipCode": "75007", "name": "De La Tours", "geoCode": "48.859477,2.2976985", "stateCode": "FR" } ], "startConnectedSegment": \
{ "transportationType": "FLIGHT", "transportationNumber": "AF380", "departure": { "localDateTime": "2023-11-10T09:00:00", "iataCode": "NCE" }, \
"arrival": { "localDateTime": "2023-11-10T10:00:00", "iataCode": "CDG" } }, "passengerCharacteristics": [ { "passengerTypeCode": "ADT", "age": 20 }, \
{ "passengerTypeCode": "CHD", "age": 10 } ] }'

body = json.loads(json_string)
try:
    response = amadeus.shopping.transfer_offers.post(body)
    print(response.data)
except ResponseError as error:
    raise error

Transfer Booking

Python
Node
Java

import json
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)

searchBody = '{ "startLocationCode": "CDG", "endAddressLine": "Avenue Anatole France, 5", "endCityName": "Paris", \
    "endZipCode": "75007", "endCountryCode": "FR", "endName": "Souvenirs De La Tour", "endGeoCode": "48.859466,2.2976965", \
    "transferType": "PRIVATE", "startDateTime": "2023-11-10T10:30:00", "providerCodes": "TXO", "passengers": 2, \
    "stopOvers": [ { "duration": "PT2H30M", "sequenceNumber": 1, "addressLine": "Avenue de la Bourdonnais, 19", \
    "countryCode": "FR", "cityName": "Paris", "zipCode": "75007", "name": "De La Tours", "geoCode": "48.859477,2.2976985", \
    "stateCode": "FR" } ], "startConnectedSegment": { "transportationType": "FLIGHT", "transportationNumber": "AF380", \
    "departure": { "localDateTime": "2023-11-10T09:00:00", "iataCode": "NCE" }, \
    "arrival": { "localDateTime": "2023-11-10T10:00:00", "iataCode": "CDG" } }, \
    "passengerCharacteristics": [ { "passengerTypeCode": "ADT", "age": 20 }, { "passengerTypeCode": "CHD", "age": 10 } ] }'

# Search list of transfers from Transfer Search API
searchResponse = amadeus.shopping.transfer_offers.post(json.loads(searchBody))
offerId = searchResponse.data[0]['id']


offerBody = '{ "data": { "note": "Note to driver", "passengers": [ { "firstName": "John", "lastName": "Doe", "title": "MR", \
    "contacts": { "phoneNumber": "+33123456789", "email": "user@email.com" }, \
    "billingAddress": { "line": "Avenue de la Bourdonnais, 19", "zip": "75007", "countryCode": "FR", "cityName": "Paris" } } ], \
    "agency": { "contacts": [ { "email": { "address": "abc@test.com" } } ] }, \
    "payment": { "methodOfPayment": "CREDIT_CARD", "creditCard": \
    { "number": "4111111111111111", "holderName": "JOHN DOE", "vendorCode": "VI", "expiryDate": "0928", "cvv": "111" } }, \
    "extraServices": [ { "code": "EWT", "itemId": "EWT0291" } ], "equipment": [ { "code": "BBS" } ], \
    "corporation": { "address": { "line": "5 Avenue Anatole France", "zip": "75007", "countryCode": "FR", "cityName": "Paris" }, "info": { "AU": "FHOWMD024", "CE": "280421GH" } }, \
    "startConnectedSegment": { "transportationType": "FLIGHT", "transportationNumber": "AF380", \
    "departure": { "uicCode": "7400001", "iataCode": "CDG", "localDateTime": "2023-03-27T20:03:00" }, \
    "arrival": { "uicCode": "7400001", "iataCode": "CDG", "localDateTime": "2023-03-27T20:03:00" } }, \
    "endConnectedSegment": { "transportationType": "FLIGHT", "transportationNumber": "AF380", \
    "departure": { "uicCode": "7400001", "iataCode": "CDG", "localDateTime": "2023-03-27T20:03:00" }, \
    "arrival": { "uicCode": "7400001", "iataCode": "CDG", "localDateTime": "2023-03-27T20:03:00" } } } }'

# Book the first transfer from Transfer Search API via Transfer Booking API
try:
    response = amadeus.ordering.transfer_orders.post(json.loads(offerBody), offerId=offerId)
    print(response.data)
except ResponseError as error:
    raise error

Transfer Management

Python
Node
Java

import json
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_AMADEUS_API_KEY',
    client_secret='YOUR_AMADEUS_API_SECRET'
)
searchBody = '{ "startLocationCode": "CDG", "endAddressLine": "Avenue Anatole France, 5", "endCityName": "Paris", \
    "endZipCode": "75007", "endCountryCode": "FR", "endName": "Souvenirs De La Tour", "endGeoCode": "48.859466,2.2976965", \
    "transferType": "PRIVATE", "startDateTime": "2023-11-10T10:30:00", "providerCodes": "TXO", "passengers": 2, \
    "stopOvers": [ { "duration": "PT2H30M", "sequenceNumber": 1, "addressLine": "Avenue de la Bourdonnais, 19", \
    "countryCode": "FR", "cityName": "Paris", "zipCode": "75007", "name": "De La Tours", "geoCode": "48.859477,2.2976985", \
    "stateCode": "FR" } ], "startConnectedSegment": { "transportationType": "FLIGHT", "transportationNumber": "AF380", \
    "departure": { "localDateTime": "2023-11-10T09:00:00", "iataCode": "NCE" }, \
    "arrival": { "localDateTime": "2023-11-10T10:00:00", "iataCode": "CDG" } }, \
    "passengerCharacteristics": [ { "passengerTypeCode": "ADT", "age": 20 }, { "passengerTypeCode": "CHD", "age": 10 } ] }'

# Search list of transfers from Transfer Search API
searchResponse = amadeus.shopping.transfer_offers.post(json.loads(searchBody))
offerId = searchResponse.data[0]['id']


offerBody = '{ "data": { "note": "Note to driver", "passengers": [ { "firstName": "John", "lastName": "Doe", "title": "MR", \
    "contacts": { "phoneNumber": "+33123456789", "email": "user@email.com" }, \
    "billingAddress": { "line": "Avenue de la Bourdonnais, 19", "zip": "75007", "countryCode": "FR", "cityName": "Paris" } } ], \
    "agency": { "contacts": [ { "email": { "address": "abc@test.com" } } ] }, \
    "payment": { "methodOfPayment": "CREDIT_CARD", "creditCard": \
    { "number": "4111111111111111", "holderName": "JOHN DOE", "vendorCode": "VI", "expiryDate": "0928", "cvv": "111" } }, \
    "extraServices": [ { "code": "EWT", "itemId": "EWT0291" } ], "equipment": [ { "code": "BBS" } ], \
    "corporation": { "address": { "line": "5 Avenue Anatole France", "zip": "75007", "countryCode": "FR", "cityName": "Paris" }, "info": { "AU": "FHOWMD024", "CE": "280421GH" } }, \
    "startConnectedSegment": { "transportationType": "FLIGHT", "transportationNumber": "AF380", \
    "departure": { "uicCode": "7400001", "iataCode": "CDG", "localDateTime": "2023-03-27T20:03:00" }, \
    "arrival": { "uicCode": "7400001", "iataCode": "CDG", "localDateTime": "2023-03-27T20:03:00" } }, \
    "endConnectedSegment": { "transportationType": "FLIGHT", "transportationNumber": "AF380", \
    "departure": { "uicCode": "7400001", "iataCode": "CDG", "localDateTime": "2023-03-27T20:03:00" }, \
    "arrival": { "uicCode": "7400001", "iataCode": "CDG", "localDateTime": "2023-03-27T20:03:00" } } } }'

# Book the first transfer from Transfer Search API via Transfer Booking API
orderResponse =  amadeus.ordering.transfer_orders.post(json.loads(offerBody), offerId=offerId)
orderId = orderResponse.data['id']
confirmNbr = orderResponse.data['transfers'][0]['confirmNbr'] 

# Book the first transfer from Transfer Search API via Transfer Booking API
try:
    amadeus.ordering.transfer_order(orderId).transfers.cancellation.post('', confirmNbr=confirmNbr)
except ResponseError as error:
    raise error

Prototypes
Would you like to explore the applications that you could build with Amadeus Self-Service APIs? We have prototypes available in Amadeus for Developers GitHub.

There are two types of prototypes (demo apps) available.

Official prototypes are managed by Amadeus for Developers team and updated frequently to the latest version of APIs and SDKs.
Community prototypes are examples or demo apps that have been built and managed by developer community and it is not supported or maintained by Amadeus for Developers team.
Official Prototypes
Use Cases	Amadeus APIs used	Technology	Details
Flight booking engine	Flight Offers Search, Flight Offers Price, Flight Create Order, Airport & City Search	Python, Django	See details
Hotel Booking engine	Hotel List, Hotel Search, Hotel Booking	Python, Django	See details
Flight Search with Price Analysis & Trip purpose	Flight Offers Search, Flight Price Analysis, Trip Purpose Prediction	Python, Django	See details
Map with Hotels, Point of interests	Hotel List, Points of Interest, Tours and Activities	Python, Django, HERE Maps	See details
Amadeus Flight Booking in Django
Source code: You can access the source code on GitHub.
The prototype is built with Django and the Amadeus Python SDK and demonstrates the end-to-end flight booking process, which works in conjunction with three APIs:

Flight Offer Search API to search for flight offers.
Flight Offer Price API to confirm the availability and price of given offers.
Flight Create Orders API to book the given flights.
It also calls the Airport & City Search API to autocomplete the origin and destination with IATA code.

amadeus-flight-booking-django amadeus-flight-booking-django-2

Amadeus Hotel Booking in Django
Source code: You can access the source code on GitHub.
The prototype is built with Python/Django and the Amadeus Python SDK. It demonstrates the end-to-end Hotel booking process (Hotel booking engine), which works in conjunction with three APIs:

Hotel List API to list the hotels in a specific location.
Hotel Search API to search for the offers of given hotels.
Hotel Booking API to book the given hotel rooms.
amadeus-hotel-booking-django

Amadeus Flight Price Analysis in Django
Source code: You can access the source code on GitHub.
The prototype is built with Python/Django and the Amadeus Python SDK. It retrieves flight offers using the Flight Offers Search API for a given itinerary. Then it displays if the cheapest available flight is a good deal based on the Flight Price Analysis API. We finally predict if the trip is for business or leisure using the Trip Purpose Prediction API.

amadeus-flight-price-analysis-django

Amadeus Hotel Search with area safety and POIs
Source code: You can access the source code on GitHub.
The prototype is built by Python/Django and the Amadeus Python SDK, It demonstrates the safety information, POIs and tours for a chosen hotel on a map, using the following APIs:

Hotel List: shows hotels on the map
Points of Interest: shows POIs around the hotel
Tours and Activities: shows bookable tours and activities around the hotel
HERE Maps: displays a map with markers and text bubbles
amadeus-hotel-area-safety-pois-django

Prototypes from community
We have many other prototypes or demo apps that developers in our community built and shared! Explore them below or in Amadeus for Developers -Examples GitHub.

Warning

Projects from communities are examples that have been built and managed by developer community(Discord) and it is not supported or maintained by Amadeus for Developers team. The projects may not be up-to-date.

Use case	Amadeus APIs used	Technology	Details
Trip purpose prediction	Trip Purpose Prediction	Python, django	amadeus-trip-purpose-django
Hotel Search	Hotel Search	Swift	amadeus-hotel-search-swift
Hotel booking engine	Hotel Search, Hotel Booking	Kotlin	amadeus-hotel-booking-android
Flight Search with Artificial intelligence	Flight Offers Search, Flight Choice Prediction, Trip Purpose Prediction and Airport & City Search	Python, django	amadeus-smart-flight-search-django
Flight Search	Flight Offers Search	PHP, wordpress	amadeus-flight-search-wordpress-plugin
Flight Booking engine	Flight Offers Search, Flight Offers price, Flight Create Orders, Airport & City Search	Java, React	amadeus_java_flight_api
Airport & City autocomplete	Airport & City Search	Node, Express, React	amadeus-airport-city-search-mern
Flight Seatmap display	SeatMap Display	React	amadeus-seatmap
Hotel booking engine	Hotel Search, Hotel Booking	React Native	AmadeusNodeServer, AmadeusHotelBookingPart1
Hotel booking engine	Airport & City Search, Hotel Search, Hotel Booking	Node, React	Building-a-Hotel-Booking-App-in-NodeJS-and-React
Map nearby	Points of Interests	Swift	MyPlaces
Flight Booking engine	Flight Offers Search, Flight Offers price, Flight Create Orders, Airport & City Search	Node, Angular	Flight-booking-frontend and backend
Flight Search backend	Flight Offers Search, Airport & City Search	Bootstrap, Vanila JS	Building-a-Flight-Search-Form-with-Bootstrap-and-the-Amadeus-API
Map nearby	Points of Interests	Android	Amadeus_POI_Android  
Hotel booking engine	Hotel Search, Hotel Booking	Ruby on Rails	amadeus-hotel-booking-rubyonrails
Flight status notification service	On-Demand Flight Status	Python	amadeus-async-flight-status
Flight Calendar search	Airport & City Search, Flight Offers Search	Node, Svelte	FlightSearchCalendar  
Airport & City autocomplete	Airport & City Search	Node and Express	Live-Airport-City-Search
Flight Booking	Flight Offers Search, Flight Offers Price, Flight Create Orders	Node, Vue	amadeus-flight-booking-node
amadeus-trip-purpose-django
This project (Link to GitHub) demonstrates how to integrate Amadeus APIs using the Python SDK in a Django application. The end user submits round-trip information via a form and the Trip Purpose Prediction is called. This API predicts if the given journey is for leisure or business purposes.

amadeus-trip-purpose-django

amadeus-hotel-search-swift
This prototype (Link to GitHub) demonstrates a simple iOS hotel search app from scratch using Amadeus Hotel Search API (version 2.1 - decommissioned) and iOS SDK.

amadeus-hotel-search-swift

amadeus-hotel-booking-android
This prototype (Link to GitHub) shows how to use the Android SDK to build a Hotel Booking Engine in Android Studio.

amadeus-hotel-booking-android

amadeus-smart-flight-search-django
This prototype (Link to GitHub) shows how the Air APIs can be integrated with the Django framework and Python SDK, by calling the Flight Choice Prediction and Trip Purpose Prediction. We also call the Flight Offers Search as a more traditional method of flight search and we compare its results with the Flight Choice Prediction ones to show the power of AI.

amadeus-smart-flight-search-django

amadeus-flight-search-wordpress-plugin
This prototype (Link to GitHub) demonstrated how to create a WordPress plugin to build a basic flight search feature using Flight Offers Search API.

amadeus-flight-search-wordpress-plugin

amadeus_java_flight_api
This app (Link to GitHub) is an example of how to use the Amadeus Flight APIs to search and book a flight. The application uses a Spring backend and a React frontend.

amadeus-airport-city-search-mern
This application (Link to GitHub) implements airport and city name autocomplete box powered by the Airport & City Search API. It consists of a simple Node and Express backend that connects to the Amadeus API with Node SDK, and a small React app that talks to a Node/Express backend and use it to obtain the airport name data from Amadeus.

amadeus-seatmap
This prototype (Link to GitHub) demonstrates how to display a flight seatmap using SeatMap Display API with React.

How to build an aircraft seat map in React
amadeus-seatmap

AmadeusNodeServer, AmadeusHotelBookingPart1
This prototype consists of 2 Github repositories (GitHub to Node Server and GitHub to React Native). It demonstrates a Hotel booking application in iOS using React Native. There is a series of blogs to elaborate further to build an app with this prototype.

Building an iOS hotel booking app with React Native - Part 1
Building an iOS hotel booking app with React Native - Part 2
AmadeusNodeServer, AmadeusHotelBookingPart1

amadeus-safeplace
This prototype (Link to GitHub) demonstrates a neighbourhood safety map in Python to let users compare the relative safety levels of different neighbourhoods. You will use the Safe Place API for the safety scores and HERE Maps to visualize them on a map.

How to build a neighbourhood safety map in Python with Amadeus Safe Place
amadeus-safeplace

MyPlaces
This prototype (Link to GitHub) demonstrates an iOS application that finds nearby places and displays them on a map. You will use the Points of Interest API to retrieve the places and MKMapView for the map.

How to get nearby places using Amadeus APIs in iOS
MyPlaces

Building-a-Hotel-Booking-App-in-NodeJS-and-React
This prototype consists of 2 code sets (Github to Backend and Github to Frontend). It demonstrates a complete hotel booking app using Node on the backend and React for the frontend.

Building a hotel booking app with Node.js and React - Part 1

Building a hotel booking app with Node.js and React - Part 2

Building-a-Hotel-Booking-App-in-NodeJS-and-React

Flight-booking-frontend and backend
This prototype consists of 2 code sets (Github to Backend and Github to Frontend). It demonstrates a complete flight booking application using Node in the backend and Angular for the front end.

Build a flight booking app with Angular and Node.js - Part 1
Build a flight booking app with Angular and Node.js - Part 2
Flight-booking-frontend and backend

Building-a-Flight-Search-Form-with-Bootstrap-and-the-Amadeus-API
This prototype consists of 2 code sets (Github to Frontend and Github to Backend). It demonstrates a flight booking engine with Flight Offer Search API using Bootstrap and Vanilla JS for frontend and Express for the backend.

How to build a flight search form using Bootstrap 5 - Part 1
How to build a flight search form using Bootstrap 5 - Part 2
Building-a-Flight-Search-Form-with-Bootstrap-and-the-Amadeus-API

Amadeus_POI_Android
This app (Link to GitHub) demonstrates the usage of Amadeus Points of Interest API to fetch the list of best attractions near the user's current location and displays them on a list as well as a map.

amadeus-hotel-booking-rubyonrails
This prototype (Link to GitHub) demonstrates an end-to-end Hotel booking process, which works in conjunction with 2 APIs, Hotel Search API and Hotel Booking API.

amadeus-async-flight-status
This prototype (Link to GitHub) demonstrates an application with event-driven microservices that asynchronously consume events coming from the API and notifies end users of these events via SMS using Twilio SMS API.

Event-driven microservices for flight status alerts: part 1

Event-driven microservices for flight status alerts: part 2

amadeus-async-flight-status amadeus-async-flight-status

FlightSearchCalendar
This application (Link to GitHub) demonstrates a calendar application to display the flights within a date interval to find the cheapest possible prices using Amadeus APIs.

Live-Airport-City-Search
This application (Link to GitHub) lets you perform a live search for Airports and Cities through the Airport & City Search API. The implementation is done through jQuery Autocomplete with Node and Express as the backend for which connects to the Amadeus API with Node SDK.

Live-Airport-City-Search

amadeus-flight-booking-node
The Amadeus Flight Booking app is built with Node and Vue using the Node SDK. You can find the source code on GitHub

Last update: June 9, 2025

Key API and travel terminology
This glossary delivers guidance on the most common terms used in the tourism and travel industry, ranging from basic concepts to API technical vocabulary. It covers airlines and air travel definitions, as well as topics in hospitality, destination content, and some essential business aspects within the framework of Amadeus for Developers Self-Service offering.

Flights and Trip
Term	Definition
Additional Baggage	Luggage beyond the standard allowance provided by an airline, subject to additional fees.
Aircraft Code	IATA aircraft code .
Airline Code	Airline code following IATA or ICAO standard - e.g. 1X; AF or ESY.
Airline consolidators	Wholesalers of air tickets that usually partner with airlines to get negotiated rates for air tickets, and then resell the air tickets to travel agents or consumers.
Amadeus Office ID	An identification number assigned to travel agencies to access Amadeus system and book reservations.
Amenities	Additional services or features offered to enhance the experience of the passengers, such as food, entertainment, Wi-Fi, extra legroom, baggage allowance, frequent flyer programs, and lounge access. They can vary depending on the class of service and the airline/train company.
ARC Number	An ARC number is a unique identifier issued by the Airlines Reporting Corporation (ARC) to travel agencies in the USA. Similar to an IATA number, it is required to issue tickets and earn commissions.
Automatic Ticketing	Automatic ticketing in flight booking refers to the process of automating ticket issuance, eliminating the need for manual intervention. Some consolidators may require a specific remark in the booking request to enable this process.
Baggage allowance	The amount of luggage that a passenger is allowed to carry on a flight without additional charges.
Booking	The process of reserving a seat on a flight or a room in a hotel.
Cabin	The section of an aircraft or train where passengers sit during their trip. It is divided into different classes, such as first class, business class, and economy class, each one with different amenities and prices.
Commission	Fee paid to intermediaries for booking travel-related services, usually a percentage of the total cost.
Consolidator	Airline consolidators are wholesalers that partner with airlines to secure negotiated fares and resell tickets to travel agents or consumers. Many airline consolidators also act as host agencies for retail travel agencies or online travel startups that lack an International Air Transport Association (IATA) license to issue tickets. To issue tickets through a consolidator, travel startups must establish commercial agreements with them in their target markets.
Carrier Code	2 to 3-character IATA carrier code (IATA table codes).
Country Code	Country code following ISO 3166 Alpha-2 standard.
Delayed Ticketing	Delayed ticketing allows travel agents to postpone ticket issuance until a specified time instead of issuing tickets immediately after booking. This provides agents with more flexibility to collect payments from travelers and the option to cancel without fees within the allowed timeframe.
Direct flight	A flight that goes from one destination to another without any stops in between.
E-ticketing	E-ticketing is the digital process of issuing flight tickets, allowing direct issuance and avoiding airline consolidator fees. However, a consolidator can still be contracted for post-ticketing services. In the Self-Service framework, E-ticketing is not available, and all ticket issuance must be done through a consolidator.
EOS Agreement	An Extended Ownership Security (EOS) agreement controls how data is shared between different office IDs. Before enabling flight booking in Self-Service, we establish an EOS agreement between you and your consolidator, granting them access to a queue of all bookings you generate in production.
Fare	The price of a ticket for a particular flight or travel itinerary.
Fare Rules	The terms and conditions that apply to a specific airline ticket or fare, including restrictions and information on refunds, cancellations, changes, baggage, seat assignments, upgrades, and frequent flyer programs.
Flight Order Id	Unique identifier returned by the Flight Create Orders API .
Full Post Ticketing Capabilities	Full post-ticketing capabilities include all available post-ticketing actions, such as cancellations, changes, and voiding. These actions are only accessible through Amadeus Web Services (SOAP APIs).
Full Service Carrier	A full-service carrier (FSC) is an airline that provides a comprehensive range of services and amenities included in the ticket price.
GDS (Global Distribution System)	A computerized system used by travel agents and airlines to search for and book flights, hotels, rental cars, and other travel-related services
IATA	International Air Transport Association
IATA Code	Code used by IATA to identify locations, airlines and aircraft. For example, the Airport & City Search API returns IATA codes for cities as the iataCode parameter.
ICAO	International Civil Aviation Organization
Incentives	Incentives are commission-based bonuses awarded to travel agents for reaching a specific booking volume. They are not available through our Self-Service APIs.
Instant Ticketing	Instant ticketing is the process of issuing flight tickets immediately after booking.
ISO8601 date format	PnYnMnDTnHnMnS format, e.g. PT2H10M.
Layover	A stopover in a destination en route to the final destination.
LCC	A low-cost carrier (LCC), also known as a budget airline, operates with a focus on minimizing costs to offer lower fares compared to traditional full-service carriers. LCC content is not available through the Self-Service APIs.
Limited Post Ticketing Capabilities	Limited post-ticketing capabilities mean that only partial modifications can be performed after ticket issuance. For full post-ticketing functionality, you must use Amadeus Web Services (SOAP APIs).
Light Ticketing	Light ticketing is a booking method used by low-cost airlines to simplify and streamline ticketing for travel agents. This option is available only through the Enterprise APIs.
Location Id	Amadeus-defined identifier that you can see in the search results when querying Self-Service APIs that retrieve information on geographical locations.
Markups	A markup is an additional amount added by travel agents to the base fare of a flight ticket to cover operational costs and generate profit. Our APIs allow you to freely set markups on top of airline prices.
Manual Ticketing	Manual ticketing requires human intervention to verify, process, and issue tickets. If a booking is not sent to the correct office ID or queue number, manual processing may be necessary. This method is less efficient, more time-consuming, and may incur additional fees from some consolidators.
Multi-stop flight	A flight itinerary that includes stops at multiple destinations before reaching the final destination.
Negotiated Fare	Negotiated fares, also known as consolidator fares, are special discounted rates that airlines or fare consolidators offer exclusively to authorized travel agents. Access to these fares is restricted to the Enterprise APIs.
NDC	NDC (New Distribution Capability) is a travel industry program developed by the International Air Transport Association (IATA) to modernize airline content distribution. It enables travel agents to access richer content and exclusive fares. NDC content is available only through the Enterprise framework.
Non-stop flight	A flight that goes from one destination to another without any stops in between.
Owner Office ID	The Owner Office ID is a unique identifier assigned to a travel agent to associate bookings with their account. It is created during the implementation process. If working with a consolidator, the Owner Office ID will be linked to them, allowing them access to the bookings you generate.
Pricing	The process of determining the cost of a product or service, in the context of travel it refers to the cost of airline tickets, hotel rooms, rental cars.
PNR (Passenger Name Record)	A record in a computer reservation system that contains the details of a passenger's itinerary and contact information.
Post Ticketing Capabilities	Post-ticketing capabilities include actions performed after a flight ticket has been issued, such as changes or cancellations. In the Self-Service framework, full post-ticketing modifications are not available. You can only cancel a flight using Flight Orders Management if the ticket has not yet been issued.
Public Fare	Public fares, also known as published fares, are standard airline rates available to all travel agents. By default, all our APIs return public fares.
Receiver Office ID	The Receiver Office ID is a unique identifier for the office responsible for processing and ticketing a booking. If working with a consolidator, they will provide the necessary Receiver Office ID along with any required queue or category numbers.
Reissue	Reissuance refers to the process of issuing a new ticket to replace an existing one due to itinerary changes. This service is not available through Self-Service APIs, but some consolidators may offer it for an additional fee.
Remarks	In flight booking, remarks are notes added to a Passenger Name Record (PNR) to provide additional booking details. They help ensure all relevant information is captured and communicated effectively. Some consolidators may require specific remarks in the booking request to trigger certain processes.
Reservation vs. Ticket Issued	Booking a flight involves two key steps: generating a flight order and issuing the ticket. The first step includes searching for a flight offer, confirming pricing, and generating a Passenger Name Record (PNR). At this stage, a seat is reserved in the airline's inventory, but the booking remains incomplete. Ticket issuance finalizes the booking when the airline receives payment. Until this happens, the reservation is not valid for travel. (For more details, refer to our guide (https://developers.amadeus.com/get-started/create-a-flight-booking-engine-651) on building a flight booking engine.) In the Self-Service framework, ticket issuance requires a consolidator, even if you are a certified travel agent.
Round-trip	A trip that includes travel to a destination and then back to the original departure point.
Seatmap	A map or diagram of the seating layout in the cabin of an aircraft or train. It shows the location of different types of seats, such as exit row, bulkhead seat, aisle seat, window seat. It can be used to choose a seat or to see the availability of seats for a certain flight.
Self-Service vs. Enterprise API	Amadeus for Developers offers two solutions tailored to different customer needs: Self-Service and Enterprise. The Self-Service offer is designed for independent developers and startups looking for quick and easy integration with Amadeus APIs. These REST/JSON APIs can be accessed and tested within minutes, with a flexible pay-as-you-go pricing model. The catalog includes categories such as Flights, Destination Experience, Car & Transfers, Market Insights, Hotels, and Itinerary Management. The Enterprise offer provides access to the full Amadeus API catalog (REST/JSON and SOAP/XML) and is tailored for companies with scaling needs and leading brands in the travel industry. Enterprise API customers receive dedicated support from account managers and benefit from a customized pricing scheme. Access to Enterprise APIs is granted under specific conditions.
TDIS	The Travel Industry Designator Service (TIDS) is a program by the International Air Transport Association (IATA) that assigns a unique identification code to travel agents and sales intermediaries. This code facilitates recognition and identification of travel sellers. However, a TIDS code alone does not grant the ability to issue bookings independently.
Ticketing	The process of issuing a travel document, typically a paper or electronic ticket, that confirms that a passenger has purchased a seat on a flight, train, bus, or other form of transportation. It can be refundable or non-refundable, one-way or round-trip, and open-jaw.
Travel Classes	Differentiation of service level and amenities offered to passengers on an aircraft or train, like first class, business class, economy class.
Queuing	Queuing involves assigning a booking to a specific queue within a consolidator’s ticketing system. The consolidator may provide a queue number that must be included in the booking request for proper processing.
Hotel
Term	Definition
Hotel Ids	Amadeus Property Codes (8 chars). Comma-separated list of Amadeus Hotel Ids (max. 3). Amadeus Hotel Ids are found in the Hotel Search response (parameter name is hotelId).
Destination content
Term	Definition
Activity Id	Tours and Activities API returns a unique activity Id along with the activity name, short description, geolocation, customer rating, image, price and deep link to the provider page to complete the booking.
Metasearch Engine	Metasearch engines compile fare and availability data from multiple travel agencies and airlines. They operate on an affiliate model, earning commissions based on the referral volume they generate for specific providers.
API technology
Term	Definition
REST APIs	REST (Representational State Transfer) APIs facilitate communication with web services using standard HTTP methods such as GET and POST. These APIs enable efficient data exchange, typically in lightweight formats like JSON. Our Self-Service catalog exclusively supports REST APIs.
SOAP APIs	SOAP (Simple Object Access Protocol) APIs use XML for structured message exchange, adhering to strict protocols that ensure security, reliability, and interoperability. These APIs provide built-in authentication and error-handling mechanisms. SOAP APIs are available exclusively through our Enterprise Web Services.
Common client and server errors
Amadeus for Developers Self-Service APIs use HTTP status codes to communicate whether a request has been successfully processed.

Types of errors
There two main types of errors are:

Client: typically occur when the request has not been properly built.
Server: occur when there is an issue on the server side.
Client errors
If your API request is invalid, you will receive a Client Error response with an HTTP 4xx status code. The body of the response will match the format defined in our swagger schema and provide details about the error.

Authorization errors
400 Bad request - Unsupported grant type

Occurs when using a grant type other than client credentials. For more information, read our Authorization Guide.


{
    "error": "unsupported_grant_type",
    "error_description": "Only client_credentials value is allowed for the body parameter grant_type",
    "code": 38187,
    "title": "Invalid parameters"
}
401 Unauthorized - Invalid access token

Occurs when the access token provided in the Authorization header is expired or not longer valid. You must generate a new token.


{
  "errors": [
      {
        "code": 38190,
        "title": "Invalid access token",
        "detail": "The access token provided in the Authorization header is invalid",
        "status": 401
      }
  ]
}
401 Unauthorized - Invalid client

Occurs when the client credentials have an invalid format and are not recognized.


{
    "error": "invalid_client",
    "error_description": "Client credentials are invalid",
    "code": 38187,
    "title": "Invalid parameters"
}
401 Unauthorized - Invalid HTTP header

The Authorization header is missing or its format invalid, e.g. the required word "Bearer" is wrongly spelled or not present at all in the Authorization header in an API request.


{
    "errors": [
        {
            "code": "38191",
            "title": "Invalid HTTP header",
            "detail": "Missing or invalid format for mandatory Authorization header",
            "status": "401"
        }
    ]
}
401 Unauthorized – Access token expired

The access token sent by the client is expired. Access tokens are only valid for 30 minutes. To ease the generation of access tokens you can use our SDKs.


{
    "errors": [
        {
            "code": 38192,
            "title": "Access token expired",
            "detail": "The access token is expired",
            "status": 401
        }
    ]
}
401 Unauthorized – Access token revoked

The access token has been revoked. Please generate a new one.


{
    "errors": [
        {
            "code": 38193,
            "title": "Access token revoked",
            "detail": "The access token is revoked",
            "status": 401
        }
    ]
}
401 Unauthorized –API revoked

The API credentials have been revoked. This could be because we found it searchable in a public repository, in this case you can generate new keys in your Self-Service workspace. Or it could be that you have unpaid bills and we revoked your access, if that is the case please contact support.


{
    "errors": [
        {
            "code": 39683,
            "title": "API key revoked",
            "detail": "The API key is revoked",
            "status": 401
        }
    ]
}
401 Unauthorized – Invalid API key

The API key used is invalid. Please check for spaces in the end and make sure you are using the correct key and case URL.


{
    "errors": [
        {
            "code": 39686,
            "title": "Invalid API key",
            "detail": "The API key is invalid",
            "status": 401
        }
    ]
}
Data Format Errors
400 Bad request - Invalid format

Occurs when an input query parameter is incorrect. In the example below, the Airport & City Search API returns an error because the location parameter is not in the expected IATA standard.


{
    "errors": [
        {
            "status": 400,
            "code": 477,
            "title": "INVALID FORMAT",
            "detail": "City/Airport - 3 characters [IATA code](https://en.wikipedia.org/wiki/International_Air_Transport_Association_airport_code) from which the traveler will depart.",
            "source": {
                "parameter": "origin"
            }
        }
    ]
}
403 Forbidden

The HTTP protocol is used instead of HTTPS when making the API call. Or you are attempting to reach an endpoint which requires additional permission.


{
    "errors": [
        {
            "code": 38197,
            "title": "Forbidden",
            "detail": "Access forbidden",
            "status": 403
        }
    ]
}
Too Many Requests Errors
429 Too many requests

Too many requests are sent in the given timeframe. Please check our rate limits and adjust accordingly for the targeted environment and API.


{
    "errors": [
        {
            "code": 38194,
            "title": "Too many requests",
            "detail": "The network rate limit is exceeded, please try again later",
            "status": 429
        }
    ]
}
429 Quota limit exceeded

The number of free transactions allowed in test has been reached for this month. Please consider moving your app to production or wait next month to keep using the APIs.


{
    "errors": [
        {
            "code": 38195,
            "title": "Quota limit exceeded",
            "detail": "The quota limit is exceeded.",
            "status": 429
        }
    ]
}
Resource Errors
404 Not found - Resource not found

Occurs when the endpoint or URL does not exist. Make sure you are calling a valid endpoint and that there are no spelling errors.


{
    "errors": [
        {
            "code": 38196,
            "title": "Resource not found",
            "detail": "The targeted resource doesn't exist",
            "status": 404
        }
    ]
}
Server errors
If an error occurs during the execution of your request, you will receive a Server error resonse with an HTTP 5xx status code. The body will match the defined error format, allowing your application to read it and display an appropriate message to the client. It may also contain debugging information which you can submit to us to further investigate the error.

500 Internal error


{
    "errors": [
        {
            "code": 38189,
            "title": "Internal error",
            "detail": "An internal error occured, please contact your administrator",
            "status": 500
        }
    ]
}
Pagination on Self-Service APIs
Amadeus for Developers Self-Service APIs can often return a lot of results. For example, when calling the Safe Place API, you may get a response hundreds of pages long. That's where pagination comes in. Using pagination, you can split the results into different pages to make the responses easier to handle.

Not all Amadeus Self-Service APIs support pagination. The following APIs currently support pagination:

Points of Interest
Airport Nearest Relevant
Airport & City Search
Flight Most Travelled Destinations
Flight Most Booked Destinations
Accessing paginated results
Using SDKs
Amadeus for Developers SDKs make it simple to access paginated results. If the API endpoint supports pagination, you can get page results using the the .next, .previous, .last and .first methods.

Example in Node:


amadeus.referenceData.locations.get({
  keyword: 'LON',
  subType: 'AIRPORT,CITY'
}).then(function(response){
  console.log(response.data); // first page
  return amadeus.next(response);
}).then(function(nextReponse){
  console.log(nextReponse.data); // second page
});
If a page is not available, the response will resolve to null.

The same approach is valid for other languages, such as Ruby:


response = amadeus.reference_data.locations.get(
  keyword: 'LON',
  subType: Amadeus::Location::ANY
)
amadeus.next(response) #=> returns a new response for the next page
In this case, the method will return nil if the page is not available.

Manually parsing the response
The response will contain the following JSON content:


{
  "meta": {
     "count": 28,
     "links": {
        "self": "https://api.amadeus.com/v1/reference-data/locations/airports?latitude=49.0000&longitude=2.55",
        "next": "https://test.api.amadeus.com/v1/reference-data/locations/airports?latitude=49.0000&longitude=2.55&page%5Boffset%5D=10",
        "last": "https://test.api.amadeus.com/v1/reference-data/locations/airports?latitude=49.0000&longitude=2.55&page%5Boffset%5D=18"
     }
  },
  "data": [
     {
       /* large amount of items */
     }
  ]
}
You can access the next page of the results using the value of meta/links/next or meta/links/last node within the JSON response.

Note that indexing elements between pages is done via the page[offset] query parameter. For example, page[offset]=18. The next and last returned in the example above encode the special characters [] as %5B and %5D. This is called percent encoding and is used to encode special characters in the url parameter values.

Rate limits
Rate limits per API
Amadeus Self-Service APIs have two types of rate limits in place to protect against abuse by third parties.

Artificial Intelligence and Partners' APIs
Artificial intelligence APIs and APIs from Amadeus partners' are currently following the rate limits below.

Test and Production
20 transactions per second, per user
No more than 1 request every 50ms
List of APIs with the above rate limits:
Points of Interest
Tours and Activities
Location Score
Airport On-time Performance
Flight Price Analysis
Flight Delay Prediction
Flight Choice Prediction
The other APIs
The rest of Self-Service APIs apart from Artificial intelligence and Partners' APIs are below rate limits per environment.

Test	Production
10 transactions per second, per user	40 transactions per second, per user
No more than 1 request every 100ms	
Rate limits Examples
To manage the rate limits in APIs, there are mainly two options: - Use an external library - Build a request queue from scratch

The right choice depends on your resources and requisites.

Check out the rate limits examples in Node, Python and Java using the respective Amadeus SDKs.

Free test data collection of Self-Service APIs
Amadeus for Developers offers a test environment with free limited data. This allows developers to build and test their applications before deploying them to production. To access real-time data, you will need to move to the production environment.

Warning

It is important to note that the test environment protects our customers and data and it's exclusively intended for development purposes.

Test vs Production
The test environment has the following differences with the production:

Billing	Rate Limits	Data	Base URL
Test	Free monthly quota	10 TPS	Limited, cached	test.api.amadeus.com
Production	Unlimited	40 TPS	Unlimited, real-time	api.amadeus.com
Check out the rate limits guide and pricing page if you want to get more information on the specific topics. In this tutorial you can learn how to build a mock server in Postman to help you consume less of your free quota.

Important

Please note that in the production environment, you will only be charged for API calls that exceed the monthly free limit. Our Flight Order Management API, for instance, may offer a free limit of up to 10,000 calls. So, by registering for production, you can enjoy the benefits of free quotas while accessing our APIs for the latest and unrestricted data without any hidden costs.

API usage
To make sure you don't pass your monthly quota, you can go to My Self-Service Workspace > API usage and quota and review how many transactions you've performed. In case you pass the limit, you will need to wait for the new month and your quota will be renewed.

Information

It may take up to 12 minutes to display your most recent API calls.

The table below details the available test data for each Self-Service API:

Test Data Collection
Flights
API	Test data
Flight Inspiration Search	Cached data including most origin and destination cities.
Flight Cheapest Date Search	Cached data including most origin and destination cities.
Flight Availabilities Search	Cached data including most origin and destination cities/airports.
Airport Routes	Static dataset containing all airport routes in November 2021.
Airline Routes	Static dataset containing all airport routes in November 2021.
Flight Offers Search	Cached data including most origin and destination cities/airports.
Flight Offers Price	Cached data including most origin and destination cities/airports.
Branded Fares Upsell	Cached data including most airlines.
SeatMap Display	Works with the response of Flight Offers Search.
Flight Create Orders	Works with the response of Flight Offers Price.
Flight Order Management	Works with the response of Flight Create Orders.
Flight Price Analysis	Contains the following routes in both test and production environments.
Flight Delay Prediction	No data restrictions in test.
Airport On-time Performance	No data restrictions in test.
Flight Choice Prediction	No data restrictions in test.
On Demand Flight Status	Contains a copy of live data at a given time and real-time updates are not supported. Check out the differences between test and production environment.
Airline Code Lookup	No data restrictions in test.
Airport & City Search	Cities/airports in the United States, Spain, the United Kingdom, Germany and India.
Airport Nearest Relevant	Cities/airports in the United States, Spain, the United Kingdom, Germany and India.
Flight Check-in Links	See list of valid airlines.
Travel Recommendations	No data restrictions in test.
Hotels
API	Test data
Hotel List	See list of valid hotel chains.
Hotel Search	See list of valid hotel chains. Test with major cities like LON or NYC.
Hotel Booking	Works with the response of Hotel Search.
Hotel Ratings	See list of valid hotels.
Hotel Name Autocomplete	Cached data including most hotels available through Amadeus
Destination experiences
API	Test data
Points of Interest	See list of valid cities.
Tours and Activities	See list of valid cities.
City Search	No data restrictions in test.
Itinerary management
API	Test data
Trip Purpose Prediction	No data restrictions in test.
Market insights
API	Test data
Flight Most Traveled Destinations	See list of origin and destination cities/airports.
Flight Most Booked Destinations	See list of origin and destination cities/airports.
Flight Busiest Traveling Period	See list of origin and destination cities/airports.
Location Score	See list of valid cities.
Pricing
Self-Service APIs
How does it work?
Amadeus Self-Service APIs give you instant access to essential travel data and functionalities. In the test environment, you get a free request quota each month to build and fine-tune your apps. When you move to production, you maintain your free request quota and pay only for the additional calls you make.


Test environment
Build for free
Free request quota per month
Test data collection
10 TPS
1 request / 100ms
Unlimited calls
SEE REQUEST QUOTAS
Production environment
Pay as you go
Free request quota per month
Full real-time data
40 TPS
Full parallelization
Unlimited calls
SEE TRANSACTION FEES
Prices & Request Quotas
Search by API name
TEST ENVIRONMENT PRODUCTION ENVIRONMENT
APIS BY CATEGORY
FREE REQUEST QUOTA
WHAT YOU GET
Flights
Build and test apps for
Free
SEE DOCSFlight Offers Search
post
/v2/shopping/flight-offers
2,000
get
/v2/shopping/flight-offers
2,000
SEE DOCSFlight Offers Price
post
/v1/shopping/flight-offers/pricing
3,000
SEE DOCSFlight Create Orders
post
/v1/booking/flight-orders
10,000
SEE DOCSFlight Order Management
get
/v1/booking/flight-orders/*
5,000
delete
/v1/booking/flight-orders/*
5,000
SEE DOCSSeatMap Display
get
/v1/shopping/seatmaps
1,000
post
/v1/shopping/seatmaps
1,000
SEE DOCSBranded Fares Upsell
post
/v1/shopping/flight-offers/upselling
3,000
SEE DOCSFlight Price Analysis
get
/v1/analytics/itinerary-price-metrics
10,000
SEE DOCSFlight Choice Prediction
post
/v2/shopping/flight-offers/prediction
10,000
SEE DOCSFlight Inspiration Search
get
/v1/shopping/flight-destinations
3,000
SEE DOCSFlight Cheapest Date Search
get
/v1/shopping/flight-dates
3,000
SEE DOCSFlight Availabilities Search
post
/v1/shopping/availability/flight-availabilities
3,000
SEE DOCSTravel Recommendations
get
/v1/reference-data/recommended-locations
10,000
SEE DOCSOn Demand Flight Status
get
/v2/schedule/flights
2,000
SEE DOCSFlight Delay Prediction
get
/v1/travel/predictions/flight-delay
10,000
SEE DOCSAirport On-Time Performance
get
/v1/airport/predictions/on-time
10,000
SEE DOCSAirport & City Search
get
/v1/reference-data/locations
7,000
get
/v1/reference-data/locations/*
3,000
SEE DOCSAirport Nearest Relevant
get
/v1/reference-data/locations/airports
10,000
SEE DOCSAirport Routes
get
/v1/airport/direct-destinations
3,000
SEE DOCSFlight Check-in Links
get
/v2/reference-data/urls/checkin-links
10,000
SEE DOCSAirline Code Lookup
get
/v1/reference-data/airlines
10,000
SEE DOCSAirline Routes
get
/v1/airline/destinations
3,000
Destination experiences
Market insights
Cars and Transfers
Hotels
Taxes are not included in the listed prices. Taxes may apply, depending on your country.

 

offer-icon	Making flight bookings? Get a 90% discount on calls to flight search APIs!
If you’re creating bookings with Flight Create Orders in Production, you can get a 90% discount on all calls to Flight Offers Search and Flight Offers Price. To qualify, you must have created paid and uncancelled bookings on the Amadeus Booking System. Discounts will be reflected in your invoice.
 

 

Want to know more information about our billing and quotas?
 

 

Enterprise APIs
Build best-in-class solutions with custom support
Amadeus Enterprise APIs are designed for customers that need custom features, tailored support and pricing for scale. Contact our team for get access to our Enterprise catalog and learn more about our custom packages.

Extensive API catalog and value-add features
Custom pricing to suit your needs
Product and implementation consulting
24/7 dedicated support channels

Legal
Cookies policy
Privacy policy
Amadeus
Amadeus logo
for Developers
© Amadeus IT Group SA

