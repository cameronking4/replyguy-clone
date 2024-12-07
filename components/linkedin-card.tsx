import { FaLinkedin } from "react-icons/fa";

import { getCurrentUser } from "@/lib/session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchOrCacheLinkedInProfile } from "@/app/(dashboard)/dashboard/actions";

import { DisconnectLinkedInAccount } from "./disconnect-linkedin-button";

export const LinkedInCard = async ({
  accessToken,
}: {
  accessToken: string;
}) => {
  const session = await getCurrentUser();

  if (!session) {
    return null;
  }

  const user = await fetchOrCacheLinkedInProfile(session.id, accessToken);

  if (!user) {
    return <div>Failed to load LinkedIn user data</div>;
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader className="rounded-t-2xl">
        <CardTitle className="flex items-start justify-between text-xl md:text-2xl">
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarImage
                src={
                  user.picture ??
                  "https://images.unsplash.com/photo-1623939012339-5b3dc8eca7c6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
                alt={user.name}
              />
              <AvatarFallback>BD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">{user.name}</div>
              <p className="text-sm font-light text-neutral-700 dark:text-neutral-300">
                {user.email}{" "}
                {user.email_verified && (
                  <span className="italic">(verified)</span>
                )}
              </p>
            </div>
          </div>
          <FaLinkedin className="mr-2 size-8 md:mr-3 md:size-10" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription></CardDescription>
      </CardContent>
      <CardFooter>
        <DisconnectLinkedInAccount />
      </CardFooter>
    </Card>
  );
};
