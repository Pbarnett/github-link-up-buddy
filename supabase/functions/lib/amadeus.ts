const amadeusClientId = Deno.env.get("AMADEUS_CLIENT_ID");
const amadeusClientSecret = Deno.env.get("AMADEUS_CLIENT_SECRET");
if (!amadeusClientId || !amadeusClientSecret) {
  console.error('Error: Missing Amadeus environment variables. AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET must be set.');
  throw new Error('Edge Function: Missing Amadeus environment variables (AMADEUS_CLIENT_ID or AMADEUS_CLIENT_SECRET).');
}


// Amadeus booking integration wrapper

export interface TravelerData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE";
  documents?: {
    type: string;
    number: string;
    expiryDate?: string;
    nationality?: string;
  }[];
}

export interface BookingResponse {
  success: boolean;
  bookingReference?: string;
  error?: string;
  confirmationNumber?: string;
  bookingData?: any;
}

async function getAmadeusAccessToken(): Promise<string> {
  const baseUrl = Deno.env.get("AMADEUS_BASE_URL");
  const clientId = Deno.env.get("AMADEUS_CLIENT_ID");
  const clientSecret = Deno.env.get("AMADEUS_CLIENT_SECRET");

  if (!baseUrl || !clientId || !clientSecret) {
    throw new Error("Missing Amadeus credentials in environment variables");
  }

  const response = await fetch(`${baseUrl}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get Amadeus access token: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

export async function bookWithAmadeus(
  offerData: any,
  travelerData: TravelerData
): Promise<BookingResponse> {
  try {
    console.log("Booking flight with Amadeus...");
    console.log("Offer data:", offerData);
    console.log("Traveler data:", travelerData);

    const baseUrl = Deno.env.get("AMADEUS_BASE_URL");
    
    if (!baseUrl) {
      throw new Error("AMADEUS_BASE_URL not configured");
    }

    // Get access token
    const accessToken = await getAmadeusAccessToken();
    
    // Prepare booking request payload
    const bookingPayload = {
      data: {
        type: "flight-order",
        flightOffers: [offerData],
        travelers: [
          {
            id: "1",
            dateOfBirth: travelerData.dateOfBirth || "1990-01-01",
            name: {
              firstName: travelerData.firstName,
              lastName: travelerData.lastName,
            },
            gender: travelerData.gender || "MALE",
            contact: {
              emailAddress: travelerData.email,
              phones: travelerData.phone ? [
                {
                  deviceType: "MOBILE",
                  countryCallingCode: "1",
                  number: travelerData.phone,
                }
              ] : [],
            },
            documents: travelerData.documents || [
              {
                documentType: "PASSPORT",
                birthPlace: "Madrid",
                issuanceLocation: "Madrid",
                issuanceDate: "2015-04-14",
                number: "00000000",
                expiryDate: "2025-04-14",
                issuanceCountry: "ES",
                validityCountry: "ES",
                nationality: "ES",
                holder: true,
              }
            ],
          }
        ],
      }
    };

    console.log("Making Amadeus booking request...");
    
    // Make the booking request
    const response = await fetch(`${baseUrl}/v1/booking/flight-orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/vnd.amadeus+json',
      },
      body: JSON.stringify(bookingPayload),
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      console.error("Amadeus booking failed:", responseData);
      return {
        success: false,
        error: responseData.errors?.[0]?.detail || `Amadeus API error: ${response.status}`,
      };
    }

    console.log("Amadeus booking successful:", responseData);
    
    return {
      success: true,
      bookingReference: responseData.data?.id || `AM${Date.now()}`,
      confirmationNumber: responseData.data?.associatedRecords?.[0]?.reference || 
                         `CONF${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      bookingData: responseData.data,
    };
  } catch (error) {
    console.error("Amadeus booking error:", error);
    return {
      success: false,
      error: error.message || "Unknown booking error",
    };
  }
}
