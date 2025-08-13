import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const finalize = async () => {
      try {
        // Check for OAuth error parameters first
        const search = new URLSearchParams(location.search);
        const hash = new URLSearchParams(location.hash.replace(/^#/, ''));
        const oauthError = search.get('error') || hash.get('error');
        const oauthErrorDesc = search.get('error_description') || hash.get('error_description');
        if (oauthError) {
          setError(`${oauthError}: ${oauthErrorDesc || 'Authorization was denied or failed.'}`);
          setLoading(false);
          return;
        }

        // If we landed on an unexpected origin, redirect to the configured base BEFORE doing any exchange
        const publicBase = (import.meta.env.VITE_PUBLIC_BASE_URL as string) || window.location.origin;
        const normalizedBase = publicBase.replace(/\/$/, '');
        const currentOrigin = window.location.origin;
        const codeInQuery = new URLSearchParams(location.search).get('code') || new URLSearchParams(location.hash.replace(/^#/, '')).get('code');
        if (currentOrigin !== normalizedBase && codeInQuery) {
          const dst = `${normalizedBase}/auth/callback${window.location.search}${window.location.hash}`;
          console.warn('[AuthCallback] Origin mismatch. Redirecting callback to base:', dst);
          window.location.replace(dst);
          return; // stop further processing on the wrong origin
        }

        // If PKCE code is present, explicitly exchange it for a session
        const code = search.get('code') || hash.get('code');
        if (code) {
          try {
            console.log('[AuthCallback] Exchanging code for session');
            await supabase.auth.exchangeCodeForSession({ code });
            console.log('[AuthCallback] Code exchange complete');
          } catch (ex) {
            console.error('[AuthCallback] Code exchange error', ex);
            setError((ex as Error)?.message || 'Failed to exchange authorization code for a session.');
            setLoading(false);
            return;
          }
        } else {
          // Allow supabase-js to complete implicit/callback handling if needed
          console.log('[AuthCallback] No code param detected; waiting briefly');
          await new Promise((r) => setTimeout(r, 300));
        }

        // Now check the session
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          setError(error.message || 'Failed to establish session.');
          setLoading(false);
          return;
        }

        if (data.session) {
          // Emit auth_completed for analytics
          try {
            const qp = new URLSearchParams(location.search);
            const hp = new URLSearchParams(location.hash.replace(/^#/, ''));
            const provider = qp.get('provider') || hp.get('provider') || 'unknown';
            const method = qp.get('flow') || hp.get('flow') || (provider !== 'unknown' ? 'oauth' : 'otp_or_unknown');
            window?.analytics && window.analytics.track('auth_completed', { provider, method, status: 'success' });
          } catch {}

          // Determine where to go: URL returnTo param, sessionStorage, or default
          const urlReturnTo = new URLSearchParams(location.search).get('returnTo');
          let returnTo = urlReturnTo || undefined;
          if (!returnTo) {
            try { returnTo = sessionStorage.getItem('returnTo') || undefined; } catch {}
          }
          if (returnTo) {
            try { sessionStorage.removeItem('returnTo'); } catch {}
          }
          navigate(returnTo || '/auto-booking', { replace: true });
        } else {
          try { window?.analytics && window.analytics.track('auth_completed', { status: 'no_session' }); } catch {}
          // No session detected; send back to login
          navigate('/login', { replace: true });
        }
      } catch (e: any) {
        setError(e?.message || 'Unexpected error during authentication.');
        setLoading(false);
      }
    };

    void finalize();
  }, [location.search, location.hash, navigate]);

  if (loading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Signing you in…</CardTitle>
            <CardDescription>Finalizing your session. Please wait.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse text-sm text-muted-foreground">Communicating with authentication provider…</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication error</CardTitle>
          <CardDescription>We couldn’t complete the sign-in.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-red-600 mb-4">{error}</div>
          <Button onClick={() => navigate('/login', { replace: true })}>Back to sign in</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;
