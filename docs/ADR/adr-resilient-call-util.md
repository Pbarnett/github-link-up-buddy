# ADR: Resilient callWithRetry Utility

## Context
To improve resilience when calling external APIs, Parker Flight has implemented a unified call utility named `callWithRetry`, which includes the following features:
- Retry Logic with Exponential Backoff
- Circuit Breaker Mechanism using Redis
- Idempotency Key Handling for services like Stripe and Duffel

## Decisions
- **Retry Logic**: Built-in exponential backoff ensures transient failures are retried with increasing delays. Configurable retries help address network flakiness.
- **Circuit Breaker**: Built atop Redis to prevent cascading failures and provide feedback on downstream service outages.
- **Idempotency**: Standardized key management to ensure safe retries without duplicate execution of operations.
- **Pre-configured Callers**: Provided out-of-the-box integrations for services like Stripe, Duffel, AWS, and more.

## Results
- Implemented as part of the Parker Flight resillience strategy.
- Supports all major external integrations, with thorough testing coverage and localized to a dedicated utility module.

**Key Files:**
- `/src/utils/call-with-retry.ts`: Main utility file & definition
- `/src/utils/__tests__/call-with-retry.test.ts`: Comprehensive unit tests

This ADR marks a significant step in enhancing feature reliability, aligning with Parker's current infrastructure strategy.

_Signature: Aug 01, 2025_
