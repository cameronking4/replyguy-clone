import { useState } from "react";
import { Check, ChevronsUpDown, Megaphone } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Campaign {
  id: string;
  name: string;
}

interface CampaignSelectorProps {
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  onSelectCampaign: (campaign: Campaign) => void;
}

export default function CampaignSelector({
  campaigns,
  selectedCampaign,
  onSelectCampaign,
}: CampaignSelectorProps) {
  const [open, setOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const onCampaignSelect = (campaign: Campaign) => {
    onSelectCampaign(campaign);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a campaign"
          className={cn("w-[250px] justify-between")}
        >
          <Megaphone className="mr-2 h-4 w-4" />
          {selectedCampaign?.name || "Select campaign"}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput
            placeholder="Search campaign..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>No campaign found.</CommandEmpty>
            <CommandGroup heading="Campaigns">
              {filteredCampaigns.map((campaign) => (
                <CommandItem
                  key={campaign.id}
                  onSelect={() => onCampaignSelect(campaign)}
                  className="text-sm"
                >
                  <Megaphone className="mr-2 h-4 w-4" />
                  {campaign.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedCampaign?.id === campaign.id
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
