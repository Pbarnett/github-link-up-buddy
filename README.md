
# Supabase Auth Demo

A simple React application demonstrating authentication with Supabase.

## Features

- Email magic link authentication
- Google OAuth authentication
- Protected dashboard route
- Authentication state management

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

5. Start the development server:
```bash
pnpm dev
```

## Project Structure

- `/src/pages` - Main application pages
- `/src/components` - Reusable components
- `/src/components/ui` - UI components from shadcn/ui

## Routes

- `/` - Home page
- `/login` - Authentication page with magic link and Google sign-in
- `/dashboard` - Protected route showing user information

## Technologies

- React 18 with TypeScript
- Vite as build tool
- Tailwind CSS for styling
- Supabase for authentication
- React Router for routing
- shadcn/ui for UI components
