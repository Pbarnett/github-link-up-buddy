// packages/shared/stripe.ts
export interface StripeCustomer {
  id: string;
  email: string;
  metadata: Record<string, string>;
  created: number;
}

export interface StripePaymentMethod {
  id: string;
  type: 'card';
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
    fingerprint: string;
  };
  customer?: string;
  metadata: Record<string, string>;
}

export interface LazyCustomerResult {
  customer: StripeCustomer;
  isNewCustomer: boolean;
}

export interface PaymentMethodAttachResult {
  paymentMethod: StripePaymentMethod;
  customer: StripeCustomer;
}

/**
 * Lazy customer creation pattern - only create when first payment method is added
 * This maintains PCI SAQ A compliance by avoiding unnecessary customer records
 */
export const createLazyCustomer = async (
  stripe: {
    customers: {
      list: (params: { email: string; limit: number }) => Promise<{ data: StripeCustomer[] }>;
      create: (params: { email: string; metadata: Record<string, string> }) => Promise<StripeCustomer>;
    };
  },
  userId: string,
  email: string,
  metadata: Record<string, string> = {}
): Promise<LazyCustomerResult> => {
  try {
    // First, check if customer already exists
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      return {
        customer: existingCustomers.data[0],
        isNewCustomer: false,
      };
    }

    // Create new customer only when needed
    const customer = await stripe.customers.create({
      email: email,
      metadata: {
        user_id: userId,
        created_via: 'lazy_creation',
        ...metadata,
      },
    });

    return {
      customer,
      isNewCustomer: true,
    };
  } catch (error) {
    console.error('Error in lazy customer creation:', error);
    throw new Error(`Failed to create/retrieve Stripe customer: ${error.message}`);
  }
};

/**
 * Attach payment method to customer with proper error handling
 */
export const attachPaymentMethod = async (
  stripe: {
    paymentMethods: {
      attach: (paymentMethodId: string, params: { customer: string }) => Promise<StripePaymentMethod>;
    };
  },
  paymentMethodId: string,
  customerId: string
): Promise<StripePaymentMethod> => {
  try {
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    return paymentMethod;
  } catch (error) {
    console.error('Error attaching payment method:', error);
    throw new Error(`Failed to attach payment method: ${error.message}`);
  }
};

/**
 * Detach payment method from customer
 */
export const detachPaymentMethod = async (
  stripe: {
    paymentMethods: {
      detach: (paymentMethodId: string) => Promise<StripePaymentMethod>;
    };
  },
  paymentMethodId: string
): Promise<StripePaymentMethod> => {
  try {
    const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);
    return paymentMethod;
  } catch (error) {
    console.error('Error detaching payment method:', error);
    throw new Error(`Failed to detach payment method: ${error.message}`);
  }
};

/**
 * Validate payment method before processing
 */
export const validatePaymentMethod = (paymentMethod: StripePaymentMethod): boolean => {
  if (!paymentMethod.id) return false;
  if (paymentMethod.type !== 'card') return false;
  if (!paymentMethod.card) return false;
  if (!paymentMethod.card.brand || !paymentMethod.card.last4) return false;
  
  return true;
};

/**
 * Extract card metadata for database storage
 */
export const extractCardMetadata = (paymentMethod: StripePaymentMethod) => {
  return {
    brand: paymentMethod.card.brand,
    last4: paymentMethod.card.last4,
    exp_month: paymentMethod.card.exp_month,
    exp_year: paymentMethod.card.exp_year,
    fingerprint: paymentMethod.card.fingerprint,
  };
};

/**
 * Generate idempotency key for payment operations
 */
export const generateIdempotencyKey = (userId: string, operation: string): string => {
  const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return `${userId}_${operation}_${timestamp}`;
};

/**
 * Error codes for payment operations
 */
export enum PaymentErrorCode {
  INVALID_PAYMENT_METHOD = 'invalid_payment_method',
  CUSTOMER_CREATION_FAILED = 'customer_creation_failed',
  ATTACH_FAILED = 'attach_failed',
  DETACH_FAILED = 'detach_failed',
  DUPLICATE_PAYMENT_METHOD = 'duplicate_payment_method',
  INSUFFICIENT_FUNDS = 'insufficient_funds',
  CARD_DECLINED = 'card_declined',
  PROCESSING_ERROR = 'processing_error',
}

export const PaymentErrorMessages = {
  [PaymentErrorCode.INVALID_PAYMENT_METHOD]: 'Invalid payment method provided',
  [PaymentErrorCode.CUSTOMER_CREATION_FAILED]: 'Failed to create customer account',
  [PaymentErrorCode.ATTACH_FAILED]: 'Failed to attach payment method',
  [PaymentErrorCode.DETACH_FAILED]: 'Failed to remove payment method',
  [PaymentErrorCode.DUPLICATE_PAYMENT_METHOD]: 'Payment method already exists',
  [PaymentErrorCode.INSUFFICIENT_FUNDS]: 'Insufficient funds',
  [PaymentErrorCode.CARD_DECLINED]: 'Card was declined',
  [PaymentErrorCode.PROCESSING_ERROR]: 'Payment processing error',
};

export class PaymentError extends Error {
  constructor(
    public code: PaymentErrorCode,
    public message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'PaymentError';
  }
}
