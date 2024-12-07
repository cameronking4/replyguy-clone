import React from "react";
import { useSigninModal } from "@/hooks/use-signin-modal";
import HeroSection from "./HeroSection";
import CallToAction from "./CallToAction";
import HowItWorksSection from "./HowItWorksSection";
import FeatureSection from "./FeatureSection";
import PricingSection from "./PricingSection";
import PreviewRadar from "@/components/radar/Preview";
import YoutubeSection from "./ProofSuccess";
import ThreeDComponent from "./3DDemo";
import MobileSection from "./MobileSection";

const MakerContent = () => {
  const signInModal = useSigninModal();
  return (
    <div className="min-h-[90vh]">
      <HeroSection signInModal={signInModal} />
      <CallToAction onClick={signInModal.onOpen} />
      <ThreeDComponent />
      <MobileSection />
      <YoutubeSection />
      <HowItWorksSection />
      <FeatureSection />
      <PricingSection />
      <PreviewRadar />
    </div>
  );
};

export default MakerContent;
