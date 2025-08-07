

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,

import TripRequestForm from '@/components/trip/TripRequestForm';
import TripRequestForm from '@/components/trip/TripRequestForm'; } from '@/hooks/useAnalytics';

import ThreeStepExplainer from '@/components/ThreeStepExplainer';
import SimplifiedSocialProof from '@/components/SimplifiedSocialProof';
import SimplifiedSocialProof from '@/components/SimplifiedSocialProof'; } from 'react';

const TripNew = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-set mode to 'manual' if accessing via /search route
  const mode =
    location.pathname === '/search'
      ? 'manual'
      : (searchParams.get('mode') as 'manual' | 'auto' | null);
  const { trackCTAClick, trackCardView } = useAnalytics();
  const { user } = useCurrentUser();
  const autoCardRef = useRef<HTMLDivElement>(null);
  const manualCardRef = useRef<HTMLDivElement>(null);

  // Set up card view tracking
  useEffect(() => {
    if (autoCardRef.current && manualCardRef.current && !mode) {
      trackCardView(autoCardRef.current, 'auto');
      trackCardView(manualCardRef.current, 'manual');
    }
  }, [mode, trackCardView]);

  // Simulate active bookings count (in real app, this would come from API)
  const [activeBookingsCount] = useState(
    user ? Math.floor(Math.random() * 3) : 0
  );

  // If no mode is selected, show the mode selection screen
  if (!mode) {
    return (
      <div className="min-h-screen bg-white">
        {/* Redesigned Hero Section */}
        <section className="hero-redesigned">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="hero-title-redesigned">✈️ Skip the fare hunt.</h1>
            <p className="hero-lead-redesigned">
              Tell us your perfect flight and price. We'll book it the moment it
              appears.
            </p>
            <p className="hero-sub-redesigned">
              No endless searches, no price-tracking apps—just set it once and
              relax.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 pb-12">
          {/* Active Bookings Pill for signed-in users */}
          {user && <ActiveBookingsPill count={activeBookingsCount} />}

          {/* 3-Step Explainer */}
          <ThreeStepExplainer />

          {/* Mode Selection Cards - Auto-Booking First for Primary Path */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8">
            {/* Auto-Booking Card - Primary Path */}
            <Card
              ref={autoCardRef}
              data-behavior="card"
              className="card-redesigned card-primary-redesigned relative overflow-hidden transition-all cursor-pointer group"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Settings className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-xl">
                      Set up Auto-Booking
                    </CardTitle>
                    <Badge variant="success" className="text-xs flex-shrink-0">
                      Most popular
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-base">
                  We search fares every 15 min, 24/7 and book automatically when
                  deals match your criteria.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-0">
                <ul
                  className="text-sm text-gray-600 space-y-3 mb-6"
                  style={{ lineHeight: '1.6' }}
                >
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0" />
                    <span>Lock in your max — pay ≤ what you decide</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0" />
                    <span>We search fares every 15 min, 24/7</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0" />
                    <span>Cancel or tweak anytime in one click</span>
                  </li>
                </ul>
                <div className="flex justify-center">
                  <Button
                    id="auto-booking-primary"
                    onClick={() => {
                      trackCTAClick({
                        type: 'auto',
                        cardPosition: 'left',
                        timestamp: Date.now(),
                      });
                      navigate('/trip/new?mode=auto');
                    }}
                    style={{ backgroundColor: 'var(--c-btn-primary)' }}
                    className="btn-redesigned text-white border-none font-medium py-3 hover:opacity-90"
                  >
                    Start Auto-Booking
                  </Button>
                </div>
              </CardContent>
              {/* Enhanced stat banner */}
              <div className="stat-banner flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">
                  7,412 trips auto-booked in the last 30 days
                </span>
              </div>
            </Card>

            {/* Manual Search Card - Secondary Path */}
            <Card
              ref={manualCardRef}
              data-behavior="card"
              className="card-redesigned relative overflow-hidden transition-all cursor-pointer group"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                    <Search className="h-6 w-6 text-gray-600" />
                  </div>
                  <CardTitle className="text-xl text-gray-700">
                    Manual Search
                  </CardTitle>
                </div>
                <CardDescription className="text-base text-gray-600">
                  Just need a seat right now? Run a one‑time search.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul
                  className="text-sm text-gray-600 space-y-3 mb-6"
                  style={{ lineHeight: '1.6' }}
                >
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>See real-time flight availability</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Compare prices across airlines</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Book immediately</span>
                  </li>
                </ul>
                <Button
                  variant="outline"
                  onClick={() => {
                    trackCTAClick({
                      type: 'manual',
                      cardPosition: 'right',
                      timestamp: Date.now(),
                    });
                    navigate('/trip/new?mode=manual');
                  }}
                  className="btn-secondary-enhanced w-full font-medium py-3 border-gray-300 text-gray-700 hover:bg-slate-50"
                >
                  Search Now
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Simplified Social Proof */}
          <SimplifiedSocialProof />

          {/* Additional Info */}
          <div className="text-center mt-8 text-sm text-gray-500">
            <p>You can switch between booking methods anytime</p>
          </div>
        </div>
      </div>
    );
  }

  // If mode is selected, show the appropriate form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <TripRequestForm mode={mode} />
    </div>
  );
};

export default TripNew;
