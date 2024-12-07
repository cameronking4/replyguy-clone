"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deletePost } from "@/app/actions/post";

interface DeltePostModalProps {
  postId: string;
}

export function DeletePostModal({ postId }: DeltePostModalProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const deleteDbPost = async (postId: string) => {
    const result = await deletePost(postId);

    if (result.type === "error") {
      throw new Error(result.message);
    }

    return result.message;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: deleteDbPost,
    onSuccess: (data) => {
      toast.success(data);
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} className="size-fit p-2">
          <Trash2Icon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Delete Post</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between gap-5">
          <Button
            className="flex-1"
            variant={"outline"}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            variant={"destructive"}
            onClick={() => mutate(postId)}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
