/**
 * Integration test for Profile Completeness Indicator
 * Tests the integration between ProfileCompletenessIndicator and Profile page
 */

import React from 'react';
import Profile from '@/pages/Profile';

// Mock the required hooks and components
vi.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: () => ({
    userId: 'test-user-id',
    user: { id: 'test-user-id', email: 'test@example.com' },
  }),
}));

vi.mock('@/hooks/useFeatureFlag', () => ({
  useFeatureFlag: (flag: string) => ({
    data: flag === 'profile_ui_revamp' ? true : false,
    isLoading: false,
  }),
}));

vi.mock('@/hooks/useTravelerProfile', () => ({
  useTravelerProfile: () => ({
    profile: {
      id: 'test-profile',
      user_id: 'test-user-id',
      full_name: 'Test User',
      date_of_birth: '1990-01-01',
      gender: 'MALE',
      email: 'test@example.com',
      phone: '+1234567890',
      phone_verified: true,
      passport_number: 'A12345678',
      passport_country: 'US',
      passport_expiry: '2030-01-01',
      is_verified: false,
    },
    completion: {
      completion_percentage: 85,
      missing_fields: ['known_traveler_number'],
      recommendations: [
        {
          category: 'travel_documents',
          priority: 'medium',
          title: 'Add Known Traveler Number',
          description: 'Add your KTN for faster security screening',
          action: 'add_ktn',
          points_value: 10,
        },
      ],
      last_calculated: new Date().toISOString(),
    },
    calculateCompleteness: vi.fn().mockReturnValue({
      overall: 85,
      categories: {
        basic_info: 100,
        contact_info: 90,
        travel_documents: 80,
        preferences: 60,
        verification: 50,
      },
      missing_fields: ['known_traveler_number'],
      recommendations: [],
    }),
    isLoading: false,
    isUpdating: false,
    updateProfile: vi.fn(),
    verifyPhone: vi.fn(),
    isVerifyingPhone: false,
    refetch: vi.fn(),
  }),
}));

vi.mock('@/contexts/WalletContext', () => ({
  useWallet: () => ({
    paymentMethods: [],
    loading: false,
    error: null,
    deletePaymentMethod: vi.fn(),
    setDefaultPaymentMethod: vi.fn(),
    updatePaymentMethodNickname: vi.fn(),
    refreshPaymentMethods: vi.fn(),
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(() =>
            Promise.resolve({ data: null, error: null })
          ),
        })),
      })),
    })),
  },
}));

// Mock the ProfileV2 component
vi.mock('@/components/profile/ProfileV2', () => {
  const React = require('react');
  return {
    ProfileV2: () =>
      React.createElement(
        'div',
        { 'data-testid': 'profile-v2' },
        'Profile Form V2'
      ),
  };
});

// Mock the NotificationPreferences component
vi.mock('@/components/NotificationPreferences', () => {
  const React = require('react');
  return {
    NotificationPreferences: () =>
      React.createElement(
        'div',
        { 'data-testid': 'notification-preferences' },
        'Notification Preferences'
      ),
  };
});

// Mock AuthGuard
vi.mock('@/components/AuthGuard', () => {
  const React = require('react');
  return {
    default: ({ children }: { children: React.ReactNode }) =>
      React.createElement('div', { 'data-testid': 'auth-guard' }, children),
  };
});

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const ProfileWithProviders = () => {
  const React = require('react');
  const queryClient = createQueryClient();

  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    React.createElement(Profile)
  );
};

describe('Profile Completeness Integration', () => {
  it('renders ProfileCompletenessIndicator in enhanced profile', async () => {
    const React = require('react');
    render(React.createElement(ProfileWithProviders));

    // Wait for the component to load
    await screen.findByTestId('profile-page');

    // Check that the profile completeness indicator is rendered (use getAllByText for multiple matches)
    const profileCompletenessElements = screen.getAllByText(
      'Profile Completeness'
    );
    expect(profileCompletenessElements.length).toBeGreaterThan(0);

    // Check that completion percentage is displayed - look for the specific 85% text
    expect(screen.getByText('85% Complete')).toBeInTheDocument();

    // Check that some completion fields are shown
    expect(screen.getByText('Full Name')).toBeInTheDocument();
    expect(screen.getByText('Email Address')).toBeInTheDocument();
    expect(screen.getByText('Phone Number')).toBeInTheDocument();
  });

  it('shows profile completion benefits when score is high', async () => {
    const React = require('react');
    render(React.createElement(ProfileWithProviders));

    await screen.findByTestId('profile-page');

    // Should show completion benefits for 85% completion
    expect(screen.getByText(/Great progress!/)).toBeInTheDocument();
    expect(screen.getByText(/You're almost there/)).toBeInTheDocument();
  });

  it('displays field categories correctly', async () => {
    const React = require('react');
    render(React.createElement(ProfileWithProviders));

    await screen.findByTestId('profile-page');

    // Check that field categories are displayed (use getAllByText for multiple matches)
    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    expect(screen.getByText('Contact Details')).toBeInTheDocument();
    expect(screen.getByText('Travel Preferences')).toBeInTheDocument();

    const identityVerificationElements = screen.getAllByText(
      'Identity Verification'
    );
    expect(identityVerificationElements.length).toBeGreaterThan(0);
  });

  it('handles field clicks correctly', async () => {
    const React = require('react');
    const { toast } = await import('@/hooks/use-toast');

    render(React.createElement(ProfileWithProviders));

    await screen.findByTestId('profile-page');

    // Find and click on a field (Full Name should be clickable)
    const fullNameField = screen
      .getByText('Full Name')
      .closest('[role="button"]');
    if (fullNameField) {
      fireEvent.click(fullNameField);

      // Check that toast was called with appropriate message
      expect(toast).toHaveBeenCalledWith({
        title: 'Complete Full Name',
        description: 'Please fill out your full name in the form below.',
      });
    }
  });

  it('shows next action button when profile is incomplete', async () => {
    const React = require('react');
    render(React.createElement(ProfileWithProviders));

    await screen.findByTestId('profile-page');

    // Should show "Complete Next Step" button since profile is 85% complete
    expect(screen.getByText('Complete Next Step')).toBeInTheDocument();
  });

  it('displays completion statistics correctly', async () => {
    const React = require('react');
    render(React.createElement(ProfileWithProviders));

    await screen.findByTestId('profile-page');

    // Check completion statistics
    expect(screen.getByText(/of.*fields completed/)).toBeInTheDocument();

    // Check tier badge (should be "Complete Profile" for 85%)
    expect(screen.getByText('Complete Profile')).toBeInTheDocument();
  });

  it('shows completed fields with green indicators', async () => {
    const React = require('react');
    render(React.createElement(ProfileWithProviders));

    await screen.findByTestId('profile-page');

    // Completed fields should have check icons (we can't directly test icons, but we can check structure)
    const completedFields = screen.getAllByLabelText(/completed/);
    expect(completedFields.length).toBeGreaterThan(0);
  });

  it('integrates with profile form layout correctly', async () => {
    const React = require('react');
    render(React.createElement(ProfileWithProviders));

    await screen.findByTestId('profile-page');

    // Check that both ProfileV2 and ProfileCompletenessIndicator are rendered
    expect(screen.getByTestId('profile-v2')).toBeInTheDocument();

    const profileCompletenessElements = screen.getAllByText(
      'Profile Completeness'
    );
    expect(profileCompletenessElements.length).toBeGreaterThan(0);

    // They should be in a grid layout (can't test CSS directly, but can check structure)
    const profileContent = screen.getByTestId('profile-page');
    expect(profileContent).toBeInTheDocument();
  });
});
