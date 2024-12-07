import { SearchParams } from "@/types";
import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/header";
import { KeywordSelectForm } from "@/components/dashboard/keyword-select-form";
import { DashboardShell } from "@/components/dashboard/shell";
import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";

export const metadata = {
  title: "BuzzDaddy Keywords Configuration",
  description: "Manage your keywords.",
};

interface KeywordPageProps {
  searchParams: SearchParams<"id">;
}

export default async function SettingsPage({ searchParams }: KeywordPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Keywords Configuration"
        text="Manage your keywords."
      ></DashboardHeader>
      <div className="grid gap-10">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold md:text-xl">Keywords</h3>
          <KeywordSelectForm campaignId={searchParams.id as string} />
        </div>
      </div>
    </DashboardShell>
  );
}
