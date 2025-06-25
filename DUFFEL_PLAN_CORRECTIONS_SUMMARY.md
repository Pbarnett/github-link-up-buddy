# Duffel Implementation Plan v2 - Corrections Summary

## Critical Corrections Made

### 1. **Payment Architecture (MAJOR FIX)**
**Original Problem:** Plan assumed separate "Duffel Payments" service
**Correction:** 
- Removed `DuffelPaymentsService` class
- Integrated payment directly into `createOrder()` method
- Added support for hold orders and delayed payment
- Updated flow to match actual API behavior

### 2. **Data Models (CRITICAL FIX)**
**Original Problem:** Incorrect TypeScript interfaces
**Corrections:**
- Fixed `DuffelOrder` interface (removed 'tickets', added 'documents')
- Added `expires_at` to `DuffelOffer` (critical for expiration handling)
- Added `passenger_identity_documents_required` flag
- Fixed field names (e.g., 'booking_reference' not 'pnr')

### 3. **Offer Expiration Management (NEW CRITICAL SECTION)**
**Added:** Complete offer lifecycle management
- Offers expire in 5-20 minutes (most critical aspect)
- Added expiration validation before order creation
- Implemented automatic offer refresh when expired
- Added countdown timers and user notifications

### 4. **Auto-Booking State Machine (MAJOR FIX)**
**Original:** Separate payment authorization state
**Corrected:** 
- Removed `DUFFEL_PAYMENT_AUTH` state
- Added `DUFFEL_OFFER_VALIDATION` for expiration checking
- Simplified flow to match actual API pattern
- Payment now happens during order creation

### 5. **Webhook Events (ENHANCEMENT)**
**Added missing webhook types:**
- `order.payment_succeeded`
- `order.payment_failed` 
- `order.ticketed`
- `order.schedule_changed`

### 6. **Error Handling (ENHANCEMENT)**
**Added Duffel-specific errors:**
- `offer_no_longer_available`
- `passenger_identity_documents_required`
- `price_changed`
- `schedule_changed`

### 7. **Rate Limits (CORRECTION)**
**Updated to match API documentation:**
- Search: 120 requests per minute
- Orders: 60 requests per minute
- Other endpoints: 300 requests per minute

### 8. **Database Schema (ENHANCEMENT)**
**Added missing fields:**
- `offer_expires_at` timestamp
- `passenger_identity_documents` JSONB
- `live_mode` boolean flag

## Implementation Impact

### High Priority Changes
1. **Phase 2** - Complete rewrite of payment integration
2. **Phase 3** - State machine redesign 
3. **Phase 4** - Additional webhook event handlers

### Medium Priority Changes
1. **Phase 1** - Database schema additions
2. **Phase 6** - Additional test scenarios
3. **Phase 2** - Offer expiration management

### New Considerations
1. **Identity Documents** - Conditional passport collection
2. **Hold Orders** - Support for delayed payment scenarios
3. **Offer Refresh** - Automatic handling of expired offers
4. **Currency Handling** - Multiple currency fields in responses

## Technical Debt Avoided
- Prevented building incorrect payment service architecture
- Avoided data model mismatches that would require refactoring
- Prevented missing critical offer expiration handling
- Avoided incomplete webhook event handling

## Next Steps
1. Review corrected plan with development team
2. Update any existing Duffel integration code to match corrections
3. Prioritize offer expiration handling in Phase 2
4. Ensure test scenarios cover all corrected workflows

## Files Updated
- `DUFFEL_IMPLEMENTATION_PLAN.md` - Complete rewrite with corrections
- `DUFFEL_IMPLEMENTATION_PLAN_v1_original.md` - Backup of original plan

The corrected plan now accurately reflects Duffel's API behavior and will prevent significant development issues and rework.
