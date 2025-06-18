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
