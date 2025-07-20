import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import PageWrapper from '@/components/layout/PageWrapper';
import { withErrorBoundary } from '@/components/ErrorBoundary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Lazy load the campaign wizard and demo components
const CampaignWizard = lazy(() => import('@/components/autobooking/CampaignWizard/CampaignWizard'));
const ActionStateForm = lazy(() => import('@/components/forms/ActionStateForm'));
const DeferredSearchDemo = lazy(() => import('@/components/search/DeferredSearchDemo'));

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
        <Tabs defaultValue="wizard" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="wizard">Campaign Wizard</TabsTrigger>
            <TabsTrigger value="forms">useActionState Demo</TabsTrigger>
            <TabsTrigger value="search">useDeferredValue Demo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="wizard" className="space-y-6">
            <Suspense fallback={<WizardSkeleton />}>
              <CampaignWizard />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="forms" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold mb-2">React 19 useActionState Demo</h2>
                <p className="text-muted-foreground">
                  This form demonstrates React 19's useActionState hook with server-side validation and automatic state management.
                </p>
              </div>
              <Suspense fallback={<WizardSkeleton />}>
                <ActionStateForm 
                  onSearchComplete={(data) => {
                    console.log('Search completed:', data);
                    // Handle search completion
                  }}
                />
              </Suspense>
            </div>
          </TabsContent>
          
          <TabsContent value="search" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold mb-2">React 19 useDeferredValue Demo</h2>
                <p className="text-muted-foreground">
                  This search interface uses useDeferredValue to defer expensive operations and keep the UI responsive during user interactions.
                </p>
              </div>
              <Suspense fallback={<WizardSkeleton />}>
                <DeferredSearchDemo />
              </Suspense>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageWrapper>
  );
}

export default withErrorBoundary(AutoBookingNew, 'page');
