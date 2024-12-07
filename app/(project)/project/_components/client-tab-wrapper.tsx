"use client";

import React from "react";
import { Platform } from "@/schemas/content-interaction";
import { FaLinkedinIn, FaRedditAlien, FaXTwitter } from "react-icons/fa6";

import { useTabStore } from "@/hooks/use-tab-store";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ClientTabWrapper({ children }: { children: React.ReactNode }) {
  const { setActiveTab, activeTab } = useTabStore();

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        // console.log("Tab changed to:", value);
        setActiveTab(value as Platform);
      }}
      className="w-full"
    >
      <TabsList className="w-full">
        <TabsTrigger className="flex-1" value="TWITTER">
          <FaXTwitter className="mr-2 size-4" />
          <span>Twitter</span>
        </TabsTrigger>
        <TabsTrigger className="flex-1" value="LINKEDIN">
          <FaLinkedinIn className="mr-2 size-4" />
          <span>LinkedIn</span>
        </TabsTrigger>
        <TabsTrigger className="flex-1" value="REDDIT">
          <FaRedditAlien className="mr-2 size-4" />
          <span>Reddit</span>
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}
