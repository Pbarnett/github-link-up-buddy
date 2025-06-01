### Testing Instructions for Auto-Booking Feature

Before running any linting or test commands, install dependencies with:

```bash
pnpm install
```

These instructions describe how to test the auto-booking functionality within the `scheduler-flight-search` Supabase edge function.

**1. Prerequisites:**

*   **Deploy `rpc_auto_book_match` Function:**
    *   Apply the SQL migration file `supabase/migrations/20250528150446_create_rpc_auto_book_match.sql` (or the relevant timestamped migration file you created for the RPC) to your Supabase database. This can be done by running `supabase db push` (if using local development and Supabase CLI management) or by applying the SQL manually via the Supabase Dashboard SQL Editor if that's your workflow. This migration creates the `rpc_auto_book_match(p_booking_request_id BIGINT)` function.
    *   The RPC function is responsible for:
        *   Fetching the `booking_requests` record using `p_booking_request_id`.
        *   Using the `offer_data`, `user_id`, and `trip_request_id` from the `booking_requests` record to create a new entry in the `bookings` table.
            *   `bookings.trip_request_id` should be set.
            *   `bookings.user_id` should be set.
            *   `bookings.booking_request_id` should be set to `p_booking_request_id`.
            *   `bookings.flight_details` should be populated with the `offer_data`.
            *   `bookings.price` should be populated with the price from `offer_data`.
            *   `bookings.source` must be set to `'auto'`.
            *   `bookings.status` must be set to `'booked'`.
            *   `bookings.booked_at` should be set to the current timestamp.
        *   Creating a new entry in the `notifications` table for the `user_id` associated with the trip.
            *   The notification should clearly indicate a successful auto-booking, including flight details (origin, destination, airline, flight number) and price.
            *   `notifications.trip_request_id` should be set.
        *   Updating the `booking_requests` record (identified by `p_booking_request_id`) to `status='done'` upon successful completion. If an error occurs *during the RPC execution itself*, the RPC's exception handler should update the `booking_requests.status` to `'failed'` and populate `booking_requests.error_message`.
*   **Table Schema Verification:**
    *   **`trip_requests`**: Must have `id` (PK, BIGINT), `user_id` (UUID), `origin_location_code` (TEXT), `destination_location_code` (TEXT), `departure_date` (TEXT), `return_date` (TEXT), `adults` (INT), `budget` (NUMERIC), `best_price` (NUMERIC), `auto_book` (BOOLEAN), `updated_at` (TIMESTAMPTZ).
    *   **`booking_requests`**: Must have `id` (PK, BIGINT), `user_id` (UUID), `trip_request_id` (FK to `trip_requests.id`), `offer_id` (TEXT), `offer_data` (JSONB), `auto` (BOOLEAN), `status` (TEXT, e.g., 'processing', 'done', 'failed'), `error_message` (TEXT), `created_at` (TIMESTAMPTZ), `updated_at` (TIMESTAMPTZ).
    *   **`bookings`**: Must have `id` (PK, BIGINT), `trip_request_id` (FK to `trip_requests.id`), `user_id` (UUID), `booking_request_id` (BIGINT, FK to `booking_requests.id`), `flight_details` (JSONB), `price` (NUMERIC), `source` (TEXT, e.g., 'auto', 'manual'), `status` (TEXT, e.g., 'pending', 'booked', 'cancelled'), `booked_at` (TIMESTAMPTZ).
    *   **`notifications`**: Must have `id` (PK, BIGINT), `user_id` (UUID), `trip_request_id` (FK to `trip_requests.id`), `type` (TEXT, e.g., 'price_drop', 'auto_booking_success'), `message` (TEXT), `data` (JSONB), `read` (BOOLEAN), `created_at` (TIMESTAMPTZ).
*   **`flight-search` Function:**
    *   Ensure the `flight-search` Supabase edge function is deployed and operational.
    *   It must return a list of valid offers in the format `{"offers": Offer[]}` where `Offer` includes at least `id` (TEXT), `price` (NUMERIC), `airline` (TEXT), `flight_number` (TEXT), `departure_time` (TEXT), `arrival_time` (TEXT). The `scheduler-flight-search` function expects these fields in the `offer_data`.

**2. Setting up Test Data:**

You can insert `trip_requests` records using the Supabase Dashboard (SQL Editor or the Table Editor UI).

*   **Example User:** Identify an existing `user_id` from your `auth.users` table for testing. Let's assume `test_user_id = 'your-actual-test-user-id'`.

