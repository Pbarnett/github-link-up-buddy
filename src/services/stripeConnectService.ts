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
 * Stripe Connect Account Types per API reference
 */
export type ConnectAccountType = 'standard' | 'express' | 'custom';

/**
 * Connect Account Configuration
 */
export interface ConnectAccountParams {
  type: ConnectAccountType;
  country: string;
  email?: string;
  business_type?: 'individual' | 'company' | 'non_profit' | 'government_entity';
  capabilities?: {
    card_payments?: { requested: boolean };
    transfers?: { requested: boolean };
    tax_reporting_us_1099_k?: { requested: boolean };
    tax_reporting_us_1099_misc?: { requested: boolean };
  };
  business_profile?: {
    name?: string;
    product_description?: string;
    support_address?: {
      city?: string;
      country?: string;
      line1?: string;
      line2?: string;
      postal_code?: string;
      state?: string;
    };
    support_email?: string;
    support_phone?: string;
    support_url?: string;
    url?: string;
  };
  metadata?: Record<string, string>;
}

/**
 * Transfer Parameters per API reference
 */
export interface TransferParams {
  amount: number;
  currency: string;
  destination: string; // Connected account ID
  transfer_group?: string;
  description?: string;
  metadata?: Record<string, string>;
  source_transaction?: string; // For transfers from charges
}

/**
 * Application Fee Configuration
 */
export interface ApplicationFeeParams {
  amount: number;
  currency: string;
  description?: string;
  metadata?: Record<string, string>;
}

/**
 * Marketplace Split Payment Configuration
 */
export interface MarketplaceSplitParams {
  amount: number;
  currency: string;
  customer?: string;
  payment_method?: string;
  application_fee_amount?: number;
  on_behalf_of?: string;
  transfer_data?: {
    destination: string;
    amount?: number;
  };
  metadata?: Record<string, string>;
}

/**
 * Complete Stripe Connect Service
 * Implements full marketplace functionality per API reference
 */
export class StripeConnectService {
  private static instance: StripeConnectService;

  public static getInstance(): StripeConnectService {
    if (!StripeConnectService.instance) {
      StripeConnectService.instance = new StripeConnectService();
    }
    return StripeConnectService.instance;
  }

