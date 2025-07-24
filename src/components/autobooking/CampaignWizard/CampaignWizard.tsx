import * as React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { withErrorBoundary } from '@/components/ErrorBoundary';
import { trackCampaignEvent } from '@/utils/monitoring';
import { campaignService } from '@/services/campaignService';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { CriteriaFormData } from './StepCriteria';
import { TravelerFormData } from './StepTraveler';

// Lazy load step components
const StepCriteria = lazy(() => import('./StepCriteria'));
const StepTraveler = lazy(() => import('./StepTraveler'));
const StepPayment = lazy(() => import('./StepPayment'));
const StepReview = lazy(() => import('./StepReview'));

interface WizardState {
  criteria: CriteriaFormData | null;
  traveler: TravelerFormData | null;
  paymentMethodId: string;
}

const STEPS = [
  { id: 0, name: 'Criteria', description: 'Travel preferences' },
  { id: 1, name: 'Traveler', description: 'Personal information' },
  { id: 2, name: 'Payment', description: 'Payment method' },
  { id: 3, name: 'Review', description: 'Confirm details' },
];

function CampaignWizard() {
  const navigate = useNavigate();
  const { userId } = useCurrentUser();
  const [isPending, startTransition] = useTransition();

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [wizardState, setWizardState] = useState<WizardState>({
    criteria: null,
    traveler: null,
    paymentMethodId: '',
  });

  const handleNext = (data: CriteriaFormData | TravelerFormData | string) => {
    startTransition(() => {
      const newState = { ...wizardState };

      switch (currentStep) {
        case 0:
          newState.criteria = data as CriteriaFormData;
          trackCampaignEvent('wizard_step_completed', 'temp-id', {
            step_name: 'criteria',
            step_number: currentStep + 1,
          });
          break;
        case 1:
          newState.traveler = data as TravelerFormData;
          trackCampaignEvent('wizard_step_completed', 'temp-id', {
            step_name: 'traveler',
            step_number: currentStep + 1,
          });
          break;
        case 2:
          newState.paymentMethodId = data as string;
          trackCampaignEvent('wizard_step_completed', 'temp-id', {
            step_name: 'payment',
            step_number: currentStep + 1,
          });
          break;
      }

      setWizardState(newState);
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    });
  };

  const handleBack = () => {
    startTransition(() => {
      setCurrentStep(prev => Math.max(prev - 1, 0));
      trackCampaignEvent('wizard_step_back', 'temp-id', {
        step_number: currentStep,
      });
    });
  };

  const handleConfirm = async () => {
    if (
      !userId ||
      !wizardState.criteria ||
      !wizardState.traveler ||
      !wizardState.paymentMethodId
    ) {
      toast({
        title: 'Missing Information',
        description: 'Please complete all steps before creating the campaign.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Combine all data for campaign creation
      const campaignData = {
        name: wizardState.criteria.campaignName,
        destination: wizardState.criteria.destination,
        departureDates: `${wizardState.criteria.departureStart} to ${wizardState.criteria.departureEnd}`,
        maxPrice: wizardState.criteria.maxPrice,
        directFlightsOnly: wizardState.criteria.directFlightsOnly,
        departureAirports: wizardState.criteria.origin
          ? [wizardState.criteria.origin]
          : undefined,
        cabinClass: wizardState.criteria.cabinClass,
        minDuration: wizardState.criteria.minDuration,
        maxDuration: wizardState.criteria.maxDuration,
        traveler: wizardState.traveler,
        paymentMethodId: wizardState.paymentMethodId,
      };

      const campaign = await campaignService.createCampaign(
        campaignData,
        userId
      );

      trackCampaignEvent('campaign_created', campaign.id, {
        destination: wizardState.criteria.destination,
        trip_type: wizardState.criteria.tripType,
        max_price: wizardState.criteria.maxPrice,
        payment_method_id: wizardState.paymentMethodId,
      });

      toast({
        title: 'Campaign Created! 🎉',
        description:
          'Your auto-booking campaign is now active and monitoring flights.',
      });

      // Navigate to dashboard
      navigate('/auto-booking');
    } catch (error) {
      console.error('Failed to create campaign:', error);

      trackCampaignEvent('campaign_creation_failed', 'temp-id', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      toast({
        title: 'Creation Failed',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to create campaign. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderProgressIndicator = () => {
    const progressPercentage = ((currentStep + 1) / STEPS.length) * 100;

    return (
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Create Auto-Booking Campaign
              </h2>
              <Badge variant="secondary">
                Step {currentStep + 1} of {STEPS.length}
              </Badge>
            </div>

            <Progress value={progressPercentage} className="h-2" />

            <div className="flex justify-between">
              {STEPS.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;

                return (
                  <div
                    key={step.id}
                    className="flex flex-col items-center space-y-2"
                  >
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isCurrent
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </div>
                    <div className="text-center">
                      <p
                        className={`text-sm font-medium ${
                          isCurrent ? 'text-blue-600' : 'text-gray-500'
                        }`}
                      >
                        {step.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepCriteria
            initialData={wizardState.criteria || undefined}
            onNext={handleNext}
            isLoading={isLoading}
          />
        );
      case 1:
        return (
          <StepTraveler
            initialData={wizardState.traveler || undefined}
            onNext={handleNext}
            onBack={handleBack}
            isLoading={isLoading}
          />
        );
      case 2:
        return (
          <StepPayment
            onNext={handleNext}
            onBack={handleBack}
            isLoading={isLoading}
          />
        );
      case 3:
        return (
          <StepReview
            criteriaData={wizardState.criteria!}
            travelerData={wizardState.traveler!}
            paymentMethodId={wizardState.paymentMethodId}
            onBack={handleBack}
            onConfirm={handleConfirm}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  const LoadingSkeleton = () => (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-3/4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div
      className={`container mx-auto py-8 space-y-6 max-w-6xl ${
        isPending ? 'opacity-75 transition-opacity duration-200' : ''
      }`}
    >
      {renderProgressIndicator()}

      <Suspense fallback={<LoadingSkeleton />}>{renderStep()}</Suspense>
    </div>
  );
}

export default withErrorBoundary(CampaignWizard, 'page');
