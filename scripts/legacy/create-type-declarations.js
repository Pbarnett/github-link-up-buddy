#!/usr/bin/env node

/**
 * Create missing type declarations for third-party libraries
 * Based on TypeScript declaration file best practices
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const TYPES_DIR = path.join(PROJECT_ROOT, 'src', 'types');

// PostgREST type declarations based on Supabase patterns
const POSTGREST_TYPES = `// Type definitions for PostgREST responses and builders
// Based on Supabase PostgrestBuilder patterns and TypeScript best practices

export interface PostgrestResponse<T> {
  data: T | null;
  error: PostgrestError | null;
  count?: number | null;
  status: number;
  statusText: string;
}

export interface PostgrestResponseSuccess<T> extends PostgrestResponse<T> {
  data: T;
  error: null;
}

export interface PostgrestResponseFailure extends PostgrestResponse<never> {
  data: null;
  error: PostgrestError;
}

export interface PostgrestError {
  message: string;
  details: string;
  hint: string;
  code: string;
}

export interface PostgrestBuilder<T, R = any> {
  then<TResult1 = PostgrestResponse<T>, TResult2 = never>(
    onfulfilled?: ((value: PostgrestResponse<T>) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2>;
  
  // Common PostgrestBuilder methods
  select(columns?: string): PostgrestBuilder<T[], R>;
  insert(value: Partial<T>): PostgrestBuilder<T[], R>;
  update(value: Partial<T>): PostgrestBuilder<T[], R>;
  delete(): PostgrestBuilder<T[], R>;
  
  // Filters
  eq(column: string, value: any): PostgrestBuilder<T, R>;
  neq(column: string, value: any): PostgrestBuilder<T, R>;
  gt(column: string, value: any): PostgrestBuilder<T, R>;
  gte(column: string, value: any): PostgrestBuilder<T, R>;
  lt(column: string, value: any): PostgrestBuilder<T, R>;
  lte(column: string, value: any): PostgrestBuilder<T, R>;
  like(column: string, pattern: string): PostgrestBuilder<T, R>;
  ilike(column: string, pattern: string): PostgrestBuilder<T, R>;
  is(column: string, value: any): PostgrestBuilder<T, R>;
  in(column: string, values: any[]): PostgrestBuilder<T, R>;
  contains(column: string, value: any): PostgrestBuilder<T, R>;
  containedBy(column: string, value: any): PostgrestBuilder<T, R>;
  rangeGt(column: string, value: any): PostgrestBuilder<T, R>;
  rangeGte(column: string, value: any): PostgrestBuilder<T, R>;
  rangeLt(column: string, value: any): PostgrestBuilder<T, R>;
  rangeLte(column: string, value: any): PostgrestBuilder<T, R>;
  rangeAdjacent(column: string, value: any): PostgrestBuilder<T, R>;
  overlaps(column: string, value: any): PostgrestBuilder<T, R>;
  textSearch(column: string, query: string, config?: string): PostgrestBuilder<T, R>;
  
  // Modifiers
  order(column: string, options?: { ascending?: boolean; nullsFirst?: boolean }): PostgrestBuilder<T, R>;
  limit(count: number): PostgrestBuilder<T, R>;
  range(from: number, to: number): PostgrestBuilder<T, R>;
  single(): PostgrestBuilder<T, R>;
  maybeSingle(): PostgrestBuilder<T | null, R>;
}

// Utility types for common database operations
export type PostgrestFilterBuilder<T> = PostgrestBuilder<T>;

// Re-export for backward compatibility
export type { PostgrestResponse as SupabaseResponse };
export type { PostgrestError as SupabaseError };
`;

// Stripe enhanced type declarations
const STRIPE_TYPES = `// Enhanced Stripe type definitions
// Complementing @stripe/stripe-js and @stripe/react-stripe-js

import type { Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';

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
    status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
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
    status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
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
`;

// React Hook Form enhanced types
const REACT_HOOK_FORM_TYPES = `// Enhanced React Hook Form type definitions
// Based on React Hook Form v7+ TypeScript patterns

import type { 
  UseFormReturn,
  FieldPath,
  FieldValues,
  Control,
  RegisterOptions,
  FieldError,
  DeepRequired,
  FieldErrorsImpl
} from 'react-hook-form';

// Enhanced form hook return type with better error handling
export interface EnhancedUseFormReturn<TFieldValues extends FieldValues = FieldValues> 
  extends UseFormReturn<TFieldValues> {
  // Add custom methods or properties if needed
  isDirtyField: (name: FieldPath<TFieldValues>) => boolean;
  touchedFields: Partial<Record<FieldPath<TFieldValues>, boolean>>;
}

// Form field configuration
export interface FormFieldConfig<TFieldValues extends FieldValues = FieldValues> {
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rules?: RegisterOptions<TFieldValues>;
  helperText?: string;
}

// Generic form component props
export interface FormComponentProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: FieldError;
  helperText?: string;
}

// Form submission types
export interface FormSubmissionState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  isValid: boolean;
  submitCount: number;
}

export interface FormSubmissionResult<TData = any> {
  success: boolean;
  data?: TData;
  errors?: Record<string, string>;
  message?: string;
}

// Utility types for form validation
export type ValidationRule<TValue = any> = {
  value: TValue;
  message: string;
};

export type ValidationRules = {
  required?: string | ValidationRule<boolean>;
  min?: ValidationRule<number>;
  max?: ValidationRule<number>;
  minLength?: ValidationRule<number>;
  maxLength?: ValidationRule<number>;
  pattern?: ValidationRule<RegExp>;
  validate?: Record<string, (value: any) => boolean | string>;
};

// Form schema types (for use with resolvers like Zod)
export interface FormSchema<TFieldValues extends FieldValues = FieldValues> {
  fields: Record<FieldPath<TFieldValues>, FormFieldConfig<TFieldValues>>;
  validation?: ValidationRules;
  defaultValues?: Partial<TFieldValues>;
}

// Controller component enhanced props
export interface ControlledFieldProps<TFieldValues extends FieldValues = FieldValues>
  extends FormComponentProps<TFieldValues> {
  render: ({ field, fieldState, formState }: any) => React.ReactElement;
}

// Re-export commonly used types from react-hook-form
export type {
  UseFormReturn,
  Control,
  RegisterOptions,
  FieldError,
  FieldValues,
  FieldPath
} from 'react-hook-form';
`;

// Global ambient module declarations
const AMBIENT_DECLARATIONS = `// Global ambient module declarations
// For libraries without proper TypeScript support

declare module 'murmurhash-js' {
  export function murmur3(key: string, seed?: number): number;
  export function murmur2(key: string, seed?: number): number;
}

declare module 'input-otp' {
  import { ComponentProps } from 'react';
  
  export interface OTPInputProps extends Omit<ComponentProps<'input'>, 'onChange' | 'value'> {
    value: string;
    onChange: (value: string) => void;
    numInputs?: number;
    separator?: React.ReactNode;
    isDisabled?: boolean;
    hasErrored?: boolean;
    isInputNum?: boolean;
    isInputSecure?: boolean;
    containerStyle?: React.CSSProperties;
    inputStyle?: React.CSSProperties;
    focusStyle?: React.CSSProperties;
    disabledStyle?: React.CSSProperties;
    errorStyle?: React.CSSProperties;
    shouldAutoFocus?: boolean;
  }
  
  export const OTPInput: React.FC<OTPInputProps>;
}

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGProps<SVGElement>>;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

// Environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    VITE_SUPABASE_URL: string;
    VITE_SUPABASE_ANON_KEY: string;
    VITE_STRIPE_PUBLISHABLE_KEY: string;
    DATABASE_URL: string;
    STRIPE_SECRET_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
  }
}

// Vite env variables
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly VITE_APP_TITLE: string;
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
`;

async function ensureTypesDirectory() {
  try {
    await fs.access(TYPES_DIR);
  } catch {
    await fs.mkdir(TYPES_DIR, { recursive: true });
    console.log('✅ Created types directory');
  }
}

async function createTypeFile(fileName, content) {
  const filePath = path.join(TYPES_DIR, fileName);
  await fs.writeFile(filePath, content, 'utf-8');
  console.log(`✅ Created ${fileName}`);
}

async function createIndexFile() {
  const indexContent = `// Type definitions index
// Auto-generated type exports

export * from './postgrest';
export * from './stripe';
export * from './react-hook-form';
export * from './ambient';
`;
  
  await createTypeFile('index.ts', indexContent);
}

async function main() {
  console.log('🔧 Creating missing type declarations...\n');
  
  await ensureTypesDirectory();
  
  // Create type declaration files
  await createTypeFile('postgrest.ts', POSTGREST_TYPES);
  await createTypeFile('stripe.ts', STRIPE_TYPES);
  await createTypeFile('react-hook-form.ts', REACT_HOOK_FORM_TYPES);
  await createTypeFile('ambient.ts', AMBIENT_DECLARATIONS);
  await createIndexFile();
  
  console.log('\n📊 Summary:');
  console.log('   Created PostgREST type definitions');
  console.log('   Created enhanced Stripe type definitions');  
  console.log('   Created React Hook Form enhanced types');
  console.log('   Created ambient module declarations');
  console.log('   Created types index file');
  
  console.log('\n✨ Type declarations created! Add the following to your tsconfig.json paths:');
  console.log('   "@/types": ["./src/types"]');
  console.log('   "@/types/*": ["./src/types/*"]');
}

main().catch(console.error);
