import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotificationsPanel from '@/components/NotificationsPanel';
import { useNotifications } from '@/hooks/useNotifications';
import { vi } from 'vitest';

// Mock the useNotifications hook
vi.mock('@/hooks/useNotifications', () => ({
  useNotifications: vi.fn(),
}));

// Mock the Badge component as its internal structure might be complex or irrelevant to this test
vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => (
    <span data-testid="mock-badge" {...props}>
      {children}
    </span>
  ),
}));


describe('NotificationsPanel UI', () => {
  const mockNotificationsData = [
    {
      id: '11111111-1111-1111-1111-111111111111',
      message: "Your flight to JFK has been auto-booked!",
      trip_request_id: '22222222-2222-2222-2222-222222222222',
      type: 'auto_booking_success',
      data: { some: 'payload' },
      created_at: new Date().toISOString(),
      is_read: false,
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      message: "System update complete.",
      trip_request_id: null,
      type: 'system_message',
      data: { info: 'details' },
      created_at: new Date().toISOString(),
      is_read: true,
    },
  ];

  beforeEach(() => {
    // Reset mock for each test to default successful state
    (useNotifications as vi.Mock).mockReturnValue({
      data: mockNotificationsData,
      isLoading: false,
      error: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should display the correct notification count in the badge', () => {
    render(
      <MemoryRouter>
        <NotificationsPanel />
      </MemoryRouter>
    );
    // The badge text is the number of notifications
    const badge = screen.getByTestId('mock-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent(mockNotificationsData.length.toString());
  });

  it('should display notification messages', () => {
    render(
      <MemoryRouter>
        <NotificationsPanel />
      </MemoryRouter>
    );
    expect(screen.getByText(mockNotificationsData[0].message)).toBeInTheDocument();
    expect(screen.getByText(mockNotificationsData[1].message)).toBeInTheDocument();
  });

  it('should render a correct link for notifications with trip_request_id', () => {
    render(
      <MemoryRouter>
        <NotificationsPanel />
      </MemoryRouter>
    );
    const linkElement = screen.getByText(mockNotificationsData[0].message).closest('a');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', `/trip/offers?tripRequestId=${mockNotificationsData[0].trip_request_id}`);
  });

  it('should render plain text for notifications without trip_request_id', () => {
    render(
      <MemoryRouter>
        <NotificationsPanel />
      </MemoryRouter>
    );
    const plainTextMessage = screen.getByText(mockNotificationsData[1].message);
    expect(plainTextMessage).toBeInTheDocument();
    // Check that the parent of the plain text message is not an anchor tag
    // The component renders it inside a <li><span>...</span></li>
    expect(plainTextMessage.closest('a')).toBeNull();
    expect(plainTextMessage.tagName).toBe('SPAN'); // As per current implementation
  });

  it('should display "No new notifications" when there are no notifications', () => {
    (useNotifications as vi.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });
    render(
      <MemoryRouter>
        <NotificationsPanel />
      </MemoryRouter>
    );
    expect(screen.getByText('No new notifications')).toBeInTheDocument();
  });

  it('should display loading state', () => {
    (useNotifications as vi.Mock).mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
    });
    render(
      <MemoryRouter>
        <NotificationsPanel />
      </MemoryRouter>
    );
    expect(screen.getByText('Loading notifications…')).toBeInTheDocument();
  });

  it('should display error state', () => {
    const errorMessage = 'Failed to fetch notifications';
    (useNotifications as vi.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: { message: errorMessage },
    });
    render(
      <MemoryRouter>
        <NotificationsPanel />
      </MemoryRouter>
    );
    expect(screen.getByText((content, _element) => content.startsWith('Error loading notifications:') && content.includes(errorMessage))).toBeInTheDocument();
  });
});
