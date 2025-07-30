import * as React from 'react';
// Enhanced React Hook Form type definitions
// Based on React Hook Form v7+ TypeScript patterns

import type {
  UseFormReturn,
  FieldPath,
  FieldValues,
  Control,
  RegisterOptions,
  FieldError,
  DeepRequired,
  FieldErrorsImpl,
} from 'react-hook-form';

// Enhanced form hook return type with better error handling
export interface EnhancedUseFormReturn<
  TFieldValues extends FieldValues = FieldValues,
> extends UseFormReturn<TFieldValues> {
  // Add custom methods or properties if needed
  isDirtyField: (name: FieldPath<TFieldValues>) => boolean;
  touchedFields: Partial<Record<FieldPath<TFieldValues>, boolean>>;
}

// Form field configuration
export interface FormFieldConfig<
  TFieldValues extends FieldValues = FieldValues,
> {
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rules?: RegisterOptions<TFieldValues>;
  helperText?: string;
}

// Generic form component props
export interface FormComponentProps<
  TFieldValues extends FieldValues = FieldValues,
> {
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
export type FormValidationRule<TValue = any> = {
  value: TValue;
  message: string;
};

export type ValidationRules = {
  required?: string | FormValidationRule<boolean>;
  min?: FormValidationRule<number>;
  max?: FormValidationRule<number>;
  minLength?: FormValidationRule<number>;
  maxLength?: FormValidationRule<number>;
  pattern?: FormValidationRule<RegExp>;
  validate?: Record<string, (value: any) => boolean | string>;
};

// Form schema types (for use with resolvers like Zod)
export interface FormSchema<TFieldValues extends FieldValues = FieldValues> {
  fields: Record<FieldPath<TFieldValues>, FormFieldConfig<TFieldValues>>;
  validation?: ValidationRules;
  defaultValues?: Partial<TFieldValues>;
}

// Controller component enhanced props
export interface ControlledFieldProps<
  TFieldValues extends FieldValues = FieldValues,
> extends FormComponentProps<TFieldValues> {
  render: ({ field, fieldState, formState }: any) => React.ReactElement;
}

// Re-export commonly used types from react-hook-form
export type {
  UseFormReturn,
  Control,
  RegisterOptions,
  FieldError,
  FieldValues,
  FieldPath,
} from 'react-hook-form';
