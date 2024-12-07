"use server";

import {
  CreateKeywordRequest,
  createKeywordSchema,
  keywordResponseSchema,
} from "@/schemas/campaign";
import { Message, Result } from "@/types";
import { Keyword } from "@prisma/client";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const createKeywords = async (
  keywordData: CreateKeywordRequest,
): Promise<Result<Keyword[]>> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        type: "error",
        message: "Unauthorized user. Please login to continue.",
        data: null,
      };
    }

    const parsedKeywords = createKeywordSchema.safeParse(keywordData);

    if (!parsedKeywords.success) {
      return {
        type: "error",
        message: "Invalid keywords",
        data: null,
      };
    }

    const { campaignId, keywords } = keywordData;

    const createdKeywords = await prisma.$transaction(
      keywords.map((keyword) =>
        prisma.keyword.create({
          data: {
            campaignId,
            keyword,
          },
        }),
      ),
    );

    return {
      type: "success",
      message: "Keyword created successfully.",
      data: createdKeywords.map((keyword) =>
        keywordResponseSchema.parse(keyword),
      ),
    };
  } catch (error: any) {
    return { type: "error", message: error.message, data: null };
  }
};

export const getKeywordsByCampaign = async (
  campaignId: string,
): Promise<Result<Keyword[]>> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        type: "error",
        message: "Unauthorized user. Please login to continue.",
        data: null,
      };
    }

    const keywords = await prisma.keyword.findMany({
      where: {
        campaignId,
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      type: "success",
      message: "Keywords fetched successfully.",
      data: keywords.map((keyword) => keywordResponseSchema.parse(keyword)),
    };
  } catch (error: any) {
    return { type: "error", message: error.message, data: null };
  }
};

export const deleteKeyword = async (keywordId: string): Promise<Message> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        type: "error",
        message: "Unauthorized user. Please login to continue.",
      };
    }

    const keyword = await prisma.keyword.findUnique({
      where: {
        id: keywordId,
      },
    });

    if (!keyword) {
      return {
        type: "error",
        message: "Keyword not found.",
      };
    }

    await prisma.keyword.delete({
      where: {
        id: keywordId,
      },
    });

    return {
      type: "success",
      message: "Keyword deleted successfully.",
    };
  } catch (error: any) {
    return { type: "error", message: error.message };
  }
};
