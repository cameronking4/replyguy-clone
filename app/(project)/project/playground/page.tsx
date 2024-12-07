import { Metadata } from "next";
import { redirect } from "next/navigation";
import { SearchParams } from "@/types";

import { getCurrentUser } from "@/lib/session";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/header";
import { getCampaignById } from "@/app/actions/campaign";

import { VoiceTonePersonalityForm } from "./components/form";

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

  const result = await getCampaignById(campaignId);
  if (!result.data) {
    redirect("/dashboard/campaigns");
  }

  return (
    <>
      <DashboardHeader
        heading="Adjust Tone & Voice"
        text="Customize the tone and voice of your AI agent's replies."
      />
      <Card className="mt-4 w-full">
        <CardContent className="grid gap-6 pt-6">
          <VoiceTonePersonalityForm
            campaignId={campaignId}
            voice={result?.data?.voice}
            tone={result?.data?.tone}
            personality={result?.data?.personality}
          />
        </CardContent>
      </Card>
    </>
  );
}
