import { describe, it, expect } from 'vitest';

// Import the regex pattern directly for testing
const isValidDuration = (duration: string): boolean => {
  return /^(PT((\d+H)(\d+M)?|(\d+M)))|\d+h(?:\s*\d+m)?$/.test(duration);
};

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

