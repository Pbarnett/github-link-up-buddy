type ReactNode = React.ReactNode;
type _Component<P = {}, S = {}> = React.Component<P, S>;

import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';
import {
  SimpleProfileStatus,
  CompactProfileStatus,
} from '@/components/profile/SimpleProfileStatus';
import { ProfileCompletenessScore } from '@/services/profileCompletenessService';

// Mock the UI components
interface MockComponentProps {
  children?: ReactNode;
  className?: string;
}

interface MockProgressProps {
  value?: number;
  className?: string;
}

interface MockBadgeProps extends MockComponentProps {
  variant?: string;
}

interface MockButtonProps extends MockComponentProps {
  onClick?: () => void;
  variant?: string;
  size?: string;
}

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: MockComponentProps) => (
    <div className={className}>{children}</div>
  ),
  CardContent: ({ children, className }: MockComponentProps) => (
    <div className={className}>{children}</div>
  ),
  CardDescription: ({ children }: MockComponentProps) => <div>{children}</div>,
  CardHeader: ({ children, className }: MockComponentProps) => (
    <div className={className}>{children}</div>
  ),
  CardTitle: ({ children, className }: MockComponentProps) => (
    <h3 className={className}>{children}</h3>
  ),
}));

vi.mock('@/components/ui/progress', () => ({
  Progress: ({ value, className }: MockProgressProps) => (
    <div className={className} data-testid="progress-bar" data-value={value}>
      {value}%
    </div>
  ),
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: MockBadgeProps) => (
    <span className={className} data-variant={variant}>
      {children}
    </span>
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    variant,
    size,
    className,
  }: MockButtonProps) => (
    <button
      onClick={onClick}
      className={className}
      data-variant={variant}
      data-size={size}
    >
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/alert', () => ({
  Alert: ({ children }: MockComponentProps) => (
    <div data-testid="alert">{children}</div>
  ),
  AlertDescription: ({ children }: MockComponentProps) => <div>{children}</div>,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  AlertTriangle: () => <div data-testid="alert-triangle-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  Phone: () => <div data-testid="phone-icon" />,
  FileText: () => <div data-testid="file-text-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
}));

