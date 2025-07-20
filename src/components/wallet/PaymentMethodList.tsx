import * as React from 'react';
const { useState } = React;

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Plus, 
  Trash2
} from 'lucide-react';
import { PaymentMethodListProps, CARD_BRANDS } from '@/types/wallet';
import { useToast } from '@/hooks/use-toast';
import { WalletNickname } from './WalletNickname';

export function PaymentMethodList({
  paymentMethods,
  loading,
  onAddNew,
  onSetDefault,
  onDelete,
  onUpdateNickname,
}: PaymentMethodListProps) {
  const { toast } = useToast();
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const handleDelete = async (id: string) => {
    try {
      setDeletingIds(prev => new Set(prev).add(id));
      await onDelete(id);
      toast({
        title: 'Payment method deleted',
        description: 'Your payment method has been removed successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete payment method',
        variant: 'destructive',
      });
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const formatExpiry = (month: number, year: number) => {
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
  };

  const isExpiringSoon = (month: number, year: number) => {
    const now = new Date();
    const expiryDate = new Date(year, month - 1);
    const threeMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 3);
    
    return expiryDate <= threeMonthsFromNow;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" aria-hidden="true" />
            Payment Methods
            <Badge variant="secondary" className="ml-2" aria-live="polite">
              Loading...
            </Badge>
          </CardTitle>
          <CardDescription>
            Manage your saved payment methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div aria-live="polite" aria-label="Loading payment methods">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-4 border rounded-lg animate-pulse"
                role="status"
                aria-label={`Loading payment method ${i + 1} of 3`}
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Methods
            </CardTitle>
            <CardDescription>
              Manage your saved payment methods
            </CardDescription>
          </div>
          <Button 
            onClick={onAddNew} 
            className="flex items-center gap-2"
            aria-label="Add new payment method"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Card
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {paymentMethods.length === 0 ? (
          <div className="space-y-4" data-testid="empty-payment-methods">
            <Alert className="border-blue-200 bg-blue-50">
              <CreditCard className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                No payment methods found. Add your first payment method to get started with faster, more secure bookings.
              </AlertDescription>
            </Alert>
            <div className="text-center py-6">
              <Button 
                onClick={onAddNew} 
                size="lg" 
                className="flex items-center gap-2"
                aria-label="Add your first payment method"
                data-testid="add-card-button"
              >
                <Plus className="h-5 w-5" aria-hidden="true" />
                Add Your First Card
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4" data-testid="payment-methods-section" role="list" aria-label="Payment methods">
            {paymentMethods.map((method) => {
              const brand = CARD_BRANDS[method.brand] || CARD_BRANDS.unknown;
              const isExpiring = isExpiringSoon(method.exp_month, method.exp_year);
              const isDeleting = deletingIds.has(method.id);

              // Convert to PaymentMethod format for WalletNickname component
              const paymentMethodForNickname = {
                id: method.id,
                last4: method.last4,
                brand: brand.name,
                nickname: method.nickname,
                isDefault: method.is_default
              };

              return (
                <div key={method.id} role="listitem" className="relative">
                  {/* Add accessibility live region for status updates */}
                  <div 
                    aria-live="polite" 
                    aria-atomic="true" 
                    className="sr-only"
                    id={`status-${method.id}`}
                  >
                    {isDeleting ? 'Deleting payment method...' : ''}
                  </div>
                  
                  <div className="grid gap-4 lg:grid-cols-2">
                    {/* Enhanced WalletNickname component with additional context */}
                    <div className="lg:col-span-1">
                      <WalletNickname
                        paymentMethod={paymentMethodForNickname}
                        onUpdateNickname={onUpdateNickname}
                        onSetDefault={onSetDefault}
                      />
                    </div>
                    
                    {/* Additional payment method details and actions */}
                    <div className="lg:col-span-1 space-y-3">
                      {/* Expiry and status information */}
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Card Details</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Expires {formatExpiry(method.exp_month, method.exp_year)}</span>
                            {method.funding && (
                              <span className="capitalize">• {method.funding}</span>
                            )}
                          </div>
                          {isExpiring && (
                            <Badge variant="destructive" className="text-xs">
                              ⚠️ Expiring Soon
                            </Badge>
                          )}
                        </div>
                        
                        {/* Action buttons with proper accessibility */}
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(method.id)}
                            disabled={isDeleting}
                            aria-label={`Delete ${brand.name} ending in ${method.last4}`}
                            aria-describedby={`status-${method.id}`}
                            className="min-h-[44px] min-w-[44px]" // Ensure touch target size
                          >
                            {isDeleting ? (
                              <div 
                                className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" 
                                aria-label="Deleting..."
                              />
                            ) : (
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            )}
                            <span className="sr-only">
                              {isDeleting ? 'Deleting payment method' : 'Delete payment method'}
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
