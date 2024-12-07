import { notFound } from "next/navigation";

import { dashboardConfig } from "@/config/dashboard";
import { getCurrentUser } from "@/lib/session";
import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";

interface PlaygroundLayoutProps {
  children?: React.ReactNode;
}

export default async function PlaygroundLayout({
  children,
}: PlaygroundLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <NavBar user={user} items={dashboardConfig.mainNav} scroll={false} />

      <main className="flex size-full flex-1 flex-col">{children}</main>
      <SiteFooter className="border-t" />
    </div>
  );
}
