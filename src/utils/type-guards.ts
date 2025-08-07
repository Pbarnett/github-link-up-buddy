/**
 * Type Guards and Runtime Type Validation
 * Implementing safe type checking and validation patterns
 */

import type {
  Brand,
  UserId,
  EmailAddress,
  ISODateString,
  Result,
  _ValidationResult,
  ValidationError,
  ApiResponse,
  AsyncState,
../types';

// ============================================================================
// PRIMITIVE TYPE GUARDS
// ============================================================================

/**
 * Check if value is a string
 */
export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

/**
 * Check if value is a number
 */
export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !Number.isNaN(value);
};

/**
 * Check if value is a boolean
 */
export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean';
};

/**
 * Check if value is null
 */
export const isNull = (value: unknown): value is null => {
  return value === null;
};

/**
 * Check if value is undefined
 */
export const isUndefined = (value: unknown): value is undefined => {
  return value === undefined;
};

/**
 * Check if value is null or undefined
 */
export const isNullish = (value: unknown): value is null | undefined => {
  return isNull(value) || isUndefined(value);
};

/**
 * Check if value is not null or undefined
 */
export const isNotNullish = <T>(value: T | null | undefined): value is T => {
  return !isNullish(value);
};

// ============================================================================
// COMPLEX TYPE GUARDS
// ============================================================================

/**
 * Check if value is an array
 */
export const isArray = <T>(value: unknown): value is T[] => {
  return Array.isArray(value);
};

/**
 * Check if value is an object (not null, not array)
 */
export const isObject = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

/**
 * Check if value is a function
 */
export const isFunction = (
  value: unknown
): value is (...args: any[]) => any => {
  return typeof value === 'function';
};

/**
 * Check if value is a Promise
 */
export const isPromise = <T>(value: unknown): value is Promise<T> => {
  return isObject(value) && isFunction((value as any).then);
};

/**
 * Check if value is a Date object
 */
export const isDate = (value: unknown): value is Date => {
  return value instanceof Date && !Number.isNaN(value.getTime());
};

// ============================================================================
// BRANDED TYPE GUARDS
// ============================================================================

/**
 * Check if string is a valid email address
 */
export const isEmailAddress = (value: unknown): value is EmailAddress => {
  if (!isString(value)) return false;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(value);
};

/**
 * Check if string is a valid ISO date string
 */
export const isISODateString = (value: unknown): value is ISODateString => {
  if (!isString(value)) return false;

  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
  if (!isoDateRegex.test(value)) return false;

  const date = new Date(value);
  return isDate(date) && date.toISOString() === value;
};

/**
 * Check if string is a valid UserId
 */
export const isUserId = (value: unknown): value is UserId => {
  return isString(value) && value.length > 0;
};

// ============================================================================
// GENERIC VALIDATION UTILITIES
// ============================================================================

/**
 * Create a branded type validator
 */
export const createBrandValidator = <T extends string, B>(
  validator: (value: unknown) => value is T,
  errorMessage: string
) => {
  return (value: unknown): value is Brand<T, B> => {
    if (!validator(value)) {
      return false;
    }
    return true;
  };
};

/**
 * Validate and transform to branded type
 */
export const validateAndBrand = <T, B>(
  value: unknown,
  validator: (value: unknown) => value is T,
  brand: B,
  errorMessage: string
): Result<Brand<T, B>, ValidationError[]> => {
  if (!validator(value)) {
    return {
      success: false,
      error: [
        {
          path: [],
          message: errorMessage,
          code: 'INVALID_TYPE',
          value,
        },
      ],
    };
  }

  return {
    success: true,
    data: value as Brand<T, B>,
  };
};

// ============================================================================
// OBJECT VALIDATION GUARDS
// ============================================================================

/**
 * Check if object has specific property
 */
export const hasProperty = <K extends string>(
  obj: unknown,
  key: K
): obj is Record<K, unknown> => {
  return isObject(obj) && key in obj;
};

/**
 * Check if object has all required properties
 */
export const hasRequiredProperties = <K extends string>(
  obj: unknown,
  keys: readonly K[]
): obj is Record<K, unknown> => {
  if (!isObject(obj)) return false;

  return keys.every(key => key in obj);
};

/**
 * Check if object matches shape
 */
export const matchesShape = <T extends Record<string, unknown>>(
  obj: unknown,
  shape: { [K in keyof T]: (value: unknown) => value is T[K] }
): obj is T => {
  if (!isObject(obj)) return false;

  for (const [key, validator] of Object.entries(shape)) {
    if (!(key in obj) || !validator(obj[key])) {
      return false;
    }
  }

  return true;
};

// ============================================================================
// API RESPONSE TYPE GUARDS
// ============================================================================

/**
 * Check if response is a successful API response
 */
export const isSuccessApiResponse = <T>(
  response: unknown
): response is ApiResponse<T> => {
  return (
    isObject(response) &&
    hasProperty(response, 'success') &&
    response.success === true &&
    hasProperty(response, 'data')
  );
};

/**
 * Check if response is an error API response
 */
export const isErrorApiResponse = (
  response: unknown
): response is ApiResponse<never> => {
  return (
    isObject(response) &&
    hasProperty(response, 'success') &&
    response.success === false &&
    hasProperty(response, 'errors') &&
    isArray(response.errors)
  );
};

