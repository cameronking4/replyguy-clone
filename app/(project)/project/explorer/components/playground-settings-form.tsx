"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Platform,
  PlaygroundSettingsRequest,
  PlaygroundSettingsSchema,
  SafeSearch,
  SearchField,
  SortBy,
  TimeRange,
} from "@/schemas/playground";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { Slider } from "@/components/ui/slider";

type PlatformOption = {
  id: Platform;
  name: string;
};

type SafeSearchOption = {
  id: SafeSearch;
  name: string;
};

type TimeRangeOption = {
  id: TimeRange;
  name: string;
};

type SortByOption = {
  id: SortBy;
  name: string;
};

type SearchFieldOption = {
  id: SearchField;
  name: string;
};

const platformOptions: PlatformOption[] = [
  { id: "twitter.com", name: "Twitter" },
  { id: "reddit.com", name: "Reddit" },
  { id: "linkedin.com", name: "LinkedIn" },
];

const timeRangeOptions: TimeRangeOption[] = [
  { id: "all", name: "Any Time" },
  { id: "qdr:h", name: "Past Hour" },
  { id: "qdr:d", name: "Past Day" },
  { id: "qdr:w", name: "Past Week" },
  { id: "qdr:m", name: "Past Month" },
  { id: "qdr:y", name: "Past Year" },
];

const sortByOptions: SortByOption[] = [
  { id: "relevance", name: "Relevance" },
  { id: "date", name: "Date" },
];

const searchFieldOptions: SearchFieldOption[] = [
  { id: "all", name: "Any" },
  { id: "intitle", name: "Title" },
  { id: "inurl", name: "URL" },
  { id: "inanchor", name: "Anchor" },
];

const safeSearchOptions: SafeSearchOption[] = [
  { id: "off", name: "Off" },
  { id: "active", name: "Active" },
  { id: "medium", name: "Medium" },
];

export function PlaygroundSettingsForm() {
  const { get } = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const campaignId = get("id") ?? "";

  const form = useForm<PlaygroundSettingsRequest>({
    resolver: zodResolver(PlaygroundSettingsSchema),
    defaultValues: {
      keywords: get("keywords") ?? "",
      platform: (get("platform") as Platform) ?? "twitter.com",
      num: parseInt(get("num") ?? "10", 10),
      safe: (get("safe") as SafeSearch) ?? "off",
      timeRange: (get("timeRange") as TimeRange) ?? "all",
      sortBy: (get("sortBy") as SortBy) ?? "relevance",
      field: (get("field") as SearchField) ?? "all",
    },
  });

  const onSubmit = async (data: PlaygroundSettingsRequest) => {
    const queryParams: Record<string, string> = {};

    for (const [key, value] of Object.entries(data)) {
      if (
        value !== "" &&
        value !== "all" &&
        value !== undefined &&
        value !== null
      ) {
        queryParams[key] = value.toString();
      }
    }

    router.push(
      pathname +
        "?" +
        `id=${campaignId}` +
        "&" +
        new URLSearchParams(queryParams).toString(),
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Keywords</FormLabel>
              <FormControl className="h-8">
                <Input placeholder="Enter keywords" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="platform"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Platform</FormLabel>

              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="h-8">
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {platformOptions.map((platform) => (
                    <SelectItem key={platform.id} value={platform.id}>
                      {platform.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="num"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Number of results</FormLabel>
              <FormDescription>Select the number of results.</FormDescription>
              <div className="">
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={field.value}
                    onChange={field.onChange}
                    min={1}
                    max={100}
                    className="w-20"
                  />
                </div>
                <FormControl>
                  <Slider
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    max={100}
                    step={1}
                    className="mt-3 w-4/5"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-6 w-full text-sm" size={"sm"}>
          Test Keyword
        </Button>
      </form>
    </Form>
  );
}
