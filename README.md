
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
