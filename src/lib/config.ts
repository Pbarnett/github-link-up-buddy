/**
 * Application configuration
 * 
 * Centralized configuration for API settings, retry policies,
 * and other application-wide settings.
 */

export interface ApiConfig {
  retryAttempts: number;
  retryDelay: number;
  timeout: number;
  baseUrl?: string;
}

export interface AppConfig {
  api: ApiConfig;
  features: {
    duffelEnabled: boolean;
    amadeusEnabled: boolean;
    autoBookingEnabled: boolean;
  };
  environment: 'development' | 'staging' | 'production';
}

/**
 * Default API configuration
 */
const DEFAULT_API_CONFIG: ApiConfig = {
  retryAttempts: 3,
  retryDelay: 1000,
  timeout: 15000,
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL
};

/**
 * Default application configuration
 */
const DEFAULT_APP_CONFIG: AppConfig = {
  api: DEFAULT_API_CONFIG,
  features: {
    duffelEnabled: process.env.NEXT_PUBLIC_DUFFEL_ENABLED === 'true',
    amadeusEnabled: process.env.NEXT_PUBLIC_AMADEUS_ENABLED === 'true',
    autoBookingEnabled: process.env.NEXT_PUBLIC_AUTO_BOOKING_ENABLED === 'true'
  },
  environment: (process.env.NODE_ENV as 'development' | 'staging' | 'production') || 'development'
};

/**
 * Get API configuration
 */
export function getApiConfig(): ApiConfig {
  return DEFAULT_API_CONFIG;
}

/**
 * Get application configuration
 */
export function getAppConfig(): AppConfig {
  return DEFAULT_APP_CONFIG;
}

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
  return DEFAULT_APP_CONFIG.features[feature];
}

/**
 * Get environment
 */
export function getEnvironment(): string {
  return DEFAULT_APP_CONFIG.environment;
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return DEFAULT_APP_CONFIG.environment === 'development';
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return DEFAULT_APP_CONFIG.environment === 'production';
}
