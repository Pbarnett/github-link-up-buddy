import { rankOffers } from '../offerRanker';

// Mock FlightOffer interface for tests
interface FlightOffer {
  id: string;
  price: { amount: number };
  duration: { hours: number; minutes: number };
  stops: number;
}

describe('rankOffers', () => {
  it('should rank offers correctly based on price, duration, and stops', () => {
    const offers: FlightOffer[] = [
      { id: '1', price: { amount: 200 }, duration: { hours: 2, minutes: 30 }, stops: 0 }, // score: 0.12 + 0.026 + 0 = 0.146
      { id: '2', price: { amount: 150 }, duration: { hours: 5, minutes: 0 }, stops: 1 }, // score: 0.09 + 0.052 + 0.03 = 0.172
      { id: '3', price: { amount: 250 }, duration: { hours: 1, minutes: 45 }, stops: 0 }, // score: 0.15 + 0.018 + 0 = 0.168
    ];

    const rankedOffers = rankOffers(offers);

    expect(rankedOffers.map(o => o.id)).toEqual(['1', '3', '2']);
  });

  it('should handle an empty array of offers', () => {
    expect(rankOffers([])).toEqual([]);
  });
});

