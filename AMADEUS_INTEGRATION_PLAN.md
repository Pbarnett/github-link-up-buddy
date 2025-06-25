# Amadeus Integration Implementation Plan

## Current Issues
1. **No real API integration** - Using mock data instead of Amadeus API
2. **Broken test infrastructure** - Edge function tests can't import properly  
3. **Incomplete data mapping** - Missing key Amadeus fields and structures
4. **No integration testing** - Can't verify real API behavior

## Immediate Action Plan

### Phase 1: Fix Core Integration (Priority 1)
1. **Fix the flight search edge function to use real Amadeus APIs**
   - Replace mock `fetchAmadeusOffers` with real API calls
   - Use proper authentication with cached tokens
   - Follow Amadeus Flight Offers Search API exactly
   - Handle real error responses and rate limits

2. **Create integration test with real Amadeus test API**
   - Test with known working route (e.g., NYC to LAX)
   - Verify response structure matches expectations
   - Can be skipped in CI but run manually for validation

3. **Fix data transformation to match Amadeus response exactly**
   - Follow the schemas in docs/AMADEUS_API.md
   - Handle all required fields properly
   - Map price, segments, traveler data correctly

### Phase 2: Test Infrastructure (Priority 2)  
1. **Skip the broken edge function tests for now**
   - Focus on API service layer tests
   - Test the TypeScript integration code that's easier to test
   - Add unit tests for data transformations

2. **Create simple integration test script**
   - Direct API calls to verify live integration
   - Can be run manually to validate changes
   - Documents expected API behavior

### Phase 3: Feature Completion (Priority 3)
1. **Add missing Amadeus features**
   - Price confirmation with Flight Offers Price API
   - Booking with Flight Create Orders API  
   - Proper error handling and retry logic

## Verification Checklist
- [ ] Real API calls work with test credentials
- [ ] Token caching and refresh works properly
- [ ] Response data maps correctly to our database
- [ ] Integration test can fetch real flight data
- [ ] Error handling works for API failures
- [ ] Feature flag controls live vs mock data

## Next Steps
1. Stop working on test infrastructure
2. Fix the real API integration first
3. Create simple integration test
4. Verify with live Amadeus test API
5. Only then worry about comprehensive testing