*   **Test Case 1: Offer expected within budget**
    *   **Objective:** Verify successful auto-booking when a flight offer is cheaper than or equal to the budget.
    *   **SQL Example:**
        ```sql
        INSERT INTO public.trip_requests (user_id, origin_location_code, destination_location_code, departure_date, return_date, adults, budget, best_price, auto_book, updated_at)
        VALUES
        ('your-actual-test-user-id', 'LHR', 'JFK', '2024-12-01', '2024-12-10', 1, 500.00, 550.00, true, NOW());
        -- Ensure departure_date is in the future & flight-search can find offers for these params.
        -- Budget is 500, best_price (if set) is higher.
        ```
    *   **UI Steps:**
        1.  Navigate to "Table Editor" -> "trip_requests".
        2.  Click "+ Insert row".
        3.  Fill in the fields:
            *   `user_id`: `your-actual-test-user-id`
            *   `origin_location_code`: `LHR` (or any valid code your flight search provider supports)
            *   `destination_location_code`: `JFK` (or any valid code)
            *   `departure_date`: A future date (e.g., `2024-12-01`)
            *   `return_date`: A date after departure (e.g., `2024-12-10`) or `NULL` for one-way.
            *   `adults`: `1`
            *   `budget`: `500` (or a value you expect offers to be under)
            *   `best_price`: `NULL` or a value higher than the budget (e.g., `550`)
            *   `auto_book`: `true`
        4.  Click "Save". Note the `id` of this new trip request.

*   **Test Case 2: Offer expected over budget (but potentially under `best_price`)**
    *   **Objective:** Verify that a flight is booked if it's over budget but cheaper than `best_price` (if `budget` is null), or not booked if over budget (and `best_price` doesn't apply or is also too high).
    *   **SQL Example (Offer over budget, not booked by auto-booker if criteria not met):**
        ```sql
        INSERT INTO public.trip_requests (user_id, origin_location_code, destination_location_code, departure_date, return_date, adults, budget, best_price, auto_book, updated_at)
        VALUES
        ('your-actual-test-user-id', 'CDG', 'LAX', '2024-11-15', '2024-11-25', 1, 300.00, null, true, NOW());
        -- Budget is 300. Assume offers will be > 300.
        ```
    *   **SQL Example (Offer under `best_price`, no budget set - should book):**
        ```sql
        INSERT INTO public.trip_requests (user_id, origin_location_code, destination_location_code, departure_date, return_date, adults, budget, best_price, auto_book, updated_at)
        VALUES
        ('your-actual-test-user-id', 'AMS', 'BCN', '2024-11-20', '2024-11-28', 1, null, 600.00, true, NOW());
        -- No budget. best_price is 600. Expect offers < 600.
        ```

*   **(Optional) Test Case 3: Trip with an existing 'booked' booking**
    *   **Objective:** Verify the safeguard that prevents re-booking an already booked trip.
    *   **Steps:**
        1.  First, create a `trip_requests` record (e.g., using SQL or UI as above, with `auto_book = true`). Let its `id` be `existing_booked_trip_id`.
        2.  Manually insert a corresponding booking:
            ```sql
            INSERT INTO public.bookings (trip_request_id, user_id, booking_request_id, flight_details, price, source, status, booked_at)
            VALUES
            (existing_booked_trip_id, 'your-actual-test-user-id', null, '{"message": "Manual test booking"}', 0.00, 'manual', 'booked', NOW());
            -- booking_request_id can be null for manually created ones
            ```
        3.  When the scheduler runs, it should skip this `trip_requests` record.

**3. Invoking the Scheduler Function:**

*   Open your terminal or command prompt.
*   Ensure you are logged into the Supabase CLI and linked to your project.
*   Run the following command:
    ```bash
    supabase functions invoke scheduler-flight-search --no-verify-jwt
    ```
    *(Note: If your function is configured to require a JWT for invocation, you'll need to provide one. `--no-verify-jwt` is often used for trusted server-to-server invocations like schedulers, but check your function's security settings).*
*   **Check Function Logs:**
    *   Go to the Supabase Dashboard -> "Edge Functions" -> "scheduler-flight-search".
    *   View the logs for the invocation. Look for log messages indicating which trips are processed, offers found, and if auto-booking attempts are made.

**4. Verification Steps:**

For each test case where booking is expected:

*   **`bookings` Table:**
    1.  Navigate to Table Editor -> `bookings`.
    2.  Filter by the `trip_request_id` of your test record.
    3.  **Verify:**
        *   A new row exists for the `trip_request_id`.
        *   `user_id` matches `your-actual-test-user-id`.
        *   `booking_request_id` is correctly populated with the `id` from the corresponding `booking_requests` table entry.
        *   `flight_details` (JSONB) contains the complete offer data from the `flight-search` function.
        *   `price` (NUMERIC) is correctly populated with the price from the offer.
        *   `source` is `'auto'`.
        *   `status` is `'booked'`.
        *   `booked_at` is a recent timestamp.
