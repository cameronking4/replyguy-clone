import { z } from "zod";

export const PlatformEnum = z.enum([
  "twitter.com",
  "reddit.com",
  "linkedin.com",
]);
export type Platform = z.infer<typeof PlatformEnum>;

export const SafeSearchEnum = z.enum(["off", "active", "medium"]);
export type SafeSearch = z.infer<typeof SafeSearchEnum>;

export const TimeRangeEnum = z.enum([
  "all",
  "qdr:h",
  "qdr:d",
  "qdr:w",
  "qdr:m",
  "qdr:y",
]);
export type TimeRange = z.infer<typeof TimeRangeEnum>;

export const SortByEnum = z.enum(["relevance", "date"]);
export type SortBy = z.infer<typeof SortByEnum>;

export const SearchFieldEnum = z.enum(["all", "intitle", "inurl", "inanchor"]);
export type SearchField = z.infer<typeof SearchFieldEnum>;

export const PlaygroundSettingsSchema = z.object({
  keywords: z.string().min(1, "Keywords are required."),
  num: z.coerce
    .number()
    .min(1, "Number of results must be at least 1")
    .max(100, "Number of results must be at most 100")
    .default(10),
  platform: PlatformEnum.default("twitter.com"),
  safe: SafeSearchEnum.default("off"),
  timeRange: TimeRangeEnum,
  sortBy: SortByEnum,
  field: SearchFieldEnum,
});
export type PlaygroundSettingsRequest = z.infer<
  typeof PlaygroundSettingsSchema
>;
