import * as React from 'react';
/**
 * Parker Flight Core Business Rules
 *
 * These rules define our core value proposition and should NEVER be configurable by users.
 * They should be hard-coded throughout the application.
 */

export const PARKER_FLIGHT_BUSINESS_RULES = {
  // All flights must be round-trip (vacation/leisure focus)
  ROUND_TRIP_ONLY: true,

  // All flights must be non-stop (premium experience)
  NONSTOP_ONLY: true,

  // Carry-on bag must be included in displayed price (transparent pricing)
  CARRY_ON_INCLUDED: true,

  // All prices are per person
  PER_PERSON_PRICING: true,

  // Minimum trip duration (business logic)
  MIN_TRIP_DURATION: 1,

  // Maximum trip duration (business logic)
  MAX_TRIP_DURATION: 30,

  // Minimum budget (operational constraint)
  MIN_BUDGET: 100,

  // Maximum budget (operational constraint)
  MAX_BUDGET: 10000,
} as const;

/**
 * Business rule enforcement for flight searches
 */
export const getFlightSearchConstraints = () => ({
  // Amadeus API parameters
  nonStop: PARKER_FLIGHT_BUSINESS_RULES.NONSTOP_ONLY,

  // Always search for round-trip
  roundTrip: PARKER_FLIGHT_BUSINESS_RULES.ROUND_TRIP_ONLY,

  // Include baggage fees in pricing calculations
  includeBaggage: PARKER_FLIGHT_BUSINESS_RULES.CARRY_ON_INCLUDED,

  // Duration constraints
  minDuration: PARKER_FLIGHT_BUSINESS_RULES.MIN_TRIP_DURATION,
  maxDuration: PARKER_FLIGHT_BUSINESS_RULES.MAX_TRIP_DURATION,

  // Budget constraints
  minBudget: PARKER_FLIGHT_BUSINESS_RULES.MIN_BUDGET,
  maxBudget: PARKER_FLIGHT_BUSINESS_RULES.MAX_BUDGET,
});

/**
 * User-facing messaging about what's included
 */
export const BUSINESS_RULE_MESSAGING = {
  PRICE_INCLUDES:
    'All prices include round-trip, non-stop flights with carry-on bag',

  FLIGHT_TYPE: 'All flights are round-trip and non-stop',

  BAGGAGE_INCLUDED: 'Carry-on bag fee is included in the price shown',

  PREMIUM_EXPERIENCE:
    'We specialize in premium, non-stop flights for your convenience',

  TRANSPARENT_PRICING: 'No hidden fees - what you see is what you pay',
} as const;

/**
 * Validation helpers that enforce business rules
 */
export const validateBusinessRules = {
  /**
   * Ensure trip duration is within business constraints
   */
  tripDuration: (minDuration: number, maxDuration: number) => {
    if (minDuration < PARKER_FLIGHT_BUSINESS_RULES.MIN_TRIP_DURATION) {
      throw new Error(
        `Minimum trip duration cannot be less than ${PARKER_FLIGHT_BUSINESS_RULES.MIN_TRIP_DURATION} day(s)`
      );
    }
    if (maxDuration > PARKER_FLIGHT_BUSINESS_RULES.MAX_TRIP_DURATION) {
      throw new Error(
        `Maximum trip duration cannot exceed ${PARKER_FLIGHT_BUSINESS_RULES.MAX_TRIP_DURATION} days`
      );
    }
    if (minDuration > maxDuration) {
      throw new Error(
        'Minimum duration cannot be greater than maximum duration'
      );
    }
  },

  /**
   * Ensure budget is within business constraints
   */
  budget: (budget: number) => {
    if (budget < PARKER_FLIGHT_BUSINESS_RULES.MIN_BUDGET) {
      throw new Error(
        `Budget cannot be less than $${PARKER_FLIGHT_BUSINESS_RULES.MIN_BUDGET}`
      );
    }
    if (budget > PARKER_FLIGHT_BUSINESS_RULES.MAX_BUDGET) {
      throw new Error(
        `Budget cannot exceed $${PARKER_FLIGHT_BUSINESS_RULES.MAX_BUDGET}`
      );
    }
  },
};

/**
 * Type-safe business rule access
 */
export type BusinessRules = typeof PARKER_FLIGHT_BUSINESS_RULES;
export type FlightConstraints = ReturnType<typeof getFlightSearchConstraints>;
