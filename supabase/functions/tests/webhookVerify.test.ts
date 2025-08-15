import { describe, it, expect } from 'vitest';
import { verifyStripeSignature } from '../lib/webhookVerify.ts';

describe('verifyStripeSignature helper', () => {
  it('returns invalid when signature or secret missing', () => {
    const res1 = verifyStripeSignature('payload', null, 'secret', () => ({}));
    expect(res1.valid).toBe(false);
    expect(res1.error).toBeDefined();

    const res2 = verifyStripeSignature('payload', 'sig', undefined, () => ({}));
    expect(res2.valid).toBe(false);
  });

  it('returns invalid when constructEvent throws', () => {
    const construct = () => { throw new Error('bad sig'); };
    const res = verifyStripeSignature('payload', 'sig', 'secret', construct);
    expect(res.valid).toBe(false);
    expect(res.error).toBe('bad sig');
  });

  it('returns valid and event when constructEvent succeeds', () => {
    const fakeEvent = { id: 'evt_test', type: 'checkout.session.completed' };
    const construct = () => fakeEvent;
    const res = verifyStripeSignature('payload', 'sig', 'secret', construct);
    expect(res.valid).toBe(true);
    expect(res.event).toEqual(fakeEvent);
  });
});
