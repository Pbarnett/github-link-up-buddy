#!/usr/bin/env ts-node
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

(async () => {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    console.error('❌ Supabase session missing or invalid', error);
    process.exit(1);
  }
  console.log('✅ Supabase session valid for user', data.session.user.id);
})();
