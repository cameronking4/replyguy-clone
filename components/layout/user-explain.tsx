"use client";
import * as React from "react"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
import { Icons } from "@/components/shared/icons"
import { cn } from "@/lib/utils";
import { CreateDropdownMenu } from "../layout/select-worktype";
import { SubmitButton } from "../project/submit-modal";
import { Card } from "../ui/card";
import Image from "next/image";
import { buttonVariants } from "../ui/button";
 
export function UserExplain() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Link
              href={"/"}
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "px-4")}
        >
          <p>Get started →</p>
        </Link>
      </SheetTrigger>
      <SheetContent side={'bottom'} className="px-16">
        <ScrollArea>
        <SheetHeader>
          <div className="space-between mt-2 flex justify-between px-5">
            <div>
            <SheetTitle>How it works</SheetTitle>
            <SheetDescription>
              {"Get your dev tasks done in 3 easy steps."}
            </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <div className="min-h-[60vh] px-16 py-8 ">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Step 1: Add your Github repo</AccordionTrigger>
            <AccordionContent>
              <div className="justify-space-between flex">
              <p className="text-lg">Connect your Github repo in the portal. Optionally, you can take extra security measures by locking (hiding) files. You can also annotate files to express workspace comments.</p>
              <Image width="800" height="600" alt="Step1" className="mx-4 rounded-xl shadow" src={"/images/user-step1.gif"}/>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Step 2: Create a job</AccordionTrigger>
            <AccordionContent>
              <div className="justify-space-between flex">
                <p className="text-lg"> You can create a new job using form or chat. We also support importing tickets from Notion & Github Issues. If you are starting completely from scratch, we have templates to jumpstart your job.</p>
                <Image width="800" height="600" alt="Step1" className="mx-4 rounded-xl shadow" src={"/images/user-step2.gif"}/>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Step 3: Review job & relax</AccordionTrigger>
            <AccordionContent>
              <div className="justify-space-between flex">
                <p className="text-lg">We enhance your job with supplementary product requirements using your repo and relevant documentation to ensure successful job completion. In addition to project mananagement, we match your job to the best developer - cutting out any need for interviews or overhead. <br/><br/> They will accept your job or you will be matched again. Prices will be pre-calculated, along with estimated time of work. An on-demand expert will complete the job and, once you accept, the work will be merged into your repo.
                </p>
                <Image width="800" height="600" alt="Step1" className="mx-4 rounded-xl shadow" src={"/images/user-step3.gif"}/>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        </div>
        <SheetFooter>
          <SheetClose asChild>
                Awesome, got it!
          </SheetClose>
        </SheetFooter>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

const cardsData = [
  {
    image: '../../public/images/gradient.png',
    title: 'Card Title 1',
    description: ['Bullet 1', 'Bullet 2', 'Bullet 3']
  },
  {
    image: '../../public/images/gradient.png',
    title: 'Card Title 2',
    description: ['Bullet 1', 'Bullet 2', 'Bullet 3']
  },
  {
    image: '../../public/images/gradient.png',
    title: 'Card Title 2',
    description: ['Bullet 1', 'Bullet 2', 'Bullet 3']
  },
  {
    image: '../../public/images/gradient.png',
    title: 'Card Title 2',
    description: ['Bullet 1', 'Bullet 2', 'Bullet 3']
  },
  {
    image: '../../public/images/gradient.png',
    title: 'Card Title 2',
    description: ['Bullet 1', 'Bullet 2', 'Bullet 3']
  },
  // Add more card objects as needed
];