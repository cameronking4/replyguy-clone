"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreateKeywordRequest } from "@/schemas/campaign";
import { zodResolver } from "@hookform/resolvers/zod";
import { Keyword } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  createKeywords,
  deleteKeyword,
  getKeywordsByCampaign,
} from "@/app/actions";

const KeywordSchema = z.object({
  keyword: z.string().min(2, "Keyword must be at least 2 characters long"),
});

type KeywordFormData = z.infer<typeof KeywordSchema>;

const fetchKeywords = async (campaignId: string): Promise<Keyword[]> => {
  const result = await getKeywordsByCampaign(campaignId);

  if (result.type === "error" || !result.data) {
    console.error(result.message);
    throw new Error(result.message);
  }

  return result.data;
};

export function KeywordManagementModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [newKeywords, setNewKeywords] = useState<string[]>([]);

  const campaignId = searchParams.get("id") as string;
  const initialKeyword = searchParams.get("keywords") as string;

  const toggleDialog = () => setIsOpen(!isOpen);

  const { data, error, isLoading } = useQuery({
    queryKey: ["keywords", campaignId],
    queryFn: () => fetchKeywords(campaignId!),
    enabled: !!campaignId,
  });

  useEffect(() => {
    if (data) setKeywords(data);
  }, [data]);

  const form = useForm<KeywordFormData>({
    resolver: zodResolver(KeywordSchema),
    defaultValues: {
      keyword: initialKeyword ?? "",
    },
  });

  // const addKeyword = (keyword: string) => {
  //   const trimmedKeyword = keyword.trim();
  //   if (
  //     trimmedKeyword !== "" &&
  //     !keywords.some((kw) => kw.keyword === trimmedKeyword) &&
  //     !newKeywords.includes(trimmedKeyword)
  //   ) {
  //     setNewKeywords([...newKeywords, trimmedKeyword]);
  //     form.setValue("keyword", "");
  //   }
  // };

  const addKeyword = (keyword: string) => {
    const trimmedKeyword = keyword.trim();
    if (
      trimmedKeyword &&
      keywords.some((kw) => kw.keyword === trimmedKeyword)
    ) {
      form.setError("keyword", {
        type: "manual",
        message: "Keyword already exists",
      });
      return;
    }

    if (!newKeywords.includes(trimmedKeyword)) {
      setNewKeywords((prevKeywords) => [...prevKeywords, trimmedKeyword]);
      form.reset();
    }
  };

  const removeKeyword = async (index: number, fromDatabase: boolean) => {
    if (fromDatabase) {
      const keywordToRemove = keywords[index];

      setKeywords((prevKeywords) => prevKeywords.filter((_, i) => i !== index));

      if (keywordToRemove.id) {
        startTransition(async () => {
          const result = await deleteKeyword(keywordToRemove.id);
          result.type === "error"
            ? toast.error(result.message)
            : toast.success(result.message);
        });
      }
    } else {
      setNewKeywords((prevKeywords) =>
        prevKeywords.filter((_, i) => i !== index),
      );
    }
  };

  const handleFormSubmit = (data: KeywordFormData) => addKeyword(data.keyword);

  const saveKeywords = async () => {
    const payload = {
      campaignId,
      keywords: newKeywords,
    } satisfies CreateKeywordRequest;

    startTransition(async () => {
      const result = await createKeywords(payload);
      if (result.type === "error") {
        toast.error(result.message);
        return;
      }
      if (result.type === "success") {
        toggleDialog();
        router.refresh();
        toast.success(result.message);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggleDialog}>
      <DialogTrigger asChild>
        <Button variant="outline">Save Keyword</Button>
      </DialogTrigger>
      <DialogContent className="space-y-4 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Keyword Preferences Configuration</DialogTitle>
          <DialogDescription>
            Add keywords for your campaign to target specific audiences and
            finding relevant posts and comments.
          </DialogDescription>
        </DialogHeader>
        <>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="relative flex w-full items-center gap-2"
            >
              <FormField
                control={form.control}
                name="keyword"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder="Enter keywords preferences"
                        type="text"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <PlusIcon className="size-4" />
              </Button>
            </form>
          </Form>
          <div className="mt-4 flex flex-wrap gap-2">
            {isLoading ? (
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            ) : (
              <>
                {keywords.map((kw, index) => (
                  <Badge
                    key={kw.id}
                    variant={"secondary"}
                    className="flex w-fit items-center gap-2 rounded-lg"
                  >
                    {kw.keyword}
                    <Button
                      type="button"
                      variant="ghost"
                      className="p-0"
                      onClick={() => removeKeyword(index, true)}
                    >
                      <XIcon className="size-3" />
                    </Button>
                  </Badge>
                ))}
                {newKeywords.map((kw, index) => (
                  <Badge
                    key={index}
                    variant={"secondary"}
                    className="flex w-fit items-center gap-2 rounded-lg"
                  >
                    {kw}
                    <Button
                      type="button"
                      variant="ghost"
                      className="p-0"
                      onClick={() => removeKeyword(index, false)}
                    >
                      <XIcon className="size-3" />
                    </Button>
                  </Badge>
                ))}
              </>
            )}
          </div>
          <div className="mt-4 flex items-center justify-end">
            <Button type="button" onClick={saveKeywords}>
              {isPending ? "Saving Keywords..." : "Save Keywords"}
            </Button>
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
}
