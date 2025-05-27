import React from 'react'; // Explicit import for clarity, though often implicit
import { Badge } from '@/components/ui/badge';
import { useNotifications, NotificationType } from '../hooks/useNotifications'; // Assuming path from src/components/

export default function NotificationsPanel() {
  const { data: notifications = [], isLoading, error } = useNotifications();

  if (isLoading) {
    return <div className="p-4">Loading notifications…</div>; // Added padding for consistency
  }

  if (error) {
    // Basic error handling, can be more sophisticated
    // Added some styling to make it more visible
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
        Error loading notifications: {error.message}
      </div>
    );
  }

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-bold mb-2 flex items-center"> {/* Added flex and items-center for badge alignment */}
        Notifications 
        <Badge variant="secondary" className="ml-2"> {/* Added margin and variant for better visual */}
          {notifications.length}
        </Badge>
      </h2>
      {notifications.length === 0 ? (
        <p className="mt-2 text-gray-500">No new notifications</p> // Use <p> for empty state outside <ul>
      ) : (
        <ul className="mt-2 space-y-2">
          {notifications.map((n: NotificationType) => (
            <li key={n.id} className="border-b last:border-b-0 py-1"> {/* Added border for separation */}
              <a 
                href={`/trip/offers?id=${n.trip_request_id}`} 
                className="block hover:underline text-sm text-blue-600 hover:text-blue-800" // Adjusted text size
              >
                {n.message}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
