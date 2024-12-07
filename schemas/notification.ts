import { z } from "zod";

export const createNotificationSchema = z.object({
  userId: z.string(),
  campaignId: z.string(),
  message: z.string(),
});

export type CreateNotificationRequest = z.infer<
  typeof createNotificationSchema
>;

export const updateNotificationSchema = z.object({
  id: z.string(),
  message: z.string(),
  read: z.boolean(),
});

export type UpdateNotificationRequest = z.infer<
  typeof updateNotificationSchema
>;

export const notificationResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  campaignId: z.string(),
  message: z.string(),
  read: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type NotificationResponse = z.infer<typeof notificationResponseSchema>;
