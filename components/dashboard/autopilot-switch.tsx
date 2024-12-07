"use client";

import { useState } from "react";
import { PostPreference } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { siteConfig } from "@/config/site";
import { Switch } from "@/components/ui/switch";
import { toggleCampaignAutoPilot } from "@/app/actions";
import { sendAutopilotActivationEmail } from "@/app/actions/email";

import { AddPostPreferencesModal } from "./add-post-preferences-moda";

interface AutopilotSwitchProps {
  autoPilotStatus: boolean;
  campaignId: string;
  postPreferences: PostPreference | null;
  userEmail: string;
  userName: string;
  campaignName: string;
}

const updateStatus = async (campaignId: string, status: boolean) => {
  const result = await toggleCampaignAutoPilot(campaignId, status);

  if (result.type === "error") {
    throw new Error(result.message);
  }

  return result.message;
};

const AutopilotSwitch = ({
  autoPilotStatus,
  postPreferences,
  campaignId,
  userEmail,
  userName,
  campaignName,
}: AutopilotSwitchProps) => {
  const [isAutoPilotEnabled, setIsAutoPilotEnabled] =
    useState<boolean>(autoPilotStatus);
  const [showModal, setShowModal] = useState<boolean>(false);

  const { mutate } = useMutation({
    mutationFn: (checked: boolean) => updateStatus(campaignId, checked),
    onMutate: () => {
      toast.info("Updating Autopilot status...", {
        duration: 2000,
      });
    },
    onSuccess: async (data, variables) => {
      toast.success("Autopilot status updated successfully", {
        duration: 5000,
      });
      try {
        const siteName = siteConfig.name;

        console.log("variables", variables);

        if (variables) {
          if (variables) {
            if (isAutoPilotEnabled) {
              const res = await sendAutopilotActivationEmail(
                userEmail,
                userName,
                siteName,
                campaignName,
              );
              console.log("res", res);
            }
          }
        }
      } catch (error) {
        console.error("Failed to send Autopilot email:", error);
        toast.error("Failed to send Autopilot email notification.");
      }
    },
    onError: (error) => {
      setIsAutoPilotEnabled(!isAutoPilotEnabled);
      toast.error(`Failed to update Autopilot status: ${error}`);
    },
  });

  const handleCheckedChange = async (checked: boolean) => {
    if (!postPreferences) {
      setShowModal(true);
    } else {
      setIsAutoPilotEnabled(checked);
      mutate(checked);
    }
  };

  const handlePreferencesSet = () => {
    setIsAutoPilotEnabled(true);
    mutate(true);
  };

  return (
    <div>
      <Switch
        checked={isAutoPilotEnabled}
        onCheckedChange={handleCheckedChange}
      />
      {showModal && (
        <AddPostPreferencesModal
          setModalOpen={setShowModal}
          campaign_id={campaignId}
          onPreferencesSet={handlePreferencesSet}
        />
      )}
    </div>
  );
};

export default AutopilotSwitch;
