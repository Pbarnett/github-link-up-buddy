// supabase/functions/tests/carry-on-fee-standalone.test.ts
import { describe, it, expect } from 'vitest';

// Standalone version of computeCarryOnFee for testing without imports
function computeCarryOnFee(offer: Record<string, unknown>): number|null {
  // 🚨 ROLLBACK MECHANISM: Check feature flag for emergency disable
  const allowUnknownCarryOn = process.env.ALLOW_UNKNOWN_CARRYON;
  if (allowUnknownCarryOn === "false" || allowUnknownCarryOn === "0") {
    console.log('[carry-on] Feature disabled via ALLOW_UNKNOWN_CARRYON flag, returning 0');
    return 0; // Temporary fallback - treat all as free carry-on
  }

  /* TEMP: capture first sample for schema discovery */
  if (process.env.DEBUG_BAGGAGE === "true") {
    try {
        console.log('[carry-on] sample offer (brief):', JSON.stringify(offer, (key, value) => key === "dictionaries" ? undefined : value, 2)?.slice(0,1500));
    } catch (_e) { // eslint-disable-line @typescript-eslint/no-unused-vars
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
                (s: Record<string, unknown>)=> s.type === 'BAGGAGE' && /CARRY ON|CABIN BAG/i.test((s.description as string)?.toUpperCase() || '')
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
describe('computeCarryOnFee', () => {
  it('should handle malformed travelerPricings (null)', () => {
    const fee = computeCarryOnFee({ travelerPricings: null });
    expect(fee).toBe(null);
  });

  it('should handle malformed travelerPricings (undefined)', () => {
    const fee = computeCarryOnFee({});
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
    expect(fee).toBe(null);
  });

  it('should handle no additionalServices array', () => {
    const fee = computeCarryOnFee({
      travelerPricings: [{
        fareDetailsBySegment: [{ additionalServices: null }]
      }]
    });
    expect(fee).toBe(null);
  });

  it('should handle additionalServices empty array', () => {
    const fee = computeCarryOnFee({
      travelerPricings: [{
        fareDetailsBySegment: [{ additionalServices: [] }]
      }]
    });
    expect(fee).toBe(null);
  });

  it('should handle BAGGAGE service present but no CARRY ON/CABIN BAG in description', () => {
    const fee = computeCarryOnFee({
      travelerPricings: [{
        fareDetailsBySegment: [{
          additionalServices: [{ type: 'BAGGAGE', description: 'CHECKED BAG', amount: '25.00' }]
        }]
      }]
    });
    expect(fee).toBe(null);
  });

  it('should handle CARRY ON service found with amount', () => {
    const fee = computeCarryOnFee({
      travelerPricings: [{
        fareDetailsBySegment: [{
          additionalServices: [{ type: 'BAGGAGE', description: 'CABIN BAG ALLOWANCE', amount: '30.00' }]
        }]
      }]
    });
    expect(fee).toBe(30.00);
  });

  it('should handle CARRY ON service found, amount is zero (free)', () => {
    const fee = computeCarryOnFee({
      travelerPricings: [{
        fareDetailsBySegment: [{
          additionalServices: [{ type: 'BAGGAGE', description: 'CARRY ON BAG', amount: '0.00' }]
        }]
      }]
    });
    expect(fee).toBe(0);
  });

  it('should handle CARRY ON service found, no amount', () => {
    const fee = computeCarryOnFee({
      travelerPricings: [{
        fareDetailsBySegment: [{
          additionalServices: [{ type: 'BAGGAGE', description: 'CARRY ON BAG' }]
        }]
      }]
    });
    expect(fee).toBe(0);
  });

  it('should handle Basic/Light fare, no explicit carry-on fee/inclusion info (opaque)', () => {
    const fee = computeCarryOnFee({
      travelerPricings: [{
        fareDetailsBySegment: [{
          fareBasis: 'BASICECONOMY'
        }]
      }]
    });
    expect(fee).toBe(null);
  });

  it('should handle Basic/Light fare, but carry-on fee IS specified', () => {
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

  it('should handle Basic/Light fare, includedCheckedBags sets infoFound', () => {
    const fee = computeCarryOnFee({
      travelerPricings: [{
        fareDetailsBySegment: [{
          fareBasis: 'LIGHT',
          includedCheckedBags: { quantity: 1 }
        }]
      }]
    });
    expect(fee).toBe(0);
  });

  it('should handle Multiple segments, one has fee, one is free', () => {
    const fee = computeCarryOnFee({
      travelerPricings: [{
        fareDetailsBySegment: [
          { additionalServices: [{ type: 'BAGGAGE', description: 'CARRY ON', amount: '20.00' }] },
          { additionalServices: [{ type: 'BAGGAGE', description: 'CABIN BAG', amount: '0.00' }] }
        ]
      }]
    });
    expect(fee).toBe(20.00);
  });

  it('should handle Multiple travelerPricings, uses first one with info', () => {
    const fee = computeCarryOnFee({
      travelerPricings: [
        { fareDetailsBySegment: [{ additionalServices: null }] },
        { fareDetailsBySegment: [{ additionalServices: [{ type: 'BAGGAGE', description: 'CARRY ON', amount: '35.00' }] }] }
      ]
    });
    expect(fee).toBe(35.00);
  });

  it('should handle Rollback mechanism test - feature disabled', () => {
    // Set environment variable to disable feature
    const originalValue = process.env.ALLOW_UNKNOWN_CARRYON;
    process.env.ALLOW_UNKNOWN_CARRYON = "false";
    
    const fee = computeCarryOnFee({
      travelerPricings: [{
        fareDetailsBySegment: [{
          fareBasis: 'BASICECONOMY' // Would normally be opaque
        }]
      }]
    });
    
    expect(fee).toBe(0); // Should return 0 when disabled
    
    // Reset for other tests
    process.env.ALLOW_UNKNOWN_CARRYON = originalValue || "true";
  });
});

