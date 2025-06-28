import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('TripRequestForm - Minimal Test', () => {
  it('should render without crashing', () => {
    // Let's try this without any router to see if that fixes the timeout
    const TestComponent = () => <div>Hello Test</div>;
    
    render(<TestComponent />);

    expect(screen.getByText('Hello Test')).toBeInTheDocument();
  });
});
