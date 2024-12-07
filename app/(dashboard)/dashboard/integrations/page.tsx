import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { getLinkedInToken, getTwitterToken } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";
import { ConnectLinkedInCard } from "@/components/connect-linkedin-card";
import { ConnectTwitterCard } from "@/components/connect-twitter-card";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { LinkedInCard } from "@/components/linkedin-card";
import { TwitterCard } from "@/components/twitter-card";

export const metadata = {
  title: "Integrations",
  description: "Manage your app integrations.",
};

export default async function IntegrationsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  const twitterToken = await getTwitterToken(user.id);
  const twitterAccessToken = twitterToken?.accessToken
    ? twitterToken.accessToken
    : "";

  const linkedToken = await getLinkedInToken(user.id);
  const linkedinAccessToken = linkedToken?.accessToken
    ? linkedToken.accessToken
    : "";

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Connect Your Accounts"
        text="Seamlessly integrate and manage your social media accounts."
      />
      <div className="grid gap-8">
        {twitterAccessToken ? (
          <TwitterCard userId={user.id} accessToken={twitterAccessToken} />
        ) : (
          <>
            <ConnectTwitterCard />
          </>
        )}

        {linkedinAccessToken ? (
          <LinkedInCard accessToken={linkedinAccessToken} />
        ) : (
          <ConnectLinkedInCard />
        )}
      </div>
    </DashboardShell>
  );
}
