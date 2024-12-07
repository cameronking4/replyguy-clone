"use client";

import * as React from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { BellIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface CollapsibleProps {
  children: React.ReactNode;
}

export function CollapsibleServer({ children }: CollapsibleProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <div className="flex items-center justify-between space-x-4">
        <BellIcon />
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium leading-none">Notifications</p>
          <p className="text-sm text-muted-foreground">
            {"Catch up on the latest activity."}
          </p>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <CaretSortIcon className="size-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2 py-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

const notifications = [
  {
    title: `BuzzDaddy successfully detected 382 new posts across social platforms`,
    description: "4 hour ago",
    color: "bg-violet-400",
  },
  {
    title: `BuzzDaddy commented on X post "Networking on social media isn't just about...."`,
    description: "2 min ago",
    color: "bg-green-400",
  },
  {
    title: `BuzzDaddy created a post in Reddit community "SocialMediaMarketing"`,
    description: "1 hour ago",
    color: "bg-green-400",
  },
  {
    title: `BuzzDaddy successfully detected 4176 posts across social platforms`,
    description: "4 hour ago",
    color: "bg-violet-400",
  },
  {
    title: `Campaign for BuzzDaddy successfully started"`,
    description: "6 hours ago",
    color: "bg-violet-400",
  },
];
