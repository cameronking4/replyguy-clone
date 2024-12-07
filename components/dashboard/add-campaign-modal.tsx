"use client";

import * as React from "react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CreateCampaignRequest,
  createCampaignSchema,
} from "@/schemas/campaign";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useKeywordsModal } from "@/hooks/use-keywords-modal";
import useMediaQuery from "@/hooks/use-media-query";
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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createNewCampaign } from "@/app/actions";
import { generateAndSaveKeywords } from "@/app/actions/ai";

export function AddCampaignModal() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery().device === "desktop";

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <PlusIcon className="mr-2 size-4" />
            Add campaign
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add new campaign</DialogTitle>
            <DialogDescription>
              Provide info for BuzzDaddy scan social networks. BuzzDaddy uses
              this information to generate relevant key words to filter posts
              across social media.
            </DialogDescription>
          </DialogHeader>
          <AddCampaignForm
            onClose={() => {
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">+ Add campaign</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add New Project</DrawerTitle>
          <DrawerDescription>
            {" Make changes to your profile here. Click save when you're done."}
          </DrawerDescription>
        </DrawerHeader>
        <AddCampaignForm className={"px-4"} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface AddCampaignFormProps extends React.ComponentProps<"form"> {
  onClose?(): void;
}

function AddCampaignForm({ className, onClose }: AddCampaignFormProps) {
  const { data: session, status } = useSession();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { onOpen } = useKeywordsModal();

  const form = useForm<CreateCampaignRequest>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      userId: session?.user?.id,
      category: undefined,
      businessUrl: "",
      description: "",
      name: "",
    },
  });

  const onSubmit = async (data: CreateCampaignRequest) => {
    startTransition(async () => {
      const result = await createNewCampaign(data);

      if (result.type === "error") {
        console.error("Campaign creation failed:", result.message);
        toast.error(result.message);
        return;
      }

      if (result.type === "success" && result.data) {
        const res = await generateAndSaveKeywords(result.data);
        if (res.type === "error") {
          toast.error(res.message);
          return;
        }

        onClose?.();
        form.reset();
        router.refresh();
        onOpen(result.data.id);
        toast.success(result.message);
      }
    });
  };

  return (
    <Form {...form}>
      <form
        className={cn("mt-2 space-y-4", className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-50">
                  {["Business", "Individual"].map((group) => (
                    <SelectGroup key={group}>
                      <SelectLabel>{group}</SelectLabel>
                      {options
                        .filter((option) => option.group === group)
                        .map(({ value, text }) => (
                          <SelectItem key={value} value={value}>
                            {text}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="BuzzDaddy" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="businessUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business url</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://BuzzDaddy.com"
                  type="url"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="An AI-powered social media scraping tool to boost leads for business. Customers simply describe their business and BuzzDaddy AI agents promote it on their behalf with clever replies & posts across Twitter, LinkedIn & Reddit."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-6 w-full" disabled={isPending}>
          {/* Create Campaign */}
          {isPending ? "Creating..." : "Create Campaign"}
        </Button>
      </form>
    </Form>
  );
}

// Define selection options
const options = [
  { value: "SaaSStartup", text: "SaaS startup", group: "Business" },
  { value: "Agency", text: "Agency", group: "Business" },
  { value: "ECommerceStore", text: "E-commerce store", group: "Business" },
  { value: "Newsletter", text: "Newsletter", group: "Business" },
  { value: "Community", text: "Community", group: "Business" },
  { value: "PhysicalProduct", text: "Physical Product", group: "Business" },
  { value: "Freelancer", text: "Freelancer", group: "Individual" },
  { value: "ContentMaker", text: "Content maker", group: "Individual" },
  { value: "Artist", text: "Artist", group: "Individual" },
];
