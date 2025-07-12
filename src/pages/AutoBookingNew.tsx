import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import PageWrapper from '@/components/layout/PageWrapper';
import { withErrorBoundary } from '@/components/ErrorBoundary';

// Lazy load the campaign wizard
const CampaignWizard = lazy(() => import('@/components/autobooking/CampaignWizard/CampaignWizard'));

function AutoBookingNew() {

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
      <div className="container mx-auto py-8 space-y-6">
        <Suspense fallback={<WizardSkeleton />}>
          <CampaignWizard />
        </Suspense>
      </div>
    </PageWrapper>
  );
}

export default withErrorBoundary(AutoBookingNew, 'page');
