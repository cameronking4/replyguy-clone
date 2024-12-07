import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LinkedInPostContent,
  Platform,
  RedditPostContent,
  TwitterPostContent,
} from "@/schemas/content-interaction";
import { SearchParams } from "@/types";
import { Campaign } from "@prisma/client";
import {
  ArrowBigDown,
  ArrowBigUp,
  CornerDownRightIcon,
  ExternalLinkIcon,
  HeartIcon as Favourites,
  MessageSquare,
  Repeat2Icon as Retweet,
  Share,
  ThumbsUp,
  SendIcon as View,
} from "lucide-react";
import { MdPendingActions } from "react-icons/md";
import { RiArticleLine } from "react-icons/ri";

import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardShell } from "@/components/dashboard/shell";
import { getCampaignById } from "@/app/actions/campaign";
import { getCommentByPostId } from "@/app/actions/comment";
import { getPostByPlatform } from "@/app/actions/post";

import { ClientTabWrapper } from "./_components/client-tab-wrapper";
import { DeletePostModal } from "./_components/delete-post-modal";
import { EditComment } from "./_components/edit-comment";
import { FindNewContentButton } from "./_components/find-content-button";
import { GenerateComment } from "./_components/generate-comment";
import { PostComment } from "./_components/post-comment";

export const metadata = {
  title: "Dashboard",
};

interface DashboardPageProps {
  searchParams: SearchParams<"id">;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    console.warn("User not authenticated. Redirecting to login.");
    redirect(authOptions?.pages?.signIn || "/login");
  }

  const { id } = searchParams;
  const campaignId = id as string;

  if (!id) {
    console.warn("Campaign ID missing. Redirecting to campaigns.");
    redirect("/dashboard/campaigns");
  }

  const result = await getCampaignById(campaignId);
  if (result.type === "error" || !result.data) {
    redirect("/dashboard/campaigns");
  }

  const campaign = result.data;

  return (
    <DashboardShell>
      <div className="flex items-center justify-between px-2">
        <div className="grid">
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-3xl md:text-4xl">
              {campaign.name}
            </h1>
          </div>
          <div className="mt-2 flex flex-col items-start gap-2 text-muted-foreground">
            <Link
              href={campaign.businessUrl}
              rel="noopener noreferrer"
              target="_blank"
              className="flex items-center gap-2 text-sm hover:underline"
            >
              {campaign.businessUrl}
              <ExternalLinkIcon className="size-4" />
            </Link>
            <p className="text-sm">{campaign.createdAt.toUTCString()}</p>
          </div>
        </div>
        <FindNewContentButton />
      </div>

      <div className="grid gap-10">
        <ClientTabWrapper>
          <TabsContent value="TWITTER">
            <PlatformTabs
              platform="TWITTER"
              campaignId={campaignId}
              campaign={campaign}
            />
          </TabsContent>
          <TabsContent value="LINKEDIN">
            <PlatformTabs
              platform="LINKEDIN"
              campaignId={campaignId}
              campaign={campaign}
            />
          </TabsContent>
          <TabsContent value="REDDIT">
            <PlatformTabs
              platform="REDDIT"
              campaignId={campaignId}
              campaign={campaign}
            />
          </TabsContent>
        </ClientTabWrapper>
      </div>
    </DashboardShell>
  );
}

const PlatformTabs = async ({
  platform,
  campaignId,
  campaign,
}: {
  platform: Platform;
  campaignId: string;
  campaign: Campaign;
}) => {
  const result = await getPostByPlatform(platform, campaignId);

  if (result.type === "error") {
    console.error(`Failed to fetch posts for ${platform}:`, result.message);
    return <div>{result.message}</div>;
  }

  return (
    <Tabs
      defaultValue="replies"
      className="flex items-start justify-start gap-4"
    >
      <TabsList className="flex h-fit flex-col space-y-2">
        <TabsTrigger value="replies" className="w-full justify-start">
          <MdPendingActions className="mr-2 size-4" />
          <span>Replies</span>
        </TabsTrigger>
        <TabsTrigger value="posted" className="w-full justify-start">
          <RiArticleLine className="mr-2 size-4" />
          <span>Posted</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="replies" className="w-full space-y-4">
        {result.data && result.data.length > 0 ? (
          result.data
            .filter((post) => post.status === "PENDING")
            .map(async (post) => {
              const content = post.content as any;
              const comment = await getCommentByPostId(post.id);

              return (
                <div key={post.id}>
                  {
                    {
                      TWITTER: (
                        <TwitterPostCard
                          key={post.id}
                          content={content}
                          postId={post.id}
                        />
                      ),
                      REDDIT: (
                        <RedditPostCard
                          key={post.id}
                          content={content}
                          postId={post.id}
                        />
                      ),
                      LINKEDIN: (
                        <LinkedInPostCard
                          key={post.id}
                          content={content}
                          postId={post.id}
                        />
                      ),
                    }[platform]
                  }
                  <div className="mt-2 flex items-start gap-2">
                    <Button variant={"ghost"}>
                      <CornerDownRightIcon className="size-7" />
                    </Button>
                    <Card className="w-full">
                      <CardHeader className="flex items-center justify-center bg-muted">
                        {comment.type === "success" && comment.data ? (
                          <div className="space-y-2">
                            <CardDescription className="">
                              {comment.data.content}
                            </CardDescription>
                            <div className="flex items-center justify-end gap-2">
                              <EditComment comment={comment.data} post={post} />
                              <PostComment
                                comment={comment.data}
                                post={post as any}
                                activeTab={platform}
                              />
                            </div>
                          </div>
                        ) : (
                          <CardDescription className="flex items-center text-center">
                            <span className="mr-2">No comment found.</span>
                            <GenerateComment post={post} campaign={campaign} />
                          </CardDescription>
                        )}
                      </CardHeader>
                    </Card>
                  </div>
                </div>
              );
            })
        ) : (
          <NoContentCard message={`No pending posts found for ${platform}`} />
        )}
      </TabsContent>
      <TabsContent value="posted" className="w-full space-y-4">
        {result.data && result.data.length > 0 ? (
          result.data
            .filter((post) => post.status === "POSTED")
            .map((post) => {
              const content = post.content as any;
              return (
                {
                  TWITTER: (
                    <TwitterPostCard
                      key={post.id}
                      content={content}
                      postId={post.id}
                    />
                  ),
                  REDDIT: (
                    <RedditPostCard
                      key={post.id}
                      content={content}
                      postId={post.id}
                    />
                  ),
                  LINKEDIN: (
                    <LinkedInPostCard
                      key={post.id}
                      content={content}
                      postId={post.id}
                    />
                  ),
                }[platform] || <div>Not implemented</div>
              );
            })
        ) : (
          <NoContentCard message={`Nothing posted yet for ${platform}`} />
        )}
      </TabsContent>
    </Tabs>
  );
};

