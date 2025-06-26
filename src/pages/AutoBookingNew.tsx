import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { CampaignForm } from "@/components/autobooking/CampaignForm";
import PageWrapper from "@/components/layout/PageWrapper";
import TopNavigation from "@/components/navigation/TopNavigation";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { CampaignFormData } from "@/types/campaign";
import { campaignService } from "@/services/campaignService";

export default function AutoBookingNew() {
  const navigate = useNavigate();
  const { userId } = useCurrentUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Auto-booking", href: "/auto-booking" },
    { label: "New Campaign", href: "/auto-booking/new" }
  ];

  const handleSubmit = async (data: CampaignFormData) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a campaign.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const campaign = await campaignService.createCampaign(data, userId);
      
      toast({
        title: "Campaign created",
        description: "Your auto-booking campaign has been created and is now active.",
      });
      
      navigate("/auto-booking");
    } catch (error) {
      console.error("Failed to create campaign:", error);
      toast({
        title: "Error creating campaign",
        description: error instanceof Error ? error.message : "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/auto-booking");
  };

  return (
    <PageWrapper>
      <TopNavigation />
      <div className="container mx-auto py-8 space-y-6">
        <Breadcrumbs />
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Auto-booking Campaign</h1>
            <p className="text-muted-foreground mt-2">
              Set up automated flight booking with your travel preferences
            </p>
          </div>
        </div>

        <div className="max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>
                Configure your travel criteria and budget. We'll automatically book flights that match your preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CampaignForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSubmitting={isSubmitting}
                submitLabel="Create Campaign"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
