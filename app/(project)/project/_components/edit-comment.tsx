"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UpdateCommentRequest } from "@/schemas/content-interaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { Comment, Post } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { updateComment } from "@/app/actions/comment";

const CommentSchema = z.object({
  content: z.string().min(1, "Comment is required"),
});

type CommentRequest = z.infer<typeof CommentSchema>;

interface EditCommentProps {
  comment: Comment;
  post: Post;
}

const updatePostComment = async (payload: UpdateCommentRequest) => {
  const result = await updateComment(payload);

  if (result.type === "success") {
    return result.data;
  }

  throw new Error(result.message || "Failed to update comment");
};

export const EditComment = ({ comment, post }: EditCommentProps) => {
  const [open, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  const onOpenChange = () => setIsOpen((prev) => !prev);

  const form = useForm<CommentRequest>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      content: comment.content || "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updatePostComment,
    onSuccess(data, variables, context) {
      toast.success("Comment updated successfully");
      router.refresh();
      onOpenChange();
    },
    onError(error, variables, context) {
      toast.error("Failed to update comment. Please try again.");
    },
  });

  const onSubmit = async (data: CommentRequest) => {
    const payload = {
      content: data.content,
      id: comment.id,
      postId: comment.postId,
      userId: comment.userId,
    } satisfies UpdateCommentRequest;
    mutate(payload);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogTrigger>
        <Button variant={"outline"} size={"sm"}>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Comment</DialogTitle>
          <DialogDescription>
            Edit your comment and click save to update it or post to post it as
            a new comment.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little bit about yourself "
                        className="h-40 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="submit" size={"sm"} variant={"outline"}>
                  Post
                </Button>
                <Button
                  type="submit"
                  size={"sm"}
                  variant={"default"}
                  disabled={isPending}
                >
                  {isPending ? "Updating..." : "Update"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
