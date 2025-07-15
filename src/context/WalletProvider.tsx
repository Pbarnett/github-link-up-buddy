// WalletProvider.tsx - Context provider for Wallet functionality
// Day 4: Payments & Wallet System

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  createSetupIntent,
  getUserPaymentMethods,
  setDefaultPaymentMethod,
  deletePaymentMethod,
  PaymentMethod
} from '../services/stripeWalletService';

interface WalletContextType {
  paymentMethods: PaymentMethod[];
  fetchPaymentMethods: () => Promise<void>;
  addPaymentMethod: (idempotencyKey: string) => Promise<string>;
  removePaymentMethod: (paymentMethodId: string) => Promise<void>;
  setDefault: (paymentMethodId: string) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const fetchPaymentMethods = useCallback(async () => {
    // Assume user's ID is available via context/session
    const userId = 'user-id'; // Replace with context/session retrieval
    const methods = await getUserPaymentMethods(userId);
    setPaymentMethods(methods);
  }, []);

  const addPaymentMethod = useCallback(async (idempotencyKey: string) => {
    // Assume user's ID is available via context/session
    const userId = 'user-id'; // Replace with context/session retrieval
    const setupIntent = await createSetupIntent({ id: userId, email: `${userId}@example.com` }, { idempotencyKey });
    return setupIntent.client_secret;
  }, []);

  const removePaymentMethod = useCallback(async (paymentMethodId: string) => {
    // Assume user's ID is available via context/session
    const userId = 'user-id'; // Replace with context/session retrieval
    await deletePaymentMethod(userId, paymentMethodId);
    await fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  const setDefault = useCallback(async (paymentMethodId: string) => {
    // Assume user's ID is available via context/session
    const userId = 'user-id'; // Replace with context/session retrieval
    await setDefaultPaymentMethod(userId, paymentMethodId);
    await fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  return (
    <WalletContext.Provider
      value={{
        paymentMethods,
        fetchPaymentMethods,
        addPaymentMethod,
        removePaymentMethod,
        setDefault,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
