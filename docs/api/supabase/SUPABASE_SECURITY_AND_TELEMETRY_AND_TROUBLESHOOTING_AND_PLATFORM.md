Understood. I’ll now produce a technically detailed implementation guide optimized for execution by an LLM with access to the full codebase. It will include exact instructions, architectural patterns, expected file paths, integration constraints, and feature-flagged rollout behaviors. This will allow the receiving LLM to safely, autonomously, and incrementally implement all critical pieces of the system to enterprise-grade standards.

I’ll notify you when the full implementation specification is ready.


# Technical Implementation Plan for Parker Flight Auto-Booking Pipeline

## Overview and Guiding Principles

This plan describes a step-by-step implementation of Parker Flight’s end-to-end auto-booking pipeline. It covers each stage from flight search through booking confirmation, including new infrastructure integration (Redis, background jobs) and feature-flagged rollout. Emphasis is placed on **file-level changes**, code patterns, and rigorous compliance with safety, observability, and privacy requirements. All new code will be deployed behind LaunchDarkly feature flags so it can be enabled gradually for testing and rolled back instantly if needed. Security and privacy best practices (GDPR “privacy by design” principles like data minimization and pseudonymization) are embedded throughout the development. The goal is a robust, **production-grade** system that an LLM agent (Warp AI) can implement incrementally with high confidence.

Below, we break down the implementation by pipeline stage, followed by cross-cutting requirements (feature flags, schema changes, concurrency, testing, monitoring, CI/CD, and compliance):

## Trip Search Stage Implementation

The **Trip Search** stage initiates the pipeline by finding flight options for a user’s trip criteria. This typically involves an **Edge Function** in Supabase (Deno/TypeScript) that queries external APIs (Amadeus or Duffel) and stores results in the database:

* **File:** Create or update `supabase/functions/flight-search.ts` (or similar). Implement an HTTP-triggered Edge Function that accepts a `tripRequestId` and optional filters (e.g. max price). This function will use the Amadeus API or Duffel offers search. For example, use the provided Amadeus integration (`searchFlightOffers` function) or a DuffelService method (`searchOffers`) to fetch flight offers. Ensure proper error handling and logging around the API call (catch network errors, API errors, etc.).
* **Database:** Insert the retrieved offers into a `flight_offers` table (e.g. `flight_offers_v2`). The code should map API fields to our schema (price, cabin, routes, etc.) as seen in the existing code scaffold. Use parameterized queries via Supabase JS client (already imported in the Edge Function template) to securely insert data. Include the `trip_request_id` foreign key so offers link back to the user’s request.
* **Business Logic:** If the auto-booking feature is **enabled** for this trip (check a flag or a field on the trip request), immediately proceed to the Offer Generation step (e.g. call a follow-up function or queue a background task – see below). If auto-book is **off**, simply store offers for manual user selection. The feature flag gating ensures we don’t impact the current flow for users without the new feature.
* **Feature Flag Use:** At the top of the function (or in the caller), check LaunchDarkly flag (e.g. `auto_booking_enabled`) for this user/environment. For example, use the LaunchDarkly SDK on the **front-end** to decide whether to invoke the new auto-booking search endpoint or the old one. Additionally, as a safety check, the backend can verify a flag via LaunchDarkly’s Node SDK or a config table. (In current code, a `feature_flags` table is read for flags, but we will migrate to LaunchDarkly for dynamic control).
* **Error Handling:** Implement robust error handling. If the flight search API fails or returns no results, log the issue and update the `trip_requests` record (e.g. mark status = "NO\_OFFERS" or store the error message for review). Do not proceed further in the pipeline for that request. All errors should be captured with context (tripRequestId, user) in Sentry for alerting.
* **Testing:** Write **unit tests** for this function by mocking the external API response. For example, simulate an Amadeus response JSON and ensure the function inserts the correct rows. Also test edge cases: no flights found, API timeout, etc. Use Supabase’s recommended testing approach (e.g. run the function locally with `supabase functions serve` and use a testing framework to hit the endpoint). We will include these in the Testing section below.

## Offer Generation Stage Implementation

In the **Offer Generation** stage, the system selects or prepares a specific flight offer to book from the search results:

* **Offer Selection Logic:** Implement logic to pick the “best” offer according to user preferences or the lowest price. This can be done immediately after inserting offers. For example, after the search function stores offers, identify the top offer within the user’s budget or meeting criteria (nonstop, etc.). This could be done in the Edge Function or via a Postgres query (e.g. an SQL `MIN(price_total)` on the inserted offers for that trip\_request).
* **File:** If separating concerns, create a helper module (e.g. `supabase/functions/lib/offer-selection.ts`) with a function `selectBestOffer(tripRequestId)` that queries the `flight_offers` table for that request and returns the best offer record. This keeps selection logic testable independently. Alternatively, integrate this in the search function after storing offers.
* **Marking Selected Offer:** Once an offer is chosen for auto-booking, update the database to mark it. For instance, add a column `selected_offer_id` on `trip_requests` or create a new table `auto_booking_offers` that stores `trip_request_id` and the chosen `offer_id`. This persistent record ensures the monitoring/booking stages know which offer to act on.
* **Feature Flag Gating:** Guard this entire selection-and-next-step under the feature flag. If the flag is off, do not auto-select an offer (leave it for user). If on, proceed. This could be as simple as: `if (!autoBookingEnabled) return;` right after storing offers.
* **Code Pattern – Queue Next Step:** At this point, trigger the **Monitoring/Booking** flow. We don’t want to block the HTTP request waiting for booking (which could take time). Instead, enqueue the next stage:

  * If using **Redis queues**, push a job like `{tripRequestId, offerId}` into a Redis list or stream. For example, use an **Upstash Redis** REST call (ideal for serverless) to POST the job data. Alternatively, invoke a background Edge Function via Supabase’s pg\_net/pg\_cron as described later.
  * If using **Supabase Edge Function Chaining**, we could call another function (like `bookingProcessor`) asynchronously. Supabase doesn’t have a built-in async task queue, so the recommended approach is either the cron/pg\_net or an external worker. We will outline both in the Monitoring Loop section.
* **Testing:** Write unit tests for `selectBestOffer` logic by inserting sample offers into a test DB (or mocking the DB calls) and asserting the correct offer is chosen. Also test that if no offer meets criteria (e.g. all above budget), the function handles it (could keep the trip request in a “waiting” state for monitoring).

## Monitoring Loop Implementation (Pricing/Availability Monitoring)

The **Monitoring Loop** continuously checks for an ideal booking opportunity and triggers the booking when conditions are met. This is critical for “auto-book when price drops below X” or to ensure an offer is still available before booking:

* **Background Job:** Implement a **scheduled background process** that wakes up periodically to evaluate pending auto-booking requests. We will use **Supabase pg\_cron** for scheduling combined with an Edge Function to handle logic. Supabase supports the `pg_cron` Postgres extension and `pg_net` to call HTTP endpoints on schedule.

  * **Cron Schedule:** Decide an interval (e.g. every 10 minutes or 1 hour) for the check. Create a cron job in a migration or via the Supabase dashboard:

    ```sql
    select cron.schedule('auto_booking_check', '*/10 * * * *', $$ 
      select net.http_post(
        url := '<EDGE_FUNCTION_URL>',
        headers := jsonb_build_object('Authorization', 'Bearer <SERVICE_ROLE_KEY>'),
        body := json_build_object('action','monitor').to_jsonb()
      );
    $$);
    ```

    This calls our edge function at the interval. (Store URL and auth in Vault secrets for security as shown in Supabase docs.)
  * **Edge Function:** Create `supabase/functions/auto-book-monitor.ts`. This function, when invoked (by cron or manually), will:

    1. Query the database for all `trip_requests` that are in an “auto-book pending” state (e.g. a boolean flag `auto_book = true` and `status = 'PENDING'` and maybe not expired/cancelled).
    2. For each pending request, retrieve the latest or selected flight offer (from previous search results) or perform a fresh search if we want continuous price updates. A strategy:

       * **Option A:** Re-run the flight search each time to get up-to-date pricing (ensures catching price drops/new flights). This means calling the same API as the Trip Search stage, but perhaps with fewer results or specific date range. Insert new offers if found and update the `flight_offers` table.
       * **Option B:** Use a stored selected offer and call an API to refresh its price/availability. E.g., Duffel offers expire after a short time, but one can call Duffel’s `GET /air/offers/{id}` to check if it’s still bookable. For Amadeus, likely we must do a new search. We can combine approaches: if an offer was selected, first check if it’s still valid; if expired or price changed beyond threshold, do a new search for alternatives.
    3. If the monitoring finds an offer now meets the booking criteria (e.g. price <= user’s max, or simply the first available if user opted “book the best”), then proceed to Booking stage for that trip (call the booking function with the offer).
    4. If no suitable offer yet, simply log the check and leave the trip in pending status for next cycle.
* **Concurrency Control:** Use **Redis locking** to avoid multiple workers booking the same trip. For example, when the monitor function decides to book a trip, it should acquire a lock like `lock:trip:<tripRequestId>` in Redis. Use an atomic SETNX (set-if-not-exists) with expiration (e.g. 30 seconds):

  ```ts
  const lockKey = `trip_lock_${tripRequestId}`;
  const lockAcquired = await redis.set(lockKey, "1", { NX: true, PX: 30000 });
  if (!lockAcquired) {
    console.log(`Trip ${tripRequestId} is already being processed by another worker.`);
    continue;
  }
  // ...perform booking...
  await redis.del(lockKey);
  ```

  This ensures only one instance proceeds to book even if the cron function overlaps or multiple instances run.