*   **`notifications` Table:**
    1.  Navigate to Table Editor -> `notifications`.
    2.  Filter by `user_id = 'your-actual-test-user-id'` and/or the `trip_request_id`.
    3.  **Verify:**
        *   A new notification exists.
        *   `type` is `'auto_booking_success'`.
        *   The `message` indicates a successful auto-booking with correct flight details (origin, destination, airline, flight number) and price.
        *   `data` field (JSONB) contains relevant details like `booking_id`, `offer_id`, `price`, `airline`, `flight_number`, `origin`, `destination`, `trip_request_id`.
*   **`trip_requests` Table:**
    1.  Navigate to Table Editor -> `trip_requests`.
    2.  Find your test `trip_requests` record by its `id`.
    3.  **Verify:**
        *   If the auto-booked flight's price was lower than the existing `best_price` (or if `best_price` was NULL), `best_price` should be updated to the booked flight's price.
        *   `updated_at` should be a recent timestamp (reflecting the `best_price` update).
*   **`booking_requests` Table:**
    1.  Navigate to Table Editor -> `booking_requests`.
    2.  Filter by the `trip_request_id`.
    3.  **Verify:**
        *   A new row exists.
        *   `auto` is `true`.
        *   `offer_data` contains the details of the offer that was used for booking.
        *   `status` is `'done'` (if RPC was successful).
        *   `error_message` is `NULL` (if RPC was successful).
        *   If the `rpc_auto_book_match` function itself encountered an error *and handled it by updating the status* (as per its internal exception block), then:
            *   `status` should be `'failed'`.
            *   `error_message` should contain the error message logged by the RPC function.
        *   If the `scheduler-flight-search` function failed to call the RPC or had an error *before or after* the RPC call related to this booking request, the `status` might still be `'processing'` or another value if the update to `'failed'` in the scheduler was not reached. Check scheduler logs in this case.

For Test Case 2 (Offer over budget, not booked by auto-booker):
*   Verify no new entry in `bookings` for this `trip_request_id` due to auto-booking.
*   Verify no new `auto_booking_success` notification. (A `price_drop` notification might still occur if the criteria for that are met separately and `autoBookedThisRun` remained false).
*   Verify no `booking_requests` entry was created if no suitable offer was found by the scheduler. If an offer was found but deemed unsuitable by the auto-book logic, there should also be no `booking_requests` entry.

For Test Case 3 (Trip with existing 'booked' booking):
*   Verify no new entry in `bookings` for this `trip_request_id`.
*   Verify no new `booking_requests` entry.
*   Check scheduler logs for messages indicating this trip was skipped due to an existing booking.

**5. Troubleshooting Tips:**

*   **Scheduler Logs:** The primary source for debugging the `scheduler-flight-search` function. Check Supabase Dashboard -> "Edge Functions" -> "scheduler-flight-search" -> "Logs". Look for errors, payloads, and decision points.
*   **RPC Behavior & Logs:**
    *   If `booking_requests.status` is `'failed'`, the `error_message` field should contain details from the RPC's exception handler.
    *   You can test the `rpc_auto_book_match` function directly using the Supabase SQL Editor by first creating a test `booking_requests` record with `status = 'processing'` and then running `SELECT public.rpc_auto_book_match(your_test_booking_request_id);`. Check for any errors raised or if the `booking_requests` status is updated as expected.
    *   Add `RAISE NOTICE` statements within your PL/pgSQL function for debugging, which will appear in the database logs (accessible via Supabase Dashboard -> "Database" -> "Logs", though may require log level adjustments or specific query execution to view).
*   **`flight-search` Function Output:** Manually invoke `flight-search` with the same parameters as your `trip_requests` to see the offers it's generating. Ensure prices and other offer details are as expected.
*   **Database Constraints:** Ensure `user_id` exists, foreign key constraints are met, and data types match (e.g., `budget` and `offer.price` are numeric).
*   **Offer Prices vs. Budget/Best Price:** Double-check the logic in `scheduler-flight-search`:
    *   An offer must be `price <= budget` if `budget` is not null.
    *   OR `price < best_price` if `budget` is null (or if `budget` is set but the offer is also cheaper than `best_price`).
    *   The scheduler prioritizes the cheapest offer that meets these conditions for auto-booking.
*   **Timezones and Dates:** Ensure `departure_date` and `return_date` are handled correctly, especially concerning timezones if your flight search API is sensitive to them.

By following these steps, you can thoroughly test the auto-booking feature.
