import { RefreshCcwIcon, UnlinkIcon } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchTwitterProfile } from "@/app/(dashboard)/dashboard/actions";

export const TwitterCard = async ({
  userId,
  accessToken,
}: {
  userId: string;
  accessToken: string;
}) => {
  const twitterProfileData = await fetchTwitterProfile(
    userId,
    accessToken,
    false,
  );
  // console.log("Twitter Profile Data:", twitterProfileData);

  if (!twitterProfileData) {
    return <div>Loading user twitter profile....</div>;
  }

  const { message, type, data } = twitterProfileData;

  if (!data) {
    return (
      <Card className="rounded-2xl">
        <CardHeader className="rounded-t-2xl">
          <CardTitle className="flex items-start text-xl md:text-2xl">
            <FaXTwitter className="mr-2 size-8 md:mr-3 md:size-10" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>{message}</CardDescription>
        </CardContent>
        <CardFooter>
          <Button className="inline-flex w-full items-center gap-2">
            <RefreshCcwIcon className="size-4" />
            Retry Fetching Profile
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader className="rounded-t-2xl">
        <CardTitle className="flex items-start text-xl md:text-2xl">
          <FaXTwitter className="mr-2 size-8 md:mr-3 md:size-10" />
          <div className="flex flex-col">
            {data.name}
            <span className="text-base font-light text-neutral-500">
              @{data.username}
            </span>
          </div>
          <span>
            {data.verified && (
              <span className="text-blue-500">Verified Account</span>
            )}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          {data.description ? data.description : "No description"}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button className="inline-flex w-full items-center gap-2">
          <UnlinkIcon className="size-4" />
          Disconnect
        </Button>
      </CardFooter>
    </Card>
  );
};
