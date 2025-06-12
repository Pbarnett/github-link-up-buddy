// supabase/functions/tests/carry-on-fee-standalone.test.ts
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";

// Standalone version of computeCarryOnFee for testing without imports
function computeCarryOnFee(offer:any): number|null {
  // 🚨 ROLLBACK MECHANISM: Check feature flag for emergency disable
  const allowUnknownCarryOn = Deno.env.get("ALLOW_UNKNOWN_CARRYON");
  if (allowUnknownCarryOn === "false" || allowUnknownCarryOn === "0") {
    console.log('[carry-on] Feature disabled via ALLOW_UNKNOWN_CARRYON flag, returning 0');
    return 0; // Temporary fallback - treat all as free carry-on
  }

  /* TEMP: capture first sample for schema discovery */
  if (Deno.env.get("DEBUG_BAGGAGE") === "true") {
    try {
        console.log('[carry-on] sample offer (brief):', JSON.stringify(offer, (key, value) => key === "dictionaries" ? undefined : value, 2)?.slice(0,1500));
    } catch (e) {
        console.log('[carry-on] sample offer (brief) could not be stringified for offer ID:', offer?.id);
    }
  }

  try {
    if (!offer || !Array.isArray(offer.travelerPricings) || offer.travelerPricings.length === 0) {
        return null;
    }

    let totalCarryOnFee = 0;
    let carryOnInfoFound = false;

    for (const tp of offer.travelerPricings) {
        if (!tp || !Array.isArray(tp.fareDetailsBySegment)) {
            continue;
        }

        let feeForThisTraveler = 0;
        let infoFoundForThisTraveler = false;

        for (const segDetail of tp.fareDetailsBySegment) {
            if (segDetail && Array.isArray(segDetail.additionalServices)) {
                const baggageService = segDetail.additionalServices.find(
                (s:any)=> s.type === 'BAGGAGE' && /CARRY ON|CABIN BAG/i.test(s.description?.toUpperCase() || '')
                );
                if (baggageService) {
                    // If we found a carry-on related service, we have info
                    infoFoundForThisTraveler = true;
                    // Only add fee if amount is provided
                    if (baggageService.amount) {
                        feeForThisTraveler += parseFloat(baggageService.amount) || 0;
                    }
                }
            }
            // Check for included baggage as a sign that info is present
            if (segDetail && segDetail.includedCheckedBags && typeof segDetail.includedCheckedBags.quantity === 'number') {
                 infoFoundForThisTraveler = true;
            }

            // If fare basis indicates basic/light, we must have found some info (fee or included)
            if (segDetail && /BASIC|LIGHT/.test(segDetail.fareBasis?.toUpperCase()||'')) {
                if (!infoFoundForThisTraveler && !feeForThisTraveler) {
                    return null; // Opaque for this segment, thus for the offer
                }
            }
        }

        if (infoFoundForThisTraveler) {
            totalCarryOnFee = feeForThisTraveler;
            carryOnInfoFound = true;
            break;
        }
    }

    if (carryOnInfoFound) {
        return totalCarryOnFee;
    } else {
        return null;
    }

  } catch(e) {
    console.error('[carry-on] parse error for offer id:', offer?.id, e);
    return null;
  }
}

// Test cases
Deno.test('computeCarryOnFee: malformed travelerPricings handled (null)', () => {
  const fee = computeCarryOnFee({ travelerPricings: null });
  assertEquals(fee, null);
});

Deno.test('computeCarryOnFee: malformed travelerPricings handled (undefined)', () => {
  const fee = computeCarryOnFee({});
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
  assertEquals(fee, null);
});

Deno.test('computeCarryOnFee: no additionalServices array', () => {
  const fee = computeCarryOnFee({
    travelerPricings: [{
      fareDetailsBySegment: [{ additionalServices: null }]
    }]
  });
  assertEquals(fee, null);
});

Deno.test('computeCarryOnFee: additionalServices empty array', () => {
  const fee = computeCarryOnFee({
    travelerPricings: [{
      fareDetailsBySegment: [{ additionalServices: [] }]
    }]
  });
  assertEquals(fee, null);
});

Deno.test('computeCarryOnFee: BAGGAGE service present but no CARRY ON/CABIN BAG in description', () => {
  const fee = computeCarryOnFee({
    travelerPricings: [{
      fareDetailsBySegment: [{
        additionalServices: [{ type: 'BAGGAGE', description: 'CHECKED BAG', amount: '25.00' }]
      }]
    }]
  });
  assertEquals(fee, null);
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

Deno.test('computeCarryOnFee: CARRY ON service found, no amount', () => {
  const fee = computeCarryOnFee({
    travelerPricings: [{
      fareDetailsBySegment: [{
        additionalServices: [{ type: 'BAGGAGE', description: 'CARRY ON BAG' }]
      }]
    }]
  });
  assertEquals(fee, 0);
});

Deno.test('computeCarryOnFee: Basic/Light fare, no explicit carry-on fee/inclusion info (opaque)', () => {
  const fee = computeCarryOnFee({
    travelerPricings: [{
      fareDetailsBySegment: [{
        fareBasis: 'BASICECONOMY'
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

Deno.test('computeCarryOnFee: Basic/Light fare, includedCheckedBags sets infoFound', () => {
  const fee = computeCarryOnFee({
    travelerPricings: [{
      fareDetailsBySegment: [{
        fareBasis: 'LIGHT',
        includedCheckedBags: { quantity: 1 }
      }]
    }]
  });
  assertEquals(fee, 0);
});

Deno.test('computeCarryOnFee: Multiple segments, one has fee, one is free', () => {
  const fee = computeCarryOnFee({
    travelerPricings: [{
      fareDetailsBySegment: [
        { additionalServices: [{ type: 'BAGGAGE', description: 'CARRY ON', amount: '20.00' }] },
        { additionalServices: [{ type: 'BAGGAGE', description: 'CABIN BAG', amount: '0.00' }] }
      ]
    }]
  });
  assertEquals(fee, 20.00);
});

Deno.test('computeCarryOnFee: Multiple travelerPricings, uses first one with info', () => {
  const fee = computeCarryOnFee({
    travelerPricings: [
      { fareDetailsBySegment: [{ additionalServices: null }] },
      { fareDetailsBySegment: [{ additionalServices: [{ type: 'BAGGAGE', description: 'CARRY ON', amount: '35.00' }] }] }
    ]
  });
  assertEquals(fee, 35.00);
});

Deno.test('computeCarryOnFee: Rollback mechanism test - feature disabled', () => {
  // Set environment variable to disable feature
  Deno.env.set("ALLOW_UNKNOWN_CARRYON", "false");
  
  const fee = computeCarryOnFee({
    travelerPricings: [{
      fareDetailsBySegment: [{
        fareBasis: 'BASICECONOMY' // Would normally be opaque
      }]
    }]
  });
  
  assertEquals(fee, 0); // Should return 0 when disabled
  
  // Reset for other tests
  Deno.env.set("ALLOW_UNKNOWN_CARRYON", "true");
});

