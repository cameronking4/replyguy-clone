import { z } from "zod";

export enum ActivityType {
  REPLY_SENT = "REPLY_SENT",
  CAMPAIGN_CREATED = "CAMPAIGN_CREATED",
  AUTOPILOT_ACTIVATED = "AUTOPILOT_ACTIVATED",
  AUTOPILOT_DEACTIVATED = "AUTOPILOT_DEACTIVATED",
  CAMPAIGN_UPDATED = "CAMPAIGN_UPDATED",
}

export const CreateActivityLogSchema = z.object({
  userId: z.string(),
  campaignId: z.string().optional(),
  type: z.nativeEnum(ActivityType),
  message: z.string().min(1, "Message cannot be empty"),
  status: z.enum(["Success", "Failed"]),
});

export type CreateActivityLogRequest = z.infer<typeof CreateActivityLogSchema>;