* **Progressive Rollout:** The monitoring loop is part of the auto-book pipeline and thus under the same feature flag. The cron job creation itself can be gated by environment/flag (e.g. only enable the cron schedule in staging or for internal projects first). LaunchDarkly can also target specific users or environments – for example, only users with a certain email domain get the auto-booking (internal testing). We will use LaunchDarkly’s progressive rollout to slowly increase the percentage of users with `auto_booking_enabled` as we gain confidence.
* **Testing:** Write **integration tests** for the monitoring logic. For instance, simulate a scenario where a trip is pending auto-book, mock the search results across two cycles (initially above budget, later below budget) and assert that booking gets triggered on the second cycle. This can be done by calling the monitor function in a test with a fake repository or by using a testing DB with known data. Additionally, test the Redis lock behavior by calling the function concurrently in tests (or simulate by calling lock function twice) to ensure double-booking is prevented.

## Booking Stage Implementation

The **Booking** stage executes the actual flight booking (ticket purchase) once an offer is selected and approved. This interacts with Duffel’s Order API (or equivalent in Amadeus if used). Key steps:

* **File/Function:** Implement an Edge Function (or reuse the monitor function) to perform booking. We can create `supabase/functions/auto-book-execute.ts` containing a `bookOffer(tripRequestId, offerId)` function. This function will:

  1. Retrieve necessary data: the flight offer details (either from our DB or by calling Duffel’s GET offer to ensure it’s bookable) and the traveler’s personal information required for booking. Traveler info may come from the user’s profile or a separate passengers table. Ensure we have passenger names, birth dates, and contact info. **Do not log** sensitive details like full names or DOB in plaintext logs (mask or omit them in console logs to protect PII).
  2. Charge Payment: Before calling the external booking API, handle payment via **Stripe**. Using Stripe’s API (server-side), create a Payment Intent for the trip’s price. If we have a saved payment method (the user likely provided a card ahead of time for auto-booking), confirm the Payment Intent. Ensure to use Stripe’s **idempotency key** as well (e.g. use `tripRequestId` or a generated booking attempt UUID as the idempotency key for Stripe) to avoid double charges on retries. If payment fails, log the error, mark booking as failed (`status = FAILED_PAYMENT`), send the user a notification (e.g. email saying “Payment failed, we could not book your flight”), and do not call the flight API. This error path should be captured in Sentry and trigger an alert to the team.
  3. Call Duffel (or Amadeus) Order API to create the booking. Use the **DuffelService** class already scaffolded in the codebase. For example:

     ```ts
     const duffel = createDuffelService();
     const order = await duffel.createOrder(offerId, passengers, totalAmount, currency, idempotencyKey);
     ```

     Here, `passengers` is an array of passenger objects with name, DOB, etc., `totalAmount` and `currency` from the offer, and `idempotencyKey` a unique value (use the same one as Stripe charge or a new UUID) to prevent duplicate bookings if retried. The DuffelService’s `createOrder` method includes robust error handling and will throw a `DuffelApiError` for known issues (e.g. offer expired, insufficient balance).
  4. Handle booking response: If successful, the returned `order` object will contain a `booking_reference` or PNR. Store the booking in our database:

     * Create a new `bookings` table entry (see Schema changes below) with fields like `user_id`, `trip_request_id`, `provider_order_id` (Duffel order ID), `booking_reference`, `price`, etc. Save minimal PII – we can reference the passenger via user\_id or a passenger\_id if we have a separate passengers table. **Encrypt** any sensitive data we must store (for example, if storing passenger names or ticket numbers, consider using Postgres PGCrypto or Supabase’s Vault for encryption at rest).
     * Update the `trip_requests` record status to “BOOKED” and link it to the booking record (e.g. set `booked_order_id`).
     * Release any Redis lock for this trip (if we set one).
  5. If the booking API call fails, implement retry logic and error categorization:

     * The DuffelService already has retry for transient errors (HTTP 500s, network issues) with exponential backoff. It also surfaces specific conditions – e.g., if the offer expired (DuffelApiError where `isOfferExpired` is true), we can respond by marking the current offer invalid and perhaps trigger the monitoring loop to search again immediately. In such a case, update the DB (maybe mark that offer as expired) and schedule a new search (you could even call the search function directly for a quick retry).
     * If the error is a client error (4xx) that is not recoverable (e.g. passenger info invalid), log it and mark the trip as failed (`status = FAILED`). Notify the user (perhaps prompt them to contact support or update info). Do **not** keep retrying in a tight loop for client errors.
     * Make sure all failures are logged to Sentry with enough info (but scrub PII) for developers to debug.
* **Feature Flag:** The actual booking execution is the riskiest part, so ensure it only runs when the feature flag is enabled for that user. If somehow this function is invoked for an unauthorized user (e.g. by manual call), double-check the flag or user role before proceeding to charge and book.
* **Testing:** Use **sandbox/test modes** for external APIs to test this stage end-to-end. For Duffel, use the test API token (the `createDuffelService()` will pick up `DUFFEL_API_TOKEN_TEST` for non-live environment). For Stripe, use test keys. Write **integration tests** that simulate a booking: e.g., feed a dummy offerId and dummy passenger into a stubbed DuffelService that returns a fake order, and assert the DB is updated correctly. Also test failure paths: simulate DuffelApiError for expired offer and ensure the code marks the offer for retry and does not charge the card twice. Use idempotency keys in tests to assert that retrying the function doesn’t double-book or double-charge (you can call the booking function twice with the same inputs and verify the second attempt short-circuits or results in no action because state was updated or Duffel returns duplicate error).

## Communications Stage Implementation

Once a booking is completed, the **Communications** stage sends confirmations to the user and any necessary internal notifications:

* **Email Confirmation:** Utilize the existing **Resend email service integration** (as seen in `lib/resend.ts`) to send a booking confirmation email. We will create an email template for the itinerary and confirmation details:

  * **Template:** e.g. "Your flight is booked: \[Flight details, dates, booking ref]." Use HTML and plain text (Resend supports both) with no sensitive personal data beyond what the user provided (it’s going to the user themselves). Include the booking reference and a summary of the trip (airline, flight numbers, departure/arrival times, price charged).
  * **Attachment:** If available, attach the e-ticket PDF or booking confirmation from the provider. Duffel’s API might not provide a ticket PDF immediately, but it does return a booking reference which can be used to retrieve the ticket. This could be a future enhancement; for now, a text reference is sufficient.
  * **Implementation:** Call the `sendEmail()` function from `resend.ts`. That module already queues and retries emails with a circuit breaker for reliability. For example:

    ```ts
    await sendEmail({
      to: user.email,
      subject: "✈️ Your Parker Flight booking is confirmed!",
      html: renderBookingHtml(user, order),
      text: renderBookingText(user, order)
    });
    ```

    This will enqueue the email and return a Promise that resolves when sending is done (or failed after retries). Since `sendEmail()` is already non-blocking (using an internal queue and processing loop), we can call it and not worry about delaying the response too much. However, we might still want to trigger communications in a **fire-and-forget** manner so that even if email sending takes time or fails, it doesn’t undo the booking. In practice, sending an email can be decoupled completely: e.g., have the booking function insert a record into a `notifications` table (with user, type=BOOKING\_CONFIRMATION, data=orderID) and have another background job or database trigger that picks it up to send email. This level of decoupling increases reliability (so booking success isn’t tied to email success). Given time, we can implement a simple approach now (direct call to sendEmail) and consider a notifications service later.
  * **Logging & Retry:** The `resend.ts` already logs errors and will retry sending up to 3 times with backoff. If the email ultimately fails, it logs a detailed error with context. We should monitor these logs. If needed, we could add a LaunchDarkly flag to disable emails or switch providers quickly (but likely not necessary if using one robust provider).
* **User Notifications (Front-end):** In addition to email, update the front-end state for the user: e.g., when the user opens their dashboard, they should see the trip marked as booked. This will happen naturally if we update the `trip_requests.status` to BOOKED and expose that via our API or Supabase subscription. If using Supabase’s real-time features, the front-end could get a real-time update. Otherwise, ensure the next fetch of trips shows the updated status and booking details.
* **Internal Alerts:** Optionally, send an internal alert for important events. For example, if a booking was made for a high-value trip or any booking for analytics, we might push an event to Slack or an admin email. This could be done via another integration (webhook or email to ops). LaunchDarkly could also be used to trigger internal test alerts when a booking happens during rollout (to closely monitor initial bookings).
* **Privacy Consideration:** Ensure that email content does not inadvertently leak personal data beyond necessity. For instance, do not include full passport numbers or payment info in emails. A booking confirmation typically contains names and flight details which is fine since it goes to the authenticated user’s email. Just be cautious if sending any CC to third parties (likely not in this case).
* **Testing:** Write an **integration test** for the communications stage by simulating a booking in a test environment and verifying that `sendEmail` was called with correct parameters. This can be done by injecting a mock for `sendEmail` in tests. Also verify that the email content functions (`renderBookingHtml`) produce the expected content given a sample order. For end-to-end testing, in a staging environment we can allow actual emails to be sent to a test inbox and manually verify the formatting.

