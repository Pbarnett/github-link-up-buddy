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
 * Uses V4 UUID as recommended by Stripe API reference
 */
export const generateIdempotencyKey = (userId: string, operation: string): string => {
  // Generate V4 UUID as recommended by Stripe API documentation
  const uuid = crypto.randomUUID();
  const timestamp = new Date().toISOString().slice(0, 10);
  // Ensure key is under 255 characters and includes context for debugging
  return `${operation}_${userId}_${timestamp}_${uuid}`.slice(0, 255);
};

/**
 * Implement exponential backoff for retryable operations
 * As specified in Stripe API reference for rate limiting
 */
export const exponentialBackoff = async (
  operation: () => Promise<any>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<any> => {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      return await operation();
    } catch (error: any) {
      attempt++;
      
      // Check if error is retryable (rate limit, API error, connection error)
      const isRetryable = error.type === 'rate_limit_error' || 
                         error.type === 'api_error' ||
                         error.type === 'connection_error' ||
                         error.statusCode === 429 ||
                         error.statusCode >= 500;
      
      if (!isRetryable || attempt >= maxRetries) {
        throw error;
      }
      
      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

/**
 * Rate limiting helper per Stripe API reference (25 requests per second)
 */
class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests = 25;
  private readonly timeWindow = 1000; // 1 second

  async waitForSlot(): Promise<void> {
    const now = Date.now();
    
    // Remove old requests outside the time window
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    
    // If we're at the limit, wait
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = this.timeWindow - (now - oldestRequest) + 10; // Add 10ms buffer
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.waitForSlot(); // Check again
    }
    
    // Record this request
    this.requests.push(now);
  }
}

export const rateLimiter = new RateLimiter();

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
