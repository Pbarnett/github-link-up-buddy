/**
 * Duffel Error Handling and User Message Mapping
 *
 * Provides comprehensive error handling for Duffel API responses
 * with user-friendly messages and proper error classification.
 */

export interface DuffelError {
  type: string;
  title: string;
  detail: string;
  source?: {
    pointer?: string;
    parameter?: string;
  };
  code?: string;
}

export interface DuffelApiErrorResponse {
  errors: DuffelError[];
}

export enum DuffelErrorType {
  OFFER_EXPIRED = 'offer_no_longer_available',
  VALIDATION_ERROR = 'validation_error',
  PAYMENT_REQUIRED = 'payment_required',
  IDENTITY_DOCUMENTS_REQUIRED = 'passenger_identity_documents_required',
  INSUFFICIENT_FUNDS = 'insufficient_funds',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  PRICE_CHANGED = 'price_changed',
  SCHEDULE_CHANGED = 'schedule_changed',
  BOOKING_NOT_FOUND = 'booking_not_found',
  PAYMENT_FAILED = 'payment_failed',
  UNAUTHORIZED = 'unauthorized',
  FORBIDDEN = 'forbidden',
  INTERNAL_ERROR = 'internal_server_error',
  SERVICE_UNAVAILABLE = 'service_unavailable',
}

/**
 * User-friendly error messages mapped from Duffel API errors
 */
export const DUFFEL_ERROR_MESSAGES: Record<string, string> = {
  // Offer and availability errors
  [DuffelErrorType.OFFER_EXPIRED]:
    'This flight is no longer available. Please search again for current options.',
  offer_expired:
    'This flight offer has expired. Please search again for current availability.',
  offer_not_found:
    'The selected flight is no longer available. Please choose a different option.',
  seats_not_available:
    'The requested seats are no longer available. Please select different seats.',

  // Validation errors
  [DuffelErrorType.VALIDATION_ERROR]:
    'Please check your travel details and try again.',
  invalid_passenger_details:
    'Please verify all passenger information is correct and complete.',
  invalid_travel_date:
    'Please check your travel dates and ensure they are valid.',
  missing_required_field:
    'Please complete all required information to proceed.',

  // Payment errors
  [DuffelErrorType.PAYMENT_REQUIRED]:
    'Payment is required to complete this booking.',
  [DuffelErrorType.INSUFFICIENT_FUNDS]:
    'Payment was declined. Please try a different payment method.',
  [DuffelErrorType.PAYMENT_FAILED]:
    'Payment could not be processed. Please check your payment details and try again.',
  card_declined:
    'Your card was declined. Please try a different payment method.',
  payment_timeout: 'Payment processing timed out. Please try again.',

  // Document requirements
  [DuffelErrorType.IDENTITY_DOCUMENTS_REQUIRED]:
    'Passport information is required for this international route.',
  passport_required:
    'A valid passport is required for this international flight.',
  passport_expired:
    'The passport provided has expired. Please update with current passport information.',
  visa_required:
    'A visa may be required for this destination. Please verify travel requirements.',

  // Pricing and schedule
  [DuffelErrorType.PRICE_CHANGED]:
    'The price has changed since you started booking. Please review the new total.',
  [DuffelErrorType.SCHEDULE_CHANGED]:
    'The flight schedule has changed since booking. Please review the updated itinerary.',
  fare_no_longer_available:
    'This fare is no longer available. Please select a different option.',

  // System errors
  [DuffelErrorType.RATE_LIMIT_EXCEEDED]:
    'Too many requests. Please wait a moment and try again.',
  [DuffelErrorType.UNAUTHORIZED]:
    'Authentication failed. Please contact support.',
  [DuffelErrorType.FORBIDDEN]:
    'This action is not permitted. Please contact support.',
  [DuffelErrorType.INTERNAL_ERROR]:
    'A system error occurred. Please try again or contact support.',
  [DuffelErrorType.SERVICE_UNAVAILABLE]:
    'The booking service is temporarily unavailable. Please try again in a few minutes.',

  // Booking management
  [DuffelErrorType.BOOKING_NOT_FOUND]:
    'Booking not found. Please check your booking reference.',
  booking_already_cancelled: 'This booking has already been cancelled.',
  booking_cannot_be_cancelled:
    'This booking cannot be cancelled. Please contact the airline directly.',
  refund_not_permitted: 'This booking is not eligible for a refund.',

  // Generic fallbacks
  unknown_error:
    'An unexpected error occurred. Please try again or contact support.',
  network_error:
    'Connection failed. Please check your internet connection and try again.',
  timeout_error: 'The request timed out. Please try again.',
};

/**
 * Determines if an error is retryable based on error type
 */
