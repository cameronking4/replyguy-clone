"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "./ui/hero-highlight";
import SparklesText from "./magicui/sparkles-text";

export function UGCText() {
  return (
    <HeroHighlight>
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="px-4 text-5xl font-bold max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
      >
        <span className="inline-block">
          <SparklesText text="User Generated Comments" />
        </span>{" "}
        generate{" "}
        <Highlight className="text-black dark:text-white">
          10x more leads
        </Highlight> than traditional advertisements.
      </motion.h1>
    </HeroHighlight>
  );
}
