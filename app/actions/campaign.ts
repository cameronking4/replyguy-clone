"use server";

import {
  CreateCampaignRequest,
  createCampaignSchema,
  UpdateCampaignRequest,
  updateCampaignSchema,
  UpdateVoiceTonePersonalityRequest,
} from "@/schemas/campaign";
import { ActivityType } from "@/schemas/logging-notification";
import { Message, Result } from "@/types";
import { Campaign } from "@prisma/client";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

import { createActivityLog } from "./activity-log";

export const createNewCampaign = async (
  campaignData: CreateCampaignRequest,
): Promise<Result<Campaign>> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        type: "error",
        message: "Unauthorized user. Please login to continue.",
        data: null,
      };
    }

    const parsedCampaign = createCampaignSchema.safeParse(campaignData);

    if (!parsedCampaign.success) {
      return {
        type: "error",
        message: "Invalid campaign data.",
        data: null,
      };
    }

    const campaign = await prisma.campaign.create({
      data: campaignData,
    });

    await createActivityLog({
      message: `Campaign created: ${campaign.name}`,
      status: "Success",
      type: ActivityType.CAMPAIGN_CREATED,
      userId: user.id,
      campaignId: campaign.id,
    });

    return {
      type: "success",
      message: "Campaign created successfully.",
      data: campaign,
    };
  } catch (error: any) {
    return { type: "error", message: error.message, data: null };
  }
};

export const updateCampaign = async (
  campaignData: UpdateCampaignRequest,
): Promise<Result<Campaign>> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        type: "error",
        message: "Unauthorized user. Please login to continue.",
        data: null,
      };
    }

    const parsedCampaign = updateCampaignSchema.safeParse(campaignData);

    if (!parsedCampaign.success) {
      return {
        type: "error",
        message: "Invalid campaign data.",
        data: null,
      };
    }

    const campaign = await prisma.campaign.update({
      where: { id: campaignData.id },
      data: campaignData,
    });

    return {
      type: "success",
      message: "Campaign updated successfully.",
      data: campaign,
    };
  } catch (error: any) {
    return { type: "error", message: error.message, data: null };
  }
};

export const getCampaignById = async (
  id: string,
): Promise<Result<Campaign>> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        type: "error",
        message: "Unauthorized user. Please login to continue.",
        data: null,
      };
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      return {
        type: "error",
        message: "Campaign not found.",
        data: null,
      };
    }

    return {
      type: "success",
      message: "Campaign fetched successfully.",
      data: campaign,
    };
  } catch (error: any) {
    return { type: "error", message: error.message, data: null };
  }
};

export const deleteCampaign = async (id: string): Promise<Message> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        type: "error",
        message: "Unauthorized user. Please login to continue.",
      };
    }

    const campaign = await prisma.campaign.delete({
      where: { id },
    });

    return {
      type: "success",
      message: "Campaign deleted successfully.",
    };
  } catch (error: any) {
    return { type: "error", message: error.message };
  }
};

export const getAllCampaigns = async (
  id: string,
): Promise<Result<Campaign[]>> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        type: "error",
        message: "Unauthorized user. Please login to continue.",
        data: null,
      };
    }

    const campaigns = await prisma.campaign.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      type: "success",
      message: "Campaigns fetched successfully.",
      data: campaigns,
    };
  } catch (error: any) {
    return { type: "error", message: error.message, data: null };
  }
};

export const toggleCampaignAutoPilot = async (
  campaignId: string,
  status: boolean,
): Promise<Message> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        type: "error",
        message: "Unauthorized user. Please login to continue.",
      };
    }

    const autopilot = await prisma.campaign.update({
      where: { id: campaignId },
      data: { autoPilot: status },
    });

    await createActivityLog({
      message: `${autopilot.name} AutoPilot switched ${status ? "ON" : "OFF"}`,
      status: "Success",
      type: status
        ? ActivityType.AUTOPILOT_ACTIVATED
        : ActivityType.AUTOPILOT_DEACTIVATED,
      userId: user.id,
      campaignId: campaignId,
    });

    return {
      type: "success",
      message: "AutoPilot status updated successfully.",
    };
  } catch (error: any) {
    return { type: "error", message: error.message };
  }
};

interface WeeklySummary {
  firstName: string;
  userEmail: string;
  campaignName: string;
  totalReplies: number;
  platformSummaries: {
    xReplies: number;
    redditReplies: number;
    linkedInReplies: number;
  };
}

export const getCampaignWeeklySummary = async (
  campaignId: string,
): Promise<Result<WeeklySummary>> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        type: "error",
        message: "Unauthorized user. Please login to continue.",
        data: null,
      };
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        user: true,
        posts: {
          where: {
            status: "POSTED",
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
            },
          },
        },
      },
    });

    if (!campaign) {
      return {
        type: "error",
        message: "Campaign not found.",
        data: null,
      };
    }

    const totalReplies = campaign.posts.length;
    const platformSummaries = {
      xReplies: campaign.posts.filter((post) => post.platform === "TWITTER")
        .length,
      redditReplies: campaign.posts.filter((post) => post.platform === "REDDIT")
        .length,
      linkedInReplies: campaign.posts.filter(
        (post) => post.platform === "LINKEDIN",
      ).length,
    };

    return {
      type: "success",
      message: "Weekly summary data fetched successfully.",
      data: {
        firstName: user.name as string,
        userEmail: user.email as string,
        campaignName: campaign.name,
        totalReplies,
        platformSummaries,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      return { type: "error", message: error.message, data: null };
    } else {
      return {
        type: "error",
        message: "Something went wrong. Please try again later.",
        data: null,
      };
    }
  }
};

export const updateCampaignVoiceTonePersonality = async (
  payload: UpdateVoiceTonePersonalityRequest,
): Promise<Result<Campaign>> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        type: "error",
        message: "Unauthorized user. Please login to continue.",
        data: null,
      };
    }

    const campaign = await prisma.campaign.update({
      where: { id: payload.campaignId },
      data: {
        voice: payload.voice,
        tone: payload.tone,
        personality: payload.personality,
      },
    });

    return {
      type: "success",
      message: "Voice, tone, and personality updated successfully.",
      data: campaign,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { type: "error", message: error.message, data: null };
    } else {
      return {
        type: "error",
        message: "Something went wrong. Please try again later.",
        data: null,
      };
    }
  }
};
