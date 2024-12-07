import { z } from "zod";

export const categorySchema = z.enum([
  "SaaSStartup",
  "Agency",
  "ECommerceStore",
  "Newsletter",
  "Community",
  "PhysicalProduct",
  "Freelancer",
  "ContentMaker",
  "Artist",
]);

export const createCampaignSchema = z.object({
  userId: z.string(),
  category: categorySchema,
  name: z.string(),
  businessUrl: z.string().url(),
  description: z.string(),
  autoPilot: z.boolean().optional(),
  voice: z.string().optional(),
  tone: z.string().optional(),
  personality: z.string().optional(),
});

export type CreateCampaignRequest = z.infer<typeof createCampaignSchema>;

export const updateCampaignSchema = z.object({
  id: z.string(),
  category: categorySchema,
  name: z.string(),
  businessUrl: z.string().url(),
  description: z.string(),
  autoPilot: z.boolean().optional(),
  voice: z.string().optional(),
  tone: z.string().optional(),
  personality: z.string().optional(),
});

export type UpdateCampaignRequest = z.infer<typeof updateCampaignSchema>;

export const campaignResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  category: z.string(),
  name: z.string(),
  businessUrl: z.string().url(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  autoPilot: z.boolean(),
  voice: z.string().nullable(),
  tone: z.string().nullable(),
  personality: z.string().nullable(),
});

export type CampaignResponse = z.infer<typeof campaignResponseSchema>;

export const resultSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    type: z.union([z.literal("success"), z.literal("error")]),
    message: z.string(),
    data: dataSchema.nullable(),
  });

export const updateVoiceTonePersonalitySchema = z.object({
  campaignId: z.string(),
  voice: z.string().optional(),
  tone: z.string().optional(),
  personality: z.string().optional(),
});

export type UpdateVoiceTonePersonalityRequest = z.infer<
  typeof updateVoiceTonePersonalitySchema
>;

export const createKeywordSchema = z.object({
  campaignId: z.string(),
  keywords: z.array(z.string()),
});

export type CreateKeywordRequest = z.infer<typeof createKeywordSchema>;

export const keywordResponseSchema = z.object({
  id: z.string(),
  campaignId: z.string(),
  keyword: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type KeywordResponse = z.infer<typeof keywordResponseSchema>;

export const postPreferenceSchema = z.object({
  id: z.string(),
  campaignId: z.string(),
  enableTwitter: z.boolean().default(true),
  enableLinkedin: z.boolean().default(true),
  enableReddit: z.boolean().default(true),
  postingFrequency: z.string().default("daily"),
  postsPerFrequency: z.number().default(1),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type PostPreferenceRequest = z.infer<typeof postPreferenceSchema>;

export const createPostPreferenceSchema = z.object({
  campaignId: z.string(),
  enableTwitter: z.boolean().optional().default(true),
  enableLinkedin: z.boolean().optional().default(true),
  enableReddit: z.boolean().optional().default(true),
  postingFrequency: z.string().optional().default("daily"),
  postsPerFrequency: z.number().optional().default(1),
});

export type CreatePostPreferenceRequest = z.infer<
  typeof createPostPreferenceSchema
>;

export const updatePostPreferenceSchema = z.object({
  enableTwitter: z.boolean().optional(),
  enableLinkedin: z.boolean().optional(),
  enableReddit: z.boolean().optional(),
  postingFrequency: z.string().optional(),
  postsPerFrequency: z.number().optional(),
});

export type UpdatePostPreferenceRequest = z.infer<
  typeof updatePostPreferenceSchema
>;
