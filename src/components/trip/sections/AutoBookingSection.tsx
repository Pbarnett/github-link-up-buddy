
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Control, useWatch } from "react-hook-form";
import { FormValues } from "@/types/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, DollarSign, CreditCard } from "lucide-react";
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
            {/* Maximum Price */}
            <FormField
              control={control}
              name="max_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Maximum Price {isAutoMode && <span className="text-red-500">*</span>}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        type="number"
                        placeholder="2000"
                        className="pl-8"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      />
                    </div>
                  </FormControl>
                  <div className="text-xs text-gray-500">
                    We'll only book flights under this price
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                              ? "No payment methods available"
                              : "Select payment method"
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          <div className="flex items-center gap-2">
                            <span className="capitalize">{method.brand}</span>
                            <span>•••• {method.last4}</span>
                            {method.is_default && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Default</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {paymentMethods.length === 0 && !isLoadingPaymentMethods && (
                    <div className="text-xs text-amber-600">
                      You'll need to add a payment method before enabling auto-booking
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AutoBookingSection;
