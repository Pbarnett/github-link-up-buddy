import * as React from 'react';
import { supabase } from '@/integrations/supabase/client';
export interface CurrencyConfig {
  code: string;
  name: string;
  symbol: string;
  decimal_places: number;
  stripe_supported: boolean;
  regions: string[];
}

export interface ExchangeRate {
  from_currency: string;
  to_currency: string;
  rate: number;
  last_updated: string;
}

export interface CurrencyConversion {
  original_amount: number;
  original_currency: string;
  converted_amount: number;
  converted_currency: string;
  exchange_rate: number;
  conversion_date: string;
}

class CurrencyService {
  private baseUrl: string;
  private supportedCurrencies: Map<string, CurrencyConfig> = new Map();

  constructor() {
    this.baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/currency-service`;
    this.initializeSupportedCurrencies();
  }

  private initializeSupportedCurrencies() {
    // Major currencies supported by Stripe and commonly used for travel
    const currencies: CurrencyConfig[] = [
      {
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
        decimal_places: 2,
        stripe_supported: true,
        regions: ['US', 'EC', 'SV', 'PA', 'ZW'],
      },
      {
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
        decimal_places: 2,
        stripe_supported: true,
        regions: [
          'DE',
          'FR',
          'IT',
          'ES',
          'NL',
          'BE',
          'AT',
          'PT',
          'IE',
          'GR',
          'FI',
        ],
      },
      {
        code: 'GBP',
        name: 'British Pound',
        symbol: '£',
        decimal_places: 2,
        stripe_supported: true,
        regions: ['GB'],
      },
      {
        code: 'CAD',
        name: 'Canadian Dollar',
        symbol: 'C$',
        decimal_places: 2,
        stripe_supported: true,
        regions: ['CA'],
      },
      {
        code: 'AUD',
        name: 'Australian Dollar',
        symbol: 'A$',
        decimal_places: 2,
        stripe_supported: true,
        regions: ['AU'],
      },
      {
        code: 'JPY',
        name: 'Japanese Yen',
        symbol: '¥',
        decimal_places: 0,
        stripe_supported: true,
        regions: ['JP'],
      },
      {
        code: 'CHF',
        name: 'Swiss Franc',
        symbol: 'CHF',
        decimal_places: 2,
        stripe_supported: true,
        regions: ['CH'],
      },
      {
        code: 'SEK',
        name: 'Swedish Krona',
        symbol: 'kr',
        decimal_places: 2,
        stripe_supported: true,
        regions: ['SE'],
      },
      {
        code: 'NOK',
        name: 'Norwegian Krone',
        symbol: 'kr',
        decimal_places: 2,
        stripe_supported: true,
        regions: ['NO'],
      },
      {
        code: 'DKK',
        name: 'Danish Krone',
        symbol: 'kr',
        decimal_places: 2,
        stripe_supported: true,
        regions: ['DK'],
      },
    ];

    currencies.forEach(currency => {
      this.supportedCurrencies.set(currency.code, currency);
    });
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error('No authenticated session found');
    }

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    };
  }

  /**
   * Get all supported currencies
   */
  getSupportedCurrencies(): CurrencyConfig[] {
    return Array.from(this.supportedCurrencies.values());
  }

  /**
   * Get currency configuration by code
   */
  getCurrencyConfig(code: string): CurrencyConfig | undefined {
    return this.supportedCurrencies.get(code.toUpperCase());
  }

  /**
   * Detect preferred currency based on user location or settings
   */
  async detectUserCurrency(): Promise<string> {
    try {
      // Try to get user's profile currency preference first
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('user_preferences')
          .select('preferred_currency')
          .eq('user_id', user.id)
          .single();

        if (profile?.preferred_currency) {
          return profile.preferred_currency;
        }
      }

      // Fallback to geolocation-based detection
      const response = await fetch('https://ipapi.co/json/');
      const geoData = await response.json();

      if (geoData.country_code) {
        return this.getCurrencyByCountry(geoData.country_code);
      }
    } catch (error) {
      console.warn('Failed to detect user currency:', error);
    }

    // Default to USD
    return 'USD';
  }

  /**
   * Get currency by country code
   */
  private getCurrencyByCountry(countryCode: string): string {
    for (const [currencyCode, config] of this.supportedCurrencies) {
      if (config.regions.includes(countryCode)) {
        return currencyCode;
      }
    }

    // Country-specific mappings for common cases
    const countryToCurrency: Record<string, string> = {
      US: 'USD',
      GB: 'GBP',
      DE: 'EUR',
      FR: 'EUR',
      CA: 'CAD',
      AU: 'AUD',
      JP: 'JPY',
      CH: 'CHF',
      SE: 'SEK',
      NO: 'NOK',
      DK: 'DKK',
    };

    return countryToCurrency[countryCode] || 'USD';
  }

  /**
   * Get current exchange rate between two currencies
   */
  async getExchangeRate(
    fromCurrency: string,
    toCurrency: string
  ): Promise<number> {
    if (fromCurrency === toCurrency) {
      return 1.0;
    }

    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${this.baseUrl}/exchange-rate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          from_currency: fromCurrency.toUpperCase(),
          to_currency: toCurrency.toUpperCase(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get exchange rate: ${response.statusText}`);
      }

      const data = await response.json();
      return data.rate;
    } catch (error) {
      console.error('Error getting exchange rate:', error);
      // Fallback to a simple rate (in production, you'd have a more robust fallback)
      return 1.0;
    }
  }

  /**
   * Convert amount between currencies
   */
  async convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<CurrencyConversion> {
    const rate = await this.getExchangeRate(fromCurrency, toCurrency);
    const convertedAmount = amount * rate;

    return {
      original_amount: amount,
      original_currency: fromCurrency.toUpperCase(),
      converted_amount: this.roundToCurrencyPrecision(
        convertedAmount,
        toCurrency
      ),
      converted_currency: toCurrency.toUpperCase(),
      exchange_rate: rate,
      conversion_date: new Date().toISOString(),
    };
  }

  /**
   * Round amount to appropriate decimal places for currency
   */
  roundToCurrencyPrecision(amount: number, currency: string): number {
    const config = this.getCurrencyConfig(currency);
    const decimalPlaces = config?.decimal_places ?? 2;
    return (
      Math.round(amount * Math.pow(10, decimalPlaces)) /
      Math.pow(10, decimalPlaces)
    );
  }

  /**
   * Format amount with currency symbol
   */
  formatCurrencyAmount(
    amount: number,
    currency: string,
    locale?: string
  ): string {
    const config = this.getCurrencyConfig(currency);

    if (!config) {
      return `${amount} ${currency}`;
    }

    try {
      return new Intl.NumberFormat(locale || 'en-US', {
        style: 'currency',
        currency: config.code,
        minimumFractionDigits: config.decimal_places,
        maximumFractionDigits: config.decimal_places,
      }).format(amount);
    } catch {
      // Fallback formatting
      return `${config.symbol}${amount.toFixed(config.decimal_places)}`;
    }
  }

  /**
   * Get Stripe-compatible amount (in smallest currency unit)
   */
  getStripeAmount(amount: number, currency: string): number {
    const config = this.getCurrencyConfig(currency);
    if (!config) {
      throw new Error(`Unsupported currency: ${currency}`);
    }

    if (!config.stripe_supported) {
      throw new Error(`Currency not supported by Stripe: ${currency}`);
    }

    // Convert to smallest unit (e.g., cents for USD, yen for JPY)
    return Math.round(amount * Math.pow(10, config.decimal_places));
  }

  /**
   * Convert from Stripe amount to decimal amount
   */
  fromStripeAmount(stripeAmount: number, currency: string): number {
    const config = this.getCurrencyConfig(currency);
    if (!config) {
      throw new Error(`Unsupported currency: ${currency}`);
    }

    return stripeAmount / Math.pow(10, config.decimal_places);
  }

  /**
   * Update user's preferred currency
   */
  async updateUserCurrencyPreference(currency: string): Promise<void> {
    if (!this.supportedCurrencies.has(currency.toUpperCase())) {
      throw new Error(`Unsupported currency: ${currency}`);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await (supabase.from('user_preferences').upsert({
      user_id: user.id,
      preferred_currency: currency.toUpperCase(),
      updated_at: new Date().toISOString(),
    }) as any);

    if (error) {
      throw new Error(`Failed to update currency preference: ${error.message}`);
    }
  }

  /**
   * Get historical exchange rates for analytics
   */
  async getHistoricalRates(
    fromCurrency: string,
    toCurrency: string,
    days: number = 30
  ): Promise<ExchangeRate[]> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${this.baseUrl}/historical-rates`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          from_currency: fromCurrency.toUpperCase(),
          to_currency: toCurrency.toUpperCase(),
          days,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to get historical rates: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting historical rates:', error);
      return [];
    }
  }

  /**
   * Check if currency is supported for bookings
   */
  isCurrencySupported(currency: string): boolean {
    return this.supportedCurrencies.has(currency.toUpperCase());
  }

  /**
   * Check if currency is supported by Stripe
   */
  isStripeSupported(currency: string): boolean {
    const config = this.getCurrencyConfig(currency);
    return config?.stripe_supported || false;
  }
}

// Export singleton instance
export const currencyService = new CurrencyService();
export default currencyService;
