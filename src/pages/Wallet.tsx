
import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { Link } from "react-router-dom";
import { usePaymentMethods, PaymentMethod } from "@/hooks/usePaymentMethods";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { safeQuery } from "@/lib/supabaseUtils";

function WalletPage() {
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  const { data, error, isLoading, refetch } = usePaymentMethods();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string|null>(null);

  const handleSetDefault = async (id: string) => {
    try {
      setIsUpdating(id);
      
      // First, update all payment methods to not be default
      await supabase
        .from('payment_methods')
        .update({ is_default: false, updated_at: new Date().toISOString() })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
        
      // Then set the selected one as default
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_default: true, updated_at: new Date().toISOString() })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Payment method updated",
        description: "Your default payment method has been updated.",
      });
      
      refetch();
    } catch (err: any) {
      toast({
        title: "Error",
        description: `Failed to update default payment method: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDeleteCard = async (id: string) => {
    try {
      setIsUpdating(id);
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Payment method deleted",
        description: "Your payment method has been removed.",
      });
      
      refetch();
    } catch (err: any) {
      toast({
        title: "Error",
        description: `Failed to delete payment method: ${err.message}`,
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
            
            {isLoading && <p className="text-gray-600">Loading saved cards…</p>}
            {error && <p className="text-red-600">Error loading cards: {error.message}</p>}

            {data?.length ? (
              <ul className="divide-y divide-gray-200">
                {data.map((pm: PaymentMethod) => (
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
                        <button 
                          onClick={() => handleSetDefault(pm.id)} 
                          disabled={isUpdating !== null}
                          className="text-sm text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                        >
                          {isUpdating === pm.id ? 'Updating...' : 'Make default'}
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteCard(pm.id)}
                        disabled={isUpdating !== null} 
                        className="text-sm text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {isUpdating === pm.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : !isLoading && (
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
                <button
                  disabled={isCreating}
                  onClick={async () => {
                    setFetchError(null);
                    setIsCreating(true);
                    try {
                      const res = await fetch("/functions/v1/create-setup-session", { method: "POST" });
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
                </button>
                {fetchError && <p className="text-red-600 mt-2">{fetchError}</p>}
              </>
            )}

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
