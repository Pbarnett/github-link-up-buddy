import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and Anon Key from environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if the environment variables are set
if (!SUPABASE_URL) {
  throw new Error("VITE_SUPABASE_URL is not set. Please check your .env file or environment variables.");
}
if (!SUPABASE_PUBLISHABLE_KEY) {
  throw new Error("VITE_SUPABASE_ANON_KEY is not set. Please check your .env file or environment variables.");
}

// Initialize and export the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Optional: You might want to export URL and Key if they are used elsewhere,
// but generally, other parts of the app should just import the `supabase` client instance.
// export { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY };
