import { z } from "zod";

const platformEnum = z.enum(["TWITTER", "LINKEDIN", "REDDIT"]);
export type Platform = z.infer<typeof platformEnum>;
const commentStatusEnum = z.enum(["PENDING", "POSTED", "FAILED"]);

const twitterPostContentSchema = z.object({
  url: z.string().url(),
  full_text: z.string(),
  created_at: z.string(),
  retweet_count: z.number(),
  favorite_count: z.number(),
});

export type TwitterPostContent = z.infer<typeof twitterPostContentSchema>;

const linkedInPostContentSchema = z.object({
  text: z.string(),
  title: z.string(),
  url: z.string(),
  timeSincePosted: z.string(),
  authorFullName: z.string(),
  authorProfileUrl: z.string(),
  authorTitle: z.string(),
  authorFollowersCount: z.string(),
  numShares: z.number(),
  numLikes: z.number(),
  numComments: z.number(),
  canReact: z.boolean(),
  canPostComments: z.boolean(),
  canShare: z.boolean(),
});

export type LinkedInPostContent = z.infer<typeof linkedInPostContentSchema>;

const redditPostContentSchema = z.object({
  redditPostId: z.string(),
  title: z.string(),
  selftext: z.string(),
  author: z.string(),
  url: z.string(),
  permalink: z.string(),
  createdAt: z.string(),
  upvotes: z.number().int().nonnegative(),
  downvotes: z.number().int().nonnegative(),
  numComments: z.number().int().nonnegative(),
  score: z.number().int(),
  subreddit: z.string(),
  subredditId: z.string(),
  isNsfw: z.boolean(),
});

export type RedditPostContent = z.infer<typeof redditPostContentSchema>;

export const SinglePostSchema = z.object({
  campaignId: z.string(),
  platform: platformEnum,
  content: z.union([
    twitterPostContentSchema,
    linkedInPostContentSchema,
    redditPostContentSchema,
  ]),
  status: commentStatusEnum.optional(),
});

export const CreatePostSchema = z.array(SinglePostSchema);

export const UpdatePostSchema = z.object({
  id: z.string(),
  campaignId: z.string(),
  platform: platformEnum,
  content: z.union([
    twitterPostContentSchema,
    linkedInPostContentSchema,
    redditPostContentSchema,
  ]),
  status: commentStatusEnum.optional(),
});

export type CreatePostRequest = z.infer<typeof CreatePostSchema>;
export type UpdatePostRequest = z.infer<typeof UpdatePostSchema>;

export const CreateCommentSchema = z.object({
  postId: z.string(),
  userId: z.string(),
  content: z.string(),
  status: commentStatusEnum.optional(),
  responseMessage: z.string().optional(), // Optional, for error messages or status
  externalCommentId: z.string().optional(), // Optional, ID on the external platform
});

export const UpdateCommentSchema = z.object({
  id: z.string(),
  postId: z.string(),
  userId: z.string(),
  content: z.string(),
  status: commentStatusEnum.optional(),
  responseMessage: z.string().optional(),
  externalCommentId: z.string().optional(),
});

export type CreateCommentRequest = z.infer<typeof CreateCommentSchema>;
export type UpdateCommentRequest = z.infer<typeof UpdateCommentSchema>;
