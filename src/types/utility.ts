// Utility types for type safety and validation

// Brand type for creating distinct types from primitives
export type Brand<T, U> = T & { readonly __brand: U };

// Common branded types
export type UserId = Brand<string, 'UserId'>;
export type EmailAddress = Brand<string, 'EmailAddress'>;
export type ISODateString = Brand<string, 'ISODateString'>;

// Utility types for better type safety
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Result type for error handling
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// Validation types
export type ValidationResult<T> = Result<T, ValidationError>;

export interface ValidationError {
  field?: string;
  message: string;
  code?: string;
}

export interface ValidationRule<T> {
  validate: (value: T) => ValidationResult<T>;
  message: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

// Async state management
export interface AsyncState<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

// Type guards
export const isEmailAddress = (value: string): value is EmailAddress => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

export const isUserId = (value: string): value is UserId => {
  return value.length > 0 && typeof value === 'string';
};

export const isISODateString = (value: string): value is ISODateString => {
  const date = new Date(value);
  return !isNaN(date.getTime()) && date.toISOString() === value;
};

// Helper functions for creating branded types
export const createUserId = (id: string): UserId => id as UserId;
export const createEmailAddress = (email: string): EmailAddress => {
  if (!isEmailAddress(email)) {
    throw new Error('Invalid email address');
  }
  return email as EmailAddress;
};
export const createISODateString = (date: string): ISODateString => {
  if (!isISODateString(date)) {
    throw new Error('Invalid ISO date string');
  }
  return date as ISODateString;
};
