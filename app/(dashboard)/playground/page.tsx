"use client";

import { Suspense, useState } from "react";

import { Separator } from "@/components/ui/separator";
import { DashboardHeader } from "@/components/dashboard/header";

import SearchForm from "./form";
import SearchResults from "./search-results";

export const dynamic = "force-dynamic";

type SearchResult = {
  title: string;
  link: string;
  snippet: string;
};

const Page = ({ params }: { params: { slug: string } }) => {
  const [searchParams, setSearchParams] = useState<{ [key: string]: string }>(
    {},
  );
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearchSubmit = (
    newSearchParams: { [key: string]: string },
    newResults: SearchResult[],
  ) => {
    setSearchParams(newSearchParams);
    setResults(newResults);
  };

  return (
    <>
      <div className="container relative mx-auto flex h-[calc(100vh-20vh)] flex-col overflow-hidden lg:flex-row">
        <div className="peer absolute inset-y-0 z-30 translate-x-0 border-r duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] xl:w-[300px]">
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-auto">
              <div className="flex h-full flex-col p-4">
                <SearchForm onSubmit={handleSearchSubmit} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-start overflow-auto pl-[250px] xl:pl-[300px]">
          <div className="flex w-full flex-col gap-4 p-4">
            <DashboardHeader
              heading="Playground"
              text="Experiment with different keywords and preferences in realtime."
            ></DashboardHeader>
            <Separator className="w-full" />
            <Suspense fallback={<div>Loading...</div>}>
              <SearchResults searchParams={searchParams} results={results} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
