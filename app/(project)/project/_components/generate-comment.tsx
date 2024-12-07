"use client";

import { useRouter } from "next/navigation";
import { Campaign, Post } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { BsRobot } from "react-icons/bs";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { generatePostComment } from "@/app/actions/ai";

interface GenerateCommentProps {
  post: Post;
  campaign: Campaign;
}

export const GenerateComment = ({ post, campaign }: GenerateCommentProps) => {
  const router = useRouter();

  const createNewComment = async () => {
    const result = await generatePostComment(post, campaign);

    if (result.type === "success") {
      return result.comment;
    }

    throw new Error("Failed to generate comment");
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createNewComment,
    onSuccess(data, variables, context) {
      console.log(data);
      toast.success("Comment generated successfully");
      router.refresh();
    },
    onError(error, variables, context) {
      console.error(error);
      toast.error("Failed to generate comment");
    },
  });

  return (
    <Button
      size={"sm"}
      className="w-fit"
      variant={"ghost"}
      disabled={isPending}
      onClick={() => mutate()}
    >
      <BsRobot className="mr-2 size-4" />
      Generate Reply
    </Button>
  );
};
