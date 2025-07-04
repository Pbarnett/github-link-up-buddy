import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Temporary debug logging
console.log('🔍 Environment Variables at App Startup:');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'MISSING');
console.log('VITE_STRIPE_PUBLISHABLE_KEY:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? 'SET' : 'MISSING');

if (import.meta.env.VITE_SUPABASE_URL?.includes('127.0.0.1')) {
  console.log('❌ Still using LOCAL Supabase instance');
} else if (import.meta.env.VITE_SUPABASE_URL?.includes('supabase.co')) {
  console.log('✅ Using PRODUCTION Supabase instance');
} else {
  console.log('⚠️ Unknown Supabase configuration');
}

createRoot(document.getElementById("root")!).render(<App />);
