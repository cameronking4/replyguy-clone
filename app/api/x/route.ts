import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { client } from "@/lib/twitter";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "nextjs";
  // Each individual query is encoded encodeURIComponent
  // So we need to split the query by comma and decode each query
  let queries: string[] = [];
  try {
    queries = query.split(",").map((q) => decodeURIComponent(q));
  } catch (error) {
    queries = query.split(",");
  }

  const allTweets: {
    url: string;
    created_at: string;
    full_text: string;
    favorite_count: number;
    retweet_count: number;
  }[] = [];

  for (const term of queries) {
    const endpointUrl = `https://api.twitter.com/2/tweets/search/recent?query=${term}&tweet.fields=created_at,public_metrics`;

    try {
      const response = await fetch(endpointUrl, {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
      });

      if (!response.ok) {
        const errorDetails = await response.json(); // Log additional error details
        console.error(`Failed to fetch data for query: ${term}`, errorDetails);

        return NextResponse.json(
          { error: `Failed to fetch data from Twitter API for query: ${term}` },
          { status: response.status },
        );
      }

      const data = await response.json();

      if (data && Array.isArray(data.data)) {
        const transformedData = data.data.map((tweet) => ({
          url: `https://twitter.com/i/web/status/${tweet.id}`,
          full_text: tweet.text,
          created_at: tweet.created_at,
          retweet_count: tweet.public_metrics.retweet_count,
          favorite_count: tweet.public_metrics.like_count,
        }));

        allTweets.push(...transformedData);
      }

      return NextResponse.json({ responseData: allTweets });
    } catch (error) {
      console.error(
        "An error occurred while fetching data from Twitter API:",
        error,
      );
      return NextResponse.json(
        {
          error: "An error occurred while fetching data from Twitter API",
          details: error.message,
        },
        { status: 500 },
      );
    }
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { tweetId, comment, commentId } = body;

  if (!tweetId || !comment || !commentId) {
    return NextResponse.json(
      { error: "tweetId, commentId and comment are required fields" },
      { status: 400 },
    );
  }

  try {
    const c = client();
    const postComment = await c.v2.reply(comment, tweetId);

    console.log("POSTING COMMENT RESPONSE: ", postComment);

    if (postComment.errors) {
      return NextResponse.json(
        { error: "Errors in posting comment" },
        { status: 500 },
      );
    }

    console.log("Comment posted successfully, data: ", postComment.data);

    await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        externalCommentId: postComment.data.id,
        responseMessage: "Comment posted successfully",
      },
    });

    return NextResponse.json({ message: "Comment posted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error caught in postComment: ", error);
      return NextResponse.json(
        { error: "Error caught in postComment" },
        { status: 500 },
      );
    } else {
      console.error("An unexpected error occurred in postComment");
      return NextResponse.json(
        { error: "An unexpected error occurred in postComment" },
        { status: 500 },
      );
    }
  }
}
