
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
    expect(screen.getByText(/Jun 15 – Jun 22/)).toBeInTheDocument();
  });

  it('renders non-stop only chip', () => {
    render(<ConstraintChips {...mockProps} />);
    expect(screen.getByText('Non-stop only')).toBeInTheDocument();
  });

  it('calls onToggleNonStop when non-stop chip is clicked', () => {
    render(<ConstraintChips {...mockProps} />);
    
    const nonStopChip = screen.getByText('Non-stop only');
    fireEvent.click(nonStopChip);
    
    expect(mockProps.onToggleNonStop).toHaveBeenCalledTimes(1);
  });

  it('shows different styling when nonStopOnly is true', () => {
    render(<ConstraintChips {...mockProps} nonStopOnly={true} />);
    
    const nonStopChip = screen.getByText('Non-stop only');
    expect(nonStopChip.closest('.badge')).toHaveClass('bg-primary');
  });
});
