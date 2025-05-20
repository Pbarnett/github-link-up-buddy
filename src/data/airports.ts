
// Define common airport type for consistency
export interface Airport {
  id: string;
  label: string;
}

// NYC area airports
export const NYC_AIRPORTS: Airport[] = [
  { id: "JFK", label: "New York JFK" },
  { id: "LGA", label: "New York LaGuardia" },
  { id: "EWR", label: "Newark" },
];

// Major US airports
export const MAJOR_AIRPORTS: Airport[] = [
  { id: "BOS", label: "Boston (BOS)" },
  { id: "ORD", label: "Chicago (ORD)" },
  { id: "LAX", label: "Los Angeles (LAX)" },
  { id: "DFW", label: "Dallas (DFW)" },
  { id: "DEN", label: "Denver (DEN)" },
  { id: "SFO", label: "San Francisco (SFO)" },
  { id: "SEA", label: "Seattle (SEA)" },
  { id: "MIA", label: "Miami (MIA)" },
  { id: "PHX", label: "Phoenix (PHX)" },
];

// Popular destination airports
export const POPULAR_DESTINATIONS: Airport[] = [
  { id: "MVY", label: "Martha's Vineyard (MVY)" },
  { id: "ACK", label: "Nantucket (ACK)" },
  { id: "ASE", label: "Aspen (ASE)" },
  { id: "PSP", label: "Palm Springs (PSP)" },
  { id: "JAC", label: "Jackson Hole (JAC)" },
  { id: "HTO", label: "East Hampton (HTO)" },
  { id: "APF", label: "Naples, FL (APF)" },
  { id: "CHS", label: "Charleston (CHS)" },
  { id: "EYW", label: "Key West (EYW)" },
  { id: "RNO", label: "Reno (RNO)" },
];
