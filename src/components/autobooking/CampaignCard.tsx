import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Campaign } from "@/types/campaign";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, Edit, Pause, Play, Trash2, MapPin, Calendar, DollarSign } from "lucide-react";

interface CampaignCardProps {
  campaign: Campaign;
  onEdit: () => void;
  onPause: () => void;
  onResume: () => void;
  onDelete: () => void;
}

export const CampaignCard = ({ campaign, onEdit, onPause, onResume, onDelete }: CampaignCardProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
      case 'watching':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'paused':
        return <Badge variant="outline">Paused</Badge>;
      case 'booked':
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const isPaused = campaign.status === 'paused';
  const isCompleted = campaign.status === 'booked' || campaign.status === 'completed';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{campaign.name || 'Unnamed Campaign'}</CardTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(campaign.status)}
              <span className="text-sm text-muted-foreground">
                Created {formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true })}
              </span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!isCompleted && (
                <>
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  {isPaused ? (
                    <DropdownMenuItem onClick={onResume}>
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={onPause}>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </DropdownMenuItem>
                  )}
                </>
              )}
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{campaign.criteria?.destination || 'No destination set'}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{campaign.criteria?.departure_dates || 'No dates set'}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>Budget: ${campaign.criteria?.max_price || 'Not set'}</span>
          </div>
        </div>

        {campaign.status === 'watching' && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              Monitoring for deals that match your criteria...
            </p>
          </div>
        )}

        {campaign.status === 'booked' && (
          <div className="pt-2 border-t">
            <p className="text-sm text-green-600 font-medium">
              ✓ Flight successfully booked!
            </p>
          </div>
        )}

        {campaign.status === 'paused' && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              Campaign is paused. Resume to continue monitoring.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
