"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldAlertIcon } from "lucide-react";
import { Timeline } from "@/components/timeline";
import { infos } from "@/config/landing";
import { useSigninModal } from "@/hooks/use-signin-modal";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { Button } from "@/components/ui/moving-border";
import { Switch } from "@/components/ui/switch";
import { BentoGrid } from "@/components/bentogrid";
// import { AddCampaignModal } from "@/components/dashboard/add-campaign-modal";
import { InfoLanding } from "@/components/info-landing";
import { CollapsibleDemo } from "@/components/layout/collapsible-demo";
import { PreviewDropdown } from "@/components/layout/preview-select";
import { ProjectRequirements } from "@/components/layout/project-requirements";
import { PricingFaq } from "@/components/pricing-faq";
import { DropdownMenuDemo } from "@/components/project/repo-dropdown";
import { Icons } from "@/components/shared/icons";
import { GifGrid } from "@/components/gif-card";
import { BrowserComponent } from "@/components/browser";
import TweetCard from "@/components/ui/tweet-card";
import SparklesText from "@/components/magicui/sparkles-text";
import { UGCText } from "@/components/ugc-text";
import { PinContainer } from "@/components/3d-pin";
import { PreviewRadar } from "@/components/radar/Preview";

const images = [
  '/cases/1.png',  // Update these paths to where your images are stored
  '/cases/2.png',
  '/cases/3.png',
  '/cases/4.png'
];

const gridPatternStyle = {
  backgroundImage: `
  linear-gradient(to top right, rgba(9,9,11,255) 37%, rgba(0,0,0,0) 100%),
  linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
  `,
  backgroundSize: "cover, 110px 60px, 70px 40px", // Adjust the size of the grid pattern here
  backgroundBlendMode: "normal, normal, normal",
};

export default function IndexPage() {
  const [activeTab, setActiveTab] = useState("makers");
  const buttonClassMaker =
    "px-4 py-2 text-sm font-semibold transition duration-300 " +
    (activeTab === "makers"
      ? "text-secondary bg-primary"
      : "text-gray-300 bg-transparent");
  const buttonClassDev =
    "px-4 py-2 text-sm font-semibold uppercase transition duration-300 " +
    (activeTab === "developers"
      ? "text-secondary bg-primary"
      : "text-gray-300 bg-transparent");

  return (
    <div>
      <div className="container mx-auto">
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setActiveTab("makers")}
            className={buttonClassMaker}
            style={{ animationDelay: "0.321s", animationFillMode: "forwards" }}
          >
            🎉 Made for Creators, Startups, E-Commerce
          </button>
          {/* <button
            onClick={() => setActiveTab('developers')}
            className={buttonClassDev}
            style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
          >
            For Developers
          </button> */}
        </div>
        <div className="shadow-bg hidden md:block"></div>
        <div
          className={`transition-opacity duration-500 ${
            activeTab === "makers" ? "opacity-100" : "opacity-0"
          }`}
          style={{ animationFillMode: "forwards" }}
        >
          {activeTab === "makers" && <MakerContent />}
        </div>
      </div>
    </div>
  );
}

