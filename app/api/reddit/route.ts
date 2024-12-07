import { NextResponse } from "next/server";
import { RedditPostContent } from "@/schemas/content-interaction";
import snoowrap from "snoowrap";
import { z } from "zod";

import { prisma } from "@/lib/db";

type RedditPostTempType = {
  data: {
    approved_at_utc: null | string;
    subreddit: string;
    selftext: string;
    author_fullname: string;
    saved: boolean;
    mod_reason_title: null | string;
    gilded: number;
    clicked: boolean;
    title: string;
    link_flair_richtext: Array<any>; // Array is used as a placeholder; replace with a more specific type if known
    subreddit_name_prefixed: string;
    hidden: boolean;
    pwls: number;
    link_flair_css_class: string;
    downs: number;
    thumbnail_height: number;
    top_awarded_type: null | string;
    hide_score: boolean;
    name: string;
    quarantine: boolean;
    link_flair_text_color: string;
    upvote_ratio: number;
    author_flair_background_color: null | string;
    ups: number;
    total_awards_received: number;
    media_embed: Record<string, any>; // Using Record for flexible key-value pairs
    thumbnail_width: number;
    author_flair_template_id: null | string;
    is_original_content: boolean;
    user_reports: Array<any>;
    secure_media: null | Record<string, any>; // Assuming it can be an object; adjust as needed
    is_reddit_media_domain: boolean;
    is_meta: boolean;
    category: null | string;
    secure_media_embed: Record<string, any>;
    link_flair_text: string;
    can_mod_post: boolean;
    score: number;
    approved_by: null | string;
    is_created_from_ads_ui: boolean;
    author_premium: boolean;
    thumbnail: string;
    edited: boolean | number; // edited can be false or a timestamp
    author_flair_css_class: null | string;
    author_flair_richtext: Array<any>;
    gildings: Record<string, any>;
    post_hint: string;
    content_categories: null | string;
    is_self: boolean;
    subreddit_type: string;
    created: number; // Unix timestamp
    link_flair_type: string;
    wls: number;
    removed_by_category: null | string;
    banned_by: null | string;
    author_flair_type: string;
    domain: string;
    allow_live_comments: boolean;
    selftext_html: null | string;
    likes: null | boolean;
    suggested_sort: null | string;
    banned_at_utc: null | string;
    url_overridden_by_dest: string;
    view_count: null | number;
    archived: boolean;
    no_follow: boolean;
    is_crosspostable: boolean;
    pinned: boolean;
    over_18: boolean;
    preview: Record<string, any>; // Replace with a more specific type if known
    all_awardings: Array<any>;
    awarders: Array<any>;
    media_only: boolean;
    link_flair_template_id: string;
    can_gild: boolean;
    spoiler: boolean;
    locked: boolean;
    author_flair_text: null | string;
    treatment_tags: Array<any>;
    visited: boolean;
    removed_by: null | string;
    mod_note: null | string;
    distinguished: null | string;
    subreddit_id: string;
    author_is_blocked: boolean;
    mod_reason_by: null | string;
    num_reports: null | number;
    removal_reason: null | string;
    link_flair_background_color: string;
    id: string;
    is_robot_indexable: boolean;
    report_reasons: null | Array<any>;
    author: string;
    discussion_type: null | string;
    num_comments: number;
    send_replies: boolean;
    whitelist_status: string;
    contest_mode: boolean;
    mod_reports: Array<any>;
    author_patreon_flair: boolean;
    author_flair_text_color: null | string;
    permalink: string;
    parent_whitelist_status: string;
    stickied: boolean;
    url: string;
    subreddit_subscribers: number;
    created_utc: number; // Unix timestamp
    num_crossposts: number;
    media: null | Record<string, any>;
    is_video: boolean;
  };
};

// Function to refresh the access token if needed
async function refreshAccessToken(): Promise<string> {
  const response = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.REDDIT_REFRESH_TOKEN!,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }

  const data = await response.json();
  process.env.REDDIT_ACCESS_TOKEN = data.access_token; // Update the token in the environment variable
  return data.access_token;
}

