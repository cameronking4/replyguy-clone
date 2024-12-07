import React from "react";
import { BentoGrid } from "@/components/bentogrid";

const FeatureSection = () => (
  <section
    id="features"
    className="cols-2 container max-w-7xl flex-col space-y-6 py-4 dark:bg-transparent md:py-12 lg:py-24"
  >
    <div className="mt-24 mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
      <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
        Features
      </h2>
      <p className="max-w-2xl leading-normal text-muted-foreground sm:text-lg sm:leading-7">
        Leverage our low-cost automation tool to promote your business 24/7. BuzzDaddy will mention you naturally in recent & relevant posts.
      </p>
    </div>
    <BentoGrid />
  </section>
);

export default FeatureSection;
