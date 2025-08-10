// Prefetch heavy route bundles on intent (hover/focus)
// Safe to call multiple times; dynamic import caches after first load.

export async function prefetchProfile() {
  try { await import("@/pages/Profile"); } catch (_) { /* ignore */ }
}

export async function prefetchWallet() {
  try { await import("@/pages/Wallet"); } catch (_) { /* ignore */ }
}

export async function prefetchOffersV2() {
  try { await import("@/pages/TripOffersV2"); } catch (_) { /* ignore */ }
}

export async function prefetchDashboard() {
  try { await import("@/pages/AutoBookingDashboard"); } catch (_) { /* ignore */ }
}

export async function prefetchAutoBookingNew() {
  try { await import("@/pages/AutoBookingNew"); } catch (_) { /* ignore */ }
}

export async function prefetchDuffelTest() {
  try { await import("@/pages/DuffelTest"); } catch (_) { /* ignore */ }
}

export async function prefetchTripNew() {
  try { await import("@/pages/TripNew"); } catch (_) { /* ignore */ }
}

export async function prefetchTripOffers() {
  try { await import("@/pages/TripOffers"); } catch (_) { /* ignore */ }
}

export async function prefetchTripConfirm() {
  try { await import("@/pages/TripConfirm"); } catch (_) { /* ignore */ }
}

