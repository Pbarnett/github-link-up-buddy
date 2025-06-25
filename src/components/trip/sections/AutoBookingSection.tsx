
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Control, useWatch } from "react-hook-form";
import { FormValues } from "@/types/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, DollarSign, CreditCard, Shield } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";

interface AutoBookingSectionProps {
  control: Control<FormValues>;
  mode?: 'manual' | 'auto';
}

const AutoBookingSection = ({ control, mode }: AutoBookingSectionProps) => {
  const { data: paymentMethods, isLoading: isLoadingPaymentMethods } = usePaymentMethods();
  
  // Watch the auto_book_enabled field to conditionally show fields
  const autoBookEnabled = useWatch({
    control,
    name: "auto_book_enabled",
  });

  // Watch max_price for display
  const maxPrice = useWatch({
    control,
    name: "max_price",
  });

  // For auto mode, auto-booking should be enabled and section should be expanded
  const isAutoMode = mode === 'auto';
  const shouldShowFields = isAutoMode || autoBookEnabled;

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg">Auto-Booking</CardTitle>
        </div>
        <p className="text-sm text-gray-600">
          {isAutoMode 
            ? "Configure automatic booking when flights match your criteria"
            : "Automatically book flights when they meet your criteria"
          }
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Auto-booking toggle - hidden in auto mode since it's always enabled */}
        {!isAutoMode && (
          <FormField
            control={control}
            name="auto_book_enabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-base font-medium">
                    Enable Auto-Booking
                  </FormLabel>
                  <div className="text-sm text-gray-600">
                    Automatically book when criteria are met
                  </div>
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
        )}

        {/* Show additional fields when auto-booking is enabled */}
        {shouldShowFields && (
          <div className="space-y-4 border-t pt-4">
            {/* Price information - display only in auto mode */}
            {isAutoMode && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Price Limit</span>
                </div>
                <p className="text-sm text-blue-700">
                  We'll only buy if the fare is <span className="font-semibold">${maxPrice || 1000}</span> or less.
                </p>
              </div>
            )}

            {/* Payment Method Selection */}
            <FormField
              control={control}
              name="preferred_payment_method_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Payment Method {isAutoMode && <span className="text-red-500">*</span>}
                  </FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || ""}
                    disabled={isLoadingPaymentMethods}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          isLoadingPaymentMethods 
                            ? "Loading payment methods..." 
                            : paymentMethods.length === 0
                              ? "No payment method on file — add one to continue."
                              : "Select payment method"
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          <div className="flex items-center gap-2">
                            <span className="capitalize">{method.brand}</span>
                            <span>••{method.last4}</span>
                            {method.is_default && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Default</span>
                            )}
                            {method.nickname && (
                              <span className="text-xs text-gray-500">({method.nickname})</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {paymentMethods.length === 0 && !isLoadingPaymentMethods && (
                    <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-3 mt-2">
                      <Shield className="h-4 w-4" />
                      No payment method on file — add one to continue.
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Authorization Confirmation - only show in auto mode */}
            {isAutoMode && (
              <FormField
                control={control}
                name="auto_book_consent"
                render={({ field }) => (
                  <FormItem className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-1"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium">
                          I authorize Parker Flight to charge my saved card and issue the ticket automatically when the above criteria are met. I can void within 24 h.
                        </FormLabel>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AutoBookingSection;
