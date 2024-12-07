import Link from "next/link";
import { Campaign } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { Bot, MessageSquareIcon } from "lucide-react";

import { getCurrentUser } from "@/lib/session";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CollapsibleServer } from "@/components/dashboard/collapsible-server";
import { getNotificationsByCampaign } from "@/app/actions/notification";
import { getPostedPostsByCampaign } from "@/app/actions/post";
import { getPostPreferencesByCampaign } from "@/app/actions/post-preferences";

import AutopilotSwitch from "./autopilot-switch";
import { CampaignMenu } from "./campaign-menu";

interface CampaignProps {
  campaigns: Campaign[];
}

export async function Campaigns({ campaigns }: CampaignProps) {
  const session = await getCurrentUser();
  return (
    <div className="grid grid-cols-1 gap-5">
      {campaigns.map(async (campaign, index) => {
        const result = await getNotificationsByCampaign(campaign.id);
        if (result.type === "error") {
          console.error(result.message);
        }

        const notifications = result.data;
        const postsResult = await getPostedPostsByCampaign(campaign.id);

        if (postsResult.type === "error") {
          console.error(postsResult.message);
        }

        const posts = postsResult.data;

        const postsIn24Hours = posts?.filter((post) => {
          const postDate = new Date(post.updatedAt);
          const currentDate = new Date();
          const diff = currentDate.getTime() - postDate.getTime();
          const diffInHours = diff / (1000 * 60 * 60);
          return diffInHours <= 24;
        });

        const preferences = await getPostPreferencesByCampaign(campaign.id);

        return (
          <>
            <Card key={index}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="flex flex-col space-y-1.5">
                  <Link
                    href={{
                      pathname: "/project",
                      query: { id: campaign.id },
                    }}
                  >
                    <CardTitle className="underline">{campaign.name}</CardTitle>
                  </Link>
                  <CardDescription>{campaign.description}</CardDescription>
                </div>
                <CampaignMenu campaignId={campaign.id} />
              </CardHeader>
              <CardContent className="flex flex-col space-y-4">
                <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
                  <div className="flex-1 rounded-md border p-4">
                    <div className="flex flex-row items-center space-x-4">
                      <MessageSquareIcon className="size-5" />
                      <h3 className="text-sm font-semibold">
                        Total Replies:{" "}
                        <span className="font-normal">{posts?.length}</span>
                      </h3>
                    </div>
                  </div>
                  <div className="flex-1 rounded-md border p-4">
                    <div className="flex flex-row items-center space-x-4">
                      <MessageSquareIcon className="size-5" />
                      <h3 className="text-sm font-semibold">
                        Replies in 24 hrs:{" "}
                        <span className="font-normal">
                          {postsIn24Hours?.length}
                        </span>
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 rounded-md border p-4">
                  <Bot />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Autopilot
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Automatically find & reply to posts across sites
                    </p>
                  </div>
                  <AutopilotSwitch
                    autoPilotStatus={campaign.autoPilot}
                    campaignId={campaign.id}
                    postPreferences={preferences.data}
                    userEmail={session?.email || ""}
                    userName={session?.name || ""}
                    campaignName={campaign.name}
                  />
                </div>
                {notifications && notifications?.length > 0 && (
                  <div className="flex items-center space-x-4 rounded-md border p-4">
                    <CollapsibleServer>
                      {notifications && notifications?.length > 0 ? (
                        notifications?.map((notification, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-[25px_1fr] items-start p-3 last:mb-0 last:pb-0"
                          >
                            <span
                              className={`flex size-2 translate-y-1 rounded-full bg-violet-400`}
                            />
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">
                                {notification.message}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatDistanceToNow(notification.updatedAt, {
                                  addSuffix: true,
                                })}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center p-3 last:mb-0 last:pb-0">
                          <p className="text-sm leading-none text-gray-400">
                            No notifications yet
                          </p>
                        </div>
                      )}
                    </CollapsibleServer>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        );
      })}
    </div>
  );
}
