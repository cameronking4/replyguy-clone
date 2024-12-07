import React from "react";
import { InfoLanding } from "@/components/info-landing";
import { infos } from "@/config/landing";  // Assuming infos is defined here

const MobileSection = () => {
  const gridPatternStyle = {
    backgroundImage: `
    linear-gradient(to top right, rgba(9,9,11,255) 37%, rgba(0,0,0,0) 100%),
    linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
    `,
    backgroundSize: "cover, 110px 60px, 70px 40px",
    backgroundBlendMode: "normal, normal, normal",
  };

  return (
    <section
      id="mobile"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        backgroundColor: "#09090b",
        gap: "1rem",
        ...gridPatternStyle,
      }}
      className="cols-1 container mt-16 block max-w-5xl flex-col space-y-6 py-4 dark:bg-transparent md:hidden md:py-12 lg:py-24"
    >
      {/* <InfoLanding data={infos[0]} reverse={true} /> */}
      <InfoLanding data={infos[0]} />
    </section>
  );
};

export default MobileSection;
