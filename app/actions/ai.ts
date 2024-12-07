"use server";

import {
  CreateCommentRequest,
  CreatePostRequest,
  CreatePostSchema,
} from "@/schemas/content-interaction";
import { createOpenAI } from "@ai-sdk/openai";
import { Campaign, Post } from "@prisma/client";
import { generateObject, JSONParseError, TypeValidationError } from "ai";
import { z } from "zod";

import { getCampaignById } from "./campaign";
import { createNewComment } from "./comment";
import { createKeywords } from "./keywords";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: "strict", // strict mode, enable when using the OpenAI API
});

const keywordsSchema = z.object({
  keywords: z.array(z.string()),
});

type Keywords = z.infer<typeof keywordsSchema>;

type KeywordResult =
  | {
      type: "success";
      keywords: Keywords;
    }
  | {
      type: "parse-error";
      text: string;
    }
  | {
      type: "validation-error";
      value: unknown;
    }
  | {
      type: "unknown-error";
      error: unknown;
    };

export const generateCampaignKeywords = async (
  payload: Campaign,
): Promise<KeywordResult> => {
  try {
    const promptText = `Generate keywords for the campaign "${JSON.stringify(payload)}"`;

    const result = await generateObject({
      model: openai("gpt-3.5-turbo"),
      system:
        "You generate keywords for the campaign which will be used to target the right audience and finding the right keywords is crucial for the success of the campaign as it will be used for finding posts and comments to reply to.",
      prompt: promptText,
      schema: keywordsSchema,
    });

    return result && result.object
      ? { type: "success", keywords: result.object }
      : { type: "unknown-error", error: "Unexpected result format" };
  } catch (error) {
    if (TypeValidationError.isTypeValidationError(error)) {
      return { type: "validation-error", value: error.value };
    } else if (JSONParseError.isJSONParseError(error)) {
      return { type: "parse-error", text: error.text };
    } else {
      return { type: "unknown-error", error };
    }
  }
};

type GenerateAndSaveKeywordsResult =
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export const generateAndSaveKeywords = async (
  campaign: Campaign,
): Promise<GenerateAndSaveKeywordsResult> => {
  try {
    const keywordResult = await generateCampaignKeywords(campaign);

    if (keywordResult.type !== "success") {
      return { type: "error", message: "Error generating keywords." };
    }

    // Save the generated keywords to the database
    const res = await createKeywords({
      campaignId: campaign.id,
      keywords: keywordResult.keywords.keywords,
    });

    if (!res) {
      return {
        type: "error",
        message: "Error saving keywords to the database.",
      };
    }

    return {
      type: "success",
      message: "Keywords generated and saved successfully.",
    };
  } catch (error: any) {
    console.error("Error generating and saving keywords:", error);
    return {
      type: "error",
      message: error.message || "An unexpected error occurred.",
    };
  }
};

type PostsResult =
  | {
      type: "success";
      data: CreatePostRequest;
    }
  | {
      type: "parse-error";
      text: string;
    }
  | {
      type: "validation-error";
      value: unknown;
    }
  | {
      type: "unknown-error";
      error: unknown;
    };

const relevantPostSchema = z.object({
  data: CreatePostSchema,
});

export const filterRelevantPost = async (
  payload: CreatePostRequest,
  campaign: Campaign,
): Promise<PostsResult> => {
  try {
    console.log("filterRelevantPosts Payload: ", payload.length);

    const promptText = `Filter relevant posts for the campaign ${JSON.stringify(campaign)}. Here are the posts to be filtered:  "\n\n${JSON.stringify(payload)}"`;

    const result = await generateObject({
      model: openai("gpt-4o-2024-08-06"),
      system:
        "Minimal filtering is ideal, we want a large payload of posts. Only filter out very very irrelevant posts. Return at least 20 posts.",
      schema: relevantPostSchema,
      prompt: promptText,
    });

    console.log("filterRelevantPosts Result: ", result);

    if (result && result.object) {
      console.log("filterRelevantPosts Result: ", result.object.data.length);
      return { type: "success", data: result.object.data };
    } else {
      return { type: "unknown-error", error: "Unexpected result format" };
    }
  } catch (error) {
    console.error("Error encountered:", error);

    if (TypeValidationError.isTypeValidationError(error)) {
      console.debug(
        "\n---------\nTypeValidationError details:\n",
        error.value,
        "\n---------",
      );
      return { type: "validation-error", value: error.message };
    } else if (JSONParseError.isJSONParseError(error)) {
      console.debug(
        "\n---------\nJSONParseError details:\n",
        error.text,
        "\n---------",
      );
      return { type: "parse-error", text: error.message };
    } else {
      console.debug(
        "\n---------\nUnknown error details:\n",
        error,
        "\n---------",
      );
      return { type: "unknown-error", error };
    }
  }
};

const relevantBatchPostSchema = z.object({
  data: CreatePostSchema,
});

