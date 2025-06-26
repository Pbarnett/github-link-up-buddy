# Round-Trip Flight Filtering Implementation

## Overview

Parker Flight now implements comprehensive round-trip filtering to ensure that when users search for round-trip flights, they receive only true round-trip results. This document outlines the enhanced filtering mechanisms implemented across the entire system.

## Key Requirements Implemented

### 1. Include Return Dates in API Searches ✅

**Amadeus API:**
- Always include `returnDate` parameter for round-trip searches
- Example: `GET /v2/shopping/flight-offers?originLocationCode=JFK&destinationLocationCode=LAX&departureDate=2025-07-10&returnDate=2025-07-17&adults=1`

**Duffel API:**
- Include return slice in offer requests for round-trip searches
- Two slices: outbound (origin → destination) and return (destination → origin)

### 2. Use One-Way Filters Appropriately ✅

**Amadeus:**
- `oneWay` parameter is properly handled:
  - `oneWay=false` or omitted for round-trip searches
  - `oneWay=true` for one-way searches
- Filter out offers explicitly marked as `oneWay: true` when searching for round-trips

**Duffel:**
- Round-trip searches include return slice automatically
- One-way searches have only single slice

### 3. Filter Results by Itinerary Count ✅

**Multi-layer filtering implemented:**

#### Layer 1: Explicit One-Way Flag
- Filter out offers marked as `oneWay: true`

#### Layer 2: Itinerary/Slice Count
- **Amadeus:** Round-trip offers must have exactly 2 itineraries
- **Duffel:** Round-trip offers must have exactly 2 slices
- **One-way:** Must have exactly 1 itinerary/slice

#### Layer 3: Route Verification
- Verify outbound routing: origin → destination
- Verify return routing: destination → origin
- Ensures proper round-trip connectivity

## Implementation Details

### Core Filtering Functions

#### 1. Amadeus Round-Trip Filtering
```typescript
// Location: src/utils/roundTripFiltering.ts
export function filterAmadeusRoundTripOffers(
  offers: FlightOffer[],
  searchParams: TripSearchParams
): FlightOffer[]
```

**Features:**
- Layer 1: Filter `oneWay: false` offers
- Layer 2: Ensure exactly 2 itineraries for round-trip
- Layer 3: Verify proper origin/destination routing
- Supports both round-trip and one-way filtering

#### 2. Duffel Round-Trip Filtering
```typescript
// Location: src/utils/roundTripFiltering.ts
export function filterDuffelRoundTripOffers(
  offers: FlightOffer[],
  searchParams: TripSearchParams
): FlightOffer[]
```

**Features:**
- Layer 1: Ensure exactly 2 slices for round-trip
- Layer 2: Verify proper slice routing
- Adapted for Duffel's slice-based structure

#### 3. Database-Level Filtering
```typescript
// Location: src/services/tripOffersService.ts
// Applied in fetchTripOffers function
```

**Features:**
- Checks trip request `return_date` to determine search type
- Applies `.not('return_dt', 'is', null)` filter for round-trip requests
- Works with both `flight_offers_v2` and legacy `flight_offers` tables

### Edge Function Integration

#### 1. Amadeus Search (amadeus-search.ts)
```typescript
// Enhanced round-trip filtering with multiple verification layers
if (searchParams.returnDate) {
  // Layer 1: Filter explicit one-way offers
  offers = offers.filter(offer => !offer.oneWay);
  
  // Layer 2: Ensure exactly 2 itineraries
  offers = offers.filter(offer => 
    offer.itineraries && offer.itineraries.length === 2
  );
  
  // Layer 3: Verify routing
  offers = offers.filter(offer => {
    // Route verification logic
  });
}
```

#### 2. Duffel Search (duffel-search/index.ts)
```typescript
// Round-trip filtering for Duffel offers
if (searchParams.return_date) {
  // Filter to 2 slices and verify routing
  offers = offers.filter(offer => 
    offer.slices && offer.slices.length === 2
  );
}
```

