import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PoolHeader from '../PoolHeader';

describe('PoolHeader', () => {
  it('renders pool name and count', () => {
    render(<PoolHeader name="Best Value" count={5} />);

    expect(screen.getByText('Best Value')).toBeInTheDocument();
    expect(screen.getByText('5 offers')).toBeInTheDocument();
  });

  it('handles zero count', () => {
    render(<PoolHeader name="Premium" count={0} />);

    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByText('0 offers')).toBeInTheDocument();
  });
});
