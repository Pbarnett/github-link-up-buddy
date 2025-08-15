// Deprecated KMS client — do not use.
// Use SetupIntent + webhook persistence and list from the payment_methods table instead.

export interface PaymentMethodKMS {
  id: string;
}

export interface PaymentMethodCreateData {
  card_number: string;
  cardholder_name: string;
  exp_month: number;
  exp_year: number;
  cvv: string;
  is_default?: boolean;
}

function deprecated(): never {
  throw new Error('paymentMethodsApiKMS is deprecated. Use SetupIntent + Elements and DB-backed listing.');
}

export const paymentMethodsServiceKMS = {
  getPaymentMethods: deprecated,
  addPaymentMethod: deprecated,
  updatePaymentMethod: deprecated,
  deletePaymentMethod: deprecated,
  setDefaultPaymentMethod: deprecated,
};
