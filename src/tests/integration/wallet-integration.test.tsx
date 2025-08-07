import React from 'react';
import * as React from 'react';
import * as React from 'react'; } from '@testing-library/react';

import Wallet from '@/pages/Wallet';

// Mocking WalletContext and CurrentUser context
vi.mock('@/contexts/WalletContext', () => ({
  useWallet: () => ({
    paymentMethods: [
      {
        id: 'card_1',
        brand: 'visa',
        last4: '4242',
        exp_month: '12',
        exp_year: '2025',
        is_default: true,
      },
      {
        id: 'card_2',
        brand: 'mastercard',
        last4: '1111',
        exp_month: '06',
        exp_year: '2026',
        is_default: false,
      },
    ],
    loading: false,
    error: null,
    refreshPaymentMethods: vi.fn(),
    setDefaultPaymentMethod: vi.fn(),
    deletePaymentMethod: vi.fn(),
  }),
}));

vi.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: () => ({
    user: { id: 'user_123' },
  }),
}));

vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}));

vi.mock('@/components/AuthGuard', () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('@/components/wallet/AddCardModal', () => ({
  AddCardModal: ({
    isOpen,
    onClose,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) => {
    return isOpen ? (
      <div data-testid="add-card-modal">
        <button onClick={onClose}>Close Modal</button>
        <div>Add Card Form</div>
      </div>
    ) : null;
  },
}));

// Integration test
describe('Wallet Page Integration Test', () => {
  it('renders wallet page with payment methods and shows default card', async () => {
    render(
      <BrowserRouter>
        <Wallet />
      </BrowserRouter>
    );

    expect(screen.getByText(/Wallet/)).toBeInTheDocument();
    expect(screen.getByText(/VISA/)).toBeInTheDocument();
    expect(screen.getByText(/•••• 4242/)).toBeInTheDocument();
    expect(screen.getByText(/Exp: 12\/2025/)).toBeInTheDocument();
    expect(screen.getByText(/MASTERCARD/)).toBeInTheDocument();
    expect(screen.getByText(/•••• 1111/)).toBeInTheDocument();

    // Default payment method should show "Default" badge
    const defaultBadge = screen.getByText('Default');
    expect(defaultBadge).toBeInTheDocument();

    // Non-default card should have "Make default" button
    const makeDefaultButton = screen.getByText('Make default');
    expect(makeDefaultButton).toBeInTheDocument();
    expect(makeDefaultButton).not.toBeDisabled();
  });

  it('opens add card modal and cancels it', () => {
    render(
      <BrowserRouter>
        <Wallet />
      </BrowserRouter>
    );

    // Check that add new card modal can be toggled
    const addButton = screen.getByText('Add New Card');
    fireEvent.click(addButton);
    expect(screen.getByText('Cancel')).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(screen.getByText('Add New Card')).toBeInTheDocument();
  });
});
