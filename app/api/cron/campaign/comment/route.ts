import { NextRequest, NextResponse } from "next/server";
import { CommentStatus, Platform, Post } from "@prisma/client";

import { prisma } from "@/lib/db";
import { generatePostComment } from "@/app/actions/ai";

export async function GET(req: NextRequest) {
  // Fetch campaigns with autopilot enabled
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error("Unauthorized request");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  console.log("Processing comments for campaigns with autopilot enabled");
  const campaigns = await prisma.campaign.findMany({
    where: {
      autoPilot: true,
    },
    include: {
      posts: {
        where: {
          comments: {
            some: {
              status: "PENDING",
            },
          },
        },
        include: {
          comments: {
            where: {
              status: "PENDING",
            },
          },
        },
      },
    },
  });

  console.log(`Found ${campaigns.length} campaigns with pending comments`);

  // Iterate through campaigns
  for (const campaign of campaigns) {
    const { id: campaignId, posts } = campaign;

    // Iterate through posts of the campaign
    for (const post of posts) {
      const { id: postId, platform, comments } = post;
      let postHasFailed = false;

      // Iterate through comments of the post
      for (const comment of comments) {
        const { id: commentId } = comment;

        try {
          // Generate reply for the comment
          const result = await generatePostComment(post, campaign);

          if (result.type === "success") {
            const replyContent = result.comment.comment;

            console.log(`Generated reply: ${replyContent}`);

            // Posting reply to the respective platform
            const responseMessage = await postReplyToPlatform({
              platform,
              post,
              commentId,
              replyContent,
              campaignId,
            });

            console.log(responseMessage);

            await prisma.comment.update({
              where: { id: commentId },
              data: { status: "POSTED", responseMessage: responseMessage },
            });
          } else {
            throw new Error("Failed to generate comment");
          }
        } catch (error) {
          console.error(
            `Failed to handle comment ${commentId} for post ${post.id} on platform ${platform}:`,
            error,
          );

          postHasFailed = true;

          // Update comment status to FAILED in the database
          await prisma.comment.update({
            where: { id: commentId },
            data: { status: "FAILED", responseMessage: error.message },
          });
        }
      }

      // Update post status if all comments have been processed
      const postStatus = postHasFailed
        ? CommentStatus.FAILED
        : CommentStatus.POSTED;
      await prisma.post.update({
        where: { id: postId },
        data: { status: postStatus },
      });
    }
  }

    // Return a response indicating that the process is complete
    return NextResponse.json({ message: "Processing complete" }, { status: 200 });

}
// Function to post reply to the respective platform
const postReplyToPlatform = async ({
  platform,
  post,
  commentId,
  replyContent,
  campaignId,
}: {
  platform: Platform;
  post: any; // Replace with the actual Post type
  commentId: string;
  replyContent: string;
  campaignId: string;
}) => {
  const tweetId =
    platform === Platform.TWITTER
      ? getTweetIdFromUrl(post.content?.url) || ""
      : "";

  return await callHandlePostComment({
    tweetId,
    comment: replyContent,
    commentId,
    post,
    activeTab: platform,
  });
};

// Helper function to extract tweet ID from URL (if applicable)
function getTweetIdFromUrl(url: string): string | null {
  const tweetIdRegex = /status\/(\d+)/;
  const match = url.match(tweetIdRegex);
  return match ? match[1] : null;
}

const API_ENDPOINTS = {
  TWITTER: "/api/x",
  LINKEDIN: "/api/linkedin",
  REDDIT: "/api/reddit",
};

type POST = Omit<Post, "content"> & {
  content: any;
};

const callHandlePostComment = async ({
  tweetId,
  comment,
  commentId,
  post,
  activeTab,
}: {
  tweetId: string;
  comment: string;
  commentId: string;
  post: POST;
  activeTab: Platform;
}): Promise<string> => {
  try {
    console.log("callHandlePostComment post content", post.content);
    const body = {
      TWITTER: { tweetId, comment, commentId },
      REDDIT: { postId: post.content?.redditPostId, comment, commentId },
      LINKEDIN: { comment, commentId },
    };

    console.log("activeTab", activeTab);
    console.log("Posting comment", body[activeTab]);

    const response = await fetch(API_ENDPOINTS[activeTab], {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body[activeTab]),
    });

    if (!response.ok) {
      throw new Error("Failed to post comment");
    }

    const data = await response.json();

    return data.message;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error posting comment:", error);
      throw new Error(error.message);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
