

import * as React from 'react';
type Component<P = {}, S = {}> = React.Component<P, S>;

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle,
  Phone,
  FileText,
  Shield,
  User,
  X
} from 'lucide-react';
import { ProfileRecommendation } from '@/services/profileCompletenessService';

interface RecommendationCardProps {
  recommendation: ProfileRecommendation;
  onAction?: (action: string) => void;
  onDismiss?: () => void;
  className?: string;
  compact?: boolean;
}

const actionIcons = {
  verify_phone: Phone,
  add_phone: Phone,
  add_passport: FileText,
  update_passport: FileText,
  verify_identity: Shield,
  complete_profile: User,
};

const priorityColors = {
  high: {
    border: 'border-orange-200',
    bg: 'bg-orange-50',
    icon: 'text-orange-500',
    badge: 'bg-orange-100 text-orange-800',
  },
  medium: {
    border: 'border-blue-200',
    bg: 'bg-blue-50',
    icon: 'text-blue-500',
    badge: 'bg-blue-100 text-blue-800',
  },
  low: {
    border: 'border-green-200',
    bg: 'bg-green-50',
    icon: 'text-green-500',
    badge: 'bg-green-100 text-green-800',
  },
};

export function RecommendationCard({
  recommendation,
  onAction,
  onDismiss,
  className = '',
  compact = false
}: RecommendationCardProps) {
  const { category, priority, title, description, action, points_value } = recommendation;
  
  const colors = priorityColors[priority];
  const ActionIcon = actionIcons[action as keyof typeof actionIcons] || TrendingUp;
  const PriorityIcon = priority === 'high' ? AlertTriangle : TrendingUp;

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'verify_phone': return 'Verify Phone';
      case 'add_phone': return 'Add Phone';
      case 'add_passport': return 'Add Passport';
      case 'update_passport': return 'Update Passport';
      case 'verify_identity': return 'Verify Identity';
      case 'complete_profile': return 'Complete Profile';
      default: return 'Take Action';
    }
  };

  if (compact) {
    return (
      <Card className={`${colors.border} ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <PriorityIcon className={`h-4 w-4 ${colors.icon} flex-shrink-0`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{title}</p>
                <p className="text-xs text-muted-foreground truncate">{description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {points_value && (
                <Badge variant="secondary" className="text-xs">
                  +{points_value}
                </Badge>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAction?.(action)}
                className="text-xs px-2 py-1"
              >
                {getActionLabel(action)}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${colors.border} ${className}`}>
      <CardContent className={`p-4 ${colors.bg}`}>
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="flex-shrink-0">
                <PriorityIcon className={`h-5 w-5 ${colors.icon} mt-0.5`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{title}</h4>
                  <Badge className={`text-xs ${colors.badge} border-0`}>
                    {priority} priority
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
            
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Details */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="capitalize">{category.replace(/_/g, ' ')}</span>
              {points_value && (
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +{points_value} points
                </span>
              )}
            </div>
            
            <Button
              size="sm"
              onClick={() => onAction?.(action)}
              className="h-8 px-3 text-xs"
            >
              <ActionIcon className="h-3 w-3 mr-1" />
              {getActionLabel(action)}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Recommendation List Component
interface RecommendationListProps {
  recommendations: ProfileRecommendation[];
  onAction?: (action: string) => void;
  onDismiss?: (index: number) => void;
  maxVisible?: number;
  compact?: boolean;
  className?: string;
}

export function RecommendationList({
  recommendations,
  onAction,
  onDismiss,
  maxVisible = 3,
  compact = false,
  className = ''
}: RecommendationListProps) {
  const visibleRecommendations = recommendations.slice(0, maxVisible);
  const hiddenCount = Math.max(0, recommendations.length - maxVisible);

  if (recommendations.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-green-700">All set!</p>
          <p className="text-xs text-muted-foreground">
            No recommendations at this time.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {visibleRecommendations.map((recommendation, index) => (
        <RecommendationCard
          key={`${recommendation.action}-${index}`}
          recommendation={recommendation}
          onAction={onAction}
          onDismiss={onDismiss ? () => onDismiss(index) : undefined}
          compact={compact}
        />
      ))}
      
      {hiddenCount > 0 && (
        <Card className="border-dashed">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              {hiddenCount} more recommendation{hiddenCount > 1 ? 's' : ''} available
            </p>
            <Button variant="ghost" size="sm" className="mt-2">
              View All Recommendations
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
