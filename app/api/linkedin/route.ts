import { NextRequest, NextResponse } from "next/server";

import { LINKEDIN_COOKIES } from "@/lib/config/index";
import { prisma } from "@/lib/db";
import LinkedInAPI from "@/lib/linkedin-api";
import { getCurrentUser } from "@/lib/session";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "nextjs";
  let queries: string[] = [];

  try {
    queries = query.split(",").map((q) => decodeURIComponent(q));
  } catch (error) {
    queries = query.split(",");
  }

  const allPosts: {
    text: string;
    title: string;
    url: string;
    timeSincePosted: string;
    authorFullName: string;
    authorProfileUrl: string;
    authorTitle: string;
    authorFollowersCount: string;
    numShares: number;
    numLikes: number;
    numComments: number;
    canReact: boolean;
    canPostComments: boolean;
    canShare: boolean;
  }[] = [];

  const apifyToken = process.env.APIFY_TOKEN; // Ensure this is set in your environment variables

  if (!apifyToken) {
    console.error("APIFY_TOKEN is not set in environment variables.");
    return NextResponse.json(
      { error: "Internal server error. Missing APIFY_TOKEN." },
      { status: 500 },
    );
  }

  // Loop through each query term
  for (const term of queries) {
    const endpointUrl = `https://api.apify.com/v2/acts/curious_coder~linkedin-post-search-scraper/run-sync-get-dataset-items?token=${apifyToken}&clean=true&format=json`;

    // Prepare the request payload
    const payload = {
      cookie: LINKEDIN_COOKIES,
      searchUrl: `https://www.linkedin.com/search/results/content/?keywords=${encodeURIComponent(term)}`,
      deepScrape: true,
      startPage: 1,
      endPage: 2, // Scraping the first two pages for example
      minDelay: 2,
      maxDelay: 5,
    };

    // Log the request details
    console.log(`Sending request to Apify API for query: ${term}`);
    console.log(`Request payload: ${JSON.stringify(payload)}`);
    console.log(`Request URL: ${endpointUrl}`);

    // Make the API request to scrape LinkedIn posts
    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Log the response status and headers
    console.log(`Response status: ${response.status}`);

    if (!response.ok) {
      const errorResponse = await response.text(); // Capture the response body for debugging
      console.error(`Error response from Apify API: ${errorResponse}`); // Log the error details
      return NextResponse.json(
        {
          error: `Failed to fetch data from LinkedIn API for query: ${term}`,
          details: errorResponse,
        },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Log the raw data to understand the structure
    console.log(
      `Raw response data for query ${term}:`,
      JSON.stringify(data[0]),
    );

    // Check if data is in the expected array format
    if (data && Array.isArray(data)) {
      const transformedData = data.map((post: any) => ({
        text: post.text || "",
        title: post.title || "",
        url: post.url || "",
        timeSincePosted: post.timeSincePosted || "",
        authorFullName: post.authorFullName || "",
        authorProfileUrl: post.authorProfileUrl || "",
        authorTitle: post.authorTitle || "",
        authorFollowersCount: post.authorFollowersCount || "",
        numShares: post.numShares || 0,
        numLikes: post.numLikes || 0,
        numComments: post.numComments || 0,
        canReact: post.canReact !== undefined ? post.canReact : false,
        canPostComments:
          post.canPostComments !== undefined ? post.canPostComments : false,
        canShare: post.canShare !== undefined ? post.canShare : false,
      }));

      allPosts.push(...transformedData);
    } else {
      console.warn(`No data found for query: ${term}`);
    }
  }

  // Return the aggregated results
  console.log("All posts fetched successfully:", allPosts.length);
  return NextResponse.json({ responseData: allPosts });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { postId, comment, commentId, linkedInPostId } = body;

  console.log("Posting comment", body);

  if (!postId || !comment || !commentId || !linkedInPostId) {
    return NextResponse.json(
      { error: "postId, commentId and comment are required fields" },
      { status: 400 },
    );
  }

  const user = await getCurrentUser();
  if (!user?.id) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 },
    );
  }

  try {
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: "LinkedIn access token is not set" },
        { status: 500 },
      );
    }
    const linkedInApi = new LinkedInAPI(accessToken);

    const commentContent = {
      postUrn: `urn:li:ugcPost:${linkedInPostId}`,
      text: "Great post! Thanks for sharing.",
    };

    const userUrn = "urn:li:person:1234567890"; // Replace with the URN of the user posting the comment

    const response = await linkedInApi.commentOnPost(userUrn, commentContent);

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error("Error posting to LinkedIn:", errorMessage);

      return NextResponse.json(
        { error: `Failed to post comment: ${errorMessage}` },
        { status: response.status },
      );
    }

    const data = await response.json();

    await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        externalCommentId: data.id,
        responseMessage: "Comment posted successfully",
        status: "POSTED",
      },
    });

    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        status: "POSTED",
      },
    });

    return NextResponse.json({ message: "Comment posted successfully", data });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 },
      );
    }
  }
}
