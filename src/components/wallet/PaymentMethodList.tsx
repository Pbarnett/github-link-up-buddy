import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Plus, 
  Settings, 
  Shield, 
  Star,
  Trash2,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { PaymentMethod, PaymentMethodListProps, CARD_BRANDS } from '@/types/wallet';
import { useToast } from '@/hooks/use-toast';

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
  const [editingNickname, setEditingNickname] = useState<string | null>(null);
  const [nicknameValue, setNicknameValue] = useState('');

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

  const handleSetDefault = async (id: string) => {
    try {
      await onSetDefault(id);
      toast({
        title: 'Default payment method updated',
        description: 'Your default payment method has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to set default payment method',
        variant: 'destructive',
      });
    }
  };

  const handleNicknameEdit = (id: string, currentNickname?: string) => {
    setEditingNickname(id);
    setNicknameValue(currentNickname || '');
  };

  const handleNicknameSave = async (id: string) => {
    try {
      await onUpdateNickname(id, nicknameValue.trim() || undefined);
      setEditingNickname(null);
      setNicknameValue('');
      toast({
        title: 'Nickname updated',
        description: 'Payment method nickname has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update nickname',
        variant: 'destructive',
      });
    }
  };

  const handleNicknameCancel = () => {
    setEditingNickname(null);
    setNicknameValue('');
  };

  const formatExpiry = (month: number, year: number) => {
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
  };

  const isExpiringSoon = (month: number, year: number) => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const expiryDate = new Date(year, month - 1);
    const threeMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 3);
    
    return expiryDate <= threeMonthsFromNow;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Methods
          </CardTitle>
          <CardDescription>
            Manage your saved payment methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
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
          <Button onClick={onAddNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Card
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {paymentMethods.length === 0 ? (
          <Alert>
            <CreditCard className="h-4 w-4" />
            <AlertDescription>
              No payment methods found. Add your first payment method to get started.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => {
              const brand = CARD_BRANDS[method.brand] || CARD_BRANDS.unknown;
              const isExpiring = isExpiringSoon(method.exp_month, method.exp_year);
              const isDeleting = deletingIds.has(method.id);
              const isEditingThisNickname = editingNickname === method.id;

              return (
                <div
                  key={method.id}
                  className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                    method.is_default ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${brand.color} text-white`}>
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {isEditingThisNickname ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={nicknameValue}
                              onChange={(e) => setNicknameValue(e.target.value)}
                              className="px-2 py-1 text-sm border rounded"
                              placeholder="Enter nickname"
                              autoFocus
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleNicknameSave(method.id)}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleNicknameCancel}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              {method.nickname || `${brand.name} ••••${method.last4}`}
                            </p>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleNicknameEdit(method.id, method.nickname)}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        {method.is_default && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            Default
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Expires {formatExpiry(method.exp_month, method.exp_year)}</span>
                        {method.funding && (
                          <span className="capitalize">• {method.funding}</span>
                        )}
                        {isExpiring && (
                          <Badge variant="destructive" className="text-xs">
                            Expiring Soon
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!method.is_default && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSetDefault(method.id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(method.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
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
