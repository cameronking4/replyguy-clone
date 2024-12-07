"use client";

import { useTransition } from "react";
import { TweetScraperRequest } from "@/schemas/apify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { scrapeTweetsV2 } from "@/app/actions";

const FormSchema = z.object({
  startUrls: z.string().optional(),
  searchTerms: z.string().optional(),
  twitterHandles: z.string().optional(),
  conversationIds: z.string().optional(),
  maxItems: z.coerce.number().optional(),
  sort: z.enum(["Top", "Latest", "Media"]).optional(),
  tweetLanguage: z.string().optional(),
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
  minimumRetweets: z.coerce.number().optional(),
  minimumFavorites: z.coerce.number().optional(),
  minimumReplies: z.coerce.number().optional(),
  start: z.string().optional(), // Should be an ISO date string
  end: z.string().optional(), // Should be an ISO date string
  includeSearchTerms: z.boolean().optional(),
  customMapFunction: z.string().optional(),
});

type FormData = z.infer<typeof FormSchema>;

export function APIDojoTwitterScraperForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      sort: "Latest",
    },
  });

  const onSubmit = async (data: FormData) => {
    startTransition(async () => {
      const payload = {
        ...data,
        startUrls: data.startUrls
          ? data.startUrls.split(",").map((url) => url.trim())
          : undefined,
        searchTerms: data.searchTerms
          ? data.searchTerms.split(",").map((term) => term.trim())
          : undefined,
        twitterHandles: data.twitterHandles
          ? data.twitterHandles.split(",").map((handle) => handle.trim())
          : undefined,
        conversationIds: data.conversationIds
          ? data.conversationIds.split(",").map((id) => id.trim())
          : undefined,
      } satisfies TweetScraperRequest;

      const result = await scrapeTweetsV2(payload);

      console.log(result);

      if (result.type === "error") {
        toast.error(result.message);
      } else {
        toast.success(result.message);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startUrls"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start URLs</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter Twitter URLs, separated by commas"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="searchTerms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Search Terms</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter search terms, separated by commas"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="twitterHandles"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter Handles</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter Twitter handles, separated by commas"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="conversationIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conversation IDs</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter conversation IDs, separated by commas"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="maxItems"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Items</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sort"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sort By</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sort option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Top">Top</SelectItem>
                    <SelectItem value="Latest">Latest</SelectItem>
                    <SelectItem value="Media">Media</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tweetLanguage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tweet Language</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter language code (e.g., en, es)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="onlyVerifiedUsers"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2">
                <FormLabel>Only Verified Users</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="onlyTwitterBlue"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2">
                {" "}
                <FormLabel>Only Twitter Blue Users</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="onlyImage"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2">
                {" "}
                <FormLabel>Only Image Tweets</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="onlyVideo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2">
                {" "}
                <FormLabel>Only Video Tweets</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="onlyQuote"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2">
                {" "}
                <FormLabel>Only Quote Tweets</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tweet Author</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter author's Twitter handle"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="inReplyTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>In Reply To</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Twitter handle for replies"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mentioning"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mentioning</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Twitter handle for mentions"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="geotaggedNear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Geotagged Near</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter location for geotagged tweets"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="withinRadius"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Within Radius</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter radius for geotagged tweets"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="geocode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Geocode</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter geocode (lat,lon,radius)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="placeObjectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Place Object ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter place object ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minimumRetweets"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Retweets</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minimumFavorites"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Favorites</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minimumReplies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Replies</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="start"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input placeholder="YYYY-MM-DD" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input placeholder="YYYY-MM-DD" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="includeSearchTerms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Include Search Terms</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="customMapFunction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Map Function</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter custom map function" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Loading..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
