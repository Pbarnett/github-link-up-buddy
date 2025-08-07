import {
  User,
  Phone,
  FileText,
  Settings,
  Shield,
  AlertTriangle,
  TrendingUp,
  Target,

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,

interface ProfileCompletionWidgetProps {
  completeness: ProfileCompletenessScore;
  onCategoryClick?: (category: string) => void;
  className?: string;
}

const categoryIcons = {
  basic_info: User,
  contact_info: Phone,
  travel_documents: FileText,
  preferences: Settings,
  verification: Shield,
};

const categoryLabels = {
  basic_info: 'Basic Info',
  contact_info: 'Contact Info',
  travel_documents: 'Travel Documents',
  preferences: 'Preferences',
  verification: 'Verification',
};

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-600';
  if (score >= 70) return 'text-blue-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-red-600';
};

const getScoreBadgeVariant = (score: number) => {
  if (score >= 90) return 'default' as const;
  if (score >= 70) return 'secondary' as const;
  if (score >= 50) return 'outline' as const;
  return 'destructive' as const;
};

const getProgressColor = (score: number) => {
  if (score >= 90) return 'bg-green-500';
  if (score >= 70) return 'bg-blue-500';
  if (score >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

export function ProfileCompletionWidget({
  completeness,
  onCategoryClick,
  className = '',
}: ProfileCompletionWidgetProps) {
  const { overall, categories, missing_fields, recommendations } = completeness;

  const getScoreMessage = (score: number) => {
    if (score >= 95) return 'Excellent! Your profile is complete.';
    if (score >= 80) return 'Great! Your profile is almost complete.';
    if (score >= 60) return 'Good progress! Keep adding information.';
    if (score >= 40) return 'Getting started. Add more details to improve.';
    return "Let's build your profile together.";
  };

  const topRecommendation = recommendations?.[0];

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Profile Completion
            </CardTitle>
            <CardDescription>{getScoreMessage(overall)}</CardDescription>
          </div>
          <Badge
            variant={getScoreBadgeVariant(overall)}
            className="text-lg px-3 py-1"
          >
            {overall}%
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Overall Progress</span>
            <span className={`font-semibold ${getScoreColor(overall)}`}>
              {overall}/100
            </span>
          </div>
          <div className="relative">
            <Progress value={overall} className="h-3" />
            <div
              className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-500 ${getProgressColor(overall)}`}
              style={{ width: `${overall}%` }}
            />
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">
            Category Breakdown
          </h4>
          <div className="grid gap-3">
            {Object.entries(categories).map(([category, score]) => {
              const Icon =
                categoryIcons[category as keyof typeof categoryIcons];
              const label =
                categoryLabels[category as keyof typeof categoryLabels];

              return (
                <div
                  key={category}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    onCategoryClick ? 'cursor-pointer hover:bg-accent' : ''
                  }`}
                  onClick={() => onCategoryClick?.(category)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={score} className="w-16 h-2" />
                    <span
                      className={`text-sm font-semibold min-w-[3ch] ${getScoreColor(score)}`}
                    >
                      {score}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Recommendation */}
        {topRecommendation && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">
              Quick Win
            </h4>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {topRecommendation.priority === 'high' ? (
                    <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-900">
                    {topRecommendation.title}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    {topRecommendation.description}
                  </p>
                  {topRecommendation.points_value && (
                    <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />+
                      {topRecommendation.points_value} points
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Missing Fields Summary */}
        {missing_fields.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">
              Missing Information ({missing_fields.length})
            </h4>
            <div className="flex flex-wrap gap-1">
              {missing_fields.slice(0, 5).map(field => (
                <Badge key={field} variant="outline" className="text-xs">
                  {field.replace(/_/g, ' ')}
                </Badge>
              ))}
              {missing_fields.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{missing_fields.length - 5} more
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
            onClick={() => onCategoryClick?.('general')}
          >
            {overall < 50 ? 'Complete Profile' : 'Improve Profile'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
