"use client";

import React, { useState } from "react";
import TabButtons from "./components/TabButtons";
import MakerContent from "./components/MakerContent";

export default function IndexPage() {
  const [activeTab, setActiveTab] = useState("makers");

  return (
    <div>
      <div className="container mx-auto">
        <TabButtons activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="shadow-bg hidden md:block"></div>
        <div
          className={`transition-opacity duration-500 ${
            activeTab === "makers" ? "opacity-100" : "opacity-0"
          }`}
          style={{ animationFillMode: "forwards" }}
        >
          {activeTab === "makers" && <MakerContent />}
        </div>
      </div>
    </div>
  );
}
