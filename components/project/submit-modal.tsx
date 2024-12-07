"use client";
import * as React from "react"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Icons } from "@/components/shared/icons"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
 
export function SubmitButton() {
  return (
    <Sheet>
    <SheetTrigger asChild>
      <Button type="submit">Submit</Button>
    </SheetTrigger>
    <SheetContent side={'bottom'} className="px-16">
      <ScrollArea>
        <SheetHeader>
          <div className="mt-2 px-5">
            <SheetTitle>Review task</SheetTitle>
            <SheetDescription>
              {"About to get stuff done."}
            </SheetDescription>
          </div>
        </SheetHeader>
        <div className="grid gap-4 py-8">
          <div className="grid grid-cols-1 gap-4 px-5 pb-12 md:grid-cols-2">
            {/* Left Column for Task Description and Work Item Type */}
            <div>
              <Input disabled placeholder="Add MDX to NextJS" id="name"/>
              <Textarea className="mt-4" style={{minHeight:"50vh"}} minLength={7} id="username" placeholder="This can be a chat assistant refining.."/>
            </div>
            {/* Right Column for Accordions */}
            <div className="ml-6">
            <Label htmlFor="name" className="text-left">
                AI Roadmap
              </Label>
              <br/>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Step 1: jksdnkjsd</AccordionTrigger>
                  <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                    <Link href="/project"> Reference File: filename</Link>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Step 2: jksdnkjsd</AccordionTrigger>
                  <AccordionContent>
                    Yes. It comes with default styles that match the other components&apos; aesthetic.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Step 3: jksdnkjsd</AccordionTrigger>
                  <AccordionContent>
                    Yes. It&apos;s animated by default, but you can disable it if you prefer.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
        <SheetFooter>
        <div className="align-items-center mr-2 flex items-center space-x-2">
                <Switch id="airplane-mode" />
                <Label htmlFor="airplane-mode">Use AI Agent</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger><Icons.help size={"15"}/></TooltipTrigger>
                    <TooltipContent>
                      <div className="p-3">
                        <p>This task can be done by AI. <br/>
                          Toggle to use AI rather than matching project to developer.</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
          <SheetClose asChild>
            <Button type="submit">Submit</Button>
          </SheetClose>
        </SheetFooter>
      </ScrollArea>
    </SheetContent>
  </Sheet>
  )
}

  // Define selection options for branches
  const branchOptions = [
    { value: "ehst", text: "Feature" },
    { value: "cst6", text: "Bug" },
    { value: "csgt", text: "New Project" },
  ];