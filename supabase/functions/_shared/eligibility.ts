// Centralized eligibility helpers
// US-only rollout: block requests that don't appear to originate from the US.
// Primary signal: Cloudflare's cf-ipcountry header or generic x-country/x-country-code headers.
// Fallback: allow if signal is missing (to avoid false negatives in local/dev).

export interface USCheckResult {
  allowed: boolean;
  reason?: string;
  country?: string | null;
}

export function isUSUser(req: Request): USCheckResult {
  const headers = req.headers || new Headers();
  // Common CDN headers
  const cf = headers.get('cf-ipcountry');
  const xc1 = headers.get('x-country');
  const xc2 = headers.get('x-country-code');
  const geoCountry = (cf || xc1 || xc2 || '').toUpperCase();

  if (!geoCountry) {
    // No signal available; default allow in dev/local environments
    return { allowed: true, reason: 'no_geo_signal', country: null };
  }

  if (geoCountry === 'US') {
    return { allowed: true, country: 'US' };
  }

  return { allowed: false, reason: 'non_us_country', country: geoCountry };
}
