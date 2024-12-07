import { Platform } from "@/schemas/content-interaction";
import { create } from "zustand";

interface TabStore {
  activeTab: Platform;
  setActiveTab: (tab: Platform) => void;
}

export const useTabStore = create<TabStore>((set) => ({
  activeTab: "TWITTER",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));

export const getActiveTab = () => {
  const activeTab = useTabStore.getState().activeTab;
  return activeTab;
};

export const setActiveTab = (tab: Platform) => {
  useTabStore.getState().setActiveTab(tab);
};
