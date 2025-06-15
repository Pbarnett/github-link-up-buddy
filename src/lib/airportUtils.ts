
/**
 * Categorize a list of airport codes as NYC airports vs other, returning both arrays.
 */
export function categorizeAirports(
  airports: string[] | null | undefined
): { nycAirports: string[]; otherAirport: string } {
  if (!airports) return { nycAirports: [], otherAirport: "" };
  const nyc = ["JFK", "LGA", "EWR"];
  const nycSelected: string[] = [];
  let other = "";
  airports.forEach((ap) => {
    if (nyc.includes(ap.toUpperCase())) {
      nycSelected.push(ap.toUpperCase());
    } else if (!other) {
      other = ap.toUpperCase();
    }
  });
  return { nycAirports: nycSelected, otherAirport: other };
}
