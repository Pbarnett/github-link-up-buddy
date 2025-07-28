import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PoolSection from '../PoolSection';

describe('PoolSection', () => {
  it('renders children when count > 0 and section is expanded', async () => {
    render(
      <PoolSection name="Best Value" count={2} defaultOpen={true}>
        <div>Test offer 1</div>
        <div>Test offer 2</div>
      </PoolSection>
    );

    // Find the pool section by its heading and count badge
    const heading = await screen.findByRole('heading', { name: /best value/i });
    expect(heading).toBeInTheDocument();

    // Verify the count badge with flexible matching
    expect(screen.getByText(/2\s*offers?/i)).toBeInTheDocument();

    // Children should be rendered when expanded
    expect(screen.getByText('Test offer 1')).toBeInTheDocument();
    expect(screen.getByText('Test offer 2')).toBeInTheDocument();
  });

  it('shows no options message when count is 0 and section is expanded', async () => {
    render(
      <PoolSection name="Premium" count={0} defaultOpen={true}>
        <div>This should not show</div>
      </PoolSection>
    );

    // Find the premium section by its heading
    const heading = await screen.findByRole('heading', { name: /premium/i });
    expect(heading).toBeInTheDocument();

    // Verify the count badge shows 0 offers
    expect(screen.getByText(/0\s*offers?/i)).toBeInTheDocument();

    // The "no options" message should be present when expanded
    expect(
      screen.getByText(/no options in this category/i)
    ).toBeInTheDocument();

    // Children should not be rendered when count is 0
    expect(screen.queryByText('This should not show')).not.toBeInTheDocument();
  });

  it('toggles content when trigger is clicked', async () => {
    const { container } = render(
      <PoolSection name="Toggle Test" count={2} defaultOpen={false}>
        <div>Toggle test content</div>
      </PoolSection>
    );

    // Find the trigger button within this specific container
    const trigger = container.querySelector('button');
    expect(trigger).toBeInTheDocument();

    // Verify initial state is closed
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('data-state', 'closed');

    // Click the trigger button to expand
    fireEvent.click(trigger!);

    // Wait for state change
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify expanded state
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('data-state', 'open');

    // Content should be accessible after clicking
    expect(await screen.findByText('Toggle test content')).toBeInTheDocument();
  });
});
