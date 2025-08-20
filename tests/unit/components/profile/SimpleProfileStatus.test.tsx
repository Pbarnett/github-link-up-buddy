import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { SimpleProfileStatus, CompactProfileStatus } from '@/components/profile/SimpleProfileStatus';
import { ProfileCompletenessScore } from '@/services/profileCompletenessService';

// Mock the UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
  CardContent: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
  CardDescription: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
  CardTitle: ({ children, className, ...props }: any) => <h3 className={className} {...props}>{children}</h3>,
}));

vi.mock('@/components/ui/progress', () => ({
  Progress: ({ value, className }: any) => (
    <div className={className} data-testid="progress-bar" data-value={value}>{value}%</div>
  ),
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: any) => (
    <span className={className} data-variant={variant}>{children}</span>
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, size, className, ...props }: any) => (
    <button 
      onClick={onClick} 
      className={className}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/alert', () => ({
  Alert: ({ children, ...props }: any) => <div data-testid="alert" {...props}>{children}</div>,
  AlertDescription: ({ children, ...props }: any) => <div {...props}>{children}</div>,
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

  const createMockCompleteness = (overall: number, recommendations: any[] = []): ProfileCompletenessScore => ({
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
      const { container } = render(<SimpleProfileStatus completeness={completeness} />);
      const root = container.querySelector('[data-testid="simple-profile-status"]') as HTMLElement;
      
      expect(screen.getAllByText('75%').length).toBeGreaterThan(0);
      expect(screen.getByTestId('progress-bar')).toHaveAttribute('data-value', '75');
    });

    it('shows "Complete!" when profile is 100% complete', () => {
      const completeness = createMockCompleteness(100);
      render(<SimpleProfileStatus completeness={completeness} />);
      
      expect(screen.getByText('Profile Complete!')).toBeInTheDocument();
      expect(screen.getAllByText('100%').length).toBeGreaterThan(0);
    });

    it('displays appropriate status message based on completion level', () => {
      // Test different completion levels
      const testCases = [
        { score: 98, expectedMessage: 'Your profile is complete!' },
        { score: 85, expectedMessage: 'Almost complete - just a few more details' },
        { score: 70, expectedMessage: 'Good progress! Keep adding information' },
        { score: 40, expectedMessage: 'Let\'s complete your profile for the best experience' },
      ];

      testCases.forEach(({ score, expectedMessage }) => {
        const { unmount, container } = render(
          <SimpleProfileStatus completeness={createMockCompleteness(score)} />
        );
        const statusNode = container.querySelector('[data-testid="status-message"]');
        expect(statusNode).toHaveTextContent(expectedMessage);
        unmount();
      });
    });
  });

  describe('Missing fields display', () => {
    it('shows missing fields when profile is incomplete', () => {
      const completeness = createMockCompleteness(60);
      const { container } = render(<SimpleProfileStatus completeness={completeness} />);
      const section = container.querySelector('[data-testid="missing-info-section"]');
      expect(section).toBeInTheDocument();
      expect(section).toHaveTextContent('Missing Information:');
      expect(section).toHaveTextContent('phone');
      expect(section).toHaveTextContent('passport number');
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
        missing_fields: ['phone', 'passport_number', 'passport_country', 'passport_expiry', 'known_traveler_number', 'date_of_birth'],
        recommendations: [],
      };

      render(<SimpleProfileStatus completeness={completeness} />);
      
      expect(screen.getByText('+2 more')).toBeInTheDocument();
    });
  });

  describe('Recommendations and actions', () => {
    it('displays next step recommendation when available', () => {
      const recommendations = [{
        category: 'contact_info',
        priority: 'high' as const,
        title: 'Verify your phone number',
        description: 'Verify your phone number to receive important booking updates via SMS',
        action: 'verify_phone',
        points_value: 15,
      }];
      
      const completeness = createMockCompleteness(75, recommendations);
      const { container } = render(<SimpleProfileStatus completeness={completeness} onActionClick={mockOnActionClick} />);
      const alert = container.querySelector('[data-testid="next-step-alert"]');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('Next step:');
      expect(alert).toHaveTextContent('Verify your phone number');
      expect(alert).toHaveTextContent('Verify your phone number to receive important booking updates via SMS');
    });

    it('calls onActionClick when recommendation action button is clicked', () => {
      const recommendations = [{
        category: 'contact_info',
        priority: 'high' as const,
        title: 'Verify your phone number',
        description: 'Verify your phone number to receive important booking updates via SMS',
        action: 'verify_phone',
        points_value: 15,
      }];
      
      const completeness = createMockCompleteness(75, recommendations);
      const { container } = render(<SimpleProfileStatus completeness={completeness} onActionClick={mockOnActionClick} />);
      
      const scoped = container.querySelector('[data-testid="simple-profile-status"]') as HTMLElement;
      const actionButton = (scoped.querySelector('[data-testid="next-step-action"]') as HTMLElement);
      fireEvent.click(actionButton);
      
      expect(mockOnActionClick).toHaveBeenCalledWith('verify_phone');
    });

    it('shows main action button for incomplete profiles', () => {
      const completeness = createMockCompleteness(60);
      const { container } = render(<SimpleProfileStatus completeness={completeness} onActionClick={mockOnActionClick} />);
      
      const scoped = container.querySelector('[data-testid="simple-profile-status"]') as HTMLElement;
      const actionButton = (scoped.querySelector('[data-testid="main-action"]') as HTMLElement);
      fireEvent.click(actionButton);
      
      expect(mockOnActionClick).toHaveBeenCalledWith('complete_profile');
    });

    it('shows "Start Completing Profile" for very incomplete profiles', () => {
      const completeness = createMockCompleteness(30);
      render(<SimpleProfileStatus completeness={completeness} onActionClick={mockOnActionClick} />);
      
      expect(screen.getAllByText('Start Completing Profile').length).toBeGreaterThan(0);
    });
  });

  describe('CompactProfileStatus', () => {
    it('renders compact version correctly', () => {
      const completeness = createMockCompleteness(75);
      render(<CompactProfileStatus completeness={completeness} onActionClick={mockOnActionClick} />);
      
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('In progress')).toBeInTheDocument();
      expect(screen.getAllByText('75%').length).toBeGreaterThan(0);
    });

    it('shows "Complete" status for 100% profiles', () => {
      const completeness = createMockCompleteness(100);
      render(<CompactProfileStatus completeness={completeness} />);
      
      expect(screen.getByText('Complete')).toBeInTheDocument();
    });

    it('shows next step title when available', () => {
      const recommendations = [{
        category: 'contact_info',
        priority: 'high' as const,
        title: 'Verify phone',
        description: 'Verify your phone number',
        action: 'verify_phone',
        points_value: 15,
      }];
      
      const completeness = createMockCompleteness(75, recommendations);
      render(<CompactProfileStatus completeness={completeness} />);
      
      expect(screen.getByText('Verify phone')).toBeInTheDocument();
    });
  });
});
