import { LinkedinIcon } from "lucide-react";

import { ConnectLinkedInButton } from "@/components/connect-linkedin-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const ConnectLinkedInCard = () => {


  
  return (
    <Card className="rounded-2xl">
      <CardHeader className={"rounded-t-2xl"}>
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          <LinkedinIcon className="size-8 md:size-10" />
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        <CardDescription>
          Connect your LinkedIn account to share your posts.
        </CardDescription>
      </CardContent>
      <CardFooter>
        <ConnectLinkedInButton />
      </CardFooter>
    </Card>
  );
};
