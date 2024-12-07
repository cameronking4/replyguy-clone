"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { PopoverProps } from "@radix-ui/react-popover";
import { PlusIcon, PuzzleIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Icons } from "@/components/shared/icons";

interface SelectState {
  id: string;
  name: string;
}

interface CampaignSelectorProps extends PopoverProps {
  defaultCampaignId: string;
  campaigns: SelectState[];
}

export function CampaignSelector({
  campaigns,
  defaultCampaignId,
  ...props
}: CampaignSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedCampaign, setSelectedCampaign] = React.useState<
    SelectState | undefined
  >(campaigns.find((campaign) => campaign.id === defaultCampaignId));
  const router = useRouter();

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label="Load a preset..."
          aria-expanded={open}
          className="flex-1 justify-between md:max-w-[200px] lg:max-w-[300px]"
        >
          {selectedCampaign ? (
            <div className="flex items-center">
              <Icons.campaign className="mr-2 size-4" /> {selectedCampaign.name}
            </div>
          ) : (
            "Load a campaign..."
          )}
          <CaretSortIcon className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search campaign..." />
          <CommandEmpty>No campaigns found.</CommandEmpty>
          <CommandGroup heading="Campaigns">
            {campaigns.map((campaign) => (
              <CommandItem
                key={campaign.id}
                onSelect={() => {
                  setSelectedCampaign(campaign);
                  setOpen(false);
                  router.push(`/project/explorer?id=${campaign.id}`);
                }}
              >
                {campaign.name}
                <CheckIcon
                  className={cn(
                    "ml-auto size-4",
                    selectedCampaign?.id === campaign.id
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup className="pt-0">
            <CommandItem
              onSelect={() => {
                router.push("/dashboard/campaigns");
              }}
              className="flex items-center bg-secondary"
            >
              <PlusIcon className="mr-2 size-4" />
              Add new campaign
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
