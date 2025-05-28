### Testing Instructions for Auto-Booking Feature

These instructions describe how to test the auto-booking functionality within the `scheduler-flight-search` Supabase edge function.

**1. Prerequisites:**

*   **`rpc_auto_book_match` Function:**
    *   Ensure the Supabase RPC function `rpc_auto_book_match(p_booking_request_id BIGINT)` exists and is correctly implemented.
    *   This RPC should:
        *   Fetch the `booking_requests` record using `p_booking_request_id`.
        *   Use the `offer_data` and `user_id` from the `booking_requests` record to create a new entry in the `bookings` table.
            *   `bookings.trip_request_id` should be set from `booking_requests.trip_request_id`.
            *   `bookings.user_id` should be set.
            *   `bookings.flight_details` should be populated with all relevant details from `offer_data` (e.g., price, airline, flight numbers, departure/arrival times, dates).
            *   `bookings.source` must be set to `'auto'`.
            *   `bookings.status` must be set to `'booked'`.
            *   `bookings.booked_at` should be set to the current timestamp.
        *   Create a new entry in the `notifications` table for the `user_id` associated with the trip.
            *   The notification should clearly indicate a successful auto-booking, including flight details and price.
            *   `notifications.trip_request_id` should be set.
        *   Update the `booking_requests` record (identified by `p_booking_request_id`) to `status='done'` upon successful completion. If an error occurs during the RPC execution, it should update the status to `'failed'` and log an error message.
*   **Table Schema Verification:**
    *   **`trip_requests`**: Must have `id` (PK), `user_id`, `origin_location_code`, `destination_location_code`, `departure_date`, `return_date`, `adults`, `budget` (NUMERIC), `best_price` (NUMERIC), `auto_book` (BOOLEAN), `updated_at` (TIMESTAMPTZ).
    *   **`booking_requests`**: Must have `id` (PK), `user_id`, `trip_request_id` (FK to `trip_requests.id`), `offer_id` (TEXT), `offer_data` (JSONB), `auto` (BOOLEAN), `status` (TEXT, e.g., 'processing', 'done', 'failed'), `error_message` (TEXT), `created_at` (TIMESTAMPTZ).
    *   **`bookings`**: Must have `id` (PK), `trip_request_id` (FK to `trip_requests.id`), `user_id`, `booking_request_id` (FK to `booking_requests.id`, nullable if bookings can be created manually), `flight_details` (JSONB), `source` (TEXT, e.g., 'auto', 'manual'), `status` (TEXT, e.g., 'pending', 'booked', 'cancelled'), `booked_at` (TIMESTAMPTZ).
    *   **`notifications`**: Must have `id` (PK), `user_id`, `trip_request_id` (FK to `trip_requests.id`), `type` (TEXT, e.g., 'price_drop', 'auto_booking_success'), `message` (TEXT), `data` (JSONB), `read` (BOOLEAN), `created_at` (TIMESTAMPTZ).
*   **`flight-search` Function:**
    *   Ensure the `flight-search` Supabase edge function is deployed and operational.
    *   It must return a list of valid offers in the format `{"offers": Offer[]}` where `Offer` includes at least `id`, `price`, `airline`, `flight_number`, `departure_time`, `arrival_time`.

**2. Setting up Test Data:**

You can insert `trip_requests` records using the Supabase Dashboard (SQL Editor or the Table Editor UI).

*   **Example User:** Identify an existing `user_id` from your `auth.users` table for testing. Let's assume `test_user_id = 'your-actual-test-user-id'`.

