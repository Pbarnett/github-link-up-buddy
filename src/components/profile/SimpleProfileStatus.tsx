import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Phone,
  FileText,
  Shield
} from 'lucide-react';
import { ProfileCompletenessScore } from '@/services/profileCompletenessService';

interface SimpleProfileStatusProps {
  completeness: ProfileCompletenessScore;
  onActionClick?: (action: string) => void;
  className?: string;
}

export function SimpleProfileStatus({ 
  completeness, 
  onActionClick,
  className = ''
}: SimpleProfileStatusProps) {
  const { overall, missing_fields, recommendations } = completeness;
  
  // Get the most important next step
  const nextStep = recommendations?.[0];
  
  const getStatusMessage = (score: number) => {
    if (score >= 95) return { message: 'Your profile is complete!', variant: 'default' as const };
    if (score >= 80) return { message: 'Almost complete - just a few more details', variant: 'default' as const };
    if (score >= 60) return { message: 'Good progress! Keep adding information', variant: 'default' as const };
    return { message: 'Let\'s complete your profile for the best experience', variant: 'destructive' as const };
  };

  const status = getStatusMessage(overall);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'verify_phone': return Phone;
      case 'add_phone': return Phone;
      case 'add_passport': return FileText;
      case 'update_passport': return FileText;
      case 'verify_identity': return Shield;
      default: return TrendingUp;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Profile Completion</CardTitle>
            <CardDescription>{status.message}</CardDescription>
          </div>
          <Badge variant={overall >= 80 ? 'default' : 'secondary'} className="text-lg px-3 py-1">
            {overall}%
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={overall} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            {overall < 100 ? `${100 - overall}% remaining` : 'Complete!'}
          </p>
        </div>

        {/* Next Step Recommendation */}
        {nextStep && overall < 100 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <strong>Next step:</strong> {nextStep.title}
                  <p className="text-xs text-muted-foreground mt-1">
                    {nextStep.description}
                  </p>
                </div>
                {onActionClick && (
                  <Button 
                    size="sm" 
                    onClick={() => onActionClick(nextStep.action)}
                    className="ml-4"
                  >
                    {getActionIcon(nextStep.action) && 
                      React.createElement(getActionIcon(nextStep.action), { className: 'h-3 w-3 mr-1' })
                    }
                    Take Action
                  </Button>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Completion Status */}
        {overall >= 100 ? (
          <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-700 font-medium">Profile Complete!</span>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-medium">Missing Information:</p>
            <div className="flex flex-wrap gap-1">
              {missing_fields.slice(0, 4).map((field) => (
                <Badge key={field} variant="outline" className="text-xs">
                  {field.replace(/_/g, ' ')}
                </Badge>
              ))}
              {missing_fields.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{missing_fields.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        {overall < 100 && (
          <Button 
            className="w-full" 
            variant={overall < 50 ? 'default' : 'outline'}
            onClick={() => onActionClick?.('complete_profile')}
          >
            {overall < 50 ? 'Start Completing Profile' : 'Continue Profile'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Compact version for dashboard widgets
export function CompactProfileStatus({ 
  completeness,
  onActionClick,
  className = ''
}: SimpleProfileStatusProps) {
  const { overall, recommendations } = completeness;
  const nextStep = recommendations?.[0];

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Progress 
                value={overall} 
                className="w-12 h-12 rounded-full [&>div]:rounded-full" 
              />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                {overall}%
              </span>
            </div>
            <div>
              <p className="font-medium text-sm">Profile</p>
              <p className="text-xs text-muted-foreground">
                {overall >= 100 ? 'Complete' : nextStep?.title || 'In progress'}
              </p>
            </div>
          </div>
          {overall < 100 && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onActionClick?.(nextStep?.action || 'complete_profile')}
            >
              {overall < 50 ? 'Complete' : 'Improve'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
