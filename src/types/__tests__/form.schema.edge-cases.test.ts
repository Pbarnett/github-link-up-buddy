import { describe, it, expect } from 'vitest';
import { tripFormSchema } from '@/types/form';

function base(overrides: Partial<any> = {}) {
  const now = new Date();
  const earliest = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const latest = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return {
    form_mode: 'manual',
    earliestDeparture: earliest,
    latestDeparture: latest,
    min_duration: 3,
    max_duration: 7,
    max_price: 1000,
    nyc_airports: ['JFK'],
    other_departure_airport: '',
    destination_airport: 'LAX',
    destination_other: '',
    nonstop_required: true,
    baggage_included_required: false,
    auto_book_enabled: false,
    preferred_payment_method_id: null,
    auto_book_consent: false,
    ...overrides,
  };
}

describe('tripFormSchema edge cases (table-driven)', () => {
  it.each([
    {
      name: 'rejects when date window > 60 days',
      patch: () => ({
        earliestDeparture: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        latestDeparture: new Date(Date.now() + 62 * 24 * 60 * 60 * 1000),
      }),
      expectValid: false,
    },
    {
      name: 'accepts when exactly 60 days',
      patch: () => ({
        earliestDeparture: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        latestDeparture: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      }),
      expectValid: true,
    },
    {
      name: 'requires at least one departure airport (nyc_airports or other)',
      patch: () => ({ nyc_airports: [], other_departure_airport: '' }),
      expectValid: false,
    },
    {
      name: 'requires exactly one of destination_airport or destination_other (neither provided)',
      patch: () => ({ destination_airport: '', destination_other: '' }),
      expectValid: false,
    },
    {
      name: 'requires exactly one of destination_airport or destination_other (both provided)',
      patch: () => ({ destination_airport: 'LAX', destination_other: 'Los Angeles' }),
      expectValid: false,
    },
    {
      name: 'auto mode enforces payment method and consent when auto_book_enabled=true',
      patch: () => ({ form_mode: 'auto', auto_book_enabled: true, preferred_payment_method_id: 'pm_123', auto_book_consent: true }),
      expectValid: true,
    },
  ])('$name', ({ patch, expectValid }) => {
    const payload = base(patch());
    if (expectValid) {
      expect(() => tripFormSchema.parse(payload)).not.toThrow();
    } else {
      expect(() => tripFormSchema.parse(payload)).toThrow();
    }
  });
});

