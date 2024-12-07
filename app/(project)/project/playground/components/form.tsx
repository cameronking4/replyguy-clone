"use client";

import { UpdateVoiceTonePersonalityRequest } from "@/schemas/campaign";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { updateCampaignVoiceTonePersonality } from "@/app/actions";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const toneSchema = z.enum(["formal", "casual"]);
const voiceSchema = z.enum(["authoritative", "friendly"]);

const formSchema = z.object({
  voice: voiceSchema.optional(),
  tone: toneSchema.optional(),
  personality: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export const VoiceTonePersonalityForm = ({
  campaignId,
  voice,
  tone,
  personality,
}: {
  campaignId: string;
  voice: string | null;
  tone: string | null;
  personality: string | null;
}) => {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tone: (tone as "formal" | "casual") || "formal",
      voice: (voice as "authoritative" | "friendly") || "authoritative",
      personality: personality || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log(data);
    const payload = {
      campaignId: campaignId,
      personality: data.personality,
      tone: data.tone,
      voice: data.voice,
    } satisfies UpdateVoiceTonePersonalityRequest;

    const result = await updateCampaignVoiceTonePersonality(payload);

    if (result.type === "error" || !result.data) {
      toast.error(result.message);
      return;
    } else {
      toast.success(result.message);
      router.refresh();
      return;
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="tone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Style</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose a formal or casual style for replies.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="voice"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Voice</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="authoritative">Authoritative</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose between authoritative or friendly tone for your replies.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personality"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Personality</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the desired personality for the AI"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a brief description of the personality you want the{" "}
                <span>AI</span>
                to have.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
