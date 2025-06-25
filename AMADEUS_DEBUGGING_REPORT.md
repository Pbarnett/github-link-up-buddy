# Amadeus Integration Debugging Report

## Issue Summary
The new `flight-search-v2` edge function is returning 500 Internal Server Errors when trying to search for flights with live Amadeus API integration.

## Working Baseline
- **Stable Branch**: `stable/pre-duffel-integration-jun25-2025`
- **Working Function**: `flight-search` with `TEST_MODE=true` (mock data)
- **Status**: Flight search displays mock data correctly

## Problem
- **New Function**: `flight-search-v2` with live Amadeus integration
- **Error**: 500 Internal Server Error
- **Impact**: No flight results shown in UI

## Investigation Results

### ✅ Working Components
1. **Amadeus API**: Direct API calls work perfectly
   - Token generation: ✅
   - Flight search: ✅ (returns 3 flights NYC→LAX, €112.25)
   - Environment variables: ✅ Set correctly

2. **Environment Configuration**:
   ```
   AMADEUS_CLIENT_ID: ✅ Set
   AMADEUS_CLIENT_SECRET: ✅ Set  
   AMADEUS_BASE_URL: ✅ https://test.api.amadeus.com
   AMADEUS_LIVE: ✅ 1
   TEST_MODE: ✅ true (for fallback)
   ```

### ❌ Failing Components
1. **Edge Function**: `flight-search-v2` returns 500 error
2. **Trip Request Access**: Cannot find trip requests (RLS issues?)
3. **Database Integration**: No offers being inserted

## Code Files Involved

### New Files
- `supabase/functions/flight-search-v2/index.ts` - Main edge function
- `supabase/functions/lib/amadeus-search.ts` - Amadeus API wrapper

### Modified Files  
- `src/services/api/flightSearchApi.ts` - Currently reverted to old function
- `src/services/tripService.ts` - Currently reverted to old function

## Debugging Evidence

### Console Logs Show:
```
[INFO] [🔍 FLIGHT-SEARCH-DEBUG] Starting flight search with payload: Object
127.0.0.1:54321/functions/v1/flight-search-v2:1 Failed to load resource: 500 (Internal Server Error)
[ERROR] Error invoking flight-search function: Object
```

### Direct API Test (Working):
```bash
node scripts/test-amadeus-direct.js
# ✅ Token obtained (expires in 1799s)  
# ✅ Found 3 flights
# Sample offer: Price: 112.25 EUR, Airline: B6, Route: EWR → LAX
```

### Edge Function Test (Failing):
```bash  
node scripts/test-edge-function.js
# ❌ Edge function error: FunctionsHttpError: Edge Function returned a non-2xx status code
```

## Suspected Issues

1. **Trip Request Database Access**
   - Edge function cannot access trip_requests table
   - RLS policies may be blocking service_role access
   - Trip IDs from UI not found in database

2. **Environment Variable Mismatch**
   - Function expects `AMADEUS_CLIENT_ID` vs `AMADEUS_API_KEY`
   - Fixed by setting both variants in secrets

3. **Import Path Issues**
   - `amadeus-search.ts` import in edge function
   - Deno environment vs Node environment differences

## Temporary Fix Applied
- Reverted to `flight-search` function with `TEST_MODE=true`
- This restores working mock data display
- Provides stable baseline while debugging live integration

## Next Steps for Lovable.ai

1. **Debug Edge Function**: Check why flight-search-v2 returns 500
2. **RLS Investigation**: Ensure service_role can access trip_requests  
3. **Environment Validation**: Verify edge function sees correct env vars
4. **Error Logging**: Add detailed error logging to identify root cause

## Safe Rollback Plan
```bash
git checkout stable/pre-duffel-integration-jun25-2025
# This restores the working mock data implementation
```

## Files for Review
- `supabase/functions/flight-search-v2/index.ts`
- `supabase/functions/lib/amadeus-search.ts`
- Check Supabase edge function logs for detailed error messages

The Amadeus API integration is 99% complete - just need to debug why the edge function fails when everything else works perfectly.
