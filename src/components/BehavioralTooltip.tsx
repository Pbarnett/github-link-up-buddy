import { Button } from '@/components/ui/button';
import * as React from 'react';
interface BehavioralTooltipProps {
  show: boolean;
  onDismiss: () => void;
  variant?: 'hesitation' | 'price-proof';
}

export const BehavioralTooltip = ({ show, onDismiss, variant = 'hesitation' }: BehavioralTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      // Slight delay for natural feel
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      return undefined;
    }
  }, [show]);

  if (!isVisible) return null;

  const getContent = () => {
    switch (variant) {
      case 'hesitation':
        return {
          title: "Need help choosing?",
          message: "Most travelers save 40% with Auto-Booking vs manual search",
          cta: "Learn why"
        };
      case 'price-proof':
        return {
          title: "💰 Average savings",
          message: "$247 per trip with smart auto-booking",
          cta: "See how"
        };
      default:
        return {
          title: "Need help?",
          message: "We're here to help you save on flights",
          cta: "Learn more"
        };
    }
  };

  const content = getContent();

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-medium text-gray-900">
              {content.title}
            </h4>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
        
        <p className="text-xs text-gray-600 mb-3">
          {content.message}
        </p>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onDismiss}
            className="text-xs h-7 px-3"
          >
            {content.cta}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onDismiss}
            className="text-xs h-7 px-3 text-gray-500"
          >
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  );
};
