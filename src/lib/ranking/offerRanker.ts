import { FlightOffer } from '../filtering/core/types';

// Multi-criteria weights for ranking (tune as needed)
const WEIGHTS = {
  price: 0.6, // 60% weight on price
  duration: 0.25, // 25% weight on duration
  stops: 0.15, // 15% weight on number of stops
};

// Normalization constants (adjust based on typical data ranges)
const NORMALIZE = {
  price: 1000, // Normalize price against a $1000 baseline
  duration: 1440, // Normalize duration against a 24-hour baseline (in minutes)
  stops: 5, // Normalize stops against a baseline of 5 stops
};

/**
 * Calculates a ranking score for a flight offer based on multiple criteria.
 * Lower scores are better.
 *
 * @param offer The flight offer to score.
 * @returns A numeric score.
 */
function calculateScore(offer: FlightOffer): number {
  const priceScore = (offer.totalPriceWithCarryOn / NORMALIZE.price) * WEIGHTS.price;

  // Calculate total duration from all itineraries
  const totalDurationMinutes = offer.itineraries.reduce((total, itinerary) => {
    // Parse ISO 8601 duration (e.g., "PT2H30M")
    const match = itinerary.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    const hours = parseInt(match?.[1] || '0', 10);
    const minutes = parseInt(match?.[2] || '0', 10);
    return total + (hours * 60) + minutes;
  }, 0);
  const durationScore = (totalDurationMinutes / NORMALIZE.duration) * WEIGHTS.duration;

  const stopsScore = (offer.stopsCount / NORMALIZE.stops) * WEIGHTS.stops;

  return priceScore + durationScore + stopsScore;
}

/**
 * Ranks an array of flight offers using a multi-criteria scoring algorithm.
 *
 * @param offers The array of flight offers to rank.
 * @returns A new array of offers sorted by rank (best to worst).
 */
export function rankOffers(offers: FlightOffer[]): FlightOffer[] {
  if (!offers || offers.length === 0) {
    return [];
  }

  return [...offers].sort((a, b) => {
    const scoreA = calculateScore(a);
    const scoreB = calculateScore(b);
    return scoreA - scoreB;
  });
}

