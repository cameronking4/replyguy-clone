import React from "react";
import { Button } from "@/components/ui/moving-border";

const CallToAction = ({ onClick }) => (
  <div
    className="mt-4 flex animate-fade-up justify-center space-x-2 opacity-0 md:space-x-4"
    style={{ animationDelay: "0.444s", animationFillMode: "forwards" }}
  >
    <Button
      onClick={onClick}
      borderRadius="1.75rem"
      className="border-neutral-200 bg-white text-black dark:border-slate-800 dark:bg-slate-900 dark:text-white"
    >
      Get started
    </Button>
  </div>
);

export default CallToAction;
