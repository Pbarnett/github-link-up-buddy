# GitHub Link Up Buddy

## Setup Instructions

### Setting Up Test Payment Method

To test auto-booking functionality, you need to set up a test payment method:

1. Make sure your environment variables are set up:
   - `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `STRIPE_SECRET_KEY`

2. Run the setup script:
   ```
   npm run setup-test-payment
   ```

   This script:
   - Creates a Stripe test customer for your test user
   - Creates a test payment method with Stripe's test card
   - Saves the payment method in your database
   - Sets it as the default payment method

3. The script is idempotent, so it's safe to run multiple times.

### Troubleshooting

If you encounter issues with the setup script:

- Ensure your test user exists in the database with ID `00000000-0000-0000-0000-000000000001`
- Check that your Stripe API key is valid and has the necessary permissions
- Verify that your Supabase connection is working correctly


# Supabase Auth Demo

A simple React application demonstrating authentication with Supabase.

## Features

- Email magic link authentication
- Google OAuth authentication
- Protected dashboard route
- Authentication state management
- Automated flight search and booking with Amadeus API

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Set up your Supabase project:
   - Go to [Supabase](https://supabase.io) and create a new project
   - Configure authentication providers (Email and Google)
   - Add the project URL and anon key to your `.env` file

5. Configure Amadeus API credentials:
   - Sign up for an Amadeus API account
   - Create an API key in the Amadeus developer portal
   - Add the following to your `.env` file:
     ```
     AMADEUS_CLIENT_ID=your_client_id_here
     AMADEUS_CLIENT_SECRET=your_client_secret_here
     AMADEUS_BASE_URL=https://test.api.amadeus.com
     ```
   - Also add these secrets to your Supabase Edge Function Secrets in the Supabase dashboard

6. Start the development server:
```bash
pnpm dev
```

## Amadeus Flight API

The application integrates with the Amadeus Flight API for real flight searches. 

### Configuration
- Environment variables:
  ```
  AMADEUS_CLIENT_ID=your_client_id_here
  AMADEUS_CLIENT_SECRET=your_client_secret_here
  AMADEUS_BASE_URL=https://test.api.amadeus.com
  ```
- Supabase Secrets: same three values must be added to Edge Function Secrets
- Rate limit: The Amadeus API has rate limits of approximately 1 request/second, 50 requests/minute
- Throttling & retry logic is built into our implementation

### Retry Logic
The application implements exponential backoff for API requests:
- Retries up to 3 times on rate limits (HTTP 429) or server errors
- Base delay of 500ms, doubles with each retry (500ms → 1s → 2s)
- Network errors are also automatically retried
- Performance metrics are tracked and reported

### Testing & Monitoring

#### Unit Tests
Run the test suite with:
```bash
pnpm test
```

The test suite includes:
- OAuth token management tests
- Retry logic tests
- Response transformation tests
- Error handling tests

#### Manual Testing
A test script is provided to manually invoke the flight search function:
```bash
node scripts/testFlightSearch.js <trip-request-id>
```

This script:
- Verifies the trip request exists
- Invokes the flight-search edge function
- Checks for new offers and matches in the database
- Reports performance metrics

#### Performance Monitoring
The edge functions track and report the following metrics:
- `totalDurationMs`: Total execution time in milliseconds
- `retryCount`: Number of retries performed on API calls
- Counts of processed requests, matches, and errors

Use these metrics to:
- Identify slow or failing requests
- Monitor rate limit impacts
- Ensure the system is performing within expected parameters

## Project Structure

- `/src/pages` - Main application pages
- `/src/components` - Reusable components
- `/src/components/ui` - UI components from shadcn/ui
- `/src/services` - API services including Amadeus flight API integration

## Routes

- `/` - Home page
- `/login` - Authentication page with magic link and Google sign-in
- `/dashboard` - Protected route showing user information
- `/trip/new` - Create a new trip request
- `/trip/offers` - View flight offers for a trip

## Technologies

- React 18 with TypeScript
- Vite as build tool
- Tailwind CSS for styling
- Supabase for authentication
- React Router for routing
- shadcn/ui for UI components
- Amadeus API for flight searches

## Smoke Test Checklist

Before deploying, verify:

1. **Flight Search**
   - [ ] Create a new trip request in the UI
   - [ ] Manually trigger flight search via script
   - [ ] Verify offers appear in the database
   - [ ] Verify offers display correctly in the UI

2. **Auto-Booking**
   - [ ] Enable auto-booking on a trip request
   - [ ] Trigger the auto-book function
   - [ ] Verify booking and payment records are created
   - [ ] Check that notifications are generated

3. **Error Handling**
   - [ ] Test with invalid credentials
   - [ ] Verify rate limit handling works
   - [ ] Check error logging and reporting
