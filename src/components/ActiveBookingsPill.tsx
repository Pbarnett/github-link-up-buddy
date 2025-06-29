import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ActiveBookingsPillProps {
  count: number;
}

export const ActiveBookingsPill = ({ count }: ActiveBookingsPillProps) => {
  const navigate = useNavigate();

  if (count === 0) return null;

  return (
    <div className="flex justify-center mb-6">
      <Button
        variant="ghost"
        onClick={() => navigate('/auto-booking')}
        className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-full transition-all"
      >
        <Bell className="w-4 h-4" />
        <span className="text-sm font-medium">
          {count} active auto-booking{count > 1 ? 's' : ''}
        </span>
        <span className="text-xs text-slate-500">· View</span>
      </Button>
    </div>
  );
};
