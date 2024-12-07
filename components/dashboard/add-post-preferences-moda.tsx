"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreatePostPreferenceRequest } from "@/schemas/campaign";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import {
  Step,
  Stepper,
  useStepper,
  type StepItem,
} from "@/components/ui/stepper";
import { Switch } from "@/components/ui/switch";
import { createPostPreference } from "@/app/actions/post-preferences";

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

type CombinesSchemaRequest = z.infer<typeof CombinedSchema>;

const frequencyOptions = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
];

interface AddPostPreferencesModalProps {
  setModalOpen?: (value: boolean) => void;
  campaign_id?: string;
  onPreferencesSet?: () => void; // New callback prop
}

export function AddPostPreferencesModal({
  setModalOpen,
  campaign_id,
  onPreferencesSet,
}: AddPostPreferencesModalProps) {
  const searchParams = useSearchParams();
  const campaignId = campaign_id ?? searchParams.get("id") ?? "";
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const methods = useForm<CombinesSchemaRequest>({
    resolver: zodResolver(CombinedSchema),
    defaultValues: {
      enable_twitter: true,
      enable_linkedin: true,
      enable_reddit: true,
      posting_frequency: "daily",
      posts_per_frequency: 1,
    },
  });

  const steps = [
    { label: "Target Platforms" },
    { label: "Posting Frequency" },
  ] satisfies StepItem[];

  const onSubmit = async (data: CombinesSchemaRequest) => {
    const payload = {
      campaignId: campaignId,
      enableLinkedin: data.enable_linkedin,
      enableReddit: data.enable_reddit,
      enableTwitter: data.enable_twitter,
      postsPerFrequency: data.posts_per_frequency,
      postingFrequency: data.posting_frequency,
    } satisfies CreatePostPreferenceRequest;

    const result = await createPostPreference(payload);

    if (result.type === "error") {
      toast.error(result.message);
      return;
    } else if (result.type === "success" && result.data) {
      toast.success(result.message);
      if (onPreferencesSet) {
        onPreferencesSet();
      }
      setModalOpen && setModalOpen(false);
      router.refresh();
      setOpen(false);
    }

    // console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <Dialog defaultOpen={true}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Autopilot Posting Preferences</DialogTitle>
            <DialogDescription>
              Manage post frequency, target platforms and interaction types.
            </DialogDescription>
          </DialogHeader>

          <div className="flex w-full flex-col gap-4">
            <Stepper
              initialStep={0}
              steps={steps}
              variant="circle-alt"
              size="sm"
            >
              {steps.map(({ label }, index) => {
                return (
                  <Step key={label} label={label}>
                    <div className="my-4 flex flex-col gap-4">
                      {index === 0 && <TargetPlatforms />}
                      {index === 1 && <PostingFrequency />}
                    </div>
                  </Step>
                );
              })}
              <Footer onSubmit={methods.handleSubmit(onSubmit)} />
            </Stepper>
          </div>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}

interface FooterProps {
  onSubmit: () => void;
}

const Footer = ({ onSubmit }: FooterProps) => {
  const {
    nextStep,
    prevStep,
    resetSteps,
    isDisabledStep,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
  } = useStepper();
  return (
    <>
      {hasCompletedAllSteps && (
        <div className="my-4 flex h-40 items-center justify-center rounded-md border bg-secondary text-primary">
          <h1 className="text-xl">Woohoo! All steps completed! 🎉</h1>
        </div>
      )}
      <div className="flex w-full justify-end gap-2">
        {hasCompletedAllSteps ? (
          <Button size="sm" onClick={resetSteps}>
            Reset
          </Button>
        ) : (
          <div className="flex items-center gap-4">
            <Button
              disabled={isDisabledStep}
              onClick={prevStep}
              size="sm"
              variant="secondary"
            >
              Back
            </Button>
            <Button size="sm" onClick={isLastStep ? onSubmit : nextStep}>
              {isLastStep
                ? "Save Preferences"
                : isOptionalStep
                  ? "Skip"
                  : "Next"}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

const TargetPlatforms = () => {
  const { control } = useFormContext();
  return (
    <>
      <FormField
        control={control}
        name="enable_twitter"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="font-semibold">Enable Twitter</FormLabel>
              <FormDescription>
                Allow posting and commenting on Twitter.
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="enable_linkedin"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="font-semibold">Enable LinkedIn</FormLabel>
              <FormDescription>
                Allow posting and commenting on LinkedIn.
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
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
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

const PostingFrequency = () => {
  const { control } = useFormContext();
  return (
    <>
      <FormField
        control={control}
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
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="posts_per_frequency"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">Threshold</FormLabel>
            <FormDescription>
              Specify how strict your mentions should be related to original
              posts. Lower threshold means more quality mentions. Higher
              threshold means more quantity of mentions.
            </FormDescription>
            <FormControl>
              <Slider
                value={[field.value]}
                onValueChange={(value) => field.onChange(value[0])}
                max={100}
                step={1}
                className="w-3/5"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};
