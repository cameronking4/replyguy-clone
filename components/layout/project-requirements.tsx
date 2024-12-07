"use client"
import * as React from"react"
import { CaretSortIcon, ListBulletIcon } from"@radix-ui/react-icons"
import { ShieldAlertIcon, BellIcon } from"lucide-react";
import { Button } from"@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from"@/components/ui/collapsible"

export function ProjectRequirements() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <div className="flex items-center justify-between space-x-4">
      <ListBulletIcon />
            <div className="flex-1 space-y-1">
              <p className="text-lg font-medium leading-none">Client seeking your help on ~18hr of work
              </p>
              <p className="text-sm text-muted-foreground">
                {"Integrate Twilio SMS with my OpenAI Assistant API • $487.49"}
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
        <IntegrationSpec/>
      </CollapsibleContent>
    </Collapsible>
  )
}


const IntegrationSpec = () => {
  return (
    <div className="px-8 py-4">
      <div className="mb-4 rounded-lg border p-4">
        <h1 className="mb-4">Project Overview</h1>
        <p className="text-sm">The primary objective of this project is to integrate Twilio SMS functionalities into the existing OpenAI Assistant API housed within the Qashboard repository. The assistant currently interacts with financial data through Plaid. The integration with Twilio will expand its capabilities to communicate with users via SMS, enhancing user interaction and accessibility.</p>
      </div>

      <div className="mb-4 rounded-lg border p-4">
        <h2 className="mb-3">Requirements and Specifications</h2>
        <div className="mb-4 rounded-md border p-3">
          <h3 className="text-md mb-2">1. Twilio Account Setup</h3>
          <p className="mb-2 text-sm">Task: Create and configure a Twilio account if not already set up.</p>
          <p className="text-sm">Deliverable: Twilio account credentials (Account SID, Auth Token) and a Twilio phone number capable of sending and receiving SMS.</p>
        </div>

        <div className="mb-2 rounded-md border p-3">
          <h3 className="text-md mb-2">2. Environment Setup</h3>
          <p className="mb-2 text-sm">Task: Ensure the development environment is prepared for integration, including access to the Qashboard repository and necessary permissions to modify the OpenAI Assistant API. The Qashboard repository contains express routes to make requests and authenticate with Plaid.</p>
          <p className="text-sm">Deliverable: Documentation of the environment setup and dependencies required for the integration.</p>
        </div>

        {/* Repeat for each section as above, following the structured content provided earlier */}

      </div>

      <div className="rounded-lg border p-4">
        <h2 className="mb-3">Timeline and Milestones</h2>
        <div className="pl-4">
          <p className="mb-2 text-sm">- Milestone 1: Twilio Account Setup and Environment Preparation</p>
          <p className="mb-2 text-sm">- Milestone 2: API Modifications for SMS Sending and Receiving</p>
          <p className="text-sm">- Milestone 3: Documentation, Training, and Deployment</p>
        </div>
      </div>
    </div>
  );
};

export default IntegrationSpec;