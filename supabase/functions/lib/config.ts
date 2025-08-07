// minimal edge-safe config
export const useMock = !process.env.AMADEUS_LIVE;
export const amadeusHost = process.env.AMADEUS_BASE_URL ?? 'https://test.api.amadeus.com';
