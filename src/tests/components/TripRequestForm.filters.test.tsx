
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TripRequestForm from '@/components/trip/TripRequestForm';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

// Mocks (minimal, for these tests)
vi.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: vi.fn(),
}));
vi.mock('@/hooks/useFeatureFlag', () => ({
  useFeatureFlag: (flag: string) => flag === 'extended_date_range',
}));

describe('TripRequestForm - Filter Toggles Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useCurrentUser as Mock).mockReturnValue({ user: { id: 'test-user-id' } });
  });

  it('should render "Nonstop flights only" switch checked by default', () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);
    const nonstopSwitch = screen.getByRole('switch', { name: /nonstop flights only/i });
    expect(nonstopSwitch).toBeInTheDocument();
    expect(nonstopSwitch).toBeChecked();
  });

  it('should render "Include carry-on + personal item" switch unchecked by default', () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);
    const baggageSwitch = screen.getByRole('switch', { name: /include carry-on \+ personal item/i });
    expect(baggageSwitch).toBeInTheDocument();
    expect(baggageSwitch).not.toBeChecked();
  });

  it('should update switch state when "Include carry-on + personal item" switch is toggled', async () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);
    const baggageSwitch = screen.getByRole('switch', { name: /include carry-on \+ personal item/i });
    expect(baggageSwitch).not.toBeChecked();
    await (await import('@testing-library/user-event')).default.click(baggageSwitch);
    expect(baggageSwitch).toBeChecked();
  });

  it('should reflect Zod schema default values for switches on initial render', () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);
    const nonstopSwitch = screen.getByRole('switch', { name: /nonstop flights only/i });
    const baggageSwitch = screen.getByRole('switch', { name: /include carry-on \+ personal item/i });
    expect(nonstopSwitch).toBeChecked();
    expect(baggageSwitch).not.toBeChecked();
  });
});
