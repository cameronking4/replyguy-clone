"use client";

import { useTransition } from "react";
import { MicroworldsTwitterScraperRequest } from "@/schemas/apify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { scrapeMicroworldsTweets } from "@/app/actions";

export const FormSchema = z.object({
  searchTerms: z.string().optional(),
  searchMode: z.enum(["top", "live"]).optional().default("live"),
  maxTweets: z.coerce.number().optional().default(10),
  maxTweetsPerQuery: z.coerce.number().optional().default(10),
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
  handle: z.string().optional(),
  urls: z.string().optional(),
});

export type FormData = z.infer<typeof FormSchema>;

export function MicroworldsTwitterScraperForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      searchMode: "live",
      maxTweets: 50,
      maxTweetsPerQuery: 50,
      maxRequestRetries: 6,
      addUserInfo: true,
      scrapeTweetReplies: true,
    },
  });

  const onSubmit = async (data: FormData) => {
    startTransition(async () => {
      const payload = {
        ...data,
        searchTerms: data.searchTerms
          ? data.searchTerms.split(",").map((term) => term.trim())
          : undefined,
        handle: data.handle
          ? data.handle.split(",").map((h) => h.trim())
          : undefined,
        urls: data.urls
          ? data.urls.split(",").map((url) => url.trim())
          : undefined,
      } satisfies MicroworldsTwitterScraperRequest;

      const result = await scrapeMicroworldsTweets(payload);

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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-4 rounded-lg border p-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="searchTerms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Search Terms</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter search terms, separated by commas"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Separate terms with commas.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="searchMode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Search Mode</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select search mode" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="maxTweets"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Number of Tweets</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxTweetsPerQuery"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Number of Tweets Per Query</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="maxRequestRetries"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Request Retries</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="addUserInfo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2">
                <FormLabel>Add User Info</FormLabel>
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
            name="scrapeTweetReplies"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2">
                <FormLabel>Scrape Tweet Replies</FormLabel>
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
            name="sinceDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Since Date</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="YYYY-MM-DD" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="untilDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Until Date</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="YYYY-MM-DD" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="handle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter Handles</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter handles, separated by commas"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Separate handles with commas.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="urls"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter URLs</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter URLs, separated by commas"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Separate URLs with commas.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
