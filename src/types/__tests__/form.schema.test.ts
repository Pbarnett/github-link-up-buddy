import { describe, it, expect } from 'vitest';
import { tripFormSchema } from '@/types/form';

function validBase(overrides: Partial<any> = {}) {
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

describe('tripFormSchema', () => {
  it('accepts a valid manual-mode payload', () => {
    const parsed = tripFormSchema.parse(validBase());
    expect(parsed.destination_airport).toBe('LAX');
  });

  it('rejects when latestDeparture <= earliestDeparture', () => {
    const earliest = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const latest = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    expect(() => tripFormSchema.parse(validBase({ earliestDeparture: earliest, latestDeparture: latest }))).toThrow();
  });

  it('rejects date windows > 60 days', () => {
    const earliest = new Date();
    const latest = new Date(Date.now() + 61 * 24 * 60 * 60 * 1000);
    expect(() => tripFormSchema.parse(validBase({ earliestDeparture: earliest, latestDeparture: latest }))).toThrow();
  });

  it('requires at least one departure airport', () => {
    expect(() => tripFormSchema.parse(validBase({ nyc_airports: [], other_departure_airport: '' }))).toThrow();
  });

  it('enforces IATA when destination_airport is provided', () => {
    expect(() => tripFormSchema.parse(validBase({ destination_airport: 'LA' }))).toThrow();
    expect(() => tripFormSchema.parse(validBase({ destination_airport: 'LAX' }))).not.toThrow();
  });

  it('requires exactly one of destination_airport or destination_other', () => {
    expect(() => tripFormSchema.parse(validBase({ destination_airport: '', destination_other: '' }))).toThrow();
    expect(() => tripFormSchema.parse(validBase({ destination_airport: 'LAX', destination_other: 'Los Angeles' }))).toThrow();
    expect(() => tripFormSchema.parse(validBase({ destination_airport: '', destination_other: 'Los Angeles' }))).not.toThrow();
  });

  it('auto mode requires payment method and consent when auto_book_enabled', () => {
    // Missing payment method
    expect(() => tripFormSchema.parse(validBase({ form_mode: 'auto', auto_book_enabled: true, preferred_payment_method_id: null }))).toThrow();
    // Payment provided but missing consent
    expect(() => tripFormSchema.parse(validBase({ form_mode: 'auto', auto_book_enabled: true, preferred_payment_method_id: 'pm_123', auto_book_consent: false }))).toThrow();
    // All provided
    expect(() => tripFormSchema.parse(validBase({ form_mode: 'auto', auto_book_enabled: true, preferred_payment_method_id: 'pm_123', auto_book_consent: true }))).not.toThrow();
  });

  it('clamps durations logically via transform (indirectly test via schema validity for extremes)', () => {
    expect(() => tripFormSchema.parse(validBase({ min_duration: 1, max_duration: 30 }))).not.toThrow();
    expect(() => tripFormSchema.parse(validBase({ min_duration: 0 }))).toThrow();
    expect(() => tripFormSchema.parse(validBase({ max_duration: 31 }))).toThrow();
    expect(() => tripFormSchema.parse(validBase({ min_duration: 10, max_duration: 5 }))).toThrow();
  });
});

