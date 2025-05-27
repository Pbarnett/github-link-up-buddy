import React from 'react'
import NotificationsPanel from '@/components/NotificationsPanel'

export default function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      <NotificationsPanel />
      {/* existing dashboard content */}
    </div>
  )
}
