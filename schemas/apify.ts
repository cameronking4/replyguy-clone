import { z } from "zod";

export const MicroworldsTwitterScraperRequestSchema = z.object({
  searchTerms: z.array(z.string()).optional(),
  searchMode: z.enum(["top", "live"]).optional().default("live"),
  maxTweets: z.coerce.number().optional().default(100),
  maxTweetsPerQuery: z.coerce.number().optional().default(100),
  maxRequestRetries: z.coerce.number().max(6).optional().default(6),
  addUserInfo: z.boolean().optional().default(true),
  scrapeTweetReplies: z.boolean().optional().default(true),
  sinceDate: z
    .string()
    .regex(/(\d{4}-\d{2}-\d{2}|(\d+)\s?\S+)/)
    .optional(),
  untilDate: z
    .string()
    .regex(/(\d{4}-\d{2}-\d{2}|(\d+)\s?\S+)/)
    .optional(),
  handle: z.array(z.string()).optional(),
  urls: z.array(z.string()).optional(),
});

export type MicroworldsTwitterScraperRequest = z.infer<
  typeof MicroworldsTwitterScraperRequestSchema
>;

export const MicroworldsTweetItemSchema = z.object({
  url: z.string().url(),
  created_at: z.string(), // Twitter API typically returns this as a string
  full_text: z.string(),
  favorite_count: z.number(),
  retweet_count: z.number(),
});
export type MicroworldsTweetItem = z.infer<typeof MicroworldsTweetItemSchema>;

export const MicroworldsApiResponseBodySchema = z.object({
  message: z.string(),
  data: z.array(MicroworldsTweetItemSchema),
});

export const MicroworldsApiResponseSchema = z.object({
  status: z.number(),
  body: MicroworldsApiResponseBodySchema,
});

export type MicroworldsApiResponse = z.infer<
  typeof MicroworldsApiResponseSchema
>;

export const TweetScraperRequestSchema = z.object({
  startUrls: z.array(z.string()).optional(),
  searchTerms: z.array(z.string()).optional(),
  twitterHandles: z.array(z.string()).optional(),
  conversationIds: z.array(z.string()).optional(),
  maxItems: z.number().optional(),
  sort: z.enum(["Top", "Latest", "Media"]).optional(),
  tweetLanguage: z.string().optional(), // Should be an ISO 639-1 language code
  onlyVerifiedUsers: z.boolean().optional(),
  onlyTwitterBlue: z.boolean().optional(),
  onlyImage: z.boolean().optional(),
  onlyVideo: z.boolean().optional(),
  onlyQuote: z.boolean().optional(),
  author: z.string().optional(),
  inReplyTo: z.string().optional(),
  mentioning: z.string().optional(),
  geotaggedNear: z.string().optional(),
  withinRadius: z.string().optional(),
  geocode: z.string().optional(),
  placeObjectId: z.string().optional(),
  minimumRetweets: z.number().optional(),
  minimumFavorites: z.number().optional(),
  minimumReplies: z.number().optional(),
  start: z.string().optional(), // Should be an ISO date string
  end: z.string().optional(), // Should be an ISO date string
  includeSearchTerms: z.boolean().optional(),
  customMapFunction: z.string().optional(),
});

export type TweetScraperRequest = z.infer<typeof TweetScraperRequestSchema>;
