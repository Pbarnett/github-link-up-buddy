# Parker Flight: Duffel Integration Implementation Plan (v2)

## Major Changes from v1
- **Fixed Payment Architecture:** Removed separate payment service - payments integrated into order creation
- **Corrected Data Models:** Updated TypeScript interfaces to match actual Duffel API responses
- **Added Offer Expiration Handling:** Critical 5-20 minute offer lifecycle management
- **Enhanced Webhook Events:** Added missing webhook types from API documentation
- **Corrected Auto-Booking State Machine:** Aligned with Duffel's actual booking flow
- **Updated Rate Limits:** Accurate API limits per endpoint type
- **Added Identity Document Requirements:** Conditional passport collection logic

## Overview
Based on comprehensive research and Duffel API documentation analysis, Parker Flight will integrate Duffel as the primary booking provider while maintaining Amadeus for flight search. This plan outlines the complete technical implementation to achieve production-ready auto-booking with Duffel as Merchant of Record.

## Phase 1: Database & Schema Migration (Week 1)

### 1.1 Database Schema Updates
**Priority: Critical - Foundation for all Duffel integration**

```sql
-- Execute migration: 20250625000001_duffel_integration.sql
-- Key additions:
-- - duffel_order_id, duffel_offer_id, offer_expires_at
-- - passenger_identity_documents JSONB field
-- - booking_reference (Duffel PNR)
-- - live_mode boolean flag
```

**Tasks:**
- [ ] Create and test database migration locally
- [ ] Add Duffel-specific columns to `bookings` table
- [ ] Add `offer_expires_at` timestamp for offer lifecycle tracking
- [ ] Add `passenger_identity_documents` JSONB for passport data
- [ ] Create `duffel_webhook_events` table for event tracking
- [ ] Add `provider` enum to distinguish Amadeus vs Duffel bookings
- [ ] Create database functions for Duffel booking management
- [ ] Update TypeScript types to match new schema

**Acceptance Criteria:**
- All existing bookings continue to work (backward compatibility)
- New Duffel fields are nullable and don't break existing flows
- Database functions can create/update Duffel bookings safely

### 1.2 Update TypeScript Interfaces
**Files to modify:**
- `src/integrations/supabase/types.ts`
- Create `src/types/duffel.ts` for Duffel-specific types

```typescript
// Corrected Duffel types based on API documentation
interface DuffelOrder {
  id: string; // ord_00009htYpSCXrwaB9DnUm0
  booking_reference: string; // Airline PNR (not 'pnr')
  live_mode: boolean;
  created_at: string;
  documents: Array<{
    type: 'electronic_ticket' | 'electronic_miscellaneous_document';
    unique_identifier: string;
  }>;
  payment_status: {
    awaiting_payment: boolean;
    payment_required_by: string | null;
    price_guarantee_expires_at: string | null;
  };
  slices: DuffelSlice[];
  passengers: DuffelPassenger[];
  total_amount: string;
  total_currency: string;
  // Note: No 'tickets' array - use 'documents' instead
}

interface DuffelOffer {
  id: string; // off_00009htYpSCXrwaB9DnUm0
  expires_at: string; // Critical: offers expire in 5-20 minutes
  total_amount: string;
  total_currency: string;
  payment_requirements: {
    requires_instant_payment: boolean;
    payment_required_by: string | null;
    price_guarantee_expires_at: string | null;
  };
  passenger_identity_documents_required: boolean;
  slices: DuffelSlice[];
}

interface DuffelPassenger {
  id: string;
  given_name: string;
  family_name: string;
  born_on: string;
  identity_documents?: Array<{
    type: 'passport';
    unique_identifier: string;
    issuing_country_code: string;
  }>;
}
```

## Phase 2: Duffel API Integration (Week 2)

### 2.1 Duffel API Service Layer
**Create: `src/services/duffel.ts`**

