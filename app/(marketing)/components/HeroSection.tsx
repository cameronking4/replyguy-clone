import React from "react";

const HeroSection = ({ signInModal }) => (
  <section className="space-y-8 pt-16">
    <div className="container flex max-w-5xl flex-col items-center gap-5 text-center">
      <h1
        className="animate-fade-up text-balance font-urban text-5xl font-extrabold tracking-tight opacity-0 sm:text-5xl md:text-6xl lg:text-7xl"
        style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
      >
        <span className="text-gradient_indigo-purple font-extrabold">Name-drop</span> your business across social media <span className="text-gradient_indigo-purple font-extrabold">24/7</span> with <span className="text-gradient_indigo-purple font-extrabold">BuzzDaddy</span> to boost sales
      </h1>
      <p
        className="mt-2 max-w-[45rem] animate-fade-up text-balance leading-normal text-gray-300 opacity-0 sm:text-xl sm:leading-8"
        style={{ animationDelay: "0.333s", animationFillMode: "forwards" }}
      >
        Meet your customizable bot that replies to public X, LinkedIn & Reddit posts on your behalf - generating organic buzz for your business.
      </p>
    </div>
  </section>
);

export default HeroSection;
