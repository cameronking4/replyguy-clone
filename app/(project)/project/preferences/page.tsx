import { SearchParams } from "@/types";
import { redirect } from "next/navigation";

import { getPostPreferencesByCampaign } from "@/app/actions/post-preferences";
import { AddPostPreferencesModal } from "@/components/dashboard/add-post-preferences-moda";
import { DashboardHeader } from "@/components/dashboard/header";
import { PostPreferencesForm } from "@/components/dashboard/post-preferences-form";
import { DashboardShell } from "@/components/dashboard/shell";
import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";

export const metadata = {
  title: "BuzzDaddy Autopilot",
  description: "Manage post frequency, target platforms and interaction types.",
};

interface PreferencesPageProps {
  searchParams: SearchParams<"id">;
}

export default async function PreferencesPage({
  searchParams,
}: PreferencesPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  const preferences = await getPostPreferencesByCampaign(
    searchParams.id as string,
  );

  if (!preferences.data) {
    return <AddPostPreferencesModal />;
  }

  return (
    <>
      <DashboardShell>
        <DashboardHeader
          heading="Autopilot Settings"
          text="Manage post frequency, target platforms and interaction types."
        ></DashboardHeader>
        <div className="grid gap-10 px-2 pb-4 md:pb-8">
          <PostPreferencesForm />
        </div>
      </DashboardShell>
    </>
  );
}
