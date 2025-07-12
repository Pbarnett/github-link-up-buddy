// tests/helpers/idGenerators.ts

/**
 * Deterministic ID generators for tests
 * Both handler and test should use these to avoid mismatches
 */

export function generateNotificationId(): string {
  return 'notification_id_123';
}

export function generateResendEmailId(): string {
  return 'SN_deadbeef';
}

export function generateMessageId(): string {
  return 'msg_deadbeef';
}

export function generateBookingId(): string {
  return 'booking_deadbeef';
}

// Reset counter for tests
let counter = 0;
export function resetCounters() {
  counter = 0;
}

export function generateTestId(prefix: string): string {
  return `${prefix}_${counter++}`;
}
