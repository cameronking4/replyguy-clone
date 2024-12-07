"use client";

import { useKeywordsModal } from "@/hooks/use-keywords-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { KeywordSelectForm } from "./keyword-select-form";

export function AddKeywordsModal() {
  const { isOpen, onChange, campaignId, onClose } = useKeywordsModal();

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="space-y-4 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Keyword Preferences Configuration</DialogTitle>
          <DialogDescription>
            Add keywords for your campaign to target specific audiences and
            finding relevant posts and comments.
          </DialogDescription>
        </DialogHeader>
        <KeywordSelectForm campaignId={campaignId} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
