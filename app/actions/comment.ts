"use server";

import {
  CreateCommentRequest,
  CreateCommentSchema,
  UpdateCommentRequest,
  UpdateCommentSchema,
} from "@/schemas/content-interaction";
import { Result } from "@/types";
import { Comment } from "@prisma/client";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const createNewComment = async (
  commentData: CreateCommentRequest,
): Promise<Result<Comment>> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        type: "error",
        message: "Unauthorized user. Please login to continue.",
        data: null,
      };
    }

    const parsedComment = CreateCommentSchema.safeParse(commentData);
    if (!parsedComment.success) {
      return {
        type: "error",
        message: "Invalid comment data.",
        data: null,
      };
    }

    const comment = await prisma.comment.create({
      data: parsedComment.data,
    });

    return {
      type: "success",
      message: "Comment created successfully.",
      data: comment,
    };
  } catch (error: any) {
    return { type: "error", message: error.message, data: null };
  }
};

export const updateComment = async (
  commentData: UpdateCommentRequest,
): Promise<Result<Comment>> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        type: "error",
        message: "Unauthorized user. Please login to continue.",
        data: null,
      };
    }

    const parsedComment = UpdateCommentSchema.safeParse(commentData);
    if (!parsedComment.success) {
      return {
        type: "error",
        message: "Invalid comment data.",
        data: null,
      };
    }

    const comment = await prisma.comment.update({
      where: { id: commentData.id },
      data: parsedComment.data,
    });

    return {
      type: "success",
      message: "Comment updated successfully.",
      data: comment,
    };
  } catch (error: any) {
    return { type: "error", message: error.message, data: null };
  }
};

export const getCommentByPostId = async (
  postId: string,
): Promise<Result<Comment>> => {
  try {
    const comment = await prisma.comment.findFirst({
      where: { postId },
    });

    return {
      type: "success",
      message: "Comments retrieved successfully.",
      data: comment,
    };
  } catch (error: any) {
    return { type: "error", message: error.message, data: null };
  }
};