// ============================================================================
// ASYNC STATE TYPE GUARDS
// ============================================================================

/**
 * Check if async state is idle
 */
export const isIdleState = <T, E>(
  state: AsyncState<T, E>
): state is Extract<AsyncState<T, E>, { status: 'idle' }> => {
  return (
    isObject(state) && hasProperty(state, 'status') && state.status === 'idle'
  );
};

/**
 * Check if async state is loading
 */
export const isLoadingState = <T, E>(
  state: AsyncState<T, E>
): state is Extract<AsyncState<T, E>, { status: 'loading' }> => {
  return (
    isObject(state) &&
    hasProperty(state, 'status') &&
    state.status === 'loading'
  );
};

/**
 * Check if async state is success
 */
export const isSuccessState = <T, E>(
  state: AsyncState<T, E>
): state is Extract<AsyncState<T, E>, { status: 'success' }> => {
  return (
    isObject(state) &&
    hasProperty(state, 'status') &&
    state.status === 'success' &&
    hasProperty(state, 'data')
  );
};

/**
 * Check if async state is error
 */
export const isErrorState = <T, E>(
  state: AsyncState<T, E>
): state is Extract<AsyncState<T, E>, { status: 'error' }> => {
  return (
    isObject(state) &&
    hasProperty(state, 'status') &&
    state.status === 'error' &&
    hasProperty(state, 'error')
  );
};

// ============================================================================
// RESULT TYPE GUARDS
// ============================================================================

/**
 * Check if Result is success
 */
export const isSuccessResult = <T, E>(
  result: Result<T, E>
): result is Extract<Result<T, E>, { success: true }> => {
  return (
    isObject(result) &&
    hasProperty(result, 'success') &&
    result.success === true
  );
};

/**
 * Check if Result is error
 */
export const isErrorResult = <T, E>(
  result: Result<T, E>
): result is Extract<Result<T, E>, { success: false }> => {
  return (
    isObject(result) &&
    hasProperty(result, 'success') &&
    result.success === false
  );
};

// ============================================================================
// VALIDATION RESULT TYPE GUARDS
// ============================================================================

/**
 * Check if validation result is valid
 */
export const isValidResult = <T>(
  result: ValidationResult<T>
): result is Extract<ValidationResult<T>, { valid: true }> => {
  return (
    isObject(result) && hasProperty(result, 'valid') && result.valid === true
  );
};

/**
 * Check if validation result is invalid
 */
export const isInvalidResult = <T>(
  result: ValidationResult<T>
): result is Extract<ValidationResult<T>, { valid: false }> => {
  return (
    isObject(result) && hasProperty(result, 'valid') && result.valid === false
  );
};

// ============================================================================
// UTILITY HELPER FUNCTIONS
// ============================================================================

/**
 * Assert value is defined (throws if not)
 */
export const assertDefined = <T>(
  value: T | null | undefined,
  message = 'Value must be defined'
): asserts value is T => {
  if (isNullish(value)) {
    throw new Error(message);
  }
};

/**
 * Assert condition is true (throws if not)
 */
export const assert = (
  condition: unknown,
  message = 'Assertion failed'
): asserts condition => {
  if (!condition) {
    throw new Error(message);
  }
};

/**
 * Exhaustive switch case check
 */
export const exhaustiveCheck = (value: never, message?: string): never => {
  throw new Error(
    message ?? `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

// ============================================================================
// COMPOSITE VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate multiple conditions and collect errors
 */
export const validateAll = <T>(
  value: unknown,
  validators: Array<{
    check: (value: unknown) => boolean;
    error: ValidationError;
  }>
): ValidationResult<T> => {
  const errors: ValidationError[] = [];

  for (const validator of validators) {
    if (!validator.check(value)) {
      errors.push(validator.error);
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, data: value as T };
};

/**
 * Create a schema validator
 */
export const createSchema = <T>(shape: {
  [K in keyof T]: (value: unknown) => value is T[K];
}) => {
  const schema = {
    validate(input: unknown): ValidationResult<T> {
      if (!isObject(input)) {
        return {
          valid: false,
          errors: [
            {
              path: [],
              message: 'Expected object',
              code: 'INVALID_TYPE',
              value: input,
            },
          ],
        };
      }

      const errors: ValidationError[] = [];
      const result: Partial<T> = {};

      for (const [key, validator] of Object.entries(shape as any)) {
        const value = input[key];

        if (!(validator as Function)(value)) {
          errors.push({
            path: [key],
            message: `Invalid value for field ${key}`,
            code: 'INVALID_FIELD',
            value,
          });
        } else {
          (result as any)[key] = value;
        }
      }

      if (errors.length > 0) {
        return { valid: false, errors };
      }

      return { valid: true, data: result as T };
    },

    safeParse(input: unknown): Result<T, ValidationError[]> {
      const validation = this.validate(input);

      if (isValidResult(validation)) {
        return { success: true, data: validation.data as T };
      }

      return { success: false, error: validation.errors };
    },

    parse(input: unknown): T {
      const result = this.safeParse(input);

      if (isSuccessResult(result)) {
        return result.data as T;
      }

      throw new Error(
        `Validation failed: ${result.error.map(e => e.message).join(', ')}`
      );
    },
  };

  return schema;
};
