import { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { SearchParams } from "@/types";

import { getCurrentUser } from "@/lib/session";
import { Separator } from "@/components/ui/separator";
import { DashboardHeader } from "@/components/dashboard/header";
import { getAllCampaigns } from "@/app/actions/campaign";

import { CampaignSelector } from "./components/campaign-selector";
import { KeywordManagementModal } from "./components/keyword-management-modal";
import { PlaygroundResultsDisplay } from "./components/playground-results-display";
import { PlaygroundSettingsForm } from "./components/playground-settings-form";

export const metadata: Metadata = {
  title: "Playground",
  description: "Experiment real-time with keywords.",
};

export default async function PlaygroundPage({
  searchParams,
}: {
  searchParams: SearchParams<"id">;
}) {
  const user = await getCurrentUser();
  if (!user?.id) {
    redirect("/login");
  }

  const campaignId = searchParams.id as string;
  if (!campaignId) {
    redirect("/dashboard/campaigns");
  }

  const result = await getAllCampaigns(user.id);
  const campaigns = result.data;
  const campaignsSelector =
    campaigns?.map((campaign) => ({
      id: campaign.id,
      name: campaign.name,
    })) || [];

  return (
    <>
      <DashboardHeader
        heading="Keyword Explorer"
        text="Test your keywords on live search results."
      />
      <div className="md:hidden">
        <Image
          src="/examples/playground-light.png"
          width={1280}
          height={916}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/examples/playground-dark.png"
          width={1280}
          height={916}
          alt="Playground"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden h-full flex-col md:flex">
        <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <div className="flex w-full items-start space-x-2">
            <CampaignSelector
              defaultCampaignId={campaignId}
              campaigns={campaignsSelector}
            />
            <KeywordManagementModal />
          </div>
        </div>
        <Separator />
        <div className="container h-full py-6">
          <div className="grid h-full items-stretch gap-6 md:grid-cols-[200px_1fr]">
            <div className="hidden flex-col space-y-4 sm:flex md:order-1">
              <PlaygroundSettingsForm />
            </div>
            <div className="md:order-2">
              <div className="flex h-full flex-col space-y-4 rounded-2xl border p-4">
                <PlaygroundResultsDisplay />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
