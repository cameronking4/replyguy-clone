import * as React from "react"

import { Feedback } from "@/components/feedback";
import { cn } from "@/lib/utils"
import { Icons } from "@/components/shared/icons"
import { ModeToggle } from "@/components/layout/mode-toggle"

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Icons.logo />
          <p className="text-center text-sm leading-loose md:text-left">
          All Rights Reserved{" "}
            <a
              href={"/"}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
               BuzzDaddy
            </a>
            {" "}| Copyright 2024
          </p>
        </div>
        <div className="flex gap-6">
        <Feedback />
        <ModeToggle />
        </div>
      </div>
    </footer>
  )
}
