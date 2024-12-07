"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CreatePostRequest,
  LinkedInPostContent,
  Platform,
  RedditPostContent,
  TwitterPostContent,
} from "@/schemas/content-interaction";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
import { FaSearchengin } from "react-icons/fa6";
import { toast } from "sonner";

import { cn, splitIntoBatches } from "@/lib/utils";
import { useTabStore } from "@/hooks/use-tab-store";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { filterRelevantPostsInBatches } from "@/app/actions";
import { getKeywordsByCampaign } from "@/app/actions/keywords";
import { createPosts } from "@/app/actions/post";

type PlatformPost =
  | TwitterPostContent
  | LinkedInPostContent
  | RedditPostContent;

interface PlatformPostsResponse {
  responseData: PlatformPost[];
}

const API_ENDPOINTS = {
  TWITTER: "/api/x",
  LINKEDIN: "/api/linkedin",
  REDDIT: "/api/reddit",
};

export const FindNewContentButton = () => {
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { activeTab } = useTabStore();

  const campaignId = searchParams.get("id");
  if (!campaignId) {
    toast.error("Campaign ID is not defined.");
    return null;
  }

  const fetchPlatformPosts = async (
    campaignId: string,
    activeTab: Platform,
    dateRange: { start?: Date; end?: Date },
  ): Promise<PlatformPostsResponse> => {
    const keywordsResult = await getKeywordsByCampaign(campaignId);
    if (!keywordsResult.data) {
      throw new Error("No keywords found for the campaign.");
    }

    const keywordList = keywordsResult.data.map((keyword) => keyword.keyword);

    const now = new Date();
    const startDate = dateRange.start || subDays(now, 10);
    const endDate = dateRange.end || now;

    const response = await fetch(
      `${API_ENDPOINTS[activeTab]}?query=${keywordList.join(",")}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch new posts for ${activeTab}`);
    }

    const data = await response.json();
    const responseData = data.responseData as PlatformPost[];

    return { responseData };
  };

  const savePosts = async (payload: CreatePostRequest) => {
    try {
      const dbResult = await createPosts(payload);
      if (dbResult.type === "error") {
        console.error("Failed to save posts:", dbResult.message);
        throw new Error("Failed to save posts to the database");
      }
    } catch (error) {
      console.error("Error saving posts:", error);
      throw error;
    }
  };

  async function processPostsInBatches(
    posts: CreatePostRequest,
  ): Promise<void> {
    const BATCH_SIZE = 50;
    const batches = splitIntoBatches(posts, BATCH_SIZE);

    for (const batch of batches) {
      try {
        const filteredPosts = await filterRelevantPostsInBatches(
          batch,
          campaignId!,
        );
        const relevantPosts: CreatePostRequest =
          filteredPosts.type === "success" ? filteredPosts.data : [];
        await savePosts(relevantPosts);
      } catch (error) {
        console.error("Error processing batch:", error);

        console.error("Failed batch:", batch);
      }
    }
  }

  const { mutate, isPending } = useMutation({
    mutationFn: () => fetchPlatformPosts(campaignId, activeTab, dateRange),
    onSuccess: async (data) => {
      try {
        toast.success("Fetched new content successfully", {
          duration: 4000,
        });

        if (data.responseData.length === 0) {
          toast.info("No relevant posts found.");
          return;
        }
        toast.info("Filtering irrelevant posts", {
          duration: 6000,
        });

        const postsPayload: CreatePostRequest = data.responseData.map(
          (post) => ({
            campaignId: campaignId as string,
            platform: activeTab,
            content: post,
          }),
        );

        console.log(postsPayload);

        await processPostsInBatches(postsPayload);
        toast.success("Posts saved successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to save new posts to the database");
      } finally {
        router.refresh();
        setDialogOpen(false);
      }
    },
    onError(error, variables, context) {
      console.error(error);
      toast.error("Failed to find new content");
    },
  });

  const handleFetchContent = () => {
    if (!campaignId) {
      toast.error("Campaign ID is not defined.");
      return;
    }
    mutate();
  };

  const handleDateChange =
    (type: "start" | "end") => (date: Date | undefined) => {
      setDateRange((prev) => ({ ...prev, [type]: date }));
    };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center" size={"sm"} disabled={isPending}>
          <FaSearchengin className={"mr-2 size-5"} />
          Find new posts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Date Range</DialogTitle>
          <DialogDescription>
            Please select a start and end date for fetching new content. If no
            dates are selected, the last 10 days will be used by default.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            {["start", "end"].map((type: "start" | "end") => (
              <Popover key={type}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange[type] && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {dateRange[type] ? (
                      format(dateRange[type], "PPP")
                    ) : (
                      <span>
                        Select {type.charAt(0).toUpperCase() + type.slice(1)}{" "}
                        Date
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange[type]}
                    onSelect={handleDateChange(type)}
                  />
                </PopoverContent>
              </Popover>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleFetchContent}
            disabled={isPending}
          >
            {isPending ? "Fetching..." : "Fetch Content"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
