
// Utility functions
// Removed unused log function
  console.log(`[${timestamp}] ${(level || "INFO").toUpperCase()}: ${message}`);

// Test script to validate Amadeus API connection
const TEST_AMADEUS_API = async () => {
  console.log('🔍 Testing Amadeus API Connection...');
  
  // Environment variables from supabase/.env
  const AMADEUS_BASE_URL = 'https://test.api.amadeus.com';
  const AMADEUS_CLIENT_ID = 'oVt5oBTEQyIiTqEvUILwBB2FmjzdOgS4';
  const AMADEUS_CLIENT_SECRET = 'xb4r5i8a5qBCyVZx';
  
  try {
    // Step 1: Get Access Token
    console.log('Step 1: Getting Amadeus access token...');
    const tokenResponse = await fetch(`${AMADEUS_BASE_URL}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: AMADEUS_CLIENT_ID,
        client_secret: AMADEUS_CLIENT_SECRET,
      }),
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('❌ Token request failed:', tokenResponse.status, errorText);
      return;
    }
    
    const tokenData = await tokenResponse.json();
    console.log('✅ Access token obtained successfully');
    console.log('Token expires in:', tokenData.expires_in, 'seconds');
    
    // Step 2: Test Flight Search
    console.log('Step 2: Testing flight search...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 7); // 7 days from now
    const returnDate = new Date(tomorrow);
    returnDate.setDate(returnDate.getDate() + 5); // 5 days later
    
    const searchParams = new URLSearchParams({
      originLocationCode: 'JFK',
      destinationLocationCode: 'LAX',
      departureDate: tomorrow.toISOString().split('T')[0],
      returnDate: returnDate.toISOString().split('T')[0],
      adults: '1',
      max: '5',
      currencyCode: 'USD'
    });
    
    console.log('Searching for flights:');
    console.log('- Route: JFK → LAX');
    console.log('- Departure:', tomorrow.toISOString().split('T')[0]);
    console.log('- Return:', returnDate.toISOString().split('T')[0]);
    
    const searchResponse = await fetch(`${AMADEUS_BASE_URL}/v2/shopping/flight-offers?${searchParams.toString()}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${tokenData.access_token}` },
    });
    
    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error('❌ Flight search failed:', searchResponse.status, errorText);
      return;
    }
    
    const flightData = await searchResponse.json();
    console.log('✅ Flight search successful');
    console.log('Found flights:', flightData.data?.length || 0);
    
    if (flightData.data && flightData.data.length > 0) {
      console.log('Sample flight offer:');
      const firstOffer = flightData.data[0];
      console.log('- Flight ID:', firstOffer.id);
      console.log('- Price:', firstOffer.price.total, firstOffer.price.currency);
      console.log('- Validating Airlines:', firstOffer.validatingAirlineCodes);
      console.log('- One Way:', firstOffer.oneWay);
      console.log('- Itineraries:', firstOffer.itineraries.length);
    }
    
    // Step 3: Test Location Search
    console.log('Step 3: Testing location search...');
    const locationParams = new URLSearchParams({
      subType: 'AIRPORT,CITY',
      keyword: 'New York',
    });
    
    const locationResponse = await fetch(`${AMADEUS_BASE_URL}/v1/reference-data/locations?${locationParams.toString()}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${tokenData.access_token}` },
    });
    
    if (!locationResponse.ok) {
      const errorText = await locationResponse.text();
      console.error('❌ Location search failed:', locationResponse.status, errorText);
      return;
    }
    
    const locationData = await locationResponse.json();
    console.log('✅ Location search successful');
    console.log('Found locations:', locationData.data?.length || 0);
    
    if (locationData.data && locationData.data.length > 0) {
      console.log('Sample location:');
      const firstLocation = locationData.data[0];
      console.log('- Name:', firstLocation.name);
      console.log('- IATA Code:', firstLocation.iataCode);
      console.log('- City:', firstLocation.address?.cityName);
      console.log('- Country:', firstLocation.address?.countryName);
    }
    
    console.log('\n🎉 All Amadeus API tests passed!');
    
  } catch {
    console.error('❌ Test failed with error:', error);
  }

// Run the test
TEST_AMADEUS_API();
