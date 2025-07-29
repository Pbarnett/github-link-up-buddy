import * as React from 'react';
/**
 * Budget Filter Implementation
 *
 * This filter removes flight offers that exceed the user's budget,
 * with support for currency conversion and configurable tolerance.
 */

import {
  FlightOffer,
  FlightFilter,
  FilterContext,
  ValidationResult,
  CurrencyConverter,
} from '../core/types';

export class BudgetFilter implements FlightFilter {
  readonly name = 'BudgetFilter';
  readonly priority = 10; // High priority - filter expensive offers early

  private currencyConverter?: CurrencyConverter;

  constructor(currencyConverter?: CurrencyConverter) {
    this.currencyConverter = currencyConverter;
  }

  async apply(
    offers: FlightOffer[],
    context: FilterContext
  ): Promise<FlightOffer[]> {
    console.log(
      `[${this.name}] Starting budget filtering with budget: ${context.budget} ${context.currency}`
    );

    if (!context.budget || context.budget <= 0) {
      console.warn(
        `[${this.name}] No valid budget specified, returning all offers`
      );
      return offers;
    }

    const tolerance = context.config?.budgetTolerance || 0;
    const effectiveBudget = context.budget + tolerance;

    console.log(
      `[${this.name}] Effective budget (with tolerance): ${effectiveBudget} ${context.currency}`
    );

    const filteredOffers: FlightOffer[] = [];
    let currencyConversions = 0;

    for (const offer of offers) {
      try {
        const offerPrice = await this.getOfferPriceInTargetCurrency(
          offer,
          context.currency,
          context
        );

        if (offerPrice <= effectiveBudget) {
          filteredOffers.push({
            ...offer,
            // Optionally update the offer with converted price for consistency
            totalBasePrice:
              context.currency === offer.currency
                ? offer.totalBasePrice
                : offerPrice,
            totalPriceWithCarryOn:
              context.currency === offer.currency
                ? offer.totalPriceWithCarryOn
                : offerPrice + (offer.carryOnFee || 0),
            currency: context.currency,
          });
        } else {
          console.log(
            `[${this.name}] Filtered out offer ${offer.id}: ${offerPrice} ${context.currency} > ${effectiveBudget} ${context.currency}`
          );
        }

        if (offer.currency !== context.currency) {
          currencyConversions++;
        }
      } catch (error) {
        console.error(
          `[${this.name}] Error processing offer ${offer.id}:`,
          error
        );
        // In case of error, include the offer if it's in the same currency and within budget
        if (
          offer.currency === context.currency &&
          offer.totalBasePrice <= effectiveBudget
        ) {
          filteredOffers.push(offer);
        }
      }
    }

    if (currencyConversions > 0) {
      console.log(
        `[${this.name}] Performed ${currencyConversions} currency conversions`
      );
    }

    console.log(
      `[${this.name}] Budget filtering complete: ${offers.length} → ${filteredOffers.length} offers`
    );

    return filteredOffers;
  }

