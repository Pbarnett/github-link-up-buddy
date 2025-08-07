// Enhanced Stripe type definitions
// Complementing @stripe/stripe-js and @stripe/react-stripe-js

import type {
  Stripe,
  StripeElements,
  StripeCardElement,

// Enhanced Stripe Hook Types
export interface StripeHookResult {
  stripe: Stripe | null;
  elements: StripeElements | null;
}

// Payment Method Types
export interface PaymentMethodData {
  id: string;
  type: 'card' | 'bank_account' | 'sepa_debit' | 'ideal';
  card?: {
    brand: string;
    country: string;
    exp_month: number;
    exp_year: number;
    fingerprint: string;
    funding: string;
    last4: string;
  };
  billing_details?: {
    address?: {
      city?: string;
      country?: string;
      line1?: string;
      line2?: string;
      postal_code?: string;
      state?: string;
    };
    email?: string;
    name?: string;
    phone?: string;
  };
  metadata: Record<string, string>;
  created: number;
  customer?: string;
}

// Setup Intent Types
export interface SetupIntentResult {
  setupIntent?: {
    id: string;
    client_secret: string;
    status:
      | 'requires_payment_method'
      | 'requires_confirmation'
      | 'requires_action'
      | 'processing'
      | 'succeeded'
      | 'canceled';
    payment_method?: string;
  };
  error?: {
    type: string;
    code?: string;
    message: string;
    decline_code?: string;
    param?: string;
    payment_method?: PaymentMethodData;
  };
}

// Payment Intent Types
export interface PaymentIntentResult {
  paymentIntent?: {
    id: string;
    amount: number;
    currency: string;
    status:
      | 'requires_payment_method'
      | 'requires_confirmation'
      | 'requires_action'
      | 'processing'
      | 'succeeded'
      | 'canceled';
    client_secret: string;
    payment_method?: string;
  };
  error?: {
    type: string;
    code?: string;
    message: string;
    decline_code?: string;
    param?: string;
  };
}

// Custom Element Options
export interface CustomCardElementOptions {
  style?: {
    base?: {
      fontSize?: string;
      color?: string;
      fontFamily?: string;
      '::placeholder'?: {
        color?: string;
      };
    };
    invalid?: {
      color?: string;
    };
    complete?: {
      color?: string;
    };
  };
  hidePostalCode?: boolean;
  iconStyle?: 'solid' | 'default';
  disabled?: boolean;
}

// Wallet Provider Types
export interface WalletState {
  paymentMethods: PaymentMethodData[];
  defaultPaymentMethod: PaymentMethodData | null;
  isLoading: boolean;
  error: string | null;
}

export interface WalletActions {
  addPaymentMethod: (idempotencyKey: string) => Promise<string>;
  removePaymentMethod: (paymentMethodId: string) => Promise<void>;
  setDefaultPaymentMethod: (paymentMethodId: string) => Promise<void>;
  refreshPaymentMethods: () => Promise<void>;
}

// Form Integration Types
export interface StripeFormData {
  name: string;
  email?: string;
  saveForFuture?: boolean;
}

export interface StripeFormError {
  field?: string;
  message: string;
  code?: string;
}

// Re-export Stripe core types for convenience
export type { Stripe, StripeElements, StripeCardElement };
