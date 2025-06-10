
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

type WizardStep = 'trip' | 'payment' | 'confirmation';

interface StepData {
  trip?: any;
  payment?: any;
}

const TripAutoBooking = () => {
  const navigate = useNavigate();
  const { userId } = useCurrentUser();
  const [currentStep, setCurrentStep] = useState<WizardStep>('trip');
  const [stepData, setStepData] = useState<StepData>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load existing draft on mount
  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }
    loadDraft();
  }, [userId]);

  const loadDraft = async () => {
    try {
      const { data, error } = await supabase
        .from("draft_trip_requests")
        .select("*")
        .eq("user_id", userId!)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }

      if (data) {
        setCurrentStep(data.current_step as WizardStep);
        setStepData(data.step_data || {});
      }
    } catch (error) {
      console.error("Error loading draft:", error);
      toast({
        title: "Error",
        description: "Failed to load your saved progress.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveDraft = async (step: WizardStep, data: StepData) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("draft_trip_requests")
        .upsert({
          user_id: userId,
          current_step: step,
          step_data: data,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  const updateStepData = (step: keyof StepData, data: any) => {
    const newStepData = { ...stepData, [step]: data };
    setStepData(newStepData);
    saveDraft(currentStep, newStepData);
  };

  const goToStep = (step: WizardStep) => {
    setCurrentStep(step);
    saveDraft(step, stepData);
  };

  const steps = [
    { id: 'trip', title: 'Trip Details', description: 'Set your travel preferences' },
    { id: 'payment', title: 'Payment Method', description: 'Choose how to pay' },
    { id: 'confirmation', title: 'Confirmation', description: 'Review and activate' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your auto-booking wizard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Auto-Booking Setup
          </h1>
          <p className="text-gray-600">
            Set up automatic booking for your next trip. We'll monitor prices and book when your criteria are met.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex-1">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      index < currentStepIndex
                        ? 'bg-green-600 text-white'
                        : index === currentStepIndex
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index < currentStepIndex ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 ${
                        index < currentStepIndex ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-900">{step.title}</p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStepIndex].title}</CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === 'trip' && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  This step will contain the trip details form (destination, dates, budget, etc.)
                </p>
                <p className="text-sm text-gray-500">
                  Coming soon: Trip parameters form will be implemented here.
                </p>
              </div>
            )}

            {currentStep === 'payment' && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  This step will contain payment method selection and auto-booking budget settings.
                </p>
                <p className="text-sm text-gray-500">
                  Coming soon: Payment method form will be implemented here.
                </p>
              </div>
            )}

            {currentStep === 'confirmation' && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  This step will show a summary and activate auto-booking.
                </p>
                <p className="text-sm text-gray-500">
                  Coming soon: Confirmation and activation flow will be implemented here.
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  if (currentStepIndex > 0) {
                    goToStep(steps[currentStepIndex - 1].id as WizardStep);
                  } else {
                    navigate("/dashboard");
                  }
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {currentStepIndex > 0 ? 'Previous' : 'Cancel'}
              </Button>

              <Button
                onClick={() => {
                  if (currentStepIndex < steps.length - 1) {
                    goToStep(steps[currentStepIndex + 1].id as WizardStep);
                  } else {
                    // Final step - activate auto-booking
                    toast({
                      title: "Auto-booking activated!",
                      description: "We'll start monitoring flights for you.",
                    });
                    navigate("/dashboard");
                  }
                }}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {currentStepIndex < steps.length - 1 ? 'Next' : 'Activate Auto-Booking'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TripAutoBooking;
