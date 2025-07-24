import { useState } from 'react';
import { Link } from "react-router-dom";
import { X, Plus } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import { useWallet } from "@/contexts/WalletContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { AddCardModal } from "@/components/wallet/AddCardModal";
function WalletPage() {
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const { 
    paymentMethods, 
    loading, 
    error, 
    refreshPaymentMethods, 
    setDefaultPaymentMethod, 
    deletePaymentMethod 
  } = useWallet();
  const { user } = useCurrentUser();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSetDefault = async (paymentMethod: any) => {
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
      await setDefaultPaymentMethod(paymentMethod.id);
      
      toast({
        title: "Payment method updated",
        description: "Your default payment method has been updated.",
      });
    } catch (err: unknown) {
      console.error("Error setting default payment method:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'An unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDeleteCard = async (paymentMethod: any) => {
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
      await deletePaymentMethod(paymentMethod.id);
      
      toast({
        title: "Payment method deleted",
        description: "Your payment method has been removed successfully.",
      });
    } catch (err: unknown) {
      console.error("Error deleting payment method:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'An unknown error occurred',
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
            {error && <p className="text-red-600">Error loading cards: {error}</p>}

            {paymentMethods && paymentMethods.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {paymentMethods.map((pm: any) => (
                  <li key={pm.id} className="py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {pm.brand?.toUpperCase() || 'UNKNOWN'}
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
            ) : !loading && (
              <p className="text-gray-600 py-4">No payment methods saved yet.</p>
            )}

            {/* Add Payment Method Section */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Add Payment Method</h2>
                <Button
                  onClick={() => setShowAddForm(!showAddForm)}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  {showAddForm ? (
                    <>
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Add New Card</span>
                    </>
                  )}
                </Button>
              </div>
              
              <AddCardModal
                isOpen={showAddForm}
                onClose={() => setShowAddForm(false)}
                onSuccess={() => {
                  setShowAddForm(false);
                  refreshPaymentMethods();
                }}
              />
            </div>

            {!stripeKey && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
                <p className="text-yellow-700">
                  Stripe isn't configured. Please set <code>VITE_STRIPE_PUBLISHABLE_KEY</code> in your
                  <code>.env</code>.
                </p>
              </div>
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
