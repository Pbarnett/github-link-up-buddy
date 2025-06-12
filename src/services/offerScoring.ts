// src/services/offerScoring.ts
import { RawOffer, ScoredOffer } from '@/types/offer';

export function scoreOffer(
  offer: RawOffer,
  budget: number,
  seatPrefOrder: string[]
): ScoredOffer {
  const reasons: string[] = [];
  let score = 0;
  try {
    // Nonstop bonus
    if (offer.segments && offer.segments.every(s => s.stops === 0)) { // Added check for offer.segments
      score += 40;
    } else {
      reasons.push('+1 stop'); // Or reason for segments missing
    }
    // Carry-on bonus
    if (offer.hasCarryOn) {
      score += 10;
    } else {
      reasons.push('no carry-on');
    }
    // Price bonus
    if (offer.price <= budget) {
      score += 20;
    } else {
      reasons.push(`$${offer.price - budget} over budget`);
    }
    // Seat preference bonus
    // Ensure offer.seat is checked for existence before calling includes
    if (offer.seat && seatPrefOrder && seatPrefOrder.includes(offer.seat)) { // Added check for seatPrefOrder
      score += 10;
    } else {
      reasons.push('seat unavailable'); // Or reason for seatPrefOrder missing
    }
    console.debug('scoreOffer', { id: offer.id, score, reasons });
  } catch (err) {
    console.error('scoreOffer error', err, offer);
    // Ensure reasons array is populated even in case of an error, or score is penalized.
    // For now, just logging as per brief.
  }
  return { ...offer, score, reasons };
}
