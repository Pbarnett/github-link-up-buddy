import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import PersonalizedGreeting from '@/components/personalization/PersonalizedGreeting';

// Mock the analytics tracking
vi.mock('@/scripts/analytics/personalization-tracking', () => ({
  trackGreetingDisplay: vi.fn(),
}));

// Mock fetch
global.fetch = vi.fn();

describe('PersonalizedGreeting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetch.mockClear();
  });

  it('renders loading state initially', () => {
    // Keep the fetch pending so the component stays in loading state
    fetch.mockResolvedValueOnce(new Promise(() => {}));
    render(<PersonalizedGreeting userId="123" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders generic greeting when personalization is disabled', async () => {
    await act(async () => {
      render(<PersonalizedGreeting userId="123" isPersonalizationEnabled={false} />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Welcome!')).toBeInTheDocument();
    });
  });

  it('renders personalized greeting with name', async () => {
    const mockResponse = {
      name: 'John Doe',
      lastVisit: '2024-12-07T10:00:00Z'
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await act(async () => {
      render(<PersonalizedGreeting userId="123" />);
    });

    await waitFor(() => {
      expect(screen.getByText(/John Doe!/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Last visit: 12\/7\/2024/)).toBeInTheDocument();
  });

  it('renders time-based greeting without name', async () => {
    const mockResponse = {
      name: null,
      lastVisit: '2024-12-07T10:00:00Z'
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await act(async () => {
      render(<PersonalizedGreeting userId="123" />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Good (morning|afternoon|evening)/)).toBeInTheDocument();
    });
  });

  it('handles API error gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('API Error'));

    await act(async () => {
      render(<PersonalizedGreeting userId="123" />);
    });

    await waitFor(() => {
      expect(screen.getByText('Welcome!')).toBeInTheDocument();
    });
  });

  it('calls correct API endpoint', async () => {
    const mockResponse = {
      name: 'Jane Smith',
      greeting: 'Good afternoon, Jane Smith!'
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await act(async () => {
      render(<PersonalizedGreeting userId="user123" />);
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/personalization/greeting?userId=user123');
    });
  });

  it('tracks greeting display correctly', async () => {
    const { trackGreetingDisplay } = await import('@/scripts/analytics/personalization-tracking');
    
    const mockResponse = {
      name: 'Alice Johnson',
      greeting: 'Good evening, Alice Johnson!'
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await act(async () => {
      render(<PersonalizedGreeting userId="123" />);
    });

    await waitFor(() => {
      expect(trackGreetingDisplay).toHaveBeenCalledWith('personalized', mockResponse);
    });
  });

  it('tracks generic greeting display', async () => {
    const { trackGreetingDisplay } = await import('@/scripts/analytics/personalization-tracking');
    
    const mockResponse = {
      name: null,
      greeting: 'Good morning'
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await act(async () => {
      render(<PersonalizedGreeting userId="123" />);
    });

    await waitFor(() => {
      expect(trackGreetingDisplay).toHaveBeenCalledWith('generic', mockResponse);
    });
  });
});
