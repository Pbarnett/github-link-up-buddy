import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  generateIdempotencyKey,
  exponentialBackoff,
  rateLimiter,
} from '../../packages/shared/stripe';
import { buildPaymentMetadata } from './stripeService';
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

/**
 * Advanced Subscription Models per Stripe API reference
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  pricing_type: 'fixed' | 'usage_based' | 'tiered' | 'hybrid';
  currency: string;
  amount?: number; // For fixed pricing
  interval: 'day' | 'week' | 'month' | 'year';
  interval_count: number;
  trial_period_days?: number;
  usage_type?: 'metered' | 'licensed';
  tiers?: PricingTier[];
  features: string[];
  metadata: Record<string, string>;
}

export interface PricingTier {
  up_to: number | 'inf';
  unit_amount: number;
  flat_amount?: number;
}

export interface SubscriptionParams {
  customerId: string;
  planId: string;
  paymentMethodId?: string;
  prorationBehavior?: 'none' | 'create_prorations' | 'always_invoice';
  trial_end?: number;
  coupon?: string;
  metadata?: Record<string, string>;
  payment_behavior?:
    | 'default_incomplete'
    | 'error_if_incomplete'
    | 'allow_incomplete';
  collection_method?: 'charge_automatically' | 'send_invoice';
}

/**
 * Multi-currency subscription configuration per API reference
 */
export interface MultiCurrencyConfig {
  primary_currency: string;
  supported_currencies: string[];
  currency_options: {
    [currency: string]: {
      minimum_amount: number;
      maximum_amount: number;
      suggested_amounts: number[];
    };
  };
}

/**
 * Advanced Stripe Subscription Service
 * Implements all subscription features from API reference
 */
export class StripeSubscriptionService {
  private static instance: StripeSubscriptionService;

  public static getInstance(): StripeSubscriptionService {
    if (!StripeSubscriptionService.instance) {
      StripeSubscriptionService.instance = new StripeSubscriptionService();
    }
    return StripeSubscriptionService.instance;
  }

  /**
   * Create subscription with advanced features
   * Supports all subscription models from API reference
   */
  async createSubscription(params: SubscriptionParams): Promise<any> {
    await rateLimiter.waitForSlot();

    return exponentialBackoff(async () => {
      const { data, error } = await supabase.functions.invoke(
        'create-subscription',
        {
          body: {
            customer_id: params.customerId,
            price_id: params.planId,
            payment_method_id: params.paymentMethodId,
            proration_behavior: params.prorationBehavior || 'create_prorations',
            trial_end: params.trial_end,
            coupon: params.coupon,
            payment_behavior: params.payment_behavior || 'default_incomplete',
            collection_method:
              params.collection_method || 'charge_automatically',
            metadata: buildPaymentMetadata({
              userId: params.customerId,
              bookingType: 'premium',
              additionalData: params.metadata || {},
            }),
          },
        }
      );

      if (error) {
        throw error;
      }

      return data;
    });
  }

  /**
   * Update subscription with prorations
   * Handles all proration scenarios per API reference
   */
  async updateSubscription(
    subscriptionId: string,
    updates: {
      planId?: string;
      quantity?: number;
      proration_behavior?: 'none' | 'create_prorations' | 'always_invoice';
      billing_cycle_anchor?: 'now' | 'unchanged' | number;
      metadata?: Record<string, string>;
    }
  ): Promise<any> {
    await rateLimiter.waitForSlot();

    return exponentialBackoff(async () => {
      const { data, error } = await supabase.functions.invoke(
        'update-subscription',
        {
          body: {
            subscription_id: subscriptionId,
            price_id: updates.planId,
            quantity: updates.quantity,
            proration_behavior:
              updates.proration_behavior || 'create_prorations',
            billing_cycle_anchor: updates.billing_cycle_anchor,
            metadata: updates.metadata,
          },
        }
      );

      if (error) {
        throw error;
      }

      return data;
    });
  }

