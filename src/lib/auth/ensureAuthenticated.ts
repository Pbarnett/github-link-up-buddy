import { supabase } from '@/integrations/supabase/client';

export type EnsureAuthOptions = {
  returnTo?: string; // explicit returnTo, otherwise computed from window.location
  silent?: boolean;  // if true, do not show toasts here (leave UX to caller)
};

/**
 * Checks for an authenticated session. If absent, stores returnTo and
 * redirects to /login?returnTo=... . Returns true if authenticated, false otherwise.
 */
export async function ensureAuthenticated(opts: EnsureAuthOptions = {}): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  if (data.session) return true;

  // Compute returnTo from current URL if not provided
  const rt = opts.returnTo || (typeof window !== 'undefined'
    ? `${window.location.pathname}${window.location.search || ''}${window.location.hash || ''}`
    : '/');

  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('returnTo', rt);
    }
  } catch {}

  // Navigate to login preserving returnTo
  const url = `/login?returnTo=${encodeURIComponent(rt)}`;
  if (typeof window !== 'undefined') {
    window.location.assign(url);
  }
  return false;
}

