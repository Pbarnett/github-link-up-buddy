
// PaymentMethodList.tsx - Component to display and manage payment methods
// Day 4: Payments & Wallet System

import * as React from 'react';
import { Button } from '../components/ui/button';
import { useWallet } from '../context/WalletProvider';

type _Component<P = {}, S = {}> = React.Component<P, S>;
type FC<T = {}> = React.FC<T>;

export const PaymentMethodList: FC = () => {
  const { paymentMethods, setDefault, removePaymentMethod } = useWallet();

  return (
    <div>
      <h2>Payment Methods</h2>
      <ul>
        {paymentMethods.map(pm => (
          <li key={pm.id} className="border p-2 rounded">
            <p>{pm.brand.toUpperCase()} •••• {pm.last4}</p>
            <Button
              onClick={() => setDefault(pm.id)}
              disabled={pm.is_default}
            >
              {pm.is_default ? 'Default' : 'Set as Default'}
            </Button>
            <Button onClick={() => removePaymentMethod(pm.id)}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
      {!paymentMethods.length && <p>No payment methods found.</p>}
    </div>
  );
};

