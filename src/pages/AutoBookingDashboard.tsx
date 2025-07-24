import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCampaigns } from "@/hooks/useCampaigns";
import { CampaignCard } from "@/components/autobooking/CampaignCard";
import PageWrapper from "@/components/layout/PageWrapper";
import { withErrorBoundary } from "@/components/ErrorBoundary";

function AutoBookingDashboard() {
  const navigate = useNavigate();
  const { userId, loading } = useCurrentUser();
  const { campaigns, isLoading, error, pauseCampaign, resumeCampaign, deleteCampaign } = useCampaigns();

  // No breadcrumbs needed since this is the main dashboard page

  const handleCreateCampaign = () => {
    navigate("/auto-booking/new");
  };

  const handleEditCampaign = (campaignId: string) => {
    navigate(`/auto-booking/edit/${campaignId}`);
  };

  const handlePauseCampaign = async (campaignId: string) => {
    try {
      await pauseCampaign(campaignId);
      toast({
        title: "Campaign paused",
        description: "Your auto-booking campaign has been paused.",
      });
    } catch (_error) {  
      toast({
        title: "Error",
        description: "Failed to pause campaign. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResumeCampaign = async (campaignId: string) => {
    try {
      await resumeCampaign(campaignId);
      toast({
        title: "Campaign resumed",
        description: "Your auto-booking campaign is now active.",
      });
    } catch (_error) {  
      toast({
        title: "Error",
        description: "Failed to resume campaign. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    if (window.confirm("Are you sure you want to delete this campaign? This action cannot be undone.")) {
      try {
        await deleteCampaign(campaignId);
        toast({
          title: "Campaign deleted",
          description: "Your auto-booking campaign has been deleted.",
        });
      } catch (_error) {  
        toast({
          title: "Error",
          description: "Failed to delete campaign. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const activeCampaigns = campaigns?.filter(c => c.status === 'active' || c.status === 'watching') || [];
  const pausedCampaigns = campaigns?.filter(c => c.status === 'paused') || [];
  const completedCampaigns = campaigns?.filter(c => c.status === 'booked' || c.status === 'completed') || [];

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <PageWrapper>
        <div className="container mx-auto py-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </PageWrapper>
    );
  }

  // Show login prompt only after loading is complete and user is not authenticated
  if (!userId) {
    return (
      <PageWrapper>
        <div className="container mx-auto py-8">
          <Alert>
            <AlertDescription>
              Please log in to view your auto-booking campaigns.
            </AlertDescription>
          </Alert>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="container mx-auto py-8 space-y-6">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Auto-booking Campaigns</h1>
            <p className="text-muted-foreground mt-2">
              Manage your automated flight booking campaigns
            </p>
          </div>
          <Button onClick={handleCreateCampaign} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Active Campaigns */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold">Active Campaigns</h2>
                <Badge variant="secondary">{activeCampaigns.length}</Badge>
              </div>
              
              {activeCampaigns.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Plane className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No active campaigns</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Create your first auto-booking campaign to start finding great flight deals automatically.
                    </p>
                    <Button onClick={handleCreateCampaign}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Campaign
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {activeCampaigns.map((campaign) => (
                    <CampaignCard
                      key={campaign.id}
                      campaign={campaign}
                      onEdit={() => handleEditCampaign(campaign.id)}
                      onPause={() => handlePauseCampaign(campaign.id)}
                      onResume={() => handleResumeCampaign(campaign.id)}
                      onDelete={() => handleDeleteCampaign(campaign.id)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Paused Campaigns */}
            {pausedCampaigns.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-semibold">Paused Campaigns</h2>
                  <Badge variant="outline">{pausedCampaigns.length}</Badge>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pausedCampaigns.map((campaign) => (
                    <CampaignCard
                      key={campaign.id}
                      campaign={campaign}
                      onEdit={() => handleEditCampaign(campaign.id)}
                      onPause={() => handlePauseCampaign(campaign.id)}
                      onResume={() => handleResumeCampaign(campaign.id)}
                      onDelete={() => handleDeleteCampaign(campaign.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Completed Campaigns */}
            {completedCampaigns.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-semibold">Completed Campaigns</h2>
                  <Badge variant="outline">{completedCampaigns.length}</Badge>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {completedCampaigns.map((campaign) => (
                    <CampaignCard
                      key={campaign.id}
                      campaign={campaign}
                      onEdit={() => handleEditCampaign(campaign.id)}
                      onPause={() => handlePauseCampaign(campaign.id)}
                      onResume={() => handleResumeCampaign(campaign.id)}
                      onDelete={() => handleDeleteCampaign(campaign.id)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

export default withErrorBoundary(AutoBookingDashboard, 'page');
