import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/auth/AuthModal';

interface RequireAuthProps {
  children: React.ReactNode;
  reason?: 'checkout' | 'save' | 'track' | 'generic';
}

export default function RequireAuth({ children, reason = 'generic' }: RequireAuthProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      try {
        const returnTo = `${location.pathname}${location.search}${location.hash}` || '/';
        sessionStorage.setItem('returnTo', returnTo);
      } catch {}
      setOpen(true);
    }
  }, [user, loading, location.pathname, location.search, location.hash]);

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-sm text-muted-foreground">Checking access…</div>
    );
  }

  if (!user) {
    const fullReturn = `${window.location.origin}${location.pathname}${location.search}${location.hash}`;
    return (
      <>
        <AuthModal open={open} onOpenChange={setOpen} reason={reason} returnTo={fullReturn} />
        <div className="min-h-[40vh] flex items-center justify-center text-sm text-muted-foreground">Sign in required</div>
      </>
    );
  }

  return <>{children}</>;
}
