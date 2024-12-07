import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { Campaigns } from "@/components/dashboard/campaigns";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
// import { AddCampaignModal } from "@/components/dashboard/add-campaign-modal";
import { getAllCampaigns } from "@/app/actions/campaign";

export const metadata = {
  title: "BuzzDaddy Overview",
  description: "Manage account and website settings.",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  const result = await getAllCampaigns(user.id);

  if (result.type === "error" || !result.data) {
    console.error(result.message);
    return null;
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Campaigns" text="Manage all your campaigns.">
        {/* <AddCampaignModal /> */}
      </DashboardHeader>
      <Campaigns campaigns={result.data} />
    </DashboardShell>
  );
}
