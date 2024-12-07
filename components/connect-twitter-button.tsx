"use client";

import { useRouter } from "next/navigation";
import { LinkIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { connectTwitterAccount } from "@/app/(dashboard)/dashboard/actions";

export function ConnectTwitterButton() {
  const router = useRouter();
  const onSubmit = async () => {
    const result = await connectTwitterAccount();
    if (result.type === "error") {
      toast.error(result.message);
    }
    // else {
    //   toast.success(result.message);
    //   router.push(result.data);
    // }
    if (result.data) {
      toast.success(result.message);
      router.push(result.data);
    }
  };

  return (
    <>
      <Button
        variant="default"
        className="inline-flex w-full items-center justify-center gap-2"
        size={"sm"}
        onClick={onSubmit}
      >
        <LinkIcon className="size-4" />
        Connect X
      </Button>
    </>
  );
}
