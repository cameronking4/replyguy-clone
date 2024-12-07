import React from "react";
import Image from "next/image";
import { Timeline } from "@/components/timeline";
import { Card } from "@/components/ui/card";
import { BrowserComponent } from "@/components/browser";
import { PinContainer } from "@/components/3d-pin";
import { url } from "inspector";

const HowItWorksSection = () => (
  <section className="mt-12 my-6 flex flex-col items-center justify-center">
    <div className="text-center mb-8">
      <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
        How it works
      </h2>
      <p className="mt-4 max-w-lg leading-normal text-muted-foreground sm:text-lg sm:leading-7 md:text-xl">
        While you stay focused on being awesome, BuzzDaddy works 24/7 to bring you new customers.
      </p>
    </div>
    <div className="hidden md:inline-block w-full">
    <HowItWorks />
    </div>
    <div className="md:hidden">
    <div className="p-4 max-w-xl mx-auto border rounded-xl">
      {[
        { step: 'Create your campaign', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', url: "https://utfs.io/f/7b6ad10c-0461-427a-b10a-d6f0690536d8-1tckbp.gif" },
        { step: 'Setup keywords for scraping', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', url: "https://utfs.io/f/2ad0e328-055b-4242-bee7-3c0dd80b2534-1tckbq.gif" },
        { step: 'Manually reply or turn on Autopilot', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', url: "https://utfs.io/f/96636507-faee-4201-bfeb-b12255d75826-1tckbr.gif" },
      ].map(({ step, description, url }, index) => (
        <div className="flex" key={index}>
          <div className="mr-4 flex flex-col items-center">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-purple-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-blue-800 dark:text-slate-200"
                >
                  <path d="M12 5v14"></path>
                  <path d="M18 13l-6 6"></path>
                  <path d="M6 13l6 6"></path>
                </svg>
              </div>
            </div>
            <div className="h-full w-px bg-gray-300 dark:bg-slate-500"></div>
          </div>
          <div className="pt-1 pb-8">
            <p className="mb-2 text-xl font-bold">{step}</p>
            <p className="text-muted-foreground">{description}</p>
              <Image
                src={url}
                alt="hero"
                height={900}
                width={900}
                className="my-34 w-full object-cover object-center"
                draggable={true}
              />
          </div>
        </div>
      ))}

      <div className="flex">
        <div className="mr-4 flex flex-col items-center">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-purple-900 bg-purple-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-white dark:text-slate-200"
              >
                <path d="M5 12l5 5l10-10"></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="pt-1">
          <p className="mb-2 text-xl font-bold">Sit back & relax</p>
        </div>
      </div>
    </div>
    </div>
  </section>
);

function HowItWorks() {
    const data = [
      {
        title: "Create your campaign",
        content: (
          <div className="my-8">
          <PinContainer
          title="Specify the name of your startup, channel, or product you'd like to promote + a link to your website + brief description."
          href=""
          className="w-full"
        >
          <Card>
            <BrowserComponent>
              <Image
                src="https://utfs.io/f/7b6ad10c-0461-427a-b10a-d6f0690536d8-1tckbp.gif"
                alt="hero"
                height={900}
                width={1600}
                className="mt-34 size-full object-cover object-center"
                draggable={true}
              />
            </BrowserComponent>
          </Card>
          </PinContainer>
          </div>
        ),
      },
      {
        title: "Adjust keywords to scrape posts across X, Reddit & Linkedin",
        content: (
          <div className="my-8">
          <PinContainer
          title="Buzzdaddy scrapes posts that people have posted across X, Reddit & Linkedin using these keywords."
          href=""
          className="w-full"
          >
          <Card>
            <BrowserComponent>
              <Image
                src="https://utfs.io/f/2ad0e328-055b-4242-bee7-3c0dd80b2534-1tckbq.gif"
                alt="hero"
                height={900}
                width={1600}
                className="mt-34 size-full object-cover object-center"
                draggable={true}
              />
            </BrowserComponent>
          </Card>
          </PinContainer>
          </div>
        ),
      },
      {
        title: "Manually reply or turn on Autopilot",
        content: (
          <div className="mt-8">
          <PinContainer
          title="You can review the posts and reply using our dedicated accounts or turn on Autopilot to automatically filter and respond."
          href=""
          className="w-full"
          >
          <Card>
            <BrowserComponent>
              <Image
                src="https://utfs.io/f/96636507-faee-4201-bfeb-b12255d75826-1tckbr.gif"
                alt="hero"
                height={900}
                width={1600}
                className="mt-34 size-full object-cover object-center"
                draggable={true}
              />
            </BrowserComponent>
          </Card>
          </PinContainer>
          </div>
        ),
      },
    ];
    return (
      <div className="mt-12 w-full">
        <Timeline data={data} />
      </div>
    );
  }

  export default HowItWorksSection;