export async function GET(request: Request) {
  let accessToken = process.env.REDDIT_ACCESS_TOKEN;

  if (!accessToken) {
    try {
      accessToken = await refreshAccessToken();
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to refresh access token" },
        { status: 500 },
      );
    }
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  // const keywords = query.split(",");

  let keywords: string[] = [];
  try {
    keywords = query.split(",").map((q) => decodeURIComponent(q));
  } catch (error) {
    keywords = query.split(",");
  }

  let aggregatedData: any[] = [];

  for (const keyword of keywords) {
    const encodedKeyword = encodeURIComponent(keyword.trim());
    const endpointUrl = `https://oauth.reddit.com/search.json?q=${encodedKeyword}`;

    try {
      let response = await fetch(endpointUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "YourAppName/0.1 by YourRedditUsername", // Reddit requires a user-agent header
        },
        cache: "no-store",
      });

      if (response.status === 401 || response.status === 403) {
        // If Unauthorized or Forbidden, try to refresh the access token and retry
        try {
          accessToken = await refreshAccessToken();
          response = await fetch(endpointUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "User-Agent": "YourAppName/0.1 by YourRedditUsername",
            },
            cache: "no-store",
          });
        } catch (error) {
          return NextResponse.json(
            { error: "Failed to refresh access token" },
            { status: 500 },
          );
        }
      }

      if (!response.ok) {
        console.error(
          `Failed to fetch data for keyword: ${keyword} - Status: ${response.status}`,
        );
        continue; // Skip this keyword if there's an issue fetching data
      }

      const data = await response.json();

      if (data.data && data.data.children) {
        const transformedData = data.data.children.map(
          (post: RedditPostTempType) =>
            ({
              redditPostId: post.data.id,
              title: post.data.title,
              selftext: post.data.selftext,
              author: post.data.author,
              url: post.data.url_overridden_by_dest || post.data.url,
              permalink: post.data.permalink,
              createdAt: new Date(post.data.created_utc * 1000).toISOString(),
              upvotes: post.data.ups,
              downvotes: post.data.downs,
              numComments: post.data.num_comments,
              score: post.data.score,
              subreddit: post.data.subreddit,
              subredditId: post.data.subreddit_id,
              isNsfw: post.data.over_18,
            }) satisfies RedditPostContent,
        );

        // Filter out posts that are not from reddit.com
        const filteredData = transformedData.filter((post) =>
          post.url.includes("reddit.com"),
        );

        aggregatedData = aggregatedData.concat(filteredData);
      }
    } catch (error) {
      console.error(
        `An error occurred while fetching data for keyword: ${keyword}`,
        error,
      );
      continue; // Skip to the next keyword in case of an error
    }
  }

  if (aggregatedData.length === 0) {
    return NextResponse.json(
      { message: "No data found for the provided keywords" },
      { status: 200 },
    );
  }

  const responseData = aggregatedData;

  return NextResponse.json({ responseData });
}

const CommentRequestSchema = z.object({
  postId: z.string(),
  comment: z.string(),
  commentId: z.string(),
});

export async function POST(request: Request) {
  try {
    console.log("Received REDDIT POST request"); // Debug statement
    const body = await request.json();
    const { postId, comment, commentId } = CommentRequestSchema.parse(body);
    console.log("Parsed request data:", { postId, comment, commentId }); // Debug statement

    let accessToken = process.env.REDDIT_ACCESS_TOKEN;
    console.log("Initial access token:", accessToken); // Debug statement

    if (!accessToken) {
      console.log("Access token not found, refreshing token..."); // Debug statement
      accessToken = await refreshAccessToken();
      console.log("New access token obtained:", accessToken); // Debug statement
    }

    const postCommentResponse = await postCommentToReddit(
      postId,
      comment,
      accessToken,
    );
    console.log("Initial post comment response:", postCommentResponse); // Debug statement

    if (!postCommentResponse.ok) {
      console.log(
        "Post comment response not OK, status:",
        postCommentResponse.status,
      ); // Debug statement

      if (
        postCommentResponse.status === 401 ||
        postCommentResponse.status === 403
      ) {
        console.log("Authorization error, refreshing token and retrying..."); // Debug statement

        accessToken = await refreshAccessToken();
        console.log("New access token after refresh:", accessToken); // Debug statement

        const retryResponse = await postCommentToReddit(
          postId,
          comment,
          accessToken,
        );
        console.log("Retry post comment response:", retryResponse); // Debug statement

        if (!retryResponse.ok) {
          console.error(
            "Failed to post comment after retry, status:",
            retryResponse.status,
          ); // Debug statement

          return NextResponse.json(
            { error: "Failed to post comment after retry" },
            { status: retryResponse.status },
          );
        }

        console.log("Comment posted successfully after retry"); // Debug statement

        await handleSuccessfulCommentResponse(retryResponse, commentId, postId);
        return NextResponse.json({
          message: "Comment posted successfully after retry",
        });
      }

      console.error(
        "Failed to post comment, status:",
        postCommentResponse.status,
      ); // Debug statement

      return NextResponse.json(
        { error: "Failed to post comment" },
        { status: postCommentResponse.status },
      );
    }

    console.log("Comment posted successfully"); // Debug statement
    await handleSuccessfulCommentResponse(
      postCommentResponse,
      commentId,
      postId,
    );
    return NextResponse.json({ message: "Comment posted successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Invalid request data:", error.errors); // Debug statement

      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 },
      );
    } else if (error instanceof Error) {
      console.error("Error posting comment: ", error); // Debug statement

      console.error("Error posting comment: ", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("An unexpected error occurred"); // Debug statement
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 },
      );
    }
  }
}