```typescript
class DuffelService {
  // Core API methods
  async searchOffers(searchParams: DuffelSearchParams): Promise<DuffelOffer[]>
  async createOrder(offerSelection: DuffelOfferSelection): Promise<DuffelOrder>
  async confirmPayment(orderId: string, paymentIntentId: string): Promise<DuffelOrder>
  async cancelOrder(orderId: string): Promise<void>
  async refundOrder(orderId: string, amount?: number): Promise<DuffelRefund>
  
  // Payment methods
  async createPaymentIntent(amount: number, currency: string): Promise<DuffelPaymentIntent>
  async confirmPaymentIntent(paymentIntentId: string): Promise<DuffelPaymentIntent>
}
```

**Tasks:**
- [ ] Set up Duffel test environment credentials
- [ ] Implement Duffel API client with authentication
- [ ] Add retry logic and error handling (similar to Amadeus)
- [ ] Implement rate limiting per API docs:
  - Search: 120 requests per minute
  - Orders: 60 requests per minute  
  - Other endpoints: 300 requests per minute
- [ ] Create offer search functionality
- [ ] Implement order creation and payment flows
- [ ] Add comprehensive error mapping

**Testing Requirements:**
- [ ] Test with Duffel Airways in sandbox
- [ ] Test payment failures and retries
- [ ] Test offer expiration scenarios (CRITICAL)
- [ ] Test identity document collection requirements
- [ ] Verify webhook signature validation
- [ ] Test hold order payment scenarios

### 2.3 Offer Expiration Management (CRITICAL)
**Key Insight:** Duffel offers expire in 5-20 minutes - this is the most critical aspect of the integration.

```typescript
class OfferExpirationService {
  async validateOffer(offerId: string): Promise<{ valid: boolean; offer?: DuffelOffer; timeLeft?: number }> {
    const offer = await duffel.offers.get(offerId);
    const now = new Date();
    const expires = new Date(offer.expires_at);
    const bufferMinutes = 2; // Safety buffer
    const timeLeft = expires.getTime() - now.getTime();
    const isValid = timeLeft > (bufferMinutes * 60 * 1000);
    
    return { valid: isValid, offer, timeLeft };
  }
  
  async refreshOffer(searchParams: DuffelSearchParams): Promise<DuffelOffer[]> {
    // Re-run search to get fresh offers
    const offerRequest = await duffel.offerRequests.create(searchParams);
    return offerRequest.offers;
  }
}
```

**Tasks:**
- [ ] Implement offer expiration checking before every order creation
- [ ] Add automatic offer refresh when expired
- [ ] Show countdown timers to users during booking
- [ ] Implement offer caching with TTL
- [ ] Add alerts for high offer expiration rates

### 2.4 Enhanced Error Handling
**Critical Duffel-specific errors from API documentation:**

```typescript
const DUFFEL_ERROR_MAP = {
  'offer_no_longer_available': 'This flight is no longer available. Please search again.',
  'validation_error': 'Please check your travel details and try again.',
  'payment_required': 'Payment is required to complete this booking.',
  'passenger_identity_documents_required': 'Passport information is required for this route.',
  'insufficient_funds': 'Payment was declined. Please try a different card.',
  'rate_limit_exceeded': 'Too many requests. Please wait a moment and try again.',
  'price_changed': 'The price has changed. Please review the new total.',
  'schedule_changed': 'The flight schedule has changed since booking.'
};
```

### 2.2 Payment Integration (Integrated with Order Creation)
**Critical Change:** Duffel integrates payment directly into order creation - no separate payment service needed.

```typescript
class DuffelService {
  // Payment is handled during order creation
  async createOrder(orderData: {
    selected_offers: string[];
    passengers: DuffelPassenger[];
    payments: Array<{
      type: 'balance'; // Duffel manages the actual payment processing
      amount: string;
      currency: string;
    }>;
  }): Promise<DuffelOrder>
  
  // For hold orders (payment later)
  async createHoldOrder(orderData: Omit<OrderData, 'payments'>): Promise<DuffelOrder>
  async payForOrder(orderId: string, paymentData: PaymentData): Promise<DuffelOrder>
  
  // Offer expiration management (CRITICAL)
  async validateOfferExpiration(offerId: string): Promise<{ valid: boolean; offer?: DuffelOffer }>
  async refreshExpiredOffer(searchParams: DuffelSearchParams): Promise<DuffelOffer[]>
}
```

