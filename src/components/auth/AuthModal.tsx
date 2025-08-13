import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';

export type AuthModalReason = 'checkout' | 'save' | 'track' | 'generic';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason?: AuthModalReason;
  returnTo?: string;
}

export default function AuthModal({ open, onOpenChange, reason = 'generic', returnTo }: AuthModalProps) {
  const { signInWithGoogle, signInWithEmailOtp } = useAuth();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const copy = {
    checkout: 'Sign in to finish your booking securely and receive your confirmation.',
    save: 'Create a free account to save this and access it from any device.',
    track: 'Sign in to track price changes and get notified.',
    generic: 'Sign in or create an account to continue.'
  }[reason];

  const handleEmail = async () => {
    if (!email) return;
    try {
      setSubmitting(true);
      await signInWithEmailOtp(email, returnTo);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-label="Authentication">
        <DialogHeader>
          <DialogTitle>Welcome back</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">{copy}</p>
        </DialogHeader>
        <div className="space-y-3">
          <Button className="w-full" onClick={() => {
            window?.analytics && window.analytics.track('auth_prompt_shown', { reason });
            void signInWithGoogle(returnTo)
          }}>
            Continue with Google
          </Button>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button disabled={!email || submitting} onClick={() => {
              window?.analytics && window.analytics.track('auth_prompt_shown', { reason });
              void handleEmail()
            }}>Continue with email</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
