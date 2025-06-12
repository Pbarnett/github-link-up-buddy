
// Hook for usePaymentMethods
import { useState, useEffect } from 'react';

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  is_default: boolean;
  nickname?: string;
  exp_month: number;
  exp_year: number;
}

export interface UsePaymentMethodsReturn {
  data: PaymentMethod[];
  isLoading: boolean;
  error?: Error;
  refetch: () => void;
}

export const usePaymentMethods = (): UsePaymentMethodsReturn => {
  const [data, setData] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  const refetch = () => {
    setIsLoading(true);
    // Simulate loading payment methods
    setTimeout(() => {
      setData([]);
      setIsLoading(false);
    }, 100);
  };

  useEffect(() => {
    refetch();
  }, []);

  return { data, isLoading, error, refetch };
};
