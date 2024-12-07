"use client"
import * as React from "react"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { ShieldAlertIcon, BellIcon } from "lucide-react";
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export function CollapsibleDemo() {
  const [isOpen, setIsOpen] = React.useState(true)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <div className="flex items-center justify-between space-x-4">
      <BellIcon />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                Notifications
              </p>
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
        {notifications.map((notification, index) => (
            <div
            key={index}
            className="grid grid-cols-[25px_1fr] items-start p-3 last:mb-0 last:pb-0"
            >
            <span className={`flex size-2 translate-y-1 rounded-full ${notification.color}`} />
            <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                {notification.title}
                </p>
                <p className="text-sm text-muted-foreground">
                {notification.description}
                </p>
            </div>
            </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

  const notifications = [
    {
      title: `BuzzDaddy successfully detected 382 new posts across social platforms`,
      description: "4 hour ago",
      color: "bg-violet-400"
    },
    {
      title: `BuzzDaddy commented on X post "Networking on social media isn't just about...."`,
      description: "2 min ago",
      color: "bg-green-400"
    },
    {
      title: `BuzzDaddy created a post in Reddit community "SocialMediaMarketing"`,
      description: "1 hour ago",
      color: "bg-green-400"
    },
    {
      title: `BuzzDaddy successfully detected 4176 posts across social platforms`,
      description: "4 hour ago",
      color: "bg-violet-400"
    },
    {
      title: `Campaign for BuzzDaddy successfully started"`,
      description: "6 hours ago",
      color: "bg-violet-400"
    },
  ]
  