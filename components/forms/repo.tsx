"use client";

import Link from "next/link";
import { User } from "@prisma/client";
import { IconRefresh } from "@tabler/icons-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

import { CollapsibleDemo } from "../layout/collapsible-demo";

interface RepositoriesProps {
  user: Pick<User, "id" | "name">;
}

const projectData = [
  {
    title: "Sketch2App",
    description:
      "The ultimate sketch to code app made using GPT4 vision. Choose your desired framework (React, Next, React Native, Flutter) for your app. It will instantly generate code and preview (sandbox) from a simple hand-drawn sketch on paper captured from a webcam.",
  },
  {
    title: "Qashboard",
    description: "All your finances in one place, supercharged by AI",
  },
  {
    title: "PaywallGPT",
    description: "Monetize your custom GPT to earn off ChatGPT",
  },
];

export function Repositories({ user }: RepositoriesProps) {
  return (
    <div className="grid grid-cols-1 gap-5">
      {projectData.map((project, index) => (
        <Card key={index}>
          <CardHeader>
            <Link href="/project">
              <CardTitle className="underline">{project.title}</CardTitle>
            </Link>
            <CardDescription>{project.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center space-x-4 rounded-md border p-4">
              <IconRefresh />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Autopilot</p>
                <p className="text-sm text-muted-foreground">
                  Automatically find, reply & post to social networks
                </p>
              </div>
              <Switch />
            </div>
            <div className="mb-4 flex items-center space-x-4 rounded-md border p-4">
              <CollapsibleDemo />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const notifications = [
  {
    title: `BuzzDaddy created a post in Reddit community "SocialMediaMarketing"`,
    description: "1 hour ago",
  },
  {
    title: `BuzzDaddy commented on X post "Networking on social media isn't just about....".`,
    description: "1 hour ago",
  },
  {
    title: `BuzzDaddy detected 4376 posts across social platforms.`,
    description: "2 hours ago",
  },
  {
    title: `Campaign for BuzzDaddy has successfully started."`,
    description: "6 hours ago",
  },
];
