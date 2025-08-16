export type SubmitEventType = 'submit_attempt' | 'submit_success' | 'submit_failure';

export interface SubmitEventPayload {
  form: 'TripRequestForm';
  mode: 'manual' | 'auto';
  errorType?: 'validation' | 'transport' | 'service' | 'unknown';
}

let emitter: ((type: SubmitEventType, payload: SubmitEventPayload) => void) | null = null;

export function setSubmitEmitter(fn: typeof emitter) {
  emitter = fn;
}

export function emitSubmitEvent(type: SubmitEventType, payload: SubmitEventPayload) {
  if (process.env.VITE_FEATURE_ANALYTICS_SUBMIT !== '1') return; // feature-flag gate
  if (emitter) emitter(type, payload);
}
