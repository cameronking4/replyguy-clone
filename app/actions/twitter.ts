"use server";

import { Message } from "@/types";

import { client } from "@/lib/twitter";

export const postComment = async (
  tweetId: string,
  comment: string,
): Promise<Message> => {
  console.log("Function postComment started");
  console.log(`Received tweetId: ${tweetId}, comment: ${comment}`);

  try {
    console.log("Initializing Twitter client");
    const c = client();

    console.log("Posting comment to Twitter");
    const postComment = await c.v2.reply(comment, tweetId);

    console.log("POSTING COMMENT RESPONSE: ", postComment);

    if (postComment.errors) {
      console.error("Errors in posting comment: ", postComment.errors);
      return {
        type: "error",
        message: "Errors in posting comment",
      };
    }

    console.log("Comment posted successfully, data: ", postComment.data);

    return {
      type: "success",
      message: "Comment posted successfully",
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error caught in postComment: ", error);
      return {
        type: "error",
        message: "Error caught in postComment",
      };
    } else {
      console.error("An unexpected error occurred in postComment");
      return {
        type: "error",
        message: "An unexpected error occurred in postComment",
      };
    }
  }
};