## Cleanup Stage Implementation

The **Cleanup** stage involves post-booking clean-up of data and resources, as well as periodic maintenance tasks to keep the system healthy and compliant:

* **Release Holds/Temporary Reservations:** If our pipeline implemented any “hold” on an offer or payment that needs explicit release when we decide not to book, handle that here. For example, if using Amadeus and we had reserved an offer, we’d cancel it if not booked. In our Duffel integration, we didn’t create an order until booking, so no hold to release. However, Duffel offers expire on their own (usually in minutes). To be safe, if an offer was selected but ultimately not used (user canceled auto-book or it expired), consider explicitly invalidating it:

  * For Duffel, one could call `DuffelService.cancelOrder()` if an order was created and needs cancellation (there is a cancel endpoint shown in DuffelService). If we had created an **order** and need to void it (e.g. user refund scenario), we could use that. If no order was created, no action needed for Duffel.
  * For other APIs or future features: ensure any locks or pending actions are cleaned.
* **Database Cleanup:** Implement periodic removal or archiving of stale data:

  * **Expired Offers:** Flight offers stored in `flight_offers` that are expired (past their `expires_at` or offers older than e.g. 24 hours if not booked) should be deleted or archived regularly. We can create a nightly cron job (using pg\_cron) to delete old offers for which `trip_request.status` is not BOOKED. This keeps the DB lean and removes possibly sensitive data (pricing details) that are no longer needed.
  * **Failed/Cancelled Requests:** For trip requests that ended in failure or were canceled by the user, consider cleaning up related data after some time. For example, if a user cancels an auto-book request, we can remove any associated offers immediately and mark the request canceled.
  * **Personal Data Retention:** To align with GDPR data minimization, plan to delete or anonymize personal data when it’s no longer needed. For instance, after a trip’s travel date has passed by some period, consider removing PII like passenger names from our records (we might keep aggregate stats but not personal info). We can implement a scheduled job to do this. Alternatively, use **pgsodium** or Supabase’s Vault to encrypt PII so that even if kept, it’s protected (and deletable by dropping keys).
* **Logs and Audit Trails:** Ensure that any temporary debug logs (especially those containing sensitive info) are either removed or properly secured after debugging is done. Use log retention policies for our system logs. For example, configure log retention to 30 or 90 days maximum, which minimizes long-term exposure of personal data in logs in compliance with regulations.
* **Resource Cleanup:** If we introduced any background worker processes or external services (like a Node worker for queue), ensure they gracefully handle no-longer-needed tasks:

  * If a trip got booked or canceled, we should remove any pending jobs related to it. For instance, if using a Redis queue, we might store job IDs and remove them. If using the pg\_cron approach with a single scheduler, it checks the status anyway, so a completed trip will simply be skipped. We should still mark the trip as completed so that it’s filtered out.
  * Clear Redis keys that are no longer needed. E.g., if we set a lock or stored some interim data in Redis (like last checked price), consider removing those keys when done to free memory.
* **Testing:** For cleanup tasks, create unit tests for any functions that filter/delete data. For example, a test for the “delete expired offers” SQL or function – insert some dummy offers with old timestamps, run the cleanup, and assert they are gone while newer ones remain. Testing scheduled jobs is trickier but we can simulate by invoking the underlying function directly. We should also test that canceling an auto-booking mid-way (if that feature exists for users) indeed stops the pipeline: e.g., set a trip\_request to canceled and ensure the monitor loop skips it and perhaps cleans any offers.
* **Compliance Checks:** Verify that our cleanup processes align with **GDPR Article 17 (Right to be forgotten)** – if a user requests account deletion, we should immediately remove personal data. This likely means deleting their trip requests, bookings, and any related records. We should implement an admin function or script for this as part of user account deletion, rather than an automatic cron, but it’s worth noting. Make sure backups or analytics data derived from user data are also handled appropriately (beyond scope of this implementation, but mention in documentation for completeness).

## Feature Flags for Progressive Rollout

We will use **LaunchDarkly feature flags** to introduce the auto-booking pipeline safely and gradually:

* **Flag Design:** Create a boolean flag, e.g. `auto_booking_pipeline_enabled`. In LaunchDarkly’s dashboard, provide a clear description (e.g. “Enables the automated flight booking pipeline for users”). Following LaunchDarkly best practices, use a naming convention that clearly indicates scope and effect. For example, prefix with service or feature area if needed: `backend.autoBooking` or similar, and a description of what turning it on does. Avoid vague names. Also consider a separate **kill-switch flag** (`auto_booking_disable_all`) if we want an easy override to shut it off independently of the rollout percentage.
* **Targeting Rules:** Initially target **internal users** only. For example, use LaunchDarkly targeting to enable the flag for certain user emails (e.g. team members) or a test segment. This allows testing in production with real data safely. Once confidence is gained, perform a **progressive rollout**: e.g., enable to 5% of users, then 20%, 50%, etc., using LaunchDarkly’s built-in progressive rollout scheduling. We can also restrict by region or other attributes if needed (for instance, perhaps roll out in one country first to ensure compliance and then others).
* **Flag Implementation in Code:**

  * On the **front-end (React)**: Integrate LaunchDarkly’s JavaScript SDK. Use it to conditionally show the UI for auto-booking. For example, if the flag is off, the UI might only allow manual booking. If on, show options like “Auto-book this trip for me” (which triggers our new pipeline). Also, use the flag to decide which API endpoints the front-end calls. E.g., when user submits a trip request with auto-book enabled, call the new auto-book endpoint/flow. This way, even if the backend code is deployed, it won’t be invoked unless the front-end is flagged on for that user.
  * On the **backend (Edge Functions)**: Since some of our pipeline runs server-side (monitoring, etc.), we will double-check the flag server-side for safety. We have two approaches:

    1. **LaunchDarkly Server SDK:** We could initialize LaunchDarkly SDK in our Node environment (for background worker) or possibly within Deno functions (LaunchDarkly doesn’t officially support Deno, so we might have to use their HTTP API). However, calling out to LaunchDarkly on each function invocation may add latency.
    2. **Proxy via Database Flag:** Simpler: maintain a `feature_flags` table as was in code (or Supabase config). For instance, when we enable the flag for certain users, we also insert a record in `feature_flags` or set a field on the user’s profile (like `auto_book_enabled=true`). The Edge Function can read that. This is less dynamic but ensures the agent has a quick way to check. We can write a script to sync LaunchDarkly targeting (for our internal users) into this table for initial testing. Since ultimately we want full LaunchDarkly control, a better solution is to incorporate a LaunchDarkly **client-side check** only (i.e., trust the front-end to call new pipeline only when flag is on). The risk is minimal if the endpoints are secure, but for belt-and-suspenders, an extra server check is fine.
  * **Cleanup of Flags:** Mark the flag as temporary. Plan to remove the feature flag once the feature is fully launched and stable, to avoid long-term maintenance of dead flags. We should tag the flag in LaunchDarkly as *temporary/cleanup* and create a task to remove flag logic after rollout.
* **Monitoring via Flags:** Use LaunchDarkly’s flag insights and events to monitor flag usage. We can emit custom events (or just watch metrics like how many times the new pipeline is invoked – perhaps funnel that into Datadog). LaunchDarkly also provides an **audit log** of flag changes – ensure that only authorized team members can toggle this critical flag (use LaunchDarkly roles).
* **Kill Switch:** In case of any severe issue, turning the flag **off** globally will revert all users to the old behavior immediately (since front-end won’t trigger auto-book and backend double-checks flag). This decouples risk from deploys – we can deploy the code in off state (dark launch) and turn it on when ready. If anything goes wrong, just toggle off (much faster than a full rollback deploy).
* **Testing Flags:** In staging, test the flag gating thoroughly: e.g., confirm that when flag is off, no new tables are written to and old logic remains, and when on, new logic kicks in. Use LaunchDarkly’s ability to target by user to simulate different scenarios side by side in testing.

## Database Schema and Migration Changes

Implementing the pipeline requires changes to the **Supabase Postgres schema**. All changes will be done via SQL migration files (ensuring we follow Supabase migration best practices and enabling RLS on new tables):

* **Trip Requests Table:** Modify the existing `trip_requests` (or equivalent) table:

  * Add a boolean `auto_book_enabled` (default false) to indicate if the user opted into auto-booking for that request.
  * Add a status field or extend it (if not already) to include states like 'PENDING', 'BOOKED', 'FAILED', 'CANCELLED'. This will track the pipeline progress.
  * Optionally add `selected_offer_id` (UUID referencing `flight_offers`) to link the chosen offer (if using that approach).
  * If needed, add `max_price` or other criteria fields (if users set a max willing price or other auto-book conditions not already in trip\_requests).
  * Ensure to write a migration SQL for this (with default values, etc.). Example snippet:

    ```sql
    alter table public.trip_requests
      add column auto_book_enabled boolean not null default false,
      add column auto_book_status text check (auto_book_status in ('PENDING','BOOKED','FAILED','CANCELLED')) default 'PENDING',
      add column selected_offer_id uuid references flight_offers(id);
    ```

    and similarly any other fields needed. Include comments in the migration for clarity.
