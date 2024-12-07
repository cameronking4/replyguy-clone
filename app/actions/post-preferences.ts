"use server";

import {
  CreatePostPreferenceRequest,
  createPostPreferenceSchema,
  postPreferenceSchema,
  UpdatePostPreferenceRequest,
  updatePostPreferenceSchema,
} from "@/schemas/campaign";
import { Result } from "@/types";
import { PostPreference } from "@prisma/client";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const createPostPreference = async (
  data: CreatePostPreferenceRequest,
): Promise<Result<PostPreference>> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        type: "error",
        message: "Unauthorized user. Please login to continue.",
        data: null,
      };
    }

    const parsedData = createPostPreferenceSchema.safeParse(data);

    if (!parsedData.success) {
      return {
        type: "error",
        message: "Invalid request data",
        data: null,
      };
    }

    const postPreference = await prisma.postPreference.create({
      data: parsedData.data,
    });

    return {
      type: "success",
      message: "Post preference created successfully",
      data: postPreferenceSchema.parse(postPreference),
    };
  } catch (error: any) {
    return {
      type: "error",
      message: error.message,
      data: null,
    };
  }
};

export const updatePostPreference = async (
  campaignId: string,
  data: UpdatePostPreferenceRequest,
): Promise<Result<PostPreference>> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        type: "error",
        message: "Unauthorized user. Please login to continue.",
        data: null,
      };
    }

    const parsedData = updatePostPreferenceSchema.safeParse(data);

    if (!parsedData.success) {
      return {
        type: "error",
        message: "Invalid request data",
        data: null,
      };
    }

    const postPreference = await prisma.postPreference.update({
      where: {
        campaignId: campaignId,
      },
      data: parsedData.data,
    });

    return {
      type: "success",
      message: "Post preference updated successfully",
      data: postPreferenceSchema.parse(postPreference),
    };
  } catch (error: any) {
    return {
      type: "error",
      message: error.message,
      data: null,
    };
  }
};

export const getPostPreference = async (
  id: string,
): Promise<Result<PostPreference>> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        type: "error",
        message: "Unauthorized user. Please login to continue.",
        data: null,
      };
    }

    const postPreference = await prisma.postPreference.findUnique({
      where: { id },
    });

    if (!postPreference) {
      return {
        type: "error",
        message: "Post preference not found",
        data: null,
      };
    }

    return {
      type: "success",
      message: "Post preference fetched successfully",
      data: postPreferenceSchema.parse(postPreference),
    };
  } catch (error: any) {
    return {
      type: "error",
      message: error.message,
      data: null,
    };
  }
};

export const getPostPreferencesByCampaign = async (
  campaignId: string,
): Promise<Result<PostPreference>> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        type: "error",
        message: "Unauthorized user. Please login to continue.",
        data: null,
      };
    }

    const postPreference = await prisma.postPreference.findUnique({
      where: { campaignId },
    });

    return {
      type: "success",
      message: "Post preferences fetched successfully",
      data: postPreference,
    };
  } catch (error: any) {
    return {
      type: "error",
      message: error.message,
      data: null,
    };
  }
};
