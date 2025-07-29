/**
 * Stripe Customer Lifecycle Management Service
 *
 * Handles customer data lifecycle for PCI compliance and GDPR compliance:
 * - Identifies and manages inactive customers
 * - Anonymizes or deletes customer data after retention periods
 * - Logs all lifecycle actions for audit trails
 * - Ensures compliance with data protection regulations
 */

import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { logger } from '@/lib/utils/logger';
interface CustomerLifecycleConfig {
  // Time periods in days
  inactiveThresholdDays: number; // When to consider a customer inactive
  anonymizationDelayDays: number; // How long to wait before anonymizing inactive customers
  deletionDelayDays: number; // How long to wait before full deletion
  batchSize: number; // Number of customers to process in each batch
  dryRun: boolean; // If true, only log actions without executing them
}

interface CustomerLifecycleAudit {
  customer_id: string;
  user_id: string | null;
  action: 'identified_inactive' | 'anonymized' | 'deleted' | 'retained';
  reason: string;
  metadata: Record<string, unknown>;
  performed_at: string;
}

interface InactiveCustomer {
  stripe_customer_id: string;
  user_id: string | null;
  last_activity: string;
  days_inactive: number;
  payment_methods_count: number;
  has_active_subscriptions: boolean;
  total_spent: number;
}

export class StripeCustomerLifecycleManager {
  private stripe: Stripe;
  private supabase: ReturnType<typeof createClient>;
  private config: CustomerLifecycleConfig;

