"use server";

import {
  CreateNotificationRequest,
  createNotificationSchema,
  UpdateNotificationRequest,
  updateNotificationSchema,
} from "@/schemas/notification";
import { Message, Result } from "@/types";
import { Notification } from "@prisma/client";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const createNotification = async (
  notificationData: CreateNotificationRequest,
): Promise<Result<Notification>> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        type: "error",
        message: "Unauthorized user. Please login to continue.",
        data: null,
      };
    }

    const parsedNotification =
      createNotificationSchema.safeParse(notificationData);

    if (!parsedNotification.success) {
      return {
        type: "error",
        message: "Invalid notification data.",
        data: null,
      };
    }

    const notification = await prisma.notification.create({
      data: notificationData,
    });

    return {
      type: "success",
      message: "Notification created successfully.",
      data: notification,
    };
  } catch (error: any) {
    return { type: "error", message: error.message, data: null };
  }
};

export const updateNotification = async (
  notificationData: UpdateNotificationRequest,
): Promise<Result<Notification>> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        type: "error",
        message: "Unauthorized user. Please login to continue.",
        data: null,
      };
    }

    const parsedNotification =
      updateNotificationSchema.safeParse(notificationData);

    if (!parsedNotification.success) {
      return {
        type: "error",
        message: "Invalid notification data.",
        data: null,
      };
    }

    const notification = await prisma.notification.update({
      where: { id: notificationData.id },
      data: notificationData,
    });

    return {
      type: "success",
      message: "Notification updated successfully.",
      data: notification,
    };
  } catch (error: any) {
    return { type: "error", message: error.message, data: null };
  }
};

export const getNotification = async (
  id: string,
): Promise<Result<Notification>> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        type: "error",
        message: "Unauthorized user. Please login to continue.",
        data: null,
      };
    }

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return {
        type: "error",
        message: "Notification not found.",
        data: null,
      };
    }

    return {
      type: "success",
      message: "Notification fetched successfully.",
      data: notification,
    };
  } catch (error: any) {
    return { type: "error", message: error.message, data: null };
  }
};

export const deleteNotification = async (id: string): Promise<Message> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        type: "error",
        message: "Unauthorized user. Please login to continue.",
      };
    }

    await prisma.notification.delete({
      where: { id },
    });

    return {
      type: "success",
      message: "Notification deleted successfully.",
    };
  } catch (error: any) {
    return { type: "error", message: error.message };
  }
};

export const getAllNotifications = async (): Promise<
  Result<Notification[]>
> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        type: "error",
        message: "Unauthorized user. Please login to continue.",
        data: null,
      };
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.id,
      },
    });

    return {
      type: "success",
      message: "Notifications fetched successfully.",
      data: notifications,
    };
  } catch (error: any) {
    return { type: "error", message: error.message, data: null };
  }
};

export const getNotificationsByCampaign = async (
  campaignId: string,
): Promise<Result<Notification[]>> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        type: "error",
        message: "Unauthorized user. Please login to continue.",
        data: null,
      };
    }

    const notifications = await prisma.notification.findMany({
      where: {
        campaignId,
        userId: user.id,
      },
    });

    return {
      type: "success",
      message: "Notifications for the campaign fetched successfully.",
      data: notifications,
    };
  } catch (error: any) {
    return { type: "error", message: error.message, data: null };
  }
};