**Tasks:**
- [ ] Integrate payment collection into order creation flow
- [ ] Implement offer expiration checking (5-20 minute window)
- [ ] Add hold order support for delayed payment scenarios
- [ ] Create identity document collection for required routes
- [ ] Implement automatic offer refresh when expired
- [ ] Add support for `requires_instant_payment` vs hold orders

## Phase 3: Auto-Booking Engine Redesign (Week 3)

### 3.1 Enhanced Auto-Booking Flow
**Modify: `supabase/functions/auto-book/index.ts`**

Current flow: `Amadeus search → Amadeus book → Stripe charge`
New flow: `Amadeus search → Duffel offer → Duffel book → Duffel charge → Fallback to Amadeus if needed`

```typescript
// Corrected auto-booking state machine aligned with Duffel API
enum AutoBookingState {
  AMADEUS_SEARCH = 'amadeus_search',
  DUFFEL_OFFER_REQUEST = 'duffel_offer_request',     // Create offer request
  DUFFEL_OFFER_SELECTION = 'duffel_offer_selection', // Get specific offer
  DUFFEL_OFFER_VALIDATION = 'duffel_offer_validation', // Check expiration
  DUFFEL_ORDER_CREATE = 'duffel_order_create',       // Includes payment
  DUFFEL_CONFIRMATION = 'duffel_confirmation',       // Wait for confirmation
  AMADEUS_FALLBACK = 'amadeus_fallback',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

// Key changes:
// 1. Removed separate payment auth - payment is part of order creation
// 2. Added offer validation for expiration checking (critical!)
// 3. Added confirmation state for webhook-driven updates
// 4. Simplified flow to match Duffel's actual API pattern
```

**Tasks:**
- [ ] Redesign auto-booking state machine for dual providers
- [ ] Implement Duffel offer matching logic (match Amadeus deals with Duffel offers)
- [ ] Add fallback logic: if Duffel fails, try Amadeus
- [ ] Implement proper state cleanup on failures
- [ ] Add comprehensive logging for debugging
- [ ] Update booking attempt tracking

**Critical Decision Points:**
1. **When to fallback?** Only on Duffel API failures, not payment failures
2. **State cleanup:** Ensure no partial Duffel orders remain after fallback
3. **User notification:** Transparent about which provider was used

### 3.2 Fallback Strategy Implementation
**Create: `src/services/bookingFallback.ts`**

```typescript
class BookingFallbackService {
  async attemptDuffelBooking(tripRequest: TripRequest): Promise<BookingResult>
  async fallbackToAmadeus(tripRequest: TripRequest, duffelError: Error): Promise<BookingResult>
  async cleanupFailedDuffelState(orderId: string): Promise<void>
}
```

**Fallback Rules:**
- **Offer stage failure:** Immediately try Amadeus
- **Payment authorization failure:** No fallback (user card issue)
- **Order creation failure after payment:** Refund via Duffel, then try Amadeus
- **Ticketing failure:** Attempt refund, notify user of failure

## Phase 4: Webhook & Real-time Sync (Week 4)

### 4.1 Duffel Webhook Handler
**Create: `supabase/functions/duffel-webhook/index.ts`**

```typescript
// Complete webhook event types based on API documentation
interface DuffelWebhookEvent {
  id: string;
  type: 'order.created' 
      | 'order.cancelled' 
      | 'order.payment_succeeded' 
      | 'order.payment_failed'
      | 'order.ticketed'
      | 'order.schedule_changed';  // Added missing events
  data: DuffelOrder | DuffelPayment;
  created_at: string;
}
```

**Tasks:**
- [ ] Create secure webhook endpoint with signature verification
- [ ] Implement idempotent event processing (prevent duplicate handling)
- [ ] Add webhook event logging to `duffel_webhook_events` table
- [ ] Update booking status based on webhook events
- [ ] Trigger user notifications on booking status changes
- [ ] Implement webhook retry handling

