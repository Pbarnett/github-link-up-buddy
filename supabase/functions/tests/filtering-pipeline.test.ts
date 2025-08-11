import { describe, it, expect } from 'vitest';
import { EdgeFilterPipeline, createFilterContext, type FlightOffer } from '../_shared/filtering.ts';

function makeOffer(opts: Partial<FlightOffer> & { roundTrip?: boolean; withStops?: boolean; base?: number; carryFee?: number; currency?: string }): FlightOffer {
  const roundTrip = opts.roundTrip ?? true;
  const withStops = opts.withStops ?? false;
  const base = opts.base ?? 400;
  const carryFee = opts.carryFee ?? 0;
  const currency = opts.currency ?? 'USD';

  const seg = (from: string, to: string) => ({
    departure: { iataCode: from, at: '2025-08-01T10:00:00Z' },
    arrival: { iataCode: to, at: '2025-08-01T14:00:00Z' },
    carrierCode: 'XX', flightNumber: '123', duration: 'PT4H', numberOfStops: withStops ? 1 : 0,
  });

  const outbound = { duration: 'PT4H', segments: [seg('JFK', 'LAX')] };
  const inbound = { duration: 'PT4H', segments: [seg('LAX', 'JFK')] };

  return {
    provider: 'Amadeus',
    id: Math.random().toString(36).slice(2),
    itineraries: roundTrip ? [outbound, inbound] : [outbound],
    totalBasePrice: base,
    currency,
    carryOnIncluded: carryFee === 0,
    carryOnFee: carryFee || undefined,
    totalPriceWithCarryOn: base + (carryFee || 0),
    stopsCount: withStops ? 1 : 0,
    validatingAirlines: ['XX'],
    rawData: {},
  };
}

describe('EdgeFilterPipeline core rules', () => {
  it('enforces nonstop when required', async () => {
    const ctx = createFilterContext({
      budget: 1000,
      currency: 'USD',
      originLocationCode: 'JFK',
      destinationLocationCode: 'LAX',
      departureDate: '2025-08-01',
      returnDate: '2025-08-07',
      nonstopRequired: true,
    });

    const offers = [
      makeOffer({ withStops: true }),
      makeOffer({ withStops: false }),
    ];

    const pipeline = new EdgeFilterPipeline('standard');
    const result = await pipeline.execute(offers, ctx);

    expect(result.filteredOffers.length).toBe(1);
    expect(result.filteredOffers[0].stopsCount).toBe(0);
  });

  it('uses totalPriceWithCarryOn for budget comparisons', async () => {
    const ctx = createFilterContext({
      budget: 500,
      currency: 'USD',
      originLocationCode: 'JFK',
      destinationLocationCode: 'LAX',
      departureDate: '2025-08-01',
      returnDate: '2025-08-07',
      nonstopRequired: true,
    });

    // Base 480 + carry-on 50 = 530 > 500 (should be filtered out)
    const overBudgetWithCarry = makeOffer({ base: 480, carryFee: 50 });
    // Base 480 + 0 = 480 <= 500 (should pass)
    const withinBudget = makeOffer({ base: 480, carryFee: 0 });

    const pipeline = new EdgeFilterPipeline('standard');
    const result = await pipeline.execute([overBudgetWithCarry, withinBudget], ctx);

    expect(result.filteredOffers.length).toBe(1);
    expect(result.filteredOffers[0].totalPriceWithCarryOn).toBeLessThanOrEqual(500);
  });

  it('filters to round-trip offers by context returnDate', async () => {
    const ctx = createFilterContext({
      budget: 1000,
      currency: 'USD',
      originLocationCode: 'JFK',
      destinationLocationCode: 'LAX',
      departureDate: '2025-08-01',
      returnDate: '2025-08-07',
      nonstopRequired: true,
    });

    const oneWay = makeOffer({ roundTrip: false });
    const roundTrip = makeOffer({ roundTrip: true });

    const pipeline = new EdgeFilterPipeline('standard');
    const result = await pipeline.execute([oneWay, roundTrip], ctx);

    expect(result.filteredOffers.length).toBe(1);
    expect(result.filteredOffers[0].itineraries.length).toBe(2);
  });
});

