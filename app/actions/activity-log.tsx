"use server";

import {
  CreateActivityLogRequest,
  CreateActivityLogSchema,
} from "@/schemas/logging-notification";
import { Result } from "@/types";
import { ActivityLog } from "@prisma/client";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function createActivityLog(
  activity: CreateActivityLogRequest,
): Promise<Result<ActivityLog>> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        type: "error",
        message: "Authentication required. Please log in to continue.",
        data: null,
      };
    }

    const validatedActivityData = CreateActivityLogSchema.safeParse(activity);

    if (!validatedActivityData.success) {
      return {
        type: "error",
        message: "Invalid activity log data provided.",
        data: null,
      };
    }

    const payload = validatedActivityData.data;

    const createdActivity = await prisma.activityLog.create({
      data: {
        userId: payload.userId,
        campaignId: payload.campaignId,
        type: payload.type,
        message: payload.message,
        status: payload.status,
      },
    });

    return {
      type: "success",
      message: "Activity log entry created successfully.",
      data: createdActivity,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { type: "error", message: error.message, data: null };
    } else {
      return {
        type: "error",
        message: "An error occurred while creating the activity log entry.",
        data: null,
      };
    }
  }
}

export async function getActivityLog(
  campaignId?: string,
): Promise<Result<ActivityLog[]>> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        type: "error",
        message: "Authentication required. Please log in to continue.",
        data: null,
      };
    }
    const activityLogs = await prisma.activityLog.findMany({
      where: {
        userId: currentUser.id,
        ...(campaignId ? { campaignId } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      type: "success",
      message: "Activity logs retrieved successfully.",
      data: activityLogs,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { type: "error", message: error.message, data: null };
    } else {
      return {
        type: "error",
        message: "An error occurred while getting activity logs.",
        data: null,
      };
    }
  }
}