**Security Requirements:**
- [ ] Verify Duffel webhook signatures
- [ ] Rate limiting on webhook endpoint
- [ ] Proper error responses (200 OK only when processed)

### 4.2 Real-time Status Updates
**Enhance: `src/hooks/useBookingStatus.ts`**

```typescript
// Real-time booking status updates
const useBookingStatus = (bookingId: string) => {
  // Subscribe to booking changes
  // Update UI based on Duffel order status
  // Handle order state transitions
}
```

**Tasks:**
- [ ] Add real-time subscriptions for booking status changes
- [ ] Update UI to show Duffel order states
- [ ] Display PNR and ticket numbers when available
- [ ] Show estimated refund timelines

## Phase 5: User Experience & UI Updates (Week 5)

### 5.1 Payment Method Management
**Create: `src/pages/PaymentMethodsDuffel.tsx`**

```typescript
// UI for managing Duffel payment methods
const PaymentMethodsDuffel = () => {
  // List user's Duffel payment methods
  // Add new payment method via Duffel's card component
  // Set default payment method for auto-booking
  // Handle card expiration warnings
}
```

**Tasks:**
- [ ] Build payment method management UI
- [ ] Integrate Duffel's card collection component
- [ ] Add card expiration warnings
- [ ] Implement default payment method selection
- [ ] Show payment method status (active/expired)

### 5.2 Booking Management Interface
**Enhance: `src/pages/BookingHistory.tsx`**

**New Features:**
- [ ] Show booking provider (Amadeus vs Duffel)
- [ ] Display PNR and ticket numbers for Duffel bookings
- [ ] Add "Cancel Booking" action for eligible bookings
- [ ] Show refund status and timeline
- [ ] Provider-specific booking details

### 5.3 Auto-Booking Setup Flow
**Enhance: `src/pages/TripRequestForm.tsx`**

**Updates needed:**
- [ ] Add Duffel payment method selection for auto-booking
- [ ] Clear messaging about Duffel as Merchant of Record
- [ ] Consent flow for auto-charging
- [ ] Explanation of refund timelines (5-10 business days)

## Phase 6: Testing & Quality Assurance (Week 6)

### 6.1 Integration Testing
**Test Scenarios:**
- [ ] **Happy Path:** Amadeus search → Duffel booking → Payment → Ticketing
- [ ] **Fallback Path:** Duffel failure → Amadeus booking → Success
- [ ] **Payment Failures:** Card declined, expired, insufficient funds
- [ ] **Order Failures:** Duffel order creation fails after payment
- [ ] **Webhook Processing:** All webhook event types processed correctly
- [ ] **Duplicate Prevention:** Idempotency across all operations

### 6.2 End-to-End Testing
**Create: `tests/e2e/duffel-integration.spec.ts`**

```typescript
describe('Duffel Integration E2E', () => {
  it('should complete auto-booking via Duffel')
  it('should fallback to Amadeus on Duffel failure')
  it('should handle payment method updates')
  it('should process webhooks correctly')
  it('should handle refunds properly')
})
```

### 6.3 Performance Testing
**Metrics to track:**
- [ ] Auto-booking completion time (target: <30 seconds)
- [ ] Duffel API response times
- [ ] Webhook processing latency
- [ ] Fallback success rate
- [ ] Payment authorization time

## Phase 7: Production Deployment (Week 7)

### 7.1 Environment Configuration
**Production Setup:**
- [ ] Duffel production API credentials
- [ ] Webhook endpoint SSL certificate
- [ ] Environment variable management
- [ ] Database migration execution
- [ ] Monitoring and alerting setup

### 7.2 Feature Flag Rollout
**Gradual Deployment Strategy:**
```typescript
// Feature flags for controlled rollout
const DUFFEL_ENABLED = process.env.DUFFEL_INTEGRATION_ENABLED === 'true'
const DUFFEL_ROLLOUT_PERCENTAGE = parseInt(process.env.DUFFEL_ROLLOUT_PERCENTAGE || '0')
```

