// src/types/offer.ts
export interface OfferSegment {
  stops: number;
  durationMins: number; // Included based on test mock
  // Add other segment properties if they become known/needed
}

export interface RawOffer {
  id: string;
  price: number;
  segments: OfferSegment[];
  hasCarryOn: boolean;
  seat?: string; // Optional seat preference
  // Add other raw offer properties if they become known/needed
}

export interface ScoredOffer extends RawOffer {
  score: number;
  reasons: string[];
}