* **Flight Offers Table:** If not already present, create a `flight_offers` table (or use the existing `flight_offers_v2` as referenced in the code):

  * This table stores offers returned from search. Ensure it has an `id` (UUID), `trip_request_id` FK, price, currency, whether bags included, cabin, etc (as per code interface). Include `external_offer_id` (e.g. Duffel or Amadeus offer ID) and an JSON `raw_offer_payload` to store the full offer for future reference.
  * If this table doesn’t exist yet, create it with **RLS enabled** (since it contains potentially sensitive info about flights the user is considering). We would allow only the requesting user to select their offers. For instance, an RLS policy: `USING ( auth.uid() = trips.user_id AND trips.id = trip_request_id )` ensuring a user only sees offers for their trip requests. (This assumes we can join flight\_offers to trip\_requests and then to the user's id.)
  * Add an index on `trip_request_id` for performance since we’ll query offers per request often.
  * RLS Policy example (to include in migration):

    ```sql
    alter table public.flight_offers enable row level security;
    create policy "Offer owner can view" on public.flight_offers
      for select using (
        exists (
          select 1 from public.trip_requests t 
          where t.id = flight_offers.trip_request_id 
            and t.user_id = auth.uid()
        )
      );
    create policy "Offer insertion by owner" on public.flight_offers
      for insert with check (
        new.trip_request_id in (select id from public.trip_requests where user_id = auth.uid())
      );
    ```

    This ensures users (authenticated role) can insert offers tied to their own trip\_request and read them. Adjust as needed if using a service role in functions (the function will bypass RLS with service key anyway, which is acceptable for insertion; for selection on client side, RLS is crucial).
* **Bookings Table:** Create a new table `bookings` to record confirmed bookings:

  * Columns: `id UUID PK`, `trip_request_id` FK, `user_id` FK (denormalize user for quick access), `provider` (text, e.g. 'DUFFEL'), `provider_order_id` (text or UUID for Duffel’s order id), `booking_reference` (PNR), `price` and `currency`, `created_at timestamptz default now()`, `status` (in case we allow cancellations or changes; statuses might be 'CONFIRMED', 'CANCELLED', etc.).
  * **PII Columns:** If we need to store passenger details (names, etc.) in the booking, consider separating them or encrypting. Ideally, we avoid storing full DOB or passport numbers. We might store passenger names for reference, but since the user themselves is likely the traveler, we could rely on the user's profile for name. To be safe, any additional passenger info can be stored in a separate table `booking_passengers` if multiple passengers per booking (with minimal info like name, and link to booking\_id). That table should also have RLS (only owner can select).
  * **RLS:** Enable RLS on `bookings` and allow only the owner to `SELECT` their bookings. E.g. `USING (user_id = auth.uid())` for select. Inserts will be done by server (service role), but we can still add an insert policy that only allows if `new.user_id = auth.uid()` for sanity when inserting via user context (though in practice insertion is by service key).
  * Add appropriate indexes (on user\_id, trip\_request\_id).
  * Migration SQL example:

    ```sql
    create table public.bookings (
      id uuid primary key default gen_random_uuid(),
      trip_request_id uuid references public.trip_requests(id),
      user_id uuid references auth.users(id),
      provider text not null,
      provider_order_id text not null,
      booking_reference text,
      price numeric,
      currency text,
      status text default 'CONFIRMED',
      created_at timestamptz default now()
    );
    alter table public.bookings enable row level security;
    create policy "Booking owner can view" on public.bookings
      for select using (user_id = auth.uid());
    create policy "Users can insert own booking" on public.bookings
      for insert with check (user_id = auth.uid());
    ```

    The insert policy allows a user (if ever inserting via client, which is unlikely) to create only their own bookings. Our server functions using service role bypass RLS, but this policy is harmless and adds defense in depth.
* **Other Tables:** If not already in place, consider a `passengers` table for storing traveler info (especially if users can save multiple traveler profiles). This might include `user_id` (owner), `first_name`, `last_name`, `DOB`, etc. If we have it, the auto-booking function can pull from here. Apply strict RLS (only owner can select/update their passengers). Encrypt DOB or other sensitive fields if needed. If not implementing now, ensure the booking function collects needed info via the user’s input and does not persist more than necessary.
* **Audit & Logs Table:** (Optional) Create an `auto_booking_audit` table to log pipeline events for debugging (trip\_id, event, timestamp, message). This can be useful for troubleshooting with the LLM agent – it could write into it at each stage. However, since we have external logging (Sentry, etc.), and to avoid storing PII in DB logs, we might skip a DB audit in favor of external logs.
* **Migration Process:** Each schema change will be scripted in a migration file. We follow Supabase guidelines: use a timestamped filename and include comments on purpose of migration. Ensure to **enable RLS on any new table** before inserting any data. Also ensure all policies cover both `authenticated` and `anon` roles appropriately (most tables here require auth, so use `TO authenticated` in policies; no anon access).
* **Testing Migrations:** After writing migrations, run them in a local or testing Supabase instance to verify they apply cleanly. Also, test that the RLS policies work by trying to read/write as different users. For example, after migration, write a small test that user A cannot see user B’s bookings (attempt a select as A on B’s data and expect 0 results).
* **Security Note:** By enforcing RLS on all new tables and ensuring policies are correctly set (one policy per operation and role as needed), we add a strong security layer. Even if a bug in our API occurred, the DB would prevent unauthorized data access at the lowest level. This is an important compliance measure and follows Supabase best practices.

## Concurrency and Scheduling (Redis Locking & Background Jobs)

To manage concurrency and long-running tasks, we integrate **Redis for locking** and use **background job scheduling** patterns:

* **Redis Integration:** We introduce Redis both as a **lock manager** and optionally as a simple job queue. We recommend using a hosted Redis service like **Upstash**, which is optimized for serverless environments and provides a REST API. This avoids persistent connections issues in edge functions. We will store the Upstash Redis URL/credentials as environment variables or in Supabase Vault (never in code).

  * **Locking:** As described in the Monitoring Loop section, use a Redis key per critical section (like per trip booking) to prevent race conditions. The pattern (SET key NX PX) ensures only one instance gets the lock. We also ensure to release the lock (DEL key) after the critical section. In case the function crashes or times out, the lock will auto-expire after the PX (expire) time to avoid deadlock.
  * **Queue (if needed):** For a more decoupled design, we could use a Redis list or stream as a message queue. E.g., push a message `{"tripRequestId": "...", "action": "book"}` onto a list. Then have a separate **worker** process (could be another Edge Function invoked via cron or a small dedicated Node script) that pops messages and processes them. Given Supabase Edge Functions cannot run indefinitely listening to Redis, a straightforward approach is to stick with the cron calling the monitor which then directly calls booking. That is acceptable for this use-case frequency. If scale grows, we might deploy a Node microservice (e.g. using BullMQ for Redis) to handle a high volume of background jobs reliably.
  * **State Caching:** We may also use Redis to cache intermediate state if needed (for instance, storing last price seen to compare on next iteration, or storing a partial result if a multi-step process). But caution: any cached personal data in Redis should be ephemeral and cleared. Since our pipeline is relatively quick (search to booking in maybe a day or two max), we might not need extensive caching beyond what’s in Postgres.
* **Background Task Patterns:** We leverage **Supabase pg\_cron** for scheduling periodic tasks as described. Cron is ideal for regular checks (monitoring, nightly cleanup). For on-demand asynchronous tasks (like “trigger booking right after search”), we have a few options:

  * Use **pg\_net + pg\_cron’s scheduling with `NOW()`**: Supabase’s cron can schedule one-off tasks by creating a cron job that runs once. For example, after search, you could schedule a cron job 5 minutes later to check that trip (though managing one-off cron entries could become complex).
  * Use **notifies/triggers**: Supabase could emit a Postgres NOTIFY on certain inserts (like new trip\_request) and have a dedicated function listening. However, Edge Functions don’t directly support persistent listeners. Another approach is to use Supabase’s **Realtime** on the client to trigger something – not ideal for server tasks.
  * **Direct Invocation**: Simpler, as implemented above, after search selection we directly invoke the booking logic (either by HTTP call or same function continues). This is synchronous but we can make the HTTP call asynchronously. For example, the search function could do:

    ```ts
    fetch('<AUT_BOOK_ENDPOINT>', { method:'POST', body: JSON.stringify({tripId}) });
    ```

    without awaiting it, so it triggers the next step in background. This is a trick to offload work but needs careful error handling (we might not catch its errors). A more controlled method is to insert a row in a “jobs” table and let the monitor pick it up momentarily.
  * Given that we have the monitor running frequently, it might be acceptable that after an initial search, we simply let the monitor loop pick up the request on the next run (within 10 minutes). If we want immediate action, we can manually call the booking function in the search function if criteria met. This introduces a slight coupling but ensures fastest response (e.g. if an offer is well under budget, why wait 10 minutes?). To compromise, we can design the monitoring function such that it can be invoked directly for a specific trip. For instance, after selecting an offer, call `auto-book-monitor` function with a payload to specifically process that trip immediately (this would do one pass for that trip).
* **Rate Limiting and Throttling:** Ensure that our background loops don’t overwhelm external APIs or our system:

  * The flight search API likely has rate limits. Our monitor should possibly stagger searches. If we have many concurrent auto-book requests, hitting all at once could be an issue. We can mitigate by limiting how many requests we process per cron invocation (e.g. process 5 trips per minute window). If more, either queue them or increase frequency. This can be adjusted as needed.
  * We might implement a simple rate-limit check using Redis: e.g., a counter of API calls per minute and skip or delay if above threshold (Upstash example code and LaunchDarkly or config to adjust if needed).
* **Cron Job Management:** Document the cron schedules and provide a way to adjust or disable them in emergencies:

  * For example, if we set cron jobs via migration, include a way to drop or update them. In LaunchDarkly, we can’t directly toggle cron, but we could put conditional logic in the function that checks a “cron\_enabled” flag and exits immediately if false (as a kill switch for the monitor loop). Alternatively, maintain a config in DB to turn off background tasks if needed. This is an extra safety net.
  * Use descriptive names for cron jobs (like 'auto\_booking\_check' as above) so it’s clear in the DB what they do (they appear in the `cron.job` table).
* **Testing Concurrency:** Simulate concurrent booking attempts in a test environment. E.g., have two instances (threads or function calls) try to book the same trip simultaneously, and verify that one gets the Redis lock and the other aborts gracefully. This ensures our locking works. Also test that the lock expires if something goes wrong (simulate a function crash by not releasing lock and ensure after TTL the other can proceed).
* **Job Failure Handling:** If a background job (monitor or booking) fails due to an exception, it will be logged in Supabase function logs and captured by Sentry. We should ensure the state in DB remains consistent (e.g., if booking failed mid-way, we have a status for that). The next cron run could retry or we might require manual intervention depending on failure type. Perhaps use a retry count field in DB for a trip, and don’t retry infinitely to avoid looping on a permanent error. Given our manual attention during rollout, we can handle these case-by-case, but it’s good to note for future improvement (maybe an exponential backoff for retries stored in DB).

In summary, **Redis** will give us the necessary synchronization primitive for safety, and **pg\_cron** provides a reliable scheduler within our stack for the monitoring and cleanup tasks, without requiring an external job runner. This approach aligns with the serverless architecture and ensures we don’t need a constantly running server process (scaling down complexity).

## Testing and Quality Assurance

We will pursue comprehensive testing at multiple levels to ensure the pipeline’s reliability and safety. The testing strategy includes **unit tests**, **integration tests**, and **end-to-end (E2E) tests**:

* **Unit Testing (Function-Level):** For each functional unit (search, select offer, book, send email, etc.), write unit tests:

  * Use a testing framework like Jest (for Node context) or Deno’s built-in test runner for Edge Functions. We can structure our code to separate pure functions from the HTTP layer to facilitate testing. For example, factor out `searchOffers(params)` logic into a module that can be imported and tested without HTTP.
  * **Mock External Services:** Use dummy implementations or libraries like `nock` (for Node) to simulate HTTP responses from APIs. For Deno, we might provide our own fake fetch in the test environment. Ensure our code allows injecting a custom fetch or client for test purposes (dependency injection can make this easier).
  * Test all branches: success and various failures (e.g., API returns error, Stripe charge fails, Duffel returns expired offer error, email throws exception, etc.). Each test should assert that the function handles the scenario as expected (e.g., returns correct error code, or sets proper DB state).
  * Example: Testing booking function:

    * Arrange: create a fake trip\_request and flight\_offer in an in-memory SQLite or a test schema (Supabase provides a `supabase test` option, or use a test transaction).
    * Stub `duffel.createOrder` to return a known order or throw a DuffelApiError depending on test case.
    * Stub Stripe API calls (perhaps by a Stripe library’s testmode or by mocking the function that creates payment intent).
    * Act: call our `bookOffer()` function.
    * Assert: check that a booking record was inserted when expected, that the trip\_request status updated, that on error the status marked failed and no booking record inserted, etc.
* **Integration Testing (Database & Services):** These tests exercise multiple components together in a controlled environment:

  * We can spin up a local Postgres (Supabase) instance with the migrations applied, and use the **Supabase CLI** to run functions locally. Then write tests that call the HTTP endpoints (e.g., using fetch or supertest) as if we were a client, verifying the end-to-end behavior through database checks.
  * Alternatively, run tests in a staging environment pointing to test API keys for Stripe/Duffel. For instance, use Duffel sandbox: we can actually perform a test booking (Duffel will not charge money in test mode and issues dummy tickets). This would be a full integration test of our pipeline. We should automate this if possible, but even a manual test on staging prior to rollout is essential.
  * Integration test example scenario:

    1. Create a new trip\_request in the test DB with `auto_book_enabled=true` and some criteria.
    2. Invoke the flight search function (either by calling the HTTP endpoint or directly if easier).
    3. Simulate the monitor loop running (or call the booking function directly if an offer is ready).
    4. Verify that at the end, a booking entry exists and an email was (at least attempted to be) sent.
    5. Also verify idempotency: run the booking step again with the same trip (it should detect already booked and not double-create).
  * Use a clean database state for each test to avoid interferences. Tools like `supabase reset` (with Snaplet or so) might help, or wrap tests in transactions that rollback.
* **End-to-End Testing (User Journeys):** Use a browser automation tool (like **Cypress** or **Playwright**) to simulate actual user behavior on the front-end against a staging environment:

  * Write a test where a user fills out a flight search form, enables "auto-book my trip", enters payment details (Stripe test card), and submits.
  * The E2E test then polls or waits for some indication of booking (maybe the UI changes to “Booked!” or an email is received in a test inbox).
  * Verify that the user’s trip is marked booked in the UI and that a confirmation email was received (many email APIs like Resend have webhooks or you can use a service like Mailosaur for testing emails). Alternatively, configure the test environment to send emails to a fake SMTP that our test can inspect.
  * These tests ensure the whole pipeline works in concert: front-end flag gating, back-end processing, and user communication.
* **Test Coverage:** Aim for high coverage on critical business logic. Especially focus on:

  * Offer selection algorithms (no edge case should pick the wrong flight).
  * Financial transactions (charging the correct amount, exactly once).
  * Security checks (ensure that if a user without permission tries something, they are forbidden – e.g., if someone tried to call our auto-book endpoint for a trip that isn’t theirs, RLS and auth logic should prevent it).
  * Error scenarios that could impact users (like partial failures). For example, simulate a case where payment succeeds but booking fails – our system should handle refunding or notifying properly. (In practice, if Duffel fails after payment success, we might need to refund via Stripe – we should add logic for that: if createOrder throws after a payment capture, we call Stripe to refund the PaymentIntent. Write a test for this flow too).
* **CI Integration:** Incorporate tests into the CI pipeline (GitHub Actions):

  * Include jobs for unit tests (running quickly on every push) and perhaps nightly integration tests (which might call external APIs and thus be slower or require API keys). We can use environment secrets in CI for test API keys to run those integration tests safely.
  * Define separate steps in the workflow: e.g., `npm run test:unit` and `npm run test:integration`. For integration tests that use a database, perhaps start a ephemeral Postgres service in CI or use Supabase’s test harness.
  * Set up **reporting**: collect coverage reports, fail the build if coverage drops below a threshold.
* **Manual and Beta Testing:** In addition to automated tests, we will do a closed beta with internal users (enabled via feature flag). They will use the feature in real-world scenarios and we will gather feedback and monitor for any issues not caught by tests (e.g., unusual data from APIs, or UI/UX issues).
* **Test Data Management:** Use strictly **test data** in any environment connected to real APIs: e.g., use a dedicated Stripe test account and Duffel test mode. Ensure no real credit cards or live bookings happen during testing. This protects users and avoids costs. Mark any test bookings clearly (Duffel allows adding metadata – we set `metadata.testing = true` for example – see the createOrder where we include `integration_version`).
* **GDPR and Privacy Testing:** It’s easy to overlook, but we should also test our compliance features. For instance:

  * Create a dummy user with some data, then simulate a “delete user” action (perhaps directly via SQL or an admin API if available) and run our cleanup to ensure their bookings and personal data are removed.
  * Verify that we are not inadvertently logging sensitive info: scan through logs in testing to confirm (this can be manual). For example, after a test run, search the function logs for occurrences of email addresses or names. Our logging should have redacted or none of that. This can even be automated with a script that checks log outputs for PII patterns.
* **Performance Testing:** While not explicitly requested, consider testing the performance of the pipeline: E.g., how long from search to booking completion on average. We can simulate a batch of requests to see if any part is a bottleneck. The monitoring loop interval is a factor in booking speed; if users expect booking within minutes of finding a price, ensure our default interval meets that (or adjust with on-demand triggers). We can adjust after initial rollout based on performance metrics.
* **Security Testing:** Use tools or scripts to test common security issues:

  * Ensure that without proper auth, none of the endpoints do anything (Supabase functions by default require an auth token or anon key – verify RLS prevents data leaks).
  * Try to access another user’s trip by altering IDs in requests to confirm access is denied.
  * Consider running an automated vulnerability scan (some CI integration or using OWASP ZAP against the dev deployment) to catch any obvious holes.

By implementing this multi-layer testing strategy, we ensure that when the feature flag is gradually turned on, the functionality has been vetted thoroughly, reducing the risk of failures in production.

## Logging, Alerting, and Monitoring

To achieve **maximum observability**, we will implement comprehensive logging and integrate with monitoring tools (OpenTelemetry, Sentry, Datadog):

* **Structured Logging:** All server-side stages will emit structured logs for key events. Use consistent log formats (JSON if possible) with fields like `tripRequestId`, `stage`, `level`, `message`. For example:

  ```ts
  console.log(JSON.stringify({
    level: 'info',
    stage: 'booking',
    tripRequestId,
    msg: 'Booking succeeded',
    orderId: order.id
  }));
  ```

  Supabase Edge Functions automatically capture `console.log` output. By structuring it, we can later feed these logs to Datadog or another aggregator for analysis. (Supabase provides log retrieval; we can also set up Logflare or Datadog log ingestion.)
* **Sensitive Data in Logs:** **Never log PII or payment data in plaintext.** Scrub or omit such fields. For instance, do not log full passenger names or emails – or if needed, log only a hash or an ID. In our code, ensure any `console.error` printing caught exceptions will not dump entire objects that may contain PII. For example, our email sending error logs currently print `emailData` which includes recipient email – we might want to remove or mask the `to` field in that log to be safe. We can modify that to log only the domain or a masked version of the email.
* **Sentry Integration:** Use **Sentry** for error tracking and performance monitoring:

  * Initialize Sentry in each Edge Function (as per Supabase docs) using the Deno SDK. Set the DSN via env variable. Configure Sentry to capture exceptions (we can wrap our main handler in a try/catch that calls `Sentry.captureException(e)` as shown in the docs).
  * Attach context to errors: for example, Sentry tags for `tripRequestId`, feature flag status, environment (staging/prod). This will help diagnosing issues quickly. The example shows tagging region and execution\_id (Supabase-specific); we can add our own tags similarly.
  * Enable Sentry’s performance tracing for functions if possible. The Deno SDK supports setting a `tracesSampleRate`. We can capture the execution time of each stage and even nest spans (for example, one span for "flight search API call", another for "DB insert", etc.). This might require the full OpenTelemetry setup, but as a simpler approach, Sentry can record the function invocation duration as a transaction if configured.
  * Set up Sentry Alerts: define alert rules (e.g., if any **booking failure** error occurs, notify engineering Slack/email immediately; if error rate > X in an hour, flag regression).
* **Datadog Integration:** Leverage Datadog for metrics and possibly traces:

  * We can send custom metrics to Datadog via their API or using OpenTelemetry exporters. Key metrics might include: number of auto-bookings attempted, number succeeded, number failed, time from request to booking, etc. These help measure the feature’s performance and business value.
  * If we deploy a Node service (for background tasks), we can run the Datadog APM agent there to automatically capture metrics and traces. For serverless functions, Datadog has a Lambda/Edge integration, but in Supabase’s case, we might rely on custom metrics.
  * Logs: We can set up a log forwarding from Supabase to Datadog (Supabase can integrate with third-party logging by APIs). If that’s not straightforward, we could consider using the `datadog-metrics` npm package to send events within the function (though that might add overhead in each run). A better approach is likely to export logs to a storage or queue and have a separate process ship them.
  * Create Datadog **dashboards** for the pipeline: e.g., a graph of bookings per day, failure rate, average price booked, etc. Also, a dashboard for system health: e.g., function invocation count and duration (Supabase might expose some metrics, or we gather via logs).
  * Set up **Datadog monitors**: e.g., alert if the booking failure rate goes above 5%, or if no bookings have succeeded in X time (which could indicate a breakage), or if the monitor function hasn’t run (maybe track logs/metrics to ensure cron jobs are firing).
* **OpenTelemetry Tracing:** To get end-to-end traces across the system (from front-end to back-end):

  * On the React front-end, use an OpenTelemetry JS client or simply use Sentry’s performance monitoring to mark the user action. It can pass a trace ID along when calling the API (maybe via a header).
  * In the Edge Function, if we capture the incoming trace ID (or some correlation ID), we can continue the trace. Since full OpenTelemetry setup in Deno might be complex, a simpler method: generate our own **correlation ID** for each auto-booking pipeline instance (could be the `booking_attempt_id` UUID we pass to Duffel). Include this ID in all log messages and in Sentry breadcrumbs. This way, even if we can’t have a single distributed trace view, we can search logs/Sentry by that ID to piece together the journey.
  * If time permits, explore OpenTelemetry SDK for Node in the background worker (if any) and use a collector to view traces. But initial focus should be Sentry which already gives us stack traces and some performance data.
* **Monitoring Cron & Queue:** We should monitor that our background processes are running as expected:

  * The `auto-book-monitor` function should log when it runs and how many requests it processed. If we notice it not running (e.g., no log entry in X minutes), that’s an issue. We can set an alert for “no cron execution in last 15 minutes” (maybe by a heartbeat metric). One way is to have the function update a `last_run` timestamp in a metadata table or even ping a Datadog heartbeat monitor.
  * Similarly, ensure any external worker is monitored (if we had one, we’d use something like PM2 or a simple uptime check).
* **Analytics:** From a product perspective, we might track usage: how many users enabled auto-book, how many bookings made automatically, savings, etc. This could be done via an analytics service or simply by querying our DB and logs. Not a part of observability per se, but worth noting we will gather these stats (and ensure any analytics also comply with privacy).
* **Audit Logging:** For security, keep an audit of important actions:

  * We can rely on Sentry for errors and Datadog for metrics, but for actions like “booking confirmed for trip X for user Y”, we might want that recorded in a durable place (database or at least retained logs). Possibly the `bookings` table itself suffices as an audit of bookings.
  * LaunchDarkly toggles are tracked by LaunchDarkly’s own audit log (who toggled when) – no need to duplicate that, just ensure the team reviews it after changes.
* **Retention and Privacy:** Configure log retention according to compliance:

  * If using Datadog, set logs retention to a reasonable period (e.g., 15 days for detailed logs, or sanitize them) to minimize long-term storage of user data in logs.
  * We might also use log redaction features (Datadog allows defining patterns to hash or remove). For example, set rules to redact anything that looks like an email or credit card number from any logs that might slip through.
  * In Sentry, enable PII scrubbing. Sentry SDK by default will sanitize things like credit card numbers and passwords. We should double-check and add any custom field (e.g., if we send user name or email as context, mark those as sensitive so Sentry doesn’t store them unless we allow). Sentry’s data scrubbing settings should be configured to be safe by default (remove any values that match common PII patterns).
* **Alerting Strategy:** Summarizing key alerts to set up:

  * **On-call Alert** for any unhandled exception in booking stage (since that could affect purchases). This can be via Sentry (set up a high-severity alert for errors in the booking function).
  * **Payment failures**: alert if we see more than e.g. 3 payment failures in a day (could indicate a Stripe issue or user issues).
  * **Offer not found**: if our pipeline frequently can’t find offers for auto-book requests (could alert product team that user criteria too strict or supply issue).
  * **Latency issues**: if booking process takes too long (maybe > some threshold), log it. Possibly send that to an APM to see where the delay is (external API vs our processing).
  * **Security alerts**: any suspicious behavior (like multiple booking failures that could hint at fraud or a bug). Also monitor admin logs (if any admin toggles something or uses service key in an unusual way – though that’s more on Supabase if someone leaked service key, etc.).
* **Dashboard for Ops:** Create a simple “Auto-Booking Ops” dashboard that shows active auto-book requests, their statuses, and recent activity. This could be a read-only page in our admin or simply a set of SQL queries we can run. During rollout, engineers can watch this to verify everything is functioning. (E.g., query trip\_requests where auto\_book\_enabled to see how many are pending vs booked vs failed.)
* **Feedback Loop:** Use the logs and metrics we gather to iterate. For example, if logs show many “offer expired” errors, maybe we need to shorten the monitor interval or book faster. If we see “payment declined” often, maybe notify users earlier about updating their card.

By implementing these measures, we ensure that once the feature is live, we have full visibility into its operation and can quickly respond to any issues, fulfilling the “maximum safety and observability” goal.

## CI/CD Pipeline Integration

Our CI/CD (GitHub Actions) process will be updated to accommodate the new auto-booking components and ensure safe deployments:

* **Continuous Integration (CI):** On each pull request and merge to main, the CI pipeline will run:

  1. **Linters/Formatters:** Run ESLint, Prettier, etc., on the new code (Edge Functions and any front-end code) to maintain code quality.
  2. **Type Checking:** Ensure TypeScript passes type checks across the repo, including the new functions.
  3. **Unit Tests:** Execute the full unit test suite. All new tests (for each pipeline stage function) must pass. Set up coverage enforcement as noted.
  4. **Integration Tests:** Possibly run a subset of integration tests in CI (maybe those that can run quickly with mocks). For full integration (with external API calls), it might be best to run those nightly or on a specific trigger, not every push (to avoid hitting API limits). We can have a separate workflow for nightly full integration tests using a staging environment.
  5. **Static Security Analysis:** Incorporate any security scanners (like DependaBot for dependency vulns, maybe ESLint security rules, or a tool like Snyk) to catch common issues early. This is especially relevant since we handle payments and personal data.
* **Continuous Deployment (CD):** Once changes are merged:

  * **Migrations Deployment:** Use Supabase migration workflow. For example, if we push to main, a GitHub Action can run `supabase db push` or apply the SQL migrations to the production database. This should happen before the new code is live to avoid runtime errors (we will deploy code with feature off, but still good to have DB ready). We must ensure backward compatibility: adding columns and tables is fine (non-breaking), but if we ever changed existing schema, we’d do it in a backward-compatible way given the flag (e.g., keep old columns until feature fully migrated).
  * **Edge Functions Deployment:** After database is migrated, deploy the new/updated Edge Functions. Supabase CLI can deploy functions with `supabase functions deploy <name>`. We will script this in CI for each function we created or changed. E.g., `supabase functions deploy flight-search`, `... deploy auto-book-monitor`, etc. Alternatively, since Supabase might not allow selective deployment easily, we can deploy all functions or use their container deploy mechanism. We should only deploy to production on code merges that have passed tests and possibly after staging verification.
  * **Front-End Deployment:** The React app (if any changes for feature) will be built and deployed (perhaps to Vercel or Netlify or S3 depending on Parker’s setup). Ensure that the LaunchDarkly client ID for production is configured and the app is initializing it early (so flag checks are ready).
  * **Environment Config:** Update environment variables for new services:

    * Add `REDIS_URL` (Upstash endpoint) and any auth token to the environment (as secrets in GitHub Actions and in Supabase Function environment config).
    * Add LaunchDarkly SDK keys (for front-end, a client-side ID; for backend, a server SDK key if used). These must be kept secret (the client-side ID is okay to expose in front-end code, but the server secret is not).
    * Ensure `STRIPE_API_KEY` (test and live) are present in the environments where needed.
    * Ensure `SENTRY_DSN` is set for functions to send logs.
    * All secrets should be managed via the platform’s secure storage (Supabase has a secrets manager for functions or we use environment variables configured via CLI).
  * **Feature Flag Defaults:** On initial deploy, the LaunchDarkly flag should be off for all users (so it’s effectively dark). Our code expects it that way. Verify that the default rule in LaunchDarkly is set to false in production. We can have it true in staging (for easier testing).
  * **Post-Deploy Checks:** After deployment, run a quick smoke test:

    * Possibly trigger a known test trip through the pipeline in a non-production environment or with a test user in production (if allowed) to ensure everything is wired correctly.
    * Verify that migrations applied (e.g., the new tables exist in prod).
    * Verify that functions are responding (Supabase function health-check endpoints).
* **Rollbacks:** Our primary rollback mechanism is the feature flag (turn off if something goes wrong). However, we also plan for code rollbacks:

  * If a severe bug is found that can’t be mitigated by the flag (e.g., it affected even flag-off behavior, or a migration issue), we should be ready to roll back the deployment. In GitHub Actions, keep the ability to deploy a previous commit’s functions or DB state:

    * Maintain backward-compatible migrations: Since we add columns and tables, rolling back code to before those exist is fine (old code just doesn’t use new tables; the presence of extra tables is harmless).
    * If we had a migration that changed behavior (none planned that break old flows), we’d need a rollback migration. We can prepare `down` scripts for complex changes if necessary.
  * Version control: Tag releases so we can quickly checkout a last known good state. Possibly have a GitHub Action to deploy a specific git tag to Supabase if needed.
  * In LaunchDarkly, if we needed to **hotfix** something, one strategy could be to use a second flag to toggle a sub-feature. But ideally, we handle via code fix and redeploy behind the main flag.
* **Staging Environment:** It’s implied but worth stating: use a staging Supabase project for testing. The CI/CD could deploy to staging on every merge to a develop branch, for instance, run tests, and then deploy to prod on main. If Parker Flight doesn’t have separate staging infra, we can simulate it by using the flag to simulate staging (like enabling for internal users as “staging”). But a separate Supabase instance would be safer. Given GDPR, perhaps have staging data anonymized.
* **GitHub Actions Workflows:** We will create or update YAML files:

  * `ci.yml` for running tests on PRs.
  * `deploy.yml` for deploying migrations and functions. This might trigger on push to main. Steps might include:

    * Checkout code.
    * Set up Supabase CLI (install it).
    * Authenticate (using a service token for the Supabase project – store it in GitHub secrets).
    * Run `supabase db migrate` or `supabase db push` to apply migrations. Use caution: ensure the migration is run in a transaction or with `SAFE` migrations if possible. Supabase migrations are typically safe if written correctly.
    * Run `supabase functions deploy --project-ref $PROJECT_REF --no-verify-jwt` for each function. Alternatively, build a Docker container with the Edge Functions if Supabase requires (as of now CLI can deploy from local files).
    * Possibly clear Edge Function cache if needed (Supabase might cache function instances; not usually an issue on deploy).
    * Invalidate any front-end cache if needed (e.g., if we use a CDN for the React app, purge it).
    * Post a success status or in case of failure, alert the team (we can integrate Slack notifications in the workflow for deployment status).
  * Also include a manual trigger (workflow\_dispatch) for emergency deploy or rollback if needed.
* **Dependency Management:** Ensure our `package.json` includes any new dependencies (e.g. LaunchDarkly SDK, Redis client, etc.) and that those are installed in CI environment. Since Edge Functions run in Deno, adding NPM deps (like `npm:resend` and potentially `npm:launchdarkly-node-sdk`) is done via dynamic imports. We should test that in staging (Deno can import npm packages now, which Supabase supports). The CI should run a build or bundling step if required by Supabase (Supabase might not require bundling – it handles TS directly).
* **Linting/Formatting**: Adhere to any existing lint rules. For example, if there’s an ESLint config that forbids console logs in front-end, we may allow them in backend. Possibly mark our debug logs appropriately or use a logger library which can be configured per environment.
* **Secrets in CI:** Double-check that no secrets are logged in CI output. Use GitHub’s masking for known secret values. When running tests that use keys, ensure output doesn’t print them. Usually, printing env variables is not done, but be mindful if any error dumps them.
* **Continuous Improvement:** Add the new pipeline components to our **monitoring of CI** – e.g., if tests for auto-booking start failing frequently, that should block deployments. We treat those tests as gatekeepers for quality.
* **Documentation and Runbooks:** As part of CI/CD, update README or internal docs for how to deploy, how to manage flags, etc. If an LLM agent or developers are to operate this, they should have clear instructions (maybe an `ops.md` with steps to toggle flags or run migrations). This isn’t code, but including it ensures maintainability.

In summary, CI/CD will ensure that our auto-booking pipeline is delivered to production in a controlled, reversible manner. Every change will be tested and feature-flagged, and deployments can be frequent (since the feature is off until ready, we can merge incremental progress without affecting users). This aligns with trunk-based development and feature flag best practices, enabling rapid yet safe iteration.

## Security, Privacy, and Compliance Considerations

Throughout the implementation, we must uphold **GDPR and U.S. privacy laws**, as well as general best security practices. Here we consolidate these considerations:

* **Data Minimization:** Collect and store only data necessary for the booking. For example, we need passenger name and DOB to book a flight, but we do **not** need to store the passenger’s passport number or other extraneous info in our system. We should avoid storing any sensitive personal data that we didn’t explicitly plan for. If in future we handle passport or TSA information, treat it with highest security (encrypted at rest and in transit).
* **Personal Data Handling:** All personal identifiable information (PII) must be protected:

  * **In Transit:** Supabase and our APIs are all HTTPS, which covers data in transit. Ensure Stripe and Duffel SDKs use HTTPS (they do by default).
  * **At Rest:** Enable encryption for sensitive fields. Supabase allows column-level encryption (via extensions like pgcrypto or pgsodium). For instance, if we store a passenger’s DOB or phone, consider encrypting those columns with a key that only the server knows (we can use Supabase’s Vault or a fixed key from env). Or store hashed values if we only need to compare, though likely we need actual values for bookings, so encryption is better.
  * **In Logs:** Do not log personal data. This was emphasized before – implement scrubbing of logs and short retention. According to GDPR, logs that contain personal data should be encrypted or anonymized. We can comply by either not logging PII at all (ideal) or by storing logs in an encrypted store (if logs go to Datadog, ensure their storage is encrypted at rest and access is restricted).
  * **Retention:** Implement retention policies: e.g., auto-delete or anonymize user’s trip and booking data after a certain period post-travel (unless needed for legal or user reference). A possible policy: 1 year after trip completion, purge PII (keep maybe high-level stats). This needs alignment with business needs and is something to document and possibly automate with a cron job (as noted in Cleanup).
  * **User Rights:** Ensure we can fulfill user rights such as deletion and data export:

    * Deletion: If a user requests account deletion, we must delete their trip\_requests, flight\_offers, bookings, etc. Because data is spread across tables, consider a Supabase Edge Function to handle this by user ID. And remove from third-party systems: e.g. if their data was sent to Duffel (the airline will have it, which is outside our system’s immediate control – in GDPR terms, the airline via Duffel might be another controller; our privacy policy should clarify that). At least within our DB and logs, wipe it.
    * Access/Export: We should be able to retrieve what data we have on a user if they ask. With our structured DB, that’s feasible (just gather their records). Possibly an admin query or function can output JSON for them.
* **Consent and Transparency:** Users must explicitly opt-in for auto-booking (which they do by toggling that feature per trip, presumably). Ensure that in the UI we explain what that means: that their provided payment will be charged automatically and their personal data will be used to book a ticket on their behalf. This covers informed consent for using their data in this way. For GDPR, that likely falls under contract fulfillment or consent. For U.S. (CCPA), ensure it’s covered in privacy policy and allow opt-out (not sell data, etc., which we don’t).
* **Payment Security:** We rely on **Stripe** for handling credit card data, which keeps us out of PCI-DSS scope largely. Never store raw card numbers or CVC in our database or logs. We should only store Stripe’s payment method IDs or customer IDs. Those are not sensitive by themselves (they can’t be used outside our Stripe account). Even so, protect Stripe secret keys and do not expose them. The Stripe webhooks (if any, e.g. if using webhook to confirm payment events) should be secured with signing secret. Likely for auto-book we might not need webhooks if we confirm synchronously.
* **API Keys and Secrets:** Secure all API keys (Duffel, Amadeus, LaunchDarkly, Resend) via environment variables. In the code or config:

  * Do not commit secrets to Git. Check that no secret is present in the code snippet (the DuffelService uses `Deno.env.get`, which is correct).
  * Use Supabase Vault for storing secrets used in SQL (like the cron job HTTP auth header uses anon key stored in Vault). We have done that for cron scheduling.
  * Rotate keys if needed and update env securely (have a documented process).
* **Row-Level Security (RLS):** As detailed, we enabled RLS on new tables. This is a crucial security layer. Test the policies to ensure no data leakage. For example, try to craft a request for another user’s data via the API – it should return nothing. This guards against both programming mistakes on the client and malicious attempts.
* **LaunchDarkly Safeguards:** Treat feature flags that can alter data flow as sensitive:

  * Ensure only authorized personnel can toggle `auto_booking_pipeline_enabled` in production (LaunchDarkly has role-based access – we can restrict who can edit prod flags).
  * Use flag prerequisites or multiple flags if needed to avoid accidental full enable. For instance, one technique is to have a kill-switch flag that always evaluated and needs to be ON for anything to happen. That way two things have to be wrong for an accidental enable. But this might overcomplicate; careful permission and using the scheduling for rollout is probably enough.
* **Third-Party Compliance:** We must ensure that using Duffel/Amadeus and sending them user data (names, etc.) is covered under our privacy policy and their GDPR compliance (Duffel is GDPR compliant as a processor for travel data, we should verify that in their documentation). Similarly, Resend and LaunchDarkly are processors of data (emails, feature usage) – ensure Data Processing Addendums are in place with them if needed.
* **Jurisdiction and Data Residency:** Supabase likely hosts data in U.S. by default (for our project, unless we chose EU). If we have EU users, storing their personal data in U.S. might require Standard Contractual Clauses, etc. This is more of a legal config; technically, if needed, we could host EU user data in an EU Supabase project. But given no instruction on splitting, we proceed with the assumption that current setup is acceptable and disclosed to users.
* **Encryption:** Consider enabling the `pgcrypto` or `pgsodium` extension for field encryption. For example, if we want to encrypt DOB in database so that even a DB leak doesn’t expose it, we can use a symmetric key. We then decrypt in our function when needed. Key management becomes an issue – storing the key in Supabase Vault is one option or as an env var. We should weigh this. Perhaps for now, not implementing field encryption but relying on RLS and overall DB security (Supabase manages the DB and encryption at rest on the cloud likely). However, if storing any particularly sensitive info or large volumes of PII, encryption at application level would be ideal. Mark this as a future improvement and possibly implement it for at least DOB and phone.
* **Open Web Security Best Practices:** Follow OWASP best practices in our code:

  * Validate all inputs from the user. E.g., trip request inputs (dates, airports) should be validated on front-end and back-end (the Edge Function should validate that the IATA codes are of correct format, dates are in future, etc., to prevent any weird injection or errors).
  * Use parameterized queries (Supabase does this under the hood with its client, but if we ever use raw SQL, parameterize to avoid SQL injection).
  * **Authentication & Authorization:** Ensure all Edge Function endpoints enforce auth where needed. By default, Supabase Edge Functions require an `Authorization` header with the anon or service key. For user-initiated ones, we’ll pass the user’s JWT (supabase-js does this automatically if we use the JS client on frontend). Verify that in production, hitting those endpoints without auth fails. Also ensure our supabase policies align with these – for instance, our functions run with service role (full access), which is fine to perform actions, but the user cannot directly call a function to e.g. book someone else’s trip because they’d need the tripRequestId which they wouldn’t have unless it’s theirs.
  * **Preventing Abuse:** Rate-limit critical endpoints to prevent misuse or excessive cost:

    * For instance, an attacker could spam our flight search function with various queries to exhaust Duffel/Amadeus quotas. Implement a basic rate limit per user for search requests (maybe X searches per minute). This can be done using Redis as well (increment a counter for user IP or ID). LaunchDarkly could also be used to quickly disable a user’s access if needed (like an operational flag).
    * The auto-booking feature itself is not likely to be abused by users (since it’s for their benefit and costs them money), but someone could maliciously create many fake accounts and auto-book to cause chaos. To mitigate: ensure email verification on account creation (Supabase Auth probably handles that), and possibly require a valid payment method on file before enabling auto-book (which inherently limits spam due to cost).
  * **Error Messages:** Don’t expose internal details in errors that go to users. E.g., if booking fails, we might tell the user “Booking failed due to payment issue” but not expose stack traces or system details. Internal logs (Sentry) will have the technical info. This prevents leaking info that could help an attacker or confuse a user.
* **GDPR Documentation:** Document our data flows in our GDPR Article 30 records (if required) – e.g., data goes to airlines via Duffel (purpose: travel booking, lawful basis: contract), etc. This is beyond coding, but important for compliance if audited. Also, enable Privacy by Design in any future changes: always consider these principles whenever adding a new data field or external integration.
* **Cookies & Tracking:** Not directly mentioned, but if our front-end uses any tracking or cookies (LaunchDarkly might use a cookie or localStorage to store user context for flag eval), ensure our site’s privacy notice covers that. LaunchDarkly is just feature gating, likely minimal impact.
* **PCI Compliance:** Using Stripe shifts most compliance to them. We should still do annual security reviews. Possibly ensure our Stripe account is set to require 3D Secure when needed (for auto charges, 3D Secure might not be possible because it’s unsupervised; we may need to attest to Stripe that we have user consent for these charges).
* **Audit Logs for Security Events:** Supabase logs access to the database. We might want to specifically log any administrative access or use of service role outside intended context. But since we primarily run with service role in functions, that’s expected. If there’s an admin panel for support to book on behalf of user, log those actions (not in scope here, but good to note).
* **Penetration Testing:** After implementation and before full rollout, consider a pen-test or at least a thorough code review for security by another engineer or using an automated tool (like an OWASP ZAP scan for the web app, and static analysis for the backend).
* **Compliance with US Privacy Laws:** Apart from GDPR, laws like CCPA give users rights to access/delete data (similar to GDPR) and to opt out of sale (we don’t sell data). Ensure our privacy policy is up to date and that we have a mechanism to handle “Do Not Sell” signals (likely not relevant as we don’t sell). If we ever share data with partners (maybe sending names to airlines counts as necessary service, not sale).
* **HIPAA (unlikely relevant)**: Not applicable unless we handle health data (we don’t).
* **COPPA (children)**: Unlikely, unless minors use the platform. If we allow child travelers, we might gather their DOB (which indicates a minor). That’s not personal data of the user (the parent likely), but we should handle minor data carefully. Likely not directly an issue here beyond data minimization and consent by guardian (if a user is booking for a child, by entering their info the guardian is consenting).
* **Error Recovery:** From a safety perspective, if something goes wrong (bug or downtime), ensure the user is not left in a bad state:

  * If our system goes down after charging card but before booking, the monitor should detect no booking and try again or refund. We mentioned possibly refunding if booking fails after payment – implement that to avoid taking money without ticket.
  * If a booking fails, ensure the user is notified to avoid them thinking it’s booked when it’s not (so they can take action).
  * Build idempotency such that even if the Edge Function is invoked twice (Supabase may retry on failure), we don’t double-book or double-charge (using idempotency keys in Stripe and Duffel as we did).
* **Team Training:** Ensure the team (or the LLM agent operators) are aware of these practices. For example, developers must not log sensitive data during debugging either, or if they do, they must remove it. Given Warp AI will autonomously implement, we encode these rules in its logic as above. Human oversight should review code diffs to ensure no obvious security slip (like printing a password or leaving a test flag on).
* **Confidentiality:** Make sure any data in memory is not persisted inadvertently. For example, if using any upstream libraries, ensure they don’t send data to third parties we don’t intend (some SDKs have telemetry; LaunchDarkly and Sentry do send usage data by design, which is okay as they are expected, but e.g. be careful with any free Redis on insecure config – we use Upstash with TLS (use `rediss://` URL) so data in transit to Redis is encrypted, and set a strong access token).
* **Incident Response:** Establish what happens if something goes wrong (though not directly part of coding):

  * If a bug caused wrongful bookings or data leak, have a plan (which likely means disabling the feature flag, notifying affected users if data was leaked per GDPR within 72 hours, and fixing the issue).
  * Use the monitoring set up to quickly catch incidents (Sentry alerts, etc., as discussed).

By rigorously applying these security and privacy practices, we fulfill legal requirements (GDPR, CCPA) and protect users’ data and funds. The implementation will not be deemed complete until a security review checklist is passed. This ensures the auto-booking system is not only powerful and observable but also trustworthy and compliant **by design**.
