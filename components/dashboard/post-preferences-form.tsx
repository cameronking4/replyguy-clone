"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UpdatePostPreferenceRequest } from "@/schemas/campaign";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  getPostPreferencesByCampaign,
  updatePostPreference,
} from "@/app/actions/post-preferences";

const SocialMediaSchema = z.object({
  enable_twitter: z.boolean().default(true),
  enable_linkedin: z.boolean().default(true),
  enable_reddit: z.boolean().default(true),
});

const FrequencySchema = z.object({
  posting_frequency: z.enum(["daily", "weekly", "monthly"], {
    required_error: "You must select a posting frequency.",
  }),
  posts_per_frequency: z
    .number()
    .min(1, "At least 1 post is required")
    .max(100, "No more than 100 posts are allowed"),
});

// Merge schemas
const CombinedSchema = z.object({
  ...SocialMediaSchema.shape,
  ...FrequencySchema.shape,
});

type CombinedSchemaRequest = z.infer<typeof CombinedSchema>;

const frequencyOptions = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
];

const fetchPostPreferencesByCampaign = async (campaignId: string) => {
  const result = await getPostPreferencesByCampaign(campaignId);
  if (result.type === "error") {
    throw new Error(result.message);
  }
  return result.data;
};

export function PostPreferencesForm() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("id") as string;
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["post-preferences", campaignId],
    queryFn: () => fetchPostPreferencesByCampaign(campaignId),
    enabled: !!campaignId,
  });

  useEffect(() => {
    if (data) {
      form.setValue("enable_twitter", data.enableTwitter);
      form.setValue("enable_linkedin", data.enableLinkedin);
      form.setValue("enable_reddit", data.enableReddit);
      form.setValue(
        "posting_frequency",
        data.postingFrequency as "daily" | "weekly" | "monthly",
      );
      form.setValue("posts_per_frequency", data.postsPerFrequency);
    }
  }, [data]);

  const form = useForm<CombinedSchemaRequest>({
    resolver: zodResolver(CombinedSchema),
    defaultValues: {
      enable_twitter: true,
      enable_linkedin: true,
      enable_reddit: true,
      posting_frequency: "daily",
      posts_per_frequency: 1,
    },
  });

  async function onSubmit(data: CombinedSchemaRequest) {
    const payload = {
      enableLinkedin: data.enable_linkedin,
      enableReddit: data.enable_reddit,
      enableTwitter: data.enable_twitter,
      postsPerFrequency: data.posts_per_frequency,
      postingFrequency: data.posting_frequency,
    } satisfies UpdatePostPreferenceRequest;

    const result = await updatePostPreference(campaignId, payload);

    if (result.type === "error") {
      toast.error(result.message);
      return;
    } else if (result.type === "success" && result.data) {
      toast.success(result.message);
      router.refresh();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Social Media Preferences */}
        <div className="space-y-2">
          <div className="mb-4">
            <FormLabel className="text-base">Target Platforms</FormLabel>
            <FormDescription>
              Select the social media platforms you want to enable.
            </FormDescription>
          </div>
          <FormField
            control={form.control}
            name="enable_twitter"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="font-semibold">
                    Enable Twitter
                  </FormLabel>
                  <FormDescription>
                    Allow posting and commenting on Twitter.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="enable_linkedin"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="font-semibold">
                    Enable LinkedIn
                  </FormLabel>
                  <FormDescription>
                    Allow posting and commenting on LinkedIn.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="enable_reddit"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="font-semibold">Enable Reddit</FormLabel>
                  <FormDescription>
                    Allow posting and commenting on Reddit.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Separator className="w-full" />

        {/* Posting Frequency */}
        <FormField
          control={form.control}
          name="posting_frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Posting Frequency</FormLabel>
              <FormDescription>
                Select how often you want to post.
              </FormDescription>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex flex-col space-y-2"
                >
                  {frequencyOptions.map((option) => (
                    <FormItem
                      key={option.id}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem value={option.id} id={option.id} />
                      <FormLabel htmlFor={option.id} className="font-normal">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="w-full" />

        <FormField
          control={form.control}
          name="posts_per_frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Threshold</FormLabel>
              <FormDescription>
                Specify how strict your mentions should be related to original
                posts. Lower threshold means more quality mentions. Higher
                threshold means more quantity of mentions.
              </FormDescription>
              <div className="space-y-6 pt-4">
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={field.value}
                    onChange={field.onChange}
                    min={1}
                    max={100}
                    className="w-20"
                  />
                  <span>/</span>
                  <p>{form.getValues("posting_frequency")}</p>
                </div>
                <FormControl>
                  <Slider
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    max={100}
                    step={1}
                    className="w-3/5"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex items-center justify-end">
          <Button type="submit">Save Preferences</Button>
        </div>
      </form>
    </Form>
  );
}
