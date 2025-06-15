
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useState } from 'react';
import BookingRequestCard from './BookingRequestCard';
import EmptyState from './EmptyState';
import StatusFilterTabs from './StatusFilterTabs';
import { BookingRequest } from '@/hooks/useDashboardData';

type Props = {
  bookingRequests: BookingRequest[];
  onRetry: (id: string) => void;
};

const statusList = ['all', 'pending_booking', 'pending_payment', 'processing', 'done', 'failed'] as const;

export default function BookingRequestsTab({ bookingRequests, onRetry }: Props) {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredRequests = statusFilter === 'all'
    ? bookingRequests
    : bookingRequests.filter(r => r.status === statusFilter);

  const statusCounts = {
    all: bookingRequests.length,
    pending_booking: bookingRequests.filter(r => r.status === 'pending_booking').length,
    pending_payment: bookingRequests.filter(r => r.status === 'pending_payment').length,
    processing: bookingRequests.filter(r => r.status === 'processing').length,
    done: bookingRequests.filter(r => r.status === 'done').length,
    failed: bookingRequests.filter(r => r.status === 'failed').length,
  };

  return (
    <Card className="mt-4 shadow-[0_2px_8px_rgba(40,72,100,0.06)] transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle>Booking Requests</CardTitle>
        <CardDescription>Track your flight booking requests and their status</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
          <StatusFilterTabs value={statusFilter} onValueChange={setStatusFilter} statusCounts={statusCounts} />
          <div className="mt-6 transition-all duration-200">
            {filteredRequests.length === 0 ? (
              <EmptyState>
                <div className="mb-1 text-gray-600 font medium">
                  {statusFilter === 'all'
                    ? 'No booking requests yet'
                    : `No ${statusFilter.replace('_', ' ')} requests`}
                </div>
                <div className="text-xs text-muted-foreground">Start a new trip search to create your first booking request.</div>
              </EmptyState>
            ) : (
              <div className="space-y-4">
                {filteredRequests.map(request => (
                  <BookingRequestCard key={request.id} request={request} onRetry={onRetry} />
                ))}
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
