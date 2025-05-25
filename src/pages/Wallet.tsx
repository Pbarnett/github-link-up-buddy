
import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { Link } from "react-router-dom";
import { usePaymentMethods, PaymentMethod } from "@/hooks/usePaymentMethods";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { safeQuery } from "@/lib/supabaseUtils";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

function WalletPage() {
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  const {
    paymentMethods,
    error: paymentMethodsError,
    loading,
    refetch,
  } = usePaymentMethods();
  const { user } = useCurrentUser();

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  // …
}

  const handleSetDefault = async (paymentMethod: PaymentMethod) => {
    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUpdating(paymentMethod.id);
      
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/set-default-payment-method`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
          body: JSON.stringify({ 
            id: paymentMethod.id  // Keep using the database ID since our edge function expects it
          }),
        }
      );
      
      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = "Failed to update default payment method";
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }
      
      toast({
        title: "Payment method updated",
        description: "Your default payment method has been updated in both our system and Stripe.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["payment_methods"] });
    } catch (err: any) {
      console.error("Error setting default payment method:", err);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDeleteCard = async (paymentMethod: PaymentMethod) => {
    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod.is_default) {
      toast({
        title: "Cannot delete default payment method",
        description: "Please set another payment method as default before deleting this one.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUpdating(paymentMethod.id);
      
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-payment-method`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
          body: JSON.stringify({ 
            id: paymentMethod.id  // Keep using the database ID since our edge function expects it
          }),
        }
      );
      
      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = "Failed to delete payment method";
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }
      
      toast({
        title: "Payment method deleted",
        description: "Your payment method has been removed from both our system and Stripe.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["payment_methods"] });
    } catch (err: any) {
      console.error("Error deleting payment method:", err);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Wallet</h1>
            
            {loading && <p className="text-gray-600">Loading saved cards…</p>}
            {paymentMethodsError && <p className="text-red-600">Error loading cards: {paymentMethodsError.message}</p>}

            {paymentMethods && paymentMethods.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {paymentMethods.map((pm: PaymentMethod) => (
                  <li key={pm.id} className="py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {pm.brand.toUpperCase()}
                      </span>
                      <span className="text-gray-900">•••• {pm.last4}</span>
                      <span className="text-gray-500 text-sm">
                        Exp: {pm.exp_month}/{pm.exp_year}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      {pm.is_default ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Default
                        </span>
                      ) : (
                        <Button 
                          onClick={() => handleSetDefault(pm)} 
                          disabled={isUpdating !== null}
                          variant="outline" 
                          size="sm"
                          className="text-sm text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                        >
                          {isUpdating === pm.id ? 'Updating...' : 'Make default'}
                        </Button>
                      )}
                      <Button 
                        onClick={() => handleDeleteCard(pm)}
                        disabled={isUpdating !== null || pm.is_default} 
                        variant="outline"
                        size="sm"
                        className="text-sm text-red-600 hover:text-red-900 disabled:opacity-50"
                        title={pm.is_default ? "Cannot delete default payment method" : "Delete payment method"}
                      >
                        {isUpdating === pm.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : !loading && !paymentMethodsError && (
              <p className="text-gray-600 py-4">No payment methods saved yet.</p>
            )}

            {!stripeKey && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
                <p className="text-yellow-700">
                  Stripe isn't configured. Please set <code>VITE_STRIPE_PUBLIC_KEY</code> in your
                  <code>.env</code>.
                </p>
              </div>
            )}

            {stripeKey && (
              <>
                <Button
                  disabled={isCreating}
                  onClick={async () => {
                    setFetchError(null);
                    setIsCreating(true);
                    try {
                      const res = await fetch(
                        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-setup-session`, 
                        {
                          method: "POST",
                          headers: { 
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
                          }
                        }
                      );
                      const { url } = await res.json();
                      window.location.href = url;
                    } catch (err: any) {
                      setFetchError(err.message);
                    } finally {
                      setIsCreating(false);
                    }
                  }}
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isCreating ? "Redirecting…" : "Add a new card"}
                </Button>
                {fetchError && <p className="text-red-600 mt-2">{fetchError}</p>}
              </>
            )}

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Enhanced Security</h3>
              <p className="text-sm text-blue-700">
                All payment method changes are now synchronized with Stripe for enhanced security. 
                Setting a payment method as default will update your Stripe customer profile, 
                and deleting a payment method will remove it from both our system and Stripe.
              </p>
            </div>

            <Link
              to="/dashboard"
              className="inline-block text-indigo-600 hover:underline mt-4"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Wallet() {
  return (
    <AuthGuard>
      <WalletPage />
    </AuthGuard>
  );
}
