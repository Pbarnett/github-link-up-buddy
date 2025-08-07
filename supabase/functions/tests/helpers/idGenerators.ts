// supabase/functions/tests/helpers/idGenerators.ts

/**
 * Deterministic ID generators for testing
 * Ensures both handler and test use the same ID patterns
 */

export function generateNotificationId(prefix = 'SN'): string {
  // Return deterministic ID pattern that tests expect
  return `${prefix}_deadbeef`;
}

export function generateMessageId(): string {
  return generateNotificationId('SN');
}

export function generateResendEmailId(): string {
  return generateNotificationId('SN');
}

export function generateSupabaseNotificationId(): string {
  return 'notification_id_123';
}

export function generateMockId(type: 'notification' | 'email' | 'user' = 'notification'): string {
  switch (type) {
    case 'email':
      return generateResendEmailId();
    case 'user':
      return 'user123';
    case 'notification':
    default:
      return generateSupabaseNotificationId();
  }
}