// Helper function to post a comment to Reddit
async function postCommentToReddit(
  postId: string,
  comment: string,
  accessToken: string,
) {
  console.log("Posting comment to Reddit:", { postId, comment }); // Debug statement
  try {
    // consloe log all reddit vars
    console.log(`\n\nREDDIT CLIENT ID: ${process.env.REDDIT_CLIENT_ID}`);
    console.log(
      `\n\nREDDIT CLIENT SECRET: ${process.env.REDDIT_CLIENT_SECRET}`,
    );
    console.log(`\n\nREDDIT USERNAME: ${process.env.REDDIT_USERNAME}`);
    console.log(`\n\nREDDIT PASSWORD: ${process.env.REDDIT_PASSWORD}`);

    // Initialize the snoowrap Reddit instance
    const reddit = new snoowrap({
      userAgent: `script:${process.env.REDDIT_USERNAME}:v1.0 (by u/${process.env.REDDIT_USERNAME})`,
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      username: process.env.REDDIT_USERNAME,
      password: process.env.REDDIT_PASSWORD,
    });

    // @ts-ignore
    const post = await reddit.getSubmission(postId).fetch();
    console.log(`\n\nFetched post: ${post.title}`);
    const commentResponse = await post.reply(comment);
    console.log(`\n\nReplied to post ${postId}`);
    console.log(`\n\nComment URL: ${commentResponse.permalink}`);
    console.log(`\n\nCheck your reply here: ${post.url}`);
    console.log(`\n\nCOMMENT SHAPE:\n\n ${commentResponse}`);

    return commentResponse;
  } catch (error) {
    console.error(`\n\nREDDIT POSTING COMMENT ERROR: ${error}`);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // try{

  //   const response = await fetch("https://oauth.reddit.com/api/comment", {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //       "User-Agent": "YourAppName/0.1 by YourRedditUsername",
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //     body: new URLSearchParams({
  //       api_type: "json",
  //       thing_id: `t3_${postId}`, // 't3_' prefix indicates a Reddit post
  //       text: comment,
  //     }),
  //   });

  //   const responseData = await response.json();
  //   console.log("Reddit API response:", responseData); // Debug statement

  //   if (!response.ok) {
  //     console.error("Failed to post comment, response status:", response.status);
  //     console.error("Response error details:", responseData);
  //     throw new Error(`Failed to post comment, status: ${response.status}`);
  //   }

  //   console.log("Reddit API response:", response); // Debug statement

  //   return response;

  // } catch (error) {
  //   console.error("An error occurred while posting comment:", error);
  //   return NextResponse.json({ error: error.message }, { status: 500 });
  // }
}

// Helper function to handle the successful posting of a comment
async function handleSuccessfulCommentResponse(
  response: Response,
  commentId: string,
  postId: string,
) {
  console.log("Handling successful comment response for commentId:", commentId); // Debug statement

  const postCommentData = await response.json();
  console.log("Post comment data from response:", postCommentData); // Debug statement

  await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      externalCommentId: postCommentData.json.data.things[0].data.id,
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
  console.log("Comment updated successfully in the database"); // Debug statement
}
