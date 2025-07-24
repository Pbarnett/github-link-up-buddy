

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PersonalizedGreeting from '@/components/personalization/PersonalizedGreeting';
import * as React from 'react';

// Mock the analytics tracking
vi.mock('@/scripts/analytics/personalization-tracking', () => ({
  trackGreetingDisplay: vi.fn(),
}));

// Mock fetch with proper typing
const mockFetch = vi.fn() as any;
global.fetch = mockFetch;

describe('PersonalizedGreeting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
  });

  it('renders loading state initially', () => {
    render(<PersonalizedGreeting userId="123" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders generic greeting when personalization is disabled', async () => {
    render(<PersonalizedGreeting userId="123" isPersonalizationEnabled={false} />);
    
    await waitFor(() => {
      expect(screen.getByText('Welcome!')).toBeInTheDocument();
    });
  });

  it('renders personalized greeting with name', async () => {
    const mockResponse = {
      name: 'John Doe',
      lastVisit: '2024-12-07T10:00:00Z'
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<PersonalizedGreeting userId="123" />);

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

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<PersonalizedGreeting userId="123" />);

    await waitFor(() => {
      expect(screen.getByText(/Good (morning|afternoon|evening)/)).toBeInTheDocument();
    });
  });

  it('handles API error gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('API Error'));

    render(<PersonalizedGreeting userId="123" />);

    await waitFor(() => {
      expect(screen.getByText('Welcome!')).toBeInTheDocument();
    });
  });

  it('calls correct API endpoint', async () => {
    const mockResponse = {
      name: 'Jane Smith',
      greeting: 'Good afternoon, Jane Smith!'
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<PersonalizedGreeting userId="user123" />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/personalization/greeting?userId=user123');
    });
  });

  it('tracks greeting display correctly', async () => {
    const { trackGreetingDisplay } = await import('@/scripts/analytics/personalization-tracking');
    
    const mockResponse = {
      name: 'Alice Johnson',
      greeting: 'Good evening, Alice Johnson!'
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<PersonalizedGreeting userId="123" />);

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

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<PersonalizedGreeting userId="123" />);

    await waitFor(() => {
      expect(trackGreetingDisplay).toHaveBeenCalledWith('generic', mockResponse);
    });
  });
});
