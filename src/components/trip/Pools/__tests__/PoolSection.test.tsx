
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PoolSection from '../PoolSection';

describe('PoolSection', () => {
  it('renders children when count > 0', () => {
    render(
      <PoolSection name="Best Value" count={2}>
        <div>Test offer 1</div>
        <div>Test offer 2</div>
      </PoolSection>
    );
    
    expect(screen.getByText('Test offer 1')).toBeInTheDocument();
    expect(screen.getByText('Test offer 2')).toBeInTheDocument();
  });

  it('shows no options message when count is 0', () => {
    render(
      <PoolSection name="Premium" count={0}>
        <div>This should not show</div>
      </PoolSection>
    );
    
    expect(screen.getByText('No options in this category.')).toBeInTheDocument();
    expect(screen.queryByText('This should not show')).not.toBeInTheDocument();
  });
});
