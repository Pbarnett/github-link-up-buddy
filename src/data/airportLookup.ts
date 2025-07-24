import { NYC_AIRPORTS, MAJOR_AIRPORTS, POPULAR_DESTINATIONS } from './airports';

// Combine all airports into a single array
const allAirports = [
  ...NYC_AIRPORTS,
  ...MAJOR_AIRPORTS,
  ...POPULAR_DESTINATIONS,
];

// Create lookup dictionary from airport code to label
export const airportNames: Record<string, string> = Object.fromEntries(
  allAirports.map(a => [a.id, a.label])
);
