
// Hook for usePaymentMethods with KMS encryption
import { useState, useEffect, useCallback } from 'react';
import { paymentMethodsServiceKMS, PaymentMethodKMS, PaymentMethodCreateData } from '@/services/api/paymentMethodsApiKMS';

export interface PaymentMethod {
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

export interface UsePaymentMethodsReturn {
  data: PaymentMethod[];
  isLoading: boolean;
  error?: Error;
  refetch: () => Promise<void>;
  addPaymentMethod: (paymentData: PaymentMethodCreateData) => Promise<PaymentMethodKMS>;
  updatePaymentMethod: (id: string, updates: { is_default?: boolean }) => Promise<PaymentMethodKMS>;
  deletePaymentMethod: (id: string) => Promise<void>;
  setDefaultPaymentMethod: (id: string) => Promise<PaymentMethodKMS>;
}

export const usePaymentMethods = (): UsePaymentMethodsReturn => {
  const [data, setData] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  const fetchPaymentMethods = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(undefined);
      
      const methods = await paymentMethodsServiceKMS.getPaymentMethods();
      
      // Transform to match expected interface
      const transformedMethods: PaymentMethod[] = methods.map(method => ({
        id: method.id,
        brand: method.brand,
        card_number_masked: method.card_number_masked,
        cardholder_name: method.cardholder_name,
        is_default: method.is_default,
        exp_month: method.exp_month,
        exp_year: method.exp_year,
        created_at: method.created_at,
        encryption_version: method.encryption_version
      }));
      
      setData(transformedMethods);
    } catch (err) {
      console.error('Error fetching payment methods:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch payment methods'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addPaymentMethod = useCallback(async (paymentData: PaymentMethodCreateData): Promise<PaymentMethodKMS> => {
    try {
      const newMethod = await paymentMethodsServiceKMS.addPaymentMethod(paymentData);
      await fetchPaymentMethods(); // Refresh the list
      return newMethod;
    } catch (err) {
      console.error('Error adding payment method:', err);
      throw err;
    }
  }, [fetchPaymentMethods]);

  const updatePaymentMethod = useCallback(async (id: string, updates: { is_default?: boolean }): Promise<PaymentMethodKMS> => {
    try {
      const updatedMethod = await paymentMethodsServiceKMS.updatePaymentMethod(id, updates);
      await fetchPaymentMethods(); // Refresh the list
      return updatedMethod;
    } catch (err) {
      console.error('Error updating payment method:', err);
      throw err;
    }
  }, [fetchPaymentMethods]);

  const deletePaymentMethod = useCallback(async (id: string): Promise<void> => {
    try {
      await paymentMethodsServiceKMS.deletePaymentMethod(id);
      await fetchPaymentMethods(); // Refresh the list
    } catch (err) {
      console.error('Error deleting payment method:', err);
      throw err;
    }
  }, [fetchPaymentMethods]);

  const setDefaultPaymentMethod = useCallback(async (id: string): Promise<PaymentMethodKMS> => {
    try {
      const updatedMethod = await paymentMethodsServiceKMS.setDefaultPaymentMethod(id);
      await fetchPaymentMethods(); // Refresh the list
      return updatedMethod;
    } catch (err) {
      console.error('Error setting default payment method:', err);
      throw err;
    }
  }, [fetchPaymentMethods]);

  const refetch = useCallback(async () => {
    await fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  return { 
    data, 
    isLoading, 
    error, 
    refetch,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod
  };
};