describe('SimpleProfileStatus', () => {
  const mockOnActionClick = vi.fn();

  beforeEach(() => {
    mockOnActionClick.mockClear();
  });

  const createMockCompleteness = (
    overall: number,
    recommendations: any[] = []
  ): ProfileCompletenessScore => ({
    overall,
    categories: {
      basic_info: 80,
      contact_info: 60,
      travel_documents: 40,
      preferences: 70,
      verification: 50,
    },
    missing_fields: overall < 100 ? ['phone', 'passport_number'] : [],
    recommendations,
  });

  describe('Profile completion status display', () => {
    it('renders completion percentage correctly', () => {
      const completeness = createMockCompleteness(75);
      render(<SimpleProfileStatus completeness={completeness} />);

      expect(screen.getAllByText('75%')).toHaveLength(2); // Badge and progress bar
      expect(screen.getByTestId('progress-bar')).toHaveAttribute(
        'data-value',
        '75'
      );
    });

    it('shows "Complete!" when profile is 100% complete', () => {
      const completeness = createMockCompleteness(100);
      render(<SimpleProfileStatus completeness={completeness} />);

      expect(screen.getByText('Profile Complete!')).toBeInTheDocument();
      expect(screen.getAllByText('100%')).toHaveLength(2); // Badge and progress bar
    });

    it('displays appropriate status message based on completion level', () => {
      // Test different completion levels
      const testCases = [
        { score: 98, expectedMessage: 'Your profile is complete!' },
        {
          score: 85,
          expectedMessage: 'Almost complete - just a few more details',
        },
        {
          score: 70,
          expectedMessage: 'Good progress! Keep adding information',
        },
        {
          score: 40,
          expectedMessage:
            "Let's complete your profile for the best experience",
        },
      ];

      testCases.forEach(({ score, expectedMessage }) => {
        const { unmount } = render(
          <SimpleProfileStatus completeness={createMockCompleteness(score)} />
        );
        expect(screen.getByText(expectedMessage)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Missing fields display', () => {
    it('shows missing fields when profile is incomplete', () => {
      const completeness = createMockCompleteness(60);
      render(<SimpleProfileStatus completeness={completeness} />);

      expect(screen.getByText('Missing Information:')).toBeInTheDocument();
      expect(screen.getByText('phone')).toBeInTheDocument();
      expect(screen.getByText('passport number')).toBeInTheDocument();
    });

    it('limits displayed missing fields to 4 and shows "more" indicator', () => {
      const completeness: ProfileCompletenessScore = {
        overall: 30,
        categories: {
          basic_info: 50,
          contact_info: 20,
          travel_documents: 10,
          preferences: 30,
          verification: 0,
        },
        missing_fields: [
          'phone',
          'passport_number',
          'passport_country',
          'passport_expiry',
          'known_traveler_number',
          'date_of_birth',
        ],
        recommendations: [],
      };

      render(<SimpleProfileStatus completeness={completeness} />);

      expect(screen.getByText('+2 more')).toBeInTheDocument();
    });
  });

  describe('Recommendations and actions', () => {
    it('displays next step recommendation when available', () => {
      const recommendations = [
        {
          category: 'contact_info',
          priority: 'high' as const,
          title: 'Verify your phone number',
          description:
            'Verify your phone number to receive important booking updates via SMS',
          action: 'verify_phone',
          points_value: 15,
        },
      ];

      const completeness = createMockCompleteness(75, recommendations);
      render(
        <SimpleProfileStatus
          completeness={completeness}
          onActionClick={mockOnActionClick}
        />
      );

      expect(screen.getByText('Next step:')).toBeInTheDocument();
      expect(screen.getByText('Verify your phone number')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Verify your phone number to receive important booking updates via SMS'
        )
      ).toBeInTheDocument();
    });

    it('calls onActionClick when recommendation action button is clicked', () => {
      const recommendations = [
        {
          category: 'contact_info',
          priority: 'high' as const,
          title: 'Verify your phone number',
          description:
            'Verify your phone number to receive important booking updates via SMS',
          action: 'verify_phone',
          points_value: 15,
        },
      ];

      const completeness = createMockCompleteness(75, recommendations);
      render(
        <SimpleProfileStatus
          completeness={completeness}
          onActionClick={mockOnActionClick}
        />
      );

      const actionButton = screen.getByText('Take Action');
      fireEvent.click(actionButton);

      expect(mockOnActionClick).toHaveBeenCalledWith('verify_phone');
    });

    it('shows main action button for incomplete profiles', () => {
      const completeness = createMockCompleteness(60);
      render(
        <SimpleProfileStatus
          completeness={completeness}
          onActionClick={mockOnActionClick}
        />
      );

      const actionButton = screen.getByText('Continue Profile');
      fireEvent.click(actionButton);

      expect(mockOnActionClick).toHaveBeenCalledWith('complete_profile');
    });

    it('shows "Start Completing Profile" for very incomplete profiles', () => {
      const completeness = createMockCompleteness(30);
      render(
        <SimpleProfileStatus
          completeness={completeness}
          onActionClick={mockOnActionClick}
        />
      );

      expect(screen.getByText('Start Completing Profile')).toBeInTheDocument();
    });
  });

  describe('CompactProfileStatus', () => {
    it('renders compact version correctly', () => {
      const completeness = createMockCompleteness(75);
      render(
        <CompactProfileStatus
          completeness={completeness}
          onActionClick={mockOnActionClick}
        />
      );

      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('In progress')).toBeInTheDocument();
      expect(screen.getAllByText('75%')).toHaveLength(2); // Progress bar and overlay text
    });

    it('shows "Complete" status for 100% profiles', () => {
      const completeness = createMockCompleteness(100);
      render(<CompactProfileStatus completeness={completeness} />);

      expect(screen.getByText('Complete')).toBeInTheDocument();
    });

    it('shows next step title when available', () => {
      const recommendations = [
        {
          category: 'contact_info',
          priority: 'high' as const,
          title: 'Verify phone',
          description: 'Verify your phone number',
          action: 'verify_phone',
          points_value: 15,
        },
      ];

      const completeness = createMockCompleteness(75, recommendations);
      render(<CompactProfileStatus completeness={completeness} />);

      expect(screen.getByText('Verify phone')).toBeInTheDocument();
    });
  });
});