const MakerContent = () => {
  const signInModal = useSigninModal();
  return (
    <div className="min-h-[90vh]">
      <section className="space-y-8 pt-16">
        <div className="container flex max-w-5xl flex-col items-center gap-5 text-center">
          <h1
            className="animate-fade-up text-balance font-urban text-5xl font-extrabold tracking-tight opacity-0 sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
          >
            <span className="text-gradient_indigo-purple font-extrabold">
              Name-drop
            </span>{" "}
            your business across social media{" "}
            <span className="text-gradient_indigo-purple font-extrabold">
              24/7
            </span>{" "}
            with{" "}
            <span className="text-gradient_indigo-purple font-extrabold">
              BuzzDaddy
            </span>{" "}
            to boost sales
          </h1>
          <p
            className="mt-2 max-w-[45rem] animate-fade-up text-balance leading-normal text-gray-300 opacity-0 sm:text-xl sm:leading-8"
            style={{ animationDelay: "0.333s", animationFillMode: "forwards" }}
          >
            Meet your customizable bot that replies to public X, LinkedIn & Reddit posts on your
            behalf- generating organic buzz for your business.
          </p>

          <div
            className="flex animate-fade-up justify-center space-x-2 opacity-0 md:space-x-4"
            style={{ animationDelay: "0.444s", animationFillMode: "forwards" }}
          >
            <Button
              onClick={signInModal.onOpen}
              borderRadius="1.75rem"
              className="border-neutral-200 bg-white text-black dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            >
              Get started
            </Button>
          </div>
        </div>
      </section>
      {/* 3D Component  */}
      {/* <section
        className="hidden animate-fade-down md:block"
        style={{ animationDelay: "0.777s", animationFillMode: "forwards" }}
      > */}
        <CardContainer className="inter-var w-7xl">
          <CardBody className="group/card relative size-auto rounded-xl border border-black/[0.1] bg-gray-50 p-6 dark:border-white/[0.2] dark:bg-black dark:hover:shadow-2xl dark:hover:shadow-violet-400/[0.6]">
            <CardItem translateZ="85" className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <Link href="/project">
                      <CardTitle>BuzzDaddy</CardTitle>
                    </Link>
                    <CardDescription className="mt-2 max-w-3xl">
                      An advanced AI-agent made for social media growth-hacking that plugs your business in comments across social networks 24/7. Use our dedicated profiles to boost UGC related to your business.
                    </CardDescription>
                  </div>
                  {/* <div className="space-3 flex">
                    <DropdownMenuDemo />
                  </div> */}
                </div>
              </CardHeader>
            </CardItem>
            <CardContent>
              <CardItem translateZ="85" className="w-full">
                <div className="mb-4 flex items-center space-x-4 rounded-md border p-4">
                  <ShieldAlertIcon />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Autopilot
                    </p>
                    <p className="text-sm">
                      Automatically find & reply to posts {" "}
                      {"(X, Linkedin, Reddit, TikTok)"}
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </CardItem>
              <CardItem translateZ="100" className="w-full">
                <div className="mb-4 rounded-md border p-4">
                  <CollapsibleDemo />
                </div>
              </CardItem>
            </CardContent>
          </CardBody>
        </CardContainer>
      {/* </section> */}
      {/* Mobile Section */}
      <section
        id="mobile"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          backgroundColor: "#09090b",
          gap: "1rem",
          ...gridPatternStyle,
        }}
        className="cols-1 container mt-16 block max-w-5xl flex-col space-y-6 py-4 dark:bg-transparent sm:hidden md:py-12 lg:py-24"
      >
        <InfoLanding data={infos[0]} reverse={true} />
        <InfoLanding data={infos[1]} />
      </section>
      {/* Youtube Video */}
      <section
        id="howitworks"
        className="container hidden max-w-7xl bg-slate-50 py-4 dark:bg-transparent md:block"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          backgroundColor: "#09090b",
          gap: "1rem",
          ...gridPatternStyle,
        }}
      >
        <div className="flex flex-col overflow-hidden max-w-7xl">
          <ContainerScroll
            titleComponent={
              <>
                <UGCText />
                {/* <h1 className="text-7xl text-gradient_indigo-purple font-bold flex"><SparklesText text="UGC"/> generates 10x more leads than traditional ads</h1> */}
                <h1 className="mt-8 text-3xl text-muted-foreground">
                  People love our replies 😁 
                  <br/>
                  {/* <span className="text-gradient_indigo-purple mt-1 text-4xl font-extrabold leading-none md:text-[6rem]">
                    naturally with AI
                  </span> */}
                </h1>
              </>
            }
          >
           {/* <TweetCard id="1825776266567352585" /> */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {images.map((image, index) => (
                <div key={index} className="flex justify-center items-center">
                    <img src={image} alt={`Screenshot ${index + 1}`} className="max-w-full h-auto rounded shadow-lg" />
                </div>
            ))}
            </div>
          </ContainerScroll>
        </div>
      </section>
      <div className="my-6 flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            How it works
          </h2>
          <p className="mt-4 max-w-lg leading-normal text-muted-foreground sm:text-lg sm:leading-7 md:text-xl">
            While you stay focused on being awesome, BuzzDaddy works 24/7 to bring you new customers.
          </p>
        </div>
        <HowItWorks />
        {/* <GifGrid gifs={gifs} /> */}
      </div>
      <section
        id="features"
        className="cols-2 container max-w-7xl flex-col space-y-6 py-4 dark:bg-transparent md:py-12 lg:py-24"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Features
          </h2>
          <p className="max-w-2xl leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Leverage our low-cost automation tool to promote your business 24/7. BuzzDaddy will mention you naturally in recent & relevant posts.
          </p>
        </div>
        <BentoGrid />
      </section>
      <section
        id="pricing"
        className="container mb-16 py-8 md:py-12 lg:py-24"
      >
        <PricingFaq />
      </section>
      <PreviewRadar />
    </div>
  );
};

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