

import * as React from 'react';
import { useState, useContext, useEffect, createContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  PaymentMethod, 
  SetupIntentResponse, 
  _PaymentMethodsResponse, 
  WalletContextType,
  PaymentMethodError as ImportedPaymentMethodError
} from '@/types/wallet';

type ReactNode = React.ReactNode;

const WalletContext = createContext<WalletContextType | undefined | null>(null);

export function useWallet(): WalletContextType {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch payment methods from the database
  const refreshPaymentMethods = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('🔐 Auth check:', { user: user?.id, authError });

      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      // Use GET request to fetch payment methods
      console.log('📡 Calling manage-payment-methods edge function...');
      const { data, error } = await supabase.functions.invoke('manage-payment-methods');

      console.log('📨 Edge function response:', { data, error });

      if (error) {
        throw new Error(`Failed to fetch payment methods: ${error.message}`);
      }

      // The edge function returns payment_methods directly
      const paymentMethods = data.payment_methods || [];
      console.log('💳 Payment methods received:', paymentMethods);
      setPaymentMethods(paymentMethods);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load payment methods';
      setError(errorMessage);
      console.error('❌ Error refreshing payment methods:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create setup intent for adding new payment method
  const createSetupIntent = async (): Promise<SetupIntentResponse> => {
    try {
      setError(null);

      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('🔐 Auth check for setup intent:', { user: user?.id, authError });

      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      console.log('📡 Calling create-setup-intent edge function...');
      const { data, error } = await supabase.functions.invoke('create-setup-intent', {
        body: {
          usage: 'off_session',
          payment_method_types: ['card'],
        },
      });

      console.log('📨 Setup intent response:', { data, error });

      if (error) {
        throw new Error(`Failed to create setup intent: ${error.message}`);
      }

      if (!data.client_secret) {
        throw new Error('No client secret received from setup intent');
      }

      console.log('✅ Setup intent created successfully');
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create setup intent';
      setError(errorMessage);
      console.error('❌ Error creating setup intent:', err);
      throw new PaymentMethodError(errorMessage, 'api');
    }
  };

  // Delete payment method
  const deletePaymentMethod = async (id: string): Promise<void> => {
    try {
      setError(null);

      const { data, error } = await supabase.functions.invoke('manage-payment-methods', {
        body: { 
          action: 'delete',
          payment_method_id: id,
        },
      });

      if (error) {
        throw new Error(`Failed to delete payment method: ${error.message}`);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete payment method');
      }

      // Remove from local state
      setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete payment method';
      setError(errorMessage);
      throw new PaymentMethodError(errorMessage, 'api');
    }
  };

  // Set default payment method
  const setDefaultPaymentMethod = async (id: string): Promise<void> => {
    try {
      setError(null);

      const { data, error } = await supabase.functions.invoke('manage-payment-methods', {
        body: { 
          action: 'set_default',
          payment_method_id: id,
        },
      });

      if (error) {
        throw new Error(`Failed to set default payment method: ${error.message}`);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to set default payment method');
      }

      // Update local state
      setPaymentMethods(prev => prev.map(pm => ({
        ...pm,
        is_default: pm.id === id,
      })));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set default payment method';
      setError(errorMessage);
      throw new PaymentMethodError(errorMessage, 'api');
    }
  };

  // Update payment method nickname
  const updatePaymentMethodNickname = async (id: string, nickname?: string): Promise<void> => {
    try {
      setError(null);

      const { data, error } = await supabase.functions.invoke('manage-payment-methods', {
        body: { 
          action: 'update_nickname',
          payment_method_id: id,
          nickname,
        },
      });

      if (error) {
        throw new Error(`Failed to update payment method nickname: ${error.message}`);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to update payment method nickname');
      }

      // Update local state
      setPaymentMethods(prev => prev.map(pm => 
        pm.id === id ? { ...pm, nickname } : pm
      ));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update payment method nickname';
      setError(errorMessage);
      throw new PaymentMethodError(errorMessage, 'api');
    }
  };

  // Load payment methods on mount
  useEffect(() => {
    refreshPaymentMethods();
  }, []);

  // Listen for payment method changes via Supabase realtime (optional)
  useEffect(() => {
    const channel = supabase
      .channel('payment-methods-changes')
      .on(
        'postgres_changes' as any,
        { 
          event: '*', 
          schema: 'public', 
          table: 'payment_methods' 
        } as any, 
        (payload: any) => {
          console.log('Payment method changed:', payload);
          // Refresh payment methods when changes occur
          refreshPaymentMethods();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Add payment method - creates setup intent and returns client secret
  const addPaymentMethod = async (idempotencyKey: string): Promise<string> => {
    const setupIntent = await createSetupIntent();
    return setupIntent.client_secret;
  };

  // Alias for setDefaultPaymentMethod
  const setDefault = setDefaultPaymentMethod;
  
  // Alias for deletePaymentMethod 
  const removePaymentMethod = deletePaymentMethod;

  const value: WalletContextType = {
    paymentMethods,
    loading,
    error,
    refreshPaymentMethods,
    createSetupIntent,
    addPaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
    setDefault,
    removePaymentMethod,
    updatePaymentMethodNickname,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

class PaymentMethodError extends Error {
  constructor(message: string, public type: 'validation' | 'api' | 'stripe' | 'network') {
    super(message);
    this.name = 'PaymentMethodError';
  }
}
