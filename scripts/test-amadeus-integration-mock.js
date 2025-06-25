#!/usr/bin/env node

/**
 * Mock Amadeus API integration test
 * This demonstrates the integration pattern with mock data
 * Run with: node scripts/test-amadeus-integration-mock.js
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

const AMADEUS_BASE_URL = process.env.AMADEUS_BASE_URL || 'https://test.api.amadeus.com';

// Mock response that matches Amadeus API structure
const mockFlightSearchResponse = {
  meta: {
    count: 2,
    links: {
      self: "https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=NYC&destinationLocationCode=LAX&departureDate=2024-12-15&adults=1&max=3"
    }
  },
  data: [
    {
      type: "flight-offer",
      id: "1",
      source: "GDS",
      instantTicketingRequired: false,
      disablePricing: false,
      lastTicketingDate: "2024-12-15",
      numberOfBookableSeats: 9,
      itineraries: [
        {
          duration: "PT6H30M",
          segments: [
            {
              departure: {
                iataCode: "JFK",
                terminal: "4",
                at: "2024-12-15T08:00:00"
              },
              arrival: {
                iataCode: "LAX",
                terminal: "4",
                at: "2024-12-15T11:30:00"
              },
              carrierCode: "AA",
              number: "123",
              aircraft: {
                code: "321"
              },
              operating: {
                carrierCode: "AA"
              },
              duration: "PT6H30M",
              id: "1",
              numberOfStops: 0,
              blacklistedInEU: false
            }
          ]
        }
      ],
      price: {
        currency: "USD",
        total: "325.00",
        base: "275.00",
        fees: [
          {
            amount: "50.00",
            type: "SUPPLIER"
          }
        ]
      },
      pricingOptions: {
        fareType: ["PUBLISHED"],
        includedCheckedBagsOnly: true
      },
      validatingAirlineCodes: ["AA"],
      travelerPricings: [
        {
          travelerId: "1",
          fareOption: "STANDARD",
          travelerType: "ADULT",
          price: {
            currency: "USD",
            total: "325.00",
            base: "275.00"
          },
          fareDetailsBySegment: [
            {
              segmentId: "1",
              cabin: "ECONOMY",
              fareBasis: "Y",
              class: "Y",
              includedCheckedBags: {
                quantity: 0
              }
            }
          ]
        }
      ]
    },
    {
      type: "flight-offer",
      id: "2",
      source: "GDS",
      instantTicketingRequired: false,
      disablePricing: false,
      lastTicketingDate: "2024-12-15",
      numberOfBookableSeats: 5,
      itineraries: [
        {
          duration: "PT7H45M",
          segments: [
            {
              departure: {
                iataCode: "LGA",
                terminal: "B",
                at: "2024-12-15T14:30:00"
              },
              arrival: {
                iataCode: "DEN",
                terminal: "A",
                at: "2024-12-15T16:45:00"
              },
              carrierCode: "UA",
              number: "456",
              aircraft: {
                code: "737"
              },
              operating: {
                carrierCode: "UA"
              },
              duration: "PT4H15M",
              id: "2",
              numberOfStops: 0,
              blacklistedInEU: false
            },
            {
              departure: {
                iataCode: "DEN",
                terminal: "A",
                at: "2024-12-15T18:15:00"
              },
              arrival: {
                iataCode: "LAX",
                terminal: "7",
                at: "2024-12-15T19:15:00"
              },
              carrierCode: "UA",
              number: "789",
              aircraft: {
                code: "737"
              },
              operating: {
                carrierCode: "UA"
              },
              duration: "PT3H00M",
              id: "3",
              numberOfStops: 0,
              blacklistedInEU: false
            }
          ]
        }
      ],
      price: {
        currency: "USD",
        total: "289.50",
        base: "245.50",
        fees: [
          {
            amount: "44.00",
            type: "SUPPLIER"
          }
        ]
      },
      pricingOptions: {
        fareType: ["PUBLISHED"],
        includedCheckedBagsOnly: true
      },
      validatingAirlineCodes: ["UA"],
      travelerPricings: [
        {
          travelerId: "1",
          fareOption: "STANDARD",
          travelerType: "ADULT",
          price: {
            currency: "USD",
            total: "289.50",
            base: "245.50"
          },
          fareDetailsBySegment: [
            {
              segmentId: "2",
              cabin: "ECONOMY",
              fareBasis: "Y",
              class: "Y",
              includedCheckedBags: {
                quantity: 0
              }
            },
            {
              segmentId: "3",
              cabin: "ECONOMY",
              fareBasis: "Y",
              class: "Y",
              includedCheckedBags: {
                quantity: 0
              }
            }
          ]
        }
      ]
    }
  ]
};

async function testDataTransformation() {
  console.log('🔄 Testing Amadeus response data transformation...');
  
  const searchResults = mockFlightSearchResponse;
  
  console.log(`✅ Found ${searchResults.data?.length || 0} flight offers`);
  
  if (searchResults.data && searchResults.data.length > 0) {
    const offer = searchResults.data[0];
    console.log('📄 Sample offer structure:');
    console.log(`   ID: ${offer.id}`);
    console.log(`   Price: ${offer.price.total} ${offer.price.currency}`);
    console.log(`   Itineraries: ${offer.itineraries.length}`);
    console.log(`   First segment: ${offer.itineraries[0].segments[0].departure.iataCode} → ${offer.itineraries[0].segments[0].arrival.iataCode}`);
    console.log(`   Departure: ${offer.itineraries[0].segments[0].departure.at}`);
    
    // Test pricing structure
    const secondOffer = searchResults.data[1];
    console.log('\n💰 Second offer (with connection):');
    console.log(`   Price: ${secondOffer.price.total} ${secondOffer.price.currency}`);
    console.log(`   Segments: ${secondOffer.itineraries[0].segments.length}`);
    if (secondOffer.itineraries[0].segments.length > 1) {
      console.log(`   Connection: ${secondOffer.itineraries[0].segments[0].arrival.iataCode} (${secondOffer.itineraries[0].segments[1].departure.at})`);
    }
  }
  
  return searchResults;
}

async function testOfferStructure() {
  console.log('\n🧪 Testing flight offer structure validation...');
  
  const offer = mockFlightSearchResponse.data[0];
  
  // Test required fields that our edge function expects
  const requiredFields = [
    'id',
    'price.total',
    'price.currency',
    'itineraries',
    'travelerPricings',
    'validatingAirlineCodes'
  ];
  
  const missingFields = [];
  
  requiredFields.forEach(field => {
    const keys = field.split('.');
    let current = offer;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        missingFields.push(field);
        break;
      }
    }
  });
  
  if (missingFields.length === 0) {
    console.log('✅ All required fields present');
  } else {
    console.log(`❌ Missing fields: ${missingFields.join(', ')}`);
  }
  
  // Test segment structure
  const segment = offer.itineraries[0].segments[0];
  const segmentFields = ['departure.iataCode', 'arrival.iataCode', 'departure.at', 'carrierCode', 'number'];
  
  const missingSegmentFields = [];
  segmentFields.forEach(field => {
    const keys = field.split('.');
    let current = segment;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        missingSegmentFields.push(field);
        break;
      }
    }
  });
  
  if (missingSegmentFields.length === 0) {
    console.log('✅ All segment fields present');
  } else {
    console.log(`❌ Missing segment fields: ${missingSegmentFields.join(', ')}`);
  }
}

async function main() {
  try {
    console.log('🚀 Starting Mock Amadeus API Integration Test\n');
    
    console.log(`📡 Target Amadeus API: ${AMADEUS_BASE_URL}`);
    console.log(`📋 Testing data transformation and structure validation\n`);
    
    // Test data transformation
    await testDataTransformation();
    
    // Test offer structure
    await testOfferStructure();
    
    console.log('\n✅ Mock integration test completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Get valid Amadeus API credentials:');
    console.log('   - Visit https://developers.amadeus.com/');
    console.log('   - Create an account and get test API credentials');
    console.log('   - Update AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET in .env');
    console.log('2. Run: node scripts/test-amadeus-integration.js');
    console.log('3. Update edge function to use real API calls');
    console.log('4. Fix data transformation to match Amadeus response');
    
  } catch (error) {
    console.error('\n❌ Mock integration test failed:', error.message);
    process.exit(1);
  }
}

main();
