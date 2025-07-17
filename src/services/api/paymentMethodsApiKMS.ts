import { supabase } from '@/integrations/supabase/client';
import logger from '@/lib/logger';

export interface PaymentMethodKMS {
  id: string;
  brand?: string;
  card_number_masked?: string;
  cardholder_name?: string;
  is_default: boolean;
  exp_month: number;
  exp_year: number;
  created_at: string;
  encryption_version?: number;
}

export interface PaymentMethodCreateData {
  card_number: string;
  cardholder_name: string;
  exp_month: number;
  exp_year: number;
  cvv: string;
  is_default?: boolean;
}

class PaymentMethodsServiceKMS {
  /**
   * Get all payment methods for the current user
   */
  async getPaymentMethods(): Promise<PaymentMethodKMS[]> {
    try {
      logger.info('[PaymentMethodsKMS] Fetching payment methods via edge function');
      
      // Use the manage-payment-methods edge function
      const { data, error } = await supabase.functions.invoke('manage-payment-methods');

      if (error) {
        logger.error('[PaymentMethodsKMS] Error from edge function:', error);
        throw new Error(`Failed to fetch payment methods: ${error.message}`);
      }

      logger.info('[PaymentMethodsKMS] Payment methods fetched successfully:', data);
      return data?.payment_methods || [];
    } catch (error) {
      logger.error('[PaymentMethodsKMS] getPaymentMethods error:', error);
      throw error;
    }
  }

  /**
   * Add a new payment method with KMS encryption
   */
  async addPaymentMethod(paymentData: PaymentMethodCreateData): Promise<PaymentMethodKMS> {
    try {
      logger.info('[PaymentMethodsKMS] Adding new payment method');
      
      // Call edge function to handle encryption and storage
      const { data, error } = await supabase.functions.invoke('payment-methods-kms', {
        body: {
          action: 'create',
          paymentData
        }
      });

      if (error) {
        logger.error('[PaymentMethodsKMS] Error from edge function:', error);
        throw new Error(`Failed to add payment method: ${error.message}`);
      }

      logger.info('[PaymentMethodsKMS] Payment method added successfully');
      return data as PaymentMethodKMS;
    } catch (error) {
      logger.error('[PaymentMethodsKMS] addPaymentMethod error:', error);
      throw error;
    }
  }

  /**
   * Update an existing payment method
   */
  async updatePaymentMethod(id: string, updates: { is_default?: boolean }): Promise<PaymentMethodKMS> {
    try {
      logger.info('[PaymentMethodsKMS] Updating payment method:', id);
      
      // For simple updates like is_default, we can update directly
      const { data, error } = await supabase
        .from('payment_methods')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('[PaymentMethodsKMS] Error updating payment method:', error);
        throw new Error(`Failed to update payment method: ${error.message}`);
      }

      return data as PaymentMethodKMS;
    } catch (error) {
      logger.error('[PaymentMethodsKMS] updatePaymentMethod error:', error);
      throw error;
    }
  }

  /**
   * Delete a payment method
   */
  async deletePaymentMethod(id: string): Promise<void> {
    try {
      logger.info('[PaymentMethodsKMS] Deleting payment method:', id);
      
      const { error } = await (supabase
        .from('payment_methods')
        .delete()
        .eq('id', id) as any);

      if (error) {
        logger.error('[PaymentMethodsKMS] Error deleting payment method:', error);
        throw new Error(`Failed to delete payment method: ${error.message}`);
      }

      logger.info('[PaymentMethodsKMS] Payment method deleted successfully');
    } catch (error) {
      logger.error('[PaymentMethodsKMS] deletePaymentMethod error:', error);
      throw error;
    }
  }

  /**
   * Set a payment method as default
   */
  async setDefaultPaymentMethod(id: string): Promise<PaymentMethodKMS> {
    try {
      logger.info('[PaymentMethodsKMS] Setting default payment method:', id);
      
      // Call edge function to handle the transaction (unset all defaults, set new default)
      const { data, error } = await supabase.functions.invoke('payment-methods-kms', {
        body: {
          action: 'setDefault',
          paymentMethodId: id
        }
      });

      if (error) {
        logger.error('[PaymentMethodsKMS] Error from edge function:', error);
        throw new Error(`Failed to set default payment method: ${error.message}`);
      }

      return data as PaymentMethodKMS;
    } catch (error) {
      logger.error('[PaymentMethodsKMS] setDefaultPaymentMethod error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const paymentMethodsServiceKMS = new PaymentMethodsServiceKMS();
