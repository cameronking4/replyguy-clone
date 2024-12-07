// "use client"
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

const searchFormSchema = z.object({
  keywords: z.string().min(1, "Keywords are required."),
  platform: z.enum(["twitter.com", "reddit.com", "linkedin.com"]),
  num: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "Expected number, received string",
    })
    .transform((val) => Number(val))
    .refine((val) => val >= 1, {
      message: "Number of results must be at least 1.",
    })
    .refine((val) => val <= 100, {
      message: "Number of results must not exceed 100.",
    }),
  location: z.string().optional(),
  device: z.enum(["desktop", "mobile", "tablet"]),
  language: z.string().optional(),
  country: z.string().optional(),
  safe: z.enum(["off", "active", "medium"]),
  timeRange: z.enum(["all", "qdr:h", "qdr:d", "qdr:w", "qdr:m", "qdr:y"]),
  sort: z.enum(["relevance", "date"]),
  negativeKeywords: z.string().optional(),
  field: z.enum(["all", "intitle", "inurl", "inanchor"]).optional(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

interface SearchFormProps {
  onSubmit: (data: { [key: string]: string }, results: SearchResult[]) => void;
}

export default function SearchForm({ onSubmit }: SearchFormProps) {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      keywords: searchParams.get("keywords") || "",
      platform:
        (searchParams.get("platform") as
          | "twitter.com"
          | "reddit.com"
          | "linkedin.com") || "twitter.com",
      num: parseInt(searchParams.get("num") || "10"),
      location: searchParams.get("location") || "",
      device:
        (searchParams.get("device") as "desktop" | "tablet" | "mobile") ||
        "desktop",
      language: searchParams.get("language") || "",
      country: searchParams.get("country") || "",
      safe: (searchParams.get("safe") as "off" | "active" | "medium") || "off",
      timeRange: (searchParams.get("timeRange") as any) || "all",
      sort: (searchParams.get("sort") as any) || "relevance",
      negativeKeywords: searchParams.get("negativeKeywords") || "",
      field: (searchParams.get("field") as any) || "all",
    },
  });

  const handleSubmit = async (data: SearchFormValues) => {
    try {
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

      const response = await fetch(
        `/api/search?${new URLSearchParams(queryParams).toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const resultData: SearchResult[] = await response.json();
      setError(null);
      onSubmit(queryParams, resultData); // Update searchParams and results in the parent component
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full space-y-3"
      >
        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keywords</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Keywords" />
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
              <FormLabel>Platform</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twitter.com">Twitter</SelectItem>
                    <SelectItem value="reddit.com">Reddit</SelectItem>
                    <SelectItem value="linkedin.com">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="num"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Results</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Number of Results"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="safe"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Safe Search</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Safe Search" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="off">Off</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timeRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Range</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Time</SelectItem>
                    <SelectItem value="qdr:h">Past Hour</SelectItem>
                    <SelectItem value="qdr:d">Past Day</SelectItem>
                    <SelectItem value="qdr:w">Past Week</SelectItem>
                    <SelectItem value="qdr:m">Past Month</SelectItem>
                    <SelectItem value="qdr:y">Past Year</SelectItem>
                  </SelectContent>
                </Select>
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
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="negativeKeywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Negative Keywords</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Negative Keywords (optional)" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="field"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Search Field</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Search Field (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="intitle">Title</SelectItem>
                    <SelectItem value="inurl">URL</SelectItem>
                    <SelectItem value="inanchor">Anchor</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-[#34D399] text-white">
          Search
        </Button>
      </form>

      {error && <div className="mt-4 text-red-500">{error}</div>}
    </Form>
  );
}