  /**
   * Cancel subscription with dunning management
   * Implements API reference cancellation patterns
   */
  async cancelSubscription(
    subscriptionId: string,
    options: {
      cancel_at_period_end?: boolean;
      cancel_at?: number;
      invoice_now?: boolean;
      prorate?: boolean;
      cancellation_details?: {
        comment?: string;
        feedback?:
          | 'too_expensive'
          | 'missing_features'
          | 'switched_service'
          | 'unused'
          | 'customer_service'
          | 'too_complex'
          | 'low_quality'
          | 'other';
      };
    } = {}
  ): Promise<any> {
    await rateLimiter.waitForSlot();

    return exponentialBackoff(async () => {
      const { data, error } = await supabase.functions.invoke(
        'cancel-subscription',
        {
          body: {
            subscription_id: subscriptionId,
            cancel_at_period_end: options.cancel_at_period_end ?? true,
            cancel_at: options.cancel_at,
            invoice_now: options.invoice_now,
            prorate: options.prorate,
            cancellation_details: options.cancellation_details,
          },
        }
      );

      if (error) {
        throw error;
      }

      return data;
    });
  }

  /**
   * Create usage-based subscription
   * For metered billing per API reference
   */
  async createUsageBasedSubscription(params: {
    customerId: string;
    meterId: string;
    paymentMethodId?: string;
    default_price_data?: {
      currency: string;
      unit_amount: number;
      recurring_interval: 'month' | 'year';
    };
  }): Promise<any> {
    await rateLimiter.waitForSlot();

    return exponentialBackoff(async () => {
      const { data, error } = await supabase.functions.invoke(
        'create-usage-subscription',
        {
          body: {
            customer_id: params.customerId,
            meter_id: params.meterId,
            payment_method_id: params.paymentMethodId,
            default_price_data: params.default_price_data,
            metadata: buildPaymentMetadata({
              userId: params.customerId,
              bookingType: 'business',
            }),
          },
        }
      );

      if (error) {
        throw error;
      }

      return data;
    });
  }

  /**
   * Report usage for metered billing
   * Per API reference usage reporting
   */
  async reportUsage(params: {
    subscriptionItemId: string;
    quantity: number;
    timestamp?: number;
    action?: 'increment' | 'set';
    idempotencyKey?: string;
  }): Promise<any> {
    const idempotencyKey =
      params.idempotencyKey ||
      generateIdempotencyKey(params.subscriptionItemId, 'usage_report');

    await rateLimiter.waitForSlot();

    return exponentialBackoff(async () => {
      const { data, error } = await supabase.functions.invoke('report-usage', {
        body: {
          subscription_item_id: params.subscriptionItemId,
          quantity: params.quantity,
          timestamp: params.timestamp || Math.floor(Date.now() / 1000),
          action: params.action || 'increment',
          idempotency_key: idempotencyKey,
        },
      });

      if (error) {
        throw error;
      }

      return data;
    });
  }

  /**
   * Handle failed payments with dunning management
   * Comprehensive retry logic per API reference
   */
  async handleFailedPayment(params: {
    subscriptionId: string;
    retryAttempt: number;
    maxRetries: number;
    notifyCustomer: boolean;
    pauseSubscription?: boolean;
  }): Promise<{
    action: 'retry' | 'pause' | 'cancel' | 'dunning_complete';
    next_retry_at?: number;
    dunning_stage: 'soft' | 'hard' | 'final';
  }> {
    const dunningStages = {
      1: { stage: 'soft' as const, delay_days: 3 },
      2: { stage: 'soft' as const, delay_days: 7 },
      3: { stage: 'hard' as const, delay_days: 14 },
      4: { stage: 'final' as const, delay_days: 0 },
    };

    const currentStage =
      dunningStages[
        Math.min(params.retryAttempt, 4) as keyof typeof dunningStages
      ];

    if (params.retryAttempt >= params.maxRetries) {
      // Final attempt - pause or cancel subscription
      if (params.pauseSubscription) {
        await this.pauseSubscription(params.subscriptionId);
        return { action: 'pause', dunning_stage: currentStage.stage };
      } else {
        await this.cancelSubscription(params.subscriptionId, {
          cancel_at_period_end: false,
          cancellation_details: {
            comment: 'Cancelled due to failed payment',
            feedback: 'customer_service',
          },
        });
        return { action: 'cancel', dunning_stage: currentStage.stage };
      }
    }

    // Schedule next retry
    const next_retry_at =
      Date.now() + currentStage.delay_days * 24 * 60 * 60 * 1000;

    if (params.notifyCustomer) {
      await this.sendDunningNotification(
        params.subscriptionId,
        currentStage.stage
      );
    }

    return {
      action: 'retry',
      next_retry_at,
      dunning_stage: currentStage.stage,
    };
  }

