
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { CollapsibleSection } from './CollapsibleSection';

describe('CollapsibleSection', () => {
  const defaultProps = {
    title: 'Test Section',
    children: <div>Test content</div>,
  };

  it('renders with title and content', () => {
    const { getByRole, getByText } = render(<CollapsibleSection {...defaultProps} />);
    
    expect(getByRole('heading', { level: 3 })).toHaveTextContent('Test Section');
    expect(getByText('Test content')).toBeInTheDocument();
  });

  it('starts closed by default', () => {
    const { getByTestId } = render(<CollapsibleSection {...defaultProps} />);
    
    const content = getByTestId('collapsible-content');
    expect(content).toHaveAttribute('data-state', 'closed');
  });

  it('starts open when defaultOpen is true', () => {
    const { getByTestId } = render(<CollapsibleSection {...defaultProps} defaultOpen />);
    
    const content = getByTestId('collapsible-content');
    expect(content).toHaveAttribute('data-state', 'open');
  });

  it('toggles when trigger is clicked', () => {
    const { getByTestId } = render(<CollapsibleSection {...defaultProps} />);
    
    const trigger = getByTestId('collapsible-trigger');
    const content = getByTestId('collapsible-content');
    
    // Initially closed
    expect(content).toHaveAttribute('data-state', 'closed');
    
    // Click to open
    fireEvent.click(trigger);
    expect(content).toHaveAttribute('data-state', 'open');
    
    // Click to close
    fireEvent.click(trigger);
    expect(content).toHaveAttribute('data-state', 'closed');
  });

  it('responds to keyboard events', () => {
    const { getByTestId } = render(<CollapsibleSection {...defaultProps} />);
    
    const trigger = getByTestId('collapsible-trigger');
    const content = getByTestId('collapsible-content');
    
    // Initially closed
    expect(content).toHaveAttribute('data-state', 'closed');
    
    // Press Enter to open
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(content).toHaveAttribute('data-state', 'open');
    
    // Press Space to close
    fireEvent.keyDown(trigger, { key: ' ' });
    expect(content).toHaveAttribute('data-state', 'closed');
  });

  it('calls onToggle when state changes', () => {
    const onToggle = vi.fn();
    const { getByTestId } = render(
      <CollapsibleSection {...defaultProps} onToggle={onToggle} />
    );
    
    const trigger = getByTestId('collapsible-trigger');
    
    fireEvent.click(trigger);
    expect(onToggle).toHaveBeenCalledWith(true);
    
    fireEvent.click(trigger);
    expect(onToggle).toHaveBeenCalledWith(false);
    
    expect(onToggle).toHaveBeenCalledTimes(2);
  });

  it('applies custom animation duration', () => {
    const { getByTestId } = render(
      <CollapsibleSection {...defaultProps} animationDuration={500} />
    );
    
    const trigger = getByTestId('collapsible-trigger');
    const content = getByTestId('collapsible-content');
    
    expect(trigger).toHaveStyle('transition-duration: 500ms');
    expect(content).toHaveStyle('animation-duration: 500ms');
  });

  it('disables animation when duration is 0', () => {
    const { getByTestId } = render(
      <CollapsibleSection {...defaultProps} animationDuration={0} />
    );
    
    const trigger = getByTestId('collapsible-trigger');
    const content = getByTestId('collapsible-content');
    
    expect(trigger).toHaveStyle('transition-duration: 0ms');
    expect(content).toHaveStyle('animation-duration: 0ms');
  });

  it('has proper accessibility attributes', () => {
    const { getByTestId, getByRole } = render(<CollapsibleSection {...defaultProps} />);
    
    const heading = getByRole('heading', { level: 3 });
    const trigger = getByTestId('collapsible-trigger');
    
    // Check that trigger has aria-labelledby pointing to heading
    const headingId = heading.getAttribute('id');
    expect(trigger).toHaveAttribute('aria-labelledby', headingId);
    
    // Check that trigger has proper aria-expanded
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('applies custom className', () => {
    const { container } = render(
      <CollapsibleSection {...defaultProps} className="custom-class" />
    );
    
    const root = container.firstChild;
    expect(root).toHaveClass('custom-class');
  });

  it('chevron rotates when opened', () => {
    const { getByTestId } = render(<CollapsibleSection {...defaultProps} />);
    
    const trigger = getByTestId('collapsible-trigger');
    const chevron = trigger.querySelector('svg');
    
    // Initially, chevron should not be rotated
    expect(trigger).not.toHaveAttribute('data-state', 'open');
    
    fireEvent.click(trigger);
    
    // After opening, trigger should have data-state="open" which rotates chevron via CSS
    expect(trigger).toHaveAttribute('data-state', 'open');
  });
});