  constructor(
    stripeSecretKey: string,
    supabaseUrl: string,
    supabaseKey: string,
    config: Partial<CustomerLifecycleConfig> = {}
  ) {
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-06-30.basil',
      typescript: true,
    });

    this.supabase = createClient(supabaseUrl, supabaseKey);

    this.config = {
      inactiveThresholdDays: config.inactiveThresholdDays ?? 365, // 1 year
      anonymizationDelayDays: config.anonymizationDelayDays ?? 1095, // 3 years
      deletionDelayDays: config.deletionDelayDays ?? 2555, // 7 years
      batchSize: config.batchSize ?? 50,
      dryRun: config.dryRun ?? false,
    };

    logger.info('Stripe Customer Lifecycle Manager initialized', {
      operation: 'lifecycle_manager_init',
      config: this.config,
    });
  }

  /**
   * Run the complete customer lifecycle management process
   */
  async runLifecycleProcess(): Promise<{
    identified: number;
    anonymized: number;
    deleted: number;
    errors: number;
  }> {
    logger.info('Starting customer lifecycle process', {
      operation: 'lifecycle_process_start',
      config: this.config,
    });

    const results = {
      identified: 0,
      anonymized: 0,
      deleted: 0,
      errors: 0,
    };

    try {
      // Step 1: Identify inactive customers
      const inactiveCustomers = await this.identifyInactiveCustomers();
      results.identified = inactiveCustomers.length;

      logger.info('Identified inactive customers', {
        operation: 'lifecycle_customers_identified',
        count: inactiveCustomers.length,
      });

      // Step 2: Process customers for anonymization
      const customersForAnonymization = inactiveCustomers.filter(
        customer =>
          customer.days_inactive >= this.config.anonymizationDelayDays &&
          customer.days_inactive < this.config.deletionDelayDays
      );

      for (const customer of customersForAnonymization) {
        try {
          await this.anonymizeCustomer(customer);
          results.anonymized++;
        } catch (error) {
          logger.error('Failed to anonymize customer', {
            operation: 'lifecycle_anonymization_failed',
            customerId: customer.stripe_customer_id,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          results.errors++;
        }
      }

      // Step 3: Process customers for deletion
      const customersForDeletion = inactiveCustomers.filter(
        customer => customer.days_inactive >= this.config.deletionDelayDays
      );

      for (const customer of customersForDeletion) {
        try {
          await this.deleteCustomer(customer);
          results.deleted++;
        } catch (error) {
          logger.error('Failed to delete customer', {
            operation: 'lifecycle_deletion_failed',
            customerId: customer.stripe_customer_id,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          results.errors++;
        }
      }

      logger.info('Customer lifecycle process completed', {
        operation: 'lifecycle_process_completed',
        results,
      });

      return results;
    } catch (error) {
      logger.error('Customer lifecycle process failed', {
        operation: 'lifecycle_process_failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Identify customers who haven't been active for a specified period
   */
  private async identifyInactiveCustomers(): Promise<InactiveCustomer[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(
      cutoffDate.getDate() - this.config.inactiveThresholdDays
    );

    // Query local database for customer activity
    const { data: customers, error } = await this.supabase
      .from('stripe_customers')
      .select(
        `
        stripe_customer_id,
        user_id,
        created_at,
        last_payment_at,
        payment_methods!inner(count)
      `
      )
      .lt('last_payment_at', cutoffDate.toISOString())
      .order('last_payment_at', { ascending: true })
      .limit(this.config.batchSize * 2); // Get more than batch size for filtering

    if (error) {
      throw new Error(`Failed to query inactive customers: ${error.message}`);
    }

    const inactiveCustomers: InactiveCustomer[] = [];

    for (const customer of customers || []) {
      try {
        // Get additional customer data from Stripe
        const stripeCustomer = await this.stripe.customers.retrieve(
          customer.stripe_customer_id
        );

        if (stripeCustomer.deleted) {
          continue; // Skip already deleted customers
        }

        // Calculate days inactive
        const lastActivity = new Date(
          customer.last_payment_at || customer.created_at
        );
        const daysInactive = Math.floor(
          (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Check for active subscriptions
        const subscriptions = await this.stripe.subscriptions.list({
          customer: customer.stripe_customer_id,
          status: 'active',
          limit: 1,
        });

        // Get payment methods count
        const paymentMethods = await this.stripe.paymentMethods.list({
          customer: customer.stripe_customer_id,
          limit: 100,
        });

        // Calculate total spent (simplified - you might want to get this from your local data)
        const charges = await this.stripe.charges.list({
          customer: customer.stripe_customer_id,
          limit: 100,
        });

        const totalSpent =
          charges.data.reduce((sum, charge) => {
            return charge.paid ? sum + charge.amount : sum;
          }, 0) / 100; // Convert from cents

        inactiveCustomers.push({
          stripe_customer_id: customer.stripe_customer_id,
          user_id: customer.user_id,
          last_activity: lastActivity.toISOString(),
          days_inactive: daysInactive,
          payment_methods_count: paymentMethods.data.length,
          has_active_subscriptions: subscriptions.data.length > 0,
          total_spent: totalSpent,
        });

        // Log the identification
        await this.logLifecycleAudit({
          customer_id: customer.stripe_customer_id,
          user_id: customer.user_id,
          action: 'identified_inactive',
          reason: `Customer inactive for ${daysInactive} days`,
          metadata: {
            days_inactive: daysInactive,
            payment_methods_count: paymentMethods.data.length,
            has_active_subscriptions: subscriptions.data.length > 0,
            total_spent: totalSpent,
          },
          performed_at: new Date().toISOString(),
        });
      } catch (error) {
        logger.error('Error processing customer for inactivity check', {
          operation: 'lifecycle_inactivity_check_failed',
          customerId: customer.stripe_customer_id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return inactiveCustomers.slice(0, this.config.batchSize);
  }

  /**
   * Anonymize customer data while retaining necessary audit information
   */
  private async anonymizeCustomer(customer: InactiveCustomer): Promise<void> {
    logger.info('Starting customer anonymization', {
      operation: 'lifecycle_anonymization_start',
      customerId: customer.stripe_customer_id,
      daysInactive: customer.days_inactive,
    });

    if (this.config.dryRun) {
      logger.info('DRY RUN: Would anonymize customer', {
        operation: 'lifecycle_anonymization_dry_run',
        customerId: customer.stripe_customer_id,
      });
      return;
    }

    try {
      // Don't anonymize customers with active subscriptions or recent high spending
      if (customer.has_active_subscriptions) {
        await this.logLifecycleAudit({
          customer_id: customer.stripe_customer_id,
          user_id: customer.user_id,
          action: 'retained',
          reason: 'Customer has active subscriptions',
          metadata: { has_active_subscriptions: true },
          performed_at: new Date().toISOString(),
        });
        return;
      }

      if (customer.total_spent > 10000) {
        // $10,000 threshold
        await this.logLifecycleAudit({
          customer_id: customer.stripe_customer_id,
          user_id: customer.user_id,
          action: 'retained',
          reason: 'High-value customer - manual review required',
          metadata: { total_spent: customer.total_spent },
          performed_at: new Date().toISOString(),
        });
        return;
      }

      // Step 1: Anonymize customer data in Stripe
      const anonymizedEmail = `anonymized-${customer.stripe_customer_id.slice(-8)}@deleted.local`;

      await this.stripe.customers.update(customer.stripe_customer_id, {
        email: anonymizedEmail,
        name: 'ANONYMIZED',
        phone: null,
        description: 'Customer data anonymized for compliance',
        metadata: {
          anonymized_at: new Date().toISOString(),
          original_anonymization_reason:
            'Inactive customer lifecycle management',
        },
        // Clear address information
        address: {
          line1: null,
          line2: null,
          city: null,
          state: null,
          postal_code: null,
          country: null,
        },
        shipping: null,
      });

      // Step 2: Remove all payment methods
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customer.stripe_customer_id,
        limit: 100,
      });

      for (const pm of paymentMethods.data) {
        await this.stripe.paymentMethods.detach(pm.id);
      }

      // Step 3: Update local database
      if (customer.user_id) {
        // Anonymize local customer record
        await this.supabase
          .from('stripe_customers')
          .update({
            anonymized_at: new Date().toISOString(),
            anonymization_reason: 'Inactive customer lifecycle management',
          })
          .eq('stripe_customer_id', customer.stripe_customer_id);

        // Remove payment methods from local database
        await this.supabase
          .from('payment_methods')
          .delete()
          .eq('stripe_customer_id', customer.stripe_customer_id);
      }

      // Step 4: Log the anonymization
      await this.logLifecycleAudit({
        customer_id: customer.stripe_customer_id,
        user_id: customer.user_id,
        action: 'anonymized',
        reason: `Customer anonymized after ${customer.days_inactive} days of inactivity`,
        metadata: {
          days_inactive: customer.days_inactive,
          payment_methods_removed: paymentMethods.data.length,
          anonymized_email: anonymizedEmail,
        },
        performed_at: new Date().toISOString(),
      });

      logger.info('Customer anonymization completed', {
        operation: 'lifecycle_anonymization_completed',
        customerId: customer.stripe_customer_id,
        paymentMethodsRemoved: paymentMethods.data.length,
      });
    } catch (error) {
      logger.error('Customer anonymization failed', {
        operation: 'lifecycle_anonymization_failed',
        customerId: customer.stripe_customer_id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Delete customer data completely after the deletion delay period
   */
  private async deleteCustomer(customer: InactiveCustomer): Promise<void> {
    logger.info('Starting customer deletion', {
      operation: 'lifecycle_deletion_start',
      customerId: customer.stripe_customer_id,
      daysInactive: customer.days_inactive,
    });

    if (this.config.dryRun) {
      logger.info('DRY RUN: Would delete customer', {
        operation: 'lifecycle_deletion_dry_run',
        customerId: customer.stripe_customer_id,
      });
      return;
    }

    try {
      // Step 1: Verify customer can be deleted (no active subscriptions, charges, etc.)
      const subscriptions = await this.stripe.subscriptions.list({
        customer: customer.stripe_customer_id,
        status: 'active',
        limit: 1,
      });

      if (subscriptions.data.length > 0) {
        await this.logLifecycleAudit({
          customer_id: customer.stripe_customer_id,
          user_id: customer.user_id,
          action: 'retained',
          reason: 'Customer has active subscriptions - cannot delete',
          metadata: { active_subscriptions: subscriptions.data.length },
          performed_at: new Date().toISOString(),
        });
        return;
      }

      // Step 2: Archive payment history and critical audit data before deletion
      const charges = await this.stripe.charges.list({
        customer: customer.stripe_customer_id,
        limit: 100,
      });

      const archiveData = {
        customer_id: customer.stripe_customer_id,
        user_id: customer.user_id,
        deletion_date: new Date().toISOString(),
        charges_count: charges.data.length,
        total_amount_processed: charges.data.reduce(
          (sum, charge) => sum + charge.amount,
          0
        ),
        last_charge_date:
          charges.data.length > 0 ? charges.data[0].created : null,
      };

      // Store archive data in a separate audit table
      await this.supabase.from('customer_deletion_archive').insert(archiveData);

      // Step 3: Delete customer from Stripe
      await this.stripe.customers.del(customer.stripe_customer_id);

      // Step 4: Clean up local database
      if (customer.user_id) {
        // Delete from local tables
        await this.supabase
          .from('payment_methods')
          .delete()
          .eq('stripe_customer_id', customer.stripe_customer_id);

        await this.supabase
          .from('stripe_customers')
          .delete()
          .eq('stripe_customer_id', customer.stripe_customer_id);
      }

      // Step 5: Log the deletion
      await this.logLifecycleAudit({
        customer_id: customer.stripe_customer_id,
        user_id: customer.user_id,
        action: 'deleted',
        reason: `Customer deleted after ${customer.days_inactive} days of inactivity`,
        metadata: {
          days_inactive: customer.days_inactive,
          charges_archived: charges.data.length,
          total_amount_processed: archiveData.total_amount_processed,
        },
        performed_at: new Date().toISOString(),
      });

      logger.info('Customer deletion completed', {
        operation: 'lifecycle_deletion_completed',
        customerId: customer.stripe_customer_id,
        chargesArchived: charges.data.length,
      });
    } catch (error) {
      logger.error('Customer deletion failed', {
        operation: 'lifecycle_deletion_failed',
        customerId: customer.stripe_customer_id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Log lifecycle audit events
   */
  private async logLifecycleAudit(
    audit: CustomerLifecycleAudit
  ): Promise<void> {
    try {
      await this.supabase.from('customer_lifecycle_audit').insert(audit);
    } catch (error) {
      logger.error('Failed to log lifecycle audit event', {
        operation: 'lifecycle_audit_log_failed',
        customerId: audit.customer_id,
        action: audit.action,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      // Don't throw here - audit logging failure shouldn't stop the process
    }
  }

  /**
   * Get lifecycle statistics and reporting
   */
  async getLifecycleStats(): Promise<{
    totalCustomers: number;
    inactiveCustomers: number;
    anonymizedCustomers: number;
    recentActions: CustomerLifecycleAudit[];
  }> {
    try {
      // Get total customers
      const { count: totalCustomers } = await this.supabase
        .from('stripe_customers')
        .select('*', { count: 'exact', head: true });

      // Get inactive customers count
      const cutoffDate = new Date();
      cutoffDate.setDate(
        cutoffDate.getDate() - this.config.inactiveThresholdDays
      );

      const { count: inactiveCustomers } = await this.supabase
        .from('stripe_customers')
        .select('*', { count: 'exact', head: true })
        .lt('last_payment_at', cutoffDate.toISOString());

      // Get anonymized customers count
      const { count: anonymizedCustomers } = await this.supabase
        .from('stripe_customers')
        .select('*', { count: 'exact', head: true })
        .not('anonymized_at', 'is', null);

      // Get recent audit actions
      const { data: recentActions } = await this.supabase
        .from('customer_lifecycle_audit')
        .select('*')
        .order('performed_at', { ascending: false })
        .limit(50);

      return {
        totalCustomers: totalCustomers || 0,
        inactiveCustomers: inactiveCustomers || 0,
        anonymizedCustomers: anonymizedCustomers || 0,
        recentActions: recentActions || [],
      };
    } catch (error) {
      logger.error('Failed to get lifecycle stats', {
        operation: 'lifecycle_stats_failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }
}

/**
 * Factory function to create a configured lifecycle manager
 */
export function createCustomerLifecycleManager(
  config: Partial<CustomerLifecycleConfig> = {}
): StripeCustomerLifecycleManager {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!stripeKey || !supabaseUrl || !supabaseKey) {
    throw new Error(
      'Missing required environment variables for lifecycle manager'
    );
  }

  return new StripeCustomerLifecycleManager(
    stripeKey,
    supabaseUrl,
    supabaseKey,
    config
  );
}