  /**
   * Pause subscription
   * Implements subscription pausing per API reference
   */
  async pauseSubscription(
    subscriptionId: string,
    options: {
      pause_collection?: {
        behavior: 'keep_as_draft' | 'mark_uncollectible' | 'void';
        resumes_at?: number;
      };
    } = {}
  ): Promise<any> {
    await rateLimiter.waitForSlot();

    return exponentialBackoff(async () => {
      const { data, error } = await supabase.functions.invoke(
        'pause-subscription',
        {
          body: {
            subscription_id: subscriptionId,
            pause_collection: options.pause_collection || {
              behavior: 'keep_as_draft',
            },
          },
        }
      );

      if (error) {
        throw error;
      }

      return data;
    });
  }

  /**
   * Resume paused subscription
   */
  async resumeSubscription(subscriptionId: string): Promise<any> {
    await rateLimiter.waitForSlot();

    return exponentialBackoff(async () => {
      const { data, error } = await supabase.functions.invoke(
        'resume-subscription',
        {
          body: {
            subscription_id: subscriptionId,
          },
        }
      );

      if (error) {
        throw error;
      }

      return data;
    });
  }

  /**
   * Send dunning notification
   * Integrated with notification system
   */
  private async sendDunningNotification(
    subscriptionId: string,
    stage: 'soft' | 'hard' | 'final'
  ): Promise<void> {
    const { data, error } = await supabase.functions.invoke(
      'send-dunning-notification',
      {
        body: {
          subscription_id: subscriptionId,
          dunning_stage: stage,
          template: `dunning_${stage}`,
        },
      }
    );

    if (error) {
      console.error('Failed to send dunning notification:', error);
    }
  }

  /**
   * Get multi-currency pricing
   * Implements dynamic currency conversion per API reference
   */
  async getMultiCurrencyPricing(
    planId: string,
    targetCurrency: string
  ): Promise<{
    currency: string;
    amount: number;
    display_amount: string;
    exchange_rate?: number;
  }> {
    const { data, error } = await supabase.functions.invoke(
      'get-currency-pricing',
      {
        body: {
          plan_id: planId,
          target_currency: targetCurrency,
        },
      }
    );

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Create promotional pricing
   * Implements coupons and discounts per API reference
   */
  async createPromotionalPricing(params: {
    name: string;
    percent_off?: number;
    amount_off?: number;
    currency?: string;
    duration: 'forever' | 'once' | 'repeating';
    duration_in_months?: number;
    max_redemptions?: number;
    redeem_by?: number;
    applies_to?: {
      products?: string[];
    };
    metadata?: Record<string, string>;
  }): Promise<any> {
    await rateLimiter.waitForSlot();

    const { data, error } = await supabase.functions.invoke('create-coupon', {
      body: params,
    });

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Get subscription analytics
   * Business intelligence for subscription metrics
   */
  async getSubscriptionAnalytics(params: {
    start_date: string;
    end_date: string;
    currency?: string;
    breakdown_by?: 'plan' | 'currency' | 'status';
  }): Promise<{
    total_revenue: number;
    active_subscriptions: number;
    churn_rate: number;
    mrr: number;
    arr: number;
    breakdown: Record<string, any>;
  }> {
    const { data, error } = await supabase.functions.invoke(
      'get-subscription-analytics',
      {
        body: params,
      }
    );

    if (error) {
      throw error;
    }

    return data;
  }
}

// Export singleton instance
export const subscriptionService = StripeSubscriptionService.getInstance();

// Export utility functions
export const formatSubscriptionAmount = (
  amount: number,
  currency: string
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100); // Convert from cents
};

export const calculateProration = (
  oldAmount: number,
  newAmount: number,
  daysRemaining: number,
  totalDays: number
): number => {
  const dailyOldAmount = oldAmount / totalDays;
  const dailyNewAmount = newAmount / totalDays;
  const dailyDifference = dailyNewAmount - dailyOldAmount;

  return Math.round(dailyDifference * daysRemaining);
};

export default subscriptionService;
