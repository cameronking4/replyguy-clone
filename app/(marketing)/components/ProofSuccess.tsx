import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { UGCText } from "@/components/ugc-text";
import Image from "next/image";

const images = [
  '/cases/1.png',
  '/cases/2.png',
  '/cases/3.png',
  '/cases/4.png'
];

const YoutubeSection = () => {
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
      id="howitworks"
      className="container hidden max-w-7xl bg-slate-50 py-4 dark:bg-transparent md:block"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        backgroundColor: "#09090b",
        gap: "1rem",
        ...gridPatternStyle,
      }}
    >
      <div className="flex flex-col overflow-hidden max-w-7xl">
        <ContainerScroll
          titleComponent={
            <>
              <UGCText />
              <h1 className="mt-8 text-3xl text-muted-foreground">
                People love our replies 😁 
              </h1>
            </>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {images.map((image, index) => (
              <div key={index} className="flex justify-center items-center">
                <img src={image} alt={`Screenshot ${index + 1}`} className="max-w-full h-auto rounded shadow-lg" />
              </div>
            ))}
          </div>
        </ContainerScroll>
      </div>
    </section>
  );
};

export default YoutubeSection;