**Rollout Plan:**
- Week 7: 5% of users
- Week 8: 25% of users  
- Week 9: 50% of users
- Week 10: 100% of users

### 7.3 Monitoring & Alerting
**Key Metrics:**
- [ ] Duffel booking success rate (target: >95%)
- [ ] Fallback frequency (target: <5%)
- [ ] Payment failure rate (target: <2%)
- [ ] Webhook processing success (target: >99%)
- [ ] Auto-booking completion time (target: <30s)

**Alerts:**
- [ ] Duffel API downtime
- [ ] High fallback rate
- [ ] Webhook processing failures
- [ ] Payment authorization failures

## Phase 8: Business Operations (Week 8)

### 8.1 Financial Reconciliation
**Create: `src/services/revenueReconciliation.ts`**

```typescript
class RevenueReconciliationService {
  async reconcileDuffelPayouts(): Promise<ReconciliationReport>
  async trackCommissionEarnings(): Promise<CommissionReport>
  async generateFinancialReports(): Promise<FinancialReport>
}
```

**Tasks:**
- [ ] Implement Duffel balance monitoring
- [ ] Set up automated payout reconciliation
- [ ] Track markup/commission per booking
- [ ] Generate financial reports for accounting
- [ ] Monitor currency conversion costs

### 8.2 Customer Support Tools
**Create: `src/pages/admin/BookingManagement.tsx`**

**Admin Features:**
- [ ] View all bookings across providers
- [ ] Initiate refunds for customer service
- [ ] Debug failed bookings
- [ ] Monitor webhook event processing
- [ ] Access booking provider information

### 8.3 Legal & Compliance Updates
**Documentation:**
- [ ] Update Terms of Service (Duffel as MoR)
- [ ] Update Privacy Policy (data sharing with Duffel)
- [ ] Create dispute handling process
- [ ] Document refund timelines
- [ ] Update customer support scripts

## Critical Success Factors

### Technical
1. **Idempotency:** No duplicate bookings under any circumstances
2. **State Management:** Clean fallback with proper state cleanup
3. **Payment Security:** PCI compliance maintained with Duffel
4. **Error Handling:** Graceful degradation and user notifications

### Business
1. **User Experience:** Seamless provider switching (invisible to users)
2. **Financial:** Accurate revenue tracking and reconciliation
3. **Support:** Clear processes for customer service issues
4. **Compliance:** Legal protections with Duffel as MoR

## Risk Mitigation

### Technical Risks
- **Duffel API Downtime:** Amadeus fallback provides resilience
- **Webhook Failures:** Polling backup for critical order updates
- **Payment Failures:** Clear user communication and retry logic
- **Data Inconsistency:** Comprehensive audit trails and reconciliation

### Business Risks
- **Customer Confusion:** Clear communication about Duffel charges
- **Support Overhead:** Comprehensive admin tools and documentation
- **Financial Discrepancies:** Real-time monitoring and alerts
- **Regulatory Issues:** Legal review of MoR arrangement

## Timeline Summary

| Week | Phase | Key Deliverables |
|------|-------|-----------------|
| 1 | Database Migration | Schema updates, TypeScript types |
| 2 | Duffel API Integration | API service layer, payment integration |
| 3 | Auto-Booking Engine | Enhanced state machine, fallback logic |
| 4 | Webhooks & Sync | Real-time updates, event processing |
| 5 | User Experience | Payment management, booking UI |
| 6 | Testing & QA | Integration tests, performance validation |
| 7 | Production Deploy | Feature flags, monitoring, gradual rollout |
| 8 | Business Operations | Financial tools, support systems |

## Next Steps

1. **Immediate:** Execute database migration and begin Duffel API integration
2. **Week 1 Goal:** Complete Phase 1 and begin Phase 2
3. **Key Decision:** Finalize fallback trigger conditions
4. **Testing Priority:** Set up Duffel sandbox environment ASAP

This plan transforms Parker Flight into a production-ready autonomous booking platform with Duffel as the primary booking provider while maintaining Amadeus as a robust fallback option.
