import React from "react";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldAlertIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { CollapsibleDemo } from "@/components/layout/collapsible-demo";

const ThreeDComponent = () => (
  <section
    className="hidden animate-fade-down md:block"
    style={{ animationDelay: "0.777s", animationFillMode: "forwards" }}
  >
    <CardContainer className="inter-var w-7xl">
      <CardBody className="group/card relative size-auto rounded-xl border border-black/[0.1] bg-gray-50 p-6 dark:border-white/[0.2] dark:bg-black dark:hover:shadow-2xl dark:hover:shadow-violet-400/[0.6]">
        <CardItem translateZ="85" className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <Link href="/project">
                  <CardTitle>BuzzDaddy</CardTitle>
                </Link>
                <CardDescription className="mt-2 max-w-3xl">
                  An advanced AI-agent made for social media growth-hacking that plugs your business in comments across social networks 24/7. Use our dedicated profiles to boost UGC related to your business.
                </CardDescription>
              </div>
              {/* Uncomment if you want to add dropdown */}
              {/* <div className="space-3 flex">
                <DropdownMenuDemo />
              </div> */}
            </div>
          </CardHeader>
        </CardItem>
        <CardContent>
          <CardItem translateZ="85" className="w-full">
            <div className="mb-4 flex items-center space-x-4 rounded-md border p-4">
              <ShieldAlertIcon />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Autopilot
                </p>
                <p className="text-sm">
                  Automatically find & reply to posts {" "}
                  {"(X, Linkedin, Reddit, TikTok)"}
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>
          </CardItem>
          <CardItem translateZ="100" className="w-full">
            <div className="mb-4 rounded-md border p-4">
              <CollapsibleDemo />
            </div>
          </CardItem>
        </CardContent>
      </CardBody>
    </CardContainer>
  </section>
);

export default ThreeDComponent;
