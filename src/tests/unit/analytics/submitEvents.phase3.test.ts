import { describe, it, expect, beforeEach, vi } from 'vitest';
import { emitSubmitEvent, setSubmitEmitter, type SubmitEventType } from '@/lib/analytics/submitEvents';

function withFlag(flagValue: string | undefined, fn: () => void) {
  const prev = process.env.VITE_FEATURE_ANALYTICS_SUBMIT;
  process.env.VITE_FEATURE_ANALYTICS_SUBMIT = flagValue as any;
  try { fn(); } finally { process.env.VITE_FEATURE_ANALYTICS_SUBMIT = prev as any; }
}

describe('submitEvents (Phase 3 analytics) [unit]', () => {
  beforeEach(() => {
    setSubmitEmitter(null as any);
  });

  it('emits attempt/success/failure when flag is ON', () => {
    withFlag('1', () => {
      const spy = vi.fn();
      setSubmitEmitter(spy as any);
      emitSubmitEvent('submit_attempt', { form: 'TripRequestForm', mode: 'manual' });
      emitSubmitEvent('submit_success', { form: 'TripRequestForm', mode: 'manual' });
      emitSubmitEvent('submit_failure', { form: 'TripRequestForm', mode: 'manual', errorType: 'validation' });
      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveBeenNthCalledWith(1, 'submit_attempt', { form: 'TripRequestForm', mode: 'manual' });
      expect(spy).toHaveBeenNthCalledWith(2, 'submit_success', { form: 'TripRequestForm', mode: 'manual' });
      expect(spy).toHaveBeenNthCalledWith(3, 'submit_failure', { form: 'TripRequestForm', mode: 'manual', errorType: 'validation' });
    });
  });

  it('does not emit when flag is OFF or undefined', () => {
    const spy = vi.fn();
    setSubmitEmitter(spy as any);

    withFlag(undefined, () => {
      emitSubmitEvent('submit_attempt', { form: 'TripRequestForm', mode: 'manual' });
      expect(spy).not.toHaveBeenCalled();
    });

    withFlag('0', () => {
      emitSubmitEvent('submit_success', { form: 'TripRequestForm', mode: 'manual' });
      expect(spy).not.toHaveBeenCalled();
    });
  });
});

