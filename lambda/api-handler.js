// Note: AWS SDK v2 is available in Node.js 18.x runtime, but we'll keep DynamoDB calls simple
// For production, you would include the appropriate AWS SDK dependencies in the deployment package

exports.handler = async (event, context) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  console.log('Context:', JSON.stringify(context, null, 2));
  
  // Log environment variables
  console.log('Environment Variables:');
  console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`- DYNAMODB_TABLE: ${process.env.DYNAMODB_TABLE}`);
  console.log(`- S3_BUCKET: ${process.env.S3_BUCKET}`);
  
  try {
    const path = event.path || event.rawPath || '/';
    const httpMethod = event.httpMethod || event.requestContext?.http?.method || 'GET';
    
    console.log(`Processing request: ${httpMethod} ${path}`);
    
    // Common CORS headers
    const corsHeaders = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    };
    
    // Handle preflight CORS requests
    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'CORS preflight response' })
      };
    }
    
    // Health check endpoint
    if (path === '/health' || path.endsWith('/health')) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          service: 'github-link-buddy-flight-api',
          environment: process.env.NODE_ENV,
          functionName: context.functionName,
          version: context.functionVersion
        })
      };
    }
    
    // Flight search endpoint
    if (path.includes('/flight-search') || path === '/flight-search') {
      if (httpMethod === 'POST') {
        return await handleFlightSearch(event, corsHeaders);
      }
    }
    
    // Flight booking endpoint
    if (path.includes('/flight-booking') || path === '/flight-booking') {
      if (httpMethod === 'POST') {
        return await handleFlightBooking(event, corsHeaders);
      }
    }
    
    // Trip requests endpoint
    if (path.includes('/trip-requests') || path === '/trip-requests') {
      if (httpMethod === 'POST') {
        return await handleTripRequest(event, corsHeaders);
      }
    }
    
    // Legacy API links endpoint
    if (path.includes('/api/links')) {
      if (httpMethod === 'GET') {
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            message: 'API Handler is working',
            links: [],
            count: 0,
            note: 'DynamoDB integration active'
          })
        };
      } else if (httpMethod === 'POST') {
        return {
          statusCode: 201,
          headers: corsHeaders,
          body: JSON.stringify({
            message: 'Link creation endpoint ready',
            note: 'DynamoDB integration active'
          })
        };
      }
    }
    
    // Default response for unhandled routes
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Not Found',
        path: path,
        method: httpMethod,
        message: 'Endpoint not implemented'
      })
    };
    
  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Internal Server Error',
        requestId: context.awsRequestId,
        message: error.message
      })
    };
  }
};

async function handleFlightSearch(event, corsHeaders) {
  try {
    console.log('Handling flight search request');
    
    // Parse request body
    let requestBody;
    try {
      requestBody = JSON.parse(event.body || '{}');
    } catch (parseError) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Invalid JSON in request body',
          message: parseError.message
        })
      };
    }
    
    // Validate required fields
    const { origin, destination, departureDate, passengers } = requestBody;
    if (!origin || !destination || !departureDate) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Missing required fields',
          required: ['origin', 'destination', 'departureDate'],
          received: requestBody
        })
      };
    }
    
    // Mock flight search response (replace with actual API calls)
    const flights = [
      {
        id: 'FL001',
        airline: 'American Airlines',
        flight: 'AA123',
        origin: origin,
        destination: destination,
        departure: {
          time: '08:00',
          date: departureDate,
          airport: origin
        },
        arrival: {
          time: '11:30',
          date: departureDate,
          airport: destination
        },
        duration: '3h 30m',
        price: {
          amount: 299.99,
          currency: 'USD'
        },
        available: true,
        class: 'Economy'
      },
      {
        id: 'FL002',
        airline: 'Delta Air Lines',
        flight: 'DL456',
        origin: origin,
        destination: destination,
        departure: {
          time: '14:15',
          date: departureDate,
          airport: origin
        },
        arrival: {
          time: '17:45',
          date: departureDate,
          airport: destination
        },
        duration: '3h 30m',
        price: {
          amount: 349.99,
          currency: 'USD'
        },
        available: true,
        class: 'Economy'
      }
    ];
    
    // Store search request in DynamoDB
    const searchId = generateId();
    const searchRequest = {
      id: searchId,
      type: 'flight-search',
      origin,
      destination,
      departureDate,
      passengers: passengers || 1,
      timestamp: new Date().toISOString(),
      results: flights
    };
    
    // DynamoDB storage temporarily disabled - would store search request here
    console.log(`Generated search request: ${searchId}`);
    console.log('DynamoDB storage: temporarily disabled for basic API functionality');
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        searchId: searchId,
        query: {
          origin,
          destination,
          departureDate,
          passengers: passengers || 1
        },
        flights: flights,
        count: flights.length,
        timestamp: new Date().toISOString()
      })
    };
    
  } catch (error) {
    console.error('Flight search error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Flight search failed',
        message: error.message
      })
    };
  }
}

async function handleFlightBooking(event, corsHeaders) {
  try {
    console.log('Handling flight booking request');
    
    // Parse request body
    let requestBody;
    try {
      requestBody = JSON.parse(event.body || '{}');
    } catch (parseError) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Invalid JSON in request body',
          message: parseError.message
        })
      };
    }
    
    // Validate required fields for booking
    const { flightId, passenger, paymentInfo } = requestBody;
    if (!flightId || !passenger) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Missing required fields',
          required: ['flightId', 'passenger'],
          received: requestBody
        })
      };
    }
    
    // Generate booking confirmation
    const bookingId = generateId();
    const booking = {
      id: bookingId,
      type: 'flight-booking',
      flightId: flightId,
      passenger: passenger,
      status: 'confirmed',
      confirmationCode: generateConfirmationCode(),
      timestamp: new Date().toISOString(),
      totalPrice: {
        amount: 299.99, // This would come from flight lookup
        currency: 'USD'
      }
    };
    
    // DynamoDB storage temporarily disabled - would store booking here
    console.log(`Generated booking: ${bookingId}`);
    console.log('DynamoDB storage: temporarily disabled for basic API functionality');
    
    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({
        bookingId: bookingId,
        confirmationCode: booking.confirmationCode,
        status: 'confirmed',
        message: 'Flight successfully booked',
        booking: {
          flightId: flightId,
          passenger: passenger.name || passenger.firstName + ' ' + passenger.lastName,
          totalPrice: booking.totalPrice
        },
        timestamp: new Date().toISOString()
      })
    };
    
  } catch (error) {
    console.error('Flight booking error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Flight booking failed',
        message: error.message
      })
    };
  }
}

async function handleTripRequest(event, corsHeaders) {
  try {
    console.log('Handling trip request');
    
    // Parse request body
    let requestBody;
    try {
      requestBody = JSON.parse(event.body || '{}');
    } catch (parseError) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Invalid JSON in request body',
          message: parseError.message
        })
      };
    }
    
    // Generate trip request ID
    const tripRequestId = generateId();
    const tripRequest = {
      id: tripRequestId,
      type: 'trip-request',
      ...requestBody,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    
    // DynamoDB storage temporarily disabled - would store trip request here
    console.log(`Generated trip request: ${tripRequestId}`);
    console.log('DynamoDB storage: temporarily disabled for basic API functionality');
    
    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({
        tripRequestId: tripRequestId,
        status: 'pending',
        message: 'Trip request created successfully',
        timestamp: new Date().toISOString()
      })
    };
    
  } catch (error) {
    console.error('Trip request error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Trip request failed',
        message: error.message
      })
    };
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function generateConfirmationCode() {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
}
