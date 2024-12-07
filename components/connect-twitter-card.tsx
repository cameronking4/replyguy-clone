import { FaXTwitter } from "react-icons/fa6";

import { ConnectTwitterButton } from "@/components/connect-twitter-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const ConnectTwitterCard = () => {
  return (
    <Card className="rounded-2xl">
      <CardHeader className={"rounded-t-2xl"}>
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          <FaXTwitter className="size-8 md:size-10" />
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        <CardDescription>
          Connect your X account to share your posts.
        </CardDescription>
      </CardContent>
      <CardFooter>
        <ConnectTwitterButton />
      </CardFooter>
    </Card>
  );
};
