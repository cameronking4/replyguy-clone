"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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

const KeywordSelectSchema = z.object({
  keyword: z.string().nonempty(),
});

type KeywordSelectRequest = z.infer<typeof KeywordSelectSchema>;

const fetchQueries = async (campaignId: string) => {
  const result = await getKeywordsByCampaign(campaignId);

  if (result.type === "error" || !result.data) {
    console.error(result.message);
    throw new Error(result.message);
  }

  const data = result.data;

  return data;
};

interface KeywordSelectFormProps {
  campaignId: string | null;
  onClose?: () => void;
}

export const KeywordSelectForm = ({
  campaignId,
  onClose,
}: KeywordSelectFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [newKeywords, setNewKeywords] = useState<string[]>([]);

  const { data, error, isLoading } = useQuery({
    queryKey: ["keywords", campaignId],
    queryFn: () => fetchQueries(campaignId!),
    enabled: !!campaignId,
  });

  useEffect(() => {
    if (data) {
      setKeywords(data);
    }
  }, [data]);

  const form = useForm<KeywordSelectRequest>({
    resolver: zodResolver(KeywordSelectSchema),
    defaultValues: {
      keyword: "",
    },
  });

  const addTag = (tag: string) => {
    if (
      tag.trim() !== "" &&
      !keywords.some((kw) => kw.keyword === tag.trim()) &&
      !newKeywords.includes(tag.trim())
    ) {
      setNewKeywords([...newKeywords, tag.trim()]);
      form.setValue("keyword", "");
    }
  };

  const removeTag = async (index: number, fromDatabase: boolean) => {
    if (fromDatabase) {
      const keywordToRemove = keywords[index];
      const newKeywordsList = [...keywords];
      newKeywordsList.splice(index, 1);
      setKeywords(newKeywordsList);

      // Call deleteKeyword function if the keyword was fetched from the database
      if (keywordToRemove.id) {
        startTransition(async () => {
          const result = await deleteKeyword(keywordToRemove.id);

          if (result.type === "error") {
            toast.error(result.message);
            return;
          }

          if (result.type === "success") {
            toast.success(result.message);
          }
        });
      }
    } else {
      const newKeywordsList = [...newKeywords];
      newKeywordsList.splice(index, 1);
      setNewKeywords(newKeywordsList);
    }
  };

  const onSubmit = async (data: KeywordSelectRequest) => {
    addTag(data.keyword);
  };

  const handleAddKeywords = async () => {
    const payload = {
      campaignId: campaignId!,
      keywords: newKeywords,
    } satisfies CreateKeywordRequest;

    startTransition(async () => {
      console.log("payload", payload);

      const result = await createKeywords(payload);

      console.log("result", result);

      if (result.type === "error") {
        toast.error(result.message);
        return;
      }
      if (result.type === "success") {
        onClose && onClose();
        router.refresh();
        toast.success(result.message);
      }
    });
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
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
                  onClick={() => removeTag(index, true)}
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
                  onClick={() => removeTag(index, false)}
                >
                  <XIcon className="size-3" />
                </Button>
              </Badge>
            ))}
          </>
        )}
      </div>
      <div className="mt-4 flex items-center justify-end">
        <Button type="button" onClick={handleAddKeywords}>
          {isPending ? "Saving Keywords..." : "Save Keywords"}
        </Button>
      </div>
    </>
  );
};
