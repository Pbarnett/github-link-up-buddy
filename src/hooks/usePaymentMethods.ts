
// Hook for usePaymentMethods — DB-backed (SetupIntent for add-card)
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PaymentMethodCreateData {
  // Deprecated in favor of SetupIntent flow; kept for type compatibility
  card_number: string;
  cardholder_name: string;
  exp_month: number;
  exp_year: number;
  cvv: string;
  is_default?: boolean;
}

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
  // Commonly used properties for display
  last4?: string;
  nickname?: string;
}

export interface UsePaymentMethodsReturn {
  data: PaymentMethod[];
  isLoading: boolean;
  error?: Error;
  refetch: () => Promise<void>;
  addPaymentMethod: (paymentData: PaymentMethodCreateData) => Promise<never>;
  updatePaymentMethod: (id: string, updates: { is_default?: boolean }) => Promise<PaymentMethod>;
  deletePaymentMethod: (id: string) => Promise<void>;
  setDefaultPaymentMethod: (id: string) => Promise<PaymentMethod>;
}

export const usePaymentMethods = (): UsePaymentMethodsReturn => {
  const [data, setData] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  const fetchPaymentMethods = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(undefined);

      const { data: methods, error: pmError } = await supabase
        .from('payment_methods')
        .select('id, brand, last4, is_default, exp_month, exp_year, created_at, nickname')
        .order('created_at', { ascending: false });

      if (pmError) throw pmError;

      // Transform to desired shape
      const transformed: PaymentMethod[] = (methods || []).map((m: any) => ({
        id: m.id,
        brand: m.brand,
        is_default: m.is_default,
        exp_month: m.exp_month,
        exp_year: m.exp_year,
        created_at: m.created_at,
        last4: m.last4,
        nickname: m.nickname,
      }));

      setData(transformed);
    } catch (err) {
      console.error('Error fetching payment methods:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch payment methods'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addPaymentMethod = useCallback(async (_paymentData: PaymentMethodCreateData): Promise<never> => {
    // The add-card flow must use SetupIntent + Stripe Elements on the frontend
    throw new Error('Add card via SetupIntent + Stripe Elements. This KMS path is deprecated.');
  }, []);

  const updatePaymentMethod = useCallback(async (id: string, updates: { is_default?: boolean }): Promise<PaymentMethod> => {
    const { data: updated, error: updErr } = await supabase
      .from('payment_methods')
      .update({ is_default: updates.is_default ?? undefined })
      .eq('id', id)
      .select('id, brand, last4, is_default, exp_month, exp_year, created_at, nickname')
      .single();

    if (updErr) throw updErr;
    await fetchPaymentMethods();
    return updated as unknown as PaymentMethod;
  }, [fetchPaymentMethods]);

  const deletePaymentMethod = useCallback(async (id: string): Promise<void> => {
    const { error: delErr } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', id);
    if (delErr) throw delErr;
    await fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  const setDefaultPaymentMethod = useCallback(async (id: string): Promise<PaymentMethod> => {
    // Rely on DB trigger to enforce single default per user
    const { data: updated, error: updErr } = await supabase
      .from('payment_methods')
      .update({ is_default: true })
      .eq('id', id)
      .select('id, brand, last4, is_default, exp_month, exp_year, created_at, nickname')
      .single();

    if (updErr) throw updErr;
    await fetchPaymentMethods();
    return updated as unknown as PaymentMethod;
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
    setDefaultPaymentMethod,
  };
};