  /**
   * Create Connect Account
   * Supports all account types per API reference
   */
  async createConnectAccount(params: ConnectAccountParams): Promise<{
    account_id: string;
    account_type: ConnectAccountType;
    charges_enabled: boolean;
    payouts_enabled: boolean;
    details_submitted: boolean;
    onboarding_url?: string;
  }> {
    await rateLimiter.waitForSlot();

    return exponentialBackoff(async () => {
      const { data, error } = await supabase.functions.invoke(
        'create-connect-account',
        {
          body: {
            type: params.type,
            country: params.country,
            email: params.email,
            business_type: params.business_type || 'company',
            capabilities: params.capabilities || {
              card_payments: { requested: true },
              transfers: { requested: true },
            },
            business_profile: params.business_profile,
            metadata: {
              created_via: 'parker_flight_marketplace',
              account_type: params.type,
              ...params.metadata,
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
   * Update Connect Account
   * Handle KYC and compliance updates
   */
  async updateConnectAccount(
    accountId: string,
    updates: Partial<ConnectAccountParams>
  ): Promise<any> {
    await rateLimiter.waitForSlot();

    return exponentialBackoff(async () => {
      const { data, error } = await supabase.functions.invoke(
        'update-connect-account',
        {
          body: {
            account_id: accountId,
            ...updates,
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
   * Create Account Link for Onboarding
   * Generates onboarding URLs per API reference
   */
  async createAccountLink(
    accountId: string,
    options: {
      refresh_url: string;
      return_url: string;
      type?: 'account_onboarding' | 'account_update';
    }
  ): Promise<{
    url: string;
    expires_at: number;
  }> {
    await rateLimiter.waitForSlot();

    return exponentialBackoff(async () => {
      const { data, error } = await supabase.functions.invoke(
        'create-account-link',
        {
          body: {
            account: accountId,
            refresh_url: options.refresh_url,
            return_url: options.return_url,
            type: options.type || 'account_onboarding',
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
   * Create Login Link
   * For partners to access Express Dashboard
   */
  async createLoginLink(accountId: string): Promise<{
    url: string;
    created: number;
  }> {
    await rateLimiter.waitForSlot();

    return exponentialBackoff(async () => {
      const { data, error } = await supabase.functions.invoke(
        'create-login-link',
        {
          body: {
            account: accountId,
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
   * Create Marketplace Payment Intent
   * Direct charges with application fees
   */
  async createMarketplacePayment(params: MarketplaceSplitParams): Promise<{
    id: string;
    client_secret: string;
    amount: number;
    application_fee_amount?: number;
    on_behalf_of?: string;
    transfer_data?: any;
  }> {
    await rateLimiter.waitForSlot();

    return exponentialBackoff(async () => {
      const { data, error } = await supabase.functions.invoke(
        'create-marketplace-payment',
        {
          body: {
            amount: Math.round(params.amount * 100), // Convert to cents
            currency: params.currency.toLowerCase(),
            customer: params.customer,
            payment_method: params.payment_method,
            application_fee_amount: params.application_fee_amount
              ? Math.round(params.application_fee_amount * 100)
              : undefined,
            on_behalf_of: params.on_behalf_of,
            transfer_data: params.transfer_data
              ? {
                  destination: params.transfer_data.destination,
                  amount: params.transfer_data.amount
                    ? Math.round(params.transfer_data.amount * 100)
                    : undefined,
                }
              : undefined,
            metadata: buildPaymentMetadata({
              userId: params.customer || 'marketplace',
              bookingType: 'marketplace',
              additionalData: {
                marketplace_payment: 'true',
                destination_account: params.transfer_data?.destination || '',
                ...params.metadata,
              },
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
   * Create Transfer
   * Move funds between platform and connected accounts
   */
  async createTransfer(params: TransferParams): Promise<{
    id: string;
    amount: number;
    currency: string;
    destination: string;
    transfer_group?: string;
    status: string;
  }> {
    await rateLimiter.waitForSlot();

    return exponentialBackoff(async () => {
      const { data, error } = await supabase.functions.invoke(
        'create-transfer',
        {
          body: {
            amount: Math.round(params.amount * 100), // Convert to cents
            currency: params.currency.toLowerCase(),
            destination: params.destination,
            transfer_group: params.transfer_group,
            description: params.description,
            source_transaction: params.source_transaction,
            metadata: {
              transfer_type: 'marketplace_payout',
              destination_account: params.destination,
              ...params.metadata,
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
   * Reverse Transfer
   * Handle disputes and refunds in marketplace
   */
  async reverseTransfer(
    transferId: string,
    options: {
      amount?: number;
      description?: string;
      metadata?: Record<string, string>;
    } = {}
  ): Promise<any> {
    await rateLimiter.waitForSlot();

    return exponentialBackoff(async () => {
      const { data, error } = await supabase.functions.invoke(
        'reverse-transfer',
        {
          body: {
            transfer_id: transferId,
            amount: options.amount
              ? Math.round(options.amount * 100)
              : undefined,
            description: options.description,
            metadata: {
              reversal_reason: 'marketplace_dispute',
              ...options.metadata,
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
   * Get Account Balance
   * Check available and pending balances for connected accounts
   */
  async getAccountBalance(accountId: string): Promise<{
    available: Array<{
      amount: number;
      currency: string;
      source_types: Record<string, number>;
    }>;
    pending: Array<{
      amount: number;
      currency: string;
      source_types: Record<string, number>;
    }>;
  }> {
    await rateLimiter.waitForSlot();

    const { data, error } = await supabase.functions.invoke(
      'get-account-balance',
      {
        body: {
          account_id: accountId,
        },
      }
    );

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * List Payouts
   * Get payout history for connected accounts
   */
  async listPayouts(
    accountId: string,
    options: {
      limit?: number;
      starting_after?: string;
      ending_before?: string;
      status?: 'paid' | 'pending' | 'in_transit' | 'canceled' | 'failed';
    } = {}
  ): Promise<{
    data: Array<{
      id: string;
      amount: number;
      currency: string;
      arrival_date: number;
      status: string;
      type: string;
    }>;
    has_more: boolean;
  }> {
    await rateLimiter.waitForSlot();

    const { data, error } = await supabase.functions.invoke('list-payouts', {
      body: {
        account_id: accountId,
        limit: options.limit || 10,
        starting_after: options.starting_after,
        ending_before: options.ending_before,
        status: options.status,
      },
    });

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Handle Connect Webhooks
   * Process account and transfer events
   */
  async handleConnectWebhook(event: {
    type: string;
    account?: string;
    data: {
      object: any;
    };
  }): Promise<void> {
    switch (event.type) {
      case 'account.updated':
        await this.handleAccountUpdated(event.data.object, event.account);
        break;

      case 'account.application.deauthorized':
        await this.handleAccountDeauthorized(event.data.object);
        break;

      case 'transfer.created':
        await this.handleTransferCreated(event.data.object, event.account);
        break;

      case 'transfer.reversed':
        await this.handleTransferReversed(event.data.object, event.account);
        break;

      case 'payout.paid':
        await this.handlePayoutPaid(event.data.object, event.account);
        break;

      case 'payout.failed':
        await this.handlePayoutFailed(event.data.object, event.account);
        break;

      default:
        console.log(`Unhandled Connect webhook: ${event.type}`);
    }
  }

  /**
   * Handle Account Updated Webhook
   */
  private async handleAccountUpdated(
    account: any,
    accountId?: string
  ): Promise<void> {
    const { error } = await supabase.from('connect_accounts').upsert({
      stripe_account_id: account.id,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      details_submitted: account.details_submitted,
      requirements: account.requirements,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Failed to update Connect account:', error);
    }
  }

  /**
   * Handle Account Deauthorized Webhook
   */
  private async handleAccountDeauthorized(application: any): Promise<void> {
    const { error } = await supabase
      .from('connect_accounts')
      .update({
        status: 'deauthorized',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_account_id', application.account);

    if (error) {
      console.error('Failed to mark account as deauthorized:', error);
    }
  }

  /**
   * Handle Transfer Created Webhook
   */
  private async handleTransferCreated(
    transfer: any,
    accountId?: string
  ): Promise<void> {
    const { error } = await supabase.from('marketplace_transfers').insert({
      stripe_transfer_id: transfer.id,
      amount: transfer.amount,
      currency: transfer.currency,
      destination_account: transfer.destination,
      source_transaction: transfer.source_transaction,
      transfer_group: transfer.transfer_group,
      status: 'created',
      created_at: new Date(transfer.created * 1000).toISOString(),
    });

    if (error) {
      console.error('Failed to record transfer:', error);
    }
  }

  /**
   * Handle Transfer Reversed Webhook
   */
  private async handleTransferReversed(
    reversal: any,
    accountId?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('marketplace_transfers')
      .update({
        status: 'reversed',
        reversal_amount: reversal.amount,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_transfer_id', reversal.transfer);

    if (error) {
      console.error('Failed to update transfer reversal:', error);
    }
  }

  /**
   * Handle Payout Paid Webhook
   */
  private async handlePayoutPaid(
    payout: any,
    accountId?: string
  ): Promise<void> {
    const { error } = await supabase.from('connect_payouts').upsert({
      stripe_payout_id: payout.id,
      stripe_account_id: accountId,
      amount: payout.amount,
      currency: payout.currency,
      arrival_date: new Date(payout.arrival_date * 1000).toISOString(),
      status: 'paid',
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Failed to update payout status:', error);
    }
  }

  /**
   * Handle Payout Failed Webhook
   */
  private async handlePayoutFailed(
    payout: any,
    accountId?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('connect_payouts')
      .update({
        status: 'failed',
        failure_code: payout.failure_code,
        failure_message: payout.failure_message,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_payout_id', payout.id);

    if (error) {
      console.error('Failed to update failed payout:', error);
    }
  }

  /**
   * Get Marketplace Analytics
   * Business intelligence for marketplace performance
   */
  async getMarketplaceAnalytics(params: {
    start_date: string;
    end_date: string;
    account_id?: string;
  }): Promise<{
    total_volume: number;
    total_fees: number;
    total_transfers: number;
    active_accounts: number;
    top_partners: Array<{
      account_id: string;
      volume: number;
      fee_revenue: number;
    }>;
  }> {
    const { data, error } = await supabase.functions.invoke(
      'get-marketplace-analytics',
      {
        body: params,
      }
    );

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Calculate Application Fee
   * Dynamic fee calculation based on business rules
   */
  calculateApplicationFee(
    amount: number,
    partnerTier: 'standard' | 'premium' | 'enterprise' = 'standard',
    paymentMethod: 'card' | 'bank_transfer' | 'wallet' = 'card'
  ): number {
    // Fee structure per partner tier and payment method
    const feeStructure = {
      standard: {
        card: 0.029, // 2.9%
        bank_transfer: 0.008, // 0.8%
        wallet: 0.025, // 2.5%
      },
      premium: {
        card: 0.024, // 2.4%
        bank_transfer: 0.005, // 0.5%
        wallet: 0.02, // 2.0%
      },
      enterprise: {
        card: 0.019, // 1.9%
        bank_transfer: 0.003, // 0.3%
        wallet: 0.015, // 1.5%
      },
    };

    const feeRate = feeStructure[partnerTier][paymentMethod];
    const calculatedFee = Math.round(amount * feeRate);

    // Minimum fee of $0.30 (30 cents)
    return Math.max(calculatedFee, 30);
  }
}

// Export singleton instance
export const connectService = StripeConnectService.getInstance();

// Export utility functions
export const formatTransferAmount = (
  amount: number,
  currency: string
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100); // Convert from cents
};

export const getTransferStatus = (
  status: string
): {
  label: string;
  color: 'green' | 'yellow' | 'red' | 'blue';
} => {
  const statusMap = {
    paid: { label: 'Completed', color: 'green' as const },
    pending: { label: 'Processing', color: 'yellow' as const },
    in_transit: { label: 'In Transit', color: 'blue' as const },
    canceled: { label: 'Cancelled', color: 'red' as const },
    failed: { label: 'Failed', color: 'red' as const },
  };

  return statusMap[status] || { label: 'Unknown', color: 'red' as const };
};

export default connectService;
