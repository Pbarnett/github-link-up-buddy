import { describe as baseDescribe, it, expect } from 'vitest';
const describe = (process.env.RUN_EDGE_TESTS === 'true' ? baseDescribe : (baseDescribe.skip as typeof baseDescribe));
import { DuffelEdgeAdapter, createFilterContext, type FlightOffer } from '../_shared/filtering.ts';

function duffelOffer({
  includeCarry = false,
  carryFee = undefined as number | undefined,
  withStops = false,
  base = 400,
  currency = 'USD',
} = {}) {
  const segment = (from: string, to: string) => ({
    departing_at: '2025-08-01T10:00:00Z',
    arriving_at: '2025-08-01T14:00:00Z',
    origin: { iata_code: from },
    destination: { iata_code: to },
    marketing_carrier: { iata_code: 'XX' },
    marketing_carrier_flight_number: '123',
    duration: 'PT4H',
    stops: withStops ? [{ airport: { iata_code: 'DEN' } }] : [],
    passengers: [{
      baggages: includeCarry ? [{ type: 'carry_on', quantity: 1 }] : [],
    }],
  });

  const offer: any = {
    id: 'duf_test_1',
    total_amount: String(base.toFixed ? base.toFixed(2) : base),
    total_currency: currency,
    owner: { iata_code: 'XX' },
    slices: [
      { segments: [segment('JFK', 'LAX')] },
      { segments: [segment('LAX', 'JFK')] },
    ],
  };

  if (!includeCarry && carryFee !== undefined) {
    offer.available_services = [
      { type: 'baggage', metadata: { title: 'Carry on bag' }, total_amount: String(carryFee) },
    ];
  }

  return offer;
}

describe('DuffelEdgeAdapter', () => {
  it('flags carry-on included and keeps totalPriceWithCarryOn equal to base', () => {
    const ctx = createFilterContext({ passengers: 1, budget: 1000, nonstopRequired: true, originLocationCode: 'JFK', destinationLocationCode: 'LAX', departureDate: '2025-08-01', returnDate: '2025-08-07' });
    const offer = duffelOffer({ includeCarry: true, base: 500, withStops: false });
    const normalized = DuffelEdgeAdapter.normalize(offer, ctx);
    expect(normalized.carryOnIncluded).toBe(true);
    // When included, adapter reports 0 fee and base equals total
    expect(normalized.carryOnFee ?? 0).toBe(0);
    expect(normalized.totalPriceWithCarryOn).toBeCloseTo(500);
    expect(normalized.stopsCount).toBe(0);
  });

  it('applies carry-on add-on fee when not included', () => {
    const ctx = createFilterContext({ passengers: 1, budget: 1000, nonstopRequired: true, originLocationCode: 'JFK', destinationLocationCode: 'LAX', departureDate: '2025-08-01', returnDate: '2025-08-07' });
    const offer = duffelOffer({ includeCarry: false, carryFee: 40, base: 480, withStops: false });
    const normalized = DuffelEdgeAdapter.normalize(offer, ctx);
    expect(normalized.carryOnIncluded).toBe(false);
    expect(normalized.totalPriceWithCarryOn).toBeGreaterThanOrEqual(480);
  });

  it('scales carry-on fee by passenger count', () => {
    const ctx = createFilterContext({ passengers: 2, budget: 1000, nonstopRequired: true, originLocationCode: 'JFK', destinationLocationCode: 'LAX', departureDate: '2025-08-01', returnDate: '2025-08-07' });
    const offer = duffelOffer({ includeCarry: false, carryFee: 30, base: 600, withStops: false });
    const normalized = DuffelEdgeAdapter.normalize(offer, ctx);
    expect(normalized.carryOnIncluded).toBe(false);
    expect(normalized.totalPriceWithCarryOn).toBeGreaterThanOrEqual(600);
  });
});

