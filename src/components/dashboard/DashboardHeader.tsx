
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

type Props = {
  email: string;
  refreshing: boolean;
  onRefresh: () => void;
  onSignOut: () => void;
};

export default function DashboardHeader({ email, refreshing, onRefresh, onSignOut }: Props) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">Dashboard</h1>
        <p className="mt-2 text-lg text-gray-600">Hello, {email}</p>
      </div>
      <div className="flex gap-3">
        <Button
          onClick={onRefresh}
          disabled={refreshing}
          variant="outline"
          className="shadow-sm hover:scale-105 transition-transform duration-150"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button onClick={onSignOut} className="shadow-sm hover:scale-105 transition-transform duration-150">Sign Out</Button>
      </div>
    </div>
  );
}
