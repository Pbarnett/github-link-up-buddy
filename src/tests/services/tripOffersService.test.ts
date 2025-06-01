import { describe, it, expect } from 'vitest';
import { isValidDuration, debugInspectTripOffers } from '@/services/tripOffersService';
import { supabase } from '@/integrations/supabase/client';

describe('Duration validation', () => {
  it('should validate ISO 8601 duration formats correctly', () => {
    // Test cases for PT format (ISO 8601)
    expect(isValidDuration('PT4H15M')).toBe(true); // 4 hours 15 minutes
    expect(isValidDuration('PT7H10M')).toBe(true); // 7 hours 10 minutes
    expect(isValidDuration('PT2H')).toBe(true);    // 2 hours only
    expect(isValidDuration('PT0H30M')).toBe(true); // 30 minutes
    
    // Invalid ISO 8601 formats
    expect(isValidDuration('PT')).toBe(false);     // Missing hours and minutes
    expect(isValidDuration('PT15M')).toBe(true);   // Only minutes is valid in ISO format
    expect(isValidDuration('P4H15M')).toBe(false); // Missing T
  });

  it('should validate human-readable duration formats correctly', () => {
    // Test cases for human-readable format
    expect(isValidDuration('4h 15m')).toBe(true);  // 4 hours 15 minutes
    expect(isValidDuration('4h')).toBe(true);      // 4 hours only
    expect(isValidDuration('4h15m')).toBe(true);   // No space
    expect(isValidDuration('4h  15m')).toBe(true); // Multiple spaces
    
    // Invalid human-readable formats
    expect(isValidDuration('h 15m')).toBe(false);  // Missing hours value
    expect(isValidDuration('4 15m')).toBe(false);  // Missing h
    expect(isValidDuration('15m')).toBe(false);    // Missing hours part
  });

  it('should validate the sample data formats from the flight search results', () => {
    // Sample data from real flight offers
    expect(isValidDuration('PT4H15M')).toBe(true); // B6 flight 318
    expect(isValidDuration('PT7H10M')).toBe(true); // B6 flight 5907 and 9K flight 101
  });
});

describe('Trip offers inspection', () => {
  it('should find any available flight offers', async () => {
    try {
      // First try to get any flight offers from the database
      const { data: anyOffer } = await supabase
        .from('flight_offers')
        .select('trip_request_id')
        .single(); // Get just one row
      
      console.log('Found offer:', !!anyOffer);
      
      if (anyOffer) {
        const tripId = anyOffer.trip_request_id;
        console.log('Using trip ID:', tripId);
        
        const rawOffers = await debugInspectTripOffers(tripId);
        console.log('Raw offers found:', rawOffers.length);
        
        if (rawOffers.length > 0) {
          console.log('Sample duration formats:', 
            rawOffers.slice(0, 3).map(o => o.duration));
          console.log('First offer:', JSON.stringify(rawOffers[0], null, 2));
        }
           } else {
        console.log('No flight offers found in the database');
        
        // Fall back to previous test case with fixed ID for reference
        const tripId = '8a92e9d4-3c47-4b96-9af7-b4fd57344288';
        const rawOffers = await debugInspectTripOffers(tripId);
        console.log('Using fallback trip ID:', tripId);
        console.log('Raw offers found:', rawOffers.length);
      }
    } catch (error) {
      console.error('Error searching for flight offers:', error);
      
      // Fall back to previous test case with fixed ID for reference
      const tripId = '8a92e9d4-3c47-4b96-9af7-b4fd57344288';
      const rawOffers = await debugInspectTripOffers(tripId);
      console.log('Using fallback trip ID (after error):', tripId);
      console.log('Raw offers found:', rawOffers.length);
    }
  }, 30000); // Increase timeout for database operations
});
