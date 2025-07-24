/**
 * API Type Definitions
 * Comprehensive API types following TypeScript best practices
 */

import type {
  ApiResponse,
  HttpMethod,
  ApiEndpoint,
  ISODateString,
  AsyncState,
  Result,
  ValidationError,
} from './index';

// ============================================================================
// API REQUEST/RESPONSE PATTERNS
// ============================================================================

/**
 * Base API request configuration
 */
export interface ApiRequestConfig {
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  retry?: {
    attempts: number;
    delay: number;
    backoff?: 'linear' | 'exponential';
  };
}

/**
 * API request body types based on method
 */
export type ApiRequestBody<T = unknown> = T extends { method: 'GET' | 'DELETE' }
  ? never
  : T extends { method: 'POST' | 'PUT' | 'PATCH' }
    ? Record<string, unknown>
    : never;

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  meta?: {
    timestamp: ISODateString;
    requestId: string;
  };
}

/**
 * API error response structure
 */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    timestamp: ISODateString;
    requestId: string;
  };
  success: false;
}

// ============================================================================
// HTTP STATUS CODE TYPES
// ============================================================================

export type HttpStatusCode =
  | 200
  | 201
  | 202
  | 204 // Success
  | 400
  | 401
  | 403
  | 404
  | 409
  | 422
  | 429 // Client Error
  | 500
  | 502
  | 503
  | 504; // Server Error

export type SuccessStatusCode = 200 | 201 | 202 | 204;
export type ClientErrorStatusCode = 400 | 401 | 403 | 404 | 409 | 422 | 429;
export type ServerErrorStatusCode = 500 | 502 | 503 | 504;

// ============================================================================
// API ENDPOINT DEFINITIONS
// ============================================================================

/**
 * Type-safe API endpoints
 */
export type ApiEndpoints = {
  // Authentication
  '/api/auth/login': {
    method: 'POST';
    body: LoginRequest;
    response: LoginResponse;
  };
  '/api/auth/logout': {
    method: 'POST';
    body: never;
    response: { success: boolean };
  };
  '/api/auth/refresh': {
    method: 'POST';
    body: RefreshTokenRequest;
    response: TokenResponse;
  };

  // User management
  '/api/users/profile': { method: 'GET'; body: never; response: UserProfile };
  '/api/users/profile/update': {
    method: 'PUT';
    body: UpdateUserRequest;
    response: UserProfile;
  };

  // Flight search
  '/api/flights/search': {
    method: 'POST';
    body: FlightSearchRequest;
    response: FlightSearchResponse;
  };
  '/api/flights/offers/{offerId}': {
    method: 'GET';
    body: never;
    response: FlightOffer;
  };

  // Bookings
  '/api/bookings': {
    method: 'GET';
    body: never;
    response: PaginatedResponse<Booking>;
  };
  '/api/bookings/create': {
    method: 'POST';
    body: CreateBookingRequest;
    response: Booking;
  };
  '/api/bookings/{bookingId}': {
    method: 'GET';
    body: never;
    response: Booking;
  };
};

// ============================================================================
// REQUEST/RESPONSE TYPE EXTRACTION
// ============================================================================

/**
 * Extract request body type from endpoint definition
 */
export type ApiRequestType<T extends keyof ApiEndpoints> =
  ApiEndpoints[T]['body'] extends never ? void : ApiEndpoints[T]['body'];

/**
 * Extract response type from endpoint definition
 */
export type ApiResponseType<T extends keyof ApiEndpoints> =
  ApiEndpoints[T]['response'];

/**
 * Extract HTTP method from endpoint definition
 */
export type ApiMethodType<T extends keyof ApiEndpoints> =
  ApiEndpoints[T]['method'];

// ============================================================================
// API CLIENT TYPES
// ============================================================================

/**
 * Generic API client interface
 */
export interface ApiClient {
  request<T extends keyof ApiEndpoints>(
    endpoint: T,
    config?: Omit<ApiRequestConfig, 'method' | 'url'> & {
      body?: ApiRequestType<T>;
      params?: Record<string, string | number>;
    }
  ): Promise<Result<ApiResponseType<T>, ApiErrorResponse>>;

  get<T extends keyof ApiEndpoints>(
    endpoint: T,
    params?: Record<string, string | number>
  ): Promise<Result<ApiResponseType<T>, ApiErrorResponse>>;

  post<T extends keyof ApiEndpoints>(
    endpoint: T,
    body: ApiRequestType<T>,
    config?: Partial<ApiRequestConfig>
  ): Promise<Result<ApiResponseType<T>, ApiErrorResponse>>;

  put<T extends keyof ApiEndpoints>(
    endpoint: T,
    body: ApiRequestType<T>
  ): Promise<Result<ApiResponseType<T>, ApiErrorResponse>>;

  delete<T extends keyof ApiEndpoints>(
    endpoint: T
  ): Promise<Result<ApiResponseType<T>, ApiErrorResponse>>;
}

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: UserProfile;
  tokens: TokenResponse;
  expiresAt: ISODateString;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

// ============================================================================
// SEARCH & FILTERING TYPES
// ============================================================================

/**
 * Generic search parameters
 */
export interface SearchParams {
  query?: string;
  filters?: Record<string, unknown>;
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  pagination?: {
    page: number;
    pageSize: number;
  };
}

/**
 * Filter operators for API queries
 */
export type FilterOperator =
  | 'eq'
  | 'ne'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'nin'
  | 'contains'
  | 'startsWith'
  | 'endsWith';

/**
 * Filter condition structure
 */
export interface FilterCondition<T = unknown> {
  field: string;
  operator: FilterOperator;
  value: T;
}

// ============================================================================
// WEBHOOK TYPES
// ============================================================================

/**
 * Webhook event structure
 */
export interface WebhookEvent<T = unknown> {
  id: string;
  type: string;
  data: T;
  timestamp: ISODateString;
  version: string;
  source: string;
}

/**
 * Webhook configuration
 */
export interface WebhookConfig {
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  headers?: Record<string, string>;
}

// ============================================================================
// RATE LIMITING TYPES
// ============================================================================

/**
 * Rate limit information
 */
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

/**
 * Rate limit response headers
 */
export interface RateLimitHeaders {
  'x-ratelimit-limit': string;
  'x-ratelimit-remaining': string;
  'x-ratelimit-reset': string;
  'retry-after'?: string;
}

// ============================================================================
// CACHE TYPES
// ============================================================================

/**
 * Cache configuration for API responses
 */
export interface CacheConfig {
  ttl: number; // Time to live in seconds
  key: string;
  tags?: string[];
  staleWhileRevalidate?: boolean;
}

/**
 * Cached API response wrapper
 */
export interface CachedResponse<T> {
  data: T;
  cachedAt: ISODateString;
  expiresAt: ISODateString;
  tags: string[];
}

// Forward declarations for types used in endpoints
interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  preferences: Record<string, unknown>;
}

interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  preferences?: Record<string, unknown>;
}

interface FlightSearchRequest {
  criteria: Record<string, unknown>;
  preferences?: Record<string, unknown>;
}

interface FlightSearchResponse {
  offers: FlightOffer[];
  searchId: string;
}

interface FlightOffer {
  id: string;
  price: number;
  currency: string;
  segments: unknown[];
}

interface Booking {
  id: string;
  status: string;
  offer: FlightOffer;
  createdAt: ISODateString;
}

interface CreateBookingRequest {
  offerId: string;
  passengers: unknown[];
  payment: Record<string, unknown>;
}
