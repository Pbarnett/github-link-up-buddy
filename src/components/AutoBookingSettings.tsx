
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { AlertCircle, CreditCard } from "lucide-react";

interface AutoBookingSettingsProps {
  tripRequestId: string;
  initialSettings?: {
    auto_book_enabled: boolean;
    max_price?: number;
    preferred_payment_method_id?: string;
  };
}

const AutoBookingSettings = ({ tripRequestId, initialSettings }: AutoBookingSettingsProps) => {
  const { userId } = useCurrentUser();
  const { paymentMethods, loading: paymentMethodsLoading } = usePaymentMethods();
  const [autoBookEnabled, setAutoBookEnabled] = useState(initialSettings?.auto_book_enabled || false);
  const [maxPrice, setMaxPrice] = useState(initialSettings?.max_price?.toString() || "");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(initialSettings?.preferred_payment_method_id || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [travelerDataExists, setTravelerDataExists] = useState(false);

  useEffect(() => {
    checkTravelerData();
  }, [tripRequestId]);

  const checkTravelerData = async () => {
    try {
      const { data: bookingRequests, error } = await supabase
        .from("booking_requests")
        .select("traveler_data")
        .eq("user_id", userId)
        .not("traveler_data", "is", null)
        .limit(1);

      if (error) {
        console.error("Error checking traveler data:", error);
        return;
      }

      setTravelerDataExists(bookingRequests && bookingRequests.length > 0);
    } catch (err) {
      console.error("Exception checking traveler data:", err);
    }
  };

  const canEnableAutoBooking = () => {
    return travelerDataExists && paymentMethods.length > 0 && selectedPaymentMethod;
  };

  const handleAutoBookToggle = async (enabled: boolean) => {
    if (enabled && !canEnableAutoBooking()) {
      if (!travelerDataExists) {
        toast({
          title: "Traveler Information Required",
          description: "Please complete a booking first to save your traveler information for auto-booking.",
          variant: "destructive",
        });
        return;
      }
      
      if (paymentMethods.length === 0) {
        toast({
          title: "Payment Method Required",
          description: "Please add a payment method to your wallet before enabling auto-booking.",
          variant: "destructive",
        });
        return;
      }
      
      if (!selectedPaymentMethod) {
        toast({
          title: "Select Payment Method",
          description: "Please select a payment method for auto-booking.",
          variant: "destructive",
        });
        return;
      }
    }

    setAutoBookEnabled(enabled);
    await updateSettings();
  };

  const updateSettings = async () => {
    if (!userId) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("trip_requests")
        .update({
          auto_book_enabled: autoBookEnabled,
          max_price: maxPrice ? parseFloat(maxPrice) : null,
          preferred_payment_method_id: selectedPaymentMethod || null,
        })
        .eq("id", tripRequestId);

      if (error) throw error;

      toast({
        title: "Settings Updated",
        description: "Auto-booking settings have been saved.",
      });
    } catch (error: any) {
      console.error("Error updating auto-booking settings:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update auto-booking settings.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const defaultPaymentMethod = paymentMethods.find(pm => pm.is_default);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Auto-Booking Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Auto-booking Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-book">Enable Auto-Booking</Label>
            <p className="text-sm text-gray-500">
              Automatically book flights that match your criteria
            </p>
          </div>
          <Switch
            id="auto-book"
            checked={autoBookEnabled}
            onCheckedChange={handleAutoBookToggle}
            disabled={isUpdating}
          />
        </div>

        {/* Requirements Check */}
        {!canEnableAutoBooking() && (
          <div className="p-3 border border-amber-200 bg-amber-50 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">Requirements for Auto-Booking:</p>
                <ul className="mt-1 space-y-1 text-amber-700">
                  {!travelerDataExists && (
                    <li>• Complete a manual booking first to save traveler information</li>
                  )}
                  {paymentMethods.length === 0 && (
                    <li>• Add a payment method to your wallet</li>
                  )}
                  {paymentMethods.length > 0 && !selectedPaymentMethod && (
                    <li>• Select a payment method below</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Maximum Price */}
        <div className="space-y-2">
          <Label htmlFor="max-price">Maximum Price (USD)</Label>
          <Input
            id="max-price"
            type="number"
            placeholder="e.g., 500"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            disabled={isUpdating}
          />
          <p className="text-sm text-gray-500">
            Only auto-book flights at or below this price
          </p>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-2">
          <Label htmlFor="payment-method">Payment Method</Label>
          {paymentMethodsLoading ? (
            <div className="h-10 bg-gray-100 rounded animate-pulse" />
          ) : paymentMethods.length === 0 ? (
            <div className="p-3 border border-gray-200 rounded-md text-sm text-gray-500">
              No payment methods available. Add one in your wallet first.
            </div>
          ) : (
            <Select
              value={selectedPaymentMethod}
              onValueChange={setSelectedPaymentMethod}
              disabled={isUpdating}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((pm) => (
                  <SelectItem key={pm.id} value={pm.id}>
                    <div className="flex items-center">
                      <span className="capitalize">{pm.brand}</span>
                      <span className="ml-2">•••• {pm.last4}</span>
                      {pm.is_default && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Save Button */}
        <Button 
          onClick={updateSettings} 
          disabled={isUpdating}
          className="w-full"
        >
          {isUpdating ? "Saving..." : "Save Settings"}
        </Button>

        {autoBookEnabled && (
          <div className="p-3 border border-green-200 bg-green-50 rounded-md">
            <p className="text-sm text-green-800">
              ✅ Auto-booking is enabled. We'll automatically book flights that match your criteria 
              and are within your budget using {defaultPaymentMethod ? `${defaultPaymentMethod.brand} •••• ${defaultPaymentMethod.last4}` : 'your selected payment method'}.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AutoBookingSettings;
