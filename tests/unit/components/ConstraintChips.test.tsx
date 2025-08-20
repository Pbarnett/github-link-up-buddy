
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ConstraintChips from '@/components/trip/ConstraintChips';

describe('ConstraintChips', () => {
  const mockProps = {
    dateRange: { from: '2024-06-15', to: '2024-06-22' },
    nonStopOnly: false,
    onToggleNonStop: vi.fn(),
  };

  it('renders carry-on included chip', () => {
    render(<ConstraintChips {...mockProps} />);
    expect(screen.getByText('Carry-on included')).toBeInTheDocument();
  });

  it('renders date range chip with formatted dates', () => {
    render(<ConstraintChips {...mockProps} />);
    const [dateChip] = screen.getAllByTestId('chip-date-range');
    expect(dateChip).toHaveTextContent(/Jun 1[45] – Jun 2[12]/);
  });

  it('renders non-stop only chip', () => {
    render(<ConstraintChips {...mockProps} />);
    const [nonStopLabel] = screen.getAllByText('Non-stop only');
    expect(nonStopLabel).toBeInTheDocument();
  });

  it('calls onToggleNonStop when non-stop chip is clicked', () => {
    render(<ConstraintChips {...mockProps} />);
    const [nonStopButton] = screen.getAllByTestId('chip-nonstop');
    fireEvent.click(nonStopButton);
    expect(mockProps.onToggleNonStop).toHaveBeenCalledTimes(1);
  });

  it('shows different styling when nonStopOnly is true', () => {
    render(<ConstraintChips {...mockProps} nonStopOnly={true} />);
    
    const nonStopButton = screen.getByRole('button', { name: /non-stop flights enabled/i });
    expect(nonStopButton).toHaveAttribute('aria-pressed', 'true');
    
    // Check that the badge has the default variant (not outline)
    const badge = nonStopButton.querySelector('[data-testid="chip-nonstop"]') || nonStopButton.firstElementChild;
    expect(badge).not.toHaveClass('border-input'); // outline variant has border-input class
  });
});
