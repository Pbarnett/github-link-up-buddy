// src/services/offerScoring.test.ts
import { scoreOffer } from '@/services/offerScoring';
import { RawOffer } from '@/types/offer'; // Assuming this path is correct after creating src/types/offer.ts

// Minimal test based on brief to ensure basic structure and types are correct.
// More detailed tests for different scoring scenarios would typically be added.
test('scoreOffer returns valid ScoredOffer', () => {
  const mockOffer: RawOffer = {
    id: '1',
    price: 500,
    segments: [{ durationMins: 120, stops: 0 }],
    hasCarryOn: true,
    seat: 'A' // Added seat to mock to satisfy one of the scoring conditions
  };
  const budget = 1000;
  const seatPrefOrder = ['A', 'W'];

  const out = scoreOffer(mockOffer, budget, seatPrefOrder);

  expect(typeof out.score).toBe('number');
  expect(out.score).toBeGreaterThanOrEqual(0); // Score should ideally be non-negative

  expect(Array.isArray(out.reasons)).toBe(true);

  // Also check that the output includes original offer properties
  expect(out.id).toBe(mockOffer.id);
  expect(out.price).toBe(mockOffer.price);
});
