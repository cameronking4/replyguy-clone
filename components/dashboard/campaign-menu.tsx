"use client";

import { useRouter } from "next/navigation";
import { FaEllipsisVertical, FaTrash } from "react-icons/fa6";
import { toast } from "sonner";

import { useKeywordsModal } from "@/hooks/use-keywords-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteCampaign } from "@/app/actions";

import { AddKeywordsModal } from "./add-keywords-modal";
import { SlidersHorizontalIcon, SpeechIcon } from "lucide-react";

interface CampaignMenuProps {
  campaignId: string;
}

export const CampaignMenu = ({ campaignId }: CampaignMenuProps) => {
  const { onOpen } = useKeywordsModal();
  const router = useRouter();

  const handleDelete = async () => {
    const result = await deleteCampaign(campaignId);

    if (result.type === "error") {
      console.error(result.message);
      toast.error(result.message);
    } else {
      router.refresh();
      toast.success(result.message);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <FaEllipsisVertical className="size-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
          {/* <DropdownMenuSeparator /> */}
          <DropdownMenuItem onClick={() => onOpen(campaignId)}>
            <SlidersHorizontalIcon className="mr-2 size-4" />
            <span>Edit Keywords</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onOpen(campaignId)}>
            <SpeechIcon className="mr-2 size-4" />
            <span>Edit Tone & Voice</span>
          </DropdownMenuItem>
          <hr className="my-2" />
          <DropdownMenuItem onClick={handleDelete}>
            <FaTrash className="mr-2 size-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AddKeywordsModal />
    </>
  );
};