*   **Test Case 1: Offer expected within budget**
    *   **Objective:** Verify successful auto-booking when a flight offer is cheaper than or equal to the budget.
    *   **SQL Example:**
        ```sql
        INSERT INTO trip_requests (user_id, origin_location_code, destination_location_code, departure_date, return_date, adults, budget, best_price, auto_book)
        VALUES 
        ('your-actual-test-user-id', 'LHR', 'JFK', '2024-12-01', '2024-12-10', 1, 500.00, 550.00, true); 
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
    *   **SQL Example (Offer over budget, not booked):**
        ```sql
        INSERT INTO trip_requests (user_id, origin_location_code, destination_location_code, departure_date, return_date, adults, budget, best_price, auto_book)
        VALUES 
        ('your-actual-test-user-id', 'CDG', 'LAX', '2024-11-15', '2024-11-25', 1, 300.00, null, true);
        -- Budget is 300. Assume offers will be > 300.
        ```
    *   **SQL Example (Offer over budget, but under `best_price`, no budget set - should book):**
        ```sql
        INSERT INTO trip_requests (user_id, origin_location_code, destination_location_code, departure_date, return_date, adults, budget, best_price, auto_book)
        VALUES 
        ('your-actual-test-user-id', 'AMS', 'BCN', '2024-11-20', '2024-11-28', 1, null, 600.00, true);
        -- No budget. best_price is 600. Expect offers < 600.
        ```

*   **(Optional) Test Case 3: Trip with an existing 'booked' booking**
    *   **Objective:** Verify the safeguard that prevents re-booking an already booked trip.
    *   **Steps:**
        1.  First, create a `trip_requests` record (e.g., using SQL or UI as above, with `auto_book = true`). Let its `id` be `existing_booked_trip_id`.
        2.  Manually insert a corresponding booking:
            ```sql
            INSERT INTO bookings (trip_request_id, user_id, flight_details, source, status, booked_at)
            VALUES
            (existing_booked_trip_id, 'your-actual-test-user-id', '{"message": "Manual test booking"}', 'manual', 'booked', NOW());
            ```
        3.  When the scheduler runs, it should skip this `trip_requests` record.

**3. Invoking the Scheduler Function:**

*   Open your terminal or command prompt.
*   Ensure you are logged into the Supabase CLI and linked to your project.
*   Run the following command:
    ```bash
    supabase functions invoke scheduler-flight-search --no-verify-jwt
    ```
    *(Note: If your function is configured to require a JWT, you'll need to provide one. `--no-verify-jwt` is common for trusted server-to-server invocation like a scheduler).*
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
        *   `flight_details` contains plausible data (price, airline, flight numbers from the `flight-search` offer).
        *   `source` is `'auto'`.
        *   `status` is `'booked'`.
        *   `booked_at` is a recent timestamp.
        *   `booking_request_id` should link to the relevant entry in `booking_requests`.
*   **`notifications` Table:**
    1.  Navigate to Table Editor -> `notifications`.
    2.  Filter by `user_id = 'your-actual-test-user-id'` and/or the `trip_request_id`.
    3.  **Verify:**
        *   A new notification exists.
        *   `type` might be `'auto_booking_success'` (or as defined in your RPC).
        *   The `message` indicates a successful auto-booking with flight details.
        *   `data` field might contain offer details.
*   **`trip_requests` Table:**
    1.  Navigate to Table Editor -> `trip_requests`.
    2.  Find your test `trip_requests` record by its `id`.
    3.  **Verify:**
        *   If the auto-booked flight's price was lower than the existing `best_price` (or if `best_price` was NULL), `best_price` should be updated to the booked flight's price.
        *   `updated_at` should be a recent timestamp.
*   **`booking_requests` Table:**
    1.  Navigate to Table Editor -> `booking_requests`.
    2.  Filter by the `trip_request_id`.
    3.  **Verify:**
        *   A new row exists.
        *   `auto` is `true`.
        *   `offer_data` contains the details of the offer that was used for booking.
        *   `status` is `'done'`.
        *   `error_message` is `NULL`.

For Test Case 2 (Offer over budget, not booked):
*   Verify no new entry in `bookings` for this `trip_request_id`.
*   Verify no new notification for auto-booking (a price drop notification might still occur if the logic for that is separate and an offer was found cheaper than `best_price` but still over budget).
*   Verify `booking_requests.status` might be `'failed'` if an attempt was made and RPC decided not to book, or no `booking_requests` entry if no suitable offer was even picked by the scheduler. Check scheduler logs.

For Test Case 3 (Trip with existing 'booked' booking):
*   Verify no new entry in `bookings` for this `trip_request_id`.
*   Verify no new `booking_requests` entry.
*   Check scheduler logs for messages indicating this trip was skipped due to an existing booking.

**5. Troubleshooting Tips:**

*   **Scheduler Logs:** The primary source for debugging. Check Supabase Dashboard -> "Edge Functions" -> "scheduler-flight-search" -> "Logs". Look for errors, payloads, and decision points.
*   **RPC Logs/Errors:** If `booking_requests.status` is `'failed'`, the `error_message` field should contain details. You might also need to check general database logs or add specific logging within your `rpc_auto_book_match` function if it's complex.
*   **`flight-search` Function Output:** Manually invoke `flight-search` with the same parameters as your `trip_requests` to see the offers it's generating. Ensure prices are as expected.
*   **Database Constraints:** Ensure `user_id` exists, foreign key constraints are met, and data types match (e.g., `budget` and `offer.price` are numeric).
*   **Offer Prices vs. Budget/Best Price:** Double-check the logic in `scheduler-flight-search`:
    *   An offer must be `price <= budget` if `budget` is not null.
    *   OR `price < best_price` if `budget` is null (or if `budget` is set but the offer is also cheaper than `best_price`).
    *   The scheduler prioritizes the cheapest offer that meets these conditions.
*   **Timezones and Dates:** Ensure `departure_date` and `return_date` are handled correctly, especially concerning timezones if your flight search API is sensitive to them.

By following these steps, you can thoroughly test the auto-booking feature.
