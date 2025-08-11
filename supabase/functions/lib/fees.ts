// supabase/functions/lib/fees.ts
// Shared helpers for calculating savings-based fees for Stripe charges

export interface TripRequestPricing {
  max_price?: number | null;
  budget?: number | null;
}

export interface FeeComputationInput {
  // Prices in major currency units (e.g., USD dollars)
  thresholdPrice?: number | null;
  actualPrice: number; // required
  feePct?: number; // 0..1, optional override
}

/**
 * Reads fee percent from environment (SAVINGS_FEE_PCT), defaults to 0.05 (5%).
 * Clamps to [0, 1].
 */
export function getFeePctFromEnv(): number {
  const raw = (typeof Deno !== 'undefined' ? Deno.env.get('SAVINGS_FEE_PCT') : undefined) || '';
  const parsed = Number.parseFloat(raw);
  const pct = Number.isFinite(parsed) ? parsed : 0.05;
  return Math.max(0, Math.min(1, pct));
}

/**
 * Picks the user's threshold price from a trip request record, preferring max_price if set,
 * otherwise falling back to budget. Returns undefined if neither is available.
 */
export function deriveThresholdPrice(tr: TripRequestPricing | null | undefined): number | undefined {
  if (!tr) return undefined;
  const maxPrice = toNumberOrUndefined(tr.max_price);
  if (isPositive(maxPrice)) return maxPrice as number;
  const budget = toNumberOrUndefined(tr.budget);
  if (isPositive(budget)) return budget as number;
  return undefined;
}

/**
 * Computes the savings-based fee in cents and returns a structured result with metadata-ready values.
 * - Prices are provided in major units; return fee in minor units (cents)
 */
export function computeSavingsFeeCents(input: FeeComputationInput): {
  feeCents: number;
  savings: number; // major units
  feePct: number; // 0..1
  thresholdPrice?: number;
} {
  const feePct = isFiniteNumber(input.feePct) ? (input.feePct as number) : getFeePctFromEnv();
  const threshold = isFiniteNumber(input.thresholdPrice) ? (input.thresholdPrice as number) : undefined;
  const actual = input.actualPrice;

  if (!isFiniteNumber(actual) || actual <= 0) {
    return { feeCents: 0, savings: 0, feePct, thresholdPrice: threshold };
  }

  const savings = threshold && threshold > actual ? (threshold - actual) : 0;
  const feeMajor = savings * feePct;
  let feeCents = Math.round(feeMajor * 100);
  // Apply optional min/max caps from env (in cents)
  const { minCents, maxCents } = getMinMaxFeeCentsFromEnv();
  if (Number.isFinite(minCents) && minCents! > 0) feeCents = Math.max(feeCents, minCents!);
  if (Number.isFinite(maxCents) && maxCents! > 0) feeCents = Math.min(feeCents, maxCents!);
  return { feeCents, savings, feePct, thresholdPrice: threshold };
}

/**
 * Computes the total amount in cents (actual price + fee) and returns metadata for Stripe.
 */
export function computeTotalWithFeeCents(args: {
  actualPrice: number; // major
  thresholdPrice?: number;
  feePct?: number;
}): {
  totalCents: number;
  feeCents: number;
  savings: number; // major
  feePct: number;
  thresholdPrice?: number;
} {
  const { feeCents, savings, feePct, thresholdPrice } = computeSavingsFeeCents({
    actualPrice: args.actualPrice,
    thresholdPrice: args.thresholdPrice,
    feePct: args.feePct,
  });
  const actualCents = Math.round(args.actualPrice * 100);
  const totalCents = actualCents + feeCents;
  return { totalCents, feeCents, savings, feePct, thresholdPrice };
}

export function getMinMaxFeeCentsFromEnv(): { minCents?: number, maxCents?: number } {
  const getNum = (key: string) => {
    const raw = (typeof Deno !== 'undefined' ? Deno.env.get(key) : undefined) || '';
    const n = Number.parseInt(raw, 10);
    return Number.isFinite(n) ? n : undefined;
  };
  const minCents = getNum('SAVINGS_FEE_MIN_CENTS');
  const maxCents = getNum('SAVINGS_FEE_MAX_CENTS');
  return { minCents, maxCents };
}

function toNumberOrUndefined(v: unknown): number | undefined {
  const n = typeof v === 'string' ? Number.parseFloat(v) : (typeof v === 'number' ? v : NaN);
  return Number.isFinite(n) ? n : undefined;
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

function isPositive(v: unknown): v is number {
  return isFiniteNumber(v) && v > 0;
}
