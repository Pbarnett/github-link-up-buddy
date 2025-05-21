
// Mock data generator for flight offers

/**
 * Generate mock flight offers based on trip criteria
 */
export const generateMockOffers = (tripData, tripRequestId) => {
  // Generate dates for departures and returns based on the trip parameters
  const startDate = new Date(tripData.earliestDeparture);
  const endDate = new Date(tripData.latestDeparture);
  const dayDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Get the min and max duration, defaulting to reasonable values if not provided
  const minDuration = tripData.min_duration || 3;
  const maxDuration = tripData.max_duration || 6;
  
  // Airlines and flight durations for mock data
  const airlines = [
    "Delta Airlines",
    "United Airways", 
    "American Airlines",
    "JetBlue",
    "Southwest",
    "Alaska Airlines",
    "British Airways"
  ];
  
  const durations = ["1h 45m", "2h 15m", "2h 30m", "2h 45m", "3h 05m", "3h 25m"];
  
  // Generate 5-8 mock offers
  const numOffers = Math.floor(Math.random() * 4) + 5;
  const offers = [];
  
  for (let i = 0; i < numOffers; i++) {
    // Random departure date between earliest and latest departure
    const departDaysOffset = Math.floor(Math.random() * (dayDiff + 1));
    const departDate = new Date(startDate);
    departDate.setDate(departDate.getDate() + departDaysOffset);
    
    // Generate a random trip duration between min and max
    const tripDuration = Math.floor(Math.random() * (maxDuration - minDuration + 1)) + minDuration;
    
    // Return date based on calculated trip duration
    const returnDate = new Date(departDate);
    returnDate.setDate(returnDate.getDate() + tripDuration);
    
    // Random price around budget with some variation
    const priceVariation = Math.random() * 0.3 - 0.15; // -15% to +15%
    const price = Math.round(tripData.budget * (1 + priceVariation));
    
    // Random airline and flight duration
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const duration = durations[Math.floor(Math.random() * durations.length)];
    
    // Random flight number
    const flightCode = airline.substring(0, 2).toUpperCase();
    const flightNumber = `${flightCode}${1000 + Math.floor(Math.random() * 9000)}`;
    
    // Random departure and return times
    const hours = ["06", "08", "10", "12", "14", "16", "18", "20"];
    const minutes = ["00", "15", "30", "45"];
    const departureTime = `${hours[Math.floor(Math.random() * hours.length)]}:${minutes[Math.floor(Math.random() * minutes.length)]}`;
    const returnTime = `${hours[Math.floor(Math.random() * hours.length)]}:${minutes[Math.floor(Math.random() * minutes.length)]}`;
    
    offers.push({
      trip_request_id: tripRequestId,
      airline,
      flight_number: flightNumber,
      departure_date: departDate.toISOString().split('T')[0],
      departure_time: departureTime,
      return_date: returnDate.toISOString().split('T')[0],
      return_time: returnTime,
      duration,
      price
    });
  }
  
  return offers;
};
