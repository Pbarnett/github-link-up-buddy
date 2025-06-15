
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, Settings, ArrowLeft, Shield, Clock, DollarSign, Zap, CheckCircle, Plane } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import ChoiceCard from "@/components/ui/ChoiceCard";
import TagChip from "@/components/ui/TagChip";
import TripRequestForm from "@/components/trip/TripRequestForm";

const TripNew = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode') as 'manual' | 'auto' | null;

  // If no mode is selected, show the mode selection screen
  if (!mode) {
    return (
      <div className="min-h-screen bg-background prose-analyst p-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header with back link and theme toggle */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md p-1"
                data-analytics="back_to_dashboard"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </button>
              <ThemeToggle />
            </div>
            <div className="text-center">
              <h1 className="text-h1 text-card-foreground mb-3">
                Pick how we'll book for you
              </h1>
              <p className="text-lg text-muted-foreground mb-2">
                Choose your preferred booking approach
              </p>
              <p className="text-sm text-muted-foreground">
                You can switch later from your dashboard
              </p>
            </div>
          </div>

          {/* Mode Selection Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-9 mb-8" data-analytics="mode_choice">
            {/* Manual Search Card */}
            <ChoiceCard
              icon={<Search className="h-8 w-8 text-primary" />}
              title="Search Current Flights"
              description="Find and book flights available right now. Perfect when you need to travel soon or want to see all current options."
              badges={[
                <TagChip key="realtime" icon={<Zap className="h-[10px] w-[10px]" />} variant="primary">
                  Real-time prices
                </TagChip>,
                <TagChip key="compare" icon={<CheckCircle className="h-[10px] w-[10px]" />} variant="primary">
                  Compare airlines
                </TagChip>,
                <TagChip key="immediate" icon={<Clock className="h-[10px] w-[10px]" />} variant="primary">
                  Book immediately
                </TagChip>
              ]}
              buttonText="Search Current Flights"
              buttonVariant="default"
              onClick={() => navigate('/trip/new?mode=manual')}
              aria-describedby="current-benefits"
            />

            {/* Auto-Booking Card */}
            <ChoiceCard
              icon={<Settings className="h-8 w-8 text-primary" />}
              title="Set Up Auto-Booking"
              description="Set your travel criteria and we'll automatically book when we find great deals that match your preferences."
              badges={[
                <TagChip key="monitor" icon={<Plane className="h-[10px] w-[10px]" />} variant="accent">
                  Monitor automatically
                </TagChip>,
                <TagChip key="smart" icon={<CheckCircle className="h-[10px] w-[10px]" />} variant="accent">
                  Smart booking
                </TagChip>,
                <TagChip key="limits" icon={<DollarSign className="h-[10px] w-[10px]" />} variant="accent">
                  Price limits
                </TagChip>
              ]}
              buttonText="Set Up Auto-Booking"
              buttonVariant="secondary"
              onClick={() => navigate('/trip/new?mode=auto')}
              aria-describedby="auto-benefits"
            />
          </div>

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground trust-badge">
            <Shield className="h-3 w-3" />
            <span>Backed by Stripe • Safe & secure</span>
          </div>
        </div>
      </div>
    );
  }

  // If mode is selected, show the appropriate form
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <TripRequestForm mode={mode} />
    </div>
  );
};

export default TripNew;
