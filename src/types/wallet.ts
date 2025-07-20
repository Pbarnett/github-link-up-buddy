export interface PaymentMethod {
  id: string;
  stripe_payment_method_id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  funding?: string;
  country?: string;
  is_default: boolean;
  nickname?: string;
  created_at: string;
  last_used_at?: string;
}

export interface StripeCustomer {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  email?: string;
  name?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface SetupIntentResponse {
  client_secret: string;
  setup_intent_id: string;
  customer_id: string;
}

export interface PaymentMethodsResponse {
  success: boolean;
  data?: PaymentMethod[];
  error?: string;
}

export interface WalletContextType {
  paymentMethods: PaymentMethod[];
  loading: boolean;
  error: string | null;
  refreshPaymentMethods: () => Promise<void>;
  createSetupIntent: () => Promise<SetupIntentResponse>;
  addPaymentMethod: (idempotencyKey: string) => Promise<string>;
  deletePaymentMethod: (id: string) => Promise<void>;
  setDefaultPaymentMethod: (id: string) => Promise<void>;
  setDefault: (id: string) => Promise<void>;
  removePaymentMethod: (id: string) => Promise<void>;
  updatePaymentMethodNickname: (id: string, nickname?: string) => Promise<void>;
}

export interface CardBrand {
  name: string;
  icon: string;
  color: string;
}

export const CARD_BRANDS: Record<string, CardBrand> = {
  visa: {
    name: 'Visa',
    icon: '💳',
    color: 'bg-blue-500',
  },
  mastercard: {
    name: 'Mastercard',
    icon: '💳',
    color: 'bg-red-500',
  },
  amex: {
    name: 'American Express',
    icon: '💳',
    color: 'bg-green-500',
  },
  discover: {
    name: 'Discover',
    icon: '💳',
    color: 'bg-orange-500',
  },
  diners: {
    name: 'Diners Club',
    icon: '💳',
    color: 'bg-purple-500',
  },
  jcb: {
    name: 'JCB',
    icon: '💳',
    color: 'bg-indigo-500',
  },
  unionpay: {
    name: 'UnionPay',
    icon: '💳',
    color: 'bg-yellow-500',
  },
  unknown: {
    name: 'Unknown',
    icon: '💳',
    color: 'bg-gray-500',
  },
};

export interface WalletStats {
  totalPaymentMethods: number;
  defaultPaymentMethod?: PaymentMethod;
  recentlyUsed?: PaymentMethod[];
  expiringSoon?: PaymentMethod[];
}

export interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateNickname: (id: string, nickname?: string) => void;
  isDeleting?: boolean;
}

export interface PaymentMethodListProps {
  paymentMethods: PaymentMethod[];
  loading: boolean;
  onAddNew: () => void;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateNickname: (id: string, nickname?: string) => void;
}

export interface SetupIntentError {
  message: string;
  type: string;
  code?: string;
}

export interface PaymentMethodError {
  message: string;
  type: 'validation' | 'api' | 'stripe' | 'network';
  code?: string;
}