interface NoContentCardProps {
  message: string;
}

const NoContentCard = ({ message }: NoContentCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardDescription className="text-center">{message}</CardDescription>
      </CardHeader>
    </Card>
  );
};

const TwitterPostCard = ({
  content,
  postId,
}: {
  content: TwitterPostContent;
  postId: string;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-5">
        <CardTitle className="text-base font-normal">
          {content.full_text}
        </CardTitle>
        <div className="justify-end">
          <DeletePostModal postId={postId} />
        </div>
      </CardHeader>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="flex items-center">
            <Retweet className="mr-2 size-5" />
            <span>{content.retweet_count}</span>
          </p>
          <p className="flex items-center">
            <Favourites className="mr-2 size-5" />
            <span>{content.favorite_count}</span>
          </p>
          <p>{formatDate(content.created_at)}</p>
        </div>
        <Link
          href={content.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({
              variant: "secondary",
              className: "h-8 text-sm",
              size: "sm",
            }),
          )}
        >
          View
          <View className="ml-2 size-4" />
        </Link>
      </CardFooter>
    </Card>
  );
};

const RedditPostCard = ({
  content,
  postId,
}: {
  content: RedditPostContent;
  postId: string;
}) => {
  return (
    <Card>
      <div className="mx-auto max-w-3xl overflow-hidden bg-card text-card-foreground shadow-md">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="mb-2 flex items-center">
              <span className="text-sm font-medium">r/{content.subreddit}</span>
              <span className="mx-1 text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                Posted by u/{content.author} {formatDate(content.createdAt)}
              </span>
            </div>
            <div className="justify-end">
              <DeletePostModal postId={postId} />
            </div>
          </div>
          <h2 className="mb-2 text-xl font-semibold">
            <Link href={content.url} target="_blank" rel="noopener noreferrer">
              {content.title}
            </Link>
          </h2>
          <p className="mb-4 text-base">
            {content.selftext.length > 200
              ? content.selftext.slice(0, 200) + "..."
              : content.selftext}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="icon" aria-label="Upvote">
                  <ArrowBigUp className="h-5 w-5" />
                </Button>
                <span className="font-medium">{content.upvotes}</span>
                <Button variant="ghost" size="icon" aria-label="Downvote">
                  <ArrowBigDown className="h-5 w-5" />
                </Button>
              </div>
              <Button variant="ghost" className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>{content.numComments} Comments</span>
              </Button>
            </div>
            <Link
              href={content.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({
                  variant: "secondary",
                  className: "h-8 text-sm",
                  size: "sm",
                }),
              )}
            >
              View
              <View className="ml-2 size-4" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

const LinkedInPostCard = ({
  content,
  postId,
}: {
  content: LinkedInPostContent;
  postId: string;
}) => {
  return (
    <Card>
      <div className="mx-auto max-w-3xl overflow-hidden bg-card text-card-foreground shadow-md">
        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <Link
              href={content.authorProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <div>
                <p className="text-sm font-medium">{content.authorFullName}</p>
                <p className="text-xs text-muted-foreground">
                  {content.authorTitle} • {content.authorFollowersCount}{" "}
                  followers
                </p>
              </div>
            </Link>
            <div className="justify-end">
              <DeletePostModal postId={postId} />
            </div>
          </div>
          <h2 className="mb-2 text-xl font-semibold">
            <Link href={content.url} target="_blank" rel="noopener noreferrer">
              {content.title}
            </Link>
          </h2>
          <p className="mb-4 text-base">
            {content.text.length > 200
              ? content.text.slice(0, 200) + "..."
              : content.text}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                {content.canReact && (
                  <>
                    <Button variant="ghost" size="icon" aria-label="Like">
                      <ThumbsUp className="h-5 w-5" />
                    </Button>
                    <span className="font-medium">{content.numLikes}</span>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-1">
                {content.canPostComments && (
                  <>
                    <Button variant="ghost" size="icon" aria-label="Comment">
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                    <span>{content.numComments} Comments</span>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-1">
                {content.canShare && (
                  <>
                    <Button variant="ghost" size="icon" aria-label="Share">
                      <Share className="h-5 w-5" />
                    </Button>
                    <span>{content.numShares} Shares</span>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {content.timeSincePosted}
              </p>
            </div>
            <Link
              href={content.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({
                  variant: "secondary",
                  className: "h-8 text-sm",
                  size: "sm",
                }),
              )}
            >
              View
              <View className="ml-2 size-4" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();

  const isSameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isSameDay) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
};
