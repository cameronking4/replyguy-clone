"use client";

import {
  LinkedInPostContent,
  Platform,
  RedditPostContent,
  TwitterPostContent,
  UpdatePostRequest,
} from "@/schemas/content-interaction";
import { Comment, Post } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updatePost } from "@/app/actions/post";
import { Button } from "@/components/ui/button";

type ContentMap = {
  TWITTER: TwitterPostContent;
  REDDIT: RedditPostContent;
  LINKEDIN: LinkedInPostContent;
};

type POST = Omit<Post, "content"> & {
  content: any;
};

interface PostCommentProps {
  post: POST;
  comment: Comment;
  activeTab: Platform;
}

const API_ENDPOINTS = {
  TWITTER: "/api/x",
  LINKEDIN: "/api/linkedin",
  REDDIT: "/api/reddit",
};

export const handlePostComment = async ({
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
    console.log("handlePostComment post content", post.content);
    let linkedInPostId = ""
    if(activeTab === "LINKEDIN") {
      linkedInPostId = getLinkedInPostIdFromUrl(post.content?.url) || "";
    }
    const body = {
      TWITTER: { tweetId, comment, commentId },
      REDDIT: { postId: post.content?.redditPostId, comment, commentId },
      LINKEDIN: {
        postId: post.id,
        comment,
        commentId,
        linkedInPostId: linkedInPostId,
      },
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

function getTweetIdFromUrl(url: string): string | null {
  const tweetIdRegex = /status\/(\d+)/;
  const match = url.match(tweetIdRegex);

  return match ? match[1] : null;
}

export const PostComment = ({ comment, post, activeTab }: PostCommentProps) => {
  const router = useRouter();

  // console.log("PostComment", post);

  const tweetId =
    activeTab === "TWITTER" ? getTweetIdFromUrl(post.content?.url) || "" : "";

  const { mutate, isPending } = useMutation({
    mutationFn: handlePostComment,
    onSuccess: async (data, variables, context) => {
      console.log("Comment posted successfully", data);
      router.refresh();
      toast.success("Comment posted successfully");

      const payload = {
        campaignId: post.campaignId,
        platform: post.platform,
        id: post.id,
        content: post.content,
        status: "POSTED",
      } satisfies UpdatePostRequest;

      await updatePost(payload);
    },
    onError(error, variables, context) {
      console.error("Failed to post comment", error);
      toast.error("Failed to post comment");
    },
  });

  return (
    <Button
      variant={"secondary"}
      size={"sm"}
      disabled={isPending}
      onClick={() =>
        mutate({
          activeTab: post.platform,
          tweetId,
          post: post,
          commentId: comment.id,
          comment: comment.content,
        })
      }
    >
      {isPending ? "Posting Comment..." : "Post Comment"}
    </Button>
  );
};

function getLinkedInPostIdFromUrl(url: string): string | null {
  const postIdRegex = /urn:li:activity:(\d+)/;
  const match = url.match(postIdRegex);

  return match ? match[1] : null;
}