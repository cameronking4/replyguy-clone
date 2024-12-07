"use server";

import {
  CreatePostRequest,
  CreatePostSchema,
  Platform,
  UpdatePostRequest,
  UpdatePostSchema,
} from "@/schemas/content-interaction";
import { Message, Result } from "@/types";
import { Post } from "@prisma/client";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const createPosts = async (
  postsData: CreatePostRequest,
): Promise<Result<Post[]>> => {
  try {
    console.log("\ncreatePosts function started."); // Debug statement
    console.log("\nPosts data received:", postsData); // Debug statement

    const user = await getCurrentUser();
    if (!user) {
      console.log("\nNo user found. Unauthorized access attempt."); // Debug statement
      return {
        type: "error",
        message: "Unauthorized user. Please login to continue.",
        data: null,
      };
    }

    console.log("\nUser found:", user); // Debug statement

    const parsedPosts = CreatePostSchema.safeParse(postsData);
    if (!parsedPosts.success) {
      console.log("Post data validation failed:", parsedPosts.error.errors); // More detailed debug statement

      return {
        type: "error",
        message: "Invalid posts data.",
        data: null,
      };
    }

    console.log("\nPost data validated successfully:", parsedPosts.data); // Debug statement

    const uniqueBatchId = new Date().toISOString();
    console.log("\nGenerated unique batch ID:", uniqueBatchId); // Debug statement

    const result = await prisma.post.createMany({
      data: parsedPosts.data.map((post) => ({
        ...post,
        userId: user.id,
        batchId: uniqueBatchId,
      })),
    });

    console.log("\nResult of prisma.post.createMany:", result); // Debug statement

    const createdPosts = await prisma.post.findMany({
      where: {
        userId: user.id,
        batchId: uniqueBatchId,
        campaignId: postsData[0].campaignId,
      },
      orderBy: { createdAt: "desc" },
    });

    console.log("\nPosts created:", createdPosts); // Debug statement

    return {
      type: "success",
      message: `${createdPosts.length} posts created successfully.`,
      data: createdPosts,
    };
  } catch (error: any) {
    console.log("\nError caught in createPosts function:", error.message); // Debug statement
    return { type: "error", message: error.message, data: null };
  }
};

export const createAutoPilotPosts = async (
  postsData: CreatePostRequest,
  userId: string,
): Promise<Result<Post[]>> => {
  try {
    console.log("\ncreatePosts AUTOPILOT function started."); // Debug statement
    console.log("\nPosts data received:", postsData); // Debug statement

    const parsedPosts = CreatePostSchema.safeParse(postsData);
    if (!parsedPosts.success) {
      console.log("Post data validation failed:", parsedPosts.error.errors); // More detailed debug statement

      return {
        type: "error",
        message: "Invalid posts data.",
        data: null,
      };
    }

    console.log("\nPost data validated successfully:", parsedPosts.data); // Debug statement

    const uniqueBatchId = new Date().toISOString();
    console.log("\nGenerated unique batch ID:", uniqueBatchId); // Debug statement

    const result = await prisma.post.createMany({
      data: parsedPosts.data.map((post) => ({
        ...post,
        userId: userId,
        batchId: uniqueBatchId,
      })),
    });

    console.log("\nResult of prisma.post.createMany:", result); // Debug statement

    const createdPosts = await prisma.post.findMany({
      where: {
        userId: userId,
        batchId: uniqueBatchId,
        campaignId: postsData[0].campaignId,
      },
      orderBy: { createdAt: "desc" },
    });

    console.log("\nPosts created:", createdPosts); // Debug statement

    return {
      type: "success",
      message: `${createdPosts.length} posts created successfully.`,
      data: createdPosts,
    };
  } catch (error: any) {
    console.log("\nError caught in createPosts function:", error.message); // Debug statement
    return { type: "error", message: error.message, data: null };
  }
};

export const updatePost = async (
  postData: UpdatePostRequest,
): Promise<Result<Post>> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        type: "error",
        message: "Unauthorized user. Please login to continue.",
        data: null,
      };
    }

    const parsedPost = UpdatePostSchema.safeParse(postData);
    if (!parsedPost.success) {
      return {
        type: "error",
        message: "Invalid post data.",
        data: null,
      };
    }

    const post = await prisma.post.update({
      where: { id: postData.id },
      data: parsedPost.data,
    });

    return {
      type: "success",
      message: "Post updated successfully.",
      data: post,
    };
  } catch (error: any) {
    return { type: "error", message: error.message, data: null };
  }
};

export const getAllPosts = async (): Promise<Result<Post[]>> => {
  try {
    const posts = await prisma.post.findMany();
    return {
      type: "success",
      message: "Posts fetched successfully.",
      data: posts,
    };
  } catch (error: any) {
    return { type: "error", message: error.message, data: null };
  }
};

export const getPostByPlatform = async (
  platform: Platform,
  campaignId: string,
): Promise<Result<Post[]>> => {
  try {
    const posts = await prisma.post.findMany({
      where: { platform, campaignId },
    });
    return {
      type: "success",
      message: "Posts fetched successfully.",
      data: posts,
    };
  } catch (error: any) {
    return { type: "error", message: error.message, data: null };
  }
};

export const deletePost = async (postId: string): Promise<Message> => {
  try {
    await prisma.post.delete({ where: { id: postId } });
    return {
      type: "success",
      message: "Post deleted successfully.",
    };
  } catch (error: any) {
    if (error instanceof Error) {
      return { type: "error", message: error.message };
    } else {
      return { type: "error", message: "An unexpected error occurred." };
    }
  }
};

export const getPostsByCampaign = async (
  campaignId: string,
): Promise<Result<Post[]>> => {
  try {
    const posts = await prisma.post.findMany({ where: { campaignId } });
    return {
      type: "success",
      message: "Posts fetched successfully.",
      data: posts,
    };
  } catch (error: any) {
    return { type: "error", message: error.message, data: null };
  }
};

export const getPostedPostsByCampaign = async (
  campaignId: string,
): Promise<Result<Post[]>> => {
  try {
    const posts = await prisma.post.findMany({
      where: { campaignId, status: "POSTED" },
    });
    return {
      type: "success",
      message: "Posts fetched successfully.",
      data: posts,
    };
  } catch (error: any) {
    return { type: "error", message: error.message, data: null };
  }
};
