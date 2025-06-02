
import { supabase } from "@/integrations/supabase/client";
import { TablesInsert, Tables } from "@/integrations/supabase/types";
import { ExtendedTripFormValues, TripRequestResult } from "@/types/form";
import { safeQuery } from "@/lib/supabaseUtils";

/**
 * Create a new trip request in the database
 * @param userId User ID creating the trip
 * @param formData Trip form data
 * @returns Created trip request data
 */
const createTrip = async (
  userId: string, 
  formData: ExtendedTripFormValues
): Promise<Tables<"trip_requests">> => {
  // Create a typed insert object for trip_requests
  const tripRequestData: TablesInsert<"trip_requests"> = {
    user_id: userId,
    earliest_departure: formData.earliestDeparture.toISOString(),
    latest_departure: formData.latestDeparture.toISOString(),
    budget: formData.budget,
    // Include new fields if provided
    departure_airports: formData.departure_airports || [],
    destination_airport: formData.destination_airport || null,
    min_duration: formData.min_duration || 3,
    max_duration: formData.max_duration || 6,
    // Include auto-booking fields
    auto_book: formData.auto_book || false,
    max_price: formData.max_price || null,
    preferred_payment_method_id: formData.preferred_payment_method_id || null
  };
  
  // Insert trip request into Supabase with proper types
  const tripRequestResult = await safeQuery<Tables<"trip_requests">>(() =>
    Promise.resolve(
      supabase
        .from("trip_requests")
        .insert(tripRequestData)
        .select()
        .single()
    )
  );
  
  if (tripRequestResult.error) {
    throw new Error(`Failed to submit trip request: ${tripRequestResult.error.message}`);
  }
  
  return tripRequestResult.data as Tables<"trip_requests">;
};

// Function to create trip request
export const createTripRequest = async (
  userId: string,
  formData: ExtendedTripFormValues
): Promise<TripRequestResult> => {
  // Create the trip request
  const tripRequest = await createTrip(userId, formData);
  
  // Log the trip request parameters for debugging
  console.log(`Trip request created with ID ${tripRequest.id}:`, {
    destination: tripRequest.destination_airport,
    departureAirports: tripRequest.departure_airports,
    budget: tripRequest.budget,
    earliestDeparture: tripRequest.earliest_departure,
    latestDeparture: tripRequest.latest_departure,
    minDuration: tripRequest.min_duration,
    maxDuration: tripRequest.max_duration,
    autoBook: tripRequest.auto_book
  });
  
  // Invoke the flight-search function and await the results
  console.log(`Invoking flight-search function for trip request ${tripRequest.id}`);
  
  // Log detailed search criteria
  console.log('Flight search criteria:', {
    tripId: tripRequest.id,
    destination: tripRequest.destination_airport,
    departureAirports: tripRequest.departure_airports,
    budget: tripRequest.budget,
    earliestDeparture: new Date(tripRequest.earliest_departure).toISOString(),
    latestDeparture: new Date(tripRequest.latest_departure).toISOString(),
    minDuration: tripRequest.min_duration,
    maxDuration: tripRequest.max_duration,
    autoBook: tripRequest.auto_book
  });
  
  // First attempt with strict criteria
  let { data, error } = await supabase.functions.invoke<{
    offers: TablesInsert<"flight_offers">[];
    matchesInserted: number;
    requestsProcessed: number;
    totalDurationMs: number;
    details: any[];
  }>("flight-search", {
    body: { 
      tripRequestId: tripRequest.id,
      debugLevel: 'verbose',
      includeSearchParams: true
    }
  });
  
  // If no matches found with strict criteria, try again with relaxed criteria
  if (!error && data && data.matchesInserted === 0) {
    console.log("No matches found with strict criteria. Trying with relaxed criteria...");
    
    const { data: relaxedData, error: relaxedError } = await supabase.functions.invoke<{
      offers: TablesInsert<"flight_offers">[];
      matchesInserted: number;
      requestsProcessed: number;
      totalDurationMs: number;
      details: any[];
    }>("flight-search", {
      body: { 
        tripRequestId: tripRequest.id,
        relaxCriteria: true,
        debugLevel: 'verbose',
        includeSearchParams: true
      }
    });
    
    if (!relaxedError && relaxedData) {
      data = relaxedData;
      console.log("Completed search with relaxed criteria.");
    } else if (relaxedError) {
      console.error("Error in relaxed criteria search:", relaxedError);
    }
  }

  if (error) {
    console.error("Error invoking flight-search function:", error);
  } else if (data) {
    // Log search results for debugging
    console.log("Flight search completed:", {
      requestsProcessed: data.requestsProcessed,
      matchesInserted: data.matchesInserted,
      totalDurationMs: data.totalDurationMs,
      relaxedCriteriaUsed: data.details?.[0]?.relaxedCriteriaUsed || false,
      offersCount: data.offers?.length || 0
    });
    
    if (data.matchesInserted === 0) {
      console.warn("No flight offers matched the search criteria. Reasons may include:");
      console.warn("- Limited flight availability for the selected dates");
      console.warn("- Destination may have limited service");
      console.warn("- Budget constraints may be too restrictive");
      console.warn("- Duration requirements may be too specific");
      console.warn("- Airlines not serving requested routes");
      
      // Log detailed search parameters to help debug API issues
      console.warn("Search parameters:", {
        destination: tripRequest.destination_airport,
        departureAirports: tripRequest.departure_airports,
        earliestDeparture: tripRequest.earliest_departure,
        latestDeparture: tripRequest.latest_departure,
        budget: tripRequest.budget,
        minDuration: tripRequest.min_duration,
        maxDuration: tripRequest.max_duration
      });
      
      // Log the detailed error codes from the flight API if available
      if (data.details && data.details.length > 0) {
        console.warn("API details:", data.details);
      }
      
      // Suggest potential fixes
      console.info("Potential fixes:");
      console.info("1. Try increasing the budget (e.g., by 25-50%)");
      console.info("2. Try expanding the date range (e.g., ±3-7 days)");
      console.info("3. Check if the destination airport code is valid");
      console.info("4. Try alternative departure airports if available");
    }
  }

  // Return the trip request with any immediate offers from the function
  const offers = data?.offers ?? [];
  const matchesInserted = data?.matchesInserted ?? 0;

  return {
    tripRequest,
    offers,
    matchesInserted
  };
};
