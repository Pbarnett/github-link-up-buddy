// supabase/functions/tests/carry-on-fee.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockSupabaseClient } from '@/tests/utils/supabaseMockFactory';
import { computeCarryOnFee } from "./helpers/computeCarryOnFeeTestable.ts";

// Test case structure from user brief:
// Deno.test('name', () => { const fee = computeCarryOnFee(mockOffer); assertEquals(fee, expected); });

describe('computeCarryOnFee', () => {
  beforeEach(() => {
    // Inject the mock Supabase client
    vi.mock('@supabase/supabase-js', () => ({
      createClient: () => mockSupabaseClient
    }));
    
    // Reset mock state before each test
    vi.clearAllMocks();
  });

  it('should handle malformed travelerPricings (null)', () => {
    const fee = computeCarryOnFee({ travelerPricings: null }); // Test with null travelerPricings
    expect(fee).toBe(null);
  });

  it('should handle malformed travelerPricings (undefined)', () => {
    const fee = computeCarryOnFee({}); // Test with travelerPricings undefined
    expect(fee).toBe(null);
  });

  it('should handle empty travelerPricings array', () => {
    const fee = computeCarryOnFee({ travelerPricings: [] });
    expect(fee).toBe(null);
  });

  it('should handle travelerPricings with no fareDetailsBySegment', () => {
    const fee = computeCarryOnFee({ travelerPricings: [{ fareDetailsBySegment: null }] });
    expect(fee).toBe(null);
  });

  it('should handle travelerPricings with empty fareDetailsBySegment array', () => {
    const fee = computeCarryOnFee({ travelerPricings: [{ fareDetailsBySegment: [] }] });
    expect(fee).toBe(null); // Logic iterates segments, if none, infoFoundForThisTraveler remains false
  });

  it('should handle no additionalServices array', () => {
    const fee = computeCarryOnFee({
      travelerPricings: [{
        fareDetailsBySegment: [{ additionalServices: null }]
      }]
    });
    expect(fee).toBe(null); // No info found
  });

  it('should handle additionalServices empty array', () => {
    const fee = computeCarryOnFee({
      travelerPricings: [{
        fareDetailsBySegment: [{ additionalServices: [] }]
      }]
    });
    expect(fee).toBe(null); // No info found
  });

  it('should handle BAGGAGE service present but no CARRY ON/CABIN BAG in description', () => {
    const fee = computeCarryOnFee({
      travelerPricings: [{
        fareDetailsBySegment: [{
          additionalServices: [{ type: 'BAGGAGE', description: 'CHECKED BAG', amount: '25.00' }]
        }]
      }]
    });
    expect(fee).toBe(null); // No CARRY ON info found
  });

  it('should find CARRY ON service with amount', () => {
    const fee = computeCarryOnFee({
      travelerPricings: [{
        fareDetailsBySegment: [{
          additionalServices: [{ type: 'BAGGAGE', description: 'CABIN BAG ALLOWANCE', amount: '30.00' }]
        }]
      }]
    });
    expect(fee).toBe(30.00);
  });

  it('should find CARRY ON service with zero amount (free)', () => {
    const fee = computeCarryOnFee({
      travelerPricings: [{
        fareDetailsBySegment: [{
          additionalServices: [{ type: 'BAGGAGE', description: 'CARRY ON BAG', amount: '0.00' }]
        }]
      }]
    });
    expect(fee).toBe(0);
  });

  it('should handle CARRY ON service found with no amount', () => {
    // Current computeCarryOnFee logic: if (svc?.amount) { fee+=parseFloat(svc.amount)||0; info=true; }
    // If amount is missing or not parseable, it's not added to fee, info might not be true.
    // If info is false at the end, it returns null.
    const fee = computeCarryOnFee({
      travelerPricings: [{
        fareDetailsBySegment: [{
          additionalServices: [{ type: 'BAGGAGE', description: 'CARRY ON BAG' /* no amount */ }]
        }]
      }]
    });
    // If amount is undefined, parseFloat(undefined) is NaN, || 0 makes it 0. info becomes true because description matches.
    // So, it should return 0 if description matches but no amount.
    expect(fee).toBe(0);
  });

  it('should handle Basic/Light fare with no explicit carry-on fee/inclusion info (opaque)', () => {
    const fee = computeCarryOnFee({
      travelerPricings: [{
        fareDetailsBySegment: [{
          fareBasis: 'BASICECONOMY',
          // No additionalServices or includedCheckedBags that would set infoFoundForThisTraveler = true
        }]
      }]
    });
    expect(fee).toBe(null);
  });

  it('should handle Basic/Light fare with specified carry-on fee', () => {
    const fee = computeCarryOnFee({
      travelerPricings: [{
        fareDetailsBySegment: [{
          fareBasis: 'LIGHTFARE',
          additionalServices: [{ type: 'BAGGAGE', description: 'CABIN BAG ALLOWANCE', amount: '45.00' }]
        }]
      }]
    });
    expect(fee).toBe(45.00);
  });

  it('should handle Basic/Light fare with includedCheckedBags setting infoFound', () => {
    const fee = computeCarryOnFee({
      travelerPricings: [{
        fareDetailsBySegment: [{
          fareBasis: 'LIGHT',
          includedCheckedBags: { quantity: 1 } // This sets infoFoundForThisTraveler = true
          // No explicit CARRY ON additionalService means fee remains 0 for carry-on
        }]
      }]
    });
    expect(fee).toBe(0); // Because info was found, but no specific carry-on fee was added
  });

  it('should handle multiple segments, one has fee, one is free (should sum)', () => {
    // The current logic in computeCarryOnFee iterates segments for *one* travelerPricing
    // and sums fees. If multiple travelerPricings, it breaks after the first one with info.
    // This test focuses on multiple segments for one travelerPricing.
    const fee = computeCarryOnFee({
      travelerPricings: [{
        fareDetailsBySegment: [
          { additionalServices: [{ type: 'BAGGAGE', description: 'CARRY ON', amount: '20.00' }] },
          { additionalServices: [{ type: 'BAGGAGE', description: 'CABIN BAG', amount: '0.00' }] }
        ]
      }]
    });
    expect(fee).toBe(20.00); // 20 + 0 = 20
  });

  it('should use first travelerPricing with info', () => {
    const fee = computeCarryOnFee({
      travelerPricings: [
        { fareDetailsBySegment: [{ additionalServices: null }] }, // No info here
        { fareDetailsBySegment: [{ additionalServices: [{ type: 'BAGGAGE', description: 'CARRY ON', amount: '35.00' }] }] } // Info here
      ]
    });
    expect(fee).toBe(35.00);
  });

  it('should handle complex offer with mixed info correctly', () => {
    const offer = {
        id: "test-offer-complex",
        price: { total: "200.00" },
        travelerPricings: [
            {
                travelerId: "1",
                fareOption: "STANDARD",
                travelerType: "ADULT",
                price: { currency: "USD", total: "200.00", base: "150.00" },
                fareDetailsBySegment: [
                    {
                        segmentId: "1",
                        cabin: "ECONOMY",
                        fareBasis: "QNCLECON",
                        class: "Q",
                        includedCheckedBags: { quantity: 1 }, // Sets infoFoundForThisTraveler
                        additionalServices: [ // No CARRY ON specific fee here
                            { groupName: "SEATS", items: [ { serviceType: "SEAT", price: "10.00", description: "AISLE SEAT" } ] }
                        ]
                    },
                    {
                        segmentId: "2",
                        cabin: "ECONOMY",
                        fareBasis: "QNCLECON",
                        class: "Q",
                        // No additionalServices for carry-on, but infoFound is already true
                    }
                ]
            }
        ],
        // ... other offer properties
    };
    const fee = computeCarryOnFee(offer);
    expect(fee).toBe(0); // infoFound is true from checked bags, no explicit carry-on fee found, so defaults to 0
  });

  it('should handle Basic fare but included checked bags makes it not opaque', () => {
    const offer = {
        travelerPricings: [{
            fareDetailsBySegment: [{
                fareBasis: 'BASIC',
                includedCheckedBags: { quantity: 1 } // This makes infoFoundForThisTraveler true
            }]
        }]
    };
    const fee = computeCarryOnFee(offer);
    expect(fee).toBe(0); // Not opaque, and no carry-on fee specified, so 0.
  });

  it('should handle Basic fare with specific CARRY ON fee provided', () => {
    const offer = {
        travelerPricings: [{
            fareDetailsBySegment: [{
                fareBasis: 'LIGHT',
                additionalServices: [{ type: 'BAGGAGE', description: 'CARRY ON BAG', amount: '25.99' }]
            }]
        }]
    };
    const fee = computeCarryOnFee(offer);
    expect(fee).toBe(25.99);
  });
});
