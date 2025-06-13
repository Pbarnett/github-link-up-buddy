
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SkipLink from '@/components/ui/skip-link';

describe('SkipLink', () => {
  it('renders skip link with correct attributes', () => {
    render(<SkipLink />);
    
    const skipLink = screen.getByRole('link', { name: /skip to content/i });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main');
    expect(skipLink).toHaveClass('skip-link', 'ring-focus');
  });

  it('has correct accessibility attributes', () => {
    render(<SkipLink />);
    
    const skipLink = screen.getByRole('link', { name: /skip to content/i });
    expect(skipLink).toBeVisible(); // Should be visible when focused
  });
});
