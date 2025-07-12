// Audit Service - Enhanced logging for payment methods and security events
// Day 4: Payments & Wallet System

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface AuditEvent {
  user_id: string;
  action: string;
  table_name: string;
  record_id: string;
  old_data?: Record<string, any>;
  new_data?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
}

/**
 * Log an audit event to the traveler_data_audit table
 * Enhanced for payment method security logging
 */
export async function logAuditEvent(event: AuditEvent): Promise<void> {
  try {
    const { error } = await supabase
      .from('traveler_data_audit')
      .insert({
        user_id: event.user_id,
        action: event.action,
        table_name: event.table_name,
        record_id: event.record_id,
        old_data: event.old_data || null,
        new_data: event.new_data || null,
        ip_address: event.ip_address || null,
        user_agent: event.user_agent || null,
        session_id: event.session_id || null,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Failed to log audit event:', error);
      // Don't throw - audit logging shouldn't break the main flow
    }
  } catch (error) {
    console.error('Error in audit logging:', error);
  }
}

/**
 * Log payment method events with enhanced security context
 */
export async function logPaymentMethodEvent(
  userId: string,
  action: 'ADD_PM' | 'UPDATE_PM' | 'DELETE_PM' | 'SET_DEFAULT_PM',
  paymentMethodId: string,
  data: {
    brand?: string;
    last4?: string;
    is_default?: boolean;
    masked_pm_id?: string;
    error?: string;
  },
  context?: {
    ip_address?: string;
    user_agent?: string;
    session_id?: string;
  }
): Promise<void> {
  await logAuditEvent({
    user_id: userId,
    action,
    table_name: 'payment_methods',
    record_id: paymentMethodId,
    new_data: data,
    ip_address: context?.ip_address,
    user_agent: context?.user_agent,
    session_id: context?.session_id,
  });
}

/**
 * Log AI activity for compliance
 */
export async function logAIActivity(
  userId: string,
  action: string,
  details: Record<string, any>
): Promise<void> {
  try {
    const { error } = await supabase
      .from('ai_activity')
      .insert({
        user_id: userId,
        action,
        details,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Failed to log AI activity:', error);
    }
  } catch (error) {
    console.error('Error logging AI activity:', error);
  }
}

//
// Auto-added placeholder exports so TypeScript can compile.
// Replace with real implementation when ready.
export const placeholder = () => undefined;
export default placeholder;
