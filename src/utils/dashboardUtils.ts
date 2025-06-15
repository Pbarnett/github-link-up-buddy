
import { RefreshCw, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

export function getStatusIcon(status: string) {
  switch (status) {
    case 'done': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
    case 'processing': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
    case 'pending_booking':
    case 'pending_payment': return <Clock className="h-4 w-4 text-yellow-500" />;
    default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
  }
}

export function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'done': return 'default';
    case 'failed': return 'destructive';
    case 'processing': return 'secondary';
    case 'pending_payment':
    case 'pending_booking': return 'outline';
    default: return 'outline';
  }
}
