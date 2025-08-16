import { describe, it, expect, vi, beforeEach } from 'vitest';
import { emitSubmitEvent, setSubmitEmitter, type SubmitEventType } from '@/lib/analytics/submitEvents';

// Temporarily toggle the flag in process.env for test
const withFlag = (fn: () => void) => {
  const prev = process.env.VITE_FEATURE_ANALYTICS_SUBMIT;
  process.env.VITE_FEATURE_ANALYTICS_SUBMIT = '1';
  try { fn(); } finally { process.env.VITE_FEATURE_ANALYTICS_SUBMIT = prev; }
};

describe('submitEvents analytics', () => {
  beforeEach(() => {
    setSubmitEmitter(null as any);
  });

  it('emits when flag enabled', () => {
    withFlag(() => {
      const spy = vi.fn();
      setSubmitEmitter(spy as any);
      emitSubmitEvent('submit_attempt', { form: 'TripRequestForm', mode: 'manual' });
      expect(spy).toHaveBeenCalledWith('submit_attempt', { form: 'TripRequestForm', mode: 'manual' });
    });
  });

  it('does not emit when flag disabled', () => {
    const spy = vi.fn();
    setSubmitEmitter(spy as any);
    emitSubmitEvent('submit_attempt', { form: 'TripRequestForm', mode: 'manual' });
    expect(spy).not.toHaveBeenCalled();
  });
});
