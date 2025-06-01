import { describe, it, expect } from 'vitest';
import { isValidDuration, fetchTripOffers } from '../services/tripOffersService';

// This test file verifies that our duration validation works with ISO 8601 formats
describe('Duration validation for trip offers', () => {
  it('should validate ISO 8601 durations properly', () => {
    // ISO 8601 formats from our database
    expect(isValidDuration('PT4H15M')).toBe(true);  // 4 hours 15 minutes
    expect(isValidDuration('PT7H10M')).toBe(true);  // 7 hours 10 minutes
    expect(isValidDuration('PT2H')).toBe(true);     // 2 hours only
    expect(isValidDuration('PT15M')).toBe(true);    // 15 minutes only
    
    // Invalid formats
    expect(isValidDuration('PT')).toBe(false);      // Missing time components
    expect(isValidDuration('4H15M')).toBe(false);   // Missing PT prefix
    expect(isValidDuration('invalid')).toBe(false); // Completely invalid
  });
  
  it('should validate human-readable durations properly', () => {
    // Human readable formats
    expect(isValidDuration('4h 15m')).toBe(true);   // 4 hours 15 minutes
    expect(isValidDuration('4h')).toBe(true);       // 4 hours only
    expect(isValidDuration('2h 30m')).toBe(true);   // 2 hours 30 minutes
    
    // Invalid formats
    expect(isValidDuration('4 hours')).toBe(false); // Wrong format for hours
    expect(isValidDuration('15m')).toBe(false);     // Minutes only not supported in human format
    expect(isValidDuration('h 15m')).toBe(false);   // Missing hour number
  });
  
  it('should handle edge cases correctly', () => {
    expect(isValidDuration('')).toBe(false);        // Empty string
    expect(isValidDuration('PT0H0M')).toBe(true);   // Zero duration
    expect(isValidDuration('PT999H999M')).toBe(true); // Very long duration
  });
});

// This test fetches actual trip offers and verifies the duration formats
describe('Trip offers from real data', () => {
  it('should fetch valid offers for the specified trip ID', async () => {
    const tripId = '8a92e9d4-3c47-4b96-9af7-b4fd57344288';
    const result = await fetchTripOffers(tripId, 0, 20);
    
    console.log('Total offers found:', result.total);
    expect(result.total).toBeGreaterThan(0);
    expect(result.offers.length).toBeGreaterThan(0);
    
    // Log duration formats for the first 5 offers
    const durationsToCheck = result.offers.slice(0, 5).map(offer => offer.duration);
    console.log('First 5 duration formats:', durationsToCheck);
    
    // Verify our validation works for all offers
    let validCount = 0;
    let invalidCount = 0;
    let invalidDurations: string[] = [];
    
    result.offers.forEach(offer => {
      if (isValidDuration(offer.duration)) {
        validCount++;
      } else {
        invalidCount++;
        invalidDurations.push(offer.duration);
      }
    });
    
    console.log(`Valid durations: ${validCount}, Invalid: ${invalidCount}`);
    if (invalidCount > 0) {
      console.log('Invalid duration examples:', invalidDurations.slice(0, 5));
    }
    
    // We expect all durations to be valid
    expect(invalidCount).toBe(0);
  }, 30000);  // 30 second timeout for API call
});
