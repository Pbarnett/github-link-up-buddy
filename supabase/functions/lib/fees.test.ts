import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use dynamic import to ensure Deno globals not required in test env
import * as fees from './fees.ts';

describe('fees helper', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  it('derives threshold preferring max_price, falling back to budget', () => {
    expect(fees.deriveThresholdPrice({ max_price: 400, budget: 350 })).toBe(400);
    expect(fees.deriveThresholdPrice({ max_price: null, budget: 350 })).toBe(350);
    expect(fees.deriveThresholdPrice({ max_price: undefined, budget: undefined })).toBeUndefined();
  });

  it('computes zero fee when savings is zero or negative', () => {
    const r1 = fees.computeTotalWithFeeCents({ actualPrice: 400, thresholdPrice: 400 });
    expect(r1.feeCents).toBe(0);
    expect(r1.totalCents).toBe(40000);

    const r2 = fees.computeTotalWithFeeCents({ actualPrice: 450, thresholdPrice: 400 });
    expect(r2.feeCents).toBe(0);
    expect(r2.totalCents).toBe(45000);
  });

  it('applies default 5% fee when env not set', () => {
    const r = fees.computeTotalWithFeeCents({ actualPrice: 300, thresholdPrice: 400 });
    // savings = 100, fee = 5, cents = 500; total = 30000 + 500
    expect(r.feeCents).toBe(500);
    expect(r.totalCents).toBe(30500);
    expect(r.feePct).toBeCloseTo(0.05, 5);
  });

  it('applies custom fee pct when provided explicitly', () => {
    const r = fees.computeTotalWithFeeCents({ actualPrice: 300, thresholdPrice: 400, feePct: 0.1 });
    // 10% of 100 = 10 -> 1000 cents
    expect(r.feeCents).toBe(1000);
    expect(r.totalCents).toBe(31000);
    expect(r.feePct).toBeCloseTo(0.1, 5);
  });

  it('respects minimum fee cap (SAVINGS_FEE_MIN_CENTS)', () => {
    // savings = 100, 5% => 500 cents, but min cap 700 => feeCents = 700
    // @ts-ignore
    globalThis.Deno = { env: { get: (k: string) => ({ SAVINGS_FEE_MIN_CENTS: '700' } as any)[k] } } as any;
    const r = fees.computeTotalWithFeeCents({ actualPrice: 300, thresholdPrice: 400 });
    expect(r.feeCents).toBe(700);
    expect(r.totalCents).toBe(30700);
  });

  it('respects maximum fee cap (SAVINGS_FEE_MAX_CENTS)', () => {
    // savings = 1000, 5% => 5000 cents, but max cap 1200 => feeCents = 1200
    // @ts-ignore
    globalThis.Deno = { env: { get: (k: string) => ({ SAVINGS_FEE_MAX_CENTS: '1200' } as any)[k] } } as any;
    const r = fees.computeTotalWithFeeCents({ actualPrice: 100, thresholdPrice: 1100 });
    expect(r.feeCents).toBe(1200);
    expect(r.totalCents).toBe(11200);
  });
});

