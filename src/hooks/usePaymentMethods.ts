// Hook for usePaymentMethods
import { useState, useEffect } from 'react';

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  is_default: boolean;
  nickname?: string;
}

export interface UsePaymentMethodsReturn {
  data: PaymentMethod[];
  isLoading: boolean;
  error?: Error;
}

export const usePaymentMethods = (): UsePaymentMethodsReturn => {
  const [data, setData] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    // Simulate loading payment methods
    setTimeout(() => {
      setData([]);
      setIsLoading(false);
    }, 100);
  }, []);

  return { data, isLoading, error };
};
