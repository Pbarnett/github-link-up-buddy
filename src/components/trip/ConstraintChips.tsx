
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Lock, ToggleLeft, ToggleRight } from 'lucide-react';

interface ConstraintChipsProps {
  dateRange: { from: string; to: string };
  nonStopOnly: boolean;
  onToggleNonStop: () => void;
}

const ConstraintChips: React.FC<ConstraintChipsProps> = ({
  dateRange,
  nonStopOnly,
  onToggleNonStop,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Carry-on included chip */}
      <Badge variant="secondary" className="flex items-center gap-1">
        <Lock className="h-3 w-3" />
        Carry-on included
      </Badge>

      {/* Date range chip */}
      <Badge variant="secondary" className="flex items-center gap-1">
        <Lock className="h-3 w-3" />
        {formatDate(dateRange.from)} – {formatDate(dateRange.to)}
      </Badge>

      {/* Non-stop only toggle chip */}
      <Badge 
        variant={nonStopOnly ? "default" : "outline"}
        className="flex items-center gap-1 cursor-pointer hover:bg-opacity-80 transition-colors"
        onClick={onToggleNonStop}
      >
        {nonStopOnly ? (
          <ToggleRight className="h-3 w-3" />
        ) : (
          <ToggleLeft className="h-3 w-3" />
        )}
        Non-stop only
      </Badge>
    </div>
  );
};

export default ConstraintChips;
