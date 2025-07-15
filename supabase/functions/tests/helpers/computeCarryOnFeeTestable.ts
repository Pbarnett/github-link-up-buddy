// Test-safe wrapper for computeCarryOnFee that doesn't execute module-level Deno calls
// This isolates the function logic from the edge function environment setup

export function computeCarryOnFee(offer: Record<string, unknown>): number | null {
  // 🚨 ROLLBACK MECHANISM: Check feature flag for emergency disable
  // In test environment, we'll just return 0 for this check since we can't access Deno.env
  const allowUnknownCarryOn = process.env.ALLOW_UNKNOWN_CARRYON;
  if (allowUnknownCarryOn === "false" || allowUnknownCarryOn === "0") {
    console.log('[carry-on] Feature disabled via ALLOW_UNKNOWN_CARRYON flag, returning 0');
    return 0; // Temporary fallback - treat all as free carry-on
  }

  /* TEMP: capture first sample for schema discovery */
  // Use console.log for compatibility, and stringify carefully for large objects
  if (process.env.DEBUG_BAGGAGE === "true") { // Conditional logging
    try {
        console.log('[carry-on] sample offer (brief):', JSON.stringify(offer, (key, value) => key === "dictionaries" ? undefined : value, 2)?.slice(0,1500));
    } catch (_e) { // eslint-disable-line @typescript-eslint/no-unused-vars
        console.log('[carry-on] sample offer (brief) could not be stringified for offer ID:', offer?.id);
    }
  }

  try {
    if (!offer || !Array.isArray(offer.travelerPricings) || offer.travelerPricings.length === 0) { // Added check for offer and empty travelerPricings
        // console.log('[carry-on] No travelerPricings array or empty for offer:', offer?.id);
        return null;
    }

    // Check all travelerPricings, assuming adult fare is representative or fees are consistent.
    // If multiple travelerPricings, this logic might need refinement based on which one to use.
    // For now, iterate and see if any segment indicates a fee or inclusion.

    let totalCarryOnFee = 0;
    let carryOnInfoFound = false; // Flag to indicate if any carry-on info (fee or included) was found

    for (const tp of offer.travelerPricings as Record<string, unknown>[]) {
        if (!tp || !Array.isArray((tp as Record<string, unknown>).fareDetailsBySegment)) {
            // console.log('[carry-on] Missing fareDetailsBySegment for a travelerPricing in offer:', offer?.id);
            continue; // Skip this travelerPricing if fareDetailsBySegment is missing
        }

        // The fee should ideally be per direction or per offer, not summed across segments unless explicitly additive.
        // Amadeus pricing for baggage is usually per segment or per direction.
        // For simplicity as per brief, this sums fees if found across segments for a given traveler.
        // This might overestimate if fee is per direction & applies to all segments of that direction.
        // Let's refine to find if *any* segment has a determinable fee or inclusion.

        let feeForThisTraveler = 0;
        let infoFoundForThisTraveler = false;

        for (const segDetail of (tp as Record<string, unknown>).fareDetailsBySegment) {
            if (segDetail && Array.isArray((segDetail as Record<string, unknown>).additionalServices)) {
                const baggageService = (segDetail as Record<string, unknown>).additionalServices.find(
                (s: Record<string, unknown>) => s.type === 'BAGGAGE' && /CARRY ON|CABIN BAG/i.test((s.description as string)?.toUpperCase() || '')
                );
                if (baggageService) {
                    // Found carry-on service, this means info is available
                    infoFoundForThisTraveler = true;
                    if (baggageService.amount) {
                        feeForThisTraveler += parseFloat(baggageService.amount as string) || 0;
                    }
                    // If no amount field, treat as free (fee remains 0)
                }
            }
            // Check for included baggage as a sign that info is present
            if (segDetail && (segDetail as Record<string, unknown>).includedCheckedBags && typeof (segDetail as Record<string, unknown>).includedCheckedBags.quantity === 'number') {
                // This is for checked bags, but its presence might mean fare is not "basic"
                 infoFoundForThisTraveler = true; // Found some baggage info
            }

            // If fare basis indicates basic/light, we must have found some info (fee or included)
            // otherwise, it's opaque for carry-on for that segment.
            if (segDetail && /BASIC|LIGHT/.test((segDetail as Record<string, unknown>).fareBasis?.toUpperCase()||'')) {
                // If it's a basic/light fare and we haven't found explicit carry-on info (fee or free),
                // then for this segment, it's opaque.
                // The overall offer becomes opaque if *any* segment is basic/light AND opaque for carry-on.
                if (!infoFoundForThisTraveler) { // no info found yet (neither carry-on service nor included bags)
                    // console.log('[carry-on] Basic/Light fare segment without explicit carry-on fee/inclusion for offer:', offer?.id, 'segment:', segDetail.segmentId);
                    return null; // Opaque for this segment, thus for the offer
                }
            }
        } // end loop for fareDetailsBySegment

        // Accumulate if processing multiple travelerPricings (e.g. find max fee, or first one)
        // For now, using the fee from the first travelerPricing that provides info.
        if (infoFoundForThisTraveler) {
            totalCarryOnFee = feeForThisTraveler;
            carryOnInfoFound = true;
            break; // Found info for one traveler type, assume it's representative
        }
    } // end loop for travelerPricings


    if (carryOnInfoFound) {
        // console.log(`[carry-on] Fee determined for offer ${offer?.id}: ${totalCarryOnFee}`);
        return totalCarryOnFee;
    } else {
        // If no specific carry-on info was found across all travelerPricings and segments
        // console.log('[carry-on] No specific carry-on fee or inclusion info found for offer:', offer?.id);
        return null; // Opaque
    }

  } catch(e) {
    console.error('[carry-on] parse error for offer id:', offer?.id, e);
    return null;
  }
}