#### 3. Flight Search V2 (flight-search-v2/index.ts)
```typescript
// Enhanced filtering integrated into V2 search
if (tripRequest.return_date) {
  // Multi-layer filtering applied
  filteredOffers = filterAmadeusRoundTripOffers(offers, searchParams);
}
```

## Database Schema Updates

### Enhanced Filtering Support

**flight_offers_v2 table:**
- `return_dt` field for round-trip identification
- Database-level filtering: `WHERE return_dt IS NOT NULL`

**trip_requests table:**
- `return_date` field determines search type
- Used to apply appropriate filtering logic

## Testing Implementation

### 1. Unit Tests
```bash
# Run round-trip filtering tests
node scripts/test-enhanced-round-trip-filtering.js
```

**Test Coverage:**
- ✅ Amadeus API filtering
- ✅ Duffel API filtering  
- ✅ Database-level filtering
- ✅ One-way search handling
- ✅ Edge case handling
- ✅ Malformed data handling

### 2. Integration Tests
```bash
# Run comprehensive filtering test
node scripts/test-round-trip-filtering.js
```

**Validates:**
- End-to-end filtering pipeline
- Database query filtering
- Service layer integration

## Monitoring and Logging

### Filter Logging
```typescript
console.log(`[RoundTripFilter] Amadeus filtering: ${beforeFilter} -> ${filteredOffers.length} offers (removed ${beforeFilter - filteredOffers.length} non-round-trip offers)`);
```

**Tracks:**
- Number of offers before/after filtering
- Filtering effectiveness
- Provider-specific filtering results

### Key Metrics
- **Filter Efficiency:** % of offers removed per filter layer
- **False Positives:** One-way offers in round-trip results (should be 0%)
- **False Negatives:** Valid round-trip offers filtered out

## User Experience Impact

### Before Implementation
- Users might see one-way flights in round-trip search results
- Inconsistent results between search types
- Potential confusion and booking errors

### After Implementation ✅
- **Round-trip searches:** Only true round-trip flights displayed
- **One-way searches:** Only one-way flights displayed
- **Consistent filtering:** All providers use same logic
- **Clear results:** Users see exactly what they searched for

## Provider-Specific Considerations

### Amadeus
- Uses `itineraries` array structure
- Has explicit `oneWay` flag
- Supports `returnDate` parameter
- Requires validation of segment routing

### Duffel  
- Uses `slices` array structure
- Round-trip determined by slice count
- Automatic slice creation for return flights
- Route verification via segment endpoints

### Manual Flow (Amadeus)
- Same filtering logic as automated flow
- Consistent user experience
- Proper pricing confirmation maintained

## Future Enhancements

### Planned Improvements
1. **Multi-city Support:** Extend filtering for complex itineraries
2. **Open-jaw Filtering:** Handle flights with different return cities
3. **Connection Validation:** Verify layover logistics for multi-segment trips
4. **Performance Optimization:** Cache filtering results for repeated searches

### Configuration Options
```typescript
// Configurable filtering strictness
interface FilteringConfig {
  strictRouteVerification: boolean;
  allowOpenJaw: boolean;
  maxLayovers: number;
}
```

## Deployment Notes

### Environment Variables
No additional environment variables required - filtering uses existing API credentials.

### Feature Flags
Filtering is enabled by default and integrated into existing search flows.

### Rollback Plan
If issues occur, filtering can be disabled by:
1. Removing filter calls in edge functions
2. Using unfiltered database queries
3. Reverting to legacy flight search function

## Conclusion

The enhanced round-trip filtering implementation ensures that Parker Flight users receive accurate, relevant search results that match their intended trip type. The multi-layer approach provides robust filtering while maintaining performance and user experience quality.

**Key Benefits:**
- ✅ **Accuracy:** Only round-trip flights for round-trip searches
- ✅ **Consistency:** Same logic across all providers
- ✅ **Reliability:** Multiple validation layers
- ✅ **Performance:** Efficient database-level filtering
- ✅ **User Trust:** Results match expectations

This implementation addresses all requirements outlined in the round-trip filtering specification and provides a solid foundation for future enhancements.
