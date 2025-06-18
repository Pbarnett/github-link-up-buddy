export interface FlightOfferV2 {
  id: string;
  tripRequestId: string;
  mode: 'LEGACY' | 'AUTO' | 'MANUAL';
  priceTotal: number;
  priceCarryOn: number | null;
  bagsIncluded: boolean;
  cabinClass: string | null;
  nonstop: boolean;
  originIata: string;
  destinationIata: string;
  departDt: string;   // ISO
  returnDt: string | null;
  seatPref: string | null;
  createdAt: string;  // ISO
}

export interface FlightOfferV2DbRow {
  id: string;
  trip_request_id: string;
  mode: 'LEGACY' | 'AUTO' | 'MANUAL';
  price_total: number;
  price_carry_on: number | null;
  bags_included: boolean;
  cabin_class: string | null;
  nonstop: boolean;
  origin_iata: string;
  destination_iata: string;
  depart_dt: string;   // ISO
  return_dt: string | null;
  seat_pref: string | null;
  created_at: string;  // ISO
}
