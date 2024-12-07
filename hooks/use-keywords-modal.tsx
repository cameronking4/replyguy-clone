import { create } from "zustand";

interface State {
  isOpen: boolean;
  campaignId: string | null;
  onOpen: (campaignId: string) => void;
  onClose: () => void;
  onChange: (open: boolean) => void;
}

export const useKeywordsModal = create<State>((set) => ({
  isOpen: false,
  campaignId: null,
  onOpen: (campaignId) => set({ isOpen: true, campaignId }),
  onClose: () => set({ isOpen: false, campaignId: null }),
  onChange: (open) => {
    if (!open) {
      set({ isOpen: false, campaignId: null });
    }
  },
}));
