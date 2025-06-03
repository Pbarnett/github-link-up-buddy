
import { Control, useFormContext } from "react-hook-form";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { useTravelerInfoCheck } from "@/hooks/useTravelerInfoCheck";
import { useToast } from "@/components/ui/use-toast";
import { 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import TripNumberField from "../TripNumberField";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlertIcon, Loader2 } from "lucide-react";

interface AutoBookingSectionProps {
  control: Control<any>; // Control is still needed for FormField
  // watch is part of useFormContext, so can be removed from props if using the hook
}

const AutoBookingSection = ({ control }: AutoBookingSectionProps) => {
  const { watch, setValue, getValues } = useFormContext(); // Get form methods
  const { data: paymentMethods, isLoading: isLoadingPaymentMethods } = usePaymentMethods();
  const {
    hasTravelerInfo,
    isLoading: isLoadingTravelerInfo,
    // error: travelerInfoError // Not directly used for now, but could be
  } = useTravelerInfoCheck();
  const { toast } = useToast();

  const autoBookEnabled = watch("auto_book_enabled");
  const selectedPaymentMethodId = watch("preferred_payment_method_id");

  const handleAutoBookToggle = async (enabled: boolean) => {
    if (enabled) {
      // Check prerequisites only when attempting to enable
      if (isLoadingTravelerInfo || isLoadingPaymentMethods) {
        toast({
          title: "Checking requirements...",
          description: "Please wait while we verify auto-booking eligibility.",
        });
        setValue("auto_book_enabled", false); // Revert immediately, user can try again
        return;
      }

      let canEnable = true;
      let message = "";

      if (!hasTravelerInfo) {
        canEnable = false;
        message = "Traveler Information Required. Please complete a manual booking first to save your traveler information for auto-booking.";
      } else if (!paymentMethods || paymentMethods.length === 0) {
        canEnable = false;
        message = "Payment Method Required. Please add a payment method to your wallet before enabling auto-booking.";
      }
      // The schema refinement already checks if a payment method is *selected* when auto_book_enabled is true at form submit.
      // Here, we are checking if one *can* be selected.

      if (!canEnable) {
        toast({
          title: "Auto-Booking Disabled",
          description: message,
          variant: "destructive",
        });
        setValue("auto_book_enabled", false); // Ensure switch is off
        return;
      }
    }
    // If all checks pass (or if disabling), proceed to change the value
    setValue("auto_book_enabled", enabled, { shouldValidate: true });
  };

  const showMissingTravelerInfoAlert = !isLoadingTravelerInfo && !hasTravelerInfo;
  const showMissingPaymentMethodsAlert = !isLoadingPaymentMethods && (!paymentMethods || paymentMethods.length === 0);
  // Alert if auto-booking is enabled but no payment method is selected yet.
  const showSelectPaymentMethodAlert = autoBookEnabled && !selectedPaymentMethodId && paymentMethods && paymentMethods.length > 0;


  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="auto_book_enabled"
        render={({ field }) => ( // field provides onChange, value, etc.
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Enable Auto-Booking</FormLabel>
              <FormDescription>
                Automatically book flights when they match your criteria.
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={handleAutoBookToggle} // Use our custom handler
                disabled={isLoadingTravelerInfo || isLoadingPaymentMethods}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {(isLoadingTravelerInfo || isLoadingPaymentMethods) && autoBookEnabled && (
         <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertTitle>Loading Prerequisites</AlertTitle>
            <AlertDescription>
              Verifying traveler information and payment methods...
            </AlertDescription>
          </Alert>
      )}

      {showMissingTravelerInfoAlert && (
        <Alert variant="warning">
          <CircleAlertIcon className="h-4 w-4" />
          <AlertTitle>Traveler Information Needed</AlertTitle>
          <AlertDescription>
            To use auto-booking, please complete at least one manual booking to save your traveler details.
          </AlertDescription>
        </Alert>
      )}

      {showMissingPaymentMethodsAlert && (
         <Alert variant="warning">
          <CircleAlertIcon className="h-4 w-4" />
          <AlertTitle>Payment Method Needed</AlertTitle>
          <AlertDescription>
            Please add a payment method to your wallet to enable auto-booking.
          </AlertDescription>
        </Alert>
      )}

      {showSelectPaymentMethodAlert && (
         <Alert variant="info">
          <CircleAlertIcon className="h-4 w-4" />
          <AlertTitle>Select Payment Method</AlertTitle>
          <AlertDescription>
            Please select a payment method below for auto-booking.
          </AlertDescription>
        </Alert>
      )}


      {autoBookEnabled && !isLoadingTravelerInfo && hasTravelerInfo && (
        <>
          <TripNumberField 
            name="max_price"
            label="Maximum Price (USD) for Auto-Booking"
            description="We'll only auto-book flights under this price"
            placeholder="Enter maximum price"
            prefix="$"
            control={control} // Pass control here
          />

          <FormField
            control={control} // Pass control here
            name="preferred_payment_method_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method for Auto-Booking</FormLabel>
                <Select
                  disabled={isLoadingPaymentMethods || !paymentMethods || paymentMethods.length === 0}
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paymentMethods && paymentMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        {method.brand} •••• {method.last4}
                        {method.is_default && " (Default)"}
                        {method.nickname ? ` (${method.nickname})` : ''}
                      </SelectItem>
                    ))}
                     {(!paymentMethods || paymentMethods.length === 0) && !isLoadingPaymentMethods && (
                        <div className="p-2 text-sm text-muted-foreground">No payment methods found.</div>
                     )}
                     {isLoadingPaymentMethods && (
                        <div className="p-2 text-sm text-muted-foreground flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin mr-2"/> Loading...
                        </div>
                     )}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the payment method for auto-booking.
                </FormDescription>
                {/* Redundant with the alert above, but can be kept if specific field error is needed from schema validation */}
                {/* {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>} */}
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
};

export default AutoBookingSection;
