
import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { Link } from "react-router-dom";
import { usePaymentMethods, PaymentMethod } from "@/hooks/usePaymentMethods";
import { supabase } from "@/integrations/supabase/client";

function WalletPage() {
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  const { data, error, isLoading, refetch } = usePaymentMethods();
  const [isCreating, setIsCreating] = useState(false);
  const [fetchError, setFetchError] = useState<string|null>(null);

  const handleSetDefault = async (id: string) => {
    // This is a placeholder function that will be implemented later
    console.log("Setting default payment method:", id);
    // TODO: Implement the actual API call to set default payment method
  };

  const handleDeleteCard = async (id: string) => {
    // This is a placeholder function that will be implemented later
    console.log("Deleting payment method:", id);
    // TODO: Implement the actual API call to delete payment method
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Wallet</h1>
            
            {isLoading && <p>Loading saved cards…</p>}
            {error && <p className="text-red-600">Error loading cards: {error.message}</p>}

            {data?.length ? (
              <ul>
                {data.map((pm: PaymentMethod) => (
                  <li key={pm.id} className="flex justify-between items-center">
                    <span>{pm.brand.toUpperCase()} •••• {pm.last4}</span>
                    <div className="space-x-2">
                      {pm.is_default
                        ? <span className="text-green-600">Default</span>
                        : <button onClick={() => handleSetDefault(pm.id)}>Make default</button>
                      }
                      <button onClick={() => handleDeleteCard(pm.id)} className="text-red-600">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No cards saved yet.</p>
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
                  className="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isCreating ? "Redirecting…" : "Add a new card"}
                </button>
                {fetchError && <p className="text-red-600">{fetchError}</p>}
              </>
            )}

            <Link
              to="/dashboard"
              className="inline-block text-indigo-600 hover:underline"
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
