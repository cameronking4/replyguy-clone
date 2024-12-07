"use client";

import { useRouter } from "next/navigation";
import { UnlinkIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { deleteLinkedin } from "@/app/(dashboard)/dashboard/actions";

export const DisconnectLinkedInAccount = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleClick = async () => {
    try {
      if (status === "unauthenticated" || !session?.user) {
        toast.error("You are not logged in");
        return;
      }
      const result = await deleteLinkedin(session.user.id);
      console.log(result);
      if (result.status === "success") {
        toast.success(result.message);
        router.refresh();
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error disconnecting LinkedIn account:", error);
      toast.error("Failed to disconnect LinkedIn account");
    }
  };

  return (
    <Button
      onClick={handleClick}
      className="inline-flex w-full items-center gap-2"
    >
      <UnlinkIcon className="size-4" />
      Disconnect
    </Button>
  );
};
