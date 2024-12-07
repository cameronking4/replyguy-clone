import { NextRequest, NextResponse } from "next/server";
import {
  CreatePostRequest,
  LinkedInPostContent,
  Platform,
  RedditPostContent,
  TwitterPostContent,
} from "@/schemas/content-interaction";
import { subDays } from "date-fns";

import { prisma } from "@/lib/db";
import { splitIntoBatches } from "@/lib/utils";
import { filterRelevantPostsInBatches } from "@/app/actions/ai";
import { createAutoPilotPosts } from "@/app/actions/post";

type PlatformPost =
  | TwitterPostContent
  | LinkedInPostContent
  | RedditPostContent;

export async function GET(req: NextRequest) {
  // Fetch campaigns with autopilot enabled and their respective post preferences and keywords
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    console.error("Unauthorized request");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  console.log("Processing post for campaigns with autopilot enabled");
  try {
    const campaigns = await prisma.campaign.findMany({
      where: {
        autoPilot: true,
      },
      include: {
        postPreferences: {
          where: {
            OR: [
              { enableLinkedin: true },
              { enableReddit: true },
              { enableTwitter: true },
            ],
          },
        },
        keywords: true,
      },
    });

    console.log(`Found ${campaigns.length} campaigns with autopilot enabled`);

    // Iterate over each campaign to process platform-specific actions
    for (const campaign of campaigns) {
      const { id, postPreferences, keywords, userId } = campaign;

      // Date range for fetching recent posts
      const now = new Date();
      const startDate = subDays(now, 10);
      const endDate = now;

      // Ensure keywords is an array of strings and properly URL-encode each keyword
      const keywordStrings = keywords.map((keyword) =>
        encodeURIComponent(keyword.keyword),
      );

      // Construct query parameters with proper encoding
      const params = new URLSearchParams();
      params.append("query", keywordStrings.join(","));
      params.append("startDate", startDate.toISOString());
      params.append("endDate", endDate.toISOString());

      // Fetch and save posts for each platform
      if (postPreferences?.enableTwitter) {
        const URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/x?${params.toString()}`;
        await fetchAndSavePosts(id, "TWITTER", URL, userId);
      }

      if (postPreferences?.enableReddit) {
        const URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/reddit?${params.toString()}`;
        await fetchAndSavePosts(id, "REDDIT", URL, userId);
      }

      if (postPreferences?.enableLinkedin) {
        const URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/linkedin?${params.toString()}`;
        await fetchAndSavePosts(id, "LINKEDIN", URL, userId);
      }
    }

    return NextResponse.json({
      status: "success",
      message: "Autopilot campaigns processed successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error processing autopilot campaigns: ${error.message}`);
      return NextResponse.json({
        status: "error",
        message: error.message,
      });
    } else {
      console.error("Error processing autopilot campaigns:", error);
      return NextResponse.json({
        status: "error",
        message: "Error processing autopilot campaigns",
      });
    }
  }
}

const savePosts = async (payload: CreatePostRequest, userId: string) => {
  try {
    const dbResult = await createAutoPilotPosts(payload, userId);
    if (dbResult.type === "error") {
      console.error("Failed to save posts:", dbResult.message);
      throw new Error("Failed to save posts to the database");
    }
  } catch (error) {
    console.error("Error saving posts:", error);
    throw new Error("Error saving autpilot campaign posts to the database");
  }
};

const fetchAndSavePosts = async (
  campaignId: string,
  platform: Platform,
  apiUrl: string,
  userId: string,
) => {
  try {
    console.log(`Fetching posts for ${platform} from ${apiUrl}`);
    const response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Failed to fetch posts for ${platform}`);
      throw new Error(`Failed to fetch posts for ${platform}`);
    }

    const data = await response.json();
    const responseData = data.responseData as PlatformPost[];

    // Prepare and save posts to the database
    const postsPayload: CreatePostRequest = responseData.map((post) => ({
      campaignId: campaignId,
      platform: platform,
      content: post,
    }));

    await processPostsInBatches(postsPayload, campaignId, userId);
  } catch (error) {
    console.error(`Error fetching or saving ${platform} posts:`, error);
  }
};

async function processPostsInBatches(
  posts: CreatePostRequest,
  campaignId: string,
  userId: string,
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
      await savePosts(relevantPosts, userId);
    } catch (error) {
      console.error("Error processing batch:", error);

      console.error("Failed batch:", batch);
    }
  }
}
