// src/tests/services/carry-on-fee.vitest.test.ts
import { test, expect } from 'vitest';
import { computeCarryOnFee } from "../../../supabase/functions/flight-search/flightApi.edge.ts";

// Test case structure from user brief:
// test('name', () => { const fee = computeCarryOnFee(mockOffer); expect(fee).toEqual(expected); });

test('computeCarryOnFee: malformed travelerPricings handled (null)', () => {
  const fee = computeCarryOnFee({ travelerPricings: null }); // Test with null travelerPricings
  expect(fee).toEqual(null);
});

test('computeCarryOnFee: malformed travelerPricings handled (undefined)', () => {
  const fee = computeCarryOnFee({}); // Test with travelerPricings undefined
  expect(fee).toEqual(null);
});

test('computeCarryOnFee: empty travelerPricings array', () => {
  const fee = computeCarryOnFee({ travelerPricings: [] });
  expect(fee).toEqual(null);
});

test('computeCarryOnFee: travelerPricings with no fareDetailsBySegment', () => {
  const fee = computeCarryOnFee({ travelerPricings: [{ fareDetailsBySegment: null }] });
  expect(fee).toEqual(null);
});

test('computeCarryOnFee: travelerPricings with empty fareDetailsBySegment array', () => {
  const fee = computeCarryOnFee({ travelerPricings: [{ fareDetailsBySegment: [] }] });
  expect(fee).toEqual(null); // Logic iterates segments, if none, infoFoundForThisTraveler remains false
});

test('computeCarryOnFee: no additionalServices array', () => {
  const fee = computeCarryOnFee({
    travelerPricings: [{
      fareDetailsBySegment: [{ additionalServices: null }]
    }]
  });
  expect(fee).toEqual(null); // No info found
});

test('computeCarryOnFee: additionalServices empty array', () => {
  const fee = computeCarryOnFee({
    travelerPricings: [{
      fareDetailsBySegment: [{ additionalServices: [] }]
    }]
  });
  expect(fee).toEqual(null); // No info found
});

test('computeCarryOnFee: BAGGAGE service present but no CARRY ON/CABIN BAG in description', () => {
  const fee = computeCarryOnFee({
    travelerPricings: [{
      fareDetailsBySegment: [{
        additionalServices: [{ type: 'BAGGAGE', description: 'CHECKED BAG', amount: '25.00' }]
      }]
    }]
  });
  expect(fee).toEqual(null); // No CARRY ON info found
});

test('computeCarryOnFee: CARRY ON service found with amount', () => {
  const fee = computeCarryOnFee({
    travelerPricings: [{
      fareDetailsBySegment: [{
        additionalServices: [{ type: 'BAGGAGE', description: 'CABIN BAG ALLOWANCE', amount: '30.00' }]
      }]
    }]
  });
  expect(fee).toEqual(30.00);
});

test('computeCarryOnFee: CARRY ON service found, amount is zero (free)', () => {
  const fee = computeCarryOnFee({
    travelerPricings: [{
      fareDetailsBySegment: [{
        additionalServices: [{ type: 'BAGGAGE', description: 'CARRY ON BAG', amount: '0.00' }]
      }]
    }]
  });
  expect(fee).toEqual(0);
});

test('computeCarryOnFee: CARRY ON service found, no amount (should be treated carefully, implies free or included but not priced)', () => {
  const fee = computeCarryOnFee({
    travelerPricings: [{
      fareDetailsBySegment: [{
        additionalServices: [{ type: 'BAGGAGE', description: 'CARRY ON BAG' /* no amount */ }]
      }]
    }]
  });
  expect(fee).toEqual(0);
});

test('computeCarryOnFee: Basic/Light fare, no explicit carry-on fee/inclusion info (opaque)', () => {
  const fee = computeCarryOnFee({
    travelerPricings: [{
      fareDetailsBySegment: [{
        fareBasis: 'BASICECONOMY',
        // No additionalServices or includedCheckedBags that would set infoFoundForThisTraveler = true
      }]
    }]
  });
  expect(fee).toEqual(null);
});

test('computeCarryOnFee: Basic/Light fare, but carry-on fee IS specified', () => {
  const fee = computeCarryOnFee({
    travelerPricings: [{
      fareDetailsBySegment: [{
        fareBasis: 'LIGHTFARE',
        additionalServices: [{ type: 'BAGGAGE', description: 'CABIN BAG ALLOWANCE', amount: '45.00' }]
      }]
    }]
  });
  expect(fee).toEqual(45.00);
});

test('computeCarryOnFee: Basic/Light fare, includedCheckedBags sets infoFound (implies not opaque for carry-on, defaults to 0 fee if no specific carry-on service)', () => {
  const fee = computeCarryOnFee({
    travelerPricings: [{
      fareDetailsBySegment: [{
        fareBasis: 'LIGHT',
        includedCheckedBags: { quantity: 1 } // This sets infoFoundForThisTraveler = true
        // No explicit CARRY ON additionalService means fee remains 0 for carry-on
      }]
    }]
  });
  expect(fee).toEqual(0); // Because info was found, but no specific carry-on fee was added
});

test('computeCarryOnFee: Multiple segments, one has fee, one is free (should sum or take first/max - current sums)', () => {
  const fee = computeCarryOnFee({
    travelerPricings: [{
      fareDetailsBySegment: [
        { additionalServices: [{ type: 'BAGGAGE', description: 'CARRY ON', amount: '20.00' }] },
        { additionalServices: [{ type: 'BAGGAGE', description: 'CABIN BAG', amount: '0.00' }] }
      ]
    }]
  });
  expect(fee).toEqual(20.00); // 20 + 0 = 20
});

test('computeCarryOnFee: Multiple travelerPricings, uses first one with info', () => {
  const fee = computeCarryOnFee({
    travelerPricings: [
      { fareDetailsBySegment: [{ additionalServices: null }] }, // No info here
      { fareDetailsBySegment: [{ additionalServices: [{ type: 'BAGGAGE', description: 'CARRY ON', amount: '35.00' }] }] } // Info here
    ]
  });
  expect(fee).toEqual(35.00);
});

test('computeCarryOnFee: Complex offer with mixed info, ensure correct fee or null', () => {
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
    expect(fee).toEqual(0); // infoFound is true from checked bags, no explicit carry-on fee found, so defaults to 0
});

test('computeCarryOnFee: Basic fare but included checked bags makes it not opaque', () => {
    const offer = {
        travelerPricings: [{
            fareDetailsBySegment: [{
                fareBasis: 'BASIC',
                includedCheckedBags: { quantity: 1 } // This makes infoFoundForThisTraveler true
            }]
        }]
    };
    const fee = computeCarryOnFee(offer);
    expect(fee).toEqual(0); // Not opaque, and no carry-on fee specified, so 0.
});

test('computeCarryOnFee: Basic fare, specific CARRY ON fee provided', () => {
    const offer = {
        travelerPricings: [{
            fareDetailsBySegment: [{
                fareBasis: 'LIGHT',
                additionalServices: [{ type: 'BAGGAGE', description: 'CARRY ON BAG', amount: '25.99' }]
            }]
        }]
    };
    const fee = computeCarryOnFee(offer);
    expect(fee).toEqual(25.99);
});
