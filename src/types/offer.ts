// src/types/offer.ts
import { Offer as BaseOffer } from '@/services/tripOffersService';

export interface FlightPricing {
  base: number;
  carryOnFee: number;
  total: number;
}

export interface ScoredOffer extends BaseOffer {
  price: number;              // legacy for backward-compat
  priceStructure: FlightPricing;
  carryOnIncluded: boolean;
  score: number;
  reasons: string[];
  pool: 1 | 2 | 3;
}
