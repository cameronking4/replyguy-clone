"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { TrainFrontIcon } from "lucide-react";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { GrReddit } from "react-icons/gr";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const getSearchResults = async (queryParams: string) => {
  try {
    const response = await fetch(`/api/search?${queryParams}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch search results: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching search results: ${error.message}`);
  }
};

type SearchResult = {
  title: string;
  link: string;
  snippet: string;
  source: "twitter.com" | "reddit.com" | "linkedin.com";
};

export const PlaygroundResultsDisplay = () => {
  const { get } = useSearchParams();

  const queryParams = {
    keywords: get("keywords") ?? "",
    num: get("num") ?? "",
    platform: get("platform") ?? "",
    safe: get("safe") ?? "",
    sortBy: get("sortBy") ?? "",
    field: get("field") ?? "",
  };

  const queryParamsString = new URLSearchParams(queryParams).toString();

  const {
    data: searchResults,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["searchResults", queryParamsString],
    queryFn: () => getSearchResults(queryParamsString),
  }) as { data: SearchResult[]; isLoading: boolean; error: Error };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col space-y-2">
      {searchResults.map((result) => {
        const { title, link, snippet, source } = result;

        return (
          <Card key={result.link} className="flex items-start justify-between">
            <Link href={result.link} target="_blank">
              <CardHeader className="">
                <CardTitle className="text-base">{result.title}</CardTitle>

                <CardDescription>{result.snippet}</CardDescription>
              </CardHeader>
            </Link>
            <div className="flex flex-col items-start justify-center space-y-2 p-4">
              <Button className="" size={"icon"} variant={"ghost"}>
                {result.source === "twitter.com" && (
                  <FaXTwitter className="size-4" />
                )}
                {result.source === "reddit.com" && (
                  <GrReddit className="size-4" />
                )}
                {result.source === "linkedin.com" && (
                  <FaLinkedin className="size-4" />
                )}
              </Button>
              {/* <Button className="" size={"icon"} variant={"ghost"}>
                <TrainFrontIcon className="size-4" />
              </Button> */}
            </div>
          </Card>
        );
      })}
    </div>
  );
};