  validate(context: FilterContext): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!context.budget || context.budget <= 0) {
      warnings.push('No budget specified - budget filter will be skipped');
    }

    if (!context.currency) {
      errors.push('No currency specified for budget filtering');
    }

    const tolerance = context.config?.budgetTolerance || 0;
    if (tolerance < 0) {
      errors.push('Budget tolerance cannot be negative');
    }

    if (tolerance > context.budget * 0.5) {
      warnings.push('Budget tolerance is very high (>50% of budget)');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Get the offer price converted to the target currency if needed
   */
  private async getOfferPriceInTargetCurrency(
    offer: FlightOffer,
    targetCurrency: string,
    context: FilterContext
  ): Promise<number> {
    // If currencies match, no conversion needed
    if (offer.currency === targetCurrency) {
      return offer.totalBasePrice;
    }

    // If no currency converter available, use base price as-is with warning
    if (!this.currencyConverter) {
      console.warn(
        `[${this.name}] No currency converter available for ${offer.currency} → ${targetCurrency}, using base price`
      );
      return offer.totalBasePrice;
    }

    try {
      // Convert the price
      const convertedPrice = await this.currencyConverter.convert(
        offer.totalBasePrice,
        offer.currency,
        targetCurrency
      );

      // Apply exchange rate buffer if configured
      const buffer = context.config?.exchangeRateBuffer || 0;
      const bufferedPrice = convertedPrice * (1 + buffer);

      console.log(
        `[${this.name}] Currency conversion: ${offer.totalBasePrice} ${offer.currency} → ${bufferedPrice.toFixed(2)} ${targetCurrency} (with ${buffer * 100}% buffer)`
      );

      return bufferedPrice;
    } catch (error) {
      console.error(
        `[${this.name}] Currency conversion failed for ${offer.currency} → ${targetCurrency}:`,
        error
      );

      // Fallback: use base price but log the issue
      console.warn(
        `[${this.name}] Using original price due to conversion failure`
      );
      return offer.totalBasePrice;
    }
  }

  /**
   * Configure the currency converter
   */
  setCurrencyConverter(converter: CurrencyConverter): void {
    this.currencyConverter = converter;
    console.log(`[${this.name}] Currency converter configured`);
  }

  /**
   * Get statistics about budget filtering
   */
  static getFilterStats(
    originalOffers: FlightOffer[],
    filteredOffers: FlightOffer[],
    budget: number,
    currency: string
  ): {
    removedCount: number;
    averagePrice: number;
    minPrice: number;
    maxPrice: number;
    budgetUtilization: number;
  } {
    const removedCount = originalOffers.length - filteredOffers.length;

    if (filteredOffers.length === 0) {
      return {
        removedCount,
        averagePrice: 0,
        minPrice: 0,
        maxPrice: 0,
        budgetUtilization: 0,
      };
    }

    const prices = filteredOffers
      .filter(offer => offer.currency === currency)
      .map(offer => offer.totalBasePrice);

    const averagePrice =
      prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const budgetUtilization = (averagePrice / budget) * 100;

    return {
      removedCount,
      averagePrice: Math.round(averagePrice * 100) / 100,
      minPrice: Math.round(minPrice * 100) / 100,
      maxPrice: Math.round(maxPrice * 100) / 100,
      budgetUtilization: Math.round(budgetUtilization * 100) / 100,
    };
  }
}

/**
 * Simple currency converter that uses static exchange rates
 * In production, this should use a real-time currency service
 */
export class SimpleCurrencyConverter implements CurrencyConverter {
  private static readonly EXCHANGE_RATES: Record<
    string,
    Record<string, number>
  > = {
    USD: { EUR: 0.85, GBP: 0.73, CAD: 1.25, JPY: 110 },
    EUR: { USD: 1.18, GBP: 0.86, CAD: 1.47, JPY: 130 },
    GBP: { USD: 1.37, EUR: 1.16, CAD: 1.71, JPY: 151 },
    CAD: { USD: 0.8, EUR: 0.68, GBP: 0.58, JPY: 88 },
    JPY: { USD: 0.0091, EUR: 0.0077, GBP: 0.0066, CAD: 0.011 },
  };

  async convert(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<number> {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    const rate =
      SimpleCurrencyConverter.EXCHANGE_RATES[fromCurrency]?.[toCurrency];
    if (!rate) {
      throw new Error(
        `Exchange rate not available for ${fromCurrency} → ${toCurrency}`
      );
    }

    return amount * rate;
  }

  async getExchangeRate(
    fromCurrency: string,
    toCurrency: string
  ): Promise<number> {
    if (fromCurrency === toCurrency) {
      return 1;
    }

    const rate =
      SimpleCurrencyConverter.EXCHANGE_RATES[fromCurrency]?.[toCurrency];
    if (!rate) {
      throw new Error(
        `Exchange rate not available for ${fromCurrency} → ${toCurrency}`
      );
    }

    return rate;
  }

  getSupportedCurrencies(): string[] {
    return Object.keys(SimpleCurrencyConverter.EXCHANGE_RATES);
  }
}
