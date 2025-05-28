import React from 'react'
import { Link } from 'react-router-dom' // Added import
import { Badge } from '@/components/ui/badge'
import { useNotifications } from '@/hooks/useNotifications'

// Assuming notification object 'n' has 'id', 'message', and potentially 'trip_request_id' as direct properties.
// If 'trip_request_id' is nested (e.g., n.data.trip_request_id), the access below needs adjustment.

export default function NotificationsPanel() {
  const { data: notifications = [], isLoading, error } = useNotifications()

  if (isLoading) return <div className="p-4">Loading notifications…</div>

  if (error)
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
        Error loading notifications: {error.message}
      </div>
    )

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-bold mb-2 flex items-center">
        Notifications
        <Badge variant="secondary" className="ml-2">
          {notifications.length}
        </Badge>
      </h2>

      {notifications.length === 0 ? (
        <p className="mt-2 text-gray-500">No new notifications</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {notifications.map((n) => (
            <li key={n.id} className="border-b last:border-b-0 py-1">
              {n.trip_request_id ? (
                <Link
                  to={`/trip/offers?tripRequestId=${n.trip_request_id}`}
                  className="block hover:underline text-sm text-blue-600 hover:text-blue-800"
                >
                  {n.message}
                </Link>
              ) : (
                <span className="block text-sm text-gray-700">{n.message}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
