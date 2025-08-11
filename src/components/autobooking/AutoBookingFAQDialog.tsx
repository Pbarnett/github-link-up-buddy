import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, DollarSign, Clock, PauseCircle, CreditCard } from "lucide-react";
import React from "react";

interface AutoBookingFAQDialogProps {
  trigger?: React.ReactNode;
}

export const AutoBookingFAQDialog: React.FC<AutoBookingFAQDialogProps> = ({ trigger }) => {
  return (
    <Dialog>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent aria-label="How auto-booking works">
        <DialogHeader>
          <DialogTitle>How auto-booking works</DialogTitle>
          <DialogDescription>
            A quick overview of price caps, control, and safety before you start.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <DollarSign className="h-4 w-4 mt-0.5 text-primary" />
            <div>
              <p className="font-medium">Price cap respected</p>
              <p className="text-muted-foreground">We never book above your max (taxes and fees included).</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-4 w-4 mt-0.5 text-primary" />
            <div>
              <p className="font-medium">Always on</p>
              <p className="text-muted-foreground">We check fares around the clock, typically every 15 minutes.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <PauseCircle className="h-4 w-4 mt-0.5 text-primary" />
            <div>
              <p className="font-medium">You’re in control</p>
              <p className="text-muted-foreground">Pause anytime; most U.S. fares are refundable within 24 hours.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CreditCard className="h-4 w-4 mt-0.5 text-primary" />
            <div>
              <p className="font-medium">Secure payments</p>
              <p className="text-muted-foreground">Processed by Stripe; card details stay encrypted.</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

