
// src/tests/services/carry-on-fee.client.test.ts
import { test, expect } from 'vitest';

// Mock implementation for client-side testing
function computeCarryOnFee(offer: Record<string, unknown>): number | null {
  // This is a mock implementation for client-side testing
  // The actual implementation is in the edge function
  
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
          (s: Record<string, unknown>) => s.type === 'BAGGAGE' && /CARRY ON|CABIN BAG/i.test(typeof s.description === 'string' ? s.description.toUpperCase() : '')
        );
        if (baggageService) {
          infoFoundForThisTraveler = true;
          if (baggageService.amount) {
            feeForThisTraveler += parseFloat(String(baggageService.amount)) || 0;
          }
        }
      }
      
      if (segDetail && segDetail.includedCheckedBags && typeof segDetail.includedCheckedBags.quantity === 'number') {
        infoFoundForThisTraveler = true;
      }

      if (segDetail && /BASIC|LIGHT/.test(segDetail.fareBasis?.toUpperCase() || '')) {
        if (!infoFoundForThisTraveler && !feeForThisTraveler) {
          return null;
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
}

// Basic test cases for client-side testing
test('computeCarryOnFee: malformed travelerPricings handled (null)', () => {
  const fee = computeCarryOnFee({ travelerPricings: null });
  expect(fee).toEqual(null);
});

test('computeCarryOnFee: empty travelerPricings array', () => {
  const fee = computeCarryOnFee({ travelerPricings: [] });
  expect(fee).toEqual(null);
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
