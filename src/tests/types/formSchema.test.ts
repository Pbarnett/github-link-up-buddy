import { tripFormSchema } from '@/types/form'; // Corrected import name
import { addDays } from 'date-fns';
import { describe, it, expect } from 'vitest';

describe('tripFormSchema dateRange', () => {
  // Helper function to create a valid base for the form schema
  const createValidBase = () => {
    const earliestDeparture = addDays(new Date(), 1); // Must be in the future
    const latestDeparture = addDays(earliestDeparture, 5); // Must be after earliest
    return {
      earliestDeparture,
      latestDeparture,
      min_duration: 1,
      max_duration: 5, // Must be >= min_duration
      budget: 500,
      nyc_airports: ['JFK'], // Must select at least one departure airport
      destination_airport: 'LAX', // Must select a destination
      nonstop_required: false,
      baggage_included_required: false,
      auto_book_enabled: false,
    };
  };

  it('rejects > 120-day span between earliest and latest departure', () => {
    const base = createValidBase();
    const earliestDeparture = new Date();
    // Set latestDeparture to be 121 days after earliestDeparture
    const latestDeparture = addDays(earliestDeparture, 121);

    const testData = {
      ...base,
      earliestDeparture,
      latestDeparture,
    };
    const r = tripFormSchema.safeParse(testData);
    expect(r.success).toBe(false);
    if (!r.success) {
      // Check if the error message is the one we expect for the date range
      const dateRangeError = r.error.errors.find(err => err.path.includes('latestDeparture') && err.message.includes('120 days'));
      expect(dateRangeError).toBeDefined();
    }
  });

  it('allows a 90-day span between earliest and latest departure', () => {
    const base = createValidBase();
    const earliestDeparture = addDays(new Date(), 1); // Ensure it's in the future for other validations
    // Set latestDeparture to be 90 days after earliestDeparture
    const latestDeparture = addDays(earliestDeparture, 90);

    const testData = {
      ...base,
      earliestDeparture,
      latestDeparture,
    };
    const r = tripFormSchema.safeParse(testData);
    expect(r.success).toBe(true);
  });

  it('allows a 120-day span between earliest and latest departure', () => {
    const base = createValidBase();
    const earliestDeparture = addDays(new Date(), 1); // Ensure it's in the future
    // Set latestDeparture to be 120 days after earliestDeparture
    const latestDeparture = addDays(earliestDeparture, 120);

    const testData = {
      ...base,
      earliestDeparture,
      latestDeparture,
    };
    const r = tripFormSchema.safeParse(testData);
    expect(r.success).toBe(true);
  });
});