export function isDuffelErrorRetryable(errorType: string): boolean {
  const retryableErrors = [
    DuffelErrorType.RATE_LIMIT_EXCEEDED,
    DuffelErrorType.INTERNAL_ERROR,
    DuffelErrorType.SERVICE_UNAVAILABLE,
    'network_error',
    'timeout_error',
  ];

  return retryableErrors.includes(errorType);
}

/**
 * Determines if an error requires user action
 */
export function isDuffelErrorUserActionRequired(errorType: string): boolean {
  const userActionErrors = [
    DuffelErrorType.OFFER_EXPIRED,
    DuffelErrorType.VALIDATION_ERROR,
    DuffelErrorType.IDENTITY_DOCUMENTS_REQUIRED,
    DuffelErrorType.INSUFFICIENT_FUNDS,
    DuffelErrorType.PRICE_CHANGED,
    'invalid_passenger_details',
    'passport_required',
    'card_declined',
  ];

  return userActionErrors.includes(errorType);
}

/**
 * Parse Duffel API error response and extract user-friendly message
 */
export function parseDuffelError(error: unknown): {
  type: string;
  message: string;
  userMessage: string;
  retryable: boolean;
  requiresUserAction: boolean;
  originalError?: DuffelError;
} {
  let errorType = 'unknown_error';
  let originalError: DuffelError | undefined;

  // Handle Duffel API error response format
  if (
    error &&
    typeof error === 'object' &&
    'errors' in error &&
    Array.isArray((error as DuffelApiErrorResponse).errors) &&
    (error as DuffelApiErrorResponse).errors.length > 0
  ) {
    originalError = (error as DuffelApiErrorResponse).errors[0];
    errorType = originalError?.type || originalError?.code || 'unknown_error';
  }
  // Handle HTTP response errors
  else if (error && typeof error === 'object' && 'status' in error) {
    const statusError = error as { status: number };
    switch (statusError.status) {
      case 400:
        errorType = DuffelErrorType.VALIDATION_ERROR;
        break;
      case 401:
        errorType = DuffelErrorType.UNAUTHORIZED;
        break;
      case 403:
        errorType = DuffelErrorType.FORBIDDEN;
        break;
      case 404:
        errorType = DuffelErrorType.BOOKING_NOT_FOUND;
        break;
      case 429:
        errorType = DuffelErrorType.RATE_LIMIT_EXCEEDED;
        break;
      case 500:
        errorType = DuffelErrorType.INTERNAL_ERROR;
        break;
      case 503:
        errorType = DuffelErrorType.SERVICE_UNAVAILABLE;
        break;
      default:
        errorType = 'unknown_error';
    }
  }
  // Handle network/timeout errors
  else if (
    error &&
    typeof error === 'object' &&
    (('name' in error && (error as { name: string }).name === 'AbortError') ||
      ('message' in error &&
        typeof (error as { message: string }).message === 'string' &&
        (error as { message: string }).message.includes('timeout')))
  ) {
    errorType = 'timeout_error';
  } else if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as { message: string }).message === 'string' &&
    (error as { message: string }).message.includes('fetch')
  ) {
    errorType = 'network_error';
  }

  const userMessage =
    DUFFEL_ERROR_MESSAGES[errorType] || DUFFEL_ERROR_MESSAGES['unknown_error'];
  const message =
    originalError?.detail ||
    originalError?.title ||
    (error && typeof error === 'object' && 'message' in error
      ? String((error as { message: unknown }).message)
      : 'Unknown error occurred');

  return {
    type: errorType,
    message,
    userMessage,
    retryable: isDuffelErrorRetryable(errorType),
    requiresUserAction: isDuffelErrorUserActionRequired(errorType),
    originalError,
  };
}

/**
 * Custom error class for Duffel API errors
 */
export class DuffelAPIError extends Error {
  public readonly type: string;
  public readonly userMessage: string;
  public readonly retryable: boolean;
  public readonly requiresUserAction: boolean;
  public readonly originalError?: DuffelError;
  public readonly statusCode?: number;

  constructor(error: unknown, statusCode?: number) {
    const parsed = parseDuffelError(error);
    super(parsed.message);

    this.name = 'DuffelAPIError';
    this.type = parsed.type;
    this.userMessage = parsed.userMessage;
    this.retryable = parsed.retryable;
    this.requiresUserAction = parsed.requiresUserAction;
    this.originalError = parsed.originalError;
    this.statusCode = statusCode;
  }
}

/**
 * Throw a DuffelAPIError with proper error parsing
 */
export function throwDuffelError(error: unknown, statusCode?: number): never {
  throw new DuffelAPIError(error, statusCode);
}