type BatchPostsResult =
  | {
      type: "success";
      data: CreatePostRequest;
    }
  | {
      type: "parse-error";
      text: string;
    }
  | {
      type: "validation-error";
      value: unknown;
    }
  | {
      type: "unknown-error";
      error: unknown;
    };

export const filterRelevantPostsInBatches = async (
  payload: CreatePostRequest,
  campaignId: string,
): Promise<BatchPostsResult> => {
  try {
    const campaignResult = await getCampaignById(campaignId);

    const campaign = campaignResult.data;

    console.log("filterRelevantPosts Payload: ", payload.length);

    const promptText = `Filter relevant posts for the campaign ${JSON.stringify(campaign)}. Here are the posts to be filtered:  "\n\n${JSON.stringify(payload)}"`;

    const result = await generateObject({
      model: openai("gpt-4o-2024-08-06"),
      system:
        "Minimal filtering is ideal, we want a large payload of posts. Only filter out very very irrelevant posts. Return at least 20 posts.",
      schema: relevantBatchPostSchema,
      prompt: promptText,
    });

    console.log("filterRelevantPosts Result: ", result);

    if (result && result.object) {
      console.log("filterRelevantPosts Result: ", result.object.data.length);
      return { type: "success", data: result.object.data };
    } else {
      return { type: "unknown-error", error: "Unexpected result format" };
    }
  } catch (error) {
    console.error("Error encountered:", error);

    if (TypeValidationError.isTypeValidationError(error)) {
      console.debug(
        "\n---------\nTypeValidationError details:\n",
        error.value,
        "\n---------",
      );
      return { type: "validation-error", value: error.message };
    } else if (JSONParseError.isJSONParseError(error)) {
      console.debug(
        "\n---------\nJSONParseError details:\n",
        error.text,
        "\n---------",
      );
      return { type: "parse-error", text: error.message };
    } else {
      console.debug(
        "\n---------\nUnknown error details:\n",
        error,
        "\n---------",
      );
      return { type: "unknown-error", error };
    }
  }
};

const commentSchema = z.object({
  comment: z.string(),
});

type Comment = z.infer<typeof commentSchema>;

type CommentResult =
  | {
      type: "success";
      comment: Comment;
    }
  | {
      type: "parse-error";
      text: string;
    }
  | {
      type: "validation-error";
      value: unknown;
    }
  | {
      type: "unknown-error";
      error: unknown;
    };

export const generatePostComment = async (
  post: Post,
  campaign: Campaign,
): Promise<CommentResult> => {
  try {
    const fallbackVoice = "assertive";
    const fallbackTone = "natural sounding reply";
    const fallbackPersonality = "helpful, engaging, and trustworthy";

    const { voice, tone, personality } = campaign;
    const promptText = `Generate a comment for the post ${JSON.stringify(post)} for the campaign ${JSON.stringify(campaign)}.`;

    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      system: `
        You are tasked with generating a comment for a social media post. The comment should be engaging, relevant, and aligned with the campaign's goals. 
        At the same time it should be relevant to the post. 
        Craft a message as if you are a casual user on Twitter, Linkedin, Reddit. You are an average American who just happened to see the following post and feel connected to it because you are a happy user of {Campaign}. 
        You feel compelled to mention them on this post and share a link to help others and creator of this post. 
        You're welcome to use slang, don't overuse apostrophes. You can do lowercase, typos and incomplete sentences.
        i.e lowkey a game changer [link]
        You are organically viewing this post, so it must not seem like an ad, but rather help or commentary. 
        You must be creative, make up a story, be sarcastic, drive fear, make up an anecdote or take on a persona / occupation.
        This should be fun but use the following guidelines:
          - Voice: "${voice || fallbackVoice}"
          - Tone: "${tone || fallbackTone}"
          - Personality: "${personality || fallbackPersonality}"

        Remeber, your comment should plug the campaign with link but be woven in seamlessly. You must ensure the comment is supportive and adds value to the conversation.
        `,
      prompt: promptText,
      schema: commentSchema,
      temperature: 0.8,
    });

    // Save comment in the database
    const payload = {
      postId: post.id,
      userId: campaign.userId,
      content: result.object.comment,
    } satisfies CreateCommentRequest;

    const commentResult = await createNewComment(payload);

    if (commentResult.type !== "success") {
      return { type: "unknown-error", error: "Error creating comment." };
    }

    return {
      type: "success",
      comment: result.object,
    };
  } catch (error) {
    console.error("Error encountered:", error);

    if (TypeValidationError.isTypeValidationError(error)) {
      console.debug(
        "\n---------\nTypeValidationError details:\n",
        error.value,
        "\n---------",
      );
      return { type: "validation-error", value: error.value };
    } else if (JSONParseError.isJSONParseError(error)) {
      console.debug(
        "\n---------\nJSONParseError details:\n",
        error.text,
        "\n---------",
      );
      return { type: "parse-error", text: error.text };
    } else {
      console.debug(
        "\n---------\nUnknown error details:\n",
        error,
        "\n---------",
      );
      return { type: "unknown-error", error };
    }
  }
};
