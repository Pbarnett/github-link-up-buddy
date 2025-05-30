
import { useState } from "react";
import { Control } from "react-hook-form";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CircleAlertIcon } from "lucide-react";

interface AutoBookingSectionProps {
  control: Control<any>;
  watch: (name: string) => any;
}

const AutoBookingSection = ({ control, watch }: AutoBookingSectionProps) => {
  const { paymentMethods, loading, error } = usePaymentMethods();
  const autoBook = watch("auto_book"); // Changed variable name and watched field name

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="auto_book" // Changed field name
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Enable Auto-Booking</FormLabel>
              <FormDescription>
                Automatically book flights when they match your criteria
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {autoBook && ( // Changed conditional variable
        <>
          <TripNumberField 
            name="max_price"
            label="Maximum Price (USD)"
            description="We'll only auto-book flights under this price"
            placeholder="Enter maximum price"
            prefix="$"
            control={control}
          />

          <FormField
            control={control}
            name="preferred_payment_method_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <Select
                  disabled={loading || !!error || !paymentMethods || paymentMethods.length === 0}
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
                        {method.nickname ? ` (${method.nickname})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the payment method to use for auto-booking
                </FormDescription>
              </FormItem>
            )}
          />

          {error && (
            <Alert variant="destructive">
              <CircleAlertIcon className="h-4 w-4" />
              <AlertDescription>
                Error loading payment methods: {error.message}
              </AlertDescription>
            </Alert>
          )}
          {(!error && !loading && (!paymentMethods || paymentMethods.length === 0)) && (
            <Alert variant="destructive">
              <CircleAlertIcon className="h-4 w-4" />
              <AlertDescription>
                You need to add a payment method in your wallet before using auto-booking.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
};

export default AutoBookingSection;
