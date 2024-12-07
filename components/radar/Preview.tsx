import { IconContainer } from "./IconContainer";
import { FaTwitter, FaLinkedin, FaReddit } from "react-icons/fa";
import { Radar } from "./Radar";

export const PreviewRadar = () => {
  return (
    <div className="relative flex h-96 w-full flex-col items-center justify-center space-y-4 overflow-hidden px-4">
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex w-full items-center justify-center space-x-10 md:space-x-0">
          <IconContainer
            text='"Top 10 tricks to monetize your directory"'
            delay={0.2}
            icon={<FaTwitter className="size-6 bg-accent/50" />}
          />
        </div>
      </div>
      <div className="mx-auto w-full max-w-md">
        <div className="flex w-full items-center justify-center space-x-10 md:justify-between md:space-x-0">
          <IconContainer
            text='"Any recommendations for social media automation tools?"'
            delay={0.5}
            icon={<FaLinkedin className="size-6 bg-accent/50" />}
          />
          <IconContainer
            text='"Launch your SaaS in days, not weeks, with my SaaS boilerplate"'
            delay={0.8}
            icon={<FaReddit className="size-6 bg-accent/50" />}
          />
        </div>
      </div>
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex w-full items-center justify-center space-x-10 md:justify-between md:space-x-0">
          <IconContainer
            text='"My favorite pet snuggy just arrived!"'
            delay={0.6}
            icon={<FaTwitter className="size-6 bg-accent/50" />}
          />
          <IconContainer
            text='"Which CRM are people using these days?"'
            delay={0.7}
            icon={<FaLinkedin className="size-6 bg-accent/50" />}
          />
        </div>
      </div>

      <Radar className="absolute -bottom-12" />
      <div className="absolute bottom-0 z-[41] h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
    </div>
  );
};

export default PreviewRadar;
