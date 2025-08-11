import { describe, it, expect } from 'vitest';
import { createFilterContext, normalizeOffers, FilterFactory } from '../_shared/filtering.ts';

function makeDuffelRaw({ id, base, carryFee, includeCarry, withStops = false }: { id: string; base: number; carryFee?: number; includeCarry?: boolean; withStops?: boolean }) {
  const seg = (from: string, to: string) => ({
    departing_at: '2025-08-01T10:00:00Z',
    arriving_at: '2025-08-01T14:00:00Z',
    origin: { iata_code: from },
    destination: { iata_code: to },
    marketing_carrier: { iata_code: 'XX' },
    marketing_carrier_flight_number: '123',
    duration: 'PT4H',
    stops: withStops ? [{ airport: { iata_code: 'DEN' } }] : [],
    passengers: [{ baggages: includeCarry ? [{ type: 'carry_on', quantity: 1 }] : [] }],
  });
  const raw: any = {
    id,
    total_amount: String(base),
    total_currency: 'USD',
    owner: { iata_code: 'XX' },
    slices: [ { segments: [seg('JFK','LAX')] }, { segments: [seg('LAX','JFK')] } ],
  };
  if (!includeCarry && carryFee !== undefined) {
    raw.available_services = [ { type: 'baggage', metadata: { title: 'Carry on bag' }, total_amount: String(carryFee) } ];
  }
  return raw;
}

describe('Edge pipeline selection with Duffel offers', () => {
  it('prefers cheapest effective total with carry-on cost within budget and enforces nonstop', async () => {
    const ctx = createFilterContext({
      budget: 520,
      currency: 'USD',
      originLocationCode: 'JFK',
      destinationLocationCode: 'LAX',
      departureDate: '2025-08-01',
      returnDate: '2025-08-07',
      nonstopRequired: true,
      passengers: 1,
    });

    // Offer A: base 480 + carry 40 = 520 (OK)
    const offerA = makeDuffelRaw({ id: 'A', base: 480, carryFee: 40, includeCarry: false });
    // Offer B: base 500 includes carry (OK) => total 500 (cheaper effective)
    const offerB = makeDuffelRaw({ id: 'B', base: 500, includeCarry: true });
    // Offer C: base 450 but has a stop (should be filtered out due to nonstop)
    const offerC = makeDuffelRaw({ id: 'C', base: 450, includeCarry: true, withStops: true });

    const normalized = normalizeOffers([
      { data: offerA, provider: 'Duffel' },
      { data: offerB, provider: 'Duffel' },
      { data: offerC, provider: 'Duffel' },
    ], ctx);

    const pipeline = FilterFactory.createPipeline('standard');
    const res = await pipeline.execute(normalized, ctx);

    expect(res.filteredOffers.length).toBeGreaterThan(0);
    // The cheapest effective is offer B (500) vs A (520)
    const cheapest = res.filteredOffers.sort((a,b)=> a.totalPriceWithCarryOn - b.totalPriceWithCarryOn)[0];
    expect(cheapest.rawData.id).toBe('B');
  });
});

