
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye } from 'lucide-react';
import { getStatusIcon, getStatusBadgeVariant } from '@/utils/dashboardUtils';
import { BookingRequest } from '@/hooks/useDashboardData';
import { useState } from 'react';

type Props = {
  request: BookingRequest;
  onRetry: (id: string) => void;
};

export default function BookingRequestCard({ request, onRetry }: Props) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div
      className="flex items-center justify-between p-4 border rounded-lg bg-white hover:shadow-md transition-shadow duration-200 animate-fade-in"
    >
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-muted/60 shadow-sm">
          {getStatusIcon(request.status)}
        </div>
        <div>
          <p className="font-medium text-slate-900">{request.offer_data?.airline} {request.offer_data?.flight_number}</p>
          <p className="text-xs text-gray-500">
            Created {new Date(request.created_at).toLocaleDateString()}
          </p>
          {request.error_message && (
            <div className="flex items-center space-x-2 mt-1">
              <span className="inline-block px-2 py-1 rounded bg-red-50 text-red-600 text-xs font-semibold">Error</span>
              <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Error Details</DialogTitle>
                    <DialogDescription>
                      Booking request {request.id.slice(0, 8)} error information
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4">
                    <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
                      {request.error_message}
                    </pre>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Badge variant={getStatusBadgeVariant(request.status)}
          className={`
            px-3 py-1 rounded-md font-semibold text-xs transition-all duration-150
            ${request.status === "done" ? "bg-green-100 text-green-700 border-green-200"
              : request.status === "failed" ? "bg-red-100 text-red-700 border-red-200"
                : request.status === "processing" ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                  : ""}
          `}
        >
          <span className="capitalize">{request.status.replace('_', ' ')}</span>
        </Badge>
        {request.status === 'failed' && request.attempts < 3 && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onRetry(request.id)}
            className="ml-2 transition hover:scale-105"
          >
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}
