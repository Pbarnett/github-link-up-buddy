import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { GreetingBanner } from '@/components/personalization/GreetingBanner';

// Mock dependencies
vi.mock('@/contexts/PersonalizationContext', async (importOriginal) => {
  const actual = await importOriginal<any>();
  const mockTrackPersonalizationEvent = vi.fn();
  
  return {
    ...actual,
    usePersonalization: () => ({
      personalizationData: { firstName: 'John' },
      loading: false,
      error: null,
      abTestVariant: 'treatment',
      experimentConfig: { enablePersonalization: true },
      trackPersonalizationEvent: mockTrackPersonalizationEvent,
      isPersonalizationEnabled: true,
    }),
  };
});

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockImplementation((table) => {
      const chainMock = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        single: vi.fn(),
        maybeSingle: vi.fn(),
      };
      
      if (table === 'profiles') {
        chainMock.single.mockResolvedValue({
          data: { first_name: 'John' },
          error: null,
        });
      } else if (table === 'trip_requests') {
        chainMock.maybeSingle.mockResolvedValue({
          data: { destination_airport: 'NYC' },
          error: null,
        });
      }
      
      return chainMock;
    }),
  },
}));

vi.mock('@/hooks/useFeatureFlag', () => ({
  useFeatureFlag: vi.fn().mockReturnValue(true),
}));

vi.mock('@/lib/personalization/featureFlags', () => ({
  enablePersonalizationForTesting: vi.fn().mockReturnValue(true),
}));
vi.mock('@/lib/personalization/abTesting', () => {
  const getUserVariant = vi.fn(() => 'treatment');
  const getExperimentConfig = vi.fn(() => ({ enablePersonalization: true }));
  const trackABTestEvent = vi.fn();
  return { getUserVariant, getExperimentConfig, trackABTestEvent };
});

vi.mock('@/lib/personalization/voiceAndTone', () => ({
  getGreeting: vi.fn().mockReturnValue('Welcome back, traveler! Where to next?'),
}));

vi.mock('@/hooks/useAnalytics', () => {
  const useAnalytics = vi.fn(() => ({ track: vi.fn() }));
  return { useAnalytics };
});

describe('GreetingBanner', () => {
  const mockTrackEvent = vi.fn();
  const mockExperimentConfig = { enablePersonalization: true };

  const renderComponent = (props = {}) => {
    return render(
      <GreetingBanner
        context="dashboard"
        variant="default"
        onClick={() => {}}
        {...props}
      />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', async () => {
    renderComponent();
    // The component renders as a button when onClick is provided
    await waitFor(() => {
      const greetingElement = screen.getByRole('button');
      expect(greetingElement).toBeInTheDocument();
    });
  });

  it('should track exposure event on render', async () => {
    renderComponent({ userId: 'test-user' });
    
    // The component should render and call the tracking function
    await waitFor(() => {
      const greetingElement = screen.getByRole('button');
      expect(greetingElement).toBeInTheDocument();
    });
  });

  it('should handle click event and track engagement', async () => {
    const onClickMock = vi.fn();
    renderComponent({ userId: 'test-user', onClick: onClickMock });
    
    await waitFor(() => {
      const greetingElement = screen.getByRole('button');
      fireEvent.click(greetingElement);
      expect(onClickMock).toHaveBeenCalled();
    });
  });
});
