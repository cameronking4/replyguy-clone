"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { UserSubscriptionPlan } from "@/types";
import { PlusIcon } from "lucide-react";
import { User } from "next-auth";

import { pricingData } from "@/config/subscriptions";
import { useSigninModal } from "@/hooks/use-signin-modal";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { BillingFormButton } from "@/components/forms/billing-form-button";

interface SubscriptionModalProps {
  subscriptionPlan: UserSubscriptionPlan;
  user: User;
}

export function SubscriptionModal({
  subscriptionPlan,
  user,
}: SubscriptionModalProps) {
  const [open, setOpen] = React.useState(false);

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
          <DialogTitle>Subscribe to BuzzDaddy</DialogTitle>
          <DialogDescription>
            Subscribe to BuzzDaddy to get access to all of our features and
            start creating campaigns and get started.
          </DialogDescription>
        </DialogHeader>

        <PricingCards userId={user?.id} subscriptionPlan={subscriptionPlan} />
      </DialogContent>
    </Dialog>
  );
}

interface PricingCardsProps {
  userId?: string;
  subscriptionPlan?: UserSubscriptionPlan;
}

export function PricingCards({ userId, subscriptionPlan }: PricingCardsProps) {
  const isYearlyDefault =
    !subscriptionPlan?.interval || subscriptionPlan.interval === "year"
      ? true
      : false;
  const [isYearly, setIsYearly] = useState<boolean>(!!isYearlyDefault);
  const signInModal = useSigninModal();

  const toggleBilling = () => {
    setIsYearly(!isYearly);
  };

  return (
    <section className="container mt-5 flex flex-col items-center text-center">
      <div className="mb-4 flex items-center gap-5">
        <span>Monthly Billing</span>
        <Switch
          checked={isYearly}
          onCheckedChange={toggleBilling}
          role="switch"
          aria-label="switch-year"
        />
        <span>Annual Billing</span>
      </div>

      <div className="mx-auto grid max-w-screen-lg gap-5 bg-inherit py-5 md:grid-cols-2 lg:grid-cols-2">
        {pricingData.map((offer) => (
          <div
            className="relative flex flex-col overflow-hidden rounded-xl border"
            key={offer.title}
          >
            <div className="min-h-[150px] items-start space-y-4 bg-secondary/70 p-6">
              <p className="flex font-urban text-sm font-bold uppercase tracking-wider text-muted-foreground">
                {offer.title}
              </p>

              <div className="flex flex-row">
                <div className="flex items-end">
                  <div className="flex text-left text-3xl font-semibold leading-6">
                    {isYearly && offer.prices.monthly > 0 ? (
                      <>
                        <span className="mr-2 text-muted-foreground line-through">
                          ${offer.prices.monthly}
                        </span>
                        <span>${offer.prices.yearly / 12}</span>
                      </>
                    ) : (
                      `$${offer.prices.monthly}`
                    )}
                  </div>
                  <div className="-mb-1 ml-2 text-left text-sm font-medium">
                    <div>/mo</div>
                  </div>
                </div>
              </div>
              {offer.prices.monthly > 0 ? (
                <div className="text-left text-sm text-muted-foreground">
                  {isYearly
                    ? `$${offer.prices.yearly} will be charged when annual`
                    : "when charged monthly"}
                </div>
              ) : null}
            </div>

            <div className="flex h-full flex-col justify-between gap-16 p-6">
              <ul className="space-y-2 text-left text-sm font-medium leading-normal">
                <li className="flex items-center justify-center text-center text-muted-foreground">
                  <Link href="/pricing">view full details</Link>
                </li>
              </ul>

              {userId && subscriptionPlan ? (
                offer.title === "Starter" ? (
                  <Link
                    href="/dashboard"
                    className={buttonVariants({
                      className: "w-full",
                      variant: "default",
                    })}
                  >
                    Go to dashboard
                  </Link>
                ) : (
                  <BillingFormButton
                    year={isYearly}
                    offer={offer}
                    subscriptionPlan={subscriptionPlan}
                  />
                )
              ) : (
                <Button onClick={signInModal.onOpen}>Sign in</Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
