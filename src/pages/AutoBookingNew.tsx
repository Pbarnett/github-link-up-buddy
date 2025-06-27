import { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import TopNavigation from '@/components/navigation/TopNavigation';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import { withErrorBoundary } from '@/components/ErrorBoundary';

// Lazy load the campaign wizard
const CampaignWizard = lazy(() => import('@/components/autobooking/CampaignWizard/CampaignWizard'));

function AutoBookingNew() {
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Auto-booking", href: "/auto-booking" },
    { label: "New Campaign", href: "/auto-booking/new" }
  ];

  const handleBack = () => {
    navigate("/auto-booking");
  };

  const WizardSkeleton = () => (
    <div className="container mx-auto py-8 space-y-6 max-w-6xl">
      <div className="mb-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-2 w-full mb-4" />
        <div className="flex justify-between">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center space-y-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-4xl mx-auto">
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );

  return (
    <PageWrapper>
      <TopNavigation />
      <div className="container mx-auto py-8 space-y-6">
        <Breadcrumbs />
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <Suspense fallback={<WizardSkeleton />}>
          <CampaignWizard />
        </Suspense>
      </div>
    </PageWrapper>
  );
}

export default withErrorBoundary(AutoBookingNew, 'page');
