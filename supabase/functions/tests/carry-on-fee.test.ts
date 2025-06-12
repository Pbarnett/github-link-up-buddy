// supabase/functions/tests/carry-on-fee.test.ts
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts"; // Or appropriate version
import { computeCarryOnFee } from "../flight-search/flightApi.edge.ts";

// Test case structure from user brief:
// Deno.test('name', () => { const fee = computeCarryOnFee(mockOffer); assertEquals(fee, expected); });

Deno.test('computeCarryOnFee: malformed travelerPricings handled (null)', () => {
  const fee = computeCarryOnFee({ travelerPricings: null }); // Test with null travelerPricings
  assertEquals(fee, null);
});

Deno.test('computeCarryOnFee: malformed travelerPricings handled (undefined)', () => {
  const fee = computeCarryOnFee({}); // Test with travelerPricings undefined
  assertEquals(fee, null);
});

Deno.test('computeCarryOnFee: empty travelerPricings array', () => {
  const fee = computeCarryOnFee({ travelerPricings: [] });
  assertEquals(fee, null);
});

Deno.test('computeCarryOnFee: travelerPricings with no fareDetailsBySegment', () => {
  const fee = computeCarryOnFee({ travelerPricings: [{ fareDetailsBySegment: null }] });
  assertEquals(fee, null);
});

Deno.test('computeCarryOnFee: travelerPricings with empty fareDetailsBySegment array', () => {
  const fee = computeCarryOnFee({ travelerPricings: [{ fareDetailsBySegment: [] }] });
  assertEquals(fee, null); // Logic iterates segments, if none, infoFoundForThisTraveler remains false
});

Deno.test('computeCarryOnFee: no additionalServices array', () => {
  const fee = computeCarryOnFee({
    travelerPricings: [{
      fareDetailsBySegment: [{ additionalServices: null }]
    }]
  });
  assertEquals(fee, null); // No info found
});

Deno.test('computeCarryOnFee: additionalServices empty array', () => {
  const fee = computeCarryOnFee({
    travelerPricings: [{
      fareDetailsBySegment: [{ additionalServices: [] }]
    }]
  });
  assertEquals(fee, null); // No info found
});

Deno.test('computeCarryOnFee: BAGGAGE service present but no CARRY ON/CABIN BAG in description', () => {
  const fee = computeCarryOnFee({
    travelerPricings: [{
      fareDetailsBySegment: [{
        additionalServices: [{ type: 'BAGGAGE', description: 'CHECKED BAG', amount: '25.00' }]
      }]
    }]
  });
  assertEquals(fee, null); // No CARRY ON info found
});

Deno.test('computeCarryOnFee: CARRY ON service found with amount', () => {
  const fee = computeCarryOnFee({
    travelerPricings: [{
      fareDetailsBySegment: [{
        additionalServices: [{ type: 'BAGGAGE', description: 'CABIN BAG ALLOWANCE', amount: '30.00' }]
      }]
    }]
  });
  assertEquals(fee, 30.00);
});

Deno.test('computeCarryOnFee: CARRY ON service found, amount is zero (free)', () => {
  const fee = computeCarryOnFee({
    travelerPricings: [{
      fareDetailsBySegment: [{
        additionalServices: [{ type: 'BAGGAGE', description: 'CARRY ON BAG', amount: '0.00' }]
      }]
    }]
  });
  assertEquals(fee, 0);
});

Deno.test('computeCarryOnFee: CARRY ON service found, no amount (should be treated carefully, implies free or included but not priced)', () => {
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
  assertEquals(fee, 0);
});

Deno.test('computeCarryOnFee: Basic/Light fare, no explicit carry-on fee/inclusion info (opaque)', () => {
  const fee = computeCarryOnFee({
    travelerPricings: [{
      fareDetailsBySegment: [{
        fareBasis: 'BASICECONOMY',
        // No additionalServices or includedCheckedBags that would set infoFoundForThisTraveler = true
      }]
    }]
  });
  assertEquals(fee, null);
});

Deno.test('computeCarryOnFee: Basic/Light fare, but carry-on fee IS specified', () => {
  const fee = computeCarryOnFee({
    travelerPricings: [{
      fareDetailsBySegment: [{
        fareBasis: 'LIGHTFARE',
        additionalServices: [{ type: 'BAGGAGE', description: 'CABIN BAG ALLOWANCE', amount: '45.00' }]
      }]
    }]
  });
  assertEquals(fee, 45.00);
});

Deno.test('computeCarryOnFee: Basic/Light fare, includedCheckedBags sets infoFound (implies not opaque for carry-on, defaults to 0 fee if no specific carry-on service)', () => {
  const fee = computeCarryOnFee({
    travelerPricings: [{
      fareDetailsBySegment: [{
        fareBasis: 'LIGHT',
        includedCheckedBags: { quantity: 1 } // This sets infoFoundForThisTraveler = true
        // No explicit CARRY ON additionalService means fee remains 0 for carry-on
      }]
    }]
  });
  assertEquals(fee, 0); // Because info was found, but no specific carry-on fee was added
});

Deno.test('computeCarryOnFee: Multiple segments, one has fee, one is free (should sum or take first/max - current sums)', () => {
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
  assertEquals(fee, 20.00); // 20 + 0 = 20
});

Deno.test('computeCarryOnFee: Multiple travelerPricings, uses first one with info', () => {
  const fee = computeCarryOnFee({
    travelerPricings: [
      { fareDetailsBySegment: [{ additionalServices: null }] }, // No info here
      { fareDetailsBySegment: [{ additionalServices: [{ type: 'BAGGAGE', description: 'CARRY ON', amount: '35.00' }] }] } // Info here
    ]
  });
  assertEquals(fee, 35.00);
});

Deno.test('computeCarryOnFee: Complex offer with mixed info, ensure correct fee or null', () => {
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
    assertEquals(fee, 0); // infoFound is true from checked bags, no explicit carry-on fee found, so defaults to 0
});

Deno.test('computeCarryOnFee: Basic fare but included checked bags makes it not opaque', () => {
    const offer = {
        travelerPricings: [{
            fareDetailsBySegment: [{
                fareBasis: 'BASIC',
                includedCheckedBags: { quantity: 1 } // This makes infoFoundForThisTraveler true
            }]
        }]
    };
    const fee = computeCarryOnFee(offer);
    assertEquals(fee, 0); // Not opaque, and no carry-on fee specified, so 0.
});

Deno.test('computeCarryOnFee: Basic fare, specific CARRY ON fee provided', () => {
    const offer = {
        travelerPricings: [{
            fareDetailsBySegment: [{
                fareBasis: 'LIGHT',
                additionalServices: [{ type: 'BAGGAGE', description: 'CARRY ON BAG', amount: '25.99' }]
            }]
        }]
    };
    const fee = computeCarryOnFee(offer);
    assertEquals(fee, 25.99);
});
