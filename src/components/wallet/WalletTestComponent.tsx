/**
 * Test component to verify wallet context is globally available
 */
import * as React from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function WalletTestComponent() {
  const { paymentMethods, loading, error } = useWallet();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Wallet Context Test
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {loading ? 'Loading' : 'Ready'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            <strong>Status:</strong> {loading ? 'Loading...' : 'Connected'}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Payment Methods:</strong> {paymentMethods.length}
          </p>
          {error && (
            <p className="text-sm text-red-600">
              <strong>Error:</strong> {error}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-4">
            This component tests that the WalletContext is globally accessible.
            If you can see this data, the context is working correctly.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
