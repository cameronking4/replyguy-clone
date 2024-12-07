"use client";
import React from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { TracingBeam } from "../ui/tracing-beam";

export function UserExplainSteps() {
  return (
    <TracingBeam className="w-full">
      <div className="relative mx-auto w-full pt-4 antialiased">
        {dummyContent.map((item, index) => (
          <div key={`content-${index}`} className="mb-10">
            <h2 className="mb-4 w-fit rounded-full bg-indigo-600 px-4 py-1 text-sm text-white">
              {item.badge}
            </h2>
            <p className="mb-4 text-xl text-white">
              {item.title}
            </p>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2 mr-12">
            <div className="flex flex-col justify-between rounded-md p-6 ">
              <p>{item.description}</p>
            </div>
          </div>
            {/* <div className="prose prose-lg text-lg dark:prose-invert">
              {item?.image && (
                <img
                  src={item.image}
                  alt="blog thumbnail"
                  height="1000"
                  width="1000"
                  className="mb-10 rounded-lg object-cover"
                />
              )}
            </div> */}
          </div>
        ))}
      </div>
    </TracingBeam>
  );
}

const dummyContent = [
  {
    title: "Describe your product / service",
    description: (
      <>
        <p>
          Create a new Github repository or import an existing project public or private. Optionally, hide or lock files, or annotate files for additional clarity. If possible, we will initiate a codespace for this project to run in web.
        </p>
        {/* <p>
          Dolor minim irure ut Lorem proident. Ipsum do pariatur est ad ad
          veniam in commodo id reprehenderit adipisicing. Proident duis
          exercitation ad quis ex cupidatat cupidatat occaecat adipisicing.
        </p>
        <p>
          Tempor quis dolor veniam quis dolor. Sit reprehenderit eiusmod
          reprehenderit deserunt amet laborum consequat adipisicing officia qui
          irure id sint adipisicing. Adipisicing fugiat aliqua nulla nostrud.
          Amet culpa officia aliquip deserunt veniam deserunt officia
          adipisicing aliquip proident officia sunt.
        </p> */}
      </>
    ),
    badge: "Step 1",
    image:
      "images/user-step1.gif",
  },
  {
    title: "AI will auto reply to posts across platforms",
    description: (
      <>
        <p>
        Build an entire app, tool, or platform from scratch, or fix bugs or get feature work done on your existing project. Your job will be revised and enriched with additional information from your repo. You can review the final product requirements and your job will get matched to the best available developer for this project.
        </p>
        {/* <p>
          In dolore veniam excepteur eu est et sunt velit. Ipsum sint esse
          veniam fugiat esse qui sint ad sunt reprehenderit do qui proident
          reprehenderit. Laborum exercitation aliqua reprehenderit ea sint
          cillum ut mollit.
        </p> */}
      </>
    ),
    badge: "Step 2",
    image:
      "images/user-step2.gif",
  },
  {
    title: "Optionally: Connect your brand account",
    description: (
      <>
        <p>
        Once your job is complete, you can commit the work directly to a desired branch or auto-approve the PR. We use AI to ensure the project is completed per the agreed upon product requirements and automatically payout the assigned dev.
        </p>
      </>
    ),
    badge: "Step 3",
    image:
      "images/user-step3.gif",
  },
];
