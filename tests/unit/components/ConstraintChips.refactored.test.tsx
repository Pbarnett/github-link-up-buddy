import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConstraintChips, { formatDateRange } from '@/components/trip/ConstraintChips';
import { renderWithProviders } from '@/tests/__helpers';

describe('ConstraintChips (Refactored)', () => {
  const defaultProps = {
    dateRange: { from: '2024-01-15', to: '2024-01-20' },
    nonStopOnly: false,
    onToggleNonStop: vi.fn(),
  };

  describe('Pure helper function', () => {
    it('formatDateRange should format dates correctly', () => {
      const result = formatDateRange('2024-01-15', '2024-01-20');
      // Accept any valid formatted date range (timezone can affect this)
      expect(result).toMatch(/^[A-Za-z]{3} \d{1,2} – [A-Za-z]{3} \d{1,2}$/);
      expect(result).toContain('Jan');
      expect(result).toContain('–');
    });

    it('formatDateRange should handle different months', () => {
      const result = formatDateRange('2024-01-15', '2024-02-20');
      expect(result).toMatch(/^[A-Za-z]{3} \d{1,2} – [A-Za-z]{3} \d{1,2}$/);
      expect(result).toContain('Jan');
      expect(result).toContain('Feb');
    });

    it('formatDateRange should handle timezone parameter', () => {
      const result = formatDateRange('2024-01-15', '2024-01-20', 'UTC');
      expect(result).toMatch(/^[A-Za-z]{3} \d{1,2} – [A-Za-z]{3} \d{1,2}$/);
    });
  });

  describe('Component rendering with semantic elements', () => {
    it('should render all chips with proper accessibility roles', () => {
      renderWithProviders(<ConstraintChips {...defaultProps} />);

      // Test using data-testid for reliable element selection
      expect(screen.getByTestId('chip-carry-on')).toBeInTheDocument();
      expect(screen.getByTestId('chip-date-range')).toBeInTheDocument();
      expect(screen.getByTestId('chip-nonstop')).toBeInTheDocument();

      // Verify semantic structure
      const carryOnChip = screen.getByTestId('chip-carry-on').parentElement;
      expect(carryOnChip).toHaveAttribute('role', 'status');

      const dateChip = screen.getByTestId('chip-date-range').parentElement;
      expect(dateChip).toHaveAttribute('role', 'status');

      const nonStopButton = screen.getByTestId('chip-nonstop');
      expect(nonStopButton).toHaveAttribute('type', 'button');
      expect(nonStopButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('should render formatted date range', () => {
      renderWithProviders(<ConstraintChips {...defaultProps} />);
      
      const [dateChip] = screen.getAllByTestId('chip-date-range');
      // Check that it contains the expected month and dash, accounting for timezone differences
      expect(dateChip.textContent).toMatch(/Jan \d{1,2} – Jan \d{1,2}/);
    });

    it('should show non-stop toggle as disabled by default', () => {
      renderWithProviders(<ConstraintChips {...defaultProps} />);
      
      const [nonStopButton] = screen.getAllByTestId('chip-nonstop');
      expect(nonStopButton).toHaveAttribute('aria-pressed', 'false');
      expect(nonStopButton).toHaveAttribute('aria-label', 'Non-stop flights disabled');
    });

    it('should show non-stop toggle as enabled when nonStopOnly is true', () => {
      renderWithProviders(
        <ConstraintChips {...defaultProps} nonStopOnly={true} />
      );
      
      const [nonStopButton] = screen.getAllByTestId('chip-nonstop');
      expect(nonStopButton).toHaveAttribute('aria-pressed', 'true');
      expect(nonStopButton).toHaveAttribute('aria-label', 'Non-stop flights enabled');
    });
  });

  describe('User interactions', () => {
    it('should call onToggleNonStop when non-stop button is clicked', async () => {
      const user = userEvent.setup();
      const mockToggle = vi.fn();

      renderWithProviders(
        <ConstraintChips {...defaultProps} onToggleNonStop={mockToggle} />
      );

      const [nonStopButton] = screen.getAllByTestId('chip-nonstop');
      await user.click(nonStopButton);

      expect(mockToggle).toHaveBeenCalledTimes(1);
    });

    it('should toggle non-stop using getByRole for accessibility testing', async () => {
      const user = userEvent.setup();
      const mockToggle = vi.fn();

      renderWithProviders(
        <ConstraintChips {...defaultProps} onToggleNonStop={mockToggle} />
      );

      // Test accessibility - should be able to find by role and name
      const nonStopButton = screen.getByRole('button', { 
        name: /non-stop flights disabled/i 
      });
      
      await user.click(nonStopButton);
      expect(mockToggle).toHaveBeenCalledTimes(1);
    });

    it('should handle keyboard interactions', async () => {
      const user = userEvent.setup();
      const mockToggle = vi.fn();

      renderWithProviders(
        <ConstraintChips {...defaultProps} onToggleNonStop={mockToggle} />
      );

      const [nonStopButton] = screen.getAllByTestId('chip-nonstop');
      
      // Focus and press Enter
      nonStopButton.focus();
      await user.keyboard('{Enter}');
      
      expect(mockToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('Visual states', () => {
    it('should render different states for non-stop toggle', () => {
      const { rerender } = renderWithProviders(
        <ConstraintChips {...defaultProps} nonStopOnly={false} />
      );
      
      // Check that button has correct aria-pressed for disabled state
      const [nonStopButton] = screen.getAllByTestId('chip-nonstop');
      expect(nonStopButton).toHaveAttribute('aria-pressed', 'false');
      
      // Rerender with enabled state
      rerender(<ConstraintChips {...defaultProps} nonStopOnly={true} />);
      
      expect(nonStopButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should have proper accessibility labels for each state', () => {
      renderWithProviders(<ConstraintChips {...defaultProps} nonStopOnly={false} />);
      
      const disabledButton = screen.getByRole('button', { name: /non-stop flights disabled/i });
      expect(disabledButton).toBeInTheDocument();
      
      const { rerender } = renderWithProviders(
        <ConstraintChips {...defaultProps} nonStopOnly={true} />
      );
      
      const enabledButton = screen.getByRole('button', { name: /non-stop flights enabled/i });
      expect(enabledButton).toBeInTheDocument();
    });
  });
});
